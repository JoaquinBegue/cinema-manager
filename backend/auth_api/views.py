from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework import generics
from .serializers import UserSerializer

# Register.
class Register(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]