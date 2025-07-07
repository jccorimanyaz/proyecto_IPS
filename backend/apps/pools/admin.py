from django.contrib import admin
from .models import Pool

@admin.register(Pool)
class PoolAdmin(admin.ModelAdmin):
    list_display = ('file_number', 'legal_name', 'commercial_name', 'state', 'current_state', 'district')
    search_fields = ('file_number', 'legal_name', 'commercial_name', 'district')
    list_filter = ('state', 'current_state', 'district')