from django.contrib.auth.models import User, AnonymousUser
from django.utils import timezone
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
def create_showtimes(movie):
    """Create 15 showtimes for the provided movie. 3 showtimes per day for 5 days."""
    showtimes = []
    start = timezone.make_aware(datetime.now())
    for day in range(5):
        movie_start = start
        for showtime in range(3):
            movie_duration = timedelta(minutes=movie.duration) + timedelta(minutes=15)
            end = movie_start + movie_duration
            s = Showtime.objects.create(
                movie=movie,
                auditorium=1,
                start=movie_start,
                end=end,
                status="available"
            )
            showtimes.append(s)
            movie_start += movie_duration
        start += timedelta(days=1)

    return showtimes

# SEATS
def create_seats():
    # Create 20 seats in 5 auditoriums. 5 seats in 4 rows.
    seats = []
    for row in ["A", "B", "C", "D", "E", "F"]:
        for column in range(8):
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

from django.contrib.auth.models import User, Group, Permission
from django.contrib.contenttypes.models import ContentType


def test():
    content_type = ContentType.objects.get_for_model(User)
    permissions = Permission.objects.filter(
        content_type=content_type,
    )
    for p in permissions.all():
        print(p)


from api.models import Movie 
from api.utils import create_showtimes
m = Movie.objects.get(title="The Matrix")
create_showtimes(m)

from api.models import Seat 
from api.utils import create_seats
Seat.objects.all().delete()
create_seats()

seats_by_row = {
    'A': [
        {'id': 449, 'available': True, 'auditorium': 1, 'row': 'A', 'column': 1},
        {'id': 450, 'available': True, 'auditorium': 1, 'row': 'A', 'column': 2},
        {'id': 451, 'available': True, 'auditorium': 1, 'row': 'A', 'column': 3},
        {'id': 452, 'available': True, 'auditorium': 1, 'row': 'A', 'column': 4},
        {'id': 453, 'available': True, 'auditorium': 1, 'row': 'A', 'column': 5},
        {'id': 454, 'available': True, 'auditorium': 1, 'row': 'A', 'column': 6},
        {'id': 455, 'available': True, 'auditorium': 1, 'row': 'A', 'column': 7},
        {'id': 456, 'available': True, 'auditorium': 1, 'row': 'A', 'column': 8}
    ],
    'B': [
        {'id': 457, 'available': True, 'auditorium': 1, 'row': 'B', 'column': 1},
        {'id': 458, 'available': True, 'auditorium': 1, 'row': 'B', 'column': 2},
        {'id': 459, 'available': True, 'auditorium': 1, 'row': 'B', 'column': 3},
        {'id': 460, 'available': True, 'auditorium': 1, 'row': 'B', 'column': 4},
        {'id': 461, 'available': True, 'auditorium': 1, 'row': 'B', 'column': 5},
        {'id': 462, 'available': True, 'auditorium': 1, 'row': 'B', 'column': 6},
        {'id': 463, 'available': True, 'auditorium': 1, 'row': 'B', 'column': 7},
        {'id': 464, 'available': True, 'auditorium': 1, 'row': 'B', 'column': 8}
    ],
    'C': [
        {'id': 465, 'available': True, 'auditorium': 1, 'row': 'C', 'column': 1},
        {'id': 466, 'available': True, 'auditorium': 1, 'row': 'C', 'column': 2},
        {'id': 467, 'available': True, 'auditorium': 1, 'row': 'C', 'column': 3},
        {'id': 468, 'available': True, 'auditorium': 1, 'row': 'C', 'column': 4},
        {'id': 469, 'available': True, 'auditorium': 1, 'row': 'C', 'column': 5},
        {'id': 470, 'available': True, 'auditorium': 1, 'row': 'C', 'column': 6},
        {'id': 471, 'available': True, 'auditorium': 1, 'row': 'C', 'column': 7},
        {'id': 472, 'available': True, 'auditorium': 1, 'row': 'C', 'column': 8}
    ],
    'D': [
        {'id': 473, 'available': True, 'auditorium': 1, 'row': 'D', 'column': 1},
        {'id': 474, 'available': True, 'auditorium': 1, 'row': 'D', 'column': 2},
        {'id': 475, 'available': True, 'auditorium': 1, 'row': 'D', 'column': 3},
        {'id': 476, 'available': True, 'auditorium': 1, 'row': 'D', 'column': 4},
        {'id': 477, 'available': True, 'auditorium': 1, 'row': 'D', 'column': 5},
        {'id': 478, 'available': True, 'auditorium': 1, 'row': 'D', 'column': 6},
        {'id': 479, 'available': True, 'auditorium': 1, 'row': 'D', 'column': 7},
        {'id': 480, 'available': True, 'auditorium': 1, 'row': 'D', 'column': 8}
    ],
    'E': [
        {'id': 481, 'available': True, 'auditorium': 1, 'row': 'E', 'column': 1},
        {'id': 482, 'available': True, 'auditorium': 1, 'row': 'E', 'column': 2},
        {'id': 483, 'available': True, 'auditorium': 1, 'row': 'E', 'column': 3},
        {'id': 484, 'available': True, 'auditorium': 1, 'row': 'E', 'column': 4},
        {'id': 485, 'available': True, 'auditorium': 1, 'row': 'E', 'column': 5},
        {'id': 486, 'available': True, 'auditorium': 1, 'row': 'E', 'column': 6},
        {'id': 487, 'available': True, 'auditorium': 1, 'row': 'E', 'column': 7},
        {'id': 488, 'available': True, 'auditorium': 1, 'row': 'E', 'column': 8}
    ],
    'F': [
        {'id': 489, 'available': True, 'auditorium': 1, 'row': 'F', 'column': 1},
        {'id': 490, 'available': True, 'auditorium': 1, 'row': 'F', 'column': 2},
        {'id': 491, 'available': True, 'auditorium': 1, 'row': 'F', 'column': 3},
        {'id': 492, 'available': True, 'auditorium': 1, 'row': 'F', 'column': 4},
        {'id': 493, 'available': True, 'auditorium': 1, 'row': 'F', 'column': 5},
        {'id': 494, 'available': True, 'auditorium': 1, 'row': 'F', 'column': 6},
        {'id': 495, 'available': True, 'auditorium': 1, 'row': 'F', 'column': 7},
        {'id': 496, 'available': True, 'auditorium': 1, 'row': 'F', 'column': 8}
    ]
}