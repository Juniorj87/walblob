import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Terminal } from 'lucide-react';
import { useState } from 'react';

const FAQS = [
  {
    q: "How does Seal encryption work?",
    a: "WalBlob uses Mysten's Seal protocol for threshold encryption. Your data is encrypted with a 5-of-N threshold scheme — decryption requires cooperation from multiple key servers on Sui. The BlobRegistry contract on Mainnet controls which addresses can decrypt each blob.",
  },
  {
    q: "What tokens are supported for encryption?",
    a: "Seal encrypts any file type — documents (PDF, DOCX), images (PNG, JPG, SVG), videos (MP4, WebM), archives (ZIP, TAR), and more. The encryption is file-agnostic: Seal works on raw bytes regardless of content type.",
  },
  {
    q: "What happens if I lose my key?",
    a: "Since WalBlob is zero-knowledge, we do not store your keys. If you lose your decryption key and Blob ID, your data is permanently unrecoverable. Use our portable recovery packages (.walblob) for offline backup.",
  },
  {
    q: "Where is my data stored?",
    a: "Encrypted blobs are stored on the Walrus decentralized network (97+ storage nodes, 1000 shards). The Walrus Sites deployment is also decentralized — no centralized servers. Your data is redundant, censorship-resistant, and verifiable.",
  },
  {
    q: "Can I recover files on another device?",
    a: "Yes. Connect your Sui wallet on any device, enter the Blob ID, and the Seal protocol will verify your on-chain identity via the BlobRegistry contract. If approved, decryption happens through the session key mechanism — no seed phrase needed.",
  },
  {
    q: "What is the Seal contract address?",
    a: "The access_control module is deployed at 0x51b58964d35455e6c6821f7f6219d085a25e5acb5d4482f10c6d95d7715eb611 on Sui Mainnet. The BlobRegistry shared object is at 0x4fe089ef9e2c984a8ed7ee5418047a2ab17736f61789d935ff71be6e8e8a64d8.",
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
