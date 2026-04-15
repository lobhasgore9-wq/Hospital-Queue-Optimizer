import { createFileRoute } from '@tanstack/react-router';
import { Monitor, Users, Clock, AlertTriangle } from 'lucide-react';
import { useTokenStore } from '@/lib/token-store';
import { departments } from '@/lib/demo-data';

export const Route = createFileRoute('/dashboard/queue')({ component: LiveQueuePage });

function LiveQueuePage() {
  const { tokens } = useTokenStore();

  return (
    <div className="space-y-8 pb-10 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground font-heading">Live Queue Monitor</h1>
          <p className="text-muted-foreground font-medium">Real-time tracking of department throughput and patient flow</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl glass-panel border-success/20">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse shadow-glow-primary" />
          <span className="text-[10px] font-bold text-success uppercase tracking-widest">Active Monitoring</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const deptTokens = tokens.filter((t) => t.department === dept.name);
          const currentToken = deptTokens.find((t) => t.status === 'in-consultation');
          const nextToken = deptTokens.find((t) => t.status === 'waiting' || t.status === 'called');
          const load = Math.round((dept.patients / 50) * 100);

          return (
            <div key={dept.id} className="glass-card rounded-3xl p-6 border-white/10 hover-lift group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                <Monitor className="h-12 w-12 text-foreground" />
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full shadow-sm" style={{ backgroundColor: dept.color }} />
                  <h3 className="text-lg font-bold text-foreground font-heading">{dept.name}</h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                  load > 80 ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'
                }`}>
                  {load}% Load
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 relative group/item">
                  <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5 opacity-60">Now Serving</div>
                  {currentToken ? (
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-black text-primary font-mono">{currentToken.number}</div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-foreground truncate max-w-[120px]">{currentToken.patientName}</div>
                        <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">Consultation Room 0{dept.id}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-muted-foreground opacity-30 italic">No Active Consultation</div>
                  )}
                </div>

                <div className="rounded-2xl bg-black/5 border border-border/20 p-4">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 opacity-60">Next in Queue</div>
                  {nextToken ? (
                    <div className="flex items-center justify-between">
                       <div className="text-xl font-bold text-foreground font-mono">{nextToken.number}</div>
                       <div className="text-right">
                         <div className="text-xs font-semibold text-foreground/80">{nextToken.patientName}</div>
                         <div className="text-[9px] font-medium text-muted-foreground">ETA: 5m</div>
                       </div>
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-muted-foreground opacity-30 italic">Queue Empty</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-4 border-t border-border/10">
                <div className="text-center">
                  <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-tighter mb-1">Capacity</div>
                  <div className="text-sm font-bold text-foreground">{dept.patients}</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-tighter mb-1">Doctors</div>
                  <div className="text-sm font-bold text-foreground">{dept.doctors}</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-tighter mb-1">Wait</div>
                  <div className="text-sm font-bold text-success">~{dept.avgWait}m</div>
                </div>
              </div>

              <div className="h-1.5 w-full bg-border/20 rounded-full overflow-hidden mt-2">
                <div className="h-full transition-all duration-1000" style={{ width: `${load}%`, backgroundColor: dept.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
