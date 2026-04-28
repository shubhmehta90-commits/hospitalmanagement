from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AmbulanceViewSet, AmbulanceRequestViewSet, DispatchViewSet

router = DefaultRouter()
router.register(r'ambulances', AmbulanceViewSet)
router.register(r'requests', AmbulanceRequestViewSet)
router.register(r'dispatches', DispatchViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
