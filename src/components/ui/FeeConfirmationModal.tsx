import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShieldCheck, AlertTriangle, Loader2,
  Coins, Percent, Zap, Lock, Wallet
} from 'lucide-react';
import { type FeeBreakdown, type PaymentToken } from '../../utils/fees';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FeeConfirmationModalProps {
  isOpen: boolean;
  fees: FeeBreakdown | null;
  fileName: string;
  isProcessing: boolean;
  error: string | null;
  isWalletConnected: boolean;
  paymentToken: PaymentToken;
  onTokenChange: (token: PaymentToken) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const FeeConfirmationModal = ({
  isOpen,
  fees,
  fileName,
  isProcessing,
  error,
  isWalletConnected,
  paymentToken,
  onTokenChange,
  onConfirm,
  onCancel,
}: FeeConfirmationModalProps) => {
  if (!fees) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md terminal-window rounded-xl overflow-hidden"
          >
            {/* Terminal Header */}
            <div className="terminal-header px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="terminal-dot bg-secondary/80" />
                <div className="terminal-dot bg-accent/80" />
                <div className="terminal-dot bg-primary/80" />
              </div>
              <div className="text-[10px] font-mono text-text-muted">confirm-transaction</div>
              <button
                onClick={onCancel}
                disabled={isProcessing}
                className="w-5 h-5 rounded flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-all disabled:opacity-30"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Command */}
              <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted">
                <span className="text-primary">$</span>
                <span className="text-accent">walblob</span>
                <span>store --mainnet --confirm</span>
              </div>

              {/* Warning Banner */}
              <div className="p-3 rounded-lg bg-warning/5 border border-warning/10 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-mono text-warning font-bold uppercase tracking-wider mb-1">
                    Mainnet Transaction
                  </p>
                  <p className="text-[10px] text-text-muted leading-relaxed">
                    This will execute an on-chain transaction on the Sui Mainnet. Real {paymentToken} tokens will be spent.
                  </p>
                </div>
              </div>

              {/* Payment Token Selector */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Payment Token</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onTokenChange('SUI')}
                    disabled={isProcessing}
                    className={cn(
                      "flex-1 py-2.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all border",
                      paymentToken === 'SUI'
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-white/[0.02] border-border-subtle text-text-muted hover:text-white hover:border-white/20",
                      "disabled:opacity-50"
                    )}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <Coins className="w-3 h-3" /> SUI
                    </span>
                  </button>
                  <button
                    onClick={() => onTokenChange('WAL')}
                    disabled={isProcessing}
                    className={cn(
                      "flex-1 py-2.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all border",
                      paymentToken === 'WAL'
                        ? "bg-accent/10 border-accent/30 text-accent"
                        : "bg-white/[0.02] border-border-subtle text-text-muted hover:text-white hover:border-white/20",
                      "disabled:opacity-50"
                    )}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <Wallet className="w-3 h-3" /> WAL
                    </span>
                  </button>
                </div>
              </div>

              {/* File Info */}
              <div className="p-3 rounded-lg bg-white/[0.02] border border-border-subtle">
                <div className="text-[9px] font-mono text-text-muted uppercase tracking-wider mb-1">File</div>
                <div className="text-xs font-bold text-white truncate">{fileName}</div>
              </div>

              {/* Fee Breakdown */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Fee Breakdown</div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-border-subtle">
                    <div className="flex items-center gap-2">
                      <Coins className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-mono text-text-muted">Storage ({fees.fileSizeFormatted} × {fees.epochs} epochs)</span>
                    </div>
                    <span className="text-[10px] font-mono text-white">
                      {paymentToken === 'WAL' ? `${fees.storageCostWal.toFixed(6)} WAL` : `${fees.storageCostSui.toFixed(4)} SUI`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2">
                      <Percent className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-mono text-primary">Platform Fee (2%)</span>
                    </div>
                    <span className="text-[10px] font-mono text-primary">
                      {paymentToken === 'WAL' ? `${fees.commissionWal.toFixed(6)} WAL` : `${fees.commissionSui.toFixed(4)} SUI`}
                    </span>
                  </div>

                  {paymentToken === 'SUI' && (
                    <div className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-border-subtle">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-accent" />
                        <span className="text-[10px] font-mono text-text-muted">Est. Gas</span>
                      </div>
                      <span className="text-[10px] font-mono text-text-muted">~{fees.gasBudgetSui.toFixed(4)} SUI</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-success" />
                    <span className="text-[11px] font-mono text-success font-bold uppercase tracking-wider">Total</span>
                  </div>
                  <span className="text-sm font-display font-bold text-success">
                    {paymentToken === 'WAL'
                      ? `${fees.totalWithGasWal.toFixed(6)} WAL`
                      : `~${fees.totalWithGasSui.toFixed(4)} SUI`
                    }
                  </span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-secondary shrink-0" />
                  <p className="text-[10px] font-mono text-secondary">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={onCancel}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 rounded-lg bg-white/5 border border-border-subtle text-text-muted text-[10px] font-mono uppercase tracking-wider hover:bg-white/10 transition-all disabled:opacity-30"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isProcessing || !isWalletConnected}
                  className="flex-1 py-2.5 rounded-lg bg-primary text-black text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-accent active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 btn-terminal"
                >
                  {!isWalletConnected ? (
                    <><Wallet className="w-3.5 h-3.5" /> Connect Wallet First</>
                  ) : isProcessing ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Signing...</>
                  ) : (
                    <><Lock className="w-3.5 h-3.5" /> Confirm & Pay</>
                  )}
                </button>
              </div>

              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 text-[9px] font-mono text-text-muted pt-1">
                <ShieldCheck className="w-3 h-3" />
                Transaction signed locally in your wallet
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
