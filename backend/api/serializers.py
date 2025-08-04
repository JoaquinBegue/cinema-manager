from rest_framework import serializers
from datetime import timedelta

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
    movie_title = serializers.SerializerMethodField() 
    showtime_start = serializers.SerializerMethodField()
    showtime_auditorium = serializers.SerializerMethodField()
    seats_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = Reservation
        fields = "__all__"

    def get_movie_title(self, obj):
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
    movie_title = serializers.SerializerMethodField()
    start_time = serializers.SerializerMethodField()
    start_datetime = serializers.SerializerMethodField()

    class Meta:
        model = Showtime
        fields = "__all__"

    def get_movie_title(self, obj):
        return obj.movie.title

    def get_start_time(self, obj):
        return obj.start.strftime("%H:%M") if obj.start else None

    def get_start_datetime(self, obj):
        return obj.start.strftime("%d/%m %H:%M") if obj.start else None