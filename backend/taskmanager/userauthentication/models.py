

from mongoengine import Document, StringField, EmailField, BooleanField, DateTimeField
from django.utils import timezone
from datetime import datetime, timedelta
import jwt
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
class User(Document):
    username = StringField(max_length=150, unique=True, required=True)
    email = EmailField(unique=True, required=True)
    password = StringField(required=True)
    is_active = BooleanField(default=True)
    is_staff = BooleanField(default=False)
    date_joined = DateTimeField(default=timezone.now)

    meta = {'collection': 'users'}
    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    def create_jwt(self):
        payload = {
            'user_id': str(self.id),
            'email': self.email,
            'exp': datetime.utcnow() + timedelta(days=1),  # Token expires in 1 day
            'iat': datetime.utcnow()
        }
        token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm='HS256')
        print("\n\n\n\n\we created tocken for user",token)
        return token

    @staticmethod
    def verify_jwt(token):
        try:
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.DecodeError:
            return None
    def __str__(self):
        return self.username

