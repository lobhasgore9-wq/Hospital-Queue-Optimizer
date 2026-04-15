import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { FileText, Download, Calendar, Filter, BarChart3, Users, Clock, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { kpiData, departments, tokens } from '@/lib/demo-data';

export const Route = createFileRoute('/dashboard/reports')({ component: ReportsPage });

const reportTypes = [
  { id: 'daily-summary', name: 'Daily Summary Report', icon: BarChart3, description: 'Complete overview of daily operations including patient count, wait times, and completion rates' },
  { id: 'department-load', name: 'Department Load Report', icon: Activity, description: 'Department-wise patient distribution, doctor workload, and bottleneck analysis' },
  { id: 'wait-time', name: 'Wait Time Analysis', icon: Clock, description: 'Average, median, and peak wait times by department and hour' },
  { id: 'patient-flow', name: 'Patient Flow Report', icon: Users, description: 'Patient journey from registration to discharge with stage-wise timing' },
  { id: 'no-show', name: 'No-Show & Cancellation', icon: FileText, description: 'Missed appointments, no-show patterns, and cancellation trends' },
  { id: 'doctor-performance', name: 'Doctor Performance', icon: Users, description: 'Doctor-wise consultation count, avg time per patient, and patient satisfaction' },
];

function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('daily-summary');
  const [dateRange, setDateRange] = useState('today');

  const generateCSV = (reportId: string) => {
    let csv = '';
    if (reportId === 'daily-summary') {
      csv = 'Metric,Value\n';
      csv += `Total Patients,${kpiData.totalPatients}\n`;
      csv += `Avg Wait Time,${kpiData.avgWaitTime} min\n`;
      csv += `Tokens Completed,${kpiData.tokensCompleted}\n`;
      csv += `No Shows,${kpiData.noShows}\n`;
      csv += `Active Doctors,${kpiData.activeDoctors}\n`;
      csv += `Queue Efficiency,${kpiData.queueEfficiency}%\n`;
      csv += `SLA Breaches,${kpiData.slaBreaches}\n`;
    } else if (reportId === 'department-load') {
      csv = 'Department,Patients,Avg Wait (min),Doctors\n';
      departments.forEach(d => { csv += `${d.name},${d.patients},${d.avgWait},${d.doctors}\n`; });
    } else if (reportId === 'patient-flow') {
      csv = 'Token,Patient,Department,Doctor,Status,Priority,Registered,ETA\n';
      tokens.forEach(t => { csv += `${t.number},${t.patientName},${t.department},${t.doctor},${t.status},${t.priority},${t.registeredAt},${t.eta}\n`; });
    } else {
      csv = 'Report data for: ' + reportId;
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${reportId}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Exports</h1>
          <p className="text-sm text-muted-foreground">Generate and export operational reports in CSV format</p>
        </div>
        <div className="flex gap-2">
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground">
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map(r => (
          <div key={r.id} className={`rounded-xl border bg-card p-5 cursor-pointer transition-all hover:shadow-md ${selectedReport === r.id ? 'border-primary ring-1 ring-primary/20' : 'border-border'}`} onClick={() => setSelectedReport(r.id)}>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><r.icon className="h-5 w-5 text-primary" /></div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{r.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{r.description}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="mt-4 w-full gap-1" onClick={(e) => { e.stopPropagation(); generateCSV(r.id); }}>
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
          </div>
        ))}
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Report Preview — {reportTypes.find(r => r.id === selectedReport)?.name}</h2>
        {selectedReport === 'daily-summary' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-lg border border-border p-3"><div className="text-2xl font-bold text-foreground">{kpiData.totalPatients}</div><div className="text-xs text-muted-foreground">Total Patients</div></div>
            <div className="rounded-lg border border-border p-3"><div className="text-2xl font-bold text-foreground">{kpiData.avgWaitTime} min</div><div className="text-xs text-muted-foreground">Avg Wait Time</div></div>
            <div className="rounded-lg border border-border p-3"><div className="text-2xl font-bold text-foreground">{kpiData.tokensCompleted}</div><div className="text-xs text-muted-foreground">Completed</div></div>
            <div className="rounded-lg border border-border p-3"><div className="text-2xl font-bold text-foreground">{kpiData.queueEfficiency}%</div><div className="text-xs text-muted-foreground">Efficiency</div></div>
          </div>
        )}
        {selectedReport === 'department-load' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="text-left py-2 px-3 text-xs text-muted-foreground">Department</th><th className="text-left py-2 px-3 text-xs text-muted-foreground">Patients</th><th className="text-left py-2 px-3 text-xs text-muted-foreground">Avg Wait</th><th className="text-left py-2 px-3 text-xs text-muted-foreground">Doctors</th></tr></thead>
              <tbody>{departments.map(d => <tr key={d.id} className="border-b border-border/50"><td className="py-2 px-3 text-foreground">{d.name}</td><td className="py-2 px-3 text-foreground">{d.patients}</td><td className="py-2 px-3 text-foreground">{d.avgWait} min</td><td className="py-2 px-3 text-foreground">{d.doctors}</td></tr>)}</tbody>
            </table>
          </div>
        )}
        {selectedReport !== 'daily-summary' && selectedReport !== 'department-load' && (
          <div className="text-center py-8 text-muted-foreground text-sm">Select this report type and click "Export CSV" to download the full dataset.</div>
        )}
      </div>
    </div>
  );
}
