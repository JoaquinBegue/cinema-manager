# Python stuff
from datetime import datetime
from random import choice

# Django stuff
from django.shortcuts import render
from django.http import Http404
from django.utils import timezone

# DRF stuff
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# API stuff
from .models import Movie, Seat, Reservation, Showtime, User
from .serializers import MovieSerializer, SeatSerializer, ReservationSerializer, ShowtimeSerializer

def index(request):
    if request.method == "GET":
        return render(request, "api/index.html")


class MovieList(generics.ListAPIView):
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
    """Returns data from the requested movie, such as movie info and the available showtimes."""
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
    """Returns all the seats for a requested showtime."""
    def get_showtime(self, pk):
        try:
            return Showtime.objects.get(pk=pk, status="available")
        except Showtime.DoesNotExist:
            raise Http404
    
    def get(self, request, pk, format=None):
        showtime = self.get_showtime(pk)
        showtime_srl = ShowtimeSerializer(showtime)
        
        seats = Seat.objects.filter(auditorium=showtime.auditorium)

        seats_srl = SeatSerializer(seats, many=True, context={"showtime": showtime})
        return Response(data=(showtime_srl.data, seats_srl.data))
    

class Reserve(APIView):
    def get_showtime(self, pk, seats_amount):
        try:
            showtime = Showtime.objects.get(pk=pk)
            if showtime.is_available(timezone.now(), seats_amount): return showtime
            else: 
                print("Showtime not available", showtime.start)
                raise Http404
            
        except Showtime.DoesNotExist:
            print("Showtime.DoesNotExist")
            raise Http404

    def get_seat(self, pk, showtime):
        try:
            seat = Seat.objects.get(pk=pk)
            if seat.is_available(showtime): return seat
            else: raise Http404

        except Seat.DoesNotExist:
            print("Seat.DoesNotExist")
            raise Http404

    def post(self, request):
        # Get the POST data.
        seats = request.data["seats"]
        showtime = request.data["showtime"]

        # Get the showtime.
        showtime = self.get_showtime(showtime, len(seats))

        # Create the reservations.
        reservations = []
        ### TEMPORAL: Get a dummy user.
        user = choice(User.objects.all())
        for seat in seats:
            s = self.get_seat(seat, showtime)
            r = Reservation(user=user, seat=s, showtime=showtime)
            reservations.append(r)

        # Once all reservations are successfully created, save them.
        for r in reservations: r.save()

        return Response(status=status.HTTP_201_CREATED)