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
            <div key={dept.id} className="glass-card rounded-[2rem] p-7 border-white/5 hover-lift group overflow-hidden relative shadow-2xl">
              {/* Background Accent */}
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-5 transition-all group-hover:scale-150 duration-700" style={{ backgroundColor: dept.color }} />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-4 w-4 rounded-full shadow-lg animate-pulse" style={{ backgroundColor: dept.color, boxShadow: `0 0 15px ${dept.color}` }} />
                  <h3 className="text-2xl font-bold text-foreground font-heading tracking-tight">{dept.name}</h3>
                </div>
                <div className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 ${
                  load > 80 ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'
                }`}>
                  {load}% System Load
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {/* Now Serving - Priority Box */}
                <div className={`relative rounded-3xl p-6 transition-all border ${
                  currentToken ? 'bg-primary/10 border-primary/20 shadow-glow-primary' : 'bg-black/5 border-border/10'
                }`}>
                  <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3 opacity-70">Now Serving</div>
                  {currentToken ? (
                    <div className="flex items-center justify-between">
                      <div className="text-4xl font-black text-primary font-mono tracking-tighter">{currentToken.number}</div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-foreground mb-1">{currentToken.patientName}</div>
                        <div className="flex items-center gap-1 justify-end text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                           <Activity className="h-3 w-3" /> Room 0{dept.id}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 py-2">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                         <Clock className="h-5 w-5 text-muted-foreground/30" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-muted-foreground/40 italic">Standby Mode</div>
                        <div className="text-[10px] font-medium text-muted-foreground/30 uppercase">Waiting for next transmission</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Next in Queue */}
                <div className="rounded-3xl bg-white/5 border border-border/10 p-5 hover:bg-white/10 transition-colors">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3 opacity-60">Next in Queue</div>
                  {nextToken ? (
                    <div className="flex items-center justify-between">
                       <div className="text-2xl font-bold text-foreground font-mono tracking-tight">{nextToken.number}</div>
                       <div className="text-right">
                         <div className="text-sm font-bold text-foreground/80">{nextToken.patientName}</div>
                         <div className="text-[10px] font-bold text-success uppercase tracking-tighter mt-1">Ready in ~5m</div>
                       </div>
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-muted-foreground opacity-20 py-2">Queue Buffer Empty</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-6 border-t border-border/10">
                <div className="flex flex-col items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground opacity-40" />
                  <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Size</div>
                  <div className="text-lg font-black text-foreground">{dept.patients}</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-muted-foreground opacity-40" />
                  <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Active</div>
                  <div className="text-lg font-black text-foreground">{dept.doctors}</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Clock className="h-4 w-4 text-success opacity-40" />
                  <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Wait</div>
                  <div className="text-lg font-black text-success">~{dept.avgWait}m</div>
                </div>
              </div>

              <div className="relative h-2 w-full bg-border/10 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-1000 ease-out shadow-glow-primary" 
                  style={{ width: `${load}%`, backgroundColor: dept.color }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
