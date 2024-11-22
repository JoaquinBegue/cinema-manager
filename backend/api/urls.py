from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("movies/", views.MovieListCreate.as_view(), name="movie-list-create"),
    path("seats/", views.SeatListCreate.as_view(), name="seat-list-create"),
    path("reservations/", views.ReservationListCreate.as_view(), name="reservation-list-create"),
    path("showtimes/", views.ShowtimeListCreate.as_view(), name="showtime-list-create"),
]