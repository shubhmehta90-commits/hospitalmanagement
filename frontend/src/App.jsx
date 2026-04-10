// ============================================================
// MedPortal HMS — Enterprise Hospital Management System
// Complete single-file React application with Tailwind CSS
// Design: Enterprise-grade, data-dense, medical-professional UI
// ============================================================

import { useState, useMemo } from 'react';
import {
  LayoutDashboard, Users, Stethoscope, Calendar, Search,
  Bell, ChevronDown, ChevronLeft, ChevronRight, Plus, X,
  Filter, Activity, AlertTriangle, UserPlus, Phone, Mail,
  Clock, Building2, TrendingUp, Heart, Shield, Eye, Pencil,
  FileText, Hash, MapPin, CircleDot, BedDouble, Lock, LogOut,
  Pill, TestTubes, ArrowRightLeft, CheckCircle, Package, Beaker
} from 'lucide-react';


// ============================================================
// SECTION 1: MOCK DATA
// ============================================================

/** Ward occupancy data for real-time dashboard display */
const WARDS = [
  { name: 'General Ward', occupied: 32, total: 40 },
  { name: 'ICU', occupied: 8, total: 10 },
  { name: 'Pediatrics', occupied: 12, total: 20 },
  { name: 'Cardiology', occupied: 15, total: 18 },
  { name: 'Orthopedics', occupied: 9, total: 15 },
  { name: 'Maternity', occupied: 6, total: 12 },
  { name: 'Emergency', occupied: 4, total: 8 },
];

/** Urgent action items for command dashboard */
const URGENT_ITEMS = [
  { priority: 'Critical', desc: 'ICU bed reallocation required — ventilator transfer', patient: 'Suresh Iyer', assigned: 'Dr. Kapoor', due: 'Immediate' },
  { priority: 'High', desc: 'Lab results pending — CBC & LFT panels', patient: 'Amit Singh', assigned: 'Lab Dept.', due: '11:30 AM' },
  { priority: 'High', desc: 'Medication refill — Insulin dosage update', patient: 'Sunita Devi', assigned: 'Dr. Kapoor', due: '12:00 PM' },
  { priority: 'Medium', desc: 'Discharge processing & final billing clearance', patient: 'Kavita Nair', assigned: 'Billing Dept.', due: '02:00 PM' },
  { priority: 'Low', desc: 'Insurance verification — document upload pending', patient: 'Mohammed Farooq', assigned: 'Front Desk', due: '04:00 PM' },
];

/** Today's operational schedule */
const TODAYS_SCHEDULE = [
  { time: '09:00', event: 'Ward Rounds — General Ward', doctor: 'Dr. Kapoor', location: 'Gen. Ward' },
  { time: '10:30', event: 'Knee Replacement Surgery', doctor: 'Dr. Desai', location: 'OT-2' },
  { time: '11:00', event: 'MRI Diagnostic Review', doctor: 'Dr. Joshi', location: 'Radiology' },
  { time: '14:00', event: 'OPD Clinic Session', doctor: 'Dr. Kapoor', location: 'OPD-A3' },
  { time: '15:30', event: 'Ortho Post-Op Follow-up', doctor: 'Dr. Rao', location: 'Clinic-B' },
  { time: '16:00', event: 'Pediatric Vaccination Drive', doctor: 'Dr. Khan', location: 'Ped. Wing' },
];

/** Initial patient master data — 10 realistic records */
const INITIAL_PATIENTS = [
  { id: 'PT-10001', firstName: 'Rajesh', lastName: 'Kumar', dob: '1981-03-15', gender: 'Male', bloodGroup: 'A+', contact: '9876543210', email: 'rajesh.k@email.com', address: '12 MG Road, New Delhi', emergencyName: 'Sunita Kumar', emergencyContact: '9876543211', conditions: 'Hypertension, Type 2 Diabetes', status: 'Admitted', ward: 'General Ward' },
  { id: 'PT-10002', firstName: 'Priya', lastName: 'Sharma', dob: '1994-07-22', gender: 'Female', bloodGroup: 'B+', contact: '9123456780', email: 'priya.s@email.com', address: '45 Sector 15, Noida', emergencyName: 'Rahul Sharma', emergencyContact: '9123456781', conditions: 'None', status: 'Outpatient', ward: '—' },
  { id: 'PT-10003', firstName: 'Amit', lastName: 'Singh', dob: '1968-11-03', gender: 'Male', bloodGroup: 'O+', contact: '9988776650', email: 'amit.s@email.com', address: '78 Civil Lines, Lucknow', emergencyName: 'Neeta Singh', emergencyContact: '9988776651', conditions: 'COPD, Chronic Kidney Disease', status: 'Admitted', ward: 'ICU' },
  { id: 'PT-10004', firstName: 'Sunita', lastName: 'Devi', dob: '1959-01-19', gender: 'Female', bloodGroup: 'AB-', contact: '9654321098', email: 'sunita.d@email.com', address: '23 Park Street, Kolkata', emergencyName: 'Manoj Kumar', emergencyContact: '9654321099', conditions: 'Coronary Artery Disease', status: 'Admitted', ward: 'Cardiology' },
  { id: 'PT-10005', firstName: 'Mohammed', lastName: 'Farooq', dob: '1985-05-30', gender: 'Male', bloodGroup: 'B-', contact: '9876012345', email: 'farooq.m@email.com', address: '56 Banjara Hills, Hyderabad', emergencyName: 'Ayesha Farooq', emergencyContact: '9876012346', conditions: 'Asthma', status: 'Outpatient', ward: '—' },
  { id: 'PT-10006', firstName: 'Ananya', lastName: 'Patel', dob: '1998-09-12', gender: 'Female', bloodGroup: 'A-', contact: '9012345678', email: 'ananya.p@email.com', address: '89 SG Highway, Ahmedabad', emergencyName: 'Vikas Patel', emergencyContact: '9012345679', conditions: 'None', status: 'Emergency', ward: 'Emergency' },
  { id: 'PT-10007', firstName: 'Vikram', lastName: 'Reddy', dob: '1973-12-05', gender: 'Male', bloodGroup: 'O-', contact: '9765432100', email: 'vikram.r@email.com', address: '34 Jubilee Hills, Hyderabad', emergencyName: 'Lakshmi Reddy', emergencyContact: '9765432101', conditions: 'Osteoarthritis', status: 'Admitted', ward: 'Orthopedics' },
  { id: 'PT-10008', firstName: 'Kavita', lastName: 'Nair', dob: '1991-04-18', gender: 'Female', bloodGroup: 'A+', contact: '9543210987', email: 'kavita.n@email.com', address: '67 Marine Drive, Kochi', emergencyName: 'Suresh Nair', emergencyContact: '9543210988', conditions: 'Migraine', status: 'Discharged', ward: '—' },
  { id: 'PT-10009', firstName: 'Suresh', lastName: 'Iyer', dob: '1954-08-27', gender: 'Male', bloodGroup: 'AB+', contact: '9321098765', email: 'suresh.i@email.com', address: '12 T Nagar, Chennai', emergencyName: 'Meera Iyer', emergencyContact: '9321098766', conditions: 'Heart Failure, Hypertension, Diabetes', status: 'Admitted', ward: 'ICU' },
  { id: 'PT-10010', firstName: 'Lakshmi', lastName: 'Menon', dob: '1982-02-14', gender: 'Female', bloodGroup: 'B+', contact: '9210987654', email: 'lakshmi.m@email.com', address: '45 MG Road, Thiruvananthapuram', emergencyName: 'Ravi Menon', emergencyContact: '9210987655', conditions: 'Gestational Diabetes', status: 'Admitted', ward: 'Maternity' },
];

/** Initial doctor/staff roster — 5 professionals */
const INITIAL_DOCTORS = [
  { id: 'DR-001', name: 'Dr. Anil Kapoor', specialty: 'Cardiology', license: 'MCI-78234', shift: 'Active', extension: '201', department: 'Cardiology', email: 'a.kapoor@medportal.org' },
  { id: 'DR-002', name: 'Dr. Meera Joshi', specialty: 'Neurology', license: 'MCI-65891', shift: 'On-Call', extension: '205', department: 'Neurology', email: 'm.joshi@medportal.org' },
  { id: 'DR-003', name: 'Dr. Rahul Desai', specialty: 'Orthopedic Surgery', license: 'MCI-91023', shift: 'Active', extension: '210', department: 'Orthopedics', email: 'r.desai@medportal.org' },
  { id: 'DR-004', name: 'Dr. Sana Khan', specialty: 'Pediatrics', license: 'MCI-44567', shift: 'Off-Duty', extension: '215', department: 'Pediatrics', email: 's.khan@medportal.org' },
  { id: 'DR-005', name: 'Dr. Venkat Rao', specialty: 'General Surgery', license: 'MCI-33890', shift: 'Active', extension: '220', department: 'Surgery', email: 'v.rao@medportal.org' },
];

/** Initial appointment schedule — 8 bookings */
const INITIAL_APPOINTMENTS = [
  { id: 'APT-2001', patientId: 'PT-10001', doctorId: 'DR-001', date: '2026-04-10', time: '10:00', procedure: 'ECG & Cardiac Consultation', status: 'Confirmed' },
  { id: 'APT-2002', patientId: 'PT-10002', doctorId: 'DR-002', date: '2026-04-10', time: '11:30', procedure: 'MRI Scan — Brain', status: 'Pending' },
  { id: 'APT-2003', patientId: 'PT-10003', doctorId: 'DR-005', date: '2026-04-10', time: '09:30', procedure: 'Pre-surgical Assessment', status: 'Confirmed' },
  { id: 'APT-2004', patientId: 'PT-10004', doctorId: 'DR-001', date: '2026-04-11', time: '14:00', procedure: 'Cardiac Catheterization', status: 'Pending' },
  { id: 'APT-2005', patientId: 'PT-10005', doctorId: 'DR-005', date: '2026-04-09', time: '15:30', procedure: 'X-Ray Follow-up Review', status: 'Completed' },
  { id: 'APT-2006', patientId: 'PT-10006', doctorId: 'DR-004', date: '2026-04-09', time: '08:45', procedure: 'Emergency Triage Assessment', status: 'Confirmed' },
  { id: 'APT-2007', patientId: 'PT-10007', doctorId: 'DR-003', date: '2026-04-09', time: '16:00', procedure: 'Post-Op Review — Knee', status: 'No-Show' },
  { id: 'APT-2008', patientId: 'PT-10009', doctorId: 'DR-001', date: '2026-04-11', time: '09:00', procedure: 'ICU Status Review', status: 'Pending' },
];

/** Initial Pharmacy Inventory — 7 records */
const INITIAL_INVENTORY = [
  { id: 'MED-101', name: 'Paracetamol 500mg', category: 'Analgesics', stock: 1500, min: 500, price: '₹1.50' },
  { id: 'MED-102', name: 'Amoxicillin 250mg', category: 'Antibiotics', stock: 320, min: 400, price: '₹8.00' },
  { id: 'MED-103', name: 'Ibuprofen 400mg', category: 'Analgesics', stock: 850, min: 200, price: '₹3.50' },
  { id: 'MED-104', name: 'Metformin 500mg', category: 'Antidiabetics', stock: 120, min: 300, price: '₹4.00' },
  { id: 'MED-105', name: 'Amlodipine 5mg', category: 'Cardiovascular', stock: 600, min: 200, price: '₹5.50' },
  { id: 'MED-106', name: 'Pantoprazole 40mg', category: 'Antacids', stock: 45, min: 150, price: '₹7.00' },
  { id: 'MED-107', name: 'Ceftriaxone 1g Inj.', category: 'Antibiotics', stock: 80, min: 100, price: '₹45.00' },
];

/** Initial Lab Requests — 5 records */
const INITIAL_LAB_REQUESTS = [
  { id: 'LAB-501', patientId: 'PT-10003', testName: 'Complete Blood Count (CBC)', date: '2026-04-09', status: 'Pending', urgency: 'Routine' },
  { id: 'LAB-502', patientId: 'PT-10003', testName: 'Lipid Profile', date: '2026-04-09', status: 'Pending', urgency: 'Routine' },
  { id: 'LAB-503', patientId: 'PT-10001', testName: 'ECG Analysis', date: '2026-04-08', status: 'Completed', urgency: 'Urgent' },
  { id: 'LAB-504', patientId: 'PT-10009', testName: 'HbA1c', date: '2026-04-09', status: 'Completed', urgency: 'Routine' },
  { id: 'LAB-505', patientId: 'PT-10006', testName: 'Comprehensive Metabolic Panel', date: '2026-04-09', status: 'Processing', urgency: 'Stat' },
];


// ============================================================
// SECTION 2: UTILITY FUNCTIONS & COMPONENTS
// ============================================================

/** Calculate age from ISO date-of-birth string */
function calculateAge(dob) {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/** Format ISO date to locale display string */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * StatusBadge — renders a color-coded label for any status value.
 * Uses enterprise-standard semantic colors (no gradients, no glow).
 */
function StatusBadge({ status }) {
  const styles = {
    // Patient admission
    Admitted:    'bg-blue-50 text-blue-700 border-blue-200',
    Outpatient:  'bg-slate-100 text-slate-600 border-slate-300',
    Discharged:  'bg-emerald-50 text-emerald-700 border-emerald-200',
    Emergency:   'bg-rose-50 text-rose-700 border-rose-200',
    // Doctor shift
    Active:      'bg-emerald-50 text-emerald-700 border-emerald-200',
    'On-Call':   'bg-amber-50 text-amber-700 border-amber-200',
    'Off-Duty':  'bg-slate-100 text-slate-500 border-slate-300',
    // Appointment
    Confirmed:   'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending:     'bg-amber-50 text-amber-700 border-amber-200',
    Completed:   'bg-blue-50 text-blue-700 border-blue-200',
    'No-Show':   'bg-rose-50 text-rose-700 border-rose-200',
    // Priority & Urgency
    Critical:    'bg-rose-50 text-rose-700 border-rose-200',
    Stat:        'bg-rose-50 text-rose-700 border-rose-200',
    High:        'bg-amber-50 text-amber-700 border-amber-200',
    Urgent:      'bg-amber-50 text-amber-700 border-amber-200',
    Medium:      'bg-blue-50 text-blue-700 border-blue-200',
    Processing:  'bg-blue-50 text-blue-700 border-blue-200',
    Low:         'bg-slate-100 text-slate-600 border-slate-300',
    Routine:     'bg-slate-100 text-slate-600 border-slate-300',
    // Inventory
    'Low Stock': 'bg-rose-50 text-rose-700 border-rose-200',
    'In Stock':  'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-semibold border rounded ${styles[status] || 'bg-slate-100 text-slate-600 border-slate-300'}`}>
      {status}
    </span>
  );
}

/**
 * Modal — enterprise-style overlay dialog.
 * Sharp corners (rounded-md), no animations, clean border treatment.
 */
function Modal({ isOpen, onClose, title, children, width = 'max-w-lg' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className={`bg-white rounded-md shadow-xl border border-slate-200 ${width} w-full mx-4 max-h-[90vh] flex flex-col`} onClick={e => e.stopPropagation()}>
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{title}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 transition-colors">
            <X size={16} />
          </button>
        </div>
        {/* Modal body */}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}


// ============================================================
// SECTION 3: LAYOUT COMPONENTS
// ============================================================

/**
 * Sidebar — persistent left-hand navigation panel.
 * Dark navy (slate-900) background, compact nav items, active indicator.
 */
function Sidebar({ activeTab, setActiveTab }) {
  const navSections = [
    {
      label: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
        { id: 'patients', label: 'Patient Index', icon: Users },
      ],
    },
    {
      label: 'CLINICAL',
      items: [
        { id: 'staff', label: 'Staff Roster', icon: Stethoscope },
        { id: 'appointments', label: 'Scheduling', icon: Calendar },
      ],
    },
    {
      label: 'OPERATIONS',
      items: [
        { id: 'bed-management', label: 'Bed Management', icon: BedDouble },
        { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
        { id: 'lab-reports', label: 'Lab & Reports', icon: TestTubes },
      ],
    },
  ];

  return (
    <aside className="w-60 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-30 no-print">
      {/* Brand header */}
      <div className="px-4 py-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center">
            <Heart size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide leading-tight">MedPortal HMS</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Hospital Mgmt</p>
          </div>
        </div>
      </div>

      {/* Navigation sections */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navSections.map(section => (
          <div key={section.label} className="mb-2">
            <p className="px-4 py-1.5 text-[10px] font-bold text-slate-500 tracking-widest uppercase">
              {section.label}
            </p>
            {section.items.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-left transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white border-l-2 border-blue-500'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-l-2 border-transparent'
                  }`}
                >
                  <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}

        {/* Grayed-out future modules */}
        <div className="mb-2 mt-4">
          <p className="px-4 py-1.5 text-[10px] font-bold text-slate-600 tracking-widest uppercase">Operations</p>
          {['Bed Management', 'Pharmacy', 'Lab & Reports'].map(label => (
            <div key={label} className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-600 cursor-not-allowed">
              <CircleDot size={14} />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="mb-2">
          <p className="px-4 py-1.5 text-[10px] font-bold text-slate-600 tracking-widest uppercase">Admin</p>
          {['Billing', 'Analytics', 'Settings'].map(label => (
            <div key={label} className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-600 cursor-not-allowed">
              <CircleDot size={14} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </nav>

      {/* Sidebar footer */}
      <div className="px-4 py-3 border-t border-slate-700/60 text-[10px] text-slate-500">
        <p>MedPortal HMS v2.4.1</p>
        <p>© 2026 Enterprise Health Systems</p>
      </div>
    </aside>
  );
}

/**
 * Header — top bar with global search and user profile.
 * White background, subtle bottom border, compact height.
 */
function Header({ searchQuery, setSearchQuery, onLogout }) {
  return (
    <header className="h-13 bg-white border-b border-slate-200 flex items-center justify-between px-6 fixed top-0 left-60 right-0 z-20 no-print">
      {/* Global search */}
      <div className="relative w-96">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          id="global-search"
          type="text"
          placeholder="Search patients, staff, appointments..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400"
        />
      </div>

      {/* Right section: notifications + user */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors" title="Notifications">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
        </button>
        <div className="h-6 w-px bg-slate-200" />
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white text-xs font-bold">
            AS
          </div>
          <div className="text-right mr-2">
            <p className="text-sm font-semibold text-slate-900 leading-tight">Admin Sys</p>
            <p className="text-[11px] text-slate-500">Administrator</p>
          </div>
        </div>
        <div className="h-6 w-px bg-slate-200 ml-1 mr-1" />
        <button 
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
          title="Sign Out"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </header>
  );
}


// ============================================================
// SECTION 4: COMMAND DASHBOARD MODULE
// ============================================================

/**
 * Dashboard — high-density command center.
 * KPI cards (top), urgent items + schedule (middle), ward occupancy (bottom).
 */
function Dashboard({ patients }) {
  // Compute KPIs dynamically from data
  const totalPatients = patients.length;
  const totalBeds = WARDS.reduce((s, w) => s + w.total, 0);
  const occupiedBeds = WARDS.reduce((s, w) => s + w.occupied, 0);
  const occupancyRatio = Math.round((occupiedBeds / totalBeds) * 100);
  const todayAdmissions = patients.filter(p => p.status === 'Admitted').length;
  const criticalCases = patients.filter(p => p.ward === 'ICU' || p.ward === 'Emergency').length;

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div>
        <h1 className="text-lg font-bold text-slate-900">Command Dashboard</h1>
        <p className="text-xs text-slate-500 mt-0.5">Real-time operational overview — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard icon={Users} label="Total Patients" value={totalPatients} sub="+3 this week" accent="blue" />
        <KPICard icon={BedDouble} label="Bed Occupancy" value={`${occupancyRatio}%`} sub={`${occupiedBeds}/${totalBeds} beds`} accent="amber" />
        <KPICard icon={UserPlus} label="Active Admissions" value={todayAdmissions} sub="Currently admitted" accent="emerald" />
        <KPICard icon={AlertTriangle} label="Critical Cases" value={criticalCases} sub="ICU + Emergency" accent="rose" />
      </div>

      {/* Middle grid: Urgent Items (2/3) + Schedule (1/3) */}
      <div className="grid grid-cols-3 gap-4">
        {/* Urgent Action Items */}
        <div className="col-span-2 bg-white border border-slate-200 rounded-md">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Urgent Action Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                  <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Assigned</th>
                  <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Due</th>
                </tr>
              </thead>
              <tbody>
                {URGENT_ITEMS.map((item, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-2.5"><StatusBadge status={item.priority} /></td>
                    <td className="px-4 py-2.5 text-xs text-slate-800 font-medium max-w-xs">{item.desc}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">{item.patient}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">{item.assigned}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600 font-mono">{item.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white border border-slate-200 rounded-md">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Today's Schedule</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {TODAYS_SCHEDULE.map((item, i) => (
              <div key={i} className="px-4 py-2.5 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-2 mb-0.5">
                  <Clock size={12} className="text-blue-600" />
                  <span className="text-xs font-bold text-slate-800 font-mono">{item.time}</span>
                </div>
                <p className="text-xs text-slate-700 font-medium ml-[20px]">{item.event}</p>
                <p className="text-[11px] text-slate-500 ml-[20px]">{item.doctor} · {item.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ward Occupancy */}
      <div className="bg-white border border-slate-200 rounded-md">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ward / Department Occupancy</h2>
        </div>
        <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-3">
          {WARDS.map(ward => {
            const pct = Math.round((ward.occupied / ward.total) * 100);
            const barColor = pct >= 85 ? 'bg-rose-500' : pct >= 65 ? 'bg-amber-500' : 'bg-emerald-500';
            return (
              <div key={ward.name} className="flex items-center gap-3">
                <div className="w-28 text-xs text-slate-700 font-medium shrink-0">{ward.name}</div>
                <div className="flex-1 bg-slate-100 rounded-sm h-2 overflow-hidden">
                  <div className={`h-2 rounded-sm transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="w-20 text-right text-[11px] text-slate-500 font-mono shrink-0">
                  {ward.occupied}/{ward.total} ({pct}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** KPI Card — compact metric display with icon and subtitle */
function KPICard({ icon: Icon, label, value, sub, accent }) {
  const accents = {
    blue:    { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
    amber:   { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-100' },
    rose:    { bg: 'bg-rose-50',     text: 'text-rose-700',    border: 'border-rose-100' },
  };
  const a = accents[accent];

  return (
    <div className={`bg-white border border-slate-200 rounded-md p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className={`p-1.5 rounded ${a.bg} ${a.text}`}>
          <Icon size={15} strokeWidth={2.5} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
      {sub && <p className="text-[11px] text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}


// ============================================================
// SECTION 5: PATIENT MASTER INDEX MODULE
// ============================================================

const ITEMS_PER_PAGE = 6;

/**
 * PatientIndex — dense, paginated EMR data table.
 * Working search, status filter, ward filter, registration and edit modal triggers.
 */
function PatientIndex({ patients, onOpenRegister, onEditPatient }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [wardFilter, setWardFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Unique values for filter dropdowns
  const statuses = [...new Set(patients.map(p => p.status))];
  const wards = [...new Set(patients.map(p => p.ward).filter(w => w !== '—'))];

  // Filter logic
  const filtered = useMemo(() => {
    return patients.filter(p => {
      const matchSearch = !search ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || p.status === statusFilter;
      const matchWard = !wardFilter || p.ward === wardFilter;
      return matchSearch && matchStatus && matchWard;
    });
  }, [patients, search, statusFilter, wardFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  const handleSearchChange = (v) => { setSearch(v); setCurrentPage(1); };
  const handleStatusChange = (v) => { setStatusFilter(v); setCurrentPage(1); };
  const handleWardChange = (v) => { setWardFilter(v); setCurrentPage(1); };

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Patient Master Index</h1>
          <p className="text-xs text-slate-500 mt-0.5">Electronic Medical Record registry — {patients.length} total records</p>
        </div>
        <button
          onClick={onOpenRegister}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-700 text-white text-xs font-semibold rounded hover:bg-blue-800 transition-colors"
        >
          <Plus size={14} />
          Register Patient
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-md px-4 py-3">
        <Filter size={14} className="text-slate-400 shrink-0" />
        <input
          id="patient-search"
          type="text"
          placeholder="Search by name or ID..."
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
          className="flex-1 text-sm border-0 focus:outline-none placeholder:text-slate-400"
        />
        <div className="h-5 w-px bg-slate-200" />
        <select
          value={statusFilter}
          onChange={e => handleStatusChange(e.target.value)}
          className="text-xs text-slate-600 border border-slate-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-blue-600"
        >
          <option value="">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={wardFilter}
          onChange={e => handleWardChange(e.target.value)}
          className="text-xs text-slate-600 border border-slate-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-blue-600"
        >
          <option value="">All Wards</option>
          {wards.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>

      {/* Data table */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Patient ID', 'Full Name', 'DOB / Age', 'Gender', 'Blood Grp', 'Status', 'Ward', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">No patients match the current filters.</td></tr>
              ) : paginated.map(p => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-2.5 text-xs text-blue-700 font-mono font-semibold">{p.id}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-900 font-semibold whitespace-nowrap">{p.firstName} {p.lastName}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-600 whitespace-nowrap">{formatDate(p.dob)} ({calculateAge(p.dob)}y)</td>
                  <td className="px-4 py-2.5 text-xs text-slate-600">{p.gender}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-600 font-semibold">{p.bloodGroup}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-2.5 text-xs text-slate-600">{p.ward}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-slate-400 hover:text-blue-700 transition-colors" title="View Details">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => onEditPatient(p)} className="p-1 text-slate-400 hover:text-amber-600 transition-colors" title="Edit Patient">
                        <Pencil size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 bg-slate-50">
          <p className="text-[11px] text-slate-500">
            Showing {((safePage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} records
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="p-1.5 text-slate-500 hover:text-slate-700 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 text-xs font-semibold rounded transition-colors ${
                  safePage === i + 1 ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="p-1.5 text-slate-500 hover:text-slate-700 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ============================================================
// SECTION 6: STAFF & DOCTOR ROSTER MODULE
// ============================================================

/**
 * StaffRoster — grid view of medical professionals.
 * Shows specialty, license, shift status, contact extension.
 * "Book Appointment" action opens the global booking modal.
 */
function StaffRoster({ doctors, onBookAppointment }) {
  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h1 className="text-lg font-bold text-slate-900">Staff & Doctor Roster</h1>
        <p className="text-xs text-slate-500 mt-0.5">Medical professionals directory — {doctors.length} registered staff</p>
      </div>

      {/* Doctor cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {doctors.map(doc => (
          <div key={doc.id} className="bg-white border border-slate-200 rounded-md overflow-hidden hover:shadow-md transition-shadow">
            {/* Card header with avatar */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {doc.name.split(' ').slice(1).map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                  <p className="text-[11px] text-blue-700 font-semibold">{doc.specialty}</p>
                </div>
              </div>
              <StatusBadge status={doc.shift} />
            </div>

            {/* Card body */}
            <div className="px-4 py-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Shield size={13} className="text-slate-400 shrink-0" />
                <span>License: <span className="font-mono font-semibold text-slate-800">{doc.license}</span></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Building2 size={13} className="text-slate-400 shrink-0" />
                <span>Dept: {doc.department}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Phone size={13} className="text-slate-400 shrink-0" />
                <span>Ext. <span className="font-mono font-semibold">{doc.extension}</span></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Mail size={13} className="text-slate-400 shrink-0" />
                <span className="truncate">{doc.email}</span>
              </div>
            </div>

            {/* Card action */}
            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => onBookAppointment(doc.id)}
                disabled={doc.shift === 'Off-Duty'}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded transition-colors
                  bg-blue-700 text-white hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <Calendar size={13} />
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ============================================================
// SECTION 7: APPOINTMENT & RESOURCE SCHEDULING MODULE
// ============================================================

/**
 * AppointmentScheduling — booking management table.
 * Columns: Patient, Doctor, Date/Time, Procedure, Status, Actions.
 * Status transition buttons: Pending→Confirm, Confirmed→Complete/No-Show.
 */
function AppointmentScheduling({ appointments, patients, doctors, onUpdateStatus, onOpenBooking, onEditAppointment }) {
  const [statusFilter, setStatusFilter] = useState('');

  // Build lookup maps for display names
  const patientMap = useMemo(() => {
    const m = {};
    patients.forEach(p => { m[p.id] = `${p.firstName} ${p.lastName}`; });
    return m;
  }, [patients]);

  const doctorMap = useMemo(() => {
    const m = {};
    doctors.forEach(d => { m[d.id] = d.name; });
    return m;
  }, [doctors]);

  // Filter appointments
  const filtered = useMemo(() => {
    if (!statusFilter) return appointments;
    return appointments.filter(a => a.status === statusFilter);
  }, [appointments, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Appointment & Resource Scheduling</h1>
          <p className="text-xs text-slate-500 mt-0.5">{appointments.length} total bookings — manage patient-doctor scheduling</p>
        </div>
        <button
          onClick={() => onOpenBooking()}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-700 text-white text-xs font-semibold rounded hover:bg-blue-800 transition-colors"
        >
          <Plus size={14} />
          New Booking
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-2 py-1.5">
        {['', 'Pending', 'Confirmed', 'Completed', 'No-Show'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              statusFilter === s ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Booking ID', 'Patient', 'Doctor', 'Date & Time', 'Procedure', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">No appointments match the selected filter.</td></tr>
              ) : filtered.map(apt => (
                <tr key={apt.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-2.5 text-xs text-blue-700 font-mono font-semibold">{apt.id}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-800 font-semibold whitespace-nowrap">{patientMap[apt.patientId] || apt.patientId}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-700 whitespace-nowrap">{doctorMap[apt.doctorId] || apt.doctorId}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-600 font-mono whitespace-nowrap">{formatDate(apt.date)} {apt.time}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-700 max-w-xs">{apt.procedure}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={apt.status} /></td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      {/* Pending → Confirm */}
                      {apt.status === 'Pending' && (
                        <button
                          onClick={() => onUpdateStatus(apt.id, 'Confirmed')}
                          className="px-2 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded hover:bg-emerald-100 transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {/* Confirmed → Complete or No-Show */}
                      {apt.status === 'Confirmed' && (
                        <>
                          <button
                            onClick={() => onUpdateStatus(apt.id, 'Completed')}
                            className="px-2 py-1 text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => onUpdateStatus(apt.id, 'No-Show')}
                            className="px-2 py-1 text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 rounded hover:bg-rose-100 transition-colors"
                          >
                            No-Show
                          </button>
                        </>
                      )}
                      {/* Edit button — available for Pending and Confirmed */}
                      {(apt.status === 'Pending' || apt.status === 'Confirmed') && (
                        <button
                          onClick={() => onEditAppointment(apt)}
                          className="px-2 py-1 text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200 rounded hover:bg-slate-100 transition-colors"
                          title="Edit Appointment"
                        >
                          <Pencil size={12} />
                        </button>
                      )}
                      {/* Completed / No-Show → read-only */}
                      {(apt.status === 'Completed' || apt.status === 'No-Show') && (
                        <span className="text-[11px] text-slate-400 italic">Finalized</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// ============================================================
// SECTION 8: REGISTER PATIENT MODAL
// ============================================================

/**
 * RegisterPatientModal — strict, multi-column form with validation.
 * Required fields: name, DOB, gender, contact, emergency contact, blood type.
 */
function RegisterPatientModal({ isOpen, onClose, onRegister }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', dob: '', gender: '', bloodGroup: '',
    contact: '', email: '', address: '',
    emergencyName: '', emergencyContact: '', conditions: '',
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(form);
    // Reset form and close
    setForm({ firstName: '', lastName: '', dob: '', gender: '', bloodGroup: '', contact: '', email: '', address: '', emergencyName: '', emergencyContact: '', conditions: '' });
    onClose();
  };

  const inputCls = "w-full px-3 py-2 text-sm border border-slate-300 rounded bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400";
  const labelCls = "block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Patient" width="max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-x-5 gap-y-4">
          {/* First Name */}
          <div>
            <label className={labelCls}>First Name *</label>
            <input type="text" required value={form.firstName} onChange={e => update('firstName', e.target.value)} className={inputCls} placeholder="e.g. Rajesh" />
          </div>
          {/* Last Name */}
          <div>
            <label className={labelCls}>Last Name *</label>
            <input type="text" required value={form.lastName} onChange={e => update('lastName', e.target.value)} className={inputCls} placeholder="e.g. Kumar" />
          </div>
          {/* DOB */}
          <div>
            <label className={labelCls}>Date of Birth *</label>
            <input type="date" required value={form.dob} onChange={e => update('dob', e.target.value)} className={inputCls} />
          </div>
          {/* Gender */}
          <div>
            <label className={labelCls}>Gender *</label>
            <select required value={form.gender} onChange={e => update('gender', e.target.value)} className={inputCls}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* Blood Group */}
          <div>
            <label className={labelCls}>Blood Group *</label>
            <select required value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)} className={inputCls}>
              <option value="">Select Blood Group</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          {/* Contact */}
          <div>
            <label className={labelCls}>Contact Number *</label>
            <input type="tel" required value={form.contact} onChange={e => update('contact', e.target.value)} className={inputCls} placeholder="e.g. 9876543210" />
          </div>
          {/* Email */}
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className={inputCls} placeholder="e.g. patient@email.com" />
          </div>
          {/* Address — full width */}
          <div className="col-span-2">
            <label className={labelCls}>Address</label>
            <input type="text" value={form.address} onChange={e => update('address', e.target.value)} className={inputCls} placeholder="Full residential address" />
          </div>

          {/* Separator */}
          <div className="col-span-2 border-t border-slate-200 pt-2 mt-1">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Emergency Contact</p>
          </div>

          {/* Emergency Name */}
          <div>
            <label className={labelCls}>Contact Person *</label>
            <input type="text" required value={form.emergencyName} onChange={e => update('emergencyName', e.target.value)} className={inputCls} placeholder="e.g. Sunita Kumar" />
          </div>
          {/* Emergency Phone */}
          <div>
            <label className={labelCls}>Contact Phone *</label>
            <input type="tel" required value={form.emergencyContact} onChange={e => update('emergencyContact', e.target.value)} className={inputCls} placeholder="e.g. 9876543211" />
          </div>

          {/* Pre-existing conditions — full width */}
          <div className="col-span-2">
            <label className={labelCls}>Pre-existing Conditions</label>
            <textarea value={form.conditions} onChange={e => update('conditions', e.target.value)} className={`${inputCls} resize-none h-20`} placeholder="List any known conditions, allergies, or ongoing treatments" />
          </div>
        </div>

        {/* Form actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded hover:bg-blue-800 transition-colors">
            Register Patient
          </button>
        </div>
      </form>
    </Modal>
  );
}


// ============================================================
// SECTION 9: NEW BOOKING MODAL
// ============================================================

/**
 * NewBookingModal — schedule a new appointment.
 * Patient and Doctor dropdowns populated from state arrays.
 * Supports pre-selection of doctor (from Staff Roster action).
 */
function NewBookingModal({ isOpen, onClose, onBook, patients, doctors, preselectedDoctorId }) {
  const [form, setForm] = useState({
    patientId: '', doctorId: preselectedDoctorId || '', date: '', time: '', procedure: '',
  });

  // Sync preselectedDoctorId when modal opens
  const prevDoctor = preselectedDoctorId || '';
  if (isOpen && form.doctorId === '' && prevDoctor !== '') {
    setForm(f => ({ ...f, doctorId: prevDoctor }));
  }

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onBook(form);
    setForm({ patientId: '', doctorId: '', date: '', time: '', procedure: '' });
    onClose();
  };

  const inputCls = "w-full px-3 py-2 text-sm border border-slate-300 rounded bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400";
  const labelCls = "block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Appointment Booking" width="max-w-lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Patient */}
          <div>
            <label className={labelCls}>Patient *</label>
            <select required value={form.patientId} onChange={e => update('patientId', e.target.value)} className={inputCls}>
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.id})</option>
              ))}
            </select>
          </div>
          {/* Doctor */}
          <div>
            <label className={labelCls}>Doctor *</label>
            <select required value={form.doctorId} onChange={e => update('doctorId', e.target.value)} className={inputCls}>
              <option value="">Select Doctor</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>
              ))}
            </select>
          </div>
          {/* Date and Time in row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Date *</label>
              <input type="date" required value={form.date} onChange={e => update('date', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Time *</label>
              <input type="time" required value={form.time} onChange={e => update('time', e.target.value)} className={inputCls} />
            </div>
          </div>
          {/* Procedure */}
          <div>
            <label className={labelCls}>Procedure / Reason *</label>
            <input type="text" required value={form.procedure} onChange={e => update('procedure', e.target.value)} className={inputCls} placeholder="e.g. ECG & Cardiac Consultation" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded hover:bg-blue-800 transition-colors">
            Confirm Booking
          </button>
        </div>
      </form>
    </Modal>
  );
}


// ============================================================
// SECTION 10: EDIT PATIENT MODAL
// ============================================================

/**
 * EditPatientModal — pre-filled form to update an existing patient record.
 * Reuses the same field layout as RegisterPatientModal.
 */
function EditPatientModal({ isOpen, onClose, patient, onSave }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', dob: '', gender: '', bloodGroup: '',
    contact: '', email: '', address: '',
    emergencyName: '', emergencyContact: '', conditions: '',
    status: '', ward: '',
  });

  // Sync form when patient changes (modal opens with new patient)
  if (isOpen && patient && form.firstName === '' && form.lastName === '' && patient.firstName) {
    setForm({
      firstName: patient.firstName,
      lastName: patient.lastName,
      dob: patient.dob,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      contact: patient.contact,
      email: patient.email || '',
      address: patient.address || '',
      emergencyName: patient.emergencyName || '',
      emergencyContact: patient.emergencyContact || '',
      conditions: patient.conditions || '',
      status: patient.status,
      ward: patient.ward,
    });
  }

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...patient, ...form });
    handleClose();
  };

  const handleClose = () => {
    setForm({ firstName: '', lastName: '', dob: '', gender: '', bloodGroup: '', contact: '', email: '', address: '', emergencyName: '', emergencyContact: '', conditions: '', status: '', ward: '' });
    onClose();
  };

  const inputCls = "w-full px-3 py-2 text-sm border border-slate-300 rounded bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400";
  const labelCls = "block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Edit Patient — ${patient?.id || ''}`} width="max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-x-5 gap-y-4">
          <div>
            <label className={labelCls}>First Name *</label>
            <input type="text" required value={form.firstName} onChange={e => update('firstName', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Last Name *</label>
            <input type="text" required value={form.lastName} onChange={e => update('lastName', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Date of Birth *</label>
            <input type="date" required value={form.dob} onChange={e => update('dob', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Gender *</label>
            <select required value={form.gender} onChange={e => update('gender', e.target.value)} className={inputCls}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Blood Group *</label>
            <select required value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)} className={inputCls}>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Contact *</label>
            <input type="tel" required value={form.contact} onChange={e => update('contact', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select value={form.status} onChange={e => update('status', e.target.value)} className={inputCls}>
              {['Admitted', 'Outpatient', 'Discharged', 'Emergency'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Address</label>
            <input type="text" value={form.address} onChange={e => update('address', e.target.value)} className={inputCls} />
          </div>

          <div className="col-span-2 border-t border-slate-200 pt-2 mt-1">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Emergency Contact</p>
          </div>
          <div>
            <label className={labelCls}>Contact Person *</label>
            <input type="text" required value={form.emergencyName} onChange={e => update('emergencyName', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Contact Phone *</label>
            <input type="tel" required value={form.emergencyContact} onChange={e => update('emergencyContact', e.target.value)} className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Pre-existing Conditions</label>
            <textarea value={form.conditions} onChange={e => update('conditions', e.target.value)} className={`${inputCls} resize-none h-20`} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
          <button type="button" onClick={handleClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded hover:bg-blue-800 transition-colors">
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}


// ============================================================
// SECTION 10B: EDIT APPOINTMENT MODAL
// ============================================================

/**
 * EditAppointmentModal — edit date, time, procedure, or doctor for an existing booking.
 */
function EditAppointmentModal({ isOpen, onClose, appointment, patients, doctors, onSave }) {
  const [form, setForm] = useState({ patientId: '', doctorId: '', date: '', time: '', procedure: '' });

  // Sync form when appointment changes
  if (isOpen && appointment && form.date === '' && appointment.date) {
    setForm({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      date: appointment.date,
      time: appointment.time,
      procedure: appointment.procedure,
    });
  }

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...appointment, ...form });
    handleClose();
  };

  const handleClose = () => {
    setForm({ patientId: '', doctorId: '', date: '', time: '', procedure: '' });
    onClose();
  };

  const inputCls = "w-full px-3 py-2 text-sm border border-slate-300 rounded bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400";
  const labelCls = "block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Edit Appointment — ${appointment?.id || ''}`} width="max-w-lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Patient *</label>
            <select required value={form.patientId} onChange={e => update('patientId', e.target.value)} className={inputCls}>
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.id})</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Doctor *</label>
            <select required value={form.doctorId} onChange={e => update('doctorId', e.target.value)} className={inputCls}>
              <option value="">Select Doctor</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Date *</label>
              <input type="date" required value={form.date} onChange={e => update('date', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Time *</label>
              <input type="time" required value={form.time} onChange={e => update('time', e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Procedure / Reason *</label>
            <input type="text" required value={form.procedure} onChange={e => update('procedure', e.target.value)} className={inputCls} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
          <button type="button" onClick={handleClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded hover:bg-blue-800 transition-colors">
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}


// ============================================================
// SECTION 10C: BED MANAGEMENT MODULE
// ============================================================

function BedManagement({ patients }) {
  // Only dealing with admitted patients
  const admitted = patients.filter(p => p.status === 'Admitted');
  
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Bed & Ward Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">Real-time occupancy tracking across departments</p>
      </div>

      {/* Ward Cards Grid */}
      <div className="grid grid-cols-4 gap-4">
        {WARDS.map(w => {
          const ratio = (w.occupied / w.total) * 100;
          return (
            <div key={w.name} className="bg-white p-4 border border-slate-200 rounded-md shadow-sm border-l-4 border-l-blue-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">{w.name}</span>
                <BedDouble size={16} className="text-slate-400" />
              </div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold tracking-tight text-slate-800">{w.occupied}<span className="text-sm font-semibold text-slate-400">/{w.total}</span></span>
                <span className="text-xs font-semibold text-slate-500">{Math.round(ratio)}% Full</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${ratio > 85 ? 'bg-rose-500' : ratio > 60 ? 'bg-amber-400' : 'bg-emerald-500'}`} 
                  style={{ width: `${ratio}%` }} 
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Admitted Patients Table */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden mt-6">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Currently Admitted Patients ({admitted.length})</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200">
              {['Patient ID', 'Name', 'Current Ward', 'Conditions', 'Actions'].map(h => (
                <th key={h} className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {admitted.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">No admitted patients.</td></tr>
            ) : admitted.map(p => (
              <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-2.5 text-xs text-blue-700 font-mono font-semibold">{p.id}</td>
                <td className="px-4 py-2.5 text-xs text-slate-900 font-semibold">{p.firstName} {p.lastName}</td>
                <td className="px-4 py-2.5 text-xs font-semibold text-slate-700">{p.ward}</td>
                <td className="px-4 py-2.5 text-xs text-slate-500 truncate max-w-[200px]">{p.conditions || 'None'}</td>
                <td className="px-4 py-2.5">
                  <button className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold bg-slate-100 border border-slate-200 text-slate-700 rounded hover:bg-slate-200 transition-colors">
                    <ArrowRightLeft size={12} />
                    Transfer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ============================================================
// SECTION 10D: PHARMACY MODULE
// ============================================================

function Pharmacy({ inventory }) {
  const [search, setSearch] = useState('');
  
  const filtered = inventory.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Pharmacy & Inventory</h1>
          <p className="text-xs text-slate-500 mt-0.5">Medication dispensing and stock management</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-md px-4 py-3">
        <Search size={14} className="text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search inventory by name or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 text-sm border-0 focus:outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {['Item Code', 'Medication Name', 'Category', 'Stock Level', 'Unit Price', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const status = item.stock <= item.min ? 'Low Stock' : 'In Stock';
              return (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-2.5 text-xs text-blue-700 font-mono font-semibold">{item.id}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-900 font-semibold">{item.name}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-600">{item.category}</td>
                  <td className="px-4 py-2.5 text-xs font-mono font-semibold text-slate-800">{item.stock} <span className="text-[10px] text-slate-400 font-normal">/ min {item.min}</span></td>
                  <td className="px-4 py-2.5 text-xs text-slate-600">{item.price}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={status} /></td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-2">
                      <button className="px-2 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded hover:bg-emerald-100 transition-colors">Dispense</button>
                      <button className="px-2 py-1 text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition-colors">Order</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ============================================================
// SECTION 10E: LAB REPORTS MODULE
// ============================================================

function LabReports({ requests, patients }) {
  const patientMap = useMemo(() => {
    const m = {};
    patients.forEach(p => { m[p.id] = `${p.firstName} ${p.lastName}`; });
    return m;
  }, [patients]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Labs & Diagnostics</h1>
        <p className="text-xs text-slate-500 mt-0.5">Track pathology testing and results</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {['Req ID', 'Patient', 'Test Name', 'Requested Date', 'Urgency', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-2.5 text-xs text-blue-700 font-mono font-semibold">{req.id}</td>
                <td className="px-4 py-2.5 text-xs text-slate-800 font-semibold">{patientMap[req.patientId] || req.patientId}</td>
                <td className="px-4 py-2.5 text-xs text-slate-700">{req.testName}</td>
                <td className="px-4 py-2.5 text-xs font-mono text-slate-600">{formatDate(req.date)}</td>
                <td className="px-4 py-2.5"><StatusBadge status={req.urgency} /></td>
                <td className="px-4 py-2.5"><StatusBadge status={req.status} /></td>
                <td className="px-4 py-2.5">
                  {req.status === 'Completed' ? (
                    <button className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 opacity-80 cursor-not-allowed">
                      <CheckCircle size={12} /> Published
                    </button>
                  ) : (
                    <button className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold bg-blue-700 text-white border border-transparent rounded hover:bg-blue-800 transition-colors">
                      <Beaker size={12} /> Enter Result
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ============================================================
// SECTION 11: LOGIN MODULE
// ============================================================

/**
 * Login — Simple authentication screen matching the enterprise aesthetic.
 */
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login success regardless of input for this demo
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 border border-slate-200 rounded-md shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-700 rounded mb-4 flex items-center justify-center">
            <Heart size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">MedPortal HMS</h2>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Enterprise Health Systems</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Username</label>
            <input 
              type="text" 
              required 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400" 
              placeholder="e.g. admin"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400" 
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-700 rounded hover:bg-blue-800 transition-colors mt-2"
          >
            <Lock size={15} />
            Secure Sign In
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-5">
          <p className="text-[11px] text-slate-500">Authorized personnel only. All access is logged.</p>
        </div>
      </div>
    </div>
  );
}


// ============================================================
// SECTION 12: MAIN APPLICATION
// ============================================================

/**
 * App — root component managing global state and view switching.
 * State is managed at this level so data persists across tab changes.
 */
export default function App() {
  // ----- Global UI state -----
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // ----- Data state (persists across tab switches) -----
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [doctors] = useState(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  const [labRequests, setLabRequests] = useState(INITIAL_LAB_REQUESTS);
  
  // ----- Modal state -----
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [preselectedDoctorId, setPreselectedDoctorId] = useState('');
  const [editingPatient, setEditingPatient] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);

  // ----- Handlers -----

  /** Register a new patient — generates sequential ID and adds to state */
  const handleRegisterPatient = (formData) => {
    const maxId = patients.reduce((max, p) => {
      const num = parseInt(p.id.replace('PT-', ''), 10);
      return num > max ? num : max;
    }, 0);
    const newPatient = {
      ...formData,
      id: `PT-${String(maxId + 1).padStart(5, '0')}`,
      status: 'Outpatient',
      ward: '—',
    };
    setPatients(prev => [newPatient, ...prev]);
  };

  /** Book a new appointment — generates sequential ID and defaults to Pending */
  const handleBookAppointment = (formData) => {
    const maxId = appointments.reduce((max, a) => {
      const num = parseInt(a.id.replace('APT-', ''), 10);
      return num > max ? num : max;
    }, 0);
    const newApt = {
      ...formData,
      id: `APT-${maxId + 1}`,
      status: 'Pending',
    };
    setAppointments(prev => [newApt, ...prev]);
  };

  /** Update an appointment's status by ID */
  const handleUpdateStatus = (aptId, newStatus) => {
    setAppointments(prev =>
      prev.map(a => a.id === aptId ? { ...a, status: newStatus } : a)
    );
  };

  /** Update an existing patient record in-place */
  const handleEditPatient = (updatedPatient) => {
    setPatients(prev =>
      prev.map(p => p.id === updatedPatient.id ? updatedPatient : p)
    );
  };

  /** Update an existing appointment record in-place */
  const handleEditAppointment = (updatedApt) => {
    setAppointments(prev =>
      prev.map(a => a.id === updatedApt.id ? updatedApt : a)
    );
  };

  /** Open booking modal from Staff Roster with doctor pre-selected */
  const handleBookFromRoster = (doctorId) => {
    setPreselectedDoctorId(doctorId);
    setShowBookingModal(true);
  };

  /** Open booking modal from Appointments page (no preselection) */
  const handleOpenBooking = () => {
    setPreselectedDoctorId('');
    setShowBookingModal(true);
  };

  // ----- Render -----
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Left sidebar navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content area */}
      <div className="flex-1 ml-60 flex flex-col">
        {/* Top header */}
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onLogout={() => setIsAuthenticated(false)}
        />

        {/* Page content (scrollable area below the fixed header) */}
        <main className="flex-1 overflow-y-auto pt-16 p-6">
          {activeTab === 'dashboard' && <Dashboard patients={patients} />}
          {activeTab === 'patients' && <PatientIndex patients={patients} onOpenRegister={() => setShowRegisterModal(true)} onEditPatient={(p) => setEditingPatient(p)} />}
          {activeTab === 'staff' && <StaffRoster doctors={doctors} onBookAppointment={handleBookFromRoster} />}
          {activeTab === 'appointments' && (
            <AppointmentScheduling
              appointments={appointments}
              patients={patients}
              doctors={doctors}
              onUpdateStatus={handleUpdateStatus}
              onOpenBooking={handleOpenBooking}
              onEditAppointment={(a) => setEditingAppointment(a)}
            />
          )}
          {activeTab === 'bed-management' && <BedManagement patients={patients} />}
          {activeTab === 'pharmacy' && <Pharmacy inventory={inventory} />}
          {activeTab === 'lab-reports' && <LabReports requests={labRequests} patients={patients} />}
        </main>
      </div>

      {/* Overlay Modals (rendered at root level, independent of active tab) */}
      <RegisterPatientModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegisterPatient}
      />
      <NewBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onBook={handleBookAppointment}
        patients={patients}
        doctors={doctors}
        preselectedDoctorId={preselectedDoctorId}
      />
      <EditPatientModal
        isOpen={!!editingPatient}
        onClose={() => setEditingPatient(null)}
        patient={editingPatient}
        onSave={handleEditPatient}
      />
      <EditAppointmentModal
        isOpen={!!editingAppointment}
        onClose={() => setEditingAppointment(null)}
        appointment={editingAppointment}
        patients={patients}
        doctors={doctors}
        onSave={handleEditAppointment}
      />
    </div>
  );
}
