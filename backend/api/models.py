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


class Seat(m.Model):
    auditorium = m.IntegerField()
    row = m.CharField(max_length=1)
    column = m.IntegerField()
    reservations = m.ManyToManyField("Reservation", blank=True, null=True)


    def is_available(self, showtime):
        for reservation in self.reservations:
            if reservation.showtime == showtime:
                return False
            
        return True
    

class Reservation(m.Model):
    user = m.ForeignKey(User, related_name="reservations")
    seat = m.ForeignKey(Seat, related_name="reservations")
    showtime = m.ForeignKey("Showtime", related_name="reservations")


class Showtime(m.Model):
    movie = m.ForeignKey(Movie, related_name="showtimes")
    start = m.DateTimeField()
    end = m.DateTimeField()
    status = m.CharField(max_length=10, choices=SHOWTIME_STATUS)