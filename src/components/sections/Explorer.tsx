import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, File, Globe, Clock, 
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
    <div id="explorer" className="w-full">
      <div className="max-w-4xl mx-auto relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-[48px] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="relative bg-[#020617]/80 backdrop-blur-[60px] rounded-[44px] border border-white/10 shadow-2xl overflow-hidden p-8 md:p-16">
          <form onSubmit={handleSearch} className="space-y-12">
            <div className="space-y-6">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-4">Walrus Blob Identifier</label>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input 
                  type="text" 
                  value={blobId}
                  onChange={(e) => setBlobId(e.target.value)}
                  placeholder="Enter Blob ID to investigate..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-sm font-mono text-white/80 outline-none focus:border-primary/40 focus:bg-white/[0.03] transition-all"
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center gap-4">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <div className="text-xs font-bold text-red-400 uppercase tracking-widest">{error}</div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {result && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/[0.02] rounded-3xl border border-white/5 p-6 space-y-4">
                         <div className="flex items-center gap-3">
                            <File className="w-4 h-4 text-white/20" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Status</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <div className={cn(
                               "w-2.5 h-2.5 rounded-full animate-pulse",
                               result.status === 'Available' ? "bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" :
                               result.status === 'Pending' ? "bg-warning shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]"
                            )} />
                            <span className={cn(
                               "text-2xl font-display font-bold text-white",
                               result.status === 'Available' ? "text-emerald-400" :
                               result.status === 'Pending' ? "text-warning" : "text-red-400"
                            )}>{result.status}</span>
                         </div>
                      </div>

                      <div className="bg-white/[0.02] rounded-3xl border border-white/5 p-6 space-y-4">
                         <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-white/20" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Network</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="text-2xl font-display font-bold text-white uppercase">{network}</span>
                            <div className={cn(
                               "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest",
                               network === 'testnet' ? "bg-warning/10 text-warning" : "bg-emerald-400/10 text-emerald-400"
                            )}>Active</div>
                         </div>
                      </div>
                   </div>

                   {result.status !== 'Not Found' && (
                      <div className="bg-white/[0.02] rounded-3xl border border-white/5 p-8 space-y-8">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-white/5">
                            <div className="space-y-2">
                               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Blob Size</span>
                               <p className="text-3xl font-display font-bold text-white">{formatSize(result.size)}</p>
                            </div>
                            <div className="space-y-2 md:text-right">
                               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Storage End Epoch</span>
                               <p className="text-3xl font-display font-bold text-white flex items-center md:justify-end gap-3">
                                  <Clock className="w-6 h-6 text-primary" /> {result.endEpoch}
                               </p>
                            </div>
                         </div>

                         <div className="space-y-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-2">Internal Identifiers</span>
                            <div className="grid grid-cols-1 gap-3">
                               <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex justify-between items-center group/id">
                                  <div className="min-w-0">
                                     <span className="text-[8px] font-bold text-white/20 uppercase block mb-1">Blob ID</span>
                                     <p className="text-[11px] font-mono text-white/60 truncate pr-4">{result.blobId}</p>
                                  </div>
                                  <CopyButton text={result.blobId} className="bg-white/5 border-none p-2 rounded-lg" />
                               </div>
                               <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex justify-between items-center group/url">
                                  <div className="min-w-0">
                                     <span className="text-[8px] font-bold text-white/20 uppercase block mb-1">Aggregator Node</span>
                                     <p className="text-[11px] font-mono text-white/60 truncate pr-4">{config.aggregatorUrl}</p>
                                  </div>
                                  <CopyButton text={config.aggregatorUrl} className="bg-white/5 border-none p-2 rounded-lg" />
                               </div>
                            </div>
                         </div>

                         <div className="pt-6 flex justify-center">
                            <a 
                              href={`${config.explorerUrl}/blob/${result.blobId}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/20 transition-all"
                            >
                               View on Walrus Scan <ExternalLink className="w-4 h-4" />
                            </a>
                         </div>
                      </div>
                   )}

                   {result.status === 'Not Found' && (
                      <div className="bg-red-400/5 rounded-3xl border border-red-400/10 p-10 text-center space-y-6">
                         <div className="w-16 h-16 rounded-full bg-red-400/10 flex items-center justify-center mx-auto">
                            <AlertCircle className="w-8 h-8 text-red-400/60" />
                         </div>
                         <div className="space-y-3">
                            <h4 className="text-xl font-display font-bold text-white">Blob Not Found</h4>
                            <p className="text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
                               The network could not locate this blob. It may have expired, or it is still being distributed across shards.
                            </p>
                         </div>
                         <div className="pt-4">
                            <a 
                               href={`${config.explorerUrl}/blob/${result.blobId}`} 
                               target="_blank" 
                               rel="noreferrer"
                               className="text-xs font-bold uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors flex items-center justify-center gap-2"
                            >
                               Check Global Ledger <ExternalLink className="w-4 h-4" />
                            </a>
                         </div>
                      </div>
                   )}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              disabled={isLoading || !blobId}
              className="w-full bg-white text-black py-7 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.15)] disabled:opacity-20 flex items-center justify-center gap-4"
            >
              {isLoading ? (
                <><Loader2 className="w-6 h-6 animate-spin" /> Querying Network...</>
              ) : (
                <><Search className="w-6 h-6" /> Explore Blob</>
              )}
            </button>

            <div className="pt-6 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/20">
               <Info className="w-4 h-4" /> Read-only mode · Direct network verification
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
