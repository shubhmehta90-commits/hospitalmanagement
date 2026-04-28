-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT CHECK (role IN ('admin', 'doctor', 'patient')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  specialization TEXT,
  experience INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  age INTEGER,
  gender TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed')),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- --- ROW LEVEL SECURITY (RLS) ---

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "user can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "user can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Doctors Policies
CREATE POLICY "anyone can view doctors list"
ON doctors FOR SELECT
TO authenticated
USING (true);

-- Patients Policies
CREATE POLICY "patient can view own data"
ON patients FOR SELECT
USING (auth.uid() = id);

-- Appointments Policies
CREATE POLICY "patient can view own"
ON appointments FOR SELECT
USING (auth.uid() = patient_id);

CREATE POLICY "patient can insert own"
ON appointments FOR INSERT
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "doctor can view assigned"
ON appointments FOR SELECT
USING (auth.uid() = doctor_id);

CREATE POLICY "doctor can update assigned"
ON appointments FOR UPDATE
USING (auth.uid() = doctor_id);

-- 5. Medical Records table
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('diagnosis', 'prescription', 'report')),
  title TEXT NOT NULL,
  content TEXT,
  metadata JSONB, -- For additional fields like dosage, status, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "patient can view own records"
ON medical_records FOR SELECT
USING (auth.uid() = patient_id);

CREATE POLICY "doctor can view and insert records"
ON medical_records FOR ALL
USING (auth.uid() = doctor_id);

-- Admin Policy (Example)
CREATE POLICY "admin has full access to profiles"
ON profiles FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
