from datetime import datetime, timedelta
from django.db import models as m
from django.contrib.auth.models import User

MOVIE_TICKET_VALUE = 12

# Create your models here.
class Movie(m.Model):
    class MovieGenres(m.TextChoices):
        ACTION = "action"
        ADVENTURE = "adventure"
        ANIMATION = "animation"
        COMEDY = "comedy"
        CRIME = "crime"
        DOCUMENTARY = "documentary"
        DRAMA = "drama"
        FANTASY = "fantasy"
        HORROR = "horror"
        ROMANCE = "romance"
        SCIENCE_FICTION = "science fiction"
        THRILLER = "thriller"

    title = m.CharField(max_length=500)
    synopsis = m.CharField(max_length=1000)
    poster = m.ImageField(default="default_poster.jpg", upload_to="images/posters/")
    genre = m.CharField(max_length=50, choices=MovieGenres.choices)
    duration = m.IntegerField(verbose_name="duration in minutes")
    director = m.CharField(max_length=255)
    cast = m.CharField(max_length=2500)
    trailer_url = m.CharField(max_length=1000)

    def __str__(self) -> str:
        return f"ID: {self.id}; Title: {self.title}."


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
    code = m.CharField(max_length=11, unique=True, editable=False)
    user = m.ForeignKey(User, related_name="reservations", on_delete=m.CASCADE)
    showtime = m.ForeignKey("Showtime", related_name="reservations", on_delete=m.CASCADE)
    seats = m.ManyToManyField(Seat, related_name="reservations", blank=True)
    status = m.CharField(max_length=9, default="valid")

    def check_status(self):
        if self.showtime.status == "expired":
            self.status = "expired"
            self.save()

    def save(self, *args, **kwargs):
        if not self.code:
            # Generate code format: YYMMDDSSS.
            # YY = Year, MM = Month, DD = Day, SSS = Sequential number.
            date = self.showtime.start.strftime("%y%m%d")

            # Get count of reservations plus 1.
            count = Reservation.objects.all().count() + 1
            
            # Combine date and sequence (padded to 3 digits).
            self.code = f"{date}{str(count).zfill(3)}"
            
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"Code: {self.code}; User: {self.user}; Showtime: {self.showtime.start}"


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

    SHOWTIME_STATUS = {
        "A": "Available",
        "F": "Full",
        "E": "Expired"
    }

    movie = m.ForeignKey(Movie, related_name="showtimes", on_delete=m.CASCADE)
    auditorium = m.IntegerField()
    start = m.DateTimeField()
    end = m.DateTimeField(blank=True, null=True)
    capacity = m.IntegerField(default=48)
    status = m.CharField(default="available", max_length=10, choices=SHOWTIME_STATUS)

    def save(self, *args, **kwargs):
        if self.start and self.movie:
            # Calculate end time: start time + movie duration + 15 minutes
            self.end = self.start + timedelta(minutes=self.movie.duration + 15)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.id}; {self.movie.title}; {self.auditorium}; start={self.start}:{self.start.minute}; end={self.end.hour}:{self.end.minute}"

    def is_available(self, datetime, seats_amount):
        """Checks that the showtime status is available. A showtime will be available if:
        - Is not expired: the current datetime has not passed 15 minutes after the start of the movie.
        - Is not full: the remaining capacity of the showtime's auditorium is higher than the amount of seats to reserve.
        """
        if self.status != "available":
            return False
        
        if self.start + timedelta(minutes=15) < datetime:
            self.status = "expired"
            return False

        if self.capacity < seats_amount:
            if self.capacity == 0: self.status = "full"
            return False
        
        return True
    
    def get_revenue(self):
        """Returns the revenue for the requested showtime."""

        return self.reservations.count() * MOVIE_TICKET_VALUE

    get_revenue.short_description = "Revenue"