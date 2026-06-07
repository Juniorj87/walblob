import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, HardDrive, Clock, BarChart3 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AnalyticsProps {
  size: string;
  time: string;
  speed: string;
  network: string;
  className?: string;
}

export const UploadAnalyticsCard = ({ size, time, speed, network, className }: AnalyticsProps) => {
  const stats = [
    { label: 'Payload Size', value: size, icon: HardDrive, color: 'text-white' },
    { label: 'Transmission', value: time, icon: Clock, color: 'text-primary' },
    { label: 'Avg Throughput', value: speed, icon: Zap, color: 'text-accent' },
    { label: 'Network Layer', value: network, icon: Globe, color: 'text-emerald-400' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("bg-white/[0.02] rounded-[32px] border border-white/5 p-6 md:p-10 backdrop-blur-3xl relative overflow-hidden group/card", className)}
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/card:opacity-[0.05] transition-opacity duration-1000">
        <BarChart3 className="w-32 h-32 rotate-12" />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
             </div>
             <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 leading-none mb-2">Audit Report</h4>
                <p className="text-sm font-display font-bold text-white uppercase tracking-widest">Integrity Verified</p>
             </div>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
            v3.0.0-PRO
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {stats.map((stat, i) => (
             <div key={i} className="p-5 rounded-[24px] bg-white/[0.03] border border-white/5 group/stat hover:bg-white/[0.06] transition-all duration-500">
                <div className="flex items-center gap-2.5 mb-3">
                   <stat.icon className={cn("w-4 h-4", stat.color)} />
                   <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/20 group-hover/stat:text-white/40 transition-colors">{stat.label}</span>
                </div>
                <p className="text-base font-display font-bold text-white tracking-tight">{stat.value}</p>
             </div>
           ))}
        </div>
      </div>
      
      {/* Subtle bottom light sweep */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />
    </motion.div>
  );
};
