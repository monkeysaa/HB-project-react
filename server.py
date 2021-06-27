#!/usr/bin/env python3.6
"""Server for lessons app."""

import boto3
import bs4
import crud
import cloudinary.uploader
from flask import (
    Flask, render_template, request, flash, session, redirect, jsonify
)
# from jinja2 import StrictUndefined
from model import connect_to_db
import os 
import pprint
from process_link import (handle_url, scrape_data)

app = Flask(__name__)
app.secret_key = "SECRET!"

# API INFO
AWS_KEY = os.environ['AWS_ACCESS_KEY_ID']
AWS_SECRET_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
CLIENT = boto3.client('s3')
CLOUD_KEY = os.environ['CLOUDINARY_KEY']
CLOUD_SECRET = os.environ['CLOUDINARY_SECRET']
s3 = boto3.resource('s3')

# app.jinja_env.undefined = StrictUndefined

GRADES = ['Pre-K', 'K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th',
          '9th', '10th', '11th', '12th',]
SUBJECTS = ['Math', 'Writing', 'Reading', 'Science', 'Civics', 
            'Arts/Music', 'Foreign Lang', 'Reasoning',]

PROFILE_PLACEHOLDER = 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'
IMG_PLACEHOLDER = 'https://res.cloudinary.com/hackbright/image/upload/v1620009615/khdpxzlw0yedslc9jlkb.jpg'

# MVP:  
#     User login and authentication
#     Display all lessons in a user-lessons directory
#     Display a single lesson 
#     Create-lesson page, storing lesson and component data in DB
#     Edit lesson and components, storing lesson and component data in DB
#     Display search page
#     Process search function


# Basic REACT Routing
@app.route('/', defaults={'path': ""})
@app.route('/<path:path>')
def display_react(path):
    """Defer to React code on all routes."""

    if 'user_id' in session:
        return render_template('react.html', isLoggedIn=True)
    else:
        return render_template('react.html', isLoggedIn=False)


# USER Routes
# TODO: Allow users to set lessons to "private" so they aren't displayed here
# TODO: method in model.py for this
@app.route('/api/users')
def view_users():
    """Display a directory of users and links to each of their lessons."""

    users = []
    for user in crud.get_users():
        # PHIL: debug ? use 'logger' library
        print(user.user_id) 
        lessons = []
        # lessons = dictionary of each lesson
        for lesson in user.lessons:
            lessons.append(lesson.as_dict()) 
        user_lessons = user.as_dict()
        user_lessons['lessons'] = lessons
        if len(lessons) > 0:
            users.append(user_lessons)
    return {'users': users}


# TODO: Add password hashing for security
@app.route("/api/users", methods=["POST"])
def signup():
    """Enables user to save email, username/handle, and password to DB."""

    data = request.get_json()
    handle = data['handle']
    email = data['email']
    password = data['password']
    profile_pic = PROFILE_PLACEHOLDER

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

    return {'user': user_data, 'lessons': lesson_data}


@app.route("/api/users/user", methods=["POST"])
def update_profile_info():

    # Get user based on session data 
    user_id = session['user_id']
    user = crud.get_user_by_id(user_id)

    ### UPLOAD PHOTO TO CLOUDINARY AND ATTACH URL ###
    if 'profile-pic' in request.files:
        print('profile pic on back end')
        my_file = request.files['profile-pic']
        # PHIL: the indentation here is wonky. You want to either:
        # - move all args to their own lines and indent normally
        # - line up with the args on the previous line
        # - double-indent
        # - normal indent
        # what you have here is none of the above
        # NOTE: we picked the first one already and changed this
        result = cloudinary.uploader.upload(
            my_file,
            api_key=CLOUD_KEY, 
            api_secret=CLOUD_SECRET,
            cloud_name='hackbright'
        )
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
    # PHIL: catch a specific error
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

    print('Login attempt hit the back end')
    print(email, password)

    user = crud.get_user_by_email(email)
    try:
        if password == user.password:
            session['user_id'] = user.user_id
            session['isLoggedIn'] = True
            user_lessons = crud.get_lessons_by_user(user.user_id)
            print(user.user_id)
            print(session['user_id'])
            return {'success': True, 'username': user.handle}
            # later return JSON that includes both user and lesson info

    # PHIL: don't JSONify, let flask do it for you
    # because the longer you maintain it as metadata, the better
        else: 
            return jsonify(f'Wrong password. It should be: {user.password}.')
    except:
        return jsonify('No such user.')


# TODO: For now, this redirects to login page. In future, direct to landing search page or user directory. 
@app.route("/api/session")
def logout():
    """Log user out of session by clearing session cookies. """
    
    # PHIL:
    # 1. The code is a bit counter-intuitive in that an "exception" is
    # good. Instead, check `user_id in session`. In fact, you can even
    # use that in yoru return:
    #   return {'success': 'user_id' not in session}
    # 2. In the event you really did need a counter-intuitive test like this
    # leave a comment so people (you) know it's not a bug
    # 3. As the code stands now you return nothing if you failed to clear
    # the session instead of {'success': False} which the front-end could
    # handle nicely, instead the FE is just gonna crash horribly
    session.clear()
    if 'user_id' not in session:
        return {'success': True}
    else:
        return {'success': False}
        

# # LESSON ROUTES
# TODO: Do I need this? Delete? 
@app.route("/api/lessons")
def get_lessons_json():
    """Return a JSON response with all cards in DB."""

    lessons = crud.get_all_lessons()
    lessons_list = []

    for lesson in lessons:
        if lesson.imgUrl == None:
            lesson.imgUrl = IMG_PLACEHOLDER

        lessons_list.append(
            lesson.as_dict()
        )

    return {"lessons": lessons_list}


@app.route('/api/lessons', methods=["POST"])
def create_lesson():
    """Create new lesson and lesson-comp DB assocations."""

    ### SAVE LESSON TO DATABASE ###
    # Set up default lesson data dict
    #PHIL: why is this double-indented?
    lesson_data = {
        'title': 'Untitled', 
        'author_id': session['user_id'],
        'overview': '', 
        'imgUrl': None,
        'public': False,
    }

    ### UPLOAD PHOTO TO CLOUDINARY AND ATTACH URL ###
    if 'lesson-pic' not in request.files:
        # PHIL magic strings go in constants
        lesson_data['imgUrl'] = "/static/img/placeholder-img.png"
    else: 
        my_file = request.files['lesson-pic']
        # PHIL same indentation comment as before
        result = cloudinary.uploader.upload(my_file, api_key=CLOUD_KEY, 
                                        api_secret=CLOUD_SECRET,
                                        cloud_name='hackbright')
        lesson_data['imgUrl'] = result['secure_url']
    
    ### SAVE LESSON TO DATABASE ###
    # PHIL: DRY - loop over the vars you want and copy
    # them in so it's easier to add more later
    lesson_data['title'] = request.form['title']
    lesson_data['overview'] = request.form['overview']
    db_lesson = crud.create_lesson(lesson_data)

    ### CREATE DB ASSOCIATION BETWEEN TAGS AND LESSON ###
    if 'tags' in request.form and len(request.form['tags']) > 0:
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
    print(f'update_lesson[top]: lesson_id: {lesson_id}, lesson: {lesson}')

    # If photo, upload to CLoudinary and save to imgUrl
    if 'my-file' in request.files:
        my_file = request.files['my-file']
        # PHIL indentation
        result = cloudinary.uploader.upload(my_file, api_key=CLOUD_KEY, 
                                        api_secret=CLOUD_SECRET,
                                        cloud_name='hackbright') 
        imgUrl = crud.assign_lesson_img(result['secure_url'], lesson_id)
        print(f'after Cloudinary: {imgUrl}')

    # update database with other info 
    if 'title' in request.form: 
        crud.update_lesson_title(lesson_id, request.form['title'])
    if 'overview' in request.form:
        crud.update_lesson_overview(lesson_id, request.form['overview'])
    print(f'after updating lesson info, {lesson.as_dict()}')

    return {'success': True}


# # COMPONENT ENDPOINTS
@app.route('/api/components/')
def get_comps(lesson_id):
    """Return all components for a given lesson id"""
    # You're inconsistent on if you leave a blank line after your docstring
    # or not. be consistent
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
            # catch a specific exception
            except Exception as e: 
                print('Data scraping failed, but research is underway!', e)
                # TODO: Make empty dict & use .get on all 
                s_comp = {
                    'title': None, 
                    'source': None, 
                    'favicon': None, 
                    'descr': None,
                }
            
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

    elif ('comp-img' in request.files):
        print('comp-img exists')
        comp_pic = request.files['comp-img']
        print(f'received image: {comp_pic}')
        result = cloudinary.uploader.upload( comp_pic, api_key=CLOUD_KEY, 
            api_secret=CLOUD_SECRET, cloud_name='hackbright' )

        comp = {
            'type': 'img',
            'imgUrl': result['secure_url'],
        }
        print(f'just before db call, comp is {comp}')
    # TODO: get shortcut for this

    db_comp = crud.create_comp(
        c_type = comp.get('type', None), 
        url = comp.get('url', None), 
        imgUrl = comp.get('imgUrl', None), 
        text = comp.get('text', None), 
        title = comp.get('title', None), 
        yt_id = comp.get('yt_id', None), 
        source = comp.get('source', None), 
        favicon = comp.get('favicon', None), 
        description = comp.get('description', None),
    )
    
    # Return an HTTP 200 Okay response, with the data of the URL I created as the payload. 
    return {'success': True, 'comp': db_comp.as_dict()}


# # SEARCH ROUTES
@app.route('/api/search/<search_params>', methods=["POST"])
def run_search(search_params):
    """Search for lesson by term."""
    
    data = request.get_json()
    param = data['param']
    # searchtype = data['type']
    
    print(param)

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

    params = param.split()
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
        # PHIL: if anything went wrong at all, then ill is good?
        # seems suspect to me. If there's a great reason for it, then
        # there's a great reason for a comment
        except: 
            pass
    # else:
    #     print(param)
    #     user_queried = crud.get_user_by_username(param)
    #     print(user_queried)
    #     lessons = crud.get_lessons_by_user(user_queried.user_id)
    
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




if __name__ == '__main__':
    connect_to_db(app,echo=False)
    app.run(host='0.0.0.0', debug=True)