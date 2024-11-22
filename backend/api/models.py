from django.db import models as m
from django.contrib.auth.models import User

MOVIE_GENRES = {
    
    }

SHOWTIME_STATUS = {
        "A": "AVAILABLE",
        "F": "FULL",
        "E": "EXPIRED"
    }


# Create your models here.
class Movie(m.Model):
    title = m.CharField(max_length=500)
    genre = m.CharField(max_length=50, choices=MOVIE_GENRES)
    duration = m.IntegerField(verbose_name="duration in minutes")
    director = m.CharField(max_length=255)
    cast = m.CharField(max_length=2500)

    def __str__(self) -> str:
        return f"ID: {self.id}; Title: {self.title}; Genre: {self.genre}."


class Seat(m.Model):
    auditorium = m.IntegerField()
    row = m.CharField(max_length=1)
    column = m.IntegerField()

    def __str__(self) -> str:
        return self.get_code()

    def is_available(self, showtime):
        for reservation in self.reservations:
            if reservation.showtime == showtime:
                return False
            
        return True
    
    def get_code(self):
        return f"A{self.auditorium} {self.row}{self.column}"
    

class Reservation(m.Model):
    user = m.ForeignKey(User, related_name="reservations", on_delete=m.CASCADE)
    showtime = m.ForeignKey("Showtime", related_name="reservations", on_delete=m.CASCADE)
    seat = m.ForeignKey(Seat, related_name="reservations", on_delete=m.CASCADE, null=True)

    def __str__(self) -> str:
        return f"User: {self.user}; Showtime: {self.showtime.start}; Seat: {self.seat}"


class Showtime(m.Model):
    movie = m.ForeignKey(Movie, related_name="showtimes", on_delete=m.CASCADE)
    auditorium = m.IntegerField()
    start = m.DateTimeField()
    end = m.DateTimeField()
    status = m.CharField(max_length=10, choices=SHOWTIME_STATUS)

    def __str__(self) -> str:
        return f"{self.movie.title}; {self.auditorium}; start={self.start.hour}:{self.start.minute}; end={self.end.hour}:{self.end.minute}"