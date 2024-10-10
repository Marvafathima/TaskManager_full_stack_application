from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from .authentication import IsAuthenticatedCustom
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import make_password, check_password
from .models import User

class SignUpView(APIView):

    permission_classes = [AllowAny]
    def post(self, request):
        data = request.data
        user = User(username=data['username'], email=data['email'])
        user.set_password(data['password'])
        user.save()

        token = user.create_jwt()
        return Response({
            'message': 'User created successfully',
            'token': token,
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

class SignInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        print(f"Received: email={email}, password={password}")

        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                print(f"User authenticated: {user}")
                token = user.create_jwt()
                return Response({
                    'token': token,
                    'user': UserSerializer(user).data
                })
            else:
                print("Password check failed")
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            print("No user found with this email")
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({
            'message': 'You have access to this protected view',
            'user': str(request.user.id)
        })
