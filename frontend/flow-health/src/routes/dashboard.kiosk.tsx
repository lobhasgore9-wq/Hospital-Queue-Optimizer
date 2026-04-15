import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { TabletSmartphone, QrCode, Check, ArrowRight, RotateCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Token, type Priority } from '@/lib/demo-data';

export const Route = createFileRoute('/dashboard/kiosk')({ component: KioskPage });

type Step = 'welcome' | 'lookup' | 'register' | 'department' | 'confirm' | 'token';

function KioskPage() {
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dept, setDept] = useState('OPD');
  const [priority, setPriority] = useState<Priority>('normal');
  const [generatedToken, setGeneratedToken] = useState<Token | null>(null);

  const depts = ['OPD', 'Cardiology', 'Radiology', 'Pathology', 'Pediatrics', 'Orthopedics', 'Emergency', 'Pharmacy', 'Billing'];
  const deptPrefixes: Record<string, string> = { OPD: 'OPD', Cardiology: 'CARDIO', Radiology: 'XRAY', Pathology: 'LAB', Pediatrics: 'PED', Orthopedics: 'ORTHO', Emergency: 'ER', Pharmacy: 'PHARM', Billing: 'BILL' };

  const generateToken = () => {
    const prefix = deptPrefixes[dept] || 'OPD';
    const num = String(Math.floor(Math.random() * 900) + 100);
    const now = new Date();
    const token: Token = {
      id: String(Date.now()), number: `${prefix}-${num}`, patientName: name, department: dept,
      doctor: 'Auto-assigned', status: 'waiting', priority, eta: priority === 'emergency' ? 2 : Math.floor(Math.random() * 20) + 5,
      position: Math.floor(Math.random() * 10) + 1, registeredAt: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`, type: 'walk-in',
    };
    setGeneratedToken(token);
    setStep('token');
  };

  const reset = () => { setStep('welcome'); setName(''); setPhone(''); setDept('OPD'); setPriority('normal'); setGeneratedToken(null); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Self Check-In Kiosk</h1>
          <p className="text-sm text-muted-foreground">Patient self-service check-in with QR scan and digital token generation</p>
        </div>
        <Button variant="outline" onClick={reset} className="gap-2"><RotateCcw className="h-4 w-4" /> Reset</Button>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="rounded-2xl border-2 border-primary/20 bg-card overflow-hidden shadow-lg">
          {/* Kiosk Header */}
          <div className="bg-primary px-6 py-4 text-center">
            <TabletSmartphone className="h-8 w-8 text-primary-foreground mx-auto mb-1" />
            <h2 className="text-xl font-bold text-primary-foreground">Self Check-In</h2>
            <p className="text-primary-foreground/70 text-sm">Hospital Queue Optimizer</p>
          </div>

          <div className="p-6">
            {step === 'welcome' && (
              <div className="text-center space-y-6">
                <p className="text-foreground">Welcome! How would you like to check in?</p>
                <div className="space-y-3">
                  <Button onClick={() => setStep('lookup')} className="w-full gap-2 h-14 text-lg"><QrCode className="h-5 w-5" /> Scan QR / Lookup</Button>
                  <Button onClick={() => setStep('register')} variant="outline" className="w-full gap-2 h-14 text-lg"><ArrowRight className="h-5 w-5" /> New Registration</Button>
                </div>
              </div>
            )}

            {step === 'lookup' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground text-center">Find Your Appointment</h3>
                <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input placeholder="Enter phone or token number" className="bg-transparent text-sm outline-none w-full text-foreground" />
                </div>
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Or scan your appointment QR code</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep('welcome')} className="flex-1">Back</Button>
                  <Button onClick={() => setStep('register')} className="flex-1">New Patient</Button>
                </div>
              </div>
            )}

            {step === 'register' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground text-center">Patient Details</h3>
                <div><label className="text-sm font-medium text-foreground">Full Name</label><input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-3 text-foreground" placeholder="Enter your name" /></div>
                <div><label className="text-sm font-medium text-foreground">Phone Number</label><input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-3 text-foreground" placeholder="+91 XXXXX XXXXX" /></div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep('welcome')} className="flex-1">Back</Button>
                  <Button onClick={() => setStep('department')} disabled={!name.trim()} className="flex-1 gap-1">Next <ArrowRight className="h-4 w-4" /></Button>
                </div>
              </div>
            )}

            {step === 'department' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground text-center">Select Department</h3>
                <div className="grid grid-cols-3 gap-2">
                  {depts.map(d => (
                    <button key={d} onClick={() => setDept(d)} className={`rounded-lg p-3 text-center text-sm font-medium border transition-colors ${dept === d ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-accent'}`}>{d}</button>
                  ))}
                </div>
                <div><label className="text-sm font-medium text-foreground">Priority</label><select value={priority} onChange={e => setPriority(e.target.value as Priority)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-foreground"><option value="normal">Normal</option><option value="emergency">Emergency</option><option value="senior">Senior Citizen</option><option value="disability">Disability</option><option value="pregnant">Pregnant</option></select></div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep('register')} className="flex-1">Back</Button>
                  <Button onClick={() => setStep('confirm')} className="flex-1 gap-1">Next <ArrowRight className="h-4 w-4" /></Button>
                </div>
              </div>
            )}

            {step === 'confirm' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground text-center">Confirm Details</h3>
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Name:</span><span className="text-foreground font-medium">{name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Phone:</span><span className="text-foreground font-medium">{phone || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Department:</span><span className="text-foreground font-medium">{dept}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Priority:</span><span className="text-foreground font-medium capitalize">{priority}</span></div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep('department')} className="flex-1">Back</Button>
                  <Button onClick={generateToken} className="flex-1 gap-1"><Check className="h-4 w-4" /> Confirm</Button>
                </div>
              </div>
            )}

            {step === 'token' && generatedToken && (
              <div className="text-center space-y-4">
                <div className="text-success"><Check className="h-12 w-12 mx-auto" /></div>
                <h3 className="text-lg font-semibold text-foreground">Check-In Complete!</h3>
                <div className="rounded-xl border-2 border-primary p-6">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Your Token</div>
                  <div className="text-5xl font-bold text-primary font-mono mt-1">{generatedToken.number}</div>
                  <div className="text-sm text-muted-foreground mt-2">{generatedToken.department} · Est. wait: {generatedToken.eta} min</div>
                </div>
                <p className="text-xs text-muted-foreground">Please take a seat in the waiting area. Your token will be called on the display board.</p>
                <Button onClick={reset} className="w-full gap-2"><RotateCcw className="h-4 w-4" /> New Check-In</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
