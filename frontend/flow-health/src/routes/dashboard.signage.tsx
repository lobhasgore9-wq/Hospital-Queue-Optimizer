import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Monitor, Maximize, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { tokens, departments } from '@/lib/demo-data';

export const Route = createFileRoute('/dashboard/signage')({ component: SignagePage });

function SignagePage() {
  const [fullscreen, setFullscreen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const activeTokens = tokens.filter(t => t.status === 'in-consultation' || t.status === 'called');
  const waitingTokens = tokens.filter(t => t.status === 'waiting');

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Digital Signage</h1>
          <p className="text-sm text-muted-foreground">Hospital lobby display mode showing live queue boards and token status</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleFullscreen} className="gap-2"><Maximize className="h-4 w-4" /> {fullscreen ? 'Exit' : 'Full Screen'}</Button>
        </div>
      </div>

      {/* Signage Preview */}
      <div className="rounded-xl border-2 border-primary/30 bg-card overflow-hidden">
        {/* Header Bar */}
        <div className="bg-primary px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Monitor className="h-6 w-6 text-primary-foreground" />
            <span className="text-lg font-bold text-primary-foreground">Hospital Queue Optimizer — Live Queue Board</span>
          </div>
          <div className="text-primary-foreground font-mono text-lg">
            {time.toLocaleTimeString()} · {time.toLocaleDateString()}
          </div>
        </div>

        {/* Now Serving */}
        <div className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Volume2 className="h-5 w-5 text-success animate-pulse" /> Now Serving</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {activeTokens.map(t => (
              <div key={t.id} className={`rounded-xl p-5 text-center border-2 ${t.status === 'called' ? 'border-warning bg-warning/5 animate-pulse' : 'border-success bg-success/5'}`}>
                <div className="text-4xl font-bold font-mono text-foreground">{t.number}</div>
                <div className="text-sm font-medium text-foreground mt-1">{t.patientName}</div>
                <div className="text-xs text-muted-foreground mt-1">{t.department} · {t.doctor}</div>
                <div className={`inline-flex rounded-full px-3 py-1 mt-2 text-xs font-medium ${t.status === 'called' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'}`}>{t.status === 'called' ? 'PLEASE PROCEED' : 'IN CONSULTATION'}</div>
              </div>
            ))}
          </div>

          {/* Waiting Queue */}
          <h2 className="text-lg font-bold text-foreground mb-4">Waiting Queue</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-8">
            {waitingTokens.map(t => (
              <div key={t.id} className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                <div className="text-lg font-bold font-mono text-primary">{t.number}</div>
                <div className="text-xs text-muted-foreground truncate">{t.patientName}</div>
                <div className="text-xs text-muted-foreground mt-1">ETA: {t.eta} min</div>
              </div>
            ))}
          </div>

          {/* Department Status */}
          <h2 className="text-lg font-bold text-foreground mb-4">Department Status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {departments.filter(d => d.doctors > 0).map(d => (
              <div key={d.id} className="rounded-lg border border-border p-3">
                <div className="font-medium text-foreground text-sm">{d.name}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{d.patients} patients</span>
                  <span className="text-xs text-muted-foreground">~{d.avgWait} min</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min((d.patients / 50) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
