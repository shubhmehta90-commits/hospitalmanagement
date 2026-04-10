from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Diagnosis, Prescription, MedicalReport
from .serializers import DiagnosisSerializer, PrescriptionSerializer, MedicalReportSerializer

class BaseRecordViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()
        
        if user.role == 'PATIENT':
            return queryset.filter(patient=user)
            
        # For doctors and others, allow filtering by patient_id
        patient_id = self.request.query_params.get('patient')
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
            
        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'PATIENT':
            raise PermissionDenied("Patients cannot create medical records.")
        # If doctor, assign as the creator
        if user.role == 'DOCTOR':
            serializer.save(doctor=user)
        else:
            serializer.save()

class DiagnosisViewSet(BaseRecordViewSet):
    queryset = Diagnosis.objects.all()
    serializer_class = DiagnosisSerializer
    search_fields = ['condition', 'description']
    ordering_fields = ['date_diagnosed', 'created_at']

class PrescriptionViewSet(BaseRecordViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    search_fields = ['medication_name', 'notes']
    ordering_fields = ['date_prescribed', 'created_at']

class MedicalReportViewSet(BaseRecordViewSet):
    queryset = MedicalReport.objects.all()
    serializer_class = MedicalReportSerializer
    search_fields = ['report_type', 'summary']
    ordering_fields = ['date_generated', 'created_at']
