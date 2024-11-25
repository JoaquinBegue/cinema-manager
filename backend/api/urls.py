from django.urls import path
from . import views

urlpatterns = [
    # Index
    path("", views.index, name="index"),

    # Generics
    path("movies/", views.MovieListCreate.as_view(), name="movie-list-create"),
    path("seats/", views.SeatListCreate.as_view(), name="seat-list-create"),
    path("reservations/", views.ReservationListCreate.as_view(), name="reservation-list-create"),
    path("showtimes/", views.ShowtimeListCreate.as_view(), name="showtime-list-create"),

    # Custom
    path("movie/<int:pk>/", views.MovieDetails.as_view(), name="movie-details"),
    path("showtime/<int:pk>/", views.ShowtimeSeats.as_view(), name="showtime-seats"),
]