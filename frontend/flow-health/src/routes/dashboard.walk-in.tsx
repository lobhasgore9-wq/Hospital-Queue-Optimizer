import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { UserPlus, Check, Printer, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTokenStore } from '@/lib/token-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { addPayment } from '@/lib/firestore';
import { doctors, departments, type Token, type Priority } from '@/lib/demo-data';

export const Route = createFileRoute('/dashboard/walk-in')({ component: WalkInPage });

function WalkInPage() {
  const { addToken } = useTokenStore();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [phone, setPhone] = useState('');
  const [dept, setDept] = useState('OPD');
  const [priority, setPriority] = useState<Priority>('normal');
  const [generatedToken, setGeneratedToken] = useState<Token | null>(null);
  const [recentTokens, setRecentTokens] = useState<Token[]>([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deptPrefixes: Record<string, string> = { OPD: 'OPD', Cardiology: 'CARDIO', Radiology: 'XRAY', Pathology: 'LAB', Pediatrics: 'PED', Orthopedics: 'ORTHO', Emergency: 'ER', Pharmacy: 'PHARM', Billing: 'BILL' };
  const deptDoctors: Record<string, string> = { OPD: 'Dr. Priya Sharma', Cardiology: 'Dr. Rajesh Gupta', Radiology: 'Dr. Sneha Iyer', Pathology: 'Dr. Sanjay Verma', Pediatrics: 'Dr. Ananya Patel', Orthopedics: 'Dr. Vikram Singh', Emergency: 'Dr. Karan Mehta', Pharmacy: 'Staff', Billing: 'Staff' };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setPaymentModalOpen(true);
  };

  const handlePaymentConfirm = async () => {
    setIsSubmitting(true);
    try {
    const prefix = deptPrefixes[dept] || 'OPD';
    const num = String(Math.floor(Math.random() * 900) + 100);
    const now = new Date();
    const token: Token = {
      id: String(Date.now()),
      number: `${prefix}-${num}`,
      patientName: name,
      department: dept,
      doctor: deptDoctors[dept] || 'Staff',
      status: 'waiting',
      priority,
      eta: priority === 'emergency' ? 2 : Math.floor(Math.random() * 20) + 5,
      position: Math.floor(Math.random() * 10) + 1,
      registeredAt: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
      type: 'walk-in',
    };

    // Add to global store — instantly visible on Queue, Tokens, Patient Status pages
    const createdToken = await addToken(token);
    
    // Store payment record associated with this token
    await addPayment({
      tokenId: createdToken?.id || token.id,
      amount: 200,
      method: 'UPI',
      status: 'completed',
      date: new Date().toISOString(),
      type: 'registration_fee'
    });

    setGeneratedToken(token);
    setRecentTokens(prev => [token, ...prev]);
    setName(''); setAge(''); setPhone('');
    toast.success('Payment successful & Patient registered!');
    setPaymentModalOpen(false);
    } catch (err) {
      toast.error('Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deptInfo = departments.find(d => d.name === dept) || departments[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Walk-In Registration</h1>
        <p className="text-sm text-muted-foreground">Quick registration for walk-in patients with auto token generation and department assignment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Form */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" /> Patient Registration</h2>
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium text-foreground">Full Name *</label><input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" placeholder="Patient full name" required /></div>
              <div><label className="text-sm font-medium text-foreground">Age</label><input value={age} onChange={e => setAge(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" placeholder="Age" type="number" /></div>
              <div><label className="text-sm font-medium text-foreground">Gender</label><select value={gender} onChange={e => setGender(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
              <div><label className="text-sm font-medium text-foreground">Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" placeholder="+91 XXXXX XXXXX" /></div>
              <div><label className="text-sm font-medium text-foreground">Department *</label><select value={dept} onChange={e => setDept(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">{Object.keys(deptPrefixes).map(d => <option key={d} value={d}>{d}</option>)}</select></div>
              <div><label className="text-sm font-medium text-foreground">Priority</label><select value={priority} onChange={e => setPriority(e.target.value as Priority)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"><option value="normal">Normal</option><option value="emergency">Emergency</option><option value="senior">Senior Citizen</option><option value="disability">Disability</option><option value="pregnant">Pregnant</option><option value="vip">VIP</option></select></div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
              <div className="text-muted-foreground">Department Info: <span className="text-foreground font-medium">{deptInfo.name}</span> — {deptInfo.patients} patients today, avg wait {deptInfo.avgWait} min, {deptInfo.doctors} doctors available</div>
            </div>
            <Button type="submit" className="w-full gap-2"><Check className="h-4 w-4" /> Register & Generate Token</Button>
          </form>
        </div>

        {/* Generated Token Card */}
        <div className="space-y-4">
          {generatedToken ? (
            <div className="rounded-xl border-2 border-primary bg-card p-6 text-center space-y-3">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Token Generated</div>
              <div className="text-4xl font-bold text-primary font-mono">{generatedToken.number}</div>
              <div className="text-sm text-foreground font-medium">{generatedToken.patientName}</div>
              <div className="text-xs text-muted-foreground">{generatedToken.department} · {generatedToken.doctor}</div>
              <div className="text-sm text-muted-foreground">Estimated wait: <span className="text-foreground font-medium">{generatedToken.eta} min</span></div>
              {generatedToken.priority !== 'normal' && <div className="inline-flex rounded-full px-3 py-1 bg-warning/10 text-warning text-xs font-medium capitalize">{generatedToken.priority} Priority</div>}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => toast.success('QR Code sent to patient\'s phone', { description: `Token: ${generatedToken.number}` })}>
                  <QrCode className="h-3.5 w-3.5" /> SMS QR
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => {
                  toast.success('Printing token...');
                  setTimeout(() => window.print(), 500);
                }}>
                  <Printer className="h-3.5 w-3.5" /> Print
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground text-sm">Fill the form and click register to generate a token</div>
          )}

          {recentTokens.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Recent Registrations</h3>
              <div className="space-y-2">
                {recentTokens.slice(0, 5).map(t => (
                  <div key={t.id} className="flex items-center justify-between text-sm border-b border-border/50 pb-2">
                    <div><span className="font-mono text-primary text-xs font-bold">{t.number}</span> <span className="text-muted-foreground">— {t.patientName}</span></div>
                    <span className="text-xs text-muted-foreground">{t.registeredAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>Scan QR to pay the 200rs registration fee.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4 space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
               {/* Dummy QR Code Placeholder */}
               <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="Payment QR" className="w-48 h-48" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg text-foreground">₹200.00</p>
              <p className="text-sm text-muted-foreground">UPI ID: 7385399392@axl</p>
            </div>
            <Button onClick={handlePaymentConfirm} className="w-full gap-2 mt-4" disabled={isSubmitting}>
              {isSubmitting ? 'Confirming...' : <><Check className="w-4 h-4" /> Confirm Payment & Register</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
