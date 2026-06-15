import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Layers, Clock } from 'lucide-react';
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
    { label: 'SIZE', value: size, icon: Layers, color: 'text-white' },
    { label: 'TIME', value: time, icon: Clock, color: 'text-primary' },
    { label: 'SPEED', value: speed, icon: Zap, color: 'text-accent' },
    { label: 'NETWORK', value: network, icon: Globe, color: 'text-success' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("terminal-window rounded-xl", className)}
    >
      {/* Terminal Header */}
      <div className="terminal-header px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="terminal-dot bg-secondary/80" />
          <div className="terminal-dot bg-accent/80" />
          <div className="terminal-dot bg-primary/80" />
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3 h-3 text-success" />
          <span className="text-[9px] font-mono text-success uppercase">Verified</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        {/* Command */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted">
          <span className="text-primary">$</span>
          <span className="text-accent">walblob</span>
          <span>audit --report</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          {stats.map((stat, i) => (
            <div key={i} className="p-2 rounded-md bg-background border border-border-subtle text-center">
              <stat.icon className={cn("w-3 h-3 mx-auto mb-1", stat.color)} />
              <div className="text-[8px] font-mono text-text-muted uppercase mb-0.5">{stat.label}</div>
              <div className="text-xs font-display font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
