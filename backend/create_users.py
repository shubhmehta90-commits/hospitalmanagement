import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import CustomUser

def create_users():
    if CustomUser.objects.count() > 0:
        print("Users already created.")
        return

    admin = CustomUser.objects.create_superuser('admin', 'admin@example.com', 'adminpass')
    admin.role = CustomUser.Role.ADMIN
    admin.first_name = 'System'
    admin.last_name = 'Admin'
    admin.save()
    print("Created Admin user: admin / adminpass")

    doctor = CustomUser.objects.create_user('doctor', 'doctor@example.com', 'doctorpass')
    doctor.role = CustomUser.Role.DOCTOR
    doctor.first_name = 'Sarah'
    doctor.last_name = 'Connor'
    doctor.save()
    print("Created Doctor user: doctor / doctorpass")

    receptionist = CustomUser.objects.create_user('reception', 'reception@example.com', 'receptionpass')
    receptionist.role = CustomUser.Role.RECEPTIONIST
    receptionist.first_name = 'John'
    receptionist.last_name = 'Doe'
    receptionist.save()
    print("Created Receptionist user: reception / receptionpass")

    patient = CustomUser.objects.create_user('patient', 'patient@example.com', 'patientpass')
    patient.role = CustomUser.Role.PATIENT
    patient.first_name = 'Alice'
    patient.last_name = 'Smith'
    patient.save()
    print("Created Patient user: patient / patientpass")

if __name__ == '__main__':
    create_users()
