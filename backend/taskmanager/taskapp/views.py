
# from rest_framework import status
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from .models import Task
# from .serializers import TaskSerializer
# from bson import ObjectId
# from userauthentication.authentication import JWTAuthentication, IsAuthenticatedCustom
# import logging

# logger = logging.getLogger(__name__)

# class TaskListCreateView(APIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticatedCustom]

#     def get(self, request):
#         tasks = Task.objects(user=request.user.id)
#         serializer = TaskSerializer(tasks, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = TaskSerializer(data=request.data, context={'request': request})
#         print(request.data,"data recieved from frontend")
#         if serializer.is_valid():
#             print("serislser is valid")
#             task = serializer.save()
#             return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class TaskDetailView(APIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticatedCustom]

#     def get_object(self, pk, user):
#         try:
#             return Task.objects.get(id=ObjectId(pk), user=user.id)
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
#         serializer = TaskSerializer(task, data=request.data, context={'request': request}, partial=True)
#         if serializer.is_valid():
#             updated_task = serializer.save()
#             return Response(TaskSerializer(updated_task).data)
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
from .models import Task
from .serializers import TaskSerializer
from bson import ObjectId
from userauthentication.authentication import JWTAuthentication, IsAuthenticatedCustom
import logging
from django.core.serializers.json import DjangoJSONEncoder

logger = logging.getLogger(__name__)

class ObjectIdJSONEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

class TaskListCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedCustom]

    def get(self, request):
        tasks = Task.objects(user=request.user.id)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        logger.debug(f"Received data: {request.data}")
        serializer = TaskSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            logger.debug("Serializer is valid")
            try:
                task = serializer.save()
                return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"Error saving task: {e}")
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        logger.error(f"Serializer errors: {serializer.errors}")
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
        print("got edit task",task,request.data)
        if not task:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(task, data=request.data, context={'request': request}, partial=True)
        if serializer.is_valid():
            updated_task = serializer.save()
            print("updated task",TaskSerializer(updated_task).data)
            return Response(TaskSerializer(updated_task).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response(status=status.HTTP_404_NOT_FOUND)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)