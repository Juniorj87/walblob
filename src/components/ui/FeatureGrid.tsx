import { motion } from 'framer-motion';
import { Shield, Layers, Lock, Upload, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    title: "Zero-Knowledge Security",
    desc: "AES-256 encryption in your browser. Keys never leave your device memory.",
    icon: Shield,
    color: "text-primary",
    stat: "256-bit",
    statLabel: "Encryption",
  },
  {
    title: "Decentralized Storage",
    desc: "Redundant shards distributed across the Walrus Network for maximum availability.",
    icon: Layers,
    color: "text-secondary",
    stat: "100%",
    statLabel: "Uptime",
  },
  {
    title: "Client-Side Recovery",
    desc: "Only the sovereign key holder can reconstruct data. Zero backend access.",
    icon: Lock,
    color: "text-accent",
    stat: "0",
    statLabel: "Third-Party Access",
  },
  {
    title: "Batch Upload Support",
    desc: "High-throughput protocol for uploading multiple encrypted blobs simultaneously.",
    icon: Upload,
    color: "text-success",
    stat: "∞",
    statLabel: "File Support",
  },
];

export const FeatureGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {FEATURES.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="terminal-window rounded-xl p-6 group card-hover"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              "bg-primary/10 border border-primary/20"
            )}>
              <f.icon className={cn("w-5 h-5", f.color)} />
            </div>
            <div className="text-right">
              <div className="text-2xl font-display font-bold text-white">{f.stat}</div>
              <div className="text-[10px] font-mono text-text-muted uppercase">{f.statLabel}</div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h4 className="text-sm font-display font-bold text-white uppercase tracking-wide">
              {f.title}
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              {f.desc}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between">
            <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
              Learn more
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>

          {/* Corner Accent */}
          <div className={cn(
            "absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            "bg-gradient-to-bl from-primary/10 to-transparent rounded-tr-xl"
          )} />
        </motion.div>
      ))}
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
