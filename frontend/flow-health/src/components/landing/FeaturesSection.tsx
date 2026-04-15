import { Brain, Bell, BarChart3, Layers, Timer, Smartphone, MonitorPlay, Cpu } from 'lucide-react';

const features = [
  { icon: Brain, title: 'Smart Token Engine', desc: 'Auto-generates prioritized tokens with department prefixes (OPD, CARDIO, LAB). Handles emergency insertions, senior citizens, VIPs, and disability-priority patients with dynamic queue reordering.', highlight: true },
  { icon: Timer, title: 'Predictive Wait Times', desc: 'Calculates ETA based on queue length, consultation speed, doctor availability, and patient priority. Updates in real time as conditions change throughout the day.' },
  { icon: Bell, title: 'Patient Notifications', desc: 'Sends "3 turns left", "your turn is next", and "please proceed" alerts via in-app, browser push, and SMS. Reduces no-shows and keeps patients informed without them sitting in the lobby.' },
  { icon: BarChart3, title: 'Operations Analytics', desc: 'Department load heatmaps, doctor productivity charts, peak-hour analysis, wait-time trends, no-show patterns, and SLA breach alerts — all in one dashboard for hospital administrators.' },
  { icon: Layers, title: 'Multi-Department Flow', desc: 'Manages patient journeys across OPD → Lab → Pharmacy → Billing with seamless department transfers, combined tokens, and cross-department visibility for staff.' },
  { icon: Cpu, title: 'Queue Simulation Lab', desc: 'Digital twin of your hospital operations. Simulate emergency scenarios, doctor shortages, and peak traffic to plan staffing and predict bottlenecks before they happen.' },
  { icon: Smartphone, title: 'Self Check-In Kiosk', desc: 'Patients scan QR codes, enter their details, and receive digital tokens on their phone. Eliminates reception bottlenecks and reduces registration time by 70%.' },
  { icon: MonitorPlay, title: 'Digital Signage', desc: 'Hospital lobby displays showing live queue boards, current tokens, estimated waits, and department status. Keeps the waiting area calm and informed.' },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-4">
            Core Platform
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything Your Hospital Needs to <span className="text-gradient">Optimize Patient Flow</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From token generation to analytics — a complete operations platform that replaces 
            paper tokens, manual calling systems, and guesswork-based scheduling.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className={`group rounded-xl border p-6 transition-all duration-300 hover:shadow-card ${f.highlight ? 'border-primary/30 bg-primary/5 lg:col-span-2 lg:row-span-2' : 'border-border hover:border-primary/20'}`}>
              <div className={`flex items-center justify-center rounded-lg mb-4 ${f.highlight ? 'h-12 w-12 gradient-primary text-primary-foreground' : 'h-10 w-10 bg-primary/10 text-primary'} group-hover:scale-110 transition-transform`}>
                <f.icon className={f.highlight ? 'h-6 w-6' : 'h-5 w-5'} />
              </div>
              <h3 className={`font-semibold text-foreground mb-2 ${f.highlight ? 'text-xl' : 'text-base'}`}>{f.title}</h3>
              <p className={`text-muted-foreground leading-relaxed ${f.highlight ? 'text-sm' : 'text-xs'}`}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
