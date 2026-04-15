export const departments = [
  { id: 'opd', name: 'OPD', prefix: 'OPD', color: '#0ea5e9', patients: 42, avgWait: 18, doctors: 4 },
  { id: 'cardio', name: 'Cardiology', prefix: 'CARDIO', color: '#ef4444', patients: 28, avgWait: 25, doctors: 3 },
  { id: 'radio', name: 'Radiology', prefix: 'XRAY', color: '#a855f7', patients: 15, avgWait: 12, doctors: 2 },
  { id: 'path', name: 'Pathology', prefix: 'LAB', color: '#f59e0b', patients: 35, avgWait: 8, doctors: 2 },
  { id: 'pedia', name: 'Pediatrics', prefix: 'PED', color: '#22c55e', patients: 22, avgWait: 20, doctors: 3 },
  { id: 'ortho', name: 'Orthopedics', prefix: 'ORTHO', color: '#06b6d4', patients: 19, avgWait: 22, doctors: 2 },
  { id: 'er', name: 'Emergency', prefix: 'ER', color: '#dc2626', patients: 8, avgWait: 5, doctors: 3 },
  { id: 'pharm', name: 'Pharmacy', prefix: 'PHARM', color: '#10b981', patients: 50, avgWait: 6, doctors: 0 },
  { id: 'billing', name: 'Billing', prefix: 'BILL', color: '#6366f1', patients: 38, avgWait: 10, doctors: 0 },
];

export const doctors = [
  { id: 1, name: 'Dr. Priya Sharma', department: 'OPD', patients: 12, status: 'active', avgTime: 8 },
  { id: 2, name: 'Dr. Rajesh Gupta', department: 'Cardiology', patients: 9, status: 'active', avgTime: 15 },
  { id: 3, name: 'Dr. Ananya Patel', department: 'Pediatrics', patients: 8, status: 'active', avgTime: 10 },
  { id: 4, name: 'Dr. Vikram Singh', department: 'Orthopedics', patients: 10, status: 'break', avgTime: 12 },
  { id: 5, name: 'Dr. Meera Krishnan', department: 'OPD', patients: 11, status: 'active', avgTime: 7 },
  { id: 6, name: 'Dr. Arjun Reddy', department: 'Cardiology', patients: 7, status: 'active', avgTime: 18 },
  { id: 7, name: 'Dr. Sneha Iyer', department: 'Radiology', patients: 8, status: 'active', avgTime: 6 },
  { id: 8, name: 'Dr. Karan Mehta', department: 'Emergency', patients: 3, status: 'active', avgTime: 20 },
  { id: 9, name: 'Dr. Nisha Agarwal', department: 'OPD', patients: 10, status: 'active', avgTime: 9 },
  { id: 10, name: 'Dr. Sanjay Verma', department: 'Pathology', patients: 15, status: 'active', avgTime: 4 },
  { id: 11, name: 'Dr. Pooja Desai', department: 'Pediatrics', patients: 7, status: 'delayed', avgTime: 11 },
  { id: 12, name: 'Dr. Amit Joshi', department: 'Orthopedics', patients: 9, status: 'active', avgTime: 14 },
  { id: 13, name: 'Dr. Ritu Saxena', department: 'Cardiology', patients: 12, status: 'active', avgTime: 16 },
  { id: 14, name: 'Dr. Dev Kapoor', department: 'Emergency', patients: 2, status: 'active', avgTime: 25 },
  { id: 15, name: 'Dr. Kavita Nair', department: 'OPD', patients: 9, status: 'active', avgTime: 8 },
];

export type TokenStatus = 'waiting' | 'called' | 'in-consultation' | 'delayed' | 'redirected' | 'missed' | 'completed';
export type Priority = 'normal' | 'emergency' | 'senior' | 'disability' | 'pregnant' | 'vip';

export interface Token {
  id: string;
  number: string;
  patientName: string;
  department: string;
  doctor: string;
  status: TokenStatus;
  priority: Priority;
  eta: number;
  position: number;
  registeredAt: string;
  type: 'appointment' | 'walk-in';
}

export const tokens: Token[] = [
  { id: '1', number: 'OPD-001', patientName: 'Rahul Kumar', department: 'OPD', doctor: 'Dr. Priya Sharma', status: 'in-consultation', priority: 'normal', eta: 0, position: 0, registeredAt: '08:30', type: 'appointment' },
  { id: '2', number: 'OPD-002', patientName: 'Sunita Devi', department: 'OPD', doctor: 'Dr. Priya Sharma', status: 'called', priority: 'senior', eta: 2, position: 1, registeredAt: '08:35', type: 'walk-in' },
  { id: '3', number: 'OPD-003', patientName: 'Mohammed Ali', department: 'OPD', doctor: 'Dr. Meera Krishnan', status: 'waiting', priority: 'normal', eta: 12, position: 2, registeredAt: '08:40', type: 'appointment' },
  { id: '4', number: 'CARDIO-001', patientName: 'Lakshmi Narayan', department: 'Cardiology', doctor: 'Dr. Rajesh Gupta', status: 'in-consultation', priority: 'emergency', eta: 0, position: 0, registeredAt: '08:15', type: 'walk-in' },
  { id: '5', number: 'CARDIO-002', patientName: 'Ravi Shankar', department: 'Cardiology', doctor: 'Dr. Rajesh Gupta', status: 'waiting', priority: 'normal', eta: 18, position: 1, registeredAt: '08:45', type: 'appointment' },
  { id: '6', number: 'PED-001', patientName: 'Baby Arjun (Father: Suresh)', department: 'Pediatrics', doctor: 'Dr. Ananya Patel', status: 'in-consultation', priority: 'normal', eta: 0, position: 0, registeredAt: '09:00', type: 'appointment' },
  { id: '7', number: 'PED-002', patientName: 'Sita Ram (Child: Priya)', department: 'Pediatrics', doctor: 'Dr. Ananya Patel', status: 'waiting', priority: 'normal', eta: 8, position: 1, registeredAt: '09:10', type: 'walk-in' },
  { id: '8', number: 'ER-001', patientName: 'Unknown - Trauma', department: 'Emergency', doctor: 'Dr. Karan Mehta', status: 'in-consultation', priority: 'emergency', eta: 0, position: 0, registeredAt: '09:22', type: 'walk-in' },
  { id: '9', number: 'ORTHO-001', patientName: 'Deepak Choudhary', department: 'Orthopedics', doctor: 'Dr. Vikram Singh', status: 'delayed', priority: 'disability', eta: 30, position: 1, registeredAt: '08:50', type: 'appointment' },
  { id: '10', number: 'LAB-001', patientName: 'Geeta Verma', department: 'Pathology', doctor: 'Dr. Sanjay Verma', status: 'waiting', priority: 'pregnant', eta: 5, position: 3, registeredAt: '09:05', type: 'walk-in' },
  { id: '11', number: 'OPD-004', patientName: 'Anil Kapoor', department: 'OPD', doctor: 'Dr. Nisha Agarwal', status: 'missed', priority: 'normal', eta: 0, position: 0, registeredAt: '08:20', type: 'walk-in' },
  { id: '12', number: 'XRAY-001', patientName: 'Preeti Singh', department: 'Radiology', doctor: 'Dr. Sneha Iyer', status: 'completed', priority: 'normal', eta: 0, position: 0, registeredAt: '08:00', type: 'appointment' },
];

export const waitTimeData = [
  { hour: '8AM', opd: 12, cardio: 20, pedia: 10, ortho: 15 },
  { hour: '9AM', opd: 18, cardio: 25, pedia: 14, ortho: 22 },
  { hour: '10AM', opd: 25, cardio: 30, pedia: 18, ortho: 28 },
  { hour: '11AM', opd: 22, cardio: 28, pedia: 20, ortho: 25 },
  { hour: '12PM', opd: 15, cardio: 22, pedia: 12, ortho: 18 },
  { hour: '1PM', opd: 10, cardio: 15, pedia: 8, ortho: 12 },
  { hour: '2PM', opd: 20, cardio: 26, pedia: 16, ortho: 24 },
  { hour: '3PM', opd: 28, cardio: 32, pedia: 22, ortho: 30 },
  { hour: '4PM', opd: 22, cardio: 25, pedia: 15, ortho: 20 },
  { hour: '5PM', opd: 14, cardio: 18, pedia: 10, ortho: 14 },
];

export const patientDistribution = [
  { name: 'OPD', value: 42, fill: '#0ea5e9' },
  { name: 'Cardiology', value: 28, fill: '#ef4444' },
  { name: 'Pediatrics', value: 22, fill: '#22c55e' },
  { name: 'Orthopedics', value: 19, fill: '#06b6d4' },
  { name: 'Radiology', value: 15, fill: '#a855f7' },
  { name: 'Emergency', value: 8, fill: '#dc2626' },
];

export const tokenStatusData = [
  { name: 'Waiting', value: 68, fill: '#f59e0b' },
  { name: 'In Consultation', value: 24, fill: '#22c55e' },
  { name: 'Completed', value: 89, fill: '#0ea5e9' },
  { name: 'Missed', value: 12, fill: '#ef4444' },
  { name: 'Delayed', value: 9, fill: '#a855f7' },
];

export const notifications = [
  { id: 1, type: 'token', title: 'Token Generated', message: 'Token OPD-005 generated for Amit Shah', time: '2 min ago', read: false },
  { id: 2, type: 'alert', title: '3 Turns Left', message: 'Patient Sunita Devi — your turn is approaching in OPD', time: '5 min ago', read: false },
  { id: 3, type: 'urgent', title: 'Emergency Insertion', message: 'Emergency patient inserted in ER queue — Token ER-002', time: '8 min ago', read: true },
  { id: 4, type: 'delay', title: 'Doctor Delayed', message: 'Dr. Vikram Singh delayed by 15 min — Orthopedics queue adjusted', time: '12 min ago', read: true },
  { id: 5, type: 'complete', title: 'Consultation Complete', message: 'Token XRAY-001 — Preeti Singh consultation completed', time: '20 min ago', read: true },
  { id: 6, type: 'missed', title: 'Missed Token', message: 'Token OPD-004 missed — Anil Kapoor did not respond', time: '25 min ago', read: true },
];

export const kpiData = {
  totalPatients: 202,
  avgWaitTime: 14.5,
  tokensCompleted: 89,
  noShows: 12,
  emergencyInsertions: 3,
  activeDoctors: 13,
  departments: 9,
  satisfactionScore: 4.3,
  queueEfficiency: 87,
  slaBreaches: 2,
};
