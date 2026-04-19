import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Clock, Plus, Search, X, Check, AlertTriangle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { doctors } from '@/lib/demo-data';
import { subscribeToAppointments, addAppointment, updateAppointment, addPayment } from '@/lib/firestore';
import { toast } from 'sonner';
import { QrCode } from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no-show';
  type: 'regular' | 'follow-up' | 'emergency';
  notes: string;
}

const today = new Date().toISOString().slice(0, 10);
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

const initialAppointments: Appointment[] = [
  { id: '1', patientName: 'Rahul Kumar', doctor: 'Dr. Priya Sharma', department: 'OPD', date: today, time: '09:00', status: 'confirmed', type: 'regular', notes: 'Routine check-up' },
  { id: '2', patientName: 'Sunita Devi', doctor: 'Dr. Rajesh Gupta', department: 'Cardiology', date: today, time: '09:30', status: 'confirmed', type: 'follow-up', notes: 'Post-surgery follow-up' },
  { id: '3', patientName: 'Mohammed Ali', doctor: 'Dr. Ananya Patel', department: 'Pediatrics', date: today, time: '10:00', status: 'pending', type: 'regular', notes: 'Child vaccination' },
  { id: '4', patientName: 'Geeta Verma', doctor: 'Dr. Sneha Iyer', department: 'Radiology', date: today, time: '10:30', status: 'completed', type: 'regular', notes: 'X-Ray results review' },
  { id: '5', patientName: 'Anil Kapoor', doctor: 'Dr. Vikram Singh', department: 'Orthopedics', date: today, time: '11:00', status: 'no-show', type: 'follow-up', notes: 'Knee pain follow-up' },
  { id: '6', patientName: 'Preeti Singh', doctor: 'Dr. Meera Krishnan', department: 'OPD', date: today, time: '11:30', status: 'cancelled', type: 'regular', notes: 'Patient requested cancellation' },
  { id: '7', patientName: 'Ravi Shankar', doctor: 'Dr. Rajesh Gupta', department: 'Cardiology', date: today, time: '14:00', status: 'confirmed', type: 'emergency', notes: 'Chest pain evaluation' },
  { id: '8', patientName: 'Kavita Nair', doctor: 'Dr. Priya Sharma', department: 'OPD', date: tomorrow, time: '09:00', status: 'pending', type: 'regular', notes: 'General consultation' },
  { id: '9', patientName: 'Deepak Choudhary', doctor: 'Dr. Sanjay Verma', department: 'Pathology', date: tomorrow, time: '10:00', status: 'confirmed', type: 'regular', notes: 'Blood test review' },
  { id: '10', patientName: 'Lakshmi Narayan', doctor: 'Dr. Ananya Patel', department: 'Pediatrics', date: tomorrow, time: '11:00', status: 'pending', type: 'follow-up', notes: 'Follow-up after fever' },
];

export const Route = createFileRoute('/dashboard/appointments')({ component: AppointmentsPage });

function AppointmentsPage() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNew, setShowNew] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  // Subscribe to real-time Firestore updates
  useEffect(() => {
    const unsubscribe = subscribeToAppointments((data) => {
      if (data.length > 0) {
        setAppointments(data as Appointment[]);
      } else {
        setAppointments(initialAppointments);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filtered = appointments
    .filter(a => statusFilter === 'all' || a.status === statusFilter)
    .filter(a => !search || a.patientName.toLowerCase().includes(search.toLowerCase()) || a.doctor.toLowerCase().includes(search.toLowerCase()) || a.department.toLowerCase().includes(search.toLowerCase()))
    .filter(a => a.date === selectedDate);

  const statusCounts = {
    confirmed: appointments.filter(a => a.date === selectedDate && a.status === 'confirmed').length,
    pending: appointments.filter(a => a.date === selectedDate && a.status === 'pending').length,
    completed: appointments.filter(a => a.date === selectedDate && a.status === 'completed').length,
    'no-show': appointments.filter(a => a.date === selectedDate && a.status === 'no-show').length,
    cancelled: appointments.filter(a => a.date === selectedDate && a.status === 'cancelled').length,
  };

  const updateStatus = async (id: string, status: Appointment['status']) => {
    // Optimistic update
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    try {
      await updateAppointment(id, { status });
    } catch {
      toast.error('Failed to update appointment status');
    }
  };

  const handlePaymentConfirm = async () => {
    if (!selectedAppointmentId) return;
    try {
      // 1. Record the payment in Firestore
      await addPayment({
        appointmentId: selectedAppointmentId,
        amount: 200, // Registration fee
        method: 'UPI',
        status: 'completed',
        date: new Date().toISOString(),
      });
      // 2. Update the appointment status to confirmed
      await updateStatus(selectedAppointmentId, 'confirmed');
      toast.success('Payment successful & Appointment confirmed!');
      setPaymentModalOpen(false);
      setSelectedAppointmentId(null);
    } catch (error) {
      toast.error('Payment processing failed');
    }
  };

  const handleNewAppointment = async (appointmentData: Omit<Appointment, 'id'>) => {
    try {
      const created = (await addAppointment(appointmentData)) as Appointment;
      setSelectedDate(created.date);
      setShowNew(false);
      toast.success('Appointment booked and saved to Firestore!');
    } catch (err) {
      console.error('Failed to book appointment:', err);
      toast.error('Failed to book appointment. Check Firestore rules.');
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-sm text-muted-foreground">Schedule, manage, and track patient appointments across departments</p>
        </div>
        <Button onClick={() => setShowNew(true)} className="gap-2"><Plus className="h-4 w-4" /> Book Appointment</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="rounded-xl border border-border bg-card p-3">
            <div className="text-2xl font-bold text-foreground">{count}</div>
            <div className="text-xs text-muted-foreground capitalize">{status.replace('-', ' ')}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 w-full sm:w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search patient, doctor, dept..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground" />
        </div>
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground" />
        <div className="flex gap-1.5 flex-wrap">
          {['all', 'confirmed', 'pending', 'completed', 'no-show', 'cancelled'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${statusFilter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
              {s === 'all' ? 'All' : s.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Appointment List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">No appointments found for the selected date and filters.</div>
        ) : filtered.map(a => (
          <div key={a.id} className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="font-medium text-foreground truncate">{a.patientName}</div>
                <div className="text-xs text-muted-foreground">{a.doctor} · {a.department}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {a.time}</div>
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                a.status === 'confirmed' ? 'bg-success/10 text-success' :
                a.status === 'pending' ? 'bg-warning/10 text-warning' :
                a.status === 'completed' ? 'bg-primary/10 text-primary' :
                a.status === 'no-show' ? 'bg-destructive/10 text-destructive' :
                'bg-muted text-muted-foreground'
              }`}>{a.status.replace('-', ' ')}</span>
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                a.type === 'emergency' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
              }`}>{a.type}</span>
            </div>
            <div className="flex gap-1.5">
              {a.status === 'pending' && <Button size="sm" variant="default" onClick={() => { setSelectedAppointmentId(a.id); setPaymentModalOpen(true); }} className="gap-1 text-xs"><QrCode className="h-3 w-3" /> Pay & Confirm</Button>}
              {a.status === 'confirmed' && <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, 'completed')} className="gap-1 text-xs"><Check className="h-3 w-3" /> Complete</Button>}
              {(a.status === 'confirmed' || a.status === 'pending') && <Button size="sm" variant="ghost" onClick={() => updateStatus(a.id, 'cancelled')} className="gap-1 text-xs text-destructive"><X className="h-3 w-3" /> Cancel</Button>}
              {a.status === 'confirmed' && <Button size="sm" variant="ghost" onClick={() => updateStatus(a.id, 'no-show')} className="gap-1 text-xs"><AlertTriangle className="h-3 w-3" /> No-Show</Button>}
            </div>
          </div>
        ))}
      </div>

      {/* New Appointment Dialog */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book New Appointment</DialogTitle>
            <DialogDescription>Schedule a patient appointment</DialogDescription>
          </DialogHeader>
          <NewAppointmentForm onSubmit={handleNewAppointment} />
        </DialogContent>
      </Dialog>
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>Scan QR to pay the 200rs registration fee.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4 space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
               {/* Dummy QR Code Placeholder */}
               <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="Payment QR" className="w-48 h-48" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg text-foreground">₹200.00</p>
              <p className="text-sm text-muted-foreground">UPI ID: 7385399392@axl</p>
            </div>
            <Button onClick={handlePaymentConfirm} className="w-full gap-2 mt-4">
              <Check className="w-4 h-4" /> Confirm Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NewAppointmentForm({ onSubmit }: { onSubmit: (a: Omit<Appointment, 'id'>) => Promise<void> }) {
  const [name, setName] = useState('');
  const [doctor, setDoctor] = useState(doctors[0].name);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('09:00');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedDoctor = doctors.find(d => d.name === doctor);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({
        patientName: name,
        doctor,
        department: selectedDoctor?.department || 'OPD',
        date, time,
        status: 'pending',
        type: 'regular',
        notes,
      });
      // Reset form on success
      setName('');
      setNotes('');
    } catch {
      // Error already handled by parent via toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="text-sm font-medium text-foreground">Patient Name</label><input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" required /></div>
      <div><label className="text-sm font-medium text-foreground">Doctor</label><select value={doctor} onChange={e => setDoctor(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">{doctors.map(d => <option key={d.id} value={d.name}>{d.name} — {d.department}</option>)}</select></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium text-foreground">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" /></div>
        <div><label className="text-sm font-medium text-foreground">Time</label><input type="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" /></div>
      </div>
      <div><label className="text-sm font-medium text-foreground">Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" rows={2} /></div>
      <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Booking...' : 'Book Appointment'}</Button>
    </form>
  );
}
