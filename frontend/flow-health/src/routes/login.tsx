import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth, type UserRole } from '@/lib/auth-context';
import { toast } from 'sonner';

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      { title: 'Sign In — Flow Health' },
      { name: 'description', content: 'Sign in to your Flow Health account.' },
    ],
  }),
  component: LoginPage,
});

const roles: { value: UserRole; label: string; desc: string }[] = [
  { value: 'patient', label: 'Patient', desc: 'Track your token and queue position' },
  { value: 'receptionist', label: 'Receptionist', desc: 'Manage registrations and tokens' },
  { value: 'nurse', label: 'Nurse', desc: 'Triage and patient flow support' },
  { value: 'doctor', label: 'Doctor', desc: 'Manage consultations and queue' },
  { value: 'admin', label: 'Admin', desc: 'Hospital operations and analytics' },
  { value: 'super-admin', label: 'Super Admin', desc: 'Multi-facility management' },
];

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [step, setStep] = useState<'login' | 'role'>('login');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setStep('role');
  };

  const handleRoleSelect = async (role: UserRole) => {
    setSelectedRole(role);
    setSubmitting(true);
    setError('');
    try {
      await login(email, password, role);
      toast.success('Signed in successfully!');
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      const msg = err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password'
        ? 'Invalid email or password.'
        : err?.code === 'auth/user-not-found'
        ? 'No account found with this email. Please sign up first.'
        : err?.message || 'Sign-in failed. Please try again.';
      setError(msg);
      setStep('login');
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    setError('');
    try {
      await loginWithGoogle('admin');
      toast.success('Signed in with Google!');
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      const msg = err?.message || 'Google sign-in failed.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'role') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Select Your Role</h1>
            <p className="text-sm text-muted-foreground mt-1">Choose how you'll use Hospital Queue Optimizer</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            {roles.map((role) => (
              <button
                key={role.value}
                disabled={submitting}
                onClick={() => handleRoleSelect(role.value)}
                className={`w-full flex items-center justify-between rounded-xl border p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/5 disabled:opacity-50 ${selectedRole === role.value ? 'border-primary bg-primary/5' : 'border-border'}`}
              >
                <div>
                  <div className="text-sm font-medium text-foreground">{role.label}</div>
                  <div className="text-xs text-muted-foreground">{role.desc}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>

          <button onClick={() => setStep('login')} className="text-sm text-muted-foreground hover:text-foreground w-full text-center">
            ← Back to sign in
          </button>
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
            <span className="text-xl font-bold tracking-tighter font-heading text-gradient">FLOW HEALTH</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your Flow Health account</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Google */}
        <Button variant="outline" className="w-full gap-2 h-11" onClick={handleGoogle} disabled={submitting}>
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          {submitting ? 'Signing in...' : 'Continue with Google'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-background px-3 text-muted-foreground">or sign in with email</span></div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="admin@hospital.com" className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm">Password</Label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-9 pr-9" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={handleLogin} disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
        </p>

        <p className="text-center text-xs text-muted-foreground">
          Your data is encrypted and HIPAA-compliant. We never share patient information.
        </p>
      </div>
    </div>
  );
}
