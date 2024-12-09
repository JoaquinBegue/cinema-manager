from django.contrib import admin
from .models import Movie, Seat, Reservation, Showtime

# Register your models here.
admin.site.register(Movie)
admin.site.register(Seat)
admin.site.register(Reservation)
admin.site.register(Showtime)

# Admin site customization.
admin.site.index_title = "Cinema"
admin.site.site_header = "Cinema Administration"
admin.site.site_title = "Administration"