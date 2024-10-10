# from django.shortcuts import render

# # Create your views here.
# from rest_framework import status
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from .models import Task
# from .serializers import TaskSerializer

# class TaskListCreateView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         tasks = Task.objects(user=request.user)
#         serializer = TaskSerializer(tasks, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = TaskSerializer(data=request.data, context={'request': request})
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class TaskDetailView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get_object(self, pk, user):
#         try:
#             return Task.objects.get(id=pk, user=user)
#         except Task.DoesNotExist:
#             return None

#     def get(self, request, pk):
#         task = self.get_object(pk, request.user)
#         if not task:
#             return Response(status=status.HTTP_404_NOT_FOUND)
#         serializer = TaskSerializer(task)
#         return Response(serializer.data)

#     def put(self, request, pk):
#         task = self.get_object(pk, request.user)
#         if not task:
#             return Response(status=status.HTTP_404_NOT_FOUND)
#         serializer = TaskSerializer(task, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk):
#         task = self.get_object(pk, request.user)
#         if not task:
#             return Response(status=status.HTTP_404_NOT_FOUND)
#         task.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer
from bson import ObjectId
from userauthentication.authentication import JWTAuthentication,IsAuthenticatedCustom
class TaskListCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedCustom]

    def get(self, request):
        tasks = Task.objects(user=request.user.id)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            task = Task(**serializer.validated_data)
            task.user = request.user.id
            task.save()
            return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedCustom]

    def get_object(self, pk, user):
        try:
            return Task.objects.get(id=ObjectId(pk), user=user.id)
        except Task.DoesNotExist:
            return None

    def get(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    def put(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            for key, value in serializer.validated_data.items():
                setattr(task, key, value)
            task.save()
            return Response(TaskSerializer(task).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response(status=status.HTTP_404_NOT_FOUND)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)