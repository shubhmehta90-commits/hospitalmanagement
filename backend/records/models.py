from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Diagnosis(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='diagnoses', limit_choices_to={'role': 'PATIENT'})
    doctor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='diagnosed_cases', limit_choices_to={'role': 'DOCTOR'})
    condition = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    date_diagnosed = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=[('ACTIVE', 'Active'), ('RESOLVED', 'Resolved'), ('CHRONIC', 'Chronic')],
        default='ACTIVE'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_diagnosed', '-created_at']
        verbose_name_plural = 'Diagnoses'

    def __str__(self):
        return f"{self.condition} - {self.patient.username}"


class Prescription(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescriptions', limit_choices_to={'role': 'PATIENT'})
    doctor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='prescribed_medicines', limit_choices_to={'role': 'DOCTOR'})
    medication_name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100, help_text="e.g., Twice a day")
    duration = models.CharField(max_length=100, help_text="e.g., 7 days")
    notes = models.TextField(blank=True, null=True)
    date_prescribed = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_prescribed', '-created_at']

    def __str__(self):
        return f"{self.medication_name} for {self.patient.username}"


class MedicalReport(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medical_reports', limit_choices_to={'role': 'PATIENT'})
    doctor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='uploaded_reports', limit_choices_to={'role': 'DOCTOR'})
    report_type = models.CharField(max_length=100, help_text="e.g., Blood Test, X-Ray")
    summary = models.TextField(blank=True, null=True)
    document_url = models.URLField(max_length=500, blank=True, null=True, help_text="Link to the report document")
    date_generated = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_generated', '-created_at']

    def __str__(self):
        return f"{self.report_type} - {self.patient.username}"
