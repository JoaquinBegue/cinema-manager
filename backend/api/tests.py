from django.test import TestCase, Client
from rest_framework.test import RequestsClient

from .models import Movie, Seat, Reservation, Showtime, User
from .utils import create_movies, create_showtimes, create_seats, create_reservations, create_users
from .utils import MOVIES, SHOWTIME, SEATS, RESERVED_SEATS


# Test movie listing.
class MoviesTestCase(TestCase):
    def setUp(self) -> None:
        self.client = Client()

        # Create movies.
        self.movies = create_movies()

        # Create 3 showtimes of the first movie.
        self.showtimes = create_showtimes(3, self.movies[0])

        # Create 20 seats in auditorium 1.
        self.seats = create_seats()

        # Create 1 user.
        self.users = create_users(1)
        
    def test_movie_listing(self):
        """Request for all movies."""
        response = self.client.get("/api/movies/")
        self.assertEqual(response.data, MOVIES)


    def test_showtime_listing(self):
        """Request for all showtimes for movie 1"""
        response = self.client.get("/api/movie/1/")
        self.assertEqual(response.data, SHOWTIME)

    
    def test_showtime_seats_listing(self):
        """Request for all seats for showtime 1 at auditorium 1"""
        response = self.client.get("/api/showtime/1/")
        self.assertEqual(response.data, SEATS)

    
    def test_wrong_showtime_seats_listing(self):
        """Request for all seats for showtime 1 at auditorium 1"""
        reservations = create_reservations(self.showtimes[0], self.users[0])
        response = self.client.get("/api/showtime/1/")
        self.assertEqual(response.data, RESERVED_SEATS)