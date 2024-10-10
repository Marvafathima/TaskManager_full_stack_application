
# from rest_framework_mongoengine import serializers
# from userauthentication.models import User
# from .models import Task
# from rest_framework.exceptions import ValidationError
# import logging

# logger = logging.getLogger(__name__)

# class TaskSerializer(serializers.DocumentSerializer):
#     user = serializers.serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

#     class Meta:
#         model = Task
#         fields = ['id', 'title', 'description', 'due_date', 'status', 'created_at', 'user']
#         read_only_fields = ['id', 'created_at']

#     def validate(self, attrs):
#         logger.debug(f"Validating data: {attrs}")
#         return attrs

#     def create(self, validated_data):
#         logger.debug(f"Creating task with data: {validated_data}")
#         user = self.context['request'].user
#         task = Task(**validated_data)
#         task.user = user
#         task.save()
#         return task

#     def update(self, instance, validated_data):
#         logger.debug(f"Updating task {instance.id} with data: {validated_data}")
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()
#         return instance

#     def to_internal_value(self, data):
#         logger.debug(f"Converting to internal value: {data}")
#         try:
#             return super().to_internal_value(data)
#         except ValidationError as e:
#             logger.error(f"Validation error: {e}")
#             raise
# from rest_framework_mongoengine import serializers
# from userauthentication.models import User
# from .models import Task
# from rest_framework.exceptions import ValidationError
# import logging
# from bson import ObjectId

# logger = logging.getLogger(__name__)

# class ObjectIdField(serializers.Field):
#     def to_representation(self, value):
#         return str(value)

#     def to_internal_value(self, data):
#         return ObjectId(data)

# class TaskSerializer(serializers.DocumentSerializer):
#     id = ObjectIdField(read_only=True)
#     user = serializers.serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

#     class Meta:
#         model = Task
#         fields = ['id', 'title', 'description', 'due_date', 'status', 'created_at', 'user']
#         read_only_fields = ['created_at']

#     def validate(self, attrs):
#         logger.debug(f"Validating data: {attrs}")
#         return attrs

#     def create(self, validated_data):
#         logger.debug(f"Creating task with data: {validated_data}")
#         user = self.context['request'].user
#         task = Task(**validated_data)
#         task.user = user
#         task.save()
#         return task

#     def update(self, instance, validated_data):
#         logger.debug(f"Updating task {instance.id} with data: {validated_data}")
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()
#         return instance

#     def to_internal_value(self, data):
#         logger.debug(f"Converting to internal value: {data}")
#         try:
#             return super().to_internal_value(data)
#         except ValidationError as e:
#             logger.error(f"Validation error: {e}")
#             raise

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['id'] = str(representation['id'])
#         if 'user' in representation and representation['user']:
#             representation['user'] = str(representation['user'])
#         return representation
from rest_framework_mongoengine import serializers
from rest_framework import serializers as drf_serializers
from userauthentication.models import User
from .models import Task
from rest_framework.exceptions import ValidationError
import logging
from bson import ObjectId

logger = logging.getLogger(__name__)

class ObjectIdField(drf_serializers.Field):
    def to_representation(self, value):
        return str(value)

    def to_internal_value(self, data):
        return ObjectId(data)

class TaskSerializer(serializers.DocumentSerializer):
    id = ObjectIdField(read_only=True)
    user = serializers.serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'due_date', 'status', 'created_at', 'user']
        read_only_fields = ['created_at']

    def validate(self, attrs):
        logger.debug(f"Validating data: {attrs}")
        return attrs

    def create(self, validated_data):
        logger.debug(f"Creating task with data: {validated_data}")
        user = self.context['request'].user
        task = Task(**validated_data)
        task.user = user
        task.save()
        return task

    def update(self, instance, validated_data):
        logger.debug(f"Updating task {instance.id} with data: {validated_data}")
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def to_internal_value(self, data):
        logger.debug(f"Converting to internal value: {data}")
        try:
            return super().to_internal_value(data)
        except ValidationError as e:
            logger.error(f"Validation error: {e}")
            raise

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['id'] = str(representation['id'])
        if 'user' in representation and representation['user']:
            representation['user'] = str(representation['user'])
        return representation