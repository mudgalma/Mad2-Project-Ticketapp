from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from application.database import db
from datetime import datetime


roles_users = db.Table('roles_users',
                       db.Column('user_id', db.Integer(),
                                 db.ForeignKey('user.id')),
                       db.Column('role_id', db.Integer(),
                                 db.ForeignKey('role.id')))


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String, unique=False,nullable=False)
    email = db.Column(db.String, unique=True,nullable=False)
    password = db.Column(db.String(255),nullable=False)
    lastlogin = db.Column(db.DateTime, default=datetime.utcnow)
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary=roles_users,
                            backref=db.backref('users', lazy='dynamic'))
    
    shows=db.relationship('Show',secondary='booking',back_populates='users')

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
    
class Venue(db.Model):
    id=db.Column(db.Integer(),primary_key=True)
    venue_name=db.Column(db.String(200),nullable=False)
    place=db.Column(db.String(300),nullable=False)
    location=db.Column(db.String(200),nullable=False)
    capacity=db.Column(db.Integer(),nullable=False)
    shows=db.relationship('Show',backref='',lazy=True)
    
class Show(db.Model):  
    id=db.Column(db.Integer(),primary_key=True)
    Show_name=db.Column(db.String(200),nullable=False)
    ratings=db.Column(db.Integer(),nullable=False)
    timings=db.Column(db.DateTime,nullable=False)
    tags=db.Column(db.String(1000),nullable=False)
    price=db.Column(db.Integer(),nullable=False)
    seats = db.Column(db.Integer, nullable=False)
    movie_description = db.Column(db.String, nullable=True)
    venue_id=db.Column(db.Integer,db.ForeignKey('venue.id'),nullable=False)
    users=db.relationship('User',secondary='booking',back_populates='shows')
    
    
class Booking(db.Model):
    sb_id=db.Column(db.Integer(),primary_key=True)
    show_id=db.Column(db.Integer,db.ForeignKey('show.id'),nullable=False)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    number_of_bookings=db.Column(db.Integer(),nullable=False)


class Rate(db.Model):
    r_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    showname = db.Column(db.String, nullable=False)
    review = db.Column(db.String, nullable=False)
    rateuser_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    rateshow_id = db.Column(db.Integer, db.ForeignKey("show.id"), nullable=False)
    
