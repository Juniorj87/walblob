import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, Download, Loader2, ShieldCheck, 
  ArrowLeft, Search, Lock, ShieldAlert,
  FileJson, CheckCircle2, ExternalLink
} from 'lucide-react';
import { useState, useRef } from 'react';
import { Header } from '../ui/Header';
import { OrbitalParticles } from '../animations/OrbitalParticles';
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

type RecoveryStatus = 'idle' | 'downloading' | 'verifying' | 'decrypting' | 'reconstructing' | 'success' | 'error';

export default function Retrieve() {
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

  const handleRetrieve = async (e: React.FormEvent) => {
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
          <p className="text-[11px] text-white/40 leading-relaxed">
            Walrus is a decentralized protocol. Sometimes it takes a few minutes for all shards 
            to become available on specific aggregator nodes.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <a 
              href={`https://walruscan.com/testnet/blob/${cleanBlobId}`} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 transition-all"
            >
              Verify Global Certification <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      );
      return;
    }

    try {
      setStatus('verifying');
      setStatus('decrypting');
      const decryptedFile = await decryptFile(encryptedBlob, cleanKey, `walblob-${cleanBlobId.slice(0, 8)}`);

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
    <div className="relative min-h-screen bg-background text-white selection:bg-primary/30">
      <OrbitalParticles />
      <Header />

      <section className="relative pt-32 md:pt-48 pb-20 px-6 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-pill bg-white/5 border border-white/10 text-primary text-[11px] font-black uppercase tracking-[0.4em] mb-12 shadow-2xl backdrop-blur-xl">
            <Lock className="w-4 h-4" /> Secure Retrieval
          </div>
          
          <h1 className="text-4xl md:text-8xl font-display font-black tracking-tighter leading-[0.85] mb-12">
            Recover Your <span className="text-gradient">Sealed Data</span>
          </h1>

          <div className="relative group mt-20">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-[48px] blur-xl opacity-50" />
            
            <div className="relative bg-[#0A0D1D]/80 backdrop-blur-[60px] rounded-[44px] border border-white/10 shadow-2xl overflow-hidden p-8 md:p-16">
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

               <form onSubmit={handleRetrieve} className="space-y-10">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center px-6">
                        <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-white/30 text-left">Blob Identifier</label>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">Import .walblob</button>
                        <input type="file" accept=".walblob" ref={fileInputRef} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if(f) handlePackageImport(f); }} />
                     </div>
                     <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input 
                          type="text" 
                          value={blobId}
                          onChange={(e) => setBlobId(e.target.value)}
                          placeholder="Enter Walrus Blob ID..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-sm font-mono text-white/80 outline-none focus:border-primary/50 transition-all"
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-6 text-left">Decryption Key</label>
                     <div className="relative">
                        <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input 
                          type="password" 
                          value={decryptionKey}
                          onChange={(e) => setDecryptionKey(e.target.value)}
                          placeholder="Paste your 256-bit AES key..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-sm font-mono text-white/80 outline-none focus:border-primary/50 transition-all"
                        />
                     </div>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-3">
                       <ShieldAlert className="w-4 h-4" /> <div className="text-left">{error}</div>
                    </motion.div>
                  )}

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
                      <><ShieldCheck className="w-5 h-5" /> File Downloaded</>
                    ) : (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                    )}
                  </button>
               </form>
            </div>
          </div>

          <div className="mt-20 flex justify-center">
            <a href="/" className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
