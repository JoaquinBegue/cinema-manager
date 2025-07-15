from datetime import datetime

from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny

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

class GetTimesView(APIView):
    """Get times of future showtimes for a given auditorium and datetime."""
    def get(self, request):
        """Get times."""
        # Get auditorium and datetime from request.
        auditorium = request.query_params.get("auditorium")
        date = request.query_params.get("date")

        # Convert datetime to datetime object.
        try:
            date = datetime.fromisoformat(date.replace("Z", "+00:00"))
        except ValueError:
            return Response({"error": "Invalid datetime format"}, status=400)
        
        # Get showtimes.
        showtimes = Showtime.objects.filter(auditorium=auditorium, datetime__gte=date)
        reserved_times = []
        for showtime in showtimes:
            reserved_times.append({
                "start": showtime.start,
                "end": showtime.end
            })

        return Response({"reserved_times": reserved_times})
