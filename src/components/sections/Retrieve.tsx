import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, Download, Loader2, ShieldCheck, 
  ArrowLeft, Search, Lock, ShieldAlert,
  FileJson, CheckCircle2, ExternalLink, Upload
} from 'lucide-react';
import { useState, useRef } from 'react';
import { Header } from '../ui/Header';
import { PremiumBackground } from '../animations/PremiumBackground';
import { decryptFile } from '../../utils/decryptFile';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { parseRecoveryPackage } from '../../utils/RecoveryPackageParser';
import { Footer } from '../ui/Footer';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AGGREGATORS = [
  (import.meta.env.VITE_WALRUS_MAINNET_AGGREGATOR_URL || 'https://aggregator.walrus.space').replace(/\/$/, ''),
  'https://aggregator.walrus.space',
  'https://walrus-aggregator.nodes.guru',
  'https://walrus.aggregator.aspace.cloud',
  'https://aggregator-walrus.mainnet.sui.io'
];

type RecoveryStatus = 'idle' | 'downloading' | 'verifying' | 'decrypting' | 'reconstructing' | 'success' | 'error';

export default function Retrieve() {
  const [blobId, setBlobId] = useState(() => new URLSearchParams(window.location.search).get('blob') || '');
  const [decryptionKey, setDecryptionKey] = useState('');
  const [status, setStatus] = useState<RecoveryStatus>('idle');
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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

  const handleRetrieve = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBlobId = blobId.trim();
    const cleanKey = decryptionKey.trim();
    if (!cleanBlobId || !cleanKey) return;

    setStatus('downloading');
    setError(null);

    let encryptedBlob: Blob | null = null;

    for (const baseUrl of AGGREGATORS) {
      try {
        const response = await fetch(`${baseUrl}/v1/blobs/${cleanBlobId}`, {
          mode: 'cors',
          cache: 'no-cache'
        });

        if (response.ok) {
          encryptedBlob = await response.blob();
          if (encryptedBlob.size > 0) break;
        }
    } catch (err: unknown) {
      console.warn(`Node ${baseUrl} failed:`, err instanceof Error ? err.message : 'Unknown network error');
    }
    }

    if (!encryptedBlob || encryptedBlob.size === 0) {
      setStatus('error');
      setError(
        <div className="space-y-4 text-left">
          <p className="text-red-400 font-bold">Blob not found on the network shards.</p>
          <p className="text-sm text-text-muted leading-relaxed">
            Walrus is a decentralized protocol. Sometimes it takes a few minutes for all shards 
            to become available on specific aggregator nodes.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <a 
              href={`https://walruscan.com/mainnet/blob/${cleanBlobId}`} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/10 transition-all"
            >
              Verify Global Certification <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      );
      return;
    }

    try {
      setStatus('decrypting');
      const { file: decryptedFile, integrityVerified: isVerified } = await decryptFile(encryptedBlob, cleanKey, `walblob-${cleanBlobId.slice(0, 8)}`);
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
      console.error(err);
      setStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Decryption failed.';
      if (errorMessage.toLowerCase().includes('decryption') || errorMessage.toLowerCase().includes('key')) {
         setError('Invalid Decryption Key. This key cannot unlock this blob.');
      } else {
         setError(errorMessage);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-white selection:bg-primary/30 font-sans">
      <PremiumBackground />
      <Header />

      <section className="relative pt-32 md:pt-48 pb-40 px-6 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-10 backdrop-blur-xl">
            <Lock className="w-3.5 h-3.5" /> Secure Retrieval
          </div>
          
          <h1 className="text-4xl md:text-8xl font-display font-bold tracking-tighter leading-[1] mb-12">
            Recover Your <span className="text-gradient-premium">Sealed Data</span>
          </h1>

          <div className="relative group mt-12 md:mt-20">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-[48px] blur-2xl opacity-50" />
            
            <div className="relative bg-[#020617]/80 backdrop-blur-[60px] rounded-[44px] border border-white/10 shadow-2xl overflow-hidden p-8 md:p-16">
               <div 
                 onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                 onDragLeave={() => setIsDragging(false)}
                 onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if(f) handlePackageImport(f); }}
                 className={cn(
                   "absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#020617]/95 transition-all duration-500",
                   isDragging ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                 )}
               >
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                    <FileJson className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                  <p className="text-xl font-display font-bold text-white">Import Package</p>
                  <p className="text-text-dim text-sm mt-2 font-medium">Drop .walblob file to auto-fill details</p>
               </div>

               <form onSubmit={handleRetrieve} className="space-y-12">
                  <div className="space-y-6">
                     <div className="flex justify-between items-center px-4">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 text-left">Blob Identifier</label>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">
                          <Upload className="w-3.5 h-3.5" /> Select Recovery Package
                        </button>
                        <input type="file" accept=".walblob" ref={fileInputRef} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if(f) handlePackageImport(f); }} />
                     </div>
                     <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input 
                          type="text" 
                          value={blobId}
                          onChange={(e) => setBlobId(e.target.value)}
                          placeholder="Enter Walrus Blob ID..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-sm font-mono text-white/80 outline-none focus:border-primary/40 focus:bg-white/[0.03] transition-all"
                        />
                     </div>
                  </div>

                  <div className="space-y-6">
                     <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-4 text-left">Decryption Key</label>
                     <div className="relative">
                        <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input 
                          type="password" 
                          value={decryptionKey}
                          onChange={(e) => setDecryptionKey(e.target.value)}
                          placeholder="Paste your 256-bit AES key..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-sm font-mono text-white/80 outline-none focus:border-primary/40 focus:bg-white/[0.03] transition-all"
                        />
                     </div>
                  </div>

                  {importedMeta && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-primary/5 border border-primary/10 w-fit mx-auto">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(79,124,255,0.5)]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Ready to recover: <span className="text-white">{importedMeta}</span></span>
                      <button type="button" onClick={() => setImportedMeta(null)} className="ml-4 text-white/20 hover:text-white transition-colors uppercase text-[9px] font-bold tracking-widest">Clear</button>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10 text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-4">
                       <ShieldAlert className="w-5 h-5 shrink-0" /> <div className="text-left leading-relaxed">{error}</div>
                    </motion.div>
                  )}

                  {integrityVerified !== null && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      className={cn(
                        "p-5 rounded-2xl border flex items-center gap-4 justify-center",
                        integrityVerified 
                          ? "bg-emerald-400/5 border-emerald-400/10 text-emerald-400" 
                          : "bg-red-400/5 border-red-400/10 text-red-400"
                      )}
                    >
                      {integrityVerified ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                      <span className="text-xs font-bold uppercase tracking-widest">
                        {integrityVerified ? 'Integrity Verified' : 'Integrity Check Failed'}
                      </span>
                    </motion.div>
                  )}

                  <AnimatePresence mode="wait">
                    {status !== 'idle' && status !== 'error' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0 }}
                        className="bg-black/40 rounded-[32px] border border-white/5 p-8 space-y-8"
                      >
                         <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em]">
                            <span className="text-white/40">Status: <span className="text-primary">{status}</span></span>
                            <span className="text-white/10 italic">Zero-Knowledge Secure Tunnel</span>
                         </div>
                         
                         <div className="flex items-center justify-between gap-4">
                            {[
                              { label: 'Fetch', s: 'downloading' },
                              { label: 'Verify', s: 'verifying' },
                              { label: 'Decrypt', s: 'decrypting' },
                              { label: 'Ready', s: 'success' }
                            ].map((step, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-4">
                                 <div className={cn(
                                   "w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-700",
                                   status === step.s ? "border-primary bg-primary/10 text-primary shadow-[0_0_25px_rgba(79,124,255,0.3)]" : 
                                   ['verifying','decrypting','reconstructing','success'].includes(status) && i === 0 || 
                                   ['decrypting','reconstructing','success'].includes(status) && i === 1 ||
                                   ['reconstructing','success'].includes(status) && i === 2 ||
                                   status === 'success' && i === 3
                                   ? "border-emerald-400 bg-emerald-400/10 text-emerald-400" : "border-white/5 text-white/10"
                                 )}>
                                    {status === 'success' && i === 3 ? <CheckCircle2 className="w-5 h-5" /> : <div className="text-xs font-bold">{i + 1}</div>}
                                 </div>
                                 <span className={cn(
                                   "text-[9px] font-bold uppercase tracking-widest",
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
                    className="w-full bg-white text-black py-7 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(255,255,255,0.15)] disabled:opacity-20 flex items-center justify-center gap-4"
                  >
                    {status === 'idle' || status === 'error' ? (
                      <><Download className="w-5 h-5" /> Recover File</>
                    ) : status === 'success' ? (
                      <><ShieldCheck className="w-5 h-5" /> File Downloaded</>
                    ) : (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                    )}
                  </button>
               </form>
            </div>
          </div>

          <div className="mt-20 flex justify-center">
            <a href="/" className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-text-dim hover:text-white transition-all group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
