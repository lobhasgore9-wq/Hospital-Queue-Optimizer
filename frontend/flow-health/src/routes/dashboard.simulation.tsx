import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, AlertTriangle, UserPlus, MinusCircle, Clock, Zap, Activity, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const Route = createFileRoute('/dashboard/simulation')({ component: SimulationPage });

const deptNodes = [
  { id: 'reception', label: 'Reception', x: 50, y: 200, color: '#0ea5e9' },
  { id: 'opd', label: 'OPD', x: 250, y: 100, color: '#0ea5e9' },
  { id: 'cardio', label: 'Cardiology', x: 250, y: 200, color: '#ef4444' },
  { id: 'pedia', label: 'Pediatrics', x: 250, y: 300, color: '#22c55e' },
  { id: 'lab', label: 'Lab', x: 450, y: 150, color: '#f59e0b' },
  { id: 'pharmacy', label: 'Pharmacy', x: 450, y: 250, color: '#10b981' },
  { id: 'billing', label: 'Billing', x: 600, y: 200, color: '#6366f1' },
];

function SimulationPage() {
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [scenario, setScenario] = useState<string | null>(null);
  const [stats, setStats] = useState({ patients: 45, avgWait: 14, bottleneck: 'OPD', efficiency: 87 });
  const [isStressTesting, setIsStressTesting] = useState(false);

  useEffect(() => {
    let interval: any;
    if (running) {
      interval = setInterval(() => {
        setStats(prev => ({
          ...prev,
          patients: prev.patients + (Math.random() > 0.7 ? 1 : -0.5),
          avgWait: Math.max(5, prev.avgWait + (Math.random() - 0.4)),
          efficiency: Math.min(100, Math.max(40, prev.efficiency + (Math.random() - 0.5))),
        }));
      }, 3000 / speed);
    }
    return () => clearInterval(interval);
  }, [running, speed]);

  const applyScenario = (s: string) => {
    setScenario(s);
    setIsStressTesting(false);
    if (s === 'emergency') {
      setStats({ patients: 46, avgWait: 18, bottleneck: 'Emergency', efficiency: 79 });
      toast.warning('Emergency Scenario Active', { description: 'Prioritizing critical patients and clearing corridors.' });
    } else if (s === 'doctor-out') {
      setStats({ patients: 45, avgWait: 22, bottleneck: 'Cardiology', efficiency: 72 });
      toast.error('Surgeon Unavailable', { description: 'Cardiology appointments being rescheduled.' });
    } else if (s === 'peak') {
      setStats({ patients: 68, avgWait: 28, bottleneck: 'OPD', efficiency: 65 });
      toast.info('Peak Hour Simulation', { description: 'Scaling up reception capacity.' });
    } else {
      setStats({ patients: 45, avgWait: 14, bottleneck: 'OPD', efficiency: 87 });
    }
  };

  const runStressTest = () => {
    setRunning(true);
    setSpeed(4);
    setIsStressTesting(true);
    setScenario(null);
    setStats({ patients: 120, avgWait: 55, bottleneck: 'All Departments', efficiency: 32 });
    toast.error('STRESS TEST INITIATED', { 
      description: 'Simulating multi-casualty event. All systems at maximum load.',
      duration: 5000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Queue Simulation Lab</h1>
          <p className="text-sm text-muted-foreground">Digital twin of hospital operations — test scenarios and predict bottlenecks</p>
        </div>
        <Button 
          variant={isStressTesting ? "destructive" : "outline"} 
          onClick={runStressTest}
          className="gap-2"
        >
          <Zap className={`h-4 w-4 ${isStressTesting ? 'fill-current' : ''}`} /> 
          {isStressTesting ? 'System Stressing...' : 'Run Stress Test'}
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-1 shadow-sm">
          <Button size="sm" variant={running ? 'default' : 'ghost'} onClick={() => setRunning(!running)} className="gap-1">
            {running ? <><Pause className="h-3 w-3" /> Pause</> : <><Play className="h-3 w-3" /> Start</>}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setRunning(false); applyScenario(''); }} className="gap-1">
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>
          <div className="h-4 w-px bg-border mx-1" />
          {[1, 2, 4].map(s => (
            <Button key={s} size="sm" variant={speed === s ? 'secondary' : 'ghost'} onClick={() => setSpeed(s)} className="px-2 h-7 min-w-8">
              {s}x
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground font-medium">Predictive Scenarios:</span>
          {[
            { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
            { id: 'doctor-out', label: 'Staff Out', icon: MinusCircle },
            { id: 'peak', label: 'Peak Hour', icon: UserPlus },
          ].map((s) => (
            <Button key={s.id} size="sm" variant={scenario === s.id ? 'default' : 'outline'} onClick={() => applyScenario(s.id)} className="gap-1.5 text-xs h-8">
              <s.icon className="h-3.5 w-3.5" /> {s.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Live Load', value: Math.floor(stats.patients), color: isStressTesting ? 'text-destructive' : 'text-primary', icon: Users },
          { label: 'Predicted Wait', value: `${Math.floor(stats.avgWait)} min`, color: stats.avgWait > 30 ? 'text-destructive' : 'text-success', icon: Clock },
          { label: 'Critical Node', value: stats.bottleneck, color: 'text-warning', icon: AlertTriangle },
          { label: 'System Efficiency', value: `${Math.floor(stats.efficiency)}%`, color: stats.efficiency > 80 ? 'text-success' : 'text-destructive', icon: Activity },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${s.color.replace('text-', 'bg-')}`} />
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground font-medium">{s.label}</div>
              <s.icon className={`h-3.5 w-3.5 ${s.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
            </div>
            <div className={`text-xl font-bold mt-2 ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Visualization Canvas */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> Dynamic Patient Flow
          </h3>
          {running && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Simulation Active</span>
            </div>
          )}
        </div>

        <div className="relative h-[420px]">
          <svg width="100%" height="100%" viewBox="0 0 700 400" className="text-muted-foreground/30">
            {/* Connection lines */}
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.4" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            
            <g stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4">
              <path d="M 100,200 L 230,100" />
              <path d="M 100,200 L 230,200" />
              <path d="M 100,200 L 230,300" />
              <path d="M 300,100 L 430,150" />
              <path d="M 300,200 L 430,150" />
              <path d="M 300,200 L 430,250" />
              <path d="M 300,300 L 430,250" />
              <path d="M 500,150 L 580,200" />
              <path d="M 500,250 L 580,200" />
            </g>

            {/* Department nodes */}
            {deptNodes.map((node) => (
              <g key={node.id} className="transition-transform duration-300">
                <rect 
                  x={node.x - 45} y={node.y - 25} width="90" height="50" rx="14" 
                  fill="white" stroke={node.color} strokeWidth="1.5"
                  className="shadow-sm filter drop-shadow-sm" 
                />
                <rect 
                  x={node.x - 45} y={node.y - 25} width="90" height="50" rx="14" 
                  fill={node.color} fillOpacity="0.08" 
                />
                <text 
                  x={node.x} y={node.y + 5} textAnchor="middle" 
                  fill="#1f2937" fontSize="10" fontWeight="700"
                >
                  {node.label.toUpperCase()}
                </text>
                {/* Node indicator */}
                <circle cx={node.x + 35} cy={node.y - 15} r="3" fill={node.color} />
              </g>
            ))}

            {/* Animated particles */}
            {running && (
              <>
                {[...Array(isStressTesting ? 15 : 6)].map((_, i) => (
                  <circle key={`p1-${i}`} r="3.5" fill="#0ea5e9" opacity="0.8">
                    <animateMotion dur={`${(3 + i * 0.5) / speed}s`} repeatCount="indefinite" path="M 100,200 L 250,100" begin={`${i * 0.4}s`} />
                  </circle>
                ))}
                {[...Array(isStressTesting ? 12 : 5)].map((_, i) => (
                  <circle key={`p2-${i}`} r="3.5" fill="#ef4444" opacity="0.8">
                    <animateMotion dur={`${(4 + i * 0.7) / speed}s`} repeatCount="indefinite" path="M 100,200 L 250,200" begin={`${i * 0.6}s`} />
                  </circle>
                ))}
                {[...Array(isStressTesting ? 10 : 4)].map((_, i) => (
                  <circle key={`p3-${i}`} r="3.5" fill="#22c55e" opacity="0.8">
                    <animateMotion dur={`${(3.5 + i * 0.6) / speed}s`} repeatCount="indefinite" path="M 100,200 L 250,300" begin={`${i * 0.5}s`} />
                  </circle>
                ))}
                <circle r="3" fill="#f59e0b"><animateMotion dur={`${2.5 / speed}s`} repeatCount="indefinite" path="M 300,100 L 450,150" /></circle>
                <circle r="3" fill="#10b981"><animateMotion dur={`${3 / speed}s`} repeatCount="indefinite" path="M 300,200 L 450,250" /></circle>
                <circle r="3" fill="#6366f1"><animateMotion dur={`${2 / speed}s`} repeatCount="indefinite" path="M 500,150 L 600,200" /></circle>
              </>
            )}
          </svg>

          {/* Canvas Floor Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* AI Insights and Health Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-warning" /> AI Predictive Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { text: 'OPD queue pressure at 78% — consider redirecting 3 patients to Dr. Kavita Nair.', urgent: true },
              { text: 'Peak congestion expected between 10AM–11AM based on historical data.', urgent: false },
              { text: 'Dr. Vikram Singh delayed by 15 min — 4 orthopedics patients notified.', urgent: true },
              { text: 'No-show rate for Cardiology is 18% today vs 8% average.', urgent: false },
            ].map((r, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-xl px-4 py-3 border transition-colors ${r.urgent ? 'bg-destructive/5 border-destructive/20' : 'bg-muted/30 border-transparent hover:border-border'}`}>
                {r.urgent ? <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" /> : <div className="h-4 w-4 rounded-full bg-primary/20 shrink-0 mt-0.5" />}
                <p className="text-xs leading-relaxed text-foreground/90">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Simulation Metadata</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Computation Model</span>
              <span className="font-mono font-medium">M/M/c Queue Model</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Confidence Interval</span>
              <span className="font-mono font-medium text-success">98.4%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Historical Data Points</span>
              <span className="font-mono font-medium">1.2M Entries</span>
            </div>
            <div className="pt-2 border-t border-border mt-2">
              <div className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Resource Allocation</div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                <div className="h-full bg-primary" style={{ width: '45%' }} />
                <div className="h-full bg-success" style={{ width: '30%' }} />
                <div className="h-full bg-warning" style={{ width: '15%' }} />
                <div className="h-full bg-destructive" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
