import { createFileRoute, Outlet, Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Activity, LayoutDashboard, Monitor, Ticket, Calendar, UserPlus, Stethoscope, BarChart3, Bell, FlaskConical, FileText, Tv, TabletSmartphone, Settings, Shield, HelpCircle, Menu, X, Search, Moon, Sun, LogOut, ChevronDown, ClipboardList, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { TokenProvider } from '@/lib/token-store';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' as const },
  { icon: Monitor, label: 'Live Queue', to: '/dashboard/queue' as const },
  { icon: Ticket, label: 'Tokens', to: '/dashboard/tokens' as const },
  { icon: ClipboardList, label: 'Patient Status', to: '/dashboard/patient-status' as const },
  { icon: Calendar, label: 'Appointments', to: '/dashboard/appointments' as const },
  { icon: UserPlus, label: 'Walk-In', to: '/dashboard/walk-in' as const },
  { icon: Stethoscope, label: 'Doctor Load', to: '/dashboard/doctors' as const },
  { icon: BarChart3, label: 'Analytics', to: '/dashboard/analytics' as const },
  { icon: Bell, label: 'Notifications', to: '/dashboard/notifications' as const },
  { icon: MessageSquare, label: 'Complaints', to: '/dashboard/complaints' as const },
  { icon: FlaskConical, label: 'Simulation', to: '/dashboard/simulation' as const },
  { icon: FileText, label: 'Reports', to: '/dashboard/reports' as const },
  { icon: Tv, label: 'Signage', to: '/dashboard/signage' as const },
  { icon: TabletSmartphone, label: 'Kiosk', to: '/dashboard/kiosk' as const },
  { icon: Settings, label: 'Settings', to: '/dashboard/settings' as const },
  { icon: Shield, label: 'Audit Logs', to: '/dashboard/audit' as const },
  { icon: HelpCircle, label: 'Help', to: '/dashboard/help' as const },
];

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
});

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to login if not authenticated after Firebase has resolved
  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: '/login' });
    }
  }, [loading, user, navigate]);

  // Show spinner while Firebase resolves auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading your session...</p>
        </div>
      </div>
    );
  }

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  };

  const isActive = (to: string) => {
    if (to === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(to);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col border-r border-border bg-sidebar transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-16'}`}>
        <div className="flex h-14 items-center justify-between px-3 border-b border-sidebar-border">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Activity className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold text-sidebar-foreground">HQO</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${isActive(item.to) ? 'bg-sidebar-accent text-sidebar-primary font-medium' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'}`}>
              <item.icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          {sidebarOpen && user && (
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-sidebar-foreground truncate">{user.name}</div>
                <div className="text-xs text-sidebar-foreground/50 capitalize">{user.role.replace('-', ' ')}</div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto">
            <div className="flex h-14 items-center justify-between px-4 border-b border-sidebar-border">
              <span className="text-sm font-bold text-sidebar-foreground">HQO</span>
              <button onClick={() => setMobileOpen(false)}><X className="h-4 w-4 text-sidebar-foreground" /></button>
            </div>
            <nav className="py-2 px-2 space-y-0.5">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${isActive(item.to) ? 'bg-sidebar-accent text-sidebar-primary font-medium' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'}`}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 w-64">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Search patients, tokens..." className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="relative h-8 w-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <div className="hidden sm:flex items-center gap-2 ml-2 pl-2 border-l border-border">
              {user && (
                <>
                  <div className="h-7 w-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-foreground">{user.name}</span>
                </>
              )}
              <Link to="/" onClick={async () => { await logout(); navigate({ to: '/login' }); }}>
                <Button variant="ghost" size="icon" className="h-7 w-7"><LogOut className="h-3.5 w-3.5" /></Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <TokenProvider>
            <Outlet />
          </TokenProvider>
        </main>
      </div>
    </div>
  );
}
