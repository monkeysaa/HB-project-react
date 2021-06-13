"""Server for lessons app."""

from flask import Flask
from flask import (Flask, render_template, request, flash, session, redirect, jsonify)
from model import connect_to_db
from process_link import (handle_url, scrape_data)
import cloudinary.uploader
import crud
import boto3
import os 
import pprint
import bs4

from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "SECRET!"

# API INFO
s3 = boto3.resource('s3')
CLIENT = boto3.client('s3')
CLOUD_KEY = os.environ['CLOUDINARY_KEY']
CLOUD_SECRET = os.environ['CLOUDINARY_SECRET']
AWS_KEY = os.environ['AWS_ACCESS_KEY_ID']
AWS_SECRET_KEY = os.environ['AWS_SECRET_ACCESS_KEY']

app.jinja_env.undefined = StrictUndefined

GRADES = ['Pre-K', 'K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th',
          '9th', '10th', '11th', '12th']
SUBJECTS = ['Math', 'Writing', 'Reading', 'Science', 'Social Studies', 
            'Arts/Music', 'Foreign Lang.']

# Basic REACT Routing
# TODO: catch-all to set this up as the default
@app.route('/', defaults={'path': ""})
@app.route('/<path:path>')
def display_react(path):
    """Defer to React code on all routes."""

    try: 
        if session['user_id']:
            return render_template('react.html', isLoggedIn=True)
    except:
        return render_template('react.html', isLoggedIn=False)


@app.route('/lesson/<lesson_id>')
@app.route('/lesson/<lesson_id>/edit')
def display_lessons(lesson_id):
    """Defer to React code on all routes."""

    try: 
        if session['user_id']:
            return render_template('react.html', isLoggedIn=True)
    except:
        return render_template('react.html', isLoggedIn=False)


# USER Routes

# TODO: Is this necessary? If not, delete
@app.route('/api/check-login-status')
def check_login():
    """Check if user is logged in."""

    try: 
        if session['isLoggedIn'] == True:
            return jsonify('Logged in')
        elif session['isLoggedIn'] == False:
            return jsonify('Not logged in')
    except:
        return jsonify('Error with check-login.json')


# TODO: Allow users to set lessons to "private" so they aren't displayed here
@app.route('/api/users')
def view_users():
    """Display a directory of users and links to each of their lessons."""

    users = []
    for u in crud.get_users():
        lessons = []
        for lesson in u.lessons:
            lesson.__dict__.pop('_sa_instance_state', None)
            lessons.append(lesson.__dict__)
        u.__dict__.pop('_sa_instance_state', None)
        u.__dict__['lessons'] = lessons
        users.append(u.__dict__)

    return jsonify(users)


@app.route("/api/profile.json")
def display_profile():
    """Display user profile. """

    u = crud.get_user_by_id(session['user_id'])
    lessons_data = []

    for lesson in u.lessons:
        lesson.__dict__.pop('_sa_instance_state', None)
        lessons_data.append(lesson.__dict__)

    user_data = {
            "user_id": u.user_id,
            "username": u.handle,
            "email": u.email,
            "lessons": lessons_data
    }

    return jsonify({'user': user_data})


@app.route("/api/signup", methods=["POST"])
def signup():

    data = request.get_json()
    handle = data['handle']
    email = data['email']
    password = data['password']

    try:
        user = crud.create_user(handle, email, password)
    except:
        flash('Email is already in use. Try again.')
        return {'success': False}

    session['user_id'] = user.user_id
    session['isLoggedIn'] = True

    return {'success': True}


@app.route("/api/login", methods=["POST"])
def login():
    """Check session for user, else redirect guest search. """

    # JSON from request: {"email": "ali@gmail.com", "password": "test"}

    data = request.get_json()
    email = data['email']
    password = data['password']

    user = crud.get_user_by_email(email)
    try:
        if password == user.password:
            session['user_id'] = user.user_id
            session['isLoggedIn'] = True
            user_lessons = crud.get_lessons_by_user(user.user_id)
            return jsonify('success')
            # later return JSON that includes both user and lesson info
        else: 
            return jsonify(f'Wrong password. It should be: {user.password}.')
    except:
        return jsonify('No such user.')


# TODO: For now, this redirects to login page. In future, direct to landing search page or user directory. 
@app.route("/api/logout")
def logout():
    """Log user out of session by clearing session cookies. """
    
    session.clear()
    return {'success': True}


# # LESSON ROUTES
# # TODO: limit route access to public lessons or author. Else redirect (to all public lessons? to search?)
@app.route("/api/lessons/<lesson_id>.json")
def show_single_lesson_json(lesson_id):
    """Get lesson and return lesson data and components in JSON."""
    
    lesson = crud.get_lesson_by_id(lesson_id)

    if lesson.imgUrl == None:
        lesson.imgUrl = '/static/img/unimpressed.jpg'
    
    lesson_data = []
    comp_data = []

    # Add lesson description, etc
    lesson_data.append(
        {
            "lesson_id": lesson.lesson_id,
            "title": lesson.title,
            "author": lesson.author.email,
            "imgUrl": lesson.imgUrl,
            "overview": lesson.overview
        }
    )

    for comp in lesson.comps:
        comp_data.append(
            {
                "id": comp.comp_id,
                "type": comp.comp_type,
                "url": comp.url,
                "img": comp.imgUrl,
                "text": comp.text,
                "title": comp.title,
                "source": comp.source,
                "favicon": comp.favicon,
                "description": comp.description
            }
        )

    return {"lesson": lesson_data, "comps": comp_data}


# TODO: Do I need this? Delete? 
@app.route("/api/lessons.json")
def get_lessons_json():
    """Return a JSON response with all cards in DB."""

    lessons = crud.get_all_lessons()
    lessons_list = []

    for lesson in lessons:
        if lesson.imgUrl == None:
            lesson.imgUrl = 'https://res.cloudinary.com/hackbright/image/upload/v1620009615/khdpxzlw0yedslc9jlkb.jpg'

        lessons_list.append(
            {
                "lesson_id": lesson.lesson_id,
                "title": lesson.title,
                "author": lesson.author.email,
                "imgUrl": lesson.imgUrl,
            }
        )

    return {"lessons": lessons_list}
    

@app.route('/api/create_lesson', methods=["POST"])
def create_lesson():
    """Create new lesson and lesson-comp DB assocations."""

    # Default lesson data, in case users don't include all info
    lesson_data = {
            'title': 'Untitled', 
            'author_id': session['user_id'],
            'overview': '', 
            'imgUrl': None,
            'public': False
    }

    # If photo, upload to CLoudinary and save link to lesson_data
    if 'lesson-pic' not in request.files:
        lesson_data['imgUrl'] = "/static/img/placeholder.png"
    else: 
        my_file = request.files['lesson-pic']
        result = cloudinary.uploader.upload(my_file, api_key=CLOUD_KEY, 
                                        api_secret=CLOUD_SECRET,
                                        cloud_name='hackbright')
        lesson_data['imgUrl'] = result['secure_url']
    
    # if title and overview, save them to lesson_data
    if request.form['title'] != '':
        lesson_data['title'] = request.form['title']
    if request.form['overview'] != '':
        lesson_data['overview'] = request.form['overview']

    db_lesson = crud.create_lesson(lesson_data)

    # TODO: For each component, create DB association.
    # Set up as [] as default...but perhaps it's a string? 
    if request.form['component-ids']:
        comp_data = request.form['component-ids'] # str e.g. '30,31,32'
        component_ids = comp_data.split(',')
        for comp_id in component_ids:
            db_comp = crud.get_comp_by_id(int(comp_id))
            crud.assign_comp(db_comp, db_lesson)
    
    try: 
        return {'success': True, 'lesson_id': db_lesson.lesson_id}
    except: 
        print('Except something done broke')
        return {'success': False}


# # COMPONENT ENDPOINTS
@app.route('/api/get_comps/<lesson_id>')
def get_comps(lesson_id):
    """Return all components for a given lesson id"""
    comp_dict = {}

    lesson = crud.get_lesson_by_id(1)
    for comp in lesson.comps:
        comp_dict[comp.comp_id] = {}
        comp_dict[comp.comp_id]['id'] = comp.comp_id

    return jsonify([comp_dict])

@app.route('/api/create_component/', methods=["POST"])
def create_component(): 
    """Create new component and save to DB."""

    url = request.json.get('url') # sets URL to none if it doesn't exist
    img = request.json.get('img') # sets URL to none if it doesn't exist
    text = request.json.get('text') # sets URL to none if it doesn't exist
    print('Moment of truth: Does TEXT exit?')
    print(text)
    if url:
        v_comp = handle_url(url) #Adds / Updates attributes if YouTube video
        
        # TODO: Data scraping algorithms need work
        try:    
            s_comp = scrape_data(url) 
        except Exception as e: 
            print('Data scraping failed, but research is underway!', e)
            # TODO: Make empty dict & use .get on all 
            s_comp = {'title': None, 'source': None, 'favicon': None, 'descr': None}
        comp = {
            'type': v_comp['type'],
            'url': v_comp['url'],
            'imgUrl': v_comp['imgUrl'],
            'title': s_comp['title'],
            'yt_id': v_comp['yt_id'],
            'source': s_comp['source'],
            'favicon': s_comp['favicon'],
            'description': s_comp['descr'],
        }

    elif img:
        img = request.files['comp-pic']
        result = cloudinary.uploader.upload( my_file, api_key=CLOUD_KEY, 
            api_secret=CLOUD_SECRET, cloud_name='hackbright' )

        comp = {
            'type': 'img',
            'imgUrl': result['secure_url'],
        }
    
    else: # text 

        comp = {
            'type': 'text',
            'text': text,
        }


    # TODO: get shortcut for this
    db_comp = crud.create_comp(
        c_type = comp.get('type'), 
        url = comp.get('url'), 
        imgUrl = comp.get('imgUrl'), 
        text = comp.get('text'), 
        title = comp.get('title'), 
        yt_id = comp.get('yt_id'), 
        source = comp.get('source'), 
        favicon = comp.get('favicon'), 
        description = comp.get('description'))
    
    
    print(db_comp.as_dict())
    return {'success': True, 'comp': db_comp.as_dict()}


# Endpoint to link Component to Lesson
# def link_comp_to_lesson():

@app.route('/api/update_lesson', methods=["POST"])
def update_lesson():
    """Update the database with fresh data."""
    
    lesson_id = request.form['lesson_id']
    lesson = crud.get_lesson_by_id(lesson_id)

    # If photo, upload to CLoudinary and save to imgUrl
    if 'my-file' in request.files:
        my_file = request.files['my-file']
        result = cloudinary.uploader.upload(my_file, api_key=CLOUD_KEY, 
                                        api_secret=CLOUD_SECRET,
                                        cloud_name='hackbright') 
        imgUrl = crud.assign_lesson_img(result['secure_url'], lesson_id)

    # update database with other info 
    if 'title' in request.form: 
        crud.update_lesson_title(lesson_id, request.form['title'])
    if 'overview' in request.form:
        crud.update_lesson_overview(lesson_id, request.form['overview'])

    return {'success': True}

# # SEARCH ROUTES
@app.route('/api/search/<searchstring>.json')
def run_search(searchstring):
    """Search for lesson by term."""

    print('WE HAVE ARRIVED HERE')
    
    print(searchstring)
    lesson_matches = set() # a set of Lesson objects
    lesson_data = []

    # data = request.get_json()
    # term = data['searchString']
    # print(term)
    # grade = data['grade']
    # subject = data['subject']
    # user_handle = data['user'] # search for lessons by userhandle
    # search_terms = {
    #     'term': term, 'grade': grade, 'subject': subject, 'user': user
    # }

    # for category in search_terms:
    #     if category:
    #         lessons = crud.process_lesson_search(terms[category], category)
    lessons = crud.get_lessons_by_term(searchstring)
    if lessons == []:
        user_queried = crud.get_user_by_username(searchstring)
        lessons = crud.get_lessons_by_user(user_queried.user_id)
    for lesson in lessons:
        lesson_matches.add(lesson)

    for lesson in lesson_matches: 
        lesson_data.append({
            'id': lesson.lesson_id,
            'title': lesson.title,
            'author': lesson.author.handle,
            # 'tags': lesson.tags,
            'imgUrl': lesson.imgUrl
        })
    return {'success': True, 'lesson_data': lesson_data}
    # return {'search_terms': search_terms, 'lesson_data': lesson_data}



# @app.route('/search', methods=['GET'])
# def display_search_results():
#     """Search for lesson by term."""
    
#     lesson_matches = set()
#     term = request.args.get('term')
#     grade = request.args.get('grade')
#     subject = request.args.get('subject')
#     user = (request.args.get('user'))
#     terms = {term: 'term', grade: 'grade', subject: 'subject', user: 'user'}

#     for category in terms:
#         if category:
#             lessons = crud.process_lesson_search(terms[category], category)
#             for lesson in lessons:
#                 lesson_matches.add(lesson)

#     return render_template('search.html', term=term, lessons=lessons)




# DEFUNCT JINJA ROUTES
# View all users link in Nav. Later, remove this route.
# @app.route('/users')
# def all_users():
#     """View all users."""
    
#     users = crud.get_users()
#     return render_template('all_users.html', users=users)


# Direct here from search for lesson by author? 
# Or remove this route and use JS for dynamic display? 
# @app.route('/users/<user_id>')
# def show_public_lessons(user_id):
#     """View all public lessons by a user"""
#     user = crud.get_user_by_id(user_id)
#     pub_lessons = crud.get_public_lessons(user.user_id)

#     return render_template('user_profile.html', user=user, lessons=pub_lessons)


# ROUTES NEEDED
#     """View all lessons."""
#     """Display a single lesson in React"""
#     """Edit existing lesson page"""
#     """Process edit_lesson function"""
#     """Display search page"""
#     """Process search function"""





# Sign up & Login for new users, from Homepage
# @app.route('/signup', methods=['POST'])
# def register_user():
#     """Create and log in a new user."""

#     email = request.form.get('email')
#     password = request.form.get('password')
    
#     # Check if user email is already in the database
#     user = crud.get_user_by_email(email)
#     try:
#         user = crud.create_user(handle, email, password)
#     except:
#         flash('Email is already in use. Try again.')
#         return redirect('/')

#     session['user_id'] = user.user_id

#     # return render_template('user_profile.html', user=user, lessons=[])
#     # ONCE PROFILE, REDIRECT TO THERE
#     return redirect('/')


# # # Homepage login form
# @app.route('/login', methods=['POST'])
# def verify_user():
#     """Authenticate user and display profile page"""

#     email = request.form.get('email')
#     password = request.form.get('password')

#     try: 
#         user = crud.get_user_by_email(email)
        
#         if password == user.password:
#             session['user_id'] = user.user_id
#             #flash(f"User {session['user_id']} logged in!")
#             user_lessons = crud.get_lessons_by_user(user.user_id)
#             # return render_template('user_profile.html', user=user, lessons=user_lessons)
#             # ONCE PROFILE, REDIRECT TO THERE
#             return redirect('/')

#         else:
#             flash(f"Wrong password. It should be: {user.password}.")
#             return redirect('/')

#     except:
#         flash("Email not in our system. Try again.")
#         return redirect('/')










# @app.route('/component', methods=['POST'])
# def create_component():
#     """Add component to Lessons in the db and display via Cloudinary."""

#     my_file = request.files['my-file'] # note: request arg should match name var on form
    
#     #Upload to Cloudinary
#     # result = cloudinary.uploader.upload(my_file, api_key=CLOUD_KEY, 
#     #                                     api_secret=CLOUD_SECRET,
#     #                                     cloud_name='hackbright')

#     result = CLIENT.upload_file('my_file', 'hackbright-project', 'pdf')
    
#     #Create component
#     component = crud.create_comp('pdf', 'pdf')
#     session['comp_id'] = component.comp_id
#     # component.url = result['secure_url']

#     #Attach to lesson
#     lesson = crud.get_lesson_by_id(session['lesson_id'])
#     crud.assign_comp(component, lesson)
#     # run a crud function that saves this url to the database and returns it. 

#     # work out display, e.g. <img src="{{ user.profile_url }}">
#     return redirect(f'/lessons/{lesson.lesson_id}')


if __name__ == '__main__':
    connect_to_db(app,echo=False)
    app.run(host='0.0.0.0', debug=True)