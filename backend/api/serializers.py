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
    movie = serializers.SerializerMethodField() 
    showtime_start = serializers.SerializerMethodField()
    showtime_auditorium = serializers.SerializerMethodField()
    seats_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = Reservation
        fields = "__all__"

    def get_movie(self, obj):
        return obj.showtime.movie.title

    def get_showtime_start(self, obj):
        return obj.showtime.start.strftime("%Y-%m-%d %H:%M")
    
    def get_showtime_auditorium(self, obj):
        return obj.showtime.auditorium
    
    def get_seats_formatted(self, obj):
        return [f"{seat.row}{seat.column}" for seat in obj.seats.all()]


    def to_representation(self, instance):
        instance.check_status()
        return super().to_representation(instance)


class ShowtimeSerializer(serializers.ModelSerializer):
    start_time = serializers.SerializerMethodField()

    class Meta:
        model = Showtime
        fields = ["id", "movie", "auditorium", "start_time"]

    def get_start_time(self, obj):
        return obj.start.strftime("%H:%M") if obj.start else None


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "password"]
        extra_kwargs = {"username": {"allow_null": True}, "password": {"write_only": True, "required": True}}

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.username = validated_data.pop("email")
        user.set_password(password)
        user.save()
        return user