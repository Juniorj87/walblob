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
        "flex items-center justify-center gap-1.5 transition-all relative overflow-hidden group/btn rounded-md",
        "bg-background border border-border-subtle hover:bg-primary/10 hover:border-primary/30 hover:text-primary",
        copied ? "text-success border-success/30 bg-success/10" : "text-text-muted",
        label ? "px-2.5 py-1.5" : "p-1.5",
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
            className="flex items-center gap-1"
          >
            <Check className="w-3 h-3" />
            {label && <span className="text-[9px] font-mono uppercase">{label}</span>}
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-1"
          >
            <Copy className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
            {label && <span className="text-[9px] font-mono uppercase transition-colors">{label}</span>}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
