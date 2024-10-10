from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from .authentication import IsAuthenticatedCustom
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import make_password, check_password
from .models import User
# class SignUpView(APIView):
#     def post(self, request):
#         serializer = UserSerializer(data=request.data)
#         if serializer.is_valid():
#             # Hash the password before saving
#             password = make_password(serializer.validated_data['password'])
#             user = serializer.save(password=password)
            
#             # Create JWT token
#             token = user.create_jwt()
            
#             return Response({
#                 'message': 'User created successfully',
#                 'token': token,
#                 'user': UserSerializer(user).data
#             }, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class SignUpView(APIView):
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
# class SignInView(APIView):
#     def post(self, request):
#         email = request.data.get('email')
#         password = request.data.get('password')
#         print(f"Received: email={email}, password={password}")
        
        
#         try:
#             user = User.objects.get(email=email)
#             print(f"Found user: {user}")
#             print(f"Stored hashed password: {user.password}")
            
#             is_password_correct = check_password(password, user.password)
#             print(f"Password check result: {is_password_correct}")
            
#             if not is_password_correct:
#                 return Response({'error': 'password mismatch'}, status=status.HTTP_401_UNAUTHORIZED)
            
#             token = user.create_jwt()
#             return Response({
#                 'token': token,
#                 'user': UserSerializer(user).data
#             })
#         except User.DoesNotExist:
#             return Response({'error': 'usernot exist'}, status=status.HTTP_401_UNAUTHORIZED)
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({
            'message': 'You have access to this protected view',
            'user': str(request.user.id)
        })
