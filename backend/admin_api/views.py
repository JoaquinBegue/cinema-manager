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