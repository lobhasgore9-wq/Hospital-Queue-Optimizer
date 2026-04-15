import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'How does the queue optimization actually work?', a: 'Our engine continuously monitors queue length, doctor consultation speed, patient priority levels, and appointment schedules. It recalculates estimated wait times every 30 seconds and can redistribute patients to less-loaded doctors when congestion is detected.' },
  { q: 'Can it handle emergency patients without disrupting the entire queue?', a: 'Yes. Emergency insertions are handled with automatic queue recalculation. All affected patients receive updated wait times and notifications. The system ensures fairness by only adjusting positions minimally while giving emergency cases immediate priority.' },
  { q: 'What happens when a doctor is delayed or goes on break?', a: 'The system detects availability changes in real time. It recalculates ETAs for all waiting patients, sends delay notifications, and can suggest redistribution to other available doctors in the same department.' },
  { q: 'Do patients need to install an app?', a: 'No. Patients receive a digital token via QR code that works in any mobile browser. They can track their position, receive notifications, and view their queue status without installing anything. A native app is available but optional.' },
  { q: 'How does it integrate with existing hospital systems?', a: 'HQO provides REST APIs and supports HL7/FHIR standards for integration with HIS, EMR, and billing systems. We also offer pre-built connectors for popular hospital management software.' },
  { q: 'Is patient data secure and HIPAA-compliant?', a: 'Yes. All data is encrypted at rest and in transit. We follow HIPAA, GDPR, and local healthcare data protection regulations. Patient health information is never stored in queue tokens — only minimal identification data is used.' },
  { q: 'Can we use it across multiple hospital branches?', a: 'Our Enterprise plan supports unlimited branches with centralized analytics, unified staff management, and cross-branch patient queue coordination. Super admins can compare performance across locations.' },
  { q: 'What about patients who miss their token?', a: 'Missed tokens trigger automatic alerts. Patients can request requeue from their phone. Staff can manually reinsert or reschedule missed patients. The system tracks no-show patterns to improve future scheduling.' },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-card">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Common questions from hospital administrators and IT teams</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border bg-background overflow-hidden">
              <button className="flex w-full items-center justify-between px-6 py-4 text-left" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
