# Django stuff
from django.shortcuts import render
from django.http import Http404

# DRF stuff
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# API stuff
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


class MovieDetails(APIView):
    def get_movie(self, pk):
        try:
            return Movie.objects.get(pk=pk)
        except Movie.DoesNotExist:
            raise Http404
    
    def get(self, request, pk, format=None):
        movie = self.get_movie(pk)
        showtimes = Showtime.objects.filter(movie=movie, status="available")
        movie_srl = MovieSerializer(movie)
        showtimes_srl = ShowtimeSerializer(showtimes, many=True)
        return Response(data=(movie_srl.data, showtimes_srl.data))
    

class ShowtimeSeats(APIView):
    def get_showtime(self, pk):
        try:
            return Showtime.objects.get(pk=pk)
        except Showtime.DoesNotExist:
            raise Http404
    
    def get(self, request, pk, format=None):
        showtime = self.get_showtime(pk)
        showtime_srl = ShowtimeSerializer(showtime)
        
        seats = Seat.objects.filter(auditorium=showtime.auditorium)

        seats_srl = SeatSerializer(seats, many=True, context={"showtime": showtime})
        return Response(data=(showtime_srl.data, seats_srl.data))
    