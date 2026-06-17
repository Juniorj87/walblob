import { motion, AnimatePresence } from 'framer-motion';
import {
  Key, Download, Loader2, ShieldCheck,
  Search, ShieldAlert,
  CheckCircle2, ExternalLink, Upload
} from 'lucide-react';
import { useState, useRef } from 'react';
import { decryptFile } from '../../utils/decryptFile';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { parseRecoveryPackage } from '../../utils/RecoveryPackageParser';
import { useNetwork } from '../../context/NetworkContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RecoveryStatus = 'idle' | 'downloading' | 'verifying' | 'decrypting' | 'reconstructing' | 'success' | 'error';

export const RecoveryBlock = () => {
  const { config } = useNetwork();
  const [blobId, setBlobId] = useState(() => new URLSearchParams(window.location.search).get('blob') || '');
  const [decryptionKey, setDecryptionKey] = useState('');
  const [status, setStatus] = useState<RecoveryStatus>('idle');
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [importedMeta, setImportedMeta] = useState<string | null>(null);
  const [integrityVerified, setIntegrityVerified] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePackageImport = async (file: File) => {
    try {
      const pkg = await parseRecoveryPackage(file);
      setBlobId(pkg.blobId);
      setDecryptionKey(pkg.key);
      if (pkg.metadata?.name) {
        setImportedMeta(pkg.metadata.name);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse recovery package.');
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBlobId = blobId.trim();
    const cleanKey = decryptionKey.trim();
    if (!cleanBlobId || !cleanKey) return;

    setStatus('downloading');
    setError(null);

    let encryptedBlob: Blob | null = null;

    const aggregators = [config.aggregatorUrl];

    for (const baseUrl of aggregators) {
      try {
        if (import.meta.env.DEV) console.log(`Walrus: Trying aggregator ${baseUrl}`);
        const response = await fetch(`${baseUrl}/v1/blobs/${cleanBlobId}`, {
          mode: 'cors',
          cache: 'no-cache'
        });

        if (response.ok) {
          encryptedBlob = await response.blob();
          if (encryptedBlob.size > 0) break;
        }
      } catch (err: unknown) {
        if (import.meta.env.DEV) console.warn(`Aggregator ${baseUrl} failed:`, err);
      }
    }

    if (!encryptedBlob || encryptedBlob.size === 0) {
      setStatus('error');
      setError(
        <div className="space-y-3">
          <p className="text-secondary font-bold">Blob not found on any accessible nodes.</p>
          <p className="text-[11px] text-text-muted leading-relaxed">
            The decentralized network might still be synchronizing your data across shards.
            This can take 1-5 minutes depending on network load.
          </p>
          <a
            href={`https://walruscan.com/mainnet/blob/${cleanBlobId}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary hover:bg-primary/20 transition-all"
          >
            Check Global Status <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      );
      return;
    }

    try {
      setStatus('verifying');
      setStatus('decrypting');
      const { file: decryptedFile, integrityVerified: isVerified } = await decryptFile(encryptedBlob, cleanKey, `recovered-${cleanBlobId.slice(0, 8)}`);
      setIntegrityVerified(isVerified);

      setStatus('reconstructing');
      const url = URL.createObjectURL(decryptedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = decryptedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: unknown) {
      console.error('Recovery failed:', err);
      setStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Recovery failed.';
      if (errorMessage.toLowerCase().includes('decryption') || errorMessage.toLowerCase().includes('key')) {
        setError('Invalid Decryption Key. The key does not match this sealed blob.');
      } else {
        setError(errorMessage);
      }
    }
  };

  return (
    <section id="recover" className="scroll-mt-24">
      <div className="terminal-window rounded-xl">
        {/* Terminal Header */}
        <div className="terminal-header px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="terminal-dot bg-secondary/80" />
            <div className="terminal-dot bg-accent/80" />
            <div className="terminal-dot bg-primary/80" />
          </div>
          <div className="text-[10px] font-mono text-text-muted">walblob recover</div>
          <div className="w-16" />
        </div>

        {/* Terminal Body */}
        <div className="p-4 md:p-6">
          {/* Command Header */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted mb-6">
            <span className="text-primary">$</span>
            <span className="text-accent">walblob</span>
            <span>recover --decrypt --zero-knowledge</span>
          </div>

          <form onSubmit={handleRecover} className="space-y-4">
            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Blob ID</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-[9px] font-mono text-primary hover:text-accent transition-colors"
                  >
                    <Upload className="w-3 h-3" /> Import
                  </button>
                  <input
                    type="file"
                    accept=".walblob"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePackageImport(f); }}
                  />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    value={blobId}
                    onChange={(e) => setBlobId(e.target.value)}
                    placeholder="Enter Blob ID..."
                    className="w-full bg-background-alt border border-border-subtle rounded-lg py-3 pl-10 pr-4 text-xs font-mono text-white outline-none focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Decryption Key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="password"
                    value={decryptionKey}
                    onChange={(e) => setDecryptionKey(e.target.value)}
                    placeholder="Paste 256-bit AES key..."
                    className="w-full bg-background-alt border border-border-subtle rounded-lg py-3 pl-10 pr-4 text-xs font-mono text-white outline-none focus:border-primary/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Import Status */}
            {importedMeta && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10 w-fit"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary status-pulse" />
                <span className="text-[10px] font-mono text-text-muted">
                  Ready: <span className="text-white">{importedMeta}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setImportedMeta(null)}
                  className="text-text-muted hover:text-secondary transition-colors text-[9px] font-mono ml-2"
                >
                  [clear]
                </button>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center gap-3"
              >
                <ShieldAlert className="w-4 h-4 text-secondary" />
                <div className="text-[11px] font-mono text-secondary">{error}</div>
              </motion.div>
            )}

            {/* Integrity Status */}
            {integrityVerified !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "p-3 rounded-lg border flex items-center gap-3",
                  integrityVerified
                    ? "bg-success/10 border-success/20 text-success"
                    : "bg-secondary/10 border-secondary/20 text-secondary"
                )}
              >
                {integrityVerified ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                <span className="text-[10px] font-mono uppercase tracking-wider">
                  {integrityVerified ? 'Integrity Verified' : 'Integrity Check Failed'}
                </span>
              </motion.div>
            )}

            {/* Progress */}
            <AnimatePresence mode="wait">
              {status !== 'idle' && status !== 'error' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0 }}
                  className="bg-background-alt rounded-lg border border-border-subtle p-4 space-y-3"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-text-muted">
                    <span>Status: <span className="text-primary uppercase">{status}</span></span>
                    <span>Zero-Knowledge Mode</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {[
                      { label: 'FETCH', s: 'downloading' },
                      { label: 'VERIFY', s: 'verifying' },
                      { label: 'DECRYPT', s: 'decrypting' },
                      { label: 'READY', s: 'success' }
                    ].map((step, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className={cn(
                          "w-6 h-6 rounded border flex items-center justify-center text-[9px] font-mono transition-all",
                          status === step.s ? "border-primary bg-primary/20 text-primary" :
                            ['verifying', 'decrypting', 'reconstructing', 'success'].includes(status) && i < ['verifying', 'decrypting', 'reconstructing', 'success'].indexOf(status) + 1
                              ? "border-success bg-success/20 text-success"
                              : "border-border-subtle text-text-muted"
                        )}>
                          {status === 'success' && i === 3 ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
                        </div>
                        <span className={cn(
                          "text-[8px] font-mono uppercase",
                          status === step.s ? "text-primary" : "text-text-muted"
                        )}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              disabled={(status !== 'idle' && status !== 'success' && status !== 'error') || !blobId || !decryptionKey}
              className="w-full bg-primary text-black py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-terminal"
            >
              {status === 'idle' || status === 'error' ? (
                <><Download className="w-4 h-4" /> Recover File</>
              ) : status === 'success' ? (
                <><ShieldCheck className="w-4 h-4" /> Success</>
              ) : (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
