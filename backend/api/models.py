from datetime import datetime, timedelta
from django.db import models as m
from django.contrib.auth.models import User

MOVIE_GENRES = {
    
    }

SHOWTIME_STATUS = {
        "A": "Available",
        "F": "Full",
        "E": "Expired"
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
        for reservation in self.reservations.all():
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
    """
    Represents a movie's showtime. Its fields are:
    - movie: a ForeingKey to Movie model.
    - auditorium: a Integer of the auditorium number.
    - start: a Datetime that stores the movie's starting date and time.
    - end: a Datetime that stores the movie's ending date and time.
    - capacity: a Integer of the capacity of the showtime's auditorium remaining capacity.
    - status: a String that represents the showtime's status. It can be either 'available', 'full' or 'expired'.
    """


    movie = m.ForeignKey(Movie, related_name="showtimes", on_delete=m.CASCADE)
    auditorium = m.IntegerField()
    start = m.DateTimeField()
    end = m.DateTimeField()
    capacity = m.IntegerField(default=20)
    status = m.CharField(max_length=10, choices=SHOWTIME_STATUS)

    def __str__(self) -> str:
        return f"{self.movie.title}; {self.auditorium}; start={self.start.hour}:{self.start.minute}; end={self.end.hour}:{self.end.minute}"
    
    def is_available(self, datetime, seats_amount):
        """Checks that the showtime status is available. A showtime will be available if:
        - Is not expired: the current datetime has not passed 15 minutes after the start of the movie.
        - Is not full: the remaining capacity of the showtime's auditorium is higher than the amount of seats to reserve.
        """
        if self.status != "available":
            return False
        
        if datetime > self.start + timedelta(minutes=15):
            self.status = "expired"
            return False

        if self.capacity < seats_amount:
            if self.capacity == 0: self.status = "full"
            return False
        
        return True