"""
URL configuration for Hospital Management System.
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('api/records/', include('records.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
