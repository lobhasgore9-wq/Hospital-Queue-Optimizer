import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Play, Pause, RotateCcw, FastForward, AlertTriangle, UserPlus, MinusCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const applyScenario = (s: string) => {
    setScenario(s);
    if (s === 'emergency') setStats({ patients: 46, avgWait: 18, bottleneck: 'Emergency', efficiency: 79 });
    else if (s === 'doctor-out') setStats({ patients: 45, avgWait: 22, bottleneck: 'Cardiology', efficiency: 72 });
    else if (s === 'peak') setStats({ patients: 68, avgWait: 28, bottleneck: 'OPD', efficiency: 65 });
    else setStats({ patients: 45, avgWait: 14, bottleneck: 'OPD', efficiency: 87 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Queue Simulation Lab</h1>
        <p className="text-sm text-muted-foreground">Digital twin of hospital operations — test scenarios, predict bottlenecks, and optimize staffing before they happen</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-1">
          <Button size="sm" variant={running ? 'default' : 'ghost'} onClick={() => setRunning(!running)} className="gap-1">
            {running ? <><Pause className="h-3 w-3" /> Pause</> : <><Play className="h-3 w-3" /> Start</>}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setRunning(false); applyScenario(''); }} className="gap-1">
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSpeed(Math.min(speed + 1, 4))} className="gap-1">
            <FastForward className="h-3 w-3" /> {speed}x
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Scenarios:</span>
          {[
            { id: 'emergency', label: 'Emergency Patient', icon: AlertTriangle },
            { id: 'doctor-out', label: 'Doctor Unavailable', icon: MinusCircle },
            { id: 'peak', label: 'Peak Hour Rush', icon: UserPlus },
          ].map((s) => (
            <Button key={s.id} size="sm" variant={scenario === s.id ? 'default' : 'outline'} onClick={() => applyScenario(s.id)} className="gap-1 text-xs">
              <s.icon className="h-3 w-3" /> {s.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Patients', value: stats.patients, color: 'text-primary' },
          { label: 'Avg Wait Time', value: `${stats.avgWait} min`, color: stats.avgWait > 20 ? 'text-destructive' : 'text-success' },
          { label: 'Bottleneck', value: stats.bottleneck, color: 'text-warning' },
          { label: 'Efficiency', value: `${stats.efficiency}%`, color: stats.efficiency > 80 ? 'text-success' : 'text-destructive' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Visualization */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Patient Flow Visualization</h3>
        <div className="relative h-[400px] overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 700 400" className="text-muted-foreground">
            {/* Connection lines */}
            <line x1="100" y1="200" x2="230" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4" opacity="0.3" />
            <line x1="100" y1="200" x2="230" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="4" opacity="0.3" />
            <line x1="100" y1="200" x2="230" y2="300" stroke="currentColor" strokeWidth="1" strokeDasharray="4" opacity="0.3" />
            <line x1="300" y1="100" x2="430" y2="150" stroke="currentColor" strokeWidth="1" strokeDasharray="4" opacity="0.3" />
            <line x1="300" y1="200" x2="430" y2="150" stroke="currentColor" strokeWidth="1" strokeDasharray="4" opacity="0.3" />
            <line x1="300" y1="200" x2="430" y2="250" stroke="currentColor" strokeWidth="1" strokeDasharray="4" opacity="0.3" />
            <line x1="300" y1="300" x2="430" y2="250" stroke="currentColor" strokeWidth="1" strokeDasharray="4" opacity="0.3" />
            <line x1="500" y1="150" x2="580" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="4" opacity="0.3" />
            <line x1="500" y1="250" x2="580" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="4" opacity="0.3" />

            {/* Department nodes */}
            {deptNodes.map((node) => (
              <g key={node.id}>
                <rect x={node.x - 40} y={node.y - 25} width="80" height="50" rx="12" fill={node.color} fillOpacity="0.15" stroke={node.color} strokeWidth="1.5" />
                <text x={node.x} y={node.y + 5} textAnchor="middle" fill={node.color} fontSize="11" fontWeight="600">{node.label}</text>
              </g>
            ))}

            {/* Animated dots */}
            {running && (
              <>
                <circle r="4" fill="#0ea5e9">
                  <animateMotion dur={`${3 / speed}s`} repeatCount="indefinite" path="M 100,200 L 250,100" />
                </circle>
                <circle r="4" fill="#ef4444">
                  <animateMotion dur={`${4 / speed}s`} repeatCount="indefinite" path="M 100,200 L 250,200" />
                </circle>
                <circle r="4" fill="#22c55e">
                  <animateMotion dur={`${3.5 / speed}s`} repeatCount="indefinite" path="M 100,200 L 250,300" />
                </circle>
                <circle r="3" fill="#f59e0b">
                  <animateMotion dur={`${2.5 / speed}s`} repeatCount="indefinite" path="M 300,100 L 450,150" />
                </circle>
                <circle r="3" fill="#10b981">
                  <animateMotion dur={`${3 / speed}s`} repeatCount="indefinite" path="M 300,200 L 450,250" />
                </circle>
                <circle r="3" fill="#6366f1">
                  <animateMotion dur={`${2 / speed}s`} repeatCount="indefinite" path="M 500,150 L 600,200" />
                </circle>
              </>
            )}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Patient flow</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" /> Lab referral</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> Pharmacy queue</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">AI Recommendations</h3>
        <div className="space-y-2">
          {[
            { text: 'OPD queue pressure at 78% — consider redirecting 3 patients to Dr. Kavita Nair (currently at 60% capacity)', urgent: true },
            { text: 'Peak congestion expected between 10AM–11AM based on historical data — suggest opening Room 5 for overflow', urgent: false },
            { text: 'Dr. Vikram Singh delayed by 15 min — 4 orthopedics patients notified, 1 rescheduled to Dr. Amit Joshi', urgent: true },
            { text: 'No-show rate for Cardiology is 18% today vs 8% average — suggest sending reminder 30 min before slot', urgent: false },
          ].map((r, i) => (
            <div key={i} className={`flex items-start gap-3 rounded-lg px-4 py-3 ${r.urgent ? 'bg-warning/5 border border-warning/20' : 'bg-muted/30'}`}>
              {r.urgent && <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />}
              <p className="text-sm text-foreground">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
