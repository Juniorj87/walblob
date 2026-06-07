import { motion } from 'framer-motion';
import { Lock, Database, Key, ShieldCheck, ArrowDown, Network, Shield } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const VisualSecurityModel = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-16 md:gap-32 items-center max-w-7xl mx-auto">
      <div className="space-y-16">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            <Shield className="w-4 h-4" /> Architecture Verified
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-white leading-[1]">
            Stateless <br /><span className="text-primary">Security</span> Layer
          </h2>
          <p className="text-text-muted text-xl font-medium leading-relaxed max-w-xl">
            Our zero-knowledge architecture eliminates the need for trust. 
            Cryptographic seals are applied before any data enters the network.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {[
            { t: "Local Browser Sealing", d: "AES-256 GCM encryption in your RAM" },
            { t: "Deterministic Key Generation", d: "Non-custodial access control" },
            { t: "Decentralized Sharding", d: "Opaque fragments distributed globally" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-6 p-8 rounded-[32px] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white tracking-tight">{item.t}</h4>
                <p className="text-[13px] text-text-dim font-medium leading-relaxed">{item.d}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-10 rounded-[40px] bg-primary/5 border border-primary/10 relative overflow-hidden group">
          <div className="relative z-10 flex items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_40px_rgba(79,124,255,0.2)]">
              <Key className="w-8 h-8" />
            </div>
            <p className="text-base font-bold text-white leading-relaxed max-w-sm">
              Your encryption key <span className="text-primary">never leaves your browser.</span> 
              It is mathematically impossible for us to access your content.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[100px] rounded-full translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-1000" />
        </div>
      </div>

      {/* Visual Protocol Flow */}
      <div className="relative p-10 md:p-16 rounded-[56px] bg-[#030712]/60 glass-v3 border border-white/5 flex flex-col items-center gap-10">
        {[
          { icon: Database, label: "RAW FILE", color: "text-white" },
          { icon: Lock, label: "AES-256 SEAL", color: "text-primary", glow: true },
          { icon: Network, label: "ENCRYPTED BLOB", color: "text-accent" },
          { icon: ShieldCheck, label: "WALRUS NETWORK", color: "text-emerald-400" }
        ].map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-10 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "w-full flex items-center gap-8 p-6 rounded-[28px] border transition-all duration-700",
                step.glow ? "bg-primary/5 border-primary/20 shadow-[0_0_60px_rgba(79,124,255,0.15)] scale-105" : "bg-white/[0.03] border-white/5"
              )}
            >
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-black/40 border border-white/5", step.color)}>
                <step.icon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                 <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 block">Phase 0{i+1}</span>
                 <span className="text-sm font-display font-bold uppercase tracking-[0.2em] text-white tracking-widest">{step.label}</span>
              </div>
            </motion.div>
            {i < 3 && (
              <motion.div 
                animate={{ y: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-white/20"
              >
                <ArrowDown className="w-7 h-7" />
              </motion.div>
            )}
          </div>
        ))}
        
        {/* Background Mesh Reflection */}
        <div className="absolute inset-0 mesh-bg-v3 opacity-20 rounded-[56px] pointer-events-none" />
      </div>
    </div>
  );
};
