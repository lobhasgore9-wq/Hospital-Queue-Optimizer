import { createFileRoute } from '@tanstack/react-router';
import { useTokenStore } from '@/lib/token-store';
import { Clock, User, Activity, CheckCircle, AlertTriangle, XCircle, Stethoscope } from 'lucide-react';

export const Route = createFileRoute('/dashboard/patient-status')({ component: PatientStatusPage });

function PatientStatusPage() {
  const { tokens, loading } = useTokenStore();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-3 min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading patient status board...</p>
      </div>
    );
  }
  const waiting = tokens.filter(t => t.status === 'waiting');
  const called = tokens.filter(t => t.status === 'called');
  const inConsultation = tokens.filter(t => t.status === 'in-consultation');
  const completed = tokens.filter(t => t.status === 'completed');
  const missed = tokens.filter(t => t.status === 'missed');
  const delayed = tokens.filter(t => t.status === 'delayed');

  const groups = [
    { title: 'In Consultation', icon: Stethoscope, tokens: inConsultation, color: 'border-success bg-success/5', badge: 'bg-success/10 text-success', desc: 'Currently being seen by a doctor' },
    { title: 'Called — Please Proceed', icon: Activity, tokens: called, color: 'border-warning bg-warning/5 animate-pulse', badge: 'bg-warning/10 text-warning', desc: 'Token called, patient should proceed to room' },
    { title: 'Waiting in Queue', icon: Clock, tokens: waiting, color: 'border-border bg-card', badge: 'bg-warning/10 text-warning', desc: 'Waiting for their turn' },
    { title: 'Delayed', icon: AlertTriangle, tokens: delayed, color: 'border-warning bg-warning/5', badge: 'bg-warning/10 text-warning', desc: 'Delayed due to doctor unavailability or queue pressure' },
    { title: 'Completed', icon: CheckCircle, tokens: completed, color: 'border-border bg-card', badge: 'bg-primary/10 text-primary', desc: 'Consultation finished' },
    { title: 'Missed', icon: XCircle, tokens: missed, color: 'border-destructive/30 bg-destructive/5', badge: 'bg-destructive/10 text-destructive', desc: 'Did not respond when called' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Patient Status Board</h1>
        <p className="text-sm text-muted-foreground">Live overview of all patients — who is waiting, being treated, or has completed their visit</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-border bg-card p-3 text-center"><div className="text-2xl font-bold text-success">{inConsultation.length}</div><div className="text-xs text-muted-foreground">In Consultation</div></div>
        <div className="rounded-xl border border-border bg-card p-3 text-center"><div className="text-2xl font-bold text-warning">{called.length}</div><div className="text-xs text-muted-foreground">Called</div></div>
        <div className="rounded-xl border border-border bg-card p-3 text-center"><div className="text-2xl font-bold text-foreground">{waiting.length}</div><div className="text-xs text-muted-foreground">Waiting</div></div>
        <div className="rounded-xl border border-border bg-card p-3 text-center"><div className="text-2xl font-bold text-warning">{delayed.length}</div><div className="text-xs text-muted-foreground">Delayed</div></div>
        <div className="rounded-xl border border-border bg-card p-3 text-center"><div className="text-2xl font-bold text-primary">{completed.length}</div><div className="text-xs text-muted-foreground">Completed</div></div>
        <div className="rounded-xl border border-border bg-card p-3 text-center"><div className="text-2xl font-bold text-destructive">{missed.length}</div><div className="text-xs text-muted-foreground">Missed</div></div>
      </div>

      {/* Groups */}
      {groups.map(g => g.tokens.length > 0 && (
        <div key={g.title}>
          <div className="flex items-center gap-2 mb-3">
            <g.icon className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">{g.title}</h2>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${g.badge}`}>{g.tokens.length}</span>
            <span className="text-xs text-muted-foreground ml-2">{g.desc}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {g.tokens.map(t => (
              <div key={t.id} className={`rounded-xl border p-4 ${g.color} transition-all`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold font-mono text-primary">{t.number}</span>
                  {t.priority !== 'normal' && <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.priority === 'emergency' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>{t.priority}</span>}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{t.patientName}</span>
                </div>
                <div className="text-xs text-muted-foreground">{t.department} · {t.doctor}</div>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>Registered: {t.registeredAt}</span>
                  {t.eta > 0 && <span>ETA: {t.eta} min</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
