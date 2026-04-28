-- 🏥 Hospital Management System Dummy Data Seed
-- This script adds placeholder data for testing the UI.

-- 1. Create Placeholder Profiles
INSERT INTO profiles (id, full_name, email, role) VALUES
('11111111-1111-4111-a111-111111111111', 'Dr. Sarah Smith', 'dr.smith@example.com', 'doctor'),
('22222222-2222-4222-a222-222222222222', 'Dr. Michael Jones', 'dr.jones@example.com', 'doctor'),
('33333333-3333-4333-a333-333333333333', 'John Doe', 'john.doe@example.com', 'patient'),
('44444444-4444-4444-a444-444444444444', 'Jane Wilson', 'jane.wilson@example.com', 'patient'),
('55555555-5555-4555-a555-555555555555', 'System Admin', 'admin@example.com', 'admin')
ON CONFLICT (id) DO NOTHING;

-- 2. Create Placeholder Doctors
INSERT INTO doctors (id, specialization, experience) VALUES
('11111111-1111-4111-a111-111111111111', 'Cardiology', 12),
('22222222-2222-4222-a222-222222222222', 'Pediatrics', 8)
ON CONFLICT (id) DO NOTHING;

-- 3. Create Placeholder Patients
INSERT INTO patients (id, age, gender) VALUES
('33333333-3333-4333-a333-333333333333', 34, 'male'),
('44444444-4444-4444-a444-444444444444', 28, 'female')
ON CONFLICT (id) DO NOTHING;

-- 4. Create Placeholder Appointments
INSERT INTO appointments (doctor_id, patient_id, date, time, status, reason) VALUES
('11111111-1111-4111-a111-111111111111', '33333333-3333-4333-a333-333333333333', '2026-05-10', '10:00:00', 'confirmed', 'Regular Heart Checkup'),
('11111111-1111-4111-a111-111111111111', '44444444-4444-4444-a444-444444444444', '2026-05-12', '11:30:00', 'pending', 'Chest Pain Consultation'),
('22222222-2222-4222-a222-222222222222', '33333333-3333-4333-a333-333333333333', '2026-05-15', '09:00:00', 'confirmed', 'Follow-up visit');

-- 5. Create Placeholder Medical Records
INSERT INTO medical_records (patient_id, doctor_id, type, title, content) VALUES
('33333333-3333-4333-a333-333333333333', '11111111-1111-4111-a111-111111111111', 'diagnosis', 'Stable Hypertension', 'Patient shows stable blood pressure. Continue current medication.'),
('33333333-3333-4333-a333-333333333333', '11111111-1111-4111-a111-111111111111', 'prescription', 'Lisinopril 10mg', 'Take 1 tablet daily in the morning.'),
('44444444-4444-4444-a444-444444444444', '22222222-2222-4222-a222-222222222222', 'report', 'Blood Test Results', 'All parameters within normal range.');
