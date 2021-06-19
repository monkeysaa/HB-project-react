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


# USER Routes
# TODO: Allow users to set lessons to "private" so they aren't displayed here
# TODO: method in model.py for this
@app.route('/api/users')
def view_users():
    """Display a directory of users and links to each of their lessons."""

    users = []
    for user in crud.get_users():
        print(user.user_id)
        lessons = []
        for lesson in user.lessons:
            lessons.append(lesson.as_dict()) # lessons = dictionary of each lesson
        user_lessons = user.as_dict()
        user_lessons['lessons'] = lessons
        users.append(user_lessons)
    print(f'{users} from server.py /api/users endpoint')
    return {'users': users}


# TODO: Add password hashing for security
@app.route("/api/users", methods=["POST"])
def signup():

    data = request.get_json()
    handle = data['handle']
    email = data['email']
    password = data['password']
    # TODO: UPDATE TO USER PROFILE DEFAULT
    profile_pic = 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'

    try:
        db_user = crud.create_user(handle, email, password, profile_pic)
    except:
        flash('Email is already in use. Try again.')
        return {'success': False}

    session['user_id'] = db_user.user_id
    session['isLoggedIn'] = True

    return {'success': True}


@app.route("/api/users/user/")
def display_profile():
    """Display user profile. """

    user_id = session['user_id']
    u = crud.get_user_by_id(user_id)

    lesson_data = []
    for lesson in u.lessons:
        lesson_data.append(lesson.as_dict())

    user_data = u.as_dict()

    return jsonify({'user': user_data, 'lessons': lesson_data})


@app.route("/api/users/user", methods=["POST"])
def update_profile_info():

    # Get user based on session data 
    user_id = session['user_id']
    user = crud.get_user_by_id(user_id)

    ### UPLOAD PHOTO TO CLOUDINARY AND ATTACH URL ###
    print()
    print()
    print('LINE 11 of SERVER')
    if 'profile-pic' in request.files:
        print('profile pic on back end')
        my_file = request.files['profile-pic']
        result = cloudinary.uploader.upload(my_file, api_key=CLOUD_KEY, 
                                        api_secret=CLOUD_SECRET,
                                        cloud_name='hackbright')
        profile_pic = result['secure_url']
    
    ### UPDATE OTHER USER DATA ###

    # TODO: Check to make sure no other users have this email or username
    # TODO: Password verification system on front end and hashing/security
    # if request.form['username'] != '':
    #     user.handle = request.form['username']
    # if request.form['email'] != '':
    #     user.email = request.form['email']   
    # if request.form['password'] != '':
    #     user.handle = request.form['password']    


    # save to database
    try:
        response = crud.update_profile_pic(user_id, profile_pic) 
        if response == 'Success!':
            return {'success': True, 'user': user.as_dict()}
        # TODO: Later crud function(s) to update all/other user data

    except:
            flash('Error in database processing. Try again.')
            return {'success': False}



@app.route("/api/session", methods=["POST"])
def login():
    """Check session for user, else redirect guest search. """

    # JSON from request: {"email": "ali@gmail.com", "password": "test"}

    data = request.get_json()
    email = data['email']
    password = data['password']

    print('Hit the back end')
    print(email, password)

    user = crud.get_user_by_email(email)
    try:
        if password == user.password:
            session['user_id'] = user.user_id
            session['isLoggedIn'] = True
            user_lessons = crud.get_lessons_by_user(user.user_id)
            print(user.user_id)
            print(session['user_id'])
            return jsonify('success')
            # later return JSON that includes both user and lesson info
        else: 
            return jsonify(f'Wrong password. It should be: {user.password}.')
    except:
        return jsonify('No such user.')


# TODO: For now, this redirects to login page. In future, direct to landing search page or user directory. 
@app.route("/api/session")
def logout():
    """Log user out of session by clearing session cookies. """
    
    session.clear()
    try: 
        print(session['user_id'])
    except: 
        return {'success': True}


# # LESSON ROUTES
# TODO: Do I need this? Delete? 
@app.route("/api/lessons")
def get_lessons_json():
    """Return a JSON response with all cards in DB."""

    lessons = crud.get_all_lessons()
    lessons_list = []

    for lesson in lessons:
        if lesson.imgUrl == None:
            lesson.imgUrl = 'https://res.cloudinary.com/hackbright/image/upload/v1620009615/khdpxzlw0yedslc9jlkb.jpg'

        lessons_list.append(
            lesson.as_dict()
        )

    return {"lessons": lessons_list}


@app.route('/api/lessons', methods=["POST"])
def create_lesson():
    """Create new lesson and lesson-comp DB assocations."""

    ### SAVE LESSON TO DATABASE ###
    # Set up default lesson data dict
    lesson_data = {
            'title': 'Untitled', 
            'author_id': session['user_id'],
            'overview': '', 
            'imgUrl': None,
            'public': False,
    }

    ### UPLOAD PHOTO TO CLOUDINARY AND ATTACH URL ###
    if 'lesson-pic' not in request.files:
        lesson_data['imgUrl'] = "/static/img/placeholder.png"
    else: 
        my_file = request.files['lesson-pic']
        result = cloudinary.uploader.upload(my_file, api_key=CLOUD_KEY, 
                                        api_secret=CLOUD_SECRET,
                                        cloud_name='hackbright')
        lesson_data['imgUrl'] = result['secure_url']
    
    ### SAVE LESSON TO DATABASE ###
    lesson_data['title'] = request.form['title']
    lesson_data['overview'] = request.form['overview']
    db_lesson = crud.create_lesson(lesson_data)

    ### CREATE DB ASSOCIATION BETWEEN TAGS AND LESSON ###
    if 'tags' in request.form:
        tags = request.form['tags'].split(',') # eg. '6th,science'
        # Set up new tag
        for tag in tags:
            print(tag)
            if tag in SUBJECTS: 
                db_tag = crud.get_tag_by_name(tag)
            elif tag in GRADES: 
                db_tag = crud.get_tag_by_name(tag)
            crud.assign_tag_to_lesson(db_tag, db_lesson)

    ### CREATE DB ASSOCIATION BETWEEN COMPONENTS AND LESSON ###
    if request.form['component-ids']:
        component_ids = request.form['component-ids'].split(',') # e.g. '30,31'
        for comp_id in component_ids:
            db_comp = crud.get_comp_by_id(int(comp_id))
            crud.assign_comp(db_comp, db_lesson)
    
    try: 
        return {'success': True, 'lesson_id': db_lesson.lesson_id}
    except: 
        print('Except something done broke')
        return {'success': False}


# # TODO: limit route access to public lessons or author. Else redirect (to all public lessons? to search?)
@app.route("/api/lessons/<lesson_id>")
def show_single_lesson_json(lesson_id):
    """Get lesson and return lesson data and components in JSON."""
    
    lesson = crud.get_lesson_by_id(lesson_id)
    lesson_dict = lesson.as_dict()

    if not lesson_dict.get('imgUrl'):
        lesson_dict['imgUrl'] = '/static/img/unimpressed.jpg'
    
    comp_data = []

    for comp in lesson.comps:
        comp_data.append(comp.as_dict())

    return {"lesson": lesson_dict, "comps": comp_data}
    
# TODO: Hash IDs
# For now, /lessons/lesson_id
@app.route('/api/lessons/<lesson_id>', methods=["POST"])
def update_lesson(lesson_id):
    """Store lesson revisions to the database."""
    
    lesson_id = request.form['lesson_id']
    lesson = crud.get_lesson_by_id(lesson_id)
    print(f'290, {lesson_id}, {lesson}')

    # If photo, upload to CLoudinary and save to imgUrl
    if 'my-file' in request.files:
        my_file = request.files['my-file']
        result = cloudinary.uploader.upload(my_file, api_key=CLOUD_KEY, 
                                        api_secret=CLOUD_SECRET,
                                        cloud_name='hackbright') 
        imgUrl = crud.assign_lesson_img(result['secure_url'], lesson_id)
    print(f'299, {imgUrl}')
    # update database with other info 

    if 'title' in request.form: 
        crud.update_lesson_title(lesson_id, request.form['title'])
    if 'overview' in request.form:
        crud.update_lesson_overview(lesson_id, request.form['overview'])
    
    print(f'307, {lesson.as_dict()}')
    return {'success': True}


# # COMPONENT ENDPOINTS
@app.route('/api/components/')
def get_comps(lesson_id):
    """Return all components for a given lesson id"""
    comp_dict = {}

    lesson = crud.get_lesson_by_id(1)
    for comp in lesson.comps:
        comp_dict[comp.comp_id] = {}
        comp_dict[comp.comp_id]['id'] = comp.comp_id

    return jsonify([comp_dict])


@app.route('/api/components/', methods=["POST"])
def create_component(): 
    """Create new component and save to DB."""

    data = request.get_json()

    if data:
        if 'url' in data:
            url = data['url']

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

        else: # text
            text = data['text']
            comp = {
                'type': 'text',
                'text': text,
            }

    else: 
        comp_pic = request.files['comp-pic']
        # My server integrates Cloudinary's API
        result = cloudinary.uploader.upload( comp_pic, api_key=CLOUD_KEY, 
            api_secret=CLOUD_SECRET, cloud_name='hackbright' )

        comp = {
            'type': 'img',
            'imgUrl': result['secure_url'],
        }

    # TODO: get shortcut for this
    # Stored in a POSTGRES relational database. 
    # Rather 
    db_comp = crud.create_comp(
        c_type = comp.get('type', None), 
        url = comp.get('url', None), 
        imgUrl = comp.get('imgUrl', None), 
        text = comp.get('text', None), 
        title = comp.get('title', None), 
        yt_id = comp.get('yt_id', None), 
        source = comp.get('source', None), 
        favicon = comp.get('favicon', None), 
        description = comp.get('description', None))
    
    
    # Return an HTTP 200 Okay response, with the data of the URL I created as the payload. 
    return {'success': True, 'comp': db_comp.as_dict()}


# # SEARCH ROUTES
@app.route('/api/search/<search_params>', methods=["POST"])
def run_search(search_params):
    """Search for lesson by term."""
    
    data = request.get_json()
    param = data['param']
    searchtype = data['type']
    
    print(searchtype, param)

    # data = request.get_json()
    # term = data['searchString']
    # grade = data['grade']
    # subject = data['subject']
    # user_handle = data['user'] # search for lessons by userhandle
    # search_terms = {
    #     'term': term, 'grade': grade, 'subject': subject, 'user': user
    # }

    # for category in search_terms:
    #     if category:
    #         lessons = crud.process_lesson_search(terms[category], category)
    lesson_matches = set() # a set of Lesson objects

    if searchtype == 'searchstring': 
        params = param.split(' ')
        for param in params: 
            lessons = crud.get_lessons_by_term(param)
            print('lessons from string')
            for lesson in lessons:
                lesson_matches.add(lesson)
            
            # If user passes username as keyword
            try: 
                user_queried = crud.get_user_by_username(param)
                lessons = crud.get_lessons_by_user(user_queried.user_id)
                print('lessons from usersearch')

            except: 
                pass
    else:
        print(param)
        user_queried = crud.get_user_by_username(param)
        print(user_queried)
        lessons = crud.get_lessons_by_user(user_queried.user_id)
    
    for lesson in lessons:
        lesson_matches.add(lesson)

    lesson_data = []
    for lesson in lesson_matches: 
        lesson_data.append(lesson.as_dict())
    import pprint
    pprint.pprint(lesson_data)
    return {'success': True, 'lesson_data': lesson_data, 'search': params}
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