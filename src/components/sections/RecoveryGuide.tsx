import { motion } from 'framer-motion';
import {
  UploadCloud, Hash, Key, RotateCcw,
  ShieldCheck, Save, CheckCircle
} from 'lucide-react';

const steps = [
  {
    title: 'UPLOAD',
    desc: 'Select your data. Encrypted locally in AES-256 before leaving your device.',
    icon: UploadCloud,
    cmd: './upload --encrypt=aes256',
  },
  {
    title: 'RECEIVE ID',
    desc: 'Walrus generates a unique Blob ID. This is your public address.',
    icon: Hash,
    cmd: './receive --format=blob-id',
  },
  {
    title: 'SAVE KEY',
    desc: 'Download your .walblob recovery package. This is your ONLY access key.',
    icon: Save,
    cmd: './export --package=.walblob',
  },
  {
    title: 'RETURN',
    desc: 'Your data is permanent on Walrus. Come back anytime.',
    icon: RotateCcw,
    cmd: './status --check=availability',
  },
  {
    title: 'ENTER CREDENTIALS',
    desc: 'Import your .walblob package or enter ID + Key manually.',
    icon: Key,
    cmd: './recover --import=.walblob',
  },
  {
    title: 'RECOVER',
    desc: 'Original file reconstructed in your browser with full metadata.',
    icon: ShieldCheck,
    cmd: './decrypt --output=original',
  },
];

export const RecoveryGuide = () => {
  return (
    <section className="scroll-mt-24">
      {/* Terminal Header */}
      <div className="terminal-window rounded-xl">
        <div className="terminal-header px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="terminal-dot bg-secondary/80" />
            <div className="terminal-dot bg-accent/80" />
            <div className="terminal-dot bg-primary/80" />
          </div>
          <div className="text-[10px] font-mono text-text-muted">recovery-guide.md</div>
          <div className="w-16" />
        </div>

        {/* Guide Content */}
        <div className="p-4 md:p-6">
          {/* Command Header */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted mb-6">
            <span className="text-primary">$</span>
            <span className="text-accent">cat</span>
            <span>recovery-guide.md</span>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="p-4 rounded-lg border border-border-subtle bg-white/[0.02] group hover:border-primary/30 transition-all"
              >
                {/* Step Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <step.icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[9px] font-mono text-text-muted">Step {i + 1}</span>
                    <h3 className="text-[11px] font-display font-bold text-white uppercase tracking-wider">{step.title}</h3>
                  </div>
                </div>

                {/* Command */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted mb-2 pl-1">
                  <span className="text-primary">$</span>
                  <span className="text-accent">{step.cmd}</span>
                </div>

                {/* Description */}
                <p className="text-[10px] text-text-muted leading-relaxed pl-1">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Success Banner */}
          <div className="mt-6 p-4 rounded-lg bg-success/5 border border-success/10">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-display font-bold text-success uppercase tracking-wider mb-1">
                  Permanent Security Guarantee
                </h4>
                <p className="text-[10px] text-text-muted leading-relaxed">
                  Walrus distributes your data across dozens of independent nodes. Even if WalBlob disappears,
                  your file remains accessible as long as you have your credentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
