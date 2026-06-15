import { motion } from 'framer-motion';
import { Package, Search, History, ArrowRight, Terminal } from 'lucide-react';

const PRODUCT_FEATURES = [
  {
    title: "Recovery Packages",
    desc: "Download portable .walblob packages with all credentials for offline backup.",
    icon: Package,
    color: "text-primary",
    cmd: "walblob export",
  },
  {
    title: "Blob Explorer",
    desc: "Inspect blob availability and status across the Walrus network.",
    icon: Search,
    color: "text-accent",
    cmd: "walblob inspect",
  },
  {
    title: "Local Vault",
    desc: "Browser-side history of your encrypted uploads. No data leaves your device.",
    icon: History,
    color: "text-secondary",
    cmd: "walblob history",
  },
];

export const ProductFeatureCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {PRODUCT_FEATURES.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="terminal-window rounded-xl group card-hover"
        >
          {/* Terminal Header */}
          <div className="terminal-header px-3 py-2 flex items-center gap-2">
            <div className="terminal-dot bg-secondary/80" />
            <div className="terminal-dot bg-accent/80" />
            <div className="terminal-dot bg-primary/80" />
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Command Preview */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted">
              <Terminal className="w-3 h-3 text-primary" />
              <span className="text-primary">$</span>
              <span className="text-accent">{f.cmd}</span>
            </div>

            {/* Icon & Title */}
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                "bg-primary/10 border border-primary/20"
              )}>
                <f.icon className={cn("w-5 h-5", f.color)} />
              </div>
              <h4 className="text-sm font-display font-bold text-white uppercase tracking-wide">
                {f.title}
              </h4>
            </div>

            {/* Description */}
            <p className="text-xs text-text-muted leading-relaxed">
              {f.desc}
            </p>

            {/* Action */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-primary group-hover:text-accent transition-colors cursor-pointer">
              <span>Initialize</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
