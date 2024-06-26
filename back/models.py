from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint
import random
from datetime import datetime

db = SQLAlchemy()

class Metrics(db.Model):
    __tablename__ = 'metrics'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.user_id'), nullable=False)
    test_id = db.Column(db.String, nullable=True)  # может быть пустым
    lecture_id = db.Column(db.String, nullable=True)  # может быть пустым
    action = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    value = db.Column(db.String, nullable=False)  # хранит дополнительные данные в зависимости от действия
db = SQLAlchemy()

# Функция генерации уникального ID
def generate_id():
    return random.randint(1000000000, 9999999999)

# Модель Группы
class Group(db.Model):
    __tablename__ = 'groups'
    group_id = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String(100), nullable=False)
    users = db.relationship('User', backref='group', lazy=True)
    courses = db.relationship('Course', backref='group', lazy=True)

class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True, default=generate_id)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.group_id'), nullable=True)
    otp_secret = db.Column(db.String(32), nullable=True)  # Add this line
    __table_args__ = (CheckConstraint('role IN ("Студент", "Преподаватель")'),)
    def __repr__(self):
        return '<User %r>' % self.email

# Модель Курса
class Course(db.Model):
    __tablename__ = 'courses'
    course_id = db.Column(db.Integer, primary_key=True, default=generate_id)
    course_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    syllabus = db.Column(db.Text, nullable=True)
    lecture_count = db.Column(db.Integer, nullable=True)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.group_id'), nullable=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=True)
    
    def to_json(self):
        return {
            "course_id": self.course_id,
            "course_name": self.course_name
        }

# Модель Лекции
class Lecture(db.Model):
    __tablename__ = 'lectures'
    lecture_id = db.Column(db.Integer, primary_key=True, default=generate_id)
    lecture_name = db.Column(db.String(100), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.course_id'), nullable=False)
    additional_materials = db.Column(db.Text, nullable=True)
    lecture_datetime = db.Column(db.DateTime, nullable=False)
    lecture_link = db.Column(db.String(255), nullable=True)
    video_id = db.Column(db.String(255))

    def to_json(self):
        return {
            'lecture_id': self.lecture_id,
            'lecture_name': self.lecture_name,
            'course_id': self.course_id,
            'additional_materials': self.additional_materials,
            'lecture_datetime': self.lecture_datetime.isoformat(),
            'lecture_link': self.lecture_link,
            'video_id': self.video_id
        }

# Модель Теста
class Test(db.Model):
    __tablename__ = 'tests'
    test_id = db.Column(db.Integer, primary_key=True, default=generate_id)
    name = db.Column(db.String(100), nullable=False)
    lecture_id = db.Column(db.Integer, db.ForeignKey('lectures.lecture_id'), nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    test_link = db.Column(db.String(255), nullable=True)
    additional_info = db.Column(db.Text, nullable=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.course_id'), nullable=False)

# Модель Результата Теста
class TestResult(db.Model):
    __tablename__ = 'test_results'
    result_id = db.Column(db.Integer, primary_key=True, default=generate_id)
    test_id = db.Column(db.Integer, db.ForeignKey('tests.test_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)

# Таблица метрик
class Metrics(db.Model):
    __tablename__ = 'metrics'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.user_id'), nullable=False)
    test_id = db.Column(db.String, nullable=True)  # может быть пустым
    lecture_id = db.Column(db.String, nullable=True)  # может быть пустым
    action = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    value = db.Column(db.String, nullable=False)  # хранит дополнительные данные в зависимости от действия