# Django stuff
from django.utils import timezone
from django.contrib.auth.models import User

# DRF stuff
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import NotFound

# API stuff
from .models import Movie, Seat, Reservation, Showtime, MOVIE_GENRES
from .serializers import MovieSerializer, SeatSerializer, ReservationSerializer, ShowtimeSerializer


# Index. List all movies.
class MovieList(generics.ListAPIView):
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Movie.objects.all()
        category = self.request.query_params.get("category")
        if category is not None:
            if category not in MOVIE_GENRES.values():
                raise NotFound("Category not found.")
            queryset = queryset.filter(genre=category)
        return queryset

# Movie page. Get movie info and list all showtimes.
class MovieDetails(APIView):
    """Returns data from the requested movie, such as movie info and the available showtimes."""
    permission_classes = [AllowAny]

    def get_movie(self, pk):
        try:
            return Movie.objects.get(pk=pk)
        except Movie.DoesNotExist:
            raise NotFound("Movie not found.")
    
    def get_showtimes(self, movie):
        showtimes = Showtime.objects.filter(movie=movie, status="available").order_by("start")
        available_showtimes = [
                showtime for showtime in showtimes
                if showtime.is_available(timezone.now(), 0)
        ]

        showtimes_per_day = {}
        for showtime in available_showtimes:
            day = showtime.start.date().strftime("%Y-%m-%d-%A")

            if day in showtimes_per_day:
                showtimes_per_day[day].append(ShowtimeSerializer(showtime).data)
            else:
                showtimes_per_day[day] = [ShowtimeSerializer(showtime).data]

        return showtimes_per_day

    def get(self, request, pk, format=None):
        movie = self.get_movie(pk)
        movie_srl = MovieSerializer(movie)
        return Response({"movie": movie_srl.data, "showtimes": self.get_showtimes(movie)})

# Seat reservation page. List all showtime's seats.
class ShowtimeDetails(APIView):
    """Returns info about the requested showtime and its seats."""
    permission_classes = [AllowAny]

    def get_showtime(self, pk):
        try:
            return Showtime.objects.get(pk=pk, status="available")
        except Showtime.DoesNotExist:
            raise NotFound("Showtime not found.")
    
    def get(self, request, pk, format=None):
        showtime = self.get_showtime(pk)
        showtime_srl = ShowtimeSerializer(showtime)

        movie = showtime.movie
        movie_srl = MovieSerializer(movie)
        
        seats = Seat.objects.filter(auditorium=showtime.auditorium)
        seats_srl = SeatSerializer(seats, many=True, context={"showtime": showtime})

        # Group seats by row.
        seats_by_row = {}
        for seat in seats_srl.data:
            if seat["row"] in seats_by_row:
                seats_by_row[seat["row"]].append(seat)
            else:
                seats_by_row[seat["row"]] = [seat]

        return Response({"showtime": showtime_srl.data, "movie": movie_srl.data, "seats": seats_by_row})

# Reserve endpoint.
class Reserve(APIView):
    permission_classes = [IsAuthenticated]

    def get_showtime(self, pk, seats_amount):
        try:
            showtime = Showtime.objects.get(pk=pk)
            if showtime.is_available(timezone.now(), seats_amount): return showtime
            else: 
                print("Showtime not available.", seats_amount, showtime.capacity)
                raise NotFound("Showtime not available.")
            
        except Showtime.DoesNotExist:
            print("Showtime not found.")
            raise NotFound("Showtime not found.")

    def get_seat(self, pk, showtime):
        try:
            seat = Seat.objects.get(pk=pk)
            if seat.is_available(showtime): return seat
            else: 
                print("Seat not available.")
                raise NotFound(f"Seat {pk} not available.")

        except Seat.DoesNotExist:
            print("Seat not found.")
            raise NotFound(f"Seat {pk} not found.")

    def get(self, request):
        # Get the GET data.
        showtime = request.query_params["showtime"]
        seats = request.query_params["seats"].split(",")
        try:
            seats = [int(s) for s in seats]
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # Get the showtime.
        print(seats)
        showtime = self.get_showtime(showtime, len(seats))

        # Retrieve all seats.
        validated_seats = []
        for seat in seats:
            s = self.get_seat(seat, showtime)
            validated_seats.append(s)

        return Response({"showtime": ShowtimeSerializer(showtime).data,
                         "seats": SeatSerializer(validated_seats, many=True,
                                                 context={"showtime": showtime}).data})

    def post(self, request):
        # Get the POST data.
        seats = request.data["seats"]
        showtime = request.data["showtime"]

        # Get the showtime.
        showtime = self.get_showtime(showtime, len(seats))

        # Retrieve all seats.
        validated_seats = []
        for seat in seats:
            s = self.get_seat(seat, showtime)
            validated_seats.append(s)

        user = request.user

        # Once all seats are successfully retrieved, create the reservation.
        r = Reservation.objects.create(user=user, showtime=showtime)
        r.seats.set(validated_seats)
        r.save()

        # Update showtime capacity.
        showtime.capacity -= len(validated_seats)
        showtime.save()

        return Response(data={"code": r.code}, status=status.HTTP_201_CREATED)

class CancelReservation(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reservation_id = request.query_params["reservation_id"]
        try:
            reservation = Reservation.objects.get(pk=reservation_id)
        except Reservation.DoesNotExist:
            raise NotFound("Reservation not found.")
        
        return Response({"reservation": ReservationSerializer(reservation).data})

    def post(self, request):
        reservation_id = request.data["reservation_id"]
        try:
            reservation = Reservation.objects.get(pk=reservation_id)
            if reservation.user == request.user:
                reservation.status = "cancelled"
                reservation.save()
                return Response(status=status.HTTP_200_OK)

        except Reservation.DoesNotExist:
            raise NotFound("Reservation not found.")



# List all reservations.
class ReservationList(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Reservation.objects.filter(user=self.request.user).order_by("-code")
        return queryset