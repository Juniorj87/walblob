import { Server, CheckCircle2, ArrowLeft } from 'lucide-react';

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`glass-effect rounded-[32px] p-8 md:p-12 border border-white/5 ${className}`}>
    {children}
  </div>
);

export default function Status() {
  const nodes = [
    { name: 'Walrus Publisher', status: 'Operational', latency: '42ms' },
    { name: 'Walrus Aggregator', status: 'Operational', latency: '38ms' },
    { name: 'Sui Testnet RPC', status: 'Operational', latency: '120ms' },
    { name: 'Encryption Engine', status: 'Operational', latency: 'Local' },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans p-6 md:p-20 relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
         <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-success/10 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <a href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-12 uppercase text-[10px] font-black tracking-[0.2em]">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </a>

        <header className="mb-20">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-4 h-4 bg-success rounded-full animate-pulse shadow-[0_0_15px_rgba(0,255,163,0.5)]" />
             <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase">Network <br /><span className="text-success">Status</span></h1>
          </div>
          <p className="text-xl text-text-muted font-medium italic">Real-time infrastructure health and latency monitoring.</p>
        </header>

        <section className="space-y-6">
          {nodes.map((node, i) => (
            <GlassCard key={i} className="flex justify-between items-center p-8 hover:bg-white/[0.05] transition-all">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                     <Server className="w-6 h-6 text-text-muted" />
                  </div>
                  <div>
                     <h4 className="text-lg font-bold text-white uppercase tracking-tight">{node.name}</h4>
                     <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">{node.latency}</p>
                  </div>
               </div>
               <div className="flex items-center gap-2 text-success font-black text-[10px] uppercase tracking-widest bg-success/10 px-4 py-2 rounded-full border border-success/20">
                  <CheckCircle2 className="w-4 h-4" /> {node.status}
               </div>
            </GlassCard>
          ))}

          <div className="grid md:grid-cols-2 gap-6 mt-12">
             <GlassCard className="text-center">
                <p className="text-[10px] font-black text-text-muted uppercase mb-4 tracking-widest">Network Uptime</p>
                <p className="text-5xl font-display font-black text-white">99.98%</p>
             </GlassCard>
             <GlassCard className="text-center">
                <p className="text-[10px] font-black text-text-muted uppercase mb-4 tracking-widest">Global Shards</p>
                <p className="text-5xl font-display font-black text-primary">1,024</p>
             </GlassCard>
          </div>
        </section>

        <footer className="mt-40 pt-10 border-t border-white/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Live data refreshed every 60s</p>
        </footer>
      </div>
    </div>
  );
}
