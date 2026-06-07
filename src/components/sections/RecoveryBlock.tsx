import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, Download, Loader2, ShieldCheck, 
  Search, Lock, ShieldAlert, FileJson, 
  CheckCircle2, ExternalLink
} from 'lucide-react';
import { useState, useRef } from 'react';
import { decryptFile } from '../../utils/decryptFile';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AGGREGATORS = [
  (import.meta.env.VITE_WALRUS_AGGREGATOR_URL || 'https://aggregator.walrus-testnet.walrus.space').replace(/\/$/, ''),
  'https://walrus-testnet-aggregator.nodes.guru',
  'https://walrus-testnet.aggregator.aspace.cloud',
  'https://walrus-testnet-aggregator.shandong.io',
  'https://aggregator-walrus-testnet.testnet.sui.io'
];

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("glass-effect rounded-[32px] border border-white/5 premium-shadow overflow-hidden relative group/card", className)}>
    {children}
  </div>
);

type RecoveryStatus = 'idle' | 'downloading' | 'verifying' | 'decrypting' | 'reconstructing' | 'success' | 'error';

export const RecoveryBlock = () => {
  const [blobId, setBlobId] = useState(() => new URLSearchParams(window.location.search).get('blob') || '');
  const [decryptionKey, setDecryptionKey] = useState('');
  const [status, setStatus] = useState<RecoveryStatus>('idle');
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePackageImport = async (file: File) => {
    if (!file.name.endsWith('.walblob')) {
      setError('Please select a valid .walblob package.');
      return;
    }

    try {
      const text = await file.text();
      const pkg = JSON.parse(text);
      if (pkg.blobId) setBlobId(pkg.blobId.trim());
      if (pkg.key) setDecryptionKey(pkg.key.trim());
      setError(null);
    } catch {
      setError('Failed to parse recovery package.');
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

    // Multi-Aggregator Fallback Strategy
    for (const baseUrl of AGGREGATORS) {
      try {
        if (import.meta.env.DEV) console.log(`Walrus: Trying aggregator ${baseUrl}`);
        // Correct path is /v1/blobs/${id}
        const response = await fetch(`${baseUrl}/v1/blobs/${cleanBlobId}`, {
          mode: 'cors',
          cache: 'no-cache'
        });

        if (response.ok) {
          encryptedBlob = await response.blob();
          if (encryptedBlob.size > 0) break; // Success!
        }
      } catch (err: unknown) {
        if (import.meta.env.DEV) console.warn(`Aggregator ${baseUrl} failed:`, err);
      }
    }

    if (!encryptedBlob || encryptedBlob.size === 0) {
      setStatus('error');
      setError(
        <div className="space-y-4">
          <p className="text-red-400 font-bold">Blob not found on any accessible nodes.</p>
          <p className="text-[10px] text-white/40 leading-relaxed">
            The decentralized network might still be synchronizing your data across shards. 
            This can take 1-5 minutes depending on network load.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <a 
              href={`https://walruscan.com/testnet/blob/${cleanBlobId}`} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 transition-all"
            >
              Check Global Status <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      );
      return;
    }

    try {
      setStatus('verifying');
      // 2. Local Decryption (Zero-Knowledge)
      setStatus('decrypting');
      const decryptedFile = await decryptFile(encryptedBlob, cleanKey, `recovered-${cleanBlobId.slice(0, 8)}`);

      setStatus('reconstructing');
      // 3. Trigger Browser Download
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
    <section id="recover" className="scroll-mt-32 md:scroll-mt-48">
      <div className="text-center mb-16 md:mb-20 space-y-4">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-pill bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4">
          <Lock className="w-3.5 h-3.5" /> Secure Access
        </div>
        <h2 className="text-4xl md:text-7xl font-display font-black tracking-tighter uppercase text-white leading-tight">
          Decrypt & <span className="text-gradient">Recover</span>
        </h2>
        <p className="text-text-muted text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed px-4">
          Retrieve encrypted files from Walrus and decrypt them locally in your browser. Your key never leaves your device.
        </p>
      </div>

      <div className="max-w-4xl mx-auto relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-[40px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <GlassCard className="p-8 md:p-16 bg-[#0A0D1D]/60 backdrop-blur-[80px]">
          {/* Priority 5: Drag & Drop Package */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if(f) handlePackageImport(f); }}
            className={cn(
              "absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#050816]/95 transition-all duration-500",
              isDragging ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
          >
             <FileJson className="w-16 h-16 text-primary animate-pulse mb-6" />
             <p className="text-lg font-black uppercase tracking-[0.4em] text-white">Import Package</p>
             <p className="text-text-muted text-xs mt-2 uppercase tracking-widest">Drop .walblob file to auto-fill</p>
          </div>

          <form onSubmit={handleRecover} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-6">
                  <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Blob Identifier</label>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">Import .walblob</button>
                  <input type="file" accept=".walblob" ref={fileInputRef} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if(f) handlePackageImport(f); }} />
                </div>
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="text" 
                    value={blobId}
                    onChange={(e) => setBlobId(e.target.value)}
                    placeholder="Enter Blob ID..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-sm font-mono text-white/80 outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-6">Decryption Key</label>
                <div className="relative">
                  <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="password" 
                    value={decryptionKey}
                    onChange={(e) => setDecryptionKey(e.target.value)}
                    placeholder="Paste 256-bit AES key..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-sm font-mono text-white/80 outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-4">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <div className="text-[10px] font-black text-red-400 uppercase tracking-widest">{error}</div>
              </motion.div>
            )}

            {/* Priority 9: Advanced Recovery Status */}
            <AnimatePresence mode="wait">
              {status !== 'idle' && status !== 'error' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0 }}
                  className="bg-black/40 rounded-3xl border border-white/5 p-8 space-y-6"
                >
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em]">
                      <span className="text-white/40">Status: <span className="text-primary">{status}</span></span>
                      <span className="text-white/10">Zero-Knowledge Retrieval</span>
                   </div>
                   
                   <div className="flex items-center justify-between gap-4">
                      {[
                        { label: 'Fetch', s: 'downloading' },
                        { label: 'Verify', s: 'verifying' },
                        { label: 'Decrypt', s: 'decrypting' },
                        { label: 'Ready', s: 'success' }
                      ].map((step, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3">
                           <div className={cn(
                             "w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500",
                             status === step.s ? "border-primary bg-primary/20 text-primary shadow-[0_0_20px_rgba(0,209,255,0.3)]" : 
                             ['verifying','decrypting','reconstructing','success'].includes(status) && i === 0 || 
                             ['decrypting','reconstructing','success'].includes(status) && i === 1 ||
                             ['reconstructing','success'].includes(status) && i === 2 ||
                             status === 'success' && i === 3
                             ? "border-emerald-400 bg-emerald-400/20 text-emerald-400" : "border-white/10 text-white/10"
                           )}>
                              {status === 'success' && i === 3 ? <CheckCircle2 className="w-4 h-4" /> : <div className="text-[10px] font-black">{i + 1}</div>}
                           </div>
                           <span className={cn(
                             "text-[8px] font-black uppercase tracking-widest",
                             status === step.s ? "text-primary" : "text-white/10"
                           )}>{step.label}</span>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              disabled={(status !== 'idle' && status !== 'success' && status !== 'error') || !blobId || !decryptionKey}
              className="w-full bg-white text-black py-6 rounded-pill font-black text-[12px] uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] disabled:opacity-20 flex items-center justify-center gap-4"
            >
              {status === 'idle' || status === 'error' ? (
                <><Download className="w-5 h-5" /> Recover File</>
              ) : status === 'success' ? (
                <><ShieldCheck className="w-5 h-5" /> Success</>
              ) : (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              )}
            </button>
          </form>
        </GlassCard>
      </div>
    </section>
  );
};
