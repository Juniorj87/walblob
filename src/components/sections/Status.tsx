import { Activity, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { PremiumBackground } from '../animations/PremiumBackground';
import { Header } from '../ui/Header';
import { Footer } from '../ui/Footer';

export default function Status() {
  const nodes = [
    { name: 'Walrus Publisher', status: 'Operational', latency: '42ms' },
    { name: 'Walrus Aggregator', status: 'Operational', latency: '38ms' },
    { name: 'Sui Mainnet RPC', status: 'Operational', latency: '120ms' },
    { name: 'Encryption Engine', status: 'Operational', latency: 'Local' },
  ];

  return (
    <div className="relative min-h-screen bg-background text-white font-sans selection:bg-primary/30">
      <PremiumBackground />
      <Header />

      <section className="relative pt-32 md:pt-48 pb-40 px-6 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl"
        >
          <div className="text-center mb-20 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Network Operational
            </div>
            
            <h1 className="text-4xl md:text-8xl font-display font-bold tracking-tighter leading-[1] text-white">
              System <span className="text-gradient-premium">Health</span>
            </h1>
            
            <p className="text-text-dim text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Real-time infrastructure monitoring and latency tracking across the global Walrus network.
            </p>
          </div>

          <div className="space-y-4">
            {nodes.map((node, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex justify-between items-center p-8 rounded-[32px] glass-effect border border-white/5 hover:bg-white/[0.03] transition-all group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-text-dim group-hover:text-primary group-hover:border-primary/20 transition-all">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white tracking-tight">{node.name}</h4>
                    <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mt-1">{node.latency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-widest bg-emerald-400/5 px-4 py-2 rounded-full border border-emerald-400/10">
                  <CheckCircle2 className="w-4 h-4" /> {node.status}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
             <div className="p-10 rounded-[32px] glass-effect border border-white/5 text-center space-y-4">
                <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Network Uptime</p>
                <p className="text-5xl font-display font-bold text-white">99.98%</p>
             </div>
             <div className="p-10 rounded-[32px] glass-effect border border-white/5 text-center space-y-4">
                <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Global Shards</p>
                <p className="text-5xl font-display font-bold text-primary">1,024</p>
             </div>
          </div>

          <div className="mt-20 flex justify-center">
            <a href="/" className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-text-dim hover:text-white transition-all group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
