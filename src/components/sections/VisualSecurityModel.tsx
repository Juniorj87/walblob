import { motion } from 'framer-motion';
import { Lock, Database, Key, ShieldCheck, ArrowDown, Network } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const VisualSecurityModel = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-16 md:gap-32 items-center">
      <div className="space-y-12">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter text-white leading-tight">
            Built for <span className="text-primary">Extreme</span> Privacy
          </h2>
          <p className="text-text-muted text-lg font-medium leading-relaxed max-w-xl">
            Our zero-knowledge architecture ensures that your data remains 
            yours alone. We've eliminated the need for trust through 
            client-side cryptography.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {[
            { t: "Client-side encryption", d: "Files are sealed before upload" },
            { t: "Zero-knowledge architecture", d: "We never see your keys or content" },
            { t: "No server-side access", d: "Decentralized storage layer" }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-5 p-6 rounded-[24px] bg-white/[0.02] border border-white/5">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white tracking-wide">{item.t}</h4>
                <p className="text-xs text-text-dim font-medium leading-relaxed">{item.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 rounded-[32px] bg-primary/5 border border-primary/10 relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Key className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-white leading-relaxed">
              Your encryption key <span className="text-primary">never leaves your browser.</span> 
              It is the only way to reconstruct your data.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />
        </div>
      </div>

      <div className="relative p-12 rounded-[40px] bg-[#030712] border border-white/5 flex flex-col items-center gap-8">
        {[
          { icon: Database, label: "FILE", color: "text-white" },
          { icon: Lock, label: "AES-256 ENCRYPTION", color: "text-primary", glow: true },
          { icon: Network, label: "ENCRYPTED BLOB", color: "text-accent" },
          { icon: ShieldCheck, label: "WALRUS NETWORK", color: "text-emerald-400" }
        ].map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-8 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "w-full flex items-center gap-6 p-6 rounded-[24px] border transition-all duration-500",
                step.glow ? "bg-primary/5 border-primary/20 shadow-[0_0_50px_rgba(79,124,255,0.1)]" : "bg-white/[0.03] border-white/5"
              )}
            >
              <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-black/40", step.color)}>
                <step.icon className="w-7 h-7" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-white/80">{step.label}</span>
            </motion.div>
            {i < 3 && (
              <motion.div 
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-white/10"
              >
                <ArrowDown className="w-6 h-6" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
