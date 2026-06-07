import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export const CopyButton = ({ text, label, className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center justify-center gap-2.5 transition-all duration-500 relative overflow-hidden group/btn",
        "bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 hover:scale-105 active:scale-95",
        copied ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "text-white/30 hover:text-white",
        label ? "px-6 py-3 rounded-2xl" : "p-3 rounded-xl",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-2.5"
          >
            <Check className="w-4 h-4" />
            {label && <span className="text-[10px] font-bold uppercase tracking-[0.15em] leading-none">Copied</span>}
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-2.5"
          >
            <Copy className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-500" />
            {label && <span className="text-[10px] font-bold uppercase tracking-[0.15em] leading-none transition-colors">{label}</span>}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Visual Light Sweep on Click */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-active/btn:opacity-100 transition-opacity" />
    </button>
  );
};
