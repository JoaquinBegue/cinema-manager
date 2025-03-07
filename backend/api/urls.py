from django.urls import path
from . import views

urlpatterns = [
    # Index
    path("", views.Index.as_view(), name="index"),

    # Generics.
    path("movies/", views.MovieList.as_view(), name="movie-list"),
    path("seats/", views.SeatListCreate.as_view(), name="seat-list-create"),
    path("reservations/", views.ReservationListCreate.as_view(), name="reservation-list-create"),
    path("showtimes/", views.ShowtimeListCreate.as_view(), name="showtime-list-create"),

    # Custom.
    path("movie/<int:pk>/", views.MovieDetails.as_view(), name="movie-details"),
    path("showtime/<int:pk>/", views.ShowtimeSeats.as_view(), name="showtime-seats"),
    path("reserve/", views.Reserve.as_view(), name="reserve"),
]