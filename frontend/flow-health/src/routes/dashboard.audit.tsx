import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Shield, Search, Filter } from 'lucide-react';

export const Route = createFileRoute('/dashboard/audit')({ component: AuditPage });

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  target: string;
  details: string;
  category: 'token' | 'queue' | 'access' | 'settings' | 'patient';
}

const auditLogs: AuditEntry[] = [
  { id: '1', timestamp: '2026-04-14 09:45:12', user: 'Priya Mehta', role: 'Receptionist', action: 'Token Generated', target: 'OPD-005', details: 'Walk-in patient Amit Shah registered with normal priority', category: 'token' },
  { id: '2', timestamp: '2026-04-14 09:42:30', user: 'Dr. Rajesh Gupta', role: 'Doctor', action: 'Status Updated', target: 'CARDIO-001', details: 'Changed from called → in-consultation', category: 'token' },
  { id: '3', timestamp: '2026-04-14 09:40:05', user: 'System', role: 'System', action: 'Emergency Insert', target: 'ER-002', details: 'Emergency patient auto-inserted at queue position 1', category: 'queue' },
  { id: '4', timestamp: '2026-04-14 09:38:22', user: 'Sanjay Verma', role: 'Admin', action: 'Queue Reassigned', target: 'OPD Queue', details: '3 patients redistributed from Dr. Priya to Dr. Meera due to load balancing', category: 'queue' },
  { id: '5', timestamp: '2026-04-14 09:35:10', user: 'System', role: 'System', action: 'Missed Token', target: 'OPD-004', details: 'Anil Kapoor did not respond within 10 min grace period', category: 'token' },
  { id: '6', timestamp: '2026-04-14 09:30:00', user: 'Sanjay Verma', role: 'Admin', action: 'Settings Changed', target: 'Queue Rules', details: 'SLA breach threshold changed from 25 min to 30 min', category: 'settings' },
  { id: '7', timestamp: '2026-04-14 09:25:45', user: 'Kavita Nair', role: 'Nurse', action: 'Priority Override', target: 'ORTHO-001', details: 'Deepak Choudhary priority changed to disability', category: 'patient' },
  { id: '8', timestamp: '2026-04-14 09:20:30', user: 'System', role: 'System', action: 'Doctor Delayed', target: 'Dr. Vikram Singh', details: 'Orthopedics doctor delayed — queue ETA recalculated', category: 'queue' },
  { id: '9', timestamp: '2026-04-14 09:15:00', user: 'Priya Mehta', role: 'Receptionist', action: 'Token Recovered', target: 'OPD-003', details: 'Missed token for Mohammed Ali recovered and re-queued', category: 'token' },
  { id: '10', timestamp: '2026-04-14 09:10:12', user: 'Amit Joshi', role: 'Super Admin', action: 'User Login', target: 'Admin Portal', details: 'Login from IP 192.168.1.45', category: 'access' },
  { id: '11', timestamp: '2026-04-14 09:05:00', user: 'System', role: 'System', action: 'Shift Started', target: 'Morning Shift', details: '15 doctors checked in, 9 departments active', category: 'settings' },
  { id: '12', timestamp: '2026-04-14 08:55:30', user: 'Priya Mehta', role: 'Receptionist', action: 'Patient Registered', target: 'Geeta Verma', details: 'Walk-in registration — Pathology, pregnant priority', category: 'patient' },
];

function AuditPage() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const filtered = auditLogs
    .filter(l => catFilter === 'all' || l.category === catFilter)
    .filter(l => !search || l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()) || l.target.toLowerCase().includes(search.toLowerCase()) || l.details.toLowerCase().includes(search.toLowerCase()));

  const catColors: Record<string, string> = { token: 'bg-primary/10 text-primary', queue: 'bg-warning/10 text-warning', access: 'bg-info/10 text-info', settings: 'bg-muted text-muted-foreground', patient: 'bg-success/10 text-success' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">Track all token changes, status updates, and access history for compliance</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 w-full sm:w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['all', 'token', 'queue', 'access', 'settings', 'patient'].map(c => (
            <button key={c} onClick={() => setCatFilter(c)} className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${catFilter === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Timestamp</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">User</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Action</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Target</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Category</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 text-xs text-muted-foreground font-mono whitespace-nowrap">{l.timestamp}</td>
                  <td className="py-3 px-4"><div className="text-foreground text-xs">{l.user}</div><div className="text-xs text-muted-foreground">{l.role}</div></td>
                  <td className="py-3 px-4 text-foreground text-xs font-medium">{l.action}</td>
                  <td className="py-3 px-4 text-xs text-primary font-mono">{l.target}</td>
                  <td className="py-3 px-4"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${catColors[l.category]}`}>{l.category}</span></td>
                  <td className="py-3 px-4 text-xs text-muted-foreground max-w-xs truncate">{l.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-4 py-3 bg-muted/20 text-xs text-muted-foreground">Showing {filtered.length} of {auditLogs.length} entries</div>
      </div>
    </div>
  );
}
