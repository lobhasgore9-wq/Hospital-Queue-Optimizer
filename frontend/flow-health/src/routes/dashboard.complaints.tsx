import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { MessageSquare, Plus, X, CheckCircle, Clock, AlertTriangle, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { subscribeToComplaints, addComplaint, updateComplaint, deleteComplaint } from '@/lib/firestore';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

export const Route = createFileRoute('/dashboard/complaints')({ component: ComplaintsPage });

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  submittedBy: string;
  department: string;
  createdAt?: any;
}

const categories = ['Patient Care', 'Waiting Time', 'Staff Behavior', 'Facility', 'Billing', 'Other'];
const departments = ['OPD', 'Cardiology', 'Radiology', 'Pathology', 'Pediatrics', 'Orthopedics', 'Emergency', 'Pharmacy', 'Billing'];

const priorityColor: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-warning/10 text-warning',
  high: 'bg-orange-500/10 text-orange-500',
  urgent: 'bg-destructive/10 text-destructive',
};

const statusColor: Record<string, string> = {
  open: 'bg-warning/10 text-warning',
  'in-progress': 'bg-primary/10 text-primary',
  resolved: 'bg-success/10 text-success',
  closed: 'bg-muted text-muted-foreground',
};

const statusIcon: Record<string, any> = {
  open: AlertTriangle,
  'in-progress': Clock,
  resolved: CheckCircle,
  closed: X,
};

function ComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Subscribe to real-time Firestore updates
  useEffect(() => {
    const unsubscribe = subscribeToComplaints((data) => {
      setComplaints(data as Complaint[]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddComplaint = async (data: Omit<Complaint, 'id'>) => {
    try {
      await addComplaint({ ...data, submittedBy: user?.name || 'Staff' });
      setShowNew(false);
      toast.success('Complaint submitted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit complaint. Please try again.');
      throw err;
    }
  };

  const handleStatusUpdate = async (id: string, status: Complaint['status']) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    try {
      await updateComplaint(id, { status });
      toast.success(`Status updated to "${status}"`);
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
    try {
      await deleteComplaint(id);
      toast.success('Complaint deleted.');
    } catch {
      toast.error('Failed to delete complaint.');
    }
  };

  const filtered = complaints
    .filter(c => statusFilter === 'all' || c.status === statusFilter)
    .filter(c => !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase())
    );

  const counts = {
    open: complaints.filter(c => c.status === 'open').length,
    'in-progress': complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    closed: complaints.filter(c => c.status === 'closed').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Complaints & Feedback</h1>
          <p className="text-sm text-muted-foreground">Manage patient and staff complaints — synced in real-time with Firestore</p>
        </div>
        <Button onClick={() => setShowNew(true)} className="gap-2">
          <Plus className="h-4 w-4" /> New Complaint
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(counts).map(([status, count]) => {
          const Icon = statusIcon[status];
          return (
            <div key={status} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${statusColor[status]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{count}</div>
                <div className="text-xs text-muted-foreground capitalize">{status.replace('-', ' ')}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 w-full sm:w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search complaints..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['all', 'open', 'in-progress', 'resolved', 'closed'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${statusFilter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
            >
              {s === 'all' ? 'All' : s.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Complaint List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No complaints found.</p>
          </div>
        ) : (
          filtered.map(c => {
            const Icon = statusIcon[c.status];
            return (
              <div key={c.id} className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${statusColor[c.status]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground text-sm">{c.title}</span>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${priorityColor[c.priority]}`}>{c.priority}</span>
                    <span className="text-xs text-muted-foreground">{c.category}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.description}</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    {c.department} · Submitted by {c.submittedBy}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[c.status]}`}>
                    {c.status.replace('-', ' ')}
                  </span>
                  <div className="relative group">
                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                      Update <ChevronDown className="h-3 w-3" />
                    </Button>
                    <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-border bg-card shadow-lg z-10 hidden group-hover:block">
                      {(['open', 'in-progress', 'resolved', 'closed'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusUpdate(c.id, s)}
                          className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-accent capitalize"
                        >
                          {s.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(c.id)} className="text-destructive hover:text-destructive text-xs">
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Complaint Dialog */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit New Complaint</DialogTitle>
            <DialogDescription>Record a patient or staff complaint or feedback</DialogDescription>
          </DialogHeader>
          <NewComplaintForm onSubmit={handleAddComplaint} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NewComplaintForm({ onSubmit }: { onSubmit: (data: Omit<Complaint, 'id'>) => Promise<void> }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState<Complaint['priority']>('medium');
  const [department, setDepartment] = useState(departments[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({ title, description, category, priority, department, status: 'open', submittedBy: 'Staff' });
      setTitle(''); setDescription('');
    } catch {
      // handled in parent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground">Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" placeholder="Brief complaint title" />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" placeholder="Describe the issue in detail..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-foreground">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Priority</label>
          <select value={priority} onChange={e => setPriority(e.target.value as Complaint['priority'])} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
            {(['low', 'medium', 'high', 'urgent'] as const).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Department</label>
        <select value={department} onChange={e => setDepartment(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Complaint'}
      </Button>
    </form>
  );
}
