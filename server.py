"""Server for lessons app."""

from flask import Flask
from flask import (Flask, render_template, request, flash, session, redirect, jsonify)
from model import connect_to_db
from youtube import (is_YouTube_video, get_YouTube_ID, handle_YouTube)
import cloudinary.uploader
import crud
import boto3
import os 
import pprint

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
@app.route('/create_lesson')
@app.route('/login')
@app.route('/signup')
@app.route('/users')
@app.route('/profile')
@app.route('/lesson')
@app.route('/lessons')
@app.route('/')
def display_react():
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
# TODO: Is this ever used? 
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


# TODO: Is this necessary? 
@app.route('/api/users')
def view_users():

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


@app.route("/api/logout")
def logout():
    """Log user out of session by clearing session cookies. """
    
    session.clear()
    return {'success': True}


# # LESSON ROUTES
# # Details for one lesson
# # Later, limit route access to public lessons or author. Else redirect (to all public lessons? to search?)
@app.route("/api/lessons/<lesson_id>.json")
def get_lesson_json(lesson_id):
    """Get lesson and return lesson data and components in JSON."""
    
    lesson = crud.get_lesson_by_id(lesson_id)

    if lesson.imgUrl == None:
        lesson.imgUrl = 'https://res.cloudinary.com/hackbright/image/upload/v1620009615/khdpxzlw0yedslc9jlkb.jpg'
    
    lesson_data = []
    comp_data = lesson.comps

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
        lesson_data.append(
            {
                "component": comp.name,
                "c_link": comp.url,
                "c_img": comp.imgUrl,
            }
        )

    return {"lesson": lesson_data}


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

    lesson_data = {
            'title': 'Untitled', 
            'author_id': session['user_id'],
            'overview': '', 
            'img_Url': None,
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
    
    try: 
        return {'success': True, 'lesson_id': db_lesson.lesson_id}
    except: 
        print('Except something done broke')
        return {'success': False}

# One endpoint for Create Component 
@app.route('/api/create_component', methods=["POST"])
def create_component(): 
    """Create new component and save to DB."""

    # data = request.get_json()
    # comp_link = data.comp_link
    comp_link = 'www.youtube.com/watch?v=K1-nt5_bRlQ' #TODO: DELETE!!

    # Other YouTube functions needed?
    vid_data = handle_YouTube(comp_link)
    user_id = session['user_id']

    new_comp = crud.create_comp(name="Test", comp_type='link', url = vid_data['imgUrl'], imgUrl = vid_data['imgUrl'], )
    print(new_comp)
    return {'success': 'uncertain'}

# One endpoint for Add Component to Lesson
# def add_comp_to_lesson():

@app.route('/api/update_lesson', methods=["POST"])
def update_lesson():
    """Update the database with fresh data."""
    
    lesson_id = request.form['lesson_id']
    lesson = crud.get_lesson_by_id(lesson_id)

    # If photo, upload to CLoudinary and save link to imgUrl
    if 'my-file' in request.files:
        my_file = request.files['my-file']
        result = cloudinary.uploader.upload(my_file, api_key=CLOUD_KEY, 
                                        api_secret=CLOUD_SECRET,
                                        cloud_name='hackbright') 
        imgUrl = crud.assign_lesson_img(result['secure_url'], lesson_id)

    # update database with other info
    try: 
        if 'title' in request.form: 
            crud.update_lesson_title(lesson_id, request.form['title'])
        if 'overview' in request.form:
            crud.update_lesson_overview(lesson_id, request.form['overview'])
    
    # TODO: 
    # DECIDE! If new components passed, create_comp(), then build association -- here or there?

    except:
        print("Error with saving new Title and/or Overview to database.")
    
    return {'success': True}




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



# # SEARCH ROUTES
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