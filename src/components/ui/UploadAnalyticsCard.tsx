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
    { label: 'File Size', value: size, icon: HardDrive, color: 'text-white' },
    { label: 'Duration', value: time, icon: Clock, color: 'text-primary' },
    { label: 'Avg Speed', value: speed, icon: Zap, color: 'text-secondary' },
    { label: 'Network', value: network, icon: Globe, color: 'text-emerald-400' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-black/60 rounded-[32px] border border-white/10 p-6 md:p-8 backdrop-blur-xl relative overflow-hidden group", className)}
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <BarChart3 className="w-32 h-32 rotate-12" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
             </div>
             <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 leading-none mb-1">Upload Report</h4>
                <p className="text-xs font-bold text-white uppercase tracking-widest">Integrity Verified</p>
             </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-white/30">
            v2.2.0-STABLE
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {stats.map((stat, i) => (
             <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 group/stat hover:bg-white/[0.08] transition-all">
                <div className="flex items-center gap-2 mb-2">
                   <stat.icon className={cn("w-3.5 h-3.5", stat.color)} />
                   <span className="text-[9px] font-black uppercase tracking-widest text-white/20 group-hover/stat:text-white/40">{stat.label}</span>
                </div>
                <p className="text-sm font-black text-white tracking-tight">{stat.value}</p>
             </div>
           ))}
        </div>
      </div>
    </motion.div>
  );
};
