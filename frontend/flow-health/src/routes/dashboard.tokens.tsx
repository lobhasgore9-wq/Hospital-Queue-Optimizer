import { createFileRoute } from '@tanstack/react-router';
import { type Token } from '@/lib/demo-data';
import { Search, Filter, Printer, QrCode, RotateCcw, Plus, Eye, Edit2, ArrowUpDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTokenStore } from '@/lib/token-store';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export const Route = createFileRoute('/dashboard/tokens')({ component: TokensPage });

function TokensPage() {
  const { tokens, loading, updateToken, addToken } = useTokenStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [showNewToken, setShowNewToken] = useState(false);
  const [sortField, setSortField] = useState<'number' | 'eta' | 'registeredAt'>('registeredAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = tokens
    .filter((t) => filter === 'all' || t.status === filter)
    .filter((t) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        t.number.toLowerCase().includes(q) ||
        t.patientName.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q) ||
        t.doctor.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q) ||
        t.priority.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortField === 'eta') return (a.eta - b.eta) * dir;
      return a[sortField].localeCompare(b[sortField]) * dir;
    });

  const handleStatusChange = (id: string, newStatus: Token['status']) => {
    updateToken(id, { status: newStatus });
  };

  const handleRecoverMissed = (id: string) => {
    updateToken(id, { status: 'waiting', eta: 15 });
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const statusCounts = {
    all: tokens.length,
    waiting: tokens.filter(t => t.status === 'waiting').length,
    called: tokens.filter(t => t.status === 'called').length,
    'in-consultation': tokens.filter(t => t.status === 'in-consultation').length,
    completed: tokens.filter(t => t.status === 'completed').length,
    missed: tokens.filter(t => t.status === 'missed').length,
    delayed: tokens.filter(t => t.status === 'delayed').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Token Management</h1>
          <p className="text-sm text-muted-foreground">View, search, and manage all patient tokens across departments</p>
        </div>
        <Button onClick={() => setShowNewToken(true)} className="gap-2"><Plus className="h-4 w-4" /> New Token</Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 w-full sm:w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search by token, patient, doctor, dept..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['all', 'waiting', 'called', 'in-consultation', 'completed', 'missed', 'delayed'] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${filter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
              {s === 'all' ? 'All' : s.replace('-', ' ')} ({statusCounts[s]})
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer" onClick={() => toggleSort('number')}>
                  <span className="flex items-center gap-1">Token <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Patient</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Dept</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Doctor</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Priority</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer" onClick={() => toggleSort('registeredAt')}>
                  <span className="flex items-center gap-1">Registered <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer" onClick={() => toggleSort('eta')}>
                  <span className="flex items-center gap-1 justify-end">ETA <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="py-12 text-center text-muted-foreground">No tokens found matching "{search}"</td></tr>
              ) : filtered.map((t) => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs font-bold text-primary">{t.number}</td>
                  <td className="py-3 px-4 text-foreground">{t.patientName}</td>
                  <td className="py-3 px-4 text-muted-foreground">{t.department}</td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">{t.doctor}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      t.status === 'in-consultation' ? 'bg-success/10 text-success' :
                      t.status === 'called' ? 'bg-info/10 text-info' :
                      t.status === 'waiting' ? 'bg-warning/10 text-warning' :
                      t.status === 'completed' ? 'bg-primary/10 text-primary' :
                      t.status === 'missed' ? 'bg-destructive/10 text-destructive' :
                      t.status === 'delayed' ? 'bg-warning/10 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>{t.status.replace('-', ' ')}</span>
                  </td>
                  <td className="py-3 px-4">
                    {t.priority !== 'normal' ? (
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${t.priority === 'emergency' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>{t.priority}</span>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground capitalize">{t.type}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{t.registeredAt}</td>
                  <td className="py-3 px-4 text-right text-xs text-muted-foreground">{t.eta > 0 ? `${t.eta} min` : '—'}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelectedToken(t)} className="h-7 w-7 flex items-center justify-center rounded hover:bg-accent text-muted-foreground"><Eye className="h-3.5 w-3.5" /></button>
                      {t.status === 'missed' && <button onClick={() => handleRecoverMissed(t.id)} className="h-7 w-7 flex items-center justify-center rounded hover:bg-accent text-warning" title="Recover"><RotateCcw className="h-3.5 w-3.5" /></button>}
                      {t.status === 'waiting' && <button onClick={() => handleStatusChange(t.id, 'called')} className="h-7 px-2 flex items-center justify-center rounded bg-primary/10 text-primary text-xs hover:bg-primary/20">Call</button>}
                      {t.status === 'called' && <button onClick={() => handleStatusChange(t.id, 'in-consultation')} className="h-7 px-2 flex items-center justify-center rounded bg-success/10 text-success text-xs hover:bg-success/20">Start</button>}
                      {t.status === 'in-consultation' && <button onClick={() => handleStatusChange(t.id, 'completed')} className="h-7 px-2 flex items-center justify-center rounded bg-info/10 text-info text-xs hover:bg-info/20">Done</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-4 py-3 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filtered.length} of {tokens.length} tokens</span>
          <span>Last updated: just now</span>
        </div>
      </div>

      {/* Token Detail Dialog */}
      <Dialog open={!!selectedToken} onOpenChange={() => setSelectedToken(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Token Details — {selectedToken?.number}</DialogTitle>
            <DialogDescription>Full details for this patient token</DialogDescription>
          </DialogHeader>
          {selectedToken && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4 bg-muted/30 text-center">
                <div className="text-3xl font-bold text-primary font-mono">{selectedToken.number}</div>
                <div className="text-sm text-muted-foreground mt-1">{selectedToken.department}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Patient:</span> <span className="text-foreground font-medium">{selectedToken.patientName}</span></div>
                <div><span className="text-muted-foreground">Doctor:</span> <span className="text-foreground font-medium">{selectedToken.doctor}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <span className="text-foreground font-medium capitalize">{selectedToken.status.replace('-', ' ')}</span></div>
                <div><span className="text-muted-foreground">Priority:</span> <span className="text-foreground font-medium capitalize">{selectedToken.priority}</span></div>
                <div><span className="text-muted-foreground">Type:</span> <span className="text-foreground font-medium capitalize">{selectedToken.type}</span></div>
                <div><span className="text-muted-foreground">Registered:</span> <span className="text-foreground font-medium">{selectedToken.registeredAt}</span></div>
                <div><span className="text-muted-foreground">ETA:</span> <span className="text-foreground font-medium">{selectedToken.eta > 0 ? `${selectedToken.eta} min` : 'N/A'}</span></div>
                <div><span className="text-muted-foreground">Position:</span> <span className="text-foreground font-medium">#{selectedToken.position}</span></div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1"><QrCode className="h-3.5 w-3.5" /> QR Code</Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1"><Printer className="h-3.5 w-3.5" /> Print</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Token Dialog */}
      <Dialog open={showNewToken} onOpenChange={setShowNewToken}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate New Token</DialogTitle>
            <DialogDescription>Register a patient and assign a queue token</DialogDescription>
          </DialogHeader>
          <NewTokenForm onSubmit={(t) => { addToken(t); setShowNewToken(false); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NewTokenForm({ onSubmit }: { onSubmit: (t: Token) => void }) {
  const [name, setName] = useState('');
  const [dept, setDept] = useState('OPD');
  const [priority, setPriority] = useState<Token['priority']>('normal');
  const [type, setType] = useState<Token['type']>('walk-in');

  const deptPrefixes: Record<string, string> = { OPD: 'OPD', Cardiology: 'CARDIO', Radiology: 'XRAY', Pathology: 'LAB', Pediatrics: 'PED', Orthopedics: 'ORTHO', Emergency: 'ER', Pharmacy: 'PHARM', Billing: 'BILL' };
  const deptDoctors: Record<string, string> = { OPD: 'Dr. Priya Sharma', Cardiology: 'Dr. Rajesh Gupta', Radiology: 'Dr. Sneha Iyer', Pathology: 'Dr. Sanjay Verma', Pediatrics: 'Dr. Ananya Patel', Orthopedics: 'Dr. Vikram Singh', Emergency: 'Dr. Karan Mehta', Pharmacy: 'Staff', Billing: 'Staff' };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const prefix = deptPrefixes[dept] || 'OPD';
    const num = String(Math.floor(Math.random() * 900) + 100);
    const now = new Date();
    const token: Token = {
      id: String(Date.now()),
      number: `${prefix}-${num}`,
      patientName: name,
      department: dept,
      doctor: deptDoctors[dept] || 'Staff',
      status: 'waiting',
      priority,
      eta: Math.floor(Math.random() * 20) + 5,
      position: Math.floor(Math.random() * 10) + 1,
      registeredAt: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
      type,
    };
    api.post('/tokens', token).then(() => {
      onSubmit(token);
    }).catch(() => {
      onSubmit(token);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground">Patient Name</label>
        <input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" placeholder="Enter patient name" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-foreground">Department</label>
          <select value={dept} onChange={e => setDept(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
            {Object.keys(deptPrefixes).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Priority</label>
          <select value={priority} onChange={e => setPriority(e.target.value as Token['priority'])} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
            <option value="normal">Normal</option>
            <option value="emergency">Emergency</option>
            <option value="senior">Senior Citizen</option>
            <option value="disability">Disability</option>
            <option value="pregnant">Pregnant</option>
            <option value="vip">VIP</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Type</label>
        <div className="mt-1 flex gap-3">
          <label className="flex items-center gap-2 text-sm text-foreground"><input type="radio" checked={type === 'walk-in'} onChange={() => setType('walk-in')} /> Walk-in</label>
          <label className="flex items-center gap-2 text-sm text-foreground"><input type="radio" checked={type === 'appointment'} onChange={() => setType('appointment')} /> Appointment</label>
        </div>
      </div>
      <Button type="submit" className="w-full">Generate Token</Button>
    </form>
  );
}
