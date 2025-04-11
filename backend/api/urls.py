from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    # Auth.
    path("auth/register/" , views.Register.as_view(), name="register"),
    path("auth/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),

    # User request flow.
    path("movies/", views.MovieList.as_view(), name="movie-list"),
    path("movie/<int:pk>/", views.MovieDetails.as_view(), name="movie-details"),
    path("showtime-seats/<int:pk>/", views.ShowtimeSeats.as_view(), name="showtime-seats"),
    path("reserve/", views.Reserve.as_view(), name="reserve"),

    # Admin.
    path("admin/create-movie/", views.MovieCreate.as_view(), name="create-movie"),
    path("admin/create-showtime/<int:auditorium>/", views.ShowtimeCreate.as_view(), name="create-showtime-get"),
    path("admin/create-showtime/", views.ShowtimeCreate.as_view(), name="create-showtime-post"),
    path("admin/user-list/", views.UserList.as_view(), name="user-list"),
    
    # Generics.
    path("admin/movies/", views.MovieListCreate.as_view(), name="movie-list-create"),
    path("admin/seats/", views.SeatListCreate.as_view(), name="seat-list-create"),
    path("admin/reservations/", views.ReservationListCreate.as_view(), name="reservation-list-create"),
    path("admin/showtimes/", views.ShowtimeListCreate.as_view(), name="showtime-list-create"),
    path("admin/users/", views.UserListCreate.as_view(), name="user-list-create"),
]