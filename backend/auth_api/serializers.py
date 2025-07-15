from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "password", "is_staff"]
        extra_kwargs = {"username": {"allow_null": True}, "password": {"write_only": True, "required": True}}

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.username = validated_data.pop("email")
        user.set_password(password)
        user.save()
        return user