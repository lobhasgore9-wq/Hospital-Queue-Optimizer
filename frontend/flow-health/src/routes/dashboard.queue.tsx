import { createFileRoute } from '@tanstack/react-router';
import { Monitor, Users, Clock, AlertTriangle } from 'lucide-react';
import { useTokenStore } from '@/lib/token-store';
import { departments } from '@/lib/demo-data';

export const Route = createFileRoute('/dashboard/queue')({ component: LiveQueuePage });

function LiveQueuePage() {
  const { tokens } = useTokenStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Live Queue Monitor</h1>
        <p className="text-sm text-muted-foreground">Real-time department-wise queue status and patient flow visibility</p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center gap-1.5 text-xs font-medium text-success"><span className="h-2 w-2 rounded-full bg-success animate-pulse-slow" /> System Live</span>
        <span className="text-xs text-muted-foreground">• Last updated: just now</span>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const deptTokens = tokens.filter((t) => t.department === dept.name);
          const currentToken = deptTokens.find((t) => t.status === 'in-consultation');
          const nextToken = deptTokens.find((t) => t.status === 'waiting' || t.status === 'called');
          const waitingCount = deptTokens.filter((t) => t.status === 'waiting').length;
          const load = Math.round((dept.patients / 50) * 100);

          return (
            <div key={dept.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-card transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: dept.color }} />
                  <h3 className="text-sm font-semibold text-foreground">{dept.name}</h3>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${load > 80 ? 'bg-destructive/10 text-destructive' : load > 60 ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                  {load}% load
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="rounded-lg bg-muted/50 p-2.5">
                  <div className="text-xs text-muted-foreground">Current Token</div>
                  <div className="text-sm font-mono font-bold text-primary">{currentToken?.number || '—'}</div>
                </div>
                <div className="rounded-lg bg-muted/50 p-2.5">
                  <div className="text-xs text-muted-foreground">Next Token</div>
                  <div className="text-sm font-mono font-semibold text-foreground">{nextToken?.number || '—'}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {dept.patients} patients</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~{dept.avgWait} min wait</span>
                <span className="flex items-center gap-1"><Monitor className="h-3 w-3" /> {dept.doctors} docs</span>
              </div>

              <div className="mt-3 h-1.5 rounded-full bg-muted">
                <div className="h-1.5 rounded-full transition-all" style={{ width: `${Math.min(load, 100)}%`, backgroundColor: dept.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
