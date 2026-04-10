from rest_framework import viewsets, permissions
from .models import Department, DoctorProfile, Appointment
from .serializers import DepartmentSerializer, DoctorProfileSerializer, AppointmentSerializer
from users.models import CustomUser

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class DoctorProfileViewSet(viewsets.ModelViewSet):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == CustomUser.Role.ADMIN or user.role == CustomUser.Role.RECEPTIONIST:
            return Appointment.objects.all()
        elif user.role == CustomUser.Role.DOCTOR:
            return Appointment.objects.filter(doctor__user=user)
        elif user.role == CustomUser.Role.PATIENT:
            return Appointment.objects.filter(patient=user)
        return Appointment.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == CustomUser.Role.PATIENT:
            serializer.save(patient=user)
        else:
            serializer.save()
