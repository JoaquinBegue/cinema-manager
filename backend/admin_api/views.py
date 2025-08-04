from datetime import datetime, timedelta

from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import NotFound


from api.models import Movie, Showtime, Reservation, User
from api.serializers import MovieSerializer, ShowtimeSerializer, ReservationSerializer
from auth_api.serializers import UserSerializer

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
        # Get movie, auditorium, date and time from request.
        movie = request.data.get("movie")
        auditorium = request.data.get("auditorium")
        date = request.data.get("date")
        time = request.data.get("time")

        # TODO: move validation to serializer

        # Retrieve movie object.
        try:
            movie = Movie.objects.get(pk=movie)
        except Movie.DoesNotExist:
            raise NotFound("Movie not found.")

        # Convert date to date object.
        try:
            date = datetime.fromisoformat(date.replace("Z", "+00:00")).date()
        except ValueError:
            raise NotFound("Invalid datetime format.")
        
        # Create showtime start datetime.
        selected_time = datetime(date.year, date.month, date.day, int(time.split(":")[0]), int(time.split(":")[1]))
        selected_time_end = selected_time + timedelta(minutes=int(movie.duration) + 15)

        # Check if selected time is available.
        base = datetime(date.year, date.month, date.day, 12)
        limit = datetime(date.year, date.month, date.day, 23, 59, 59)
        showtimes = Showtime.objects.filter(auditorium=auditorium, start__gte=base, start__lte=limit)
        for showtime in showtimes:
            if showtime.start <= selected_time <= showtime.end or \
            showtime.start <= selected_time_end <= showtime.end:
                raise NotFound("Selected time is not available.")

        # Create showtime.
        showtime = Showtime.objects.create(movie=movie, auditorium=auditorium, start=start, end=end)

        return Response({"message": "Showtime created successfully"}, status=201)


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
            date = datetime.fromisoformat(date.replace("Z", "+00:00")).date()
        except ValueError:
            return Response({"error": "Invalid datetime format"}, status=400)
        

        # Get showtimes of the day.
        showtimes_limit = datetime(date.year, date.month, date.day, 23, 59, 59)
        showtimes = Showtime.objects.filter(auditorium=auditorium, start__gte=date, start__lte=showtimes_limit)

        # Set main datetime.
        # Showtimes are added with 3 days of anticipation. So set main datetime
        # depending of how many days are left from given day to today + 3 days.
        days_left = (datetime.today().date() - date).days + 3
        main_datetime = datetime(date.year, date.month, date.day + days_left, 12)
        
        # Generate available times in 15 minutes intervals.
        available_times = []
        limit = datetime(main_datetime.year, main_datetime.month, main_datetime.day, 23) 
        while main_datetime < limit:
            # Check if time is reserved.
            reserved = False
            movie_start = main_datetime
            movie_end = main_datetime + timedelta(minutes=int(movie_duration) + 15)
            for showtime in showtimes:
                if (movie_start >= showtime.start and movie_start <= showtime.end or
                movie_end >= showtime.start and movie_end <= showtime.end):
                    reserved = True
                    break
            
            if not reserved:
                available_times.append(movie_start.strftime('%H:%M'))
            
            main_datetime += timedelta(minutes=15)

        return Response({"available_times": available_times})