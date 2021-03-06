"""Models for educational videos app."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    """A user."""

    __tablename__ = 'users'

    user_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True
                        )
    handle = db.Column(db.String, unique=True, nullable=False)                 
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)

  # lessons = a list of Lesson objects authored by user
  # faves = a list of Favorite objects identified by user

    def as_dict(self):
        lesson_ids = []
        for l in self.lessons:
            lesson_ids.append(l.lesson_id)

        return {
            'id': self.user_id, 
            'handle': self.handle,
            'email': self.email,
            'password': self.password,
            'lessons': lesson_ids
        }

    def __repr__(self):
        return f'<User id={self.user_id} email={self.email}>'


class Lesson(db.Model):
    """A lesson."""

    __tablename__ = 'lessons'

    lesson_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    title = db.Column(db.String, nullable=False)
    overview = db.Column(db.Text)
    public = db.Column(db.Boolean)
    author_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    imgUrl = db.Column(db.String)

    author = db.relationship('User', backref = 'lessons')
    comps = db.relationship('Comp', secondary='lesson_comps', viewonly=True)
    tags = db.relationship('Tag', secondary='lesson_tags', viewonly=True)

    # faves = a list of Fave objects 

    def as_dict(self):

        tag_data = []

        for tag in self.tags: 
            tag_dict = {
                'id': tag.tag_id, 
                'name': tag.name,
                'category': tag.category
            }
            tag_data.append(tag_dict)

        return {
            'lesson_id': self.lesson_id, 
            'title': self.title,
            'overview': self.overview,
            'public': self.public,
            'author': self.author.handle,
            'imgUrl': self.imgUrl, 
            'tags': tag_data
            # 'comp_ids': comp_ids,
        }

    def __repr__(self):
        return f'<Lesson id={self.lesson_id} title={self.title}>'


class Comp(db.Model):
    """A component within a lesson."""

    __tablename__ = 'comps'
    # use an association table to map components to their lessons
    comp_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    comp_type = db.Column(db.String, nullable=False) # url, video, pdf, image, text
    text = db.Column(db.Text)
    url = db.Column(db.String)
    # After processing or scraping
    # I also persist video metadata, so we don't have to reach out to YouTube every time we want that data. 
    # "Persist" - Write to my database. The logic layer is the codebase. The persistance layer is the database. 
    title = db.Column(db.String)
    source = db.Column(db.String)
    description = db.Column(db.Text) # metadata for video or site
    favicon = db.Column(db.String)
    imgUrl = db.Column(db.String)
    yt_id = db.Column(db.String) # if YouTube video, YouTube's id for video rendering
    # vid_length = db.Column(db.Float) # if video, length in minutes if using YouTube api.

    lessons = db.relationship('Lesson', secondary='lesson_comps', viewonly=True)
    tags = db.relationship('Tag', secondary='comp_tags', viewonly=True)

    def as_dict(self):
        return {
            'id': self.comp_id, 
            'type': self.comp_type,
            'url': self.url,
            'imgUrl': self.imgUrl,
            'text': self.text,
            'title': self.title,
            'yt_id': self.yt_id,
            'source': self.source,
            'favicon': self.favicon,
            'description': self.description
        }


    def __repr__(self):
        return f'<Component type={self.comp_type} id={self.comp_id}>'

class Lesson_Comp(db.Model):
    
    __tablename__ = 'lesson_comps'

    comp_id = db.Column(db.Integer, 
                       db.ForeignKey('comps.comp_id'), 
                       primary_key=True
                       )
    lesson_id = db.Column(db.Integer, 
                          db.ForeignKey('lessons.lesson_id'),
                          primary_key=True
                          )
    lesson = db.relationship('Lesson')
    comp = db.relationship('Comp')

    def __repr__(self):
        return f'<Assoc {self.comp.name} for {self.lesson.title}>'


class Tag(db.Model):
    """A category for sorting videos."""

    __tablename__ = 'tags' 
    # Would it make more sense to have the name be the primary key?
    tag_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    category = db.Column(db.String)

    lessons = db.relationship('Lesson', secondary='lesson_tags', viewonly=True)
    comps = db.relationship('Comp', secondary='comp_tags', viewonly=True)




    # def as_lesson_tags_dict(self):
        
    #     lesson_ids = []
    #     for lesson in self.lessons:
    #         lesson_ids.append(lesson.lesson_id)

    
    # return {
    #     'lessons': lesson_ids
    # }

    def __repr__(self):
        return f'<Tag {self.category} {self.name}>'


class Lesson_Tag(db.Model):
    
    __tablename__ = 'lesson_tags'

    tag_id = db.Column(db.Integer, 
                       db.ForeignKey('tags.tag_id'), 
                       primary_key=True
                       )
    lesson_id = db.Column(db.Integer, 
                          db.ForeignKey('lessons.lesson_id'),
                          primary_key=True
                          )
    lesson = db.relationship('Lesson')
    tag = db.relationship('Tag')

    def __repr__(self):
        return f'<Assoc {self.tag.name} for {self.lesson.title}>'


class Comp_Tag(db.Model):
    
    __tablename__ = 'comp_tags'

    tag_id = db.Column(db.Integer, 
                       db.ForeignKey('tags.tag_id'), 
                       primary_key=True
                       )
    comp_id = db.Column(db.Integer, 
                        db.ForeignKey('comps.comp_id'), 
                        primary_key=True
                        )

    comp = db.relationship('Comp')
    tag = db.relationship('Tag')

    def __repr__(self):
        return f'<Assoc {self.tag.name} for {self.comp.name}>'
 

# class Fave(db.Model):
#     """A favorite item."""

#     __tablename__ = 'faves' 
#     # Would it make more sense to have the name be the primary key?
#     fave_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
#     category = db.Column(db.String)

#     lessons = db.relationship('Lesson', secondary='lesson_faves', viewonly=True)
#     comps = db.relationship('Comp', secondary='comp_faves', viewonly=True)

#     def __repr__(self):
#         return f'<Tag {self.category} {self.name}>'

        
class Fave_Lesson(db.Model):
    """A favorites middle table linking users to liked lessons."""

    __tablename__ = 'fave_lessons'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.lesson_id'))
    liker_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    
    liker = db.relationship('User', backref='faves')
    lesson = db.relationship('Lesson', backref='likers')

    def __repr__(self):
        return f'<Favorited! {self.liker.email} likes {self.lesson.title}>'


class Fave_Comp(db.Model):
    """A favorites middle table linking users to liked components."""

    __tablename__ = 'fave_comps'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    comp_id = db.Column(db.Integer, db.ForeignKey('comps.comp_id'))
    liker_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    
    liker = db.relationship('User', backref='fave_comps')
    comp = db.relationship('Comp', backref='likers')

    def __repr__(self):
        return f'<Favorited! {self.liker.email} likes {self.comp.name}>'
    

def connect_to_db(flask_app, db_uri='postgresql:///lessons', echo=False):
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    flask_app.config['SQLALCHEMY_ECHO'] = False
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')


if __name__ == '__main__':
    from server import app
    
    connect_to_db(app)  
 

