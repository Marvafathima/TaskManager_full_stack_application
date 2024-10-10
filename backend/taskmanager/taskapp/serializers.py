# class TaskSerializer(serializers.Serializer):
#     id = serializers.CharField(read_only=True)
#     title = serializers.CharField(max_length=200)
#     description = serializers.CharField(max_length=1000, allow_blank=True)
#     due_date = serializers.DateTimeField()
#     status = serializers.ChoiceField(choices=['To Do', 'In Progress', 'Done'])
#     created_at = serializers.DateTimeField(read_only=True)
#     user = serializers.CharField(read_only=True)

#     def create(self, validated_data):
#         user = self.context['request'].user
#         return Task.objects.create(user=user, **validated_data)

#     def update(self, instance, validated_data):
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()
#         return instance
from rest_framework_mongoengine import serializers
from userauthentication.models import User
from .models import Task
class TaskSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'due_date', 'status', 'created_at', 'user']
        read_only_fields = ['id', 'created_at', 'user']  # Fields that should not be modified

    def create(self, validated_data):
        user = self.context['request'].user
        task = Task(user=user, **validated_data)
        task.save()
        return task

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance