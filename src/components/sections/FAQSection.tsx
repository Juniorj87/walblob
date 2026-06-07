import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ShieldQuestion } from 'lucide-react';
import { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FAQS = [
  {
    q: "Can WalBlob read my files?",
    a: "Absolutely not. Your files are encrypted directly in your browser using AES-256 GCM. The original content never leaves your device; only opaque encrypted shards are sent to the Walrus network. We possess no decryption capability."
  },
  {
    q: "What happens if I lose my key?",
    a: "Since WalBlob is a zero-knowledge platform, we do not store your keys. If you lose your decryption key and your Blob ID, your data is permanently lost. We recommend using our portable recovery packages (.walblob) for offline storage."
  },
  {
    q: "Is WalBlob decentralized?",
    a: "Yes. WalBlob is a decentralized storage interface. Your data is sharded and distributed across the global Walrus network, ensuring censorship resistance and high availability without relying on any centralized server."
  },
  {
    q: "Can I recover files on another device?",
    a: "Yes. As long as you have your Blob ID and Decryption Key (or your recovery package), you can use WalBlob or any compatible Walrus utility to reconstruct your original files from any browser on any device."
  },
  {
    q: "Are encryption keys stored anywhere?",
    a: "No. Encryption keys are generated locally in your browser's RAM and are never transmitted to our servers or stored on any persistent database. You are the sole custodian of your cryptographic security."
  }
];

const AccordionItem = ({ q, a, isOpen, onClick }: { q: string, a: string, isOpen: boolean, onClick: () => void }) => {
  return (
    <div className="border-b border-white/5 last:border-none overflow-hidden">
      <button 
        onClick={onClick}
        className="w-full py-10 flex items-center justify-between text-left group transition-all"
      >
        <span className={cn(
          "text-xl font-display font-bold transition-all duration-500",
          isOpen ? "text-white" : "text-text-muted group-hover:text-white"
        )}>{q}</span>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.1 : 1 }}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
            isOpen ? "bg-primary text-white shadow-[0_0_20px_rgba(79,124,255,0.4)]" : "bg-white/5 text-white/20 group-hover:bg-white/10 group-hover:text-white"
          )}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pb-12 pl-0 pr-12 max-w-3xl">
              <p className="text-lg text-text-dim leading-relaxed font-medium">
                {a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto glass-v3 inner-glow rounded-[48px] p-8 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-primary/[0.01] pointer-events-none" />
      
      <div className="space-y-2 mb-12 flex flex-col items-center text-center">
         <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <ShieldQuestion className="w-6 h-6 text-primary" />
         </div>
         <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Knowledge Base</h4>
      </div>

      <div className="relative z-10">
        {FAQS.map((faq, i) => (
          <AccordionItem 
            key={i} 
            q={faq.q} 
            a={faq.a} 
            isOpen={openIndex === i} 
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
      
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full translate-x-20 translate-y-20" />
    </div>
  );
};
