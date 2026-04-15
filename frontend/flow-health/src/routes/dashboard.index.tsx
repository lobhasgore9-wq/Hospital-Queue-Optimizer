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
    <div className="glass-card rounded-3xl p-6 hover-lift border-white/10 group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity">{label}</span>
        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className="text-3xl font-bold text-foreground font-heading tracking-tight mb-2">{value}</div>
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${positive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {delta}
        </div>
        <span className="text-[10px] font-medium text-muted-foreground opacity-50">vs last cycle</span>
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
  const [data, setData] = useState<any>(FALLBACK_DATA);
  const [activeTokens, setActiveTokens] = useState<any[]>([]);
  const [backendStatus, setBackendStatus] = useState<'loading' | 'live' | 'offline'>('loading');

  useEffect(() => {
    let retryTimeout: ReturnType<typeof setTimeout>;

    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        setData(res);
        setBackendStatus('live');
      } catch {
        setBackendStatus('offline');
        retryTimeout = setTimeout(fetchDashboard, 20000);
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

    return () => clearTimeout(retryTimeout);
  }, []);

  const { kpiData, waitTimeData, tokenStatusData, departments, notifications } = data;

  return (
    <div className="space-y-8 pb-10 animate-fade-in-up">
      {backendStatus === 'offline' && (
        <div className="rounded-2xl border border-warning/20 bg-warning/5 px-6 py-4 text-sm text-warning flex items-center gap-3 backdrop-blur-md animate-pulse-slow">
          <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <span className="font-semibold">Backend is warming up</span> — Currently showing demo data. Your live environment will sync automatically.
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground font-heading">HQO Dashboard</h1>
            {backendStatus === 'live' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-[10px] font-bold text-success uppercase tracking-widest border border-success/20">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Live Systems
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 text-[10px] font-bold text-warning uppercase tracking-widest border border-warning/20">
                <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
                Syncing Data
              </span>
            )}
          </div>
          <p className="text-muted-foreground font-medium">
            Welcome back, Administrator. Here's what's happening today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.
          </p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 rounded-xl bg-primary text-white font-semibold text-sm hover:shadow-glow-primary transition-all active:scale-95">Generate Report</button>
           <button className="px-4 py-2 rounded-xl bg-card border border-border text-foreground font-semibold text-sm hover:bg-muted transition-all">Export Data</button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <KPICard label="Capacity" value={kpiData.totalPatients} delta="+12%" icon={Users} positive />
        <KPICard label="Efficiency" value={`${kpiData.avgWaitTime}m`} delta="-40%" icon={Clock} positive />
        <KPICard label="Throughput" value={kpiData.tokensCompleted} delta="+8%" icon={Ticket} positive />
        <KPICard label="Physicians" value={kpiData.activeDoctors} delta="+2" icon={Stethoscope} positive />
        <KPICard label="Anomalies" value={kpiData.noShows} delta="-23%" icon={AlertTriangle} positive />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 hover-lift">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-foreground font-heading">Patient Flow Analysis</h3>
              <p className="text-xs text-muted-foreground">Wait time distribution across departments (hourly)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" /> OPD
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-destructive" /> Cardio
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waitTimeData}>
                <defs>
                  <linearGradient id="colorOpd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} unit="m" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: '0 10px 30px oklch(0 0 0 / 10%)' }}
                />
                <Area type="monotone" dataKey="opd" stroke="var(--primary)" fillOpacity={1} fill="url(#colorOpd)" strokeWidth={3} />
                <Area type="monotone" dataKey="cardio" stroke="var(--destructive)" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8 hover-lift">
          <h3 className="text-lg font-bold text-foreground mb-1 font-heading">Token Distribution</h3>
          <p className="text-xs text-muted-foreground mb-8">Current system load by status</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={tokenStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                  {tokenStatusData.map((entry: any) => (
                    <Cell key={entry.name} fill={entry.fill} className="hover:opacity-80 transition-opacity" />
                  ))}
                </Pie>
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {tokenStatusData.map((d: any) => (
              <div key={d.name} className="flex flex-col">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                   <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: d.fill }} />
                   {d.name}
                </div>
                <div className="text-lg font-bold text-foreground">{d.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Department Progress */}
        <div className="glass-card rounded-3xl p-8 hover-lift">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground font-heading">Department Performance</h3>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-6">
            {departments.slice(0, 5).map((dept: any) => {
              const load = Math.round((dept.patients / 50) * 100);
              return (
                <div key={dept.id} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-sm font-bold text-foreground">{dept.name}</span>
                      <span className="text-[10px] text-muted-foreground ml-2 uppercase font-bold tracking-tighter opacity-70">{dept.prefix}</span>
                    </div>
                    <span className="text-xs font-bold text-primary">{load}% Load</span>
                  </div>
                  <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ 
                        width: `${Math.min(load, 100)}%`, 
                        background: `linear-gradient(90deg, ${dept.color}, color-mix(in oklch, ${dept.color} 80%, white))` 
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Stream */}
        <div className="glass-card rounded-3xl p-8 hover-lift">
           <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground font-heading">Intelligence Stream</h3>
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <div className="space-y-4">
            {notifications.map((n: any) => (
              <div key={n.id} className="group relative flex items-start gap-4 p-3 rounded-2xl hover:bg-primary/5 transition-all">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  n.type === 'urgent' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                }`}>
                  <Bell className="h-5 w-5 group-hover:animate-swing" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">{n.title}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                  <span className="text-[10px] font-medium text-muted-foreground/50 mt-1 block uppercase tracking-tighter">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Tokens Terminal */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-premium hover-lift border-primary/10">
        <div className="bg-primary/5 px-8 py-4 border-b border-primary/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-primary uppercase tracking-widest font-heading">Token Real-time Monitoring</h3>
          <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-destructive/40" />
            <div className="h-2 w-2 rounded-full bg-warning/40" />
            <div className="h-2 w-2 rounded-full bg-success/40" />
          </div>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border/50">
                <th className="pb-4 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Identifier</th>
                <th className="pb-4 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Patient Name</th>
                <th className="pb-4 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Unit</th>
                <th className="pb-4 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="pb-4 px-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Delay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {activeTokens.map((t) => (
                <tr key={t.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="py-4 px-4 font-mono text-xs font-bold text-primary group-hover:pl-6 transition-all">{t.number}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-foreground">{t.patientName}</td>
                  <td className="py-4 px-4 text-xs font-medium text-muted-foreground">{t.department}</td>
                  <td className="py-4 px-4 text-xs font-medium text-muted-foreground">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight ${
                       t.status === 'in-consultation' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      {t.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-xs font-bold text-foreground/70">{t.eta > 0 ? `+${t.eta} m` : 'ON TIME'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {activeTokens.length === 0 && (
            <div className="py-20 text-center">
               <div className="text-muted-foreground font-mono text-xs opacity-50">NO ACTIVE TRANSMISSIONS FOUND</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
