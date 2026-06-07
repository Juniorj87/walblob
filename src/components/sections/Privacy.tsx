import { Shield, EyeOff, Lock, UserCheck, ArrowLeft } from 'lucide-react';

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`glass-effect rounded-[32px] p-8 md:p-12 border border-white/5 ${className}`}>
    {children}
  </div>
);

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans p-6 md:p-20 relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <a href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-12 uppercase text-[10px] font-black tracking-[0.2em]">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </a>

        <header className="mb-20 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase mb-6 italic">Privacy <br /><span className="text-secondary">Manifesto</span></h1>
          <p className="text-xl text-text-muted font-medium italic leading-relaxed">WalBlob is built on the principle of absolute statelessness.</p>
        </header>

        <section className="space-y-12">
          <GlassCard>
            <div className="flex flex-col md:flex-row gap-10">
               <div className="flex-1 space-y-8">
                  <div className="flex gap-6">
                     <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0">
                        <EyeOff className="text-secondary w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-lg font-black uppercase tracking-tight mb-2">Zero Tracking</h4>
                        <p className="text-text-muted text-sm leading-relaxed">No cookies. No IP logging. No Google Analytics. We don't even have a database to store your metadata.</p>
                     </div>
                  </div>
                  <div className="flex gap-6">
                     <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0">
                        <UserCheck className="text-success w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-lg font-black uppercase tracking-tight mb-2">Stateless Frontend</h4>
                        <p className="text-text-muted text-sm leading-relaxed">Your files and keys live in your browser's RAM during the session. Once you close the tab, all local traces are purged.</p>
                     </div>
                  </div>
               </div>
               <div className="md:w-px bg-white/5" />
               <div className="flex-1 space-y-8">
                  <div className="flex gap-6">
                     <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0">
                        <Shield className="text-primary w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-lg font-black uppercase tracking-tight mb-2">Encrypted Identity</h4>
                        <p className="text-text-muted text-sm leading-relaxed">Your Sui wallet address is your only identifier. We never link it to any real-world identity.</p>
                     </div>
                  </div>
                  <div className="flex gap-6">
                     <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0">
                        <Lock className="text-violet-400 w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-lg font-black uppercase tracking-tight mb-2">Your Keys, Your Data</h4>
                        <p className="text-text-muted text-sm leading-relaxed">Decryption keys are never uploaded. Loss of a key means permanent loss of data access. We cannot reset your password.</p>
                     </div>
                  </div>
               </div>
            </div>
          </GlassCard>

          <div className="p-10 border border-white/5 rounded-[40px] bg-white/[0.01]">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><Lock className="w-5 h-5 text-primary" /> GDPR Compliance</h3>
             <p className="text-text-muted text-sm leading-relaxed">
                By using decentralized storage (Walrus), you exercise your right to own your data. Data is immutable once stored for the retention period. As a stateless gateway, WalBlob does not process personal data as defined by GDPR.
             </p>
          </div>
        </section>

        <footer className="mt-40 pt-10 border-t border-white/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 italic">"Trust the math, not the middleman."</p>
        </footer>
      </div>
    </div>
  );
}
