from rest_framework import generics, authentication, permissions
from apps.user.serializers import UserCreateSerializer
from apps.user.models import UserAccount
from rest_framework.authtoken.views import ObtainAuthToken

class CreateUserView(generics.CreateAPIView):
    serializer_class = UserCreateSerializer
    
class ListUserView(generics.ListAPIView):
    serializer_class = UserCreateSerializer
    queryset = UserAccount.objects.all()