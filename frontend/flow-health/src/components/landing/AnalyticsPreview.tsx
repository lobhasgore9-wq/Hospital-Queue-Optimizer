import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

const deptData = [
  { name: 'OPD', value: 42, fill: '#0ea5e9' },
  { name: 'Cardio', value: 28, fill: '#ef4444' },
  { name: 'Pedia', value: 22, fill: '#22c55e' },
  { name: 'Ortho', value: 19, fill: '#06b6d4' },
  { name: 'Radiology', value: 15, fill: '#a855f7' },
  { name: 'ER', value: 8, fill: '#dc2626' },
];

const waitData = [
  { hour: '8AM', before: 35, after: 18 },
  { hour: '9AM', before: 42, after: 22 },
  { hour: '10AM', before: 55, after: 25 },
  { hour: '11AM', before: 48, after: 22 },
  { hour: '12PM', before: 30, after: 15 },
  { hour: '1PM', before: 22, after: 10 },
  { hour: '2PM', before: 45, after: 20 },
  { hour: '3PM', before: 52, after: 28 },
  { hour: '4PM', before: 40, after: 22 },
  { hour: '5PM', before: 25, after: 14 },
];

const doctorLoad = [
  { name: 'Dr. Sharma', patients: 12 },
  { name: 'Dr. Gupta', patients: 9 },
  { name: 'Dr. Patel', patients: 8 },
  { name: 'Dr. Singh', patients: 10 },
  { name: 'Dr. Krishnan', patients: 11 },
  { name: 'Dr. Reddy', patients: 7 },
];

const kpis = [
  { label: 'Total Patients', value: '202', delta: '+12%', positive: true },
  { label: 'Avg Wait Time', value: '14.5 min', delta: '-40%', positive: true },
  { label: 'Queue Efficiency', value: '87%', delta: '+8%', positive: true },
  { label: 'No-Shows', value: '12', delta: '-23%', positive: true },
];

export function AnalyticsPreview() {
  return (
    <section id="analytics" className="py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-4">
            Analytics Engine
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Data-Driven Hospital Operations
          </h2>
          <p className="text-muted-foreground text-lg">
            Real-time analytics that help administrators identify bottlenecks, 
            optimize doctor utilization, and reduce patient wait times measurably.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-xl border border-border bg-background p-5">
              <div className="text-xs text-muted-foreground mb-1">{k.label}</div>
              <div className="text-2xl font-bold text-foreground">{k.value}</div>
              <div className={`text-xs font-medium mt-1 ${k.positive ? 'text-success' : 'text-destructive'}`}>{k.delta} vs last week</div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Wait Time Before/After */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-background p-6">
            <h3 className="text-sm font-semibold text-foreground mb-1">Wait Time: Before vs After Optimization</h3>
            <p className="text-xs text-muted-foreground mb-4">Average patient wait time reduced by 40% across all departments</p>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={waitData}>
                  <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: 12 }} />
                  <Area type="monotone" dataKey="before" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} name="Before HQO" />
                  <Area type="monotone" dataKey="after" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.15} strokeWidth={2} name="After HQO" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="rounded-xl border border-border bg-background p-6">
            <h3 className="text-sm font-semibold text-foreground mb-1">Patient Distribution</h3>
            <p className="text-xs text-muted-foreground mb-4">Current department-wise patient load</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deptData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {deptData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              {deptData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.fill }} />
                  {d.name}
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Load */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-background p-6">
            <h3 className="text-sm font-semibold text-foreground mb-1">Doctor-Wise Patient Load</h3>
            <p className="text-xs text-muted-foreground mb-4">Identifies overloaded doctors and enables smart patient redistribution</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={doctorLoad}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: 12 }} />
                  <Bar dataKey="patients" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
