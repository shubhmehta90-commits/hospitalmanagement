-- 🏥 Hospital Management System Dummy Data Seed
-- This script adds placeholder data for testing the UI.
-- Note: These entries will not be linkable to real Auth accounts, but they will show up in the Dashboard and Lists.

-- 1. Create Placeholder Profiles
INSERT INTO profiles (id, full_name, email, role) VALUES
('d1111111-1111-1111-1111-111111111111', 'Dr. Sarah Smith', 'dr.smith@example.com', 'doctor'),
('d2222222-2222-2222-2222-222222222222', 'Dr. Michael Jones', 'dr.jones@example.com', 'doctor'),
('p1111111-1111-1111-1111-111111111111', 'John Doe', 'john.doe@example.com', 'patient'),
('p2222222-2222-2222-2222-222222222222', 'Jane Wilson', 'jane.wilson@example.com', 'patient'),
('a1111111-1111-1111-1111-111111111111', 'System Admin', 'admin@example.com', 'admin')
ON CONFLICT (id) DO NOTHING;

-- 2. Create Placeholder Doctors
INSERT INTO doctors (id, specialization, experience) VALUES
('d1111111-1111-1111-1111-111111111111', 'Cardiology', 12),
('d2222222-2222-2222-2222-222222222222', 'Pediatrics', 8)
ON CONFLICT (id) DO NOTHING;

-- 3. Create Placeholder Patients
INSERT INTO patients (id, age, gender) VALUES
('p1111111-1111-1111-1111-111111111111', 34, 'male'),
('p2222222-2222-2222-2222-222222222222', 28, 'female')
ON CONFLICT (id) DO NOTHING;

-- 4. Create Placeholder Appointments
INSERT INTO appointments (doctor_id, patient_id, date, time, status, reason) VALUES
('d1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', '2026-05-10', '10:00:00', 'confirmed', 'Regular Heart Checkup'),
('d1111111-1111-1111-1111-111111111111', 'p2222222-2222-2222-2222-222222222222', '2026-05-12', '11:30:00', 'pending', 'Chest Pain Consultation'),
('d2222222-2222-2222-2222-222222222222', 'p1111111-1111-1111-1111-111111111111', '2026-05-15', '09:00:00', 'confirmed', 'Follow-up visit');

-- 5. Create Placeholder Medical Records
INSERT INTO medical_records (patient_id, doctor_id, type, title, content) VALUES
('p1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'diagnosis', 'Stable Hypertension', 'Patient shows stable blood pressure. Continue current medication.'),
('p1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'prescription', 'Lisinopril 10mg', 'Take 1 tablet daily in the morning.'),
('p2222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', 'report', 'Blood Test Results', 'All parameters within normal range.');
