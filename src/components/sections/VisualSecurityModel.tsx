import { motion } from 'framer-motion';
import { Lock, File, Key, ShieldCheck, ArrowDown, Network, KeyRound } from 'lucide-react';

const STEPS = [
  { icon: File, label: "INPUT", color: "text-text-muted", desc: "Raw file selection" },
  { icon: KeyRound, label: "SEAL", color: "text-primary", desc: "Threshold encryption (5-of-N)", highlight: true },
  { icon: Network, label: "DISTRIBUTE", color: "text-accent", desc: "Walrus network shards" },
  { icon: ShieldCheck, label: "SECURE", color: "text-success", desc: "On-chain access control" },
];

export const VisualSecurityModel = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Left: Info */}
      <div className="space-y-6">
        {/* Terminal Header */}
        <div className="terminal-window rounded-xl">
          <div className="terminal-header px-4 py-2.5 flex items-center gap-2">
            <div className="terminal-dot bg-secondary/80" />
            <div className="terminal-dot bg-accent/80" />
            <div className="terminal-dot bg-primary/80" />
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-primary">$</span>
              <span className="text-accent">cat</span>
              <span className="text-text-muted">security-architecture.md</span>
            </div>
            <div className="pl-4 space-y-2 text-[11px] font-mono text-text-muted">
              <p><span className="text-primary">#</span> Zero-Knowledge Architecture</p>
              <p className="pl-2">Encryption via Mysten Seal protocol.</p>
              <p className="pl-2">Threshold decryption on Sui Mainnet.</p>
              <p className="pl-2">No trust required.</p>
            </div>
          </div>
        </div>

        {/* Security Points */}
        <div className="space-y-2">
          {[
            { t: "Seal Threshold Encryption", d: "5-of-N threshold via Mysten Seal on Sui", icon: KeyRound },
            { t: "On-Chain Access Control", d: "BlobRegistry contract on Sui Mainnet", icon: Lock },
            { t: "Decentralized Sharding", d: "Encrypted fragments distributed globally", icon: Network },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="terminal-window rounded-lg p-3 flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-display font-bold text-white uppercase tracking-wide">{item.t}</h4>
                <p className="text-[10px] text-text-muted">{item.d}</p>
              </div>
              <div className="text-[10px] font-mono text-success opacity-0 group-hover:opacity-100 transition-opacity">
                ENABLED
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key Security Notice */}
        <div className="terminal-window rounded-xl p-4 border-l-2 border-l-primary">
          <div className="flex items-start gap-3">
            <Key className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white mb-1">Seal On-Chain Security</p>
              <p className="text-[10px] text-text-muted leading-relaxed">
                Encryption keys are split via <span className="text-primary font-bold">threshold cryptography (5-of-N)</span>.
                Decryption requires on-chain approval from the BlobRegistry contract.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Protocol Flow */}
      <div className="terminal-window rounded-xl">
        {/* Terminal Header */}
        <div className="terminal-header px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="terminal-dot bg-secondary/80" />
            <div className="terminal-dot bg-accent/80" />
            <div className="terminal-dot bg-primary/80" />
          </div>
          <div className="text-[10px] font-mono text-text-muted">protocol-flow.sh</div>
          <div className="w-16" />
        </div>

        {/* Flow Steps */}
        <div className="p-4 space-y-2">
          {STEPS.map((step, i) => (
            <div key={i}>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-all",
                  step.highlight
                    ? "bg-primary/10 border border-primary/20 neon-glow-box"
                    : "bg-white/[0.02] border border-border-subtle"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-md flex items-center justify-center",
                  step.highlight ? "bg-primary/20" : "bg-background"
                )}>
                  <step.icon className={cn("w-4 h-4", step.color)} />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-mono text-text-muted">Phase 0{i + 1}</div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">{step.label}</div>
                </div>
                <div className="text-[10px] font-mono text-text-muted">{step.desc}</div>
              </motion.div>

              {/* Arrow */}
              {i < STEPS.length - 1 && (
                <div className="flex justify-center py-1">
                  <motion.div
                    animate={{ y: [0, 3, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowDown className="w-4 h-4 text-text-muted" />
                  </motion.div>
                </div>
              )}
            </div>
          ))}

          {/* Success */}
          <div className="mt-4 pt-3 border-t border-border-subtle flex items-center gap-2 text-[11px] font-mono text-success">
            <ShieldCheck className="w-4 h-4" />
            Protocol execution complete. Data secured.
          </div>
        </div>
      </div>
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
