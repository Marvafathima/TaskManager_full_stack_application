"""
Django settings for taskmanager project.

Generated by 'django-admin startproject' using Django 4.2.16.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-0w_&6hdrjzrb8^5(5!+z1#b59bg3t#h49-kvl)pp1_felt&n@i'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'userauthentication',
    'taskapp',
    'rest_framework',
     'rest_framework_simplejwt.token_blacklist',
      'rest_framework_mongoengine',
       'corsheaders',
   
]
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS=True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
]
MIDDLEWARE = [
    
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'taskmanager.urls'


from decouple import config

JWT_SECRET_KEY = config('JWT_SECRET_KEY', default='your-secret-key-here')

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
       'userauthentication.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'userauthentication.authentication.IsAuthenticatedCustom',
    ],
}
from datetime import timedelta

AUTHENTICATION_BACKENDS = [
    'userauthentication.CustomMongoEngineBackend',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'taskmanager.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }
# DATABASES = {
#     'default': {
#         'ENGINE': 'djongo',
#         'NAME': 'taskmanagerdb',  # Name of the database you created
#         'CLIENT': {
#             'host': 'mongodb://localhost:27017',
#             'username': 'user',
#             'password': 'botanist62',
#             'authSource': 'admin', 
#         }
#     }
# }
import mongoengine
mongoengine.connect(db='taskmanagerdb', host='mongodb://user:botanist62@localhost:27017/taskmanagerdb?authSource=admin', username='user', password='botanist62')

# DATABASES = {
#     'default': {
#         'ENGINE': 'djongo',
#         'NAME': 'taskmanagerdb',
         
#         'CLIENT': {
#             'host': 'mongodb://user:botanist62@localhost:27017/taskmanagerdb?authSource=admin',
#             'port': 27017,
#             'username': 'user',
#             'password': 'botanist62',
#             'authSource': 'admin',
#         },
#          'LOGGING': {
#             'version': 1,
#             'loggers': {
#                 'djongo': {
#                     'level': 'DEBUG',
#                     'propagate': False,
#                 }
#             },
#         },
#     }
# }
# Add these settings
# MONGODB_ENFORCE_SCHEMA = False
# DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'
# DJONGO_DATABASE = True
# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
