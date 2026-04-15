import { createFileRoute } from '@tanstack/react-router';
import { Activity, Users, Clock, Ticket, AlertTriangle, Stethoscope, TrendingUp, TrendingDown, Bell } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardOverview,
});

function KPICard({ label, value, delta, icon: Icon, positive }: { label: string; value: string | number; delta: string; icon: any; positive: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 hover:shadow-card transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="flex items-center gap-1 mt-1">
        {positive ? <TrendingUp className="h-3 w-3 text-success" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
        <span className={`text-xs font-medium ${positive ? 'text-success' : 'text-destructive'}`}>{delta}</span>
        <span className="text-xs text-muted-foreground">vs last week</span>
      </div>
    </div>
  );
}

const FALLBACK_DATA = {
  kpiData: { totalPatients: 202, avgWaitTime: 14.5, tokensCompleted: 89, noShows: 12, emergencyInsertions: 3, activeDoctors: 13 },
  waitTimeData: [
    { hour: '8AM', opd: 12, cardio: 20, pedia: 10 },
    { hour: '10AM', opd: 25, cardio: 30, pedia: 18 },
    { hour: '12PM', opd: 15, cardio: 22, pedia: 12 },
    { hour: '2PM', opd: 20, cardio: 26, pedia: 16 },
    { hour: '4PM', opd: 22, cardio: 25, pedia: 15 },
  ],
  tokenStatusData: [
    { name: 'Waiting', value: 68, fill: '#f59e0b' },
    { name: 'In Consultation', value: 24, fill: '#22c55e' },
    { name: 'Completed', value: 89, fill: '#0ea5e9' },
    { name: 'Missed', value: 12, fill: '#ef4444' },
  ],
  departments: [
    { id: 'opd', name: 'OPD', color: '#0ea5e9', patients: 42 },
    { id: 'cardio', name: 'Cardiology', color: '#ef4444', patients: 28 },
    { id: 'radio', name: 'Radiology', color: '#a855f7', patients: 15 },
    { id: 'path', name: 'Pathology', color: '#f59e0b', patients: 35 },
    { id: 'pedia', name: 'Pediatrics', color: '#22c55e', patients: 22 },
    { id: 'ortho', name: 'Orthopedics', color: '#06b6d4', patients: 19 },
    { id: 'er', name: 'Emergency', color: '#dc2626', patients: 8 },
  ],
  notifications: [
    { id: 1, type: 'token', title: 'Token Generated', message: 'Token OPD-005 generated for Amit Shah', time: '2 min ago', read: false },
    { id: 2, type: 'alert', title: '3 Turns Left', message: 'Patient Sunita Devi — your turn is approaching in OPD', time: '5 min ago', read: false },
    { id: 3, type: 'urgent', title: 'Emergency Insertion', message: 'Emergency patient inserted in ER queue — Token ER-002', time: '8 min ago', read: true },
  ],
};

function DashboardOverview() {
  const [data, setData] = useState<any>(null);
  const [activeTokens, setActiveTokens] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        setData(res);
      } catch (err) {
        console.warn('Backend unavailable, using fallback data:', err);
        setData(FALLBACK_DATA);
        setError('Could not connect to backend — showing demo data.');
      } finally {
        setLoading(false);
      }
    };

    const fetchTokens = async () => {
      try {
        const res = await api.get('/tokens');
        setActiveTokens(res.filter((t: any) => t.status === 'waiting' || t.status === 'called' || t.status === 'in-consultation'));
      } catch {
        setActiveTokens([]);
      }
    };

    fetchDashboard();
    fetchTokens();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading dashboard metrics...</p>
      </div>
    );
  }

  const { kpiData, waitTimeData, tokenStatusData, departments, notifications } = data;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">Real-time hospital operations snapshot — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <KPICard label="Total Patients Today" value={kpiData.totalPatients} delta="+12%" icon={Users} positive />
        <KPICard label="Avg Wait Time" value={`${kpiData.avgWaitTime} min`} delta="-40%" icon={Clock} positive />
        <KPICard label="Tokens Completed" value={kpiData.tokensCompleted} delta="+8%" icon={Ticket} positive />
        <KPICard label="Active Doctors" value={kpiData.activeDoctors} delta="+2" icon={Stethoscope} positive />
        <KPICard label="No-Shows" value={kpiData.noShows} delta="-23%" icon={AlertTriangle} positive />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Wait time trend */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Wait Time Trend (Today)</h3>
          <p className="text-xs text-muted-foreground mb-4">Average patient wait across departments, updated every hour</p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={waitTimeData}>
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" unit=" min" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: 12 }} />
                <Area type="monotone" dataKey="opd" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.1} strokeWidth={2} name="OPD" />
                <Area type="monotone" dataKey="cardio" stroke="#ef4444" fill="#ef4444" fillOpacity={0.08} strokeWidth={2} name="Cardiology" />
                <Area type="monotone" dataKey="pedia" stroke="#22c55e" fill="#22c55e" fillOpacity={0.08} strokeWidth={2} name="Pediatrics" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Token status donut */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Token Status</h3>
          <p className="text-xs text-muted-foreground mb-4">Breakdown of today's {kpiData.totalPatients} tokens</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie data={tokenStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {tokenStatusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {tokenStatusData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.fill }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department load + Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Department load */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Department Load</h3>
          <div className="space-y-3">
            {departments.slice(0, 7).map((dept) => {
              const load = Math.round((dept.patients / 50) * 100);
              return (
                <div key={dept.id} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-foreground w-24 truncate">{dept.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min(load, 100)}%`, backgroundColor: dept.color }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{dept.patients}</span>
                  <span className="text-xs font-medium w-12 text-right" style={{ color: load > 80 ? '#ef4444' : load > 60 ? '#f59e0b' : '#22c55e' }}>{load}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent notifications */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
            <span className="text-xs text-primary cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-3">
            {notifications.slice(0, 5).map((n) => (
              <div key={n.id} className={`flex items-start gap-3 rounded-lg px-3 py-2 ${!n.read ? 'bg-primary/5' : ''}`}>
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${n.type === 'urgent' ? 'bg-destructive/10 text-destructive' : n.type === 'complete' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                  <Bell className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-foreground">{n.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{n.message}</div>
                  <div className="text-xs text-muted-foreground/60 mt-0.5">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active tokens */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Active Tokens</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Token</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Patient</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Department</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Doctor</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Priority</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground">ETA</th>
              </tr>
            </thead>
            <tbody>
              {activeTokens.map((t) => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-xs font-semibold text-primary">{t.number}</td>
                  <td className="py-2.5 px-3 text-foreground">{t.patientName}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{t.department}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{t.doctor}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      t.status === 'in-consultation' ? 'bg-success/10 text-success' :
                      t.status === 'called' ? 'bg-info/10 text-info' :
                      t.status === 'waiting' ? 'bg-warning/10 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>{t.status.replace('-', ' ')}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    {t.priority !== 'normal' && (
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        t.priority === 'emergency' ? 'bg-destructive/10 text-destructive' :
                        'bg-warning/10 text-warning'
                      }`}>{t.priority}</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right text-muted-foreground">{t.eta > 0 ? `${t.eta} min` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
