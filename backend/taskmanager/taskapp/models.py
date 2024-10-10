

# Create your models here.
from mongoengine import Document, StringField, DateTimeField, ReferenceField, BooleanField
from userauthentication.models import User
from datetime import datetime


class Task(Document):
    title = StringField(required=True, max_length=200)
    description = StringField(max_length=1000)
    due_date = DateTimeField()
    status = StringField(choices=('To Do', 'In Progress', 'Done'), default='To Do')
    created_at = DateTimeField(default=datetime.utcnow)
    user = ReferenceField(User, required=True)

    meta = {'collection': 'tasks'}

    def __str__(self):
        return self.title
