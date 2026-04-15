import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

const plans = [
  {
    name: 'Clinic',
    price: '$49',
    period: '/month',
    desc: 'For small clinics and single-doctor practices with up to 3 departments',
    features: ['Up to 100 tokens/day', '3 departments', '2 doctor accounts', 'Patient notifications', 'Basic analytics', 'Self check-in kiosk', 'Email support'],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Hospital',
    price: '$199',
    period: '/month',
    desc: 'For multi-department hospitals with high patient volume and multiple doctors',
    features: ['Unlimited tokens', '10 departments', '20 doctor accounts', 'Priority queue engine', 'Full analytics suite', 'Queue simulation lab', 'Digital signage', 'SMS notifications', 'API access', 'Priority support'],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For hospital networks and chains with multi-branch operations and compliance needs',
    features: ['Everything in Hospital', 'Unlimited branches', 'Unlimited staff', 'Multi-hospital analytics', 'Custom integrations', 'SLA guarantees', 'HIPAA compliance', 'Dedicated CSM', 'On-premise option', 'Custom training'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Start with a 14-day free trial. No credit card required. Scale as your hospital grows.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-2xl border p-8 transition-all ${plan.highlighted ? 'border-primary shadow-glow bg-primary/5 scale-105' : 'border-border bg-card'}`}>
              {plan.highlighted && (
                <div className="inline-flex items-center rounded-full gradient-primary px-3 py-1 text-xs font-medium text-primary-foreground mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{plan.desc}</p>
              <Link to="/login" className="block mt-6">
                <Button className={`w-full ${plan.highlighted ? 'gradient-primary text-primary-foreground border-0' : ''}`} variant={plan.highlighted ? 'default' : 'outline'}>
                  {plan.cta}
                </Button>
              </Link>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
