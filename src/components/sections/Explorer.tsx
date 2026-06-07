import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Database, Globe, Clock, 
  ExternalLink, Loader2, ShieldAlert,
  AlertCircle, Info
} from 'lucide-react';
import { useState } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { CopyButton } from '../ui/CopyButton';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BlobInfo {
  blobId: string;
  size: number;
  status: 'Available' | 'Pending' | 'Not Found';
  deletable: boolean;
  endEpoch: number;
}

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("glass-effect rounded-[32px] border border-white/5 premium-shadow overflow-hidden relative group/card", className)}>
    {children}
  </div>
);

export const Explorer = () => {
  const { network, config } = useNetwork();
  const [blobId, setBlobId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BlobInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = blobId.trim();
    if (!cleanId) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Fetch metadata from aggregator (read-only)
      const response = await fetch(`${config.aggregatorUrl}/v1/blobs/${cleanId}/metadata`, {
        mode: 'cors',
        cache: 'no-cache'
      });

      if (response.status === 404) {
        setResult({
           blobId: cleanId,
           size: 0,
           status: 'Not Found',
           deletable: false,
           endEpoch: 0
        });
      } else if (response.ok) {
        const data = await response.json();
        setResult({
          blobId: cleanId,
          size: data.size || 0,
          status: 'Available',
          deletable: data.deletable || false,
          endEpoch: data.endEpoch || 0
        });
      } else {
        throw new Error(`Aggregator error: ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blob status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="explorer" className="scroll-mt-32 md:scroll-mt-48">
      <div className="text-center mb-16 md:mb-20 space-y-4">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-pill bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-4">
          <Globe className="w-3.5 h-3.5" /> Network Explorer
        </div>
        <h2 className="text-4xl md:text-7xl font-display font-black tracking-tighter uppercase text-white leading-tight">
          Blob <span className="text-secondary">Explorer</span>
        </h2>
        <p className="text-text-muted text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed px-4">
          Verify data availability and storage parameters across the {network} without downloading or decrypting the content.
        </p>
      </div>

      <div className="max-w-4xl mx-auto relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-secondary/10 via-primary/10 to-secondary/10 rounded-[40px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <GlassCard className="p-8 md:p-16 bg-[#0A0D1D]/60 backdrop-blur-[80px]">
          <form onSubmit={handleSearch} className="space-y-10">
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-6">Walrus Blob Identifier</label>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input 
                  type="text" 
                  value={blobId}
                  onChange={(e) => setBlobId(e.target.value)}
                  placeholder="Enter Blob ID to investigate..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-sm font-mono text-white/80 outline-none focus:border-secondary/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-4">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <div className="text-[10px] font-black text-red-400 uppercase tracking-widest">{error}</div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/40 rounded-2xl border border-white/5 p-6 space-y-4">
                         <div className="flex items-center gap-3">
                            <Database className="w-4 h-4 text-white/20" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Status</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <div className={cn(
                               "w-2.5 h-2.5 rounded-full animate-pulse",
                               result.status === 'Available' ? "bg-emerald-400" :
                               result.status === 'Pending' ? "bg-orange-400" : "bg-red-400"
                            )} />
                            <span className={cn(
                               "text-xl font-display font-black uppercase italic",
                               result.status === 'Available' ? "text-emerald-400" :
                               result.status === 'Pending' ? "text-orange-400" : "text-red-400"
                            )}>{result.status}</span>
                         </div>
                      </div>

                      <div className="bg-black/40 rounded-2xl border border-white/5 p-6 space-y-4">
                         <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-white/20" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Network</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="text-xl font-display font-black uppercase italic text-white">{network}</span>
                            <div className={cn(
                               "px-2 py-0.5 rounded text-[8px] font-black uppercase",
                               network === 'testnet' ? "bg-orange-400/10 text-orange-400" : "bg-emerald-400/10 text-emerald-400"
                            )}>Active</div>
                         </div>
                      </div>
                   </div>

                   {result.status !== 'Not Found' && (
                      <div className="bg-black/40 rounded-2xl border border-white/5 p-8 space-y-8">
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                            <div className="space-y-2">
                               <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Blob Size</span>
                               <p className="text-2xl font-display font-black text-white">{formatSize(result.size)}</p>
                            </div>
                            <div className="space-y-2 md:text-right">
                               <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Storage End Epoch</span>
                               <p className="text-2xl font-display font-black text-white flex items-center md:justify-end gap-2 italic">
                                  <Clock className="w-5 h-5 text-secondary" /> {result.endEpoch}
                               </p>
                            </div>
                         </div>

                         <div className="space-y-4">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Internal Identifiers</span>
                            <div className="grid grid-cols-1 gap-2">
                               <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center group/id">
                                  <div className="min-w-0">
                                     <span className="text-[8px] font-black text-white/20 uppercase block mb-1">Blob ID</span>
                                     <p className="text-[10px] font-mono text-white/60 truncate">{result.blobId}</p>
                                  </div>
                                  <CopyButton text={result.blobId} className="bg-transparent border-none" />
                               </div>
                               <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center group/url">
                                  <div className="min-w-0">
                                     <span className="text-[8px] font-black text-white/20 uppercase block mb-1">Aggregator Node</span>
                                     <p className="text-[10px] font-mono text-white/60 truncate">{config.aggregatorUrl}</p>
                                  </div>
                                  <CopyButton text={config.aggregatorUrl} className="bg-transparent border-none" />
                               </div>
                            </div>
                         </div>

                         <div className="pt-4 flex justify-center">
                            <a 
                              href={`${config.explorerUrl}/blob/${result.blobId}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-secondary/10 border border-secondary/20 text-[10px] font-black uppercase tracking-[0.2em] text-secondary hover:bg-secondary/20 transition-all shadow-lg"
                            >
                               View on Walrus Scan <ExternalLink className="w-4 h-4" />
                            </a>
                         </div>
                      </div>
                   )}

                   {result.status === 'Not Found' && (
                      <div className="bg-red-400/5 rounded-2xl border border-red-400/10 p-8 text-center space-y-4">
                         <AlertCircle className="w-12 h-12 text-red-400/40 mx-auto" />
                         <div className="space-y-2">
                            <h4 className="text-white font-black uppercase tracking-widest">Blob not found</h4>
                            <p className="text-xs text-white/40 max-w-sm mx-auto leading-relaxed">
                               The network could not locate this blob. It may have expired, or it's still being distributed across shards.
                            </p>
                         </div>
                         <div className="pt-4">
                            <a 
                               href={`${config.explorerUrl}/blob/${result.blobId}`} 
                               target="_blank" 
                               rel="noreferrer"
                               className="text-[9px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors flex items-center justify-center gap-2"
                            >
                               Check Global Ledger <ExternalLink className="w-3 h-3" />
                            </a>
                         </div>
                      </div>
                   )}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              disabled={isLoading || !blobId}
              className="w-full bg-secondary text-black py-6 rounded-pill font-black text-[12px] uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(0,209,255,0.1)] disabled:opacity-20 flex items-center justify-center gap-4"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Querying Network...</>
              ) : (
                <><Search className="w-5 h-5" /> Explore Blob</>
              )}
            </button>

            <div className="pt-4 flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-widest text-white/20">
               <Info className="w-3.5 h-3.5" /> Read-only mode. No decryption required.
            </div>
          </form>
        </GlassCard>
      </div>
    </section>
  );
};
