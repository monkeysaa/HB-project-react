# README.md

DESK is an intuitive Flask web-app that allows users to store, display, 
and share digital content. This web app was written as the final project
for Hackbright Academy's full-stack software bootcamp program. 

Originally envisioned as a tool for teachers to organize digital resources as 
they adapted to remote teaching, DESK refers to user collections as "Lessons".
However, DESK's simple, fluid design provides an easy way to consolidate links, 
text from email, photographs, and notes. Users can weave visual tapestries to
tell digital stories, or simply copy and paste to cut out the clutter.  

## Installation


Python3 is required. 

Install packages in requirements.txt in a virtual environment: 

    pip3 install -r requirements.txt

Create a PostgreSQL database by calling

    createdb lessons 

Open model.py in interactive mode with the command

    python3 -i model.py

    and run db.create_all() in the Python interpreter. 

Next, seed the database with existing data by calling: 

    python3 seed_database.py

Finally (Whew!) start the server with the call: 

    python3 server.py



## Usage



• Begin by creating an account. Login/Logout features can always be accessed 
via the Nav bar. 

• Once logged in, you'll be directed to your profile page, where you can create 
lessons or flip through previous lessons you've created.

• Using the Nav bar, click on Directory to check out other users' lessons.  

• Each title links to its own display page, where you can see lessons and watch 
videos. 

• The Nav bar can take you back to own profile, where you can update your 
profile picture.  



## Technologies Used

	• Python 3.6

	• JavaScript

	• Flask

	• HTML5

	• CSS3

	• React 16

	• AJAX

	• JSON

	• PostgreSQL

	• SQLAlchemy

    • Bootstrap

Integration with

	• Cloudinary API 

	• and AWS 
