import { createFileRoute } from '@tanstack/react-router';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { patientDistribution, waitTimeData, tokenStatusData, kpiData, departments, doctors } from '@/lib/demo-data';

export const Route = createFileRoute('/dashboard/analytics')({ component: AnalyticsPage });

const chartStyle = { backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: 12 };

const doctorLoad = doctors.slice(0, 8).map((d) => ({ name: d.name.replace('Dr. ', ''), patients: d.patients, avgTime: d.avgTime }));

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Department Analytics</h1>
        <p className="text-sm text-muted-foreground">Comprehensive operational insights to identify bottlenecks, optimize resources, and improve patient experience</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Queue Efficiency', value: `${kpiData.queueEfficiency}%`, color: 'text-success' },
          { label: 'Satisfaction', value: `${kpiData.satisfactionScore}/5`, color: 'text-primary' },
          { label: 'SLA Breaches', value: kpiData.slaBreaches, color: 'text-destructive' },
          { label: 'Emergency Cases', value: kpiData.emergencyInsertions, color: 'text-warning' },
          { label: 'Departments', value: kpiData.departments, color: 'text-info' },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs text-muted-foreground">{k.label}</div>
            <div className={`text-2xl font-bold mt-1 ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Wait time by hour */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Wait Time by Hour</h3>
          <p className="text-xs text-muted-foreground mb-4">Identifies peak congestion windows for staffing optimization</p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={waitTimeData}>
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" unit=" min" />
                <Tooltip contentStyle={chartStyle} />
                <Area type="monotone" dataKey="opd" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.1} strokeWidth={2} name="OPD" />
                <Area type="monotone" dataKey="cardio" stroke="#ef4444" fill="#ef4444" fillOpacity={0.08} strokeWidth={2} name="Cardiology" />
                <Area type="monotone" dataKey="pedia" stroke="#22c55e" fill="#22c55e" fillOpacity={0.08} strokeWidth={2} name="Pediatrics" />
                <Area type="monotone" dataKey="ortho" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.08} strokeWidth={2} name="Orthopedics" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient distribution */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Patient Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">Helps balance patient load across departments</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie data={patientDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {patientDistribution.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={chartStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {patientDistribution.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.fill }} />{d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>

        {/* Doctor productivity */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Doctor-Wise Patient Load</h3>
          <p className="text-xs text-muted-foreground mb-4">Identifies imbalanced workload for smarter patient redistribution</p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={doctorLoad}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="currentColor" className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
                <Tooltip contentStyle={chartStyle} />
                <Bar dataKey="patients" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Patients" />
                <Bar dataKey="avgTime" fill="#a855f7" radius={[4, 4, 0, 0]} name="Avg Time (min)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
