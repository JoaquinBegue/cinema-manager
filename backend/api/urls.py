from django.urls import path
from . import views

urlpatterns = [
    path("movies/", views.MovieList.as_view(), name="movie-list"),
    path("movie/<int:pk>/", views.MovieDetails.as_view(), name="movie-details"),
    path("showtime/<int:pk>/", views.ShowtimeDetails.as_view(), name="showtime-details"),
    path("reserve/", views.Reserve.as_view(), name="reserve"),
    path("cancel-reservation/", views.CancelReservation.as_view(), name="cancel-reservation"),
    path("reservations/", views.ReservationList.as_view(), name="reservation-list"),
]