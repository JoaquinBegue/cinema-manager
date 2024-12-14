from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from django.contrib.auth.models import User, Group

from .forms import CustomUserForm
from .models import Movie, Seat, Reservation, Showtime

class CinemaAdminSite(admin.AdminSite):
    """Admin site for cinema staff. This site provides Movies, Reservations and
    Showtimes management, along with a restricted User management."""
    # Admin site customization.
    index_title = "Cinema"
    site_header = "Cinema Administration"
    site_title = "Administration"

class CustomUserAdmin(DefaultUserAdmin):
    form = CustomUserForm
    add_form = CustomUserForm
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "email")}),
        ("Groups", {"fields": ("groups",)}),
    )
    
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "password", "first_name", "last_name", "email", "groups"),
        }),
    )

    def has_module_permission(self, request):
        return request.user.groups.filter(name="admin").exists()

    def get_queryset(self, request):
        qs = super(CustomUserAdmin, self).get_queryset(request)
        if request.user.groups.filter(name="admin").exists():
            return qs
        return qs.none()
    

# CinemaAdminSite model register.
cinema_admin_site = CinemaAdminSite(name="cinema_admin_site")
cinema_admin_site.register(User, CustomUserAdmin)

cinema_admin_site.register(Movie)
cinema_admin_site.register(Reservation)
cinema_admin_site.register(Showtime)

# Django admin site model register.
admin.site.register(Movie)
admin.site.register(Seat)
admin.site.register(Reservation)
admin.site.register(Showtime)