import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

export const Route = createFileRoute('/forgot-password')({
  head: () => ({
    meta: [
      { title: 'Reset Password — Hospital Queue Optimizer' },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const handleReset = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Reset link sent!');
    } catch (err: any) {
      const msg = err?.code === 'auth/user-not-found'
        ? 'No account found with this email.'
        : 'Failed to send reset link. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
          <p className="text-sm text-muted-foreground">We sent a password reset link to <strong className="text-foreground">{email}</strong></p>
          <Link to="/login"><Button variant="outline" className="gap-2 mt-4"><ArrowLeft className="h-4 w-4" /> Back to Sign In</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">HQO</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Reset your password</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your email and we'll send you a reset link</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="admin@hospital.com" className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReset()} />
            </div>
          </div>
          <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={handleReset} disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </div>
        <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
}
