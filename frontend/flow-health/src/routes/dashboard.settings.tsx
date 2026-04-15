import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Settings, Bell, Shield, Clock, Users, Building2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/dashboard/settings')({ component: SettingsPage });

function SettingsPage() {
  const [tab, setTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'queue', label: 'Queue Rules', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'access', label: 'Access Control', icon: Shield },
    { id: 'staff', label: 'Staff', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Configure departments, queue rules, notification preferences, and system settings</p>
        </div>
        <Button onClick={save} className="gap-2"><Save className="h-4 w-4" /> {saved ? 'Saved!' : 'Save Changes'}</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === t.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        {tab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">General Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium text-foreground">Hospital Name</label><input defaultValue="City General Hospital" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" /></div>
              <div><label className="text-sm font-medium text-foreground">Branch Code</label><input defaultValue="CGH-001" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" /></div>
              <div><label className="text-sm font-medium text-foreground">Operating Hours</label><input defaultValue="08:00 - 20:00" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" /></div>
              <div><label className="text-sm font-medium text-foreground">Timezone</label><select defaultValue="IST" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"><option>IST (UTC+5:30)</option><option>UTC</option></select></div>
              <div><label className="text-sm font-medium text-foreground">Language</label><select defaultValue="en" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"><option value="en">English</option><option value="hi">Hindi</option><option value="ta">Tamil</option></select></div>
              <div><label className="text-sm font-medium text-foreground">Default Theme</label><select defaultValue="system" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"><option value="light">Light</option><option value="dark">Dark</option><option value="system">System</option></select></div>
            </div>
          </div>
        )}
        {tab === 'departments' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Department Configuration</h2>
            <p className="text-sm text-muted-foreground">Manage active departments, token prefixes, and capacity</p>
            {['OPD', 'Cardiology', 'Radiology', 'Pathology', 'Pediatrics', 'Orthopedics', 'Emergency', 'Pharmacy', 'Billing'].map(dept => (
              <div key={dept} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-success" />
                  <span className="text-sm font-medium text-foreground">{dept}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Active</span>
                  <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" defaultChecked className="sr-only peer" /><div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" /></label>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === 'queue' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Queue Rules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium text-foreground">Max Queue Length per Doctor</label><input type="number" defaultValue="20" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" /></div>
              <div><label className="text-sm font-medium text-foreground">Auto-Reassign After (min)</label><input type="number" defaultValue="45" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" /></div>
              <div><label className="text-sm font-medium text-foreground">Missed Token Grace Period (min)</label><input type="number" defaultValue="10" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" /></div>
              <div><label className="text-sm font-medium text-foreground">Emergency Priority Boost</label><select defaultValue="immediate" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"><option value="immediate">Immediate (next in queue)</option><option value="top5">Top 5</option><option value="top10">Top 10</option></select></div>
              <div><label className="text-sm font-medium text-foreground">SLA Breach Threshold (min)</label><input type="number" defaultValue="30" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" /></div>
              <div><label className="text-sm font-medium text-foreground">Queue Balancing</label><select defaultValue="auto" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"><option value="auto">Automatic</option><option value="manual">Manual Only</option></select></div>
            </div>
          </div>
        )}
        {tab === 'notifications' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
            {['Token Generated', '3 Turns Left', 'Your Turn Next', 'Doctor Delayed', 'Missed Token Alert', 'Queue Reassignment'].map(n => (
              <div key={n} className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm text-foreground">{n}</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1 text-xs text-muted-foreground"><input type="checkbox" defaultChecked className="rounded" /> In-App</label>
                  <label className="flex items-center gap-1 text-xs text-muted-foreground"><input type="checkbox" defaultChecked className="rounded" /> SMS</label>
                  <label className="flex items-center gap-1 text-xs text-muted-foreground"><input type="checkbox" className="rounded" /> Email</label>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === 'access' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Access Control</h2>
            <p className="text-sm text-muted-foreground">Configure which roles can access specific modules</p>
            {['Patient', 'Receptionist', 'Nurse', 'Doctor', 'Admin', 'Super Admin'].map(role => (
              <div key={role} className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm font-medium text-foreground">{role}</span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{role === 'Super Admin' ? 'Full Access' : role === 'Admin' ? 'Manage All' : role === 'Doctor' ? 'Queue + Analytics' : role === 'Nurse' ? 'Queue + Triage' : role === 'Receptionist' ? 'Register + Queue' : 'View Only'}</span>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === 'staff' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Staff Management</h2>
            <p className="text-sm text-muted-foreground">Manage staff accounts, shifts, and department assignments</p>
            <div className="text-center py-8 text-muted-foreground text-sm">Staff management integrates with your HR system. Contact admin for bulk operations.</div>
          </div>
        )}
      </div>
    </div>
  );
}
