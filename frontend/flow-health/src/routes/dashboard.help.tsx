import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { HelpCircle, Book, MessageCircle, Mail, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/dashboard/help')({ component: HelpPage });

const faqs = [
  { q: 'How do I generate a token for a walk-in patient?', a: 'Go to Walk-In Registration, fill in the patient details, select the department and priority, then click "Register & Generate Token". The system will automatically assign a token number and queue position.' },
  { q: 'What happens when a patient misses their token call?', a: 'Missed tokens are marked with a "missed" status. Staff can recover the token from the Token Management page by clicking the recover icon, which re-queues the patient at the next available position.' },
  { q: 'How does priority queuing work?', a: 'Emergency patients are inserted at the front of the queue. Senior citizens, disability, pregnant, and VIP patients get boosted positions based on the priority rules configured in Settings > Queue Rules.' },
  { q: 'Can I reassign patients to a different doctor?', a: 'Yes, from the Queue Monitor or Token Management, you can reassign tokens to a different doctor within the same department. The system will recalculate wait times automatically.' },
];

function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [search, setSearch] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your HQO Intelligence Assistant. How can I help you optimize your queue today?' }
  ]);
  const [input, setInput] = useState('');

  const sendChat = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    // Mock AI response logic
    setTimeout(() => {
        let reply = "I'm sorry, I couldn't find a specific answer for that. Would you like to connect with a human technician?";
        if (userMsg.toLowerCase().includes('token')) reply = "You can manage tokens in the 'Tokens' section. Generating a new walk-in token takes approximately 12 seconds.";
        if (userMsg.toLowerCase().includes('wait')) reply = "Wait times are calculated based on current throughput. You can see live trends on the main Dashboard.";
        if (userMsg.toLowerCase().includes('doctor')) reply = "Doctor loads are visible in the 'Doctor Load' tab. You can reassign tokens there to balance the queue.";
        
        setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    }, 1000);
  };

  const filteredFaqs = faqs.filter(f => !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 pb-10 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground font-heading">Support Center</h1>
          <p className="text-muted-foreground font-medium">Knowledge base and intelligent assistance systems</p>
        </div>
        <div className="flex items-center gap-3 bg-card border border-border px-4 py-2 rounded-2xl shadow-sm">
           <Search className="h-4 w-4 text-muted-foreground" />
           <input 
             placeholder="Search documentation..." 
             value={search} 
             onChange={e => setSearch(e.target.value)} 
             className="bg-transparent text-sm outline-none w-64 text-foreground" 
           />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-8 border-primary/10">
            <h2 className="text-xl font-bold text-foreground mb-6 font-heading flex items-center gap-3">
              <Book className="h-6 w-6 text-primary" /> Operational Intel
            </h2>
            <div className="space-y-4">
              {filteredFaqs.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-border bg-background/50 overflow-hidden transition-all hover:border-primary/30 group">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left transition-all">
                    <span className="text-sm font-bold text-foreground pr-4 group-hover:text-primary">{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm text-muted-foreground border-t border-border/10 pt-4 leading-relaxed animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card rounded-3xl p-8 border-success/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <MessageCircle className="h-24 w-24 text-success" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2 font-heading">AI Assistant</h3>
            <p className="text-xs text-muted-foreground mb-6">Talk to our optimization engine for instant troubleshooting.</p>
            
            <div className="h-64 border border-border/30 bg-black/5 rounded-2xl mb-4 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {messages.map((m, i) => (
                   <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-[11px] font-medium leading-relaxed font-sans ${
                        m.role === 'ai' ? 'bg-primary text-white rounded-bl-none' : 'bg-success text-white rounded-br-none'
                      }`}>
                         {m.text}
                      </div>
                   </div>
                ))}
            </div>

            <div className="flex gap-2">
               <input 
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && sendChat()}
                 placeholder="Ask something..." 
                 className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-xs outline-none focus:border-primary transition-all" 
               />
               <button onClick={sendChat} className="bg-primary text-white p-2 rounded-xl hover:scale-105 active:scale-95 transition-all">
                  <MessageCircle className="h-4 w-4" />
               </button>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 border-destructive/10">
            <h3 className="text-lg font-bold text-foreground mb-4 font-heading">Human Support</h3>
            <div className="space-y-4">
               <div className="flex items-center gap-4 group cursor-pointer p-2 rounded-2xl hover:bg-destructive/5 transition-all border border-transparent hover:border-destructive/10">
                  <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                     <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground uppercase tracking-widest">Enterprise Support</div>
                    <div className="text-[10px] text-muted-foreground">support@hqoptimize.com</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
