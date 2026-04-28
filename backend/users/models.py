from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    """
    Custom User model with role-based access for the Hospital Management System.
    Roles: Admin, Doctor, Receptionist, Patient
    """

    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        DOCTOR = 'DOCTOR', 'Doctor'
        RECEPTIONIST = 'RECEPTIONIST', 'Receptionist'
        PATIENT = 'PATIENT', 'Patient'
        DRIVER = 'DRIVER', 'Ambulance Driver'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.PATIENT,
        help_text='Designates the role of this user in the system.',
    )
    phone_number = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        help_text='Contact phone number.',
    )
    date_of_birth = models.DateField(
        blank=True,
        null=True,
        help_text='Date of birth.',
    )
    address = models.TextField(
        blank=True,
        null=True,
        help_text='Residential address.',
    )
    profile_picture = models.URLField(
        blank=True,
        null=True,
        help_text='URL to profile picture.',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username
