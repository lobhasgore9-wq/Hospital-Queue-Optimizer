import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { sendWelcomeEmail } from '@/lib/email';

export const Route = createFileRoute('/signup')({
  head: () => ({
    meta: [
      { title: 'Sign Up — Flow Health' },
      { name: 'description', content: 'Create your Flow Health account.' },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setSubmitting(true);
    setError('');
    try {
      await signup(email, password, name, 'admin');
      
      // Send welcome email
      try {
        await sendWelcomeEmail(name, email, 'admin');
        toast.success('Welcome email sent!');
      } catch (err) {
        console.error('Email sending failed:', err);
        toast.error('Account created, but welcome email could not be sent.');
      }

      toast.success('Account created! Welcome to Flow Health.');
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      const msg = err?.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists. Please sign in.'
        : err?.code === 'auth/weak-password'
        ? 'Password is too weak. Use at least 6 characters.'
        : err?.message || 'Failed to create account. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await loginWithGoogle('admin');
      
        // Send welcome email
        try {
          await sendWelcomeEmail(res.user.displayName, res.user.email, 'admin');
          toast.success('Welcome email sent!');
        } catch (err) {
          console.error('Email sending failed:', err);
          // Don't show error toast for google signup to avoid confusing the user
        }

      toast.success('Account created with Google!');
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      const msg = err?.message || 'Google sign-in failed.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tighter font-heading text-gradient">FLOW HEALTH</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Get started with Flow Health</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <Button variant="outline" className="w-full gap-2 h-11" onClick={handleGoogle} disabled={submitting}>
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          {submitting ? 'Creating account...' : 'Continue with Google'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-background px-3 text-muted-foreground">or sign up with email</span></div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="name" placeholder="Dr. John Smith" className="pl-9" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="admin@hospital.com" className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" placeholder="••••••••" className="pl-9" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSignup()} />
            </div>
            <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
          </div>
          <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={handleSignup} disabled={submitting}>
            {submitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
