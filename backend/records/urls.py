from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DiagnosisViewSet, PrescriptionViewSet, MedicalReportViewSet

router = DefaultRouter()
router.register(r'diagnoses', DiagnosisViewSet)
router.register(r'prescriptions', PrescriptionViewSet)
router.register(r'reports', MedicalReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
