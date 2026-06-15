import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Terminal } from 'lucide-react';
import { useState } from 'react';

const FAQS = [
  {
    q: "Can WalBlob read my files?",
    a: "Absolutely not. Your files are encrypted directly in your browser using AES-256 GCM. The original content never leaves your device; only opaque encrypted shards are sent to the Walrus network. We possess no decryption capability.",
  },
  {
    q: "What happens if I lose my key?",
    a: "Since WalBlob is a zero-knowledge platform, we do not store your keys. If you lose your decryption key and your Blob ID, your data is permanently lost. We recommend using our portable recovery packages (.walblob) for offline storage.",
  },
  {
    q: "Is WalBlob decentralized?",
    a: "Yes. WalBlob is a decentralized storage interface. Your data is sharded and distributed across the global Walrus network, ensuring censorship resistance and high availability without relying on any centralized server.",
  },
  {
    q: "Can I recover files on another device?",
    a: "Yes. As long as you have your Blob ID and Decryption Key (or your recovery package), you can use WalBlob or any compatible Walrus utility to reconstruct your original files from any browser on any device.",
  },
  {
    q: "Are encryption keys stored anywhere?",
    a: "No. Encryption keys are generated locally in your browser's RAM and are never transmitted to our servers or stored on any persistent database. You are the sole custodian of your cryptographic security.",
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="terminal-window rounded-xl">
      {/* Terminal Header */}
      <div className="terminal-header px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="terminal-dot bg-secondary/80" />
          <div className="terminal-dot bg-accent/80" />
          <div className="terminal-dot bg-primary/80" />
        </div>
        <div className="text-[10px] font-mono text-text-muted">knowledge-base</div>
        <div className="w-16" />
      </div>

      {/* FAQ Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted mb-4">
          <span className="text-primary">$</span>
          <span className="text-accent">cat</span>
          <span>faq.json | jq '.answers[]'</span>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="px-4 pb-4 space-y-2">
        {FAQS.map((faq, i) => (
          <div key={i} className="border border-border-subtle rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full p-3 flex items-center justify-between text-left group hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  openIndex === i ? "text-primary" : "text-text-muted"
                )} />
                <span className={cn(
                  "text-xs font-display font-bold transition-colors",
                  openIndex === i ? "text-primary" : "text-white group-hover:text-primary"
                )}>
                  {faq.q}
                </span>
              </div>
              <motion.div
                animate={{ rotate: openIndex === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className={cn(
                  "w-4 h-4 transition-colors",
                  openIndex === i ? "text-primary" : "text-text-muted"
                )} />
              </motion.div>
            </button>

            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-3 pb-3 pl-10">
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 pt-0">
        <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted">
          <Terminal className="w-3 h-3" />
          <span>End of FAQ. Type <span className="text-primary">help</span> for more info.</span>
        </div>
      </div>
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
