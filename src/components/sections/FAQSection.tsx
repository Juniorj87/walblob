import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const FAQS = [
  {
    q: "Can WalBlob read my files?",
    a: "Absolutely not. Your files are encrypted directly in your browser using AES-256 GCM. The original content never leaves your device; only encrypted data is sent to the Walrus network."
  },
  {
    q: "What happens if I lose my key?",
    a: "Since WalBlob is a zero-knowledge platform, we do not store your keys. If you lose your decryption key and your Blob ID, your data is permanently lost. We recommend using our portable recovery packages (.walblob) for safe storage."
  },
  {
    q: "Is WalBlob decentralized?",
    a: "Yes. WalBlob is a decentralized storage interface. Your data is sharded and distributed across the global Walrus network, ensuring censorship resistance and high availability without relying on any single server."
  },
  {
    q: "Can I recover files on another device?",
    a: "Yes. As long as you have your Blob ID and Decryption Key (or your recovery package), you can use WalBlob or any compatible Walrus utility to reconstruct your original files from any device."
  },
  {
    q: "Are encryption keys stored anywhere?",
    a: "No. Encryption keys are generated locally in your browser session and are never transmitted to our servers or stored on any cloud database. You are the sole custodian of your security."
  }
];

const AccordionItem = ({ q, a, isOpen, onClick }: { q: string, a: string, isOpen: boolean, onClick: () => void }) => {
  return (
    <div className="border-b border-white/5 overflow-hidden">
      <button 
        onClick={onClick}
        className="w-full py-8 flex items-center justify-between text-left group transition-all"
      >
        <span className="text-xl font-bold text-white group-hover:text-primary transition-colors">{q}</span>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white group-hover:bg-white/10 transition-all"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pb-10 pl-0 pr-12">
              <p className="text-lg text-text-muted leading-relaxed font-medium">
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
    <div className="max-w-4xl mx-auto">
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
  );
};
