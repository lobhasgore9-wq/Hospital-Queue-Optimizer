import { Link } from '@tanstack/react-router';
import { Activity, Menu, X, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tighter font-heading text-gradient">FLOW HEALTH</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => document.documentElement.classList.toggle('dark')} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground">
              <Sun className="h-4 w-4 hidden dark:block" />
              <Moon className="h-4 w-4 block dark:hidden" />
            </button>
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-3">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>
              {link.label}
            </a>
          ))}
          <Link to="/login" className="block">
            <Button className="w-full" size="sm">Get Started</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
