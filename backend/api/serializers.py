from rest_framework import serializers
from rest_framework.exceptions import NotFound
from datetime import datetime, timedelta
from django.utils import timezone

from .utils import validate_showtime
from .models import Movie, Seat, Reservation, Showtime

class MovieSerializer(serializers.ModelSerializer):
    genres = serializers.MultipleChoiceField(choices=Movie.Genre.choices)

    class Meta:
        model = Movie
        fields = "__all__"

    def validate(self, data):
        """Validate movie data."""

        # Validate movie duration.
        try:
            data['duration'] = int(data['duration'])
        except ValueError:
            raise serializers.ValidationError("Duration must be an integer.")

        if data['duration'] < 1:
            raise serializers.ValidationError("Duration must be greater than 0.")

        return data


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
    start_date = serializers.SerializerMethodField()
    start_time = serializers.SerializerMethodField()
    movie_duration = serializers.SerializerMethodField()

    class Meta:
        model = Showtime
        fields = "__all__"

    def get_movie_title(self, obj):
        return obj.movie.title

    def get_start_date(self, obj):
        return timezone.localtime(obj.start).strftime("%Y-%m-%d")

    def get_start_time(self, obj):
        return timezone.localtime(obj.start).strftime("%H:%M")

    def get_movie_duration(self, obj):
        return obj.movie.duration
    
    def validate(self, data):
        """Validate showtime data."""
        # Get data from request
        movie = data['movie']
        auditorium = data['auditorium']
        start = data['start']
        end = start + (timedelta(minutes=movie.duration + 15))
        
        if not all([movie, auditorium, start]):
            raise serializers.ValidationError("Movie, auditorium, and start time are required.")
        
        # Validate auditorium
        if auditorium < 1 or auditorium > 5:
            raise serializers.ValidationError("Invalid auditorium. Must be between 1 and 5.")

        # Validate start.
        if not validate_showtime(start, end, auditorium):
            raise serializers.ValidationError("Selected time is not available.")
        
        return data
    
    def create(self, validated_data):
        return Showtime.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.movie = validated_data.get('movie', instance.movie)
        instance.auditorium = validated_data.get('auditorium', instance.auditorium)
        instance.start = validated_data.get('start', instance.start)
        instance.save()
        return instance
        
