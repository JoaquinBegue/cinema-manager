from django.shortcuts import render
from rest_framework import generics
from .models import Movie, Seat, Reservation, Showtime
from .serializers import MovieSerializer, SeatSerializer, ReservationSerializer, ShowtimeSerializer

def index(request):
    if request.method == "GET":
        return render(request, "api/index.html")


class MovieListCreate(generics.ListAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer


class SeatListCreate(generics.ListAPIView):
    queryset = Seat.objects.all()
    serializer_class = SeatSerializer


class ReservationListCreate(generics.ListAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer


class ShowtimeListCreate(generics.ListAPIView):
    queryset = Showtime.objects.all()
    serializer_class = ShowtimeSerializer