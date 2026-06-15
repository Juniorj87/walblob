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
    <div className="terminal-window rounded-xl">
      {/* Terminal Header */}
      <div className="terminal-header px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="terminal-dot bg-secondary/80" />
          <div className="terminal-dot bg-accent/80" />
          <div className="terminal-dot bg-primary/80" />
        </div>
        <div className="text-[10px] font-mono text-text-muted">walblob explorer</div>
        <div className="w-16" />
      </div>

      {/* Terminal Body */}
      <div className="p-4 md:p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Command Header */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted">
            <span className="text-primary">$</span>
            <span className="text-accent">walblob</span>
            <span>inspect --blob-id=<span className="text-white">{blobId || '<id>'}</span></span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={blobId}
              onChange={(e) => setBlobId(e.target.value)}
              placeholder="Enter Blob ID to investigate..."
              className="w-full bg-background-alt border border-border-subtle rounded-lg py-3 pl-10 pr-4 text-xs font-mono text-white outline-none focus:border-primary/50 transition-all"
            />
          </div>

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

          {/* Results */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {/* Status & Network */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-border-subtle">
                    <div className="flex items-center gap-2 mb-2">
                      <File className="w-3 h-3 text-text-muted" />
                      <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full status-pulse",
                        result.status === 'Available' ? "bg-success" :
                          result.status === 'Pending' ? "bg-warning" : "bg-secondary"
                      )} />
                      <span className={cn(
                        "text-lg font-display font-bold",
                        result.status === 'Available' ? "text-success" :
                          result.status === 'Pending' ? "text-warning" : "text-secondary"
                      )}>
                        {result.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-border-subtle">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-3 h-3 text-text-muted" />
                      <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">Network</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-display font-bold text-white uppercase">{network}</span>
                      <span className="px-2 py-0.5 rounded text-[8px] font-mono bg-success/10 text-success uppercase">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                {result.status !== 'Not Found' && (
                  <div className="p-4 rounded-lg bg-white/[0.02] border border-border-subtle space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border-subtle">
                      <div>
                        <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider block mb-1">Blob Size</span>
                        <p className="text-xl font-display font-bold text-white">{formatSize(result.size)}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider block mb-1">End Epoch</span>
                        <p className="text-xl font-display font-bold text-white flex items-center justify-end gap-2">
                          <Clock className="w-4 h-4 text-primary" /> {result.endEpoch}
                        </p>
                      </div>
                    </div>

                    {/* Identifiers */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">Identifiers</span>
                      <div className="space-y-2">
                        <div className="p-2 rounded bg-background border border-border-subtle flex justify-between items-center">
                          <div className="min-w-0">
                            <span className="text-[8px] font-mono text-text-muted uppercase block">Blob ID</span>
                            <p className="text-[10px] font-mono text-white/80 truncate pr-4">{result.blobId}</p>
                          </div>
                          <CopyButton text={result.blobId} className="bg-transparent border-none p-1.5" />
                        </div>
                        <div className="p-2 rounded bg-background border border-border-subtle flex justify-between items-center">
                          <div className="min-w-0">
                            <span className="text-[8px] font-mono text-text-muted uppercase block">Aggregator</span>
                            <p className="text-[10px] font-mono text-white/80 truncate pr-4">{config.aggregatorUrl}</p>
                          </div>
                          <CopyButton text={config.aggregatorUrl} className="bg-transparent border-none p-1.5" />
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-2">
                      <a
                        href={`${config.explorerUrl}/blob/${result.blobId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary hover:bg-primary/20 transition-all"
                      >
                        View on Walrus Scan <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Not Found */}
                {result.status === 'Not Found' && (
                  <div className="p-6 rounded-lg bg-secondary/5 border border-secondary/10 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
                      <AlertCircle className="w-6 h-6 text-secondary/60" />
                    </div>
                    <h4 className="text-sm font-display font-bold text-white">Blob Not Found</h4>
                    <p className="text-[11px] text-text-muted max-w-sm mx-auto leading-relaxed">
                      The network could not locate this blob. It may have expired, or it is still being distributed across shards.
                    </p>
                    <a
                      href={`${config.explorerUrl}/blob/${result.blobId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[10px] font-mono text-secondary hover:text-secondary/80 transition-colors"
                    >
                      Check Global Ledger <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            disabled={isLoading || !blobId}
            className="w-full bg-primary text-black py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-terminal"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Querying Network...</>
            ) : (
              <><Search className="w-4 h-4" /> Explore Blob</>
            )}
          </button>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 text-[9px] font-mono text-text-muted">
            <Info className="w-3 h-3" />
            Read-only mode · Direct network verification
          </div>
        </form>
      </div>
    </div>
  );
};
