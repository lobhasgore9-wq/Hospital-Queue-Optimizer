import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Users, Zap, Shield } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, oklch(0.55 0.17 195 / 15%) 0%, transparent 50%), radial-gradient(circle at 70% 60%, oklch(0.60 0.17 240 / 10%) 0%, transparent 50%)' }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              <Zap className="h-3 w-3" />
              AI-Powered Queue Intelligence
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary-foreground leading-[1.1]">
              Smarter patient flow.{' '}
              <span className="text-gradient">Shorter waits.</span>{' '}
              Better care.
            </h1>

            <p className="text-lg text-primary-foreground/70 max-w-xl mx-auto lg:mx-0">
              Hospital Queue Optimizer transforms chaotic waiting rooms into intelligent, 
              predictive patient flow systems. Reduce wait times by 40%, eliminate queue confusion, 
              and give every patient real-time visibility into their turn.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/login">
                <Button size="lg" className="gap-2 gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-90 transition-opacity">
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  See How It Works
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: Clock, label: '40% less wait', sub: 'Average reduction' },
                { icon: Users, label: '200+ patients/day', sub: 'Per facility' },
                { icon: Shield, label: '99.9% uptime', sub: 'Enterprise grade' },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <stat.icon className="h-5 w-5 text-primary mx-auto lg:mx-0 mb-1" />
                  <div className="text-sm font-semibold text-primary-foreground">{stat.label}</div>
                  <div className="text-xs text-primary-foreground/50">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Dashboard preview */}
          <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="glass-panel rounded-2xl p-6 shadow-glow space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-primary-foreground">Live Queue Monitor</h3>
                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse-slow" /> Live
                  </span>
                </div>

                {/* Mini queue cards */}
                {[
                  { dept: 'OPD', token: 'OPD-003', wait: '12 min', patients: 42, load: 78 },
                  { dept: 'Cardiology', token: 'CARDIO-002', wait: '18 min', patients: 28, load: 92 },
                  { dept: 'Pediatrics', token: 'PED-002', wait: '8 min', patients: 22, load: 55 },
                ].map((q) => (
                  <div key={q.dept} className="flex items-center justify-between rounded-lg bg-primary-foreground/5 px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-primary-foreground">{q.dept}</div>
                      <div className="text-xs text-primary-foreground/50">Current: {q.token}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">{q.wait}</div>
                      <div className="text-xs text-primary-foreground/50">{q.patients} waiting</div>
                    </div>
                    <div className="w-16">
                      <div className="h-1.5 rounded-full bg-primary-foreground/10">
                        <div className="h-1.5 rounded-full gradient-primary" style={{ width: `${q.load}%` }} />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Floating notification */}
                <div className="absolute -right-4 -bottom-4 glass-panel rounded-xl p-3 shadow-card animate-float max-w-[220px]">
                  <div className="text-xs font-medium text-primary-foreground">🔔 Your turn is next!</div>
                  <div className="text-xs text-primary-foreground/60 mt-1">Token OPD-003 — proceed to Room 4</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
