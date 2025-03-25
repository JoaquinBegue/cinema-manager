from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Movie, Seat, Reservation, Showtime


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = "__all__"


class SeatSerializer(serializers.ModelSerializer):
    available = serializers.SerializerMethodField()

    class Meta:
        model = Seat
        fields = "__all__"

    def get_available(self, obj):
        showtime = self.context.get("showtime")
        return obj.is_available(showtime) if showtime else None


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = "__all__"


class ShowtimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Showtime
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name",]
        extra_kwargs = {"username": {"allow_null": True}, "password": {"write_only": True, "required": True}}

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.username = validated_data.pop("email")
        user.set_password(password)
        user.save()
        return user