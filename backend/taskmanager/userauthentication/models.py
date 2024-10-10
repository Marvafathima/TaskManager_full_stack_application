# from djongo import models
# from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
# from django.utils import timezone

# class CustomUserManager(BaseUserManager):
#     def create_user(self, email, password=None, **extra_fields):
#         if not email:
#             raise ValueError('The Email must be set')
#         email = self.normalize_email(email)
#         user = self.model(email=email, **extra_fields)
#         user.set_password(password)
#         user.save()  # Remove using=self._db
#         return user

#     def create_superuser(self, email, password=None, **extra_fields):
#         extra_fields.setdefault('is_staff', True)
#         extra_fields.setdefault('is_superuser', True)
#         return self.create_user(email, password, **extra_fields)

# class CustomUser(AbstractBaseUser, PermissionsMixin):
#     _id = models.ObjectIdField()
#     email = models.EmailField("email address", unique=True)
#     name = models.CharField(max_length=255)
#     is_staff = models.BooleanField(default=False)
#     is_active = models.BooleanField(default=True)
#     date_joined = models.DateTimeField(default=timezone.now)
    
#     # Change ManyToManyField to ArrayReferenceField
#     groups = models.ArrayReferenceField(
#         to='auth.Group',
#         on_delete=models.CASCADE,
#         null=True,
#         blank=True,
#     )
#     user_permissions = models.ArrayReferenceField(
#         to='auth.Permission',
#         on_delete=models.CASCADE,
#         null=True,
#         blank=True,
#     )
    
#     objects = CustomUserManager()
    
#     class Meta:
#         abstract = False

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

