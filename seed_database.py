"""Script to seed database."""
import os
import json
from random import choice, randint
import requests
from bs4 import BeautifulSoup
import urllib.request
import re
import string

import crud
from model import *
import server
from process_link import (handle_url, scrape_data)

os.system('dropdb lessons')
os.system('createdb lessons')
connect_to_db(server.app, echo=False)
db.create_all()


# Load lesson data from JSON file
with open('static/data/lessons.json') as f:
    lesson_data = json.loads(f.read())


# Create users, store them in list so we can assign fake lessons to them
PROFILE_PICS = ['https://t3.ftcdn.net/jpg/02/43/30/32/360_F_243303237_jRLK4CIIwClVcAET3OXB5BSNQRA1QZ0z.jpg',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQknVbr55-ORSi-V0btHeyH8PMMXu1LeRmRjJ6cwGrawmjWm3jWWglL9tAK4jiT1coUh7E&usqp=CAU',
                # https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE9aCijGWP8QsXdFVnLVOmYTLlTsU13Ij44g&usqp=CAU',
                # https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj_Z8ZjtiXW4QVMxjMXnTfdC-A0X2jaDqkaN2NA0gT6SIe5lhJWE2wthsFygYgxBfRRnU&usqp=CAU',
                'https://cdn2.vectorstock.com/i/thumb-large/95/61/default-placeholder-businesswoman-half-length-por-vector-20889561.jpg'
                ]
users_in_db = []
for n in range(3):
    handle = f'User{n}'
    email = f'user{n}@test.com'  # Voila! A unique email!
    password = 'test'
    profile_pic = PROFILE_PICS[n]

    # create a user here
    user = crud.create_user(handle, email, password, profile_pic)
    users_in_db.append(user)


# Load component data from JSON file
with open('static/data/components.json') as f:
    comp_data = json.loads(f.read())

# Create components, store them in list so we can use them
# to create fake lesson components later
comps_in_db = []
for c in comp_data:
    # create a component and append it to comps_in_db
    db_comp = crud.create_comp(c['type'], c['url'], c['imgUrl'], c['text'],
                               c['title'], c['source'], c['yt_id'], 
                               c['favicon'], c['description'])
    
    comps_in_db.append(db_comp)


# Create fake tags, store them in a list so we can assign them later...
tags_in_db = []
tags = {
    'early_grades': ['Pre-K', 'K', '1st', '2nd', '3rd'],
    'subjects': ['Math', 'Writing', 'Reading', 'Science', 'Social Studies', 
                'Foreign Lang.', 'Arts/Music', 'Comprehension', 'Other']
}

for category, tags in tags.items():
        for tag in tags:
            tag = crud.create_tag(tag, category)
            tags_in_db.append(tag)

for n in range(4, 13):
    tag = crud.create_tag(f'{n}th', 'grade')
    tags_in_db.append(tag)


# Create fake lessons, store them in a list so we can assign fake components...
lessons_in_db = []
for lesson in lesson_data:
    # choose an author at random
    user = choice(users_in_db)

    # create a lesson and append it to lessons_in_db
    lesson['author_id'] = user.user_id
    db_lesson = crud.create_lesson(lesson)
    lessons_in_db.append(db_lesson)

    # assign components to lessons by hard-coding
    if db_lesson.title == 'Wolves':
            crud.assign_comp(comps_in_db[0], db_lesson)
            crud.assign_comp(comps_in_db[1], db_lesson)
            tag = crud.get_tag_by_name('Science')
            crud.assign_tag_to_lesson(tag, db_lesson), 
            tag = crud.get_tag_by_name('4th')
            crud.assign_tag_to_lesson(tag, db_lesson)

    elif db_lesson.title == 'Multiplying fractions':
            crud.assign_comp(comps_in_db[3], db_lesson)
            crud.assign_comp(comps_in_db[4], db_lesson)
            tag = crud.get_tag_by_name('Math')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('4th')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('5th')
            crud.assign_tag_to_lesson(tag, db_lesson)

    elif db_lesson.title == 'Trophic cascades':
            crud.assign_comp(comps_in_db[0], db_lesson)
            crud.assign_comp(comps_in_db[1], db_lesson)
            crud.assign_comp(comps_in_db[2], db_lesson)
            tag = crud.get_tag_by_name('Science')
            crud.assign_tag_to_lesson(tag, db_lesson), 
            tag = crud.get_tag_by_name('Comprehension')
            crud.assign_tag_to_lesson(tag, db_lesson), 
            tag = crud.get_tag_by_name('Writing')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('5th')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('6th')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('7th')
            crud.assign_tag_to_lesson(tag, db_lesson)


    elif db_lesson.title == 'Call to action intro':
            crud.assign_comp(comps_in_db[5], db_lesson)
            crud.assign_comp(comps_in_db[6], db_lesson)
            crud.assign_comp(comps_in_db[7], db_lesson)
            crud.assign_comp(comps_in_db[8], db_lesson)
            crud.assign_comp(comps_in_db[0], db_lesson)
            tag = crud.get_tag_by_name('Writing')
            crud.assign_tag_to_lesson(tag, db_lesson), 
    
    elif db_lesson.title == 'Hoverboards and Superconductors':
            crud.assign_comp(comps_in_db[9], db_lesson)
            crud.assign_comp(comps_in_db[10], db_lesson)
            tag = crud.get_tag_by_name('Science')
            crud.assign_tag_to_lesson(tag, db_lesson), 
            tag = crud.get_tag_by_name('Writing')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('6th')
            crud.assign_tag_to_lesson(tag, db_lesson), 
    

# Commit to database 
db.session.commit()

    





