from rest_framework import serializers
from .models import Diagnosis, Prescription, MedicalReport

class DiagnosisSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.full_name', read_only=True)
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)

    class Meta:
        model = Diagnosis
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'doctor']

class PrescriptionSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.full_name', read_only=True)
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)

    class Meta:
        model = Prescription
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'date_prescribed', 'doctor']

class MedicalReportSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.full_name', read_only=True)
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)

    class Meta:
        model = MedicalReport
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'doctor']
