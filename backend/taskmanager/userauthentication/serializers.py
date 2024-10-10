from rest_framework_mongoengine import serializers
from .models import User
from django.contrib.auth.hashers import make_password
class UserSerializer(serializers.DocumentSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
       
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.password = make_password(password)  
        user.save()
        return user
    
