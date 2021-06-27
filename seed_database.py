#!/usr/bin/env python3.6
"""Script to seed database."""

# PHIL: alphebatize
from bs4 import BeautifulSoup
import crud
import json
from model import *
import os
from process_link import (handle_url, scrape_data)
from random import choice, randint
import re
import requests
import server
import string
import urllib.request


# PHIL: os.system is dangerous, use Subprocess module
# or at the very lease use Popen()
os.system('dropdb lessons')
os.system('createdb lessons')
connect_to_db(server.app, echo=False)
db.create_all()


# Load lesson data from JSON file
with open('static/data/lessons.json') as f:
    lesson_data = json.loads(f.read())

# Create users, store them in list so we can assign fake lessons to them
#PHIL: style: if closing bracket gets its own line, so does opening one
PROFILE_PICS = [
    'https://t3.ftcdn.net/jpg/02/43/30/32/360_F_243303237_jRLK4CIIwClVcAET3OXB5BSNQRA1QZ0z.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQknVbr55-ORSi-V0btHeyH8PMMXu1LeRmRjJ6cwGrawmjWm3jWWglL9tAK4jiT1coUh7E&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE9aCijGWP8QsXdFVnLVOmYTLlTsU13Ij44g&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj_Z8ZjtiXW4QVMxjMXnTfdC-A0X2jaDqkaN2NA0gT6SIe5lhJWE2wthsFygYgxBfRRnU&usqp=CAU',
    'https://cdn2.vectorstock.com/i/thumb-large/95/61/default-placeholder-businesswoman-half-length-por-vector-20889561.jpg',
]
users_in_db = []

#PHIL: ditto
PROFILE_NAMES = [
    'ali',
    'Mr.T',
    'Ms.Jackson',
    'Mx.Roboto',
    'Ms.Molly',
]

# import pdb
# pdb.set_trace()

for n in range(5):
    handle = PROFILE_NAMES[n]
    # Voila! A unique email!
    email = f'{handle}@email.com'  
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
    db_comp = crud.create_comp(
        c['type'], 
        c['url'], 
        c['imgUrl'], 
        c['text'],
        c['title'], 
        c['source'], 
        c['yt_id'], 
        c['favicon'], 
        c['description'],
    )
    comps_in_db.append(db_comp)


# Create fake tags, store them in a list so we can assign them later...
tags_in_db = []
tags = {
    'grade': ['Pre-K', 'K', '1st', '2nd', '3rd'],
    'subject': ['Math', 'Writing', 'Reading', 'Science', 'Civics', 
                'Languages', 'Arts/Music', 'Reasoning', 'Environment']
}

# PHIL: doubleindentationsadness
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

    # assign components to lessons by hard-coded assignment
    if db_lesson.title == 'Wolves':
            crud.assign_comp(comps_in_db[0], db_lesson)
            crud.assign_comp(comps_in_db[1], db_lesson)
            tag = crud.get_tag_by_name('Science')
            crud.assign_tag_to_lesson(tag, db_lesson) 
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
            crud.assign_tag_to_lesson(tag, db_lesson) 
            tag = crud.get_tag_by_name('Reasoning')
            crud.assign_tag_to_lesson(tag, db_lesson) 
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
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('Reasoning')
            crud.assign_tag_to_lesson(tag, db_lesson) 
            tag = crud.get_tag_by_name('Civics')
            crud.assign_tag_to_lesson(tag, db_lesson)  
    
    elif db_lesson.title == 'Hoverboards and Superconductors':
            crud.assign_comp(comps_in_db[9], db_lesson)
            crud.assign_comp(comps_in_db[10], db_lesson)
            tag = crud.get_tag_by_name('Science')
            crud.assign_tag_to_lesson(tag, db_lesson) 
            tag = crud.get_tag_by_name('Writing')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('6th')
            crud.assign_tag_to_lesson(tag, db_lesson) 
    
    elif db_lesson.title == 'History of Tree Houses':
            crud.assign_comp(comps_in_db[11], db_lesson)
            crud.assign_comp(comps_in_db[12], db_lesson)
            crud.assign_comp(comps_in_db[13], db_lesson)
            crud.assign_comp(comps_in_db[14], db_lesson)
            crud.assign_comp(comps_in_db[15], db_lesson)
            crud.assign_comp(comps_in_db[16], db_lesson)
            crud.assign_comp(comps_in_db[17], db_lesson)
            crud.assign_comp(comps_in_db[18], db_lesson)
            crud.assign_comp(comps_in_db[19], db_lesson)
            crud.assign_comp(comps_in_db[20], db_lesson)
            crud.assign_comp(comps_in_db[21], db_lesson)
            crud.assign_comp(comps_in_db[22], db_lesson)
            crud.assign_comp(comps_in_db[23], db_lesson)
            crud.assign_comp(comps_in_db[24], db_lesson)
            tag = crud.get_tag_by_name('Science')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('Environment')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('6th')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('7th')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('8th')
            crud.assign_tag_to_lesson(tag, db_lesson)
    
    elif db_lesson.title == 'Why Red Pandas are the Coolest':
            tag = crud.get_tag_by_name('Science')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('Environment')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('1st')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('2nd')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('3rd')
            crud.assign_tag_to_lesson(tag, db_lesson)
    
    elif db_lesson.title == 'Experience Tree-Top Living at One of These Sustainable Tree Houses':
            tag = crud.get_tag_by_name('Science')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('Environment')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('6th')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('7th')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('8th')
            crud.assign_tag_to_lesson(tag, db_lesson)

    elif db_lesson.title == 'Whimsical Trio of Tiny Tree Houses':
            tag = crud.get_tag_by_name('Science')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('Environment')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('6th')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('7th')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('8th')
            crud.assign_tag_to_lesson(tag, db_lesson)

    elif db_lesson.title == 'A Brief History of Roller-skating':
            tag = crud.get_tag_by_name('Reading')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('3rd')
            crud.assign_tag_to_lesson(tag, db_lesson)

    elif db_lesson.title == "The Etymology of 'Ballonicorn'":
            tag = crud.get_tag_by_name('8th')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('Languages')
            crud.assign_tag_to_lesson(tag, db_lesson)
    
    elif db_lesson.title == 'Color theory':
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('Arts/Music')
            crud.assign_tag_to_lesson(tag, db_lesson)
    # elif db_lesson.title == 'The Golden Ratio':
    
    elif db_lesson.title == 'How Hollywood Screen Siren Hedy Lamarr Helped Pioneer WiFi and GPS':
            tag = crud.get_tag_by_name('11th')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('12th')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('Science')
            crud.assign_tag_to_lesson(tag, db_lesson)

    elif db_lesson.title == 'Did Ada Lovelace invent the computer?':
            tag = crud.get_tag_by_name('11th')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('12th')
            crud.assign_tag_to_lesson(tag, db_lesson)

    elif db_lesson.title == "Disrupting the Computer Industry Before It Existed: Admiral Grace Hopper'":
            tag = crud.get_tag_by_name('5th')
            crud.assign_tag_to_lesson(tag, db_lesson)
            tag = crud.get_tag_by_name('Science')
            crud.assign_tag_to_lesson(tag, db_lesson)

    # elif db_lesson.title == 'Katherine Johnson: Pioneering NASA mathematician':
    # elif db_lesson.title == "Why is Women's History Month in March?":
    # elif db_lesson.title == "Graphic Design 101: The designer's guide to Gestalt Theory":
    # elif db_lesson.title == 'The Cryptanalyst Who Brought Down the Mob':
    # elif db_lesson.title == "The Etymology of 'Ballonicorn'":
    # elif db_lesson.title == 'US Legislative process':
    # elif db_lesson.title == 'The Preamble to the US Constitution':

# Commit to database 
db.session.commit()

    





