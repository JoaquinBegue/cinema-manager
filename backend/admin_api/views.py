from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import NotFound


from api.models import Movie, Showtime, Reservation, User
from api.serializers import MovieSerializer, ShowtimeSerializer, ReservationSerializer
from auth_api.serializers import UserSerializer
from api.utils import validate_showtime

TZ_OFFSET = timedelta(hours=3)

class MovieViewSet(ModelViewSet):
    """Manage movies."""
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]

class ShowtimeViewSet(ModelViewSet):
    """Manage showtimes."""
    queryset = Showtime.objects.all()
    serializer_class = ShowtimeSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        """Create showtime."""
        # Get data from request
        movie_id = request.data.get("movie")
        auditorium = request.data.get("auditorium")
        date = request.data.get("date")
        time = request.data.get("time")

        # Parse date and time
        try:
            date_obj = datetime.fromisoformat(date).date()
        except ValueError:
            raise NotFound("Invalid datetime format.")
        
        # Create showtime start datetime
        start = datetime(date_obj.year, date_obj.month, date_obj.day,
            int(time.split(":")[0]), int(time.split(":")[1]))

        # Prepare data for serializer
        data = {'movie': movie_id, 'auditorium': auditorium, 'start': start}

        # Use serializer for validation and creation
        serializer = self.get_serializer(data=data)
        serializer.is_valid()
        serializer.save()

        return Response({"message": "Showtime created successfully"}, status=201)

    def update(self, request, pk=None):
        """Update showtime."""
        # Get data from request
        movie_id = request.data.get("movie")
        auditorium = request.data.get("auditorium")
        date = request.data.get("date")
        time = request.data.get("time")

        # Parse date and time
        try:
            date_obj = datetime.fromisoformat(date).date()
        except ValueError:
            raise NotFound("Invalid datetime format.")
        
        # Create showtime start datetime
        start = datetime(date_obj.year, date_obj.month, date_obj.day,
            int(time.split(":")[0]), int(time.split(":")[1]))

        # Prepare data for serializer
        data = {'movie': movie_id, 'auditorium': auditorium, 'start': start}

        # Use serializer for validation and creation
        serializer = self.get_serializer(data=data)
        serializer.is_valid()
        serializer.save()

        return Response({"message": "Showtime updated successfully"}, status=200)

class ReservationViewSet(ModelViewSet):
    """Manage reservations."""
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [AllowAny]

class UserViewSet(ModelViewSet):
    """Manage users."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class AvailableTimesView(APIView):
    """Get available times of the day given auditorium, datetime and movie duration."""
    def get(self, request):
        """Get times."""

        # Get auditorium and datetime from request.
        auditorium = request.query_params.get("auditorium")
        date = request.query_params.get("date")
        movie_duration = request.query_params.get("movie_duration")

        # Convert datetime to datetime object.
        try:
            date = datetime.fromisoformat(date).date()
        except ValueError as error:
            print(error)
            return Response({"error": "Invalid datetime format"}, status=400)
        
        # Check if date has at least 3 days of anticipation from today.
        if (date - datetime.today().date()).days < 3:
            return Response({"error": "Date must be at least 3 days of anticipation from today"}, status=400)
        
        # Generate available times in 15 minutes intervals.
        base = timezone.make_aware(datetime(date.year, date.month, date.day, 12, 0, 0))
        limit = timezone.make_aware(datetime(base.year, base.month, base.day, 23, 59, 59))
        available_times = []
        while base < limit:
            # Check if time is reserved.
            movie_start = base
            movie_end = movie_start + timedelta(minutes=int(movie_duration) + 15)
            if validate_showtime(movie_start, movie_end, auditorium):
                available_times.append(movie_start.strftime('%H:%M'))
            
            base += timedelta(minutes=15)

        return Response({"available_times": available_times})