from django.contrib.auth.models import User, AnonymousUser
from .models import *
from datetime import datetime, timedelta
from random import choice
from rest_framework.test import APIRequestFactory

### WORKFLOW

# Display movies

# Display movie showtimes

# Display showtime available seats

# Reserve seat


### GENERATOR FUNCTIONS

# Create movies

MOVIES = (
    {"id": 1, "title": "The Matrix", "genre": "Science Fiction", "duration": 136, "director": "Lana Wachowski, Lilly Wachowski", "cast": "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, Joe Pantoliano" },
    {"id": 2, "title": "Inception", "genre": "Action", "duration": 148,  "director": "Christopher Nolan", "cast": "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page, Tom Hardy, Ken Watanabe" },
    {"id": 3, "title": "The Shawshank Redemption", "genre": "Drama", "duration": 142,  "director": "Frank Darabont", "cast": "Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler, Clancy Brown" },
    {"id": 4, "title": "The Godfather", "genre": "Crime", "duration": 175,  "director": "Francis Ford Coppola", "cast": "Marlon Brando, Al Pacino, James Caan, Richard S. Castellano, Robert Duvall" },
    {"id": 5, "title": "Pulp Fiction", "genre": "Crime", "duration": 154,  "director": "Quentin Tarantino", "cast": "John Travolta, Uma Thurman, Samuel L. Jackson, Bruce Willis, Ving Rhames" }
)

SHOWTIME = (
    {'id': 1, 'title': 'The Matrix', 'genre': 'Science Fiction', 'duration': 136, 'director': 'Lana Wachowski, Lilly Wachowski', 'cast': 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, Joe Pantoliano'},
        [
            {'id': 1, 'auditorium': 1, 'start': '2024-12-01T12:00:00Z', 'end': '2024-12-01T14:31:00Z', 'capacity': 20, 'status': 'available', 'movie': 1},
            {'id': 2, 'auditorium': 1, 'start': '2024-12-01T14:31:00Z', 'end': '2024-12-01T17:02:00Z', 'capacity': 20, 'status': 'available', 'movie': 1},
            {'id': 3, 'auditorium': 1, 'start': '2024-12-01T17:02:00Z', 'end': '2024-12-01T19:33:00Z', 'capacity': 20, 'status': 'available', 'movie': 1}
        ]
)

SEATS = ({'id': 1, 'auditorium': 1, 'start': '2024-12-01T12:00:00Z', 'end': '2024-12-01T14:31:00Z', 'capacity': 20, 'status': 'available', 'movie': 1}, [{'id': 1, 'available': True, 'auditorium': 1, 'row': 'A', 'column': 1}, {'id': 2, 'available': True, 'auditorium': 1, 'row': 'A', 'column': 2}, {'id': 3, 'available': True, 'auditorium': 1, 'row': 'A', 'column': 3}, {'id': 4, 'available': True, 'auditorium': 1, 'row': 'A', 'column': 4}, {'id': 5, 'available': True, 'auditorium': 1, 'row': 'A', 'column': 5}, {'id': 6, 'available': True, 'auditorium': 1, 'row': 'B', 'column': 1}, {'id': 7, 'available': True, 'auditorium': 1, 'row': 'B', 'column': 2}, {'id': 8, 'available': True, 'auditorium': 1, 'row': 'B', 'column': 3}, {'id': 9, 'available': True, 'auditorium': 1, 'row': 'B', 'column': 4}, {'id': 10, 'available': True, 'auditorium': 1, 'row': 'B', 'column': 5}, {'id': 11, 'available': True, 'auditorium': 1, 'row': 'C', 'column': 1}, {'id': 12, 'available': True, 'auditorium': 1, 'row': 'C', 'column': 2}, {'id': 13, 'available': True, 'auditorium': 1, 'row': 'C', 'column': 3}, {'id': 14, 'available': True, 'auditorium': 1, 'row': 'C', 'column': 4}, {'id': 15, 'available': True, 'auditorium': 1, 'row': 'C', 'column': 5}, {'id': 16, 'available': True, 'auditorium': 1, 'row': 'D', 'column': 1}, {'id': 17, 'available': True, 'auditorium': 1, 'row': 'D', 'column': 2}, {'id': 18, 'available': True, 'auditorium': 1, 'row': 'D', 'column': 3}, {'id': 19, 'available': True, 'auditorium': 1, 'row': 'D', 'column': 4}, {'id': 20, 'available': True, 'auditorium': 1, 'row': 'D', 'column': 5}])

RESERVED_SEATS = ({'id': 1, 'auditorium': 1, 'start': '2024-12-01T12:00:00Z', 'end': '2024-12-01T14:31:00Z', 'capacity': 20, 'status': 'available', 'movie': 1}, [{'id': 1, 'available': False, 'auditorium': 1, 'row': 'A', 'column': 1}, {'id': 2, 'available': False, 'auditorium': 1, 'row': 'A', 'column': 2}, {'id': 3, 'available': False, 'auditorium': 1, 'row': 'A', 'column': 3}, {'id': 4, 'available': True, 'auditorium': 1, 'row': 'A', 'column': 4}, {'id': 5, 'available': True, 'auditorium': 1, 'row': 'A', 'column': 5}, {'id': 6, 'available': True, 'auditorium': 1, 'row': 'B', 'column': 1}, {'id': 7, 'available': True, 'auditorium': 1, 'row': 'B', 'column': 2}, {'id': 8, 'available': True, 'auditorium': 1, 'row': 'B', 'column': 3}, {'id': 9, 'available': True, 'auditorium': 1, 'row': 'B', 'column': 4}, {'id': 10, 'available': True, 'auditorium': 1, 'row': 'B', 'column': 5}, {'id': 11, 'available': True, 'auditorium': 1, 'row': 'C', 'column': 1}, {'id': 12, 'available': True, 'auditorium': 1, 'row': 'C', 'column': 2}, {'id': 13, 'available': True, 'auditorium': 1, 'row': 'C', 'column': 3}, {'id': 14, 'available': True, 'auditorium': 1, 'row': 'C', 'column': 4}, {'id': 15, 'available': True, 'auditorium': 1, 'row': 'C', 'column': 5}, {'id': 16, 'available': True, 'auditorium': 1, 'row': 'D', 'column': 1}, {'id': 17, 'available': True, 'auditorium': 1, 'row': 'D', 'column': 2}, {'id': 18, 'available': True, 'auditorium': 1, 'row': 'D', 'column': 3}, {'id': 19, 'available': True, 'auditorium': 1, 'row': 'D', 'column': 4}, {'id': 20, 'available': True, 'auditorium': 1, 'row': 'D', 'column': 5}])
# MOVIES
def create_movies():
    movies = []
    for movie in MOVIES:
        m = Movie.objects.create(
            title=movie["title"],
            genre=movie["genre"],
            duration=movie["duration"],
            director=movie["director"],
            cast=movie["cast"],
        )
        movies.append(m)

    return movies

# SHOWTIMES
def create_showtimes(n, movie):
    showtimes = []
    start = datetime(2024, 12, 1, 12)
    for showtime in range(n):
        end = start + timedelta(minutes=movie.duration) + timedelta(minutes=15)
        s = Showtime.objects.create(
            movie=movie,
            auditorium=1,
            start=start,
            end=end,
            status="available"
        )
        showtimes.append(s)
        start += timedelta(minutes=movie.duration) + timedelta(minutes=15)

    return showtimes

# SEATS
def create_seats():
    # Create 20 seats in 5 auditoriums. 5 seats in 4 rows.
    seats = []
    for row in ["A", "B", "C", "D"]:
        for column in range(5):
            s = Seat.objects.create(
                auditorium=1,
                row=row,
                column=column+1,
            )
            seats.append(s)

    return seats

# USERS
def create_users(amount):
    # Create users.
    users = []
    for n in range(amount):
        u = User.objects.create_user(username=f"user{n}", password="12345")
        users.append(u)

    return users
    

# RESERVATIONS
def create_reservations(showtime, user):
    reservations = []
    auditorium = showtime.auditorium
    seats = Seat.objects.filter(auditorium=auditorium)
    for reservation in range(3):
        r = Reservation.objects.create(user=user, showtime=showtime, seat=seats[reservation])
        reservations.append(r)

    return reservations

def testing():
    factory = APIRequestFactory()
    request = factory.get("/api/movies")
    print(request)