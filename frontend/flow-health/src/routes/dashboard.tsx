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
  const [dark, setDark] = useState(true);
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: '/login' });
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-scale-in">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-glow-primary" />
          <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">Initializing Intelligence...</p>
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
    <div className={`min-h-screen flex text-foreground bg-background gradient-mesh font-sans ${dark ? 'dark' : ''}`}>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col border-r border-border/40 glass-panel transition-all duration-500 ease-in-out z-20 ${sidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="flex h-20 items-center justify-between px-6 border-b border-border/20">
          {sidebarOpen && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-primary shadow-glow-primary rotate-3">
                <Activity className="h-5 w-5 text-primary-foreground -rotate-3" />
              </div>
              <span className="text-xl font-bold tracking-tighter font-heading text-gradient">FLOW HEALTH</span>
            </div>
          )}
          {!sidebarOpen && (
             <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-primary mx-auto">
                <Activity className="h-5 w-5 text-primary-foreground" />
             </div>
          )}
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all">
              <ChevronDown className="h-5 w-5 rotate-90" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2 scrollbar-hide">
          {navItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link key={item.to} to={item.to} className={`flex items-center gap-4 rounded-2xl px-4 py-3 text-sm transition-all duration-300 group ${
                active 
                ? 'bg-primary text-primary-foreground shadow-glow-primary font-bold scale-102' 
                : 'text-muted-foreground hover:bg-white/10 hover:text-foreground hover:pl-6'
              }`}>
                <item.icon className={`h-5 w-5 shrink-0 transition-all ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                {sidebarOpen && <span className="tracking-tight">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border/20">
          {sidebarOpen && user && (
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 shadow-premium animate-fade-in">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-glow-primary uppercase">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold truncate">{user.name}</div>
                <div className="text-[10px] font-bold text-primary uppercase tracking-widest">{user.role}</div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent">
        {/* Modern Top Header */}
        <header className="h-20 flex items-center justify-between px-8 glass-panel border-b border-border/20 z-10 mx-6 mt-6 rounded-3xl shadow-premium">
          <div className="flex items-center gap-6">
            {!sidebarOpen && (
               <button onClick={() => setSidebarOpen(true)} className="hidden lg:flex p-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground transition-all">
                  <Menu className="h-5 w-5" />
               </button>
            )}
            <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden sm:flex items-center gap-4 rounded-2xl bg-black/5 hover:bg-black/10 transition-all border border-transparent hover:border-border/30 px-5 py-2.5 w-80 group">
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input placeholder="Global search..." className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground/50 font-medium" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="h-11 w-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all shadow-sm">
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <div className="h-11 w-px bg-border/20 mx-2" />

            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="text-xs font-bold text-foreground leading-none">{user.name}</span>
                  <span className="text-[9px] font-bold uppercase text-muted-foreground tracking-tighter mt-1 opacity-60">System Admin</span>
                </div>
              )}
              <div className="relative group cursor-pointer">
                <div className="h-11 w-11 rounded-2xl gradient-primary flex items-center justify-center text-sm font-bold text-white shadow-glow-primary group-hover:scale-105 transition-transform">
                  {user?.name.charAt(0)}
                </div>
                <div className="absolute right-0 top-[120%] w-48 bg-card border border-border/40 rounded-2xl shadow-premium p-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto">
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-all">
                      <Settings className="h-4 w-4" /> Profile Systems
                    </button>
                    <button 
                      onClick={async () => { await logout(); navigate({ to: '/login' }); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/5 rounded-xl transition-all"
                    >
                      <LogOut className="h-4 w-4" /> Terminate Session
                    </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
          <TokenProvider>
            <div className="max-w-[1600px] mx-auto">
              <Outlet />
            </div>
          </TokenProvider>
        </main>
      </div>
    </div>
  );
}
