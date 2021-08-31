from django.contrib import admin
from .models import Center

# Register your models here.
class CenterAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'email', 'joined_date')

admin.site.register(Center,CenterAdmin)