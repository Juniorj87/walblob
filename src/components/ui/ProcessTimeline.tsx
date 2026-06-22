import { motion } from 'framer-motion';
import { FileUp, Lock, CloudUpload, ShieldCheck, ChevronRight, KeyRound } from 'lucide-react';

const STEPS = [
  { title: "SELECT", desc: "Choose files to encrypt", icon: FileUp, cmd: "./select" },
  { title: "SEAL", desc: "Seal threshold encryption (5-of-N)", icon: KeyRound, cmd: "./seal --threshold=5" },
  { title: "UPLOAD", desc: "Encrypted blob to Walrus", icon: CloudUpload, cmd: "./upload --network=walrus" },
  { title: "REGISTER", desc: "On-chain access control", icon: Lock, cmd: "./register --contract=blob_registry" },
  { title: "RECOVER", desc: "Session key + seal_approve", icon: ShieldCheck, cmd: "./recover --seal --decrypt" },
];

export const ProcessTimeline = () => {
  return (
    <div className="relative w-full">
      {/* Terminal Container */}
      <div className="terminal-window rounded-xl overflow-hidden">
        {/* Terminal Header */}
        <div className="terminal-header px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="terminal-dot bg-secondary/80" />
            <div className="terminal-dot bg-accent/80" />
            <div className="terminal-dot bg-primary/80" />
          </div>
          <div className="text-[10px] font-mono text-text-muted">walblob-protocol</div>
          <div className="w-16" />
        </div>

        {/* Terminal Body */}
        <div className="p-4 md:p-6 space-y-3">
          {/* Welcome Message */}
            <div className="text-[11px] font-mono text-text-muted mb-4">
              <span className="text-primary">$</span> Initializing WalBlob Protocol v3.0 (Seal Mainnet)...
            </div>

          {/* Steps as Terminal Commands */}
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="group"
            >
              {/* Command Line */}
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span className="text-primary">$</span>
                <span className="text-accent">{step.cmd}</span>
                <ChevronRight className="w-3 h-3 text-text-muted group-hover:text-primary transition-colors" />
              </div>

              {/* Output */}
              <div className="ml-4 mt-1 mb-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <step.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold text-white uppercase tracking-wider">{step.title}</div>
                  <div className="text-[10px] text-text-muted">{step.desc}</div>
                </div>
                <div className="text-[10px] font-mono text-success">OK</div>
              </div>

              {/* Separator */}
              {i < STEPS.length - 1 && (
                <div className="h-px bg-border-subtle my-2" />
              )}
            </motion.div>
          ))}

          {/* Success Message */}
          <div className="mt-4 pt-4 border-t border-border-subtle">
            <div className="text-[11px] font-mono text-success flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Protocol initialized. Seal encryption active on Sui Mainnet.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
