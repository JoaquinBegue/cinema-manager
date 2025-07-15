from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'movies', views.MovieViewSet)
router.register(r'showtimes', views.ShowtimeViewSet)
router.register(r'reservations', views.ReservationViewSet)
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

# list objects: GET /admin/objects/
# retrieve object: GET /admin/objects/<id> 
# create object: POST /admin/objects/
# update object: PUT /admin/objects/<id> 
# delete object: DELETE /admin/objects/<id> 