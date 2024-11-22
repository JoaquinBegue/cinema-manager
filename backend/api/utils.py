from django.contrib.auth.models import User
from .models import *
from datetime import datetime, timedelta
from random import choice

### WORKFLOW

# Display movies

# Display movie showtimes

# Display showtime available seats

# Reserve seat


### GENERATOR FUNCTIONS

# Create movies

MOVIES = [
    { "title": "The Matrix", "genre": "Science Fiction", "duration": 136, "director": "Lana Wachowski, Lilly Wachowski", "cast": "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, Joe Pantoliano" },
    { "title": "Inception", "genre": "Action", "duration": 148,  "director": "Christopher Nolan", "cast": "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page, Tom Hardy, Ken Watanabe" },
    { "title": "The Shawshank Redemption", "genre": "Drama", "duration": 142,  "director": "Frank Darabont", "cast": "Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler, Clancy Brown" },
    { "title": "The Godfather", "genre": "Crime", "duration": 175,  "director": "Francis Ford Coppola", "cast": "Marlon Brando, Al Pacino, James Caan, Richard S. Castellano, Robert Duvall" },
    { "title": "Pulp Fiction", "genre": "Crime", "duration": 154,  "director": "Quentin Tarantino", "cast": "John Travolta, Uma Thurman, Samuel L. Jackson, Bruce Willis, Ving Rhames" }
]


# MOVIES
def create_movies(movies):
    for movie in movies:
        m = Movie(
            title=movie["title"],
            genre=movie["genre"],
            duration=movie["duration"],
            director=movie["director"],
            cast=movie["cast"],
        )
        m.save()

def list_movies():
    for movie in Movie.objects.all():
        print(movie, movie.duration)

# SEATS
def create_seats():
    # Create 20 seats in 5 auditoriums. 5 seats in 4 rows.
    for auditorium in range(5):
        for row in ["A", "B", "C", "D"]:
            for column in range(5):
                s = Seat(
                    auditorium=auditorium+1,
                    row=row,
                    column=column+1,
                )
                s.save()

def list_seats(limit=None, step=None):
    for seat in Seat.objects.all()[:limit:step]:
        print(seat)

# USERS
def create_users(amount):
    # Create users.
    for n in range(amount):
        new_user = User.objects.create_user(username=f"user{n}", password="12345")
    
    print(f"{amount} users created successfully")


# SHOWTIMES
def create_showtimes():
    for auditorium in range(5):
        start = datetime(2024, 12, 1, 12)
        for showtime in range(3):
            movie = choice(Movie.objects.all())
            end = start + timedelta(minutes=movie.duration) + timedelta(minutes=15)
            s = Showtime(
                movie=movie,
                auditorium=auditorium+1,
                start=start,
                end=end,
                status="available"
                )
            s.save()
            start += timedelta(minutes=movie.duration) + timedelta(minutes=15)

def list_showtimes():
    for showtime in Showtime.objects.all():
        print(showtime)


# RESERVATIONS
def create_reservations():
    for showtime in Showtime.objects.all():
        auditorium = showtime.auditorium
        seats = Seat.objects.filter(auditorium=auditorium)
        for reservation in range(3):
            user = choice(User.objects.all())
            r = Reservation(user=user, showtime=showtime, seat=seats[reservation])
            r.save()

def list_reservations():
    for reservation in Reservation.objects.all():
        print(reservation)