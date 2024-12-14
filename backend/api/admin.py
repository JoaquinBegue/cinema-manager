from django.contrib import admin
from django.contrib.auth.models import User, Group

from .models import Movie, Seat, Reservation, Showtime

class UserAdmin(admin.ModelAdmin):
    
    @admin.action(description="Make admin.")
    def make_admin(self, request, queryset):
        admin_group = Group.objects.get(name="admin")
        for user in queryset:
            user.groups.add(admin_group)
    

# Register your models here.
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Movie)
admin.site.register(Seat)
admin.site.register(Reservation)
admin.site.register(Showtime)

# Admin site customization.
admin.site.index_title = "Cinema"
admin.site.site_header = "Cinema Administration"
admin.site.site_title = "Administration"