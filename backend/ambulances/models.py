from django.db import models
from django.conf import settings
from users.models import CustomUser

class Ambulance(models.Model):
    class Status(models.TextChoices):
        AVAILABLE = 'AVAILABLE', 'Available'
        BUSY = 'BUSY', 'Busy'
        OFF_DUTY = 'OFF_DUTY', 'Off Duty'
        MAINTENANCE = 'MAINTENANCE', 'Maintenance'

    class Type(models.TextChoices):
        BASIC = 'BASIC', 'Basic Life Support'
        ADVANCED = 'ADVANCED', 'Advanced Life Support'
        ICU = 'ICU', 'Mobile ICU'

    vehicle_number = models.CharField(max_length=20, unique=True)
    ambulance_type = models.CharField(max_length=20, choices=Type.choices, default=Type.BASIC)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.AVAILABLE)
    current_driver = models.ForeignKey(
        CustomUser, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        limit_choices_to={'role': 'DRIVER'},
        related_name='assigned_ambulance'
    )
    last_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    last_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.vehicle_number} ({self.ambulance_type})"

class AmbulanceRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending Dispatch'
        ASSIGNED = 'ASSIGNED', 'Ambulance Assigned'
        IN_PROGRESS = 'IN_PROGRESS', 'Trip In Progress'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    class Urgency(models.TextChoices):
        ROUTINE = 'ROUTINE', 'Routine'
        URGENT = 'URGENT', 'Urgent'
        CRITICAL = 'CRITICAL', 'Critical'

    patient_name = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=15)
    pickup_address = models.TextField()
    destination_address = models.TextField(blank=True, null=True)
    urgency = models.CharField(max_length=20, choices=Urgency.choices, default=Urgency.ROUTINE)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    requested_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Request for {self.patient_name} - {self.status}"

class Dispatch(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending Acceptance'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        REJECTED = 'REJECTED', 'Rejected'
        ARRIVED = 'ARRIVED', 'Arrived at Pickup'
        COMPLETED = 'COMPLETED', 'Trip Completed'

    ambulance = models.ForeignKey(Ambulance, on_delete=models.CASCADE, related_name='dispatches')
    request = models.ForeignKey(AmbulanceRequest, on_delete=models.CASCADE, related_name='dispatches')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    
    assigned_time = models.DateTimeField(auto_now_add=True)
    accepted_time = models.DateTimeField(null=True, blank=True)
    arrival_time = models.DateTimeField(null=True, blank=True)
    completion_time = models.DateTimeField(null=True, blank=True)
    
    driver_response = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Dispatch {self.id}: {self.ambulance.vehicle_number} -> {self.request.patient_name}"

class DispatchLog(models.Model):
    dispatch = models.ForeignKey(Dispatch, on_delete=models.CASCADE, related_name='logs')
    action = models.CharField(max_length=50) # e.g., 'ASSIGNED', 'ACCEPTED', 'ARRIVED', 'COMPLETED'
    timestamp = models.DateTimeField(auto_now_add=True)
    performed_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Log {self.id} for Dispatch {self.dispatch_id} ({self.action})"
