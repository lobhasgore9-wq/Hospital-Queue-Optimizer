import { AlertTriangle, Clock, Users, Eye, Shuffle, PhoneOff } from 'lucide-react';

const problems = [
  { icon: Clock, title: 'Endless Waiting', desc: 'Patients spend 45+ minutes in crowded lobbies with no idea when their turn will come. Anxiety builds, satisfaction drops.' },
  { icon: Users, title: 'Reception Chaos', desc: 'Receptionists juggle walk-ins, appointments, and emergencies manually. Paper tokens get lost. Queues overlap between departments.' },
  { icon: AlertTriangle, title: 'Emergency Disruptions', desc: 'When emergency patients arrive, the entire queue gets disrupted. No system recalculates wait times or notifies affected patients.' },
  { icon: Eye, title: 'Zero Visibility', desc: 'Patients have no way to check their position, estimated wait, or which doctor they\'re assigned to. They wait blindly.' },
  { icon: Shuffle, title: 'Unbalanced Load', desc: 'One doctor sees 20 patients while another sees 5. Departments overflow while others sit idle. No intelligent distribution.' },
  { icon: PhoneOff, title: 'No Communication', desc: 'Missed tokens, delayed doctors, department changes — patients learn about none of these until they\'ve already waited too long.' },
];

export function ProblemSection() {
  return (
    <section className="py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            The Hospital Waiting Problem Is <span className="text-destructive">Broken</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Every day, millions of patients endure confusing, stressful, and unnecessarily long hospital visits. 
            The root cause? Outdated queue management that hasn't evolved in decades.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div key={p.title} className="group rounded-xl border border-border p-6 hover:border-destructive/30 hover:bg-destructive/5 transition-all duration-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive mb-4 group-hover:scale-110 transition-transform">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-destructive/10 px-6 py-3 text-sm text-destructive font-medium">
            <AlertTriangle className="h-4 w-4" />
            Indian hospitals alone see 1.5 billion OPD visits annually — most with broken queue systems
          </div>
        </div>
      </div>
    </section>
  );
}
