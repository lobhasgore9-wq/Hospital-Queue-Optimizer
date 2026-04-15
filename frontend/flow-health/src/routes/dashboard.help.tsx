import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { HelpCircle, Book, MessageCircle, Mail, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/dashboard/help')({ component: HelpPage });

const faqs = [
  { q: 'How do I generate a token for a walk-in patient?', a: 'Go to Walk-In Registration, fill in the patient details, select the department and priority, then click "Register & Generate Token". The system will automatically assign a token number and queue position.' },
  { q: 'What happens when a patient misses their token call?', a: 'Missed tokens are marked with a "missed" status. Staff can recover the token from the Token Management page by clicking the recover icon, which re-queues the patient at the next available position.' },
  { q: 'How does priority queuing work?', a: 'Emergency patients are inserted at the front of the queue. Senior citizens, disability, pregnant, and VIP patients get boosted positions based on the priority rules configured in Settings > Queue Rules.' },
  { q: 'Can I reassign patients to a different doctor?', a: 'Yes, from the Queue Monitor or Token Management, you can reassign tokens to a different doctor within the same department. The system will recalculate wait times automatically.' },
  { q: 'How do I set up digital signage in the lobby?', a: 'Go to Digital Signage and click "Full Screen". Display this on a TV or monitor in the lobby. The board auto-updates with current tokens, now serving, and waiting queue.' },
  { q: 'How accurate is the ETA calculation?', a: 'ETA is calculated based on average consultation time per doctor, queue length, priority distribution, and historical patterns. It typically has a ±3 minute accuracy.' },
  { q: 'Can patients check in themselves?', a: 'Yes, use the Self Check-In Kiosk mode on a tablet. Patients can scan their appointment QR code or register as walk-ins and receive a digital token.' },
  { q: 'How do I export reports?', a: 'Go to Reports & Exports, select the report type, choose your date range, and click "Export CSV". Reports are available for daily summary, department load, wait times, and more.' },
];

const guides = [
  { title: 'Getting Started Guide', desc: 'Learn the basics of Hospital Queue Optimizer', icon: Book },
  { title: 'Token Management', desc: 'How to generate, manage, and track patient tokens', icon: Book },
  { title: 'Queue Optimization', desc: 'Understanding how the queue engine balances patient load', icon: Book },
  { title: 'Admin Configuration', desc: 'Setting up departments, rules, and access control', icon: Book },
  { title: 'Analytics & Reports', desc: 'Using data to improve hospital operations', icon: Book },
];

function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const filteredFaqs = faqs.filter(f => !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
        <p className="text-sm text-muted-foreground">Documentation, FAQs, and support resources for Hospital Queue Optimizer</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input placeholder="Search help articles..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQs */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2"><HelpCircle className="h-5 w-5 text-primary" /> Frequently Asked Questions</h2>
          <div className="space-y-2">
            {filteredFaqs.map((faq, i) => (
              <div key={i} className="rounded-lg border border-border bg-card overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                  <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </button>
                {openFaq === i && <div className="px-4 pb-4 text-sm text-muted-foreground border-t border-border pt-3">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Guides */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">Quick Guides</h2>
            <div className="space-y-2">
              {guides.map((g, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-3 flex items-start gap-3 hover:bg-muted/30 transition-colors cursor-pointer">
                  <g.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div><div className="text-sm font-medium text-foreground">{g.title}</div><div className="text-xs text-muted-foreground">{g.desc}</div></div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Need More Help?</h3>
            <p className="text-xs text-muted-foreground">Our support team is available 24/7 for enterprise customers.</p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full gap-2"><MessageCircle className="h-3.5 w-3.5" /> Live Chat</Button>
              <Button variant="outline" size="sm" className="w-full gap-2"><Mail className="h-3.5 w-3.5" /> Email Support</Button>
            </div>
            <p className="text-xs text-muted-foreground">support@hospitalqueueoptimizer.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
