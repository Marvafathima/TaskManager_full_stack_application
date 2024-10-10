from django.urls import path
from .views import SignUpView, SignInView, ProtectedView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('signin/', SignInView.as_view(), name='signin'),
    path('protected/', ProtectedView.as_view(), name='protected'),
]