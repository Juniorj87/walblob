import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, Check, Search, 
  Trash2, Clock, FileText, Lock
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { historyService, type HistoryItem } from '../../utils/history';

export const UploadHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>(() => historyService.getAll());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // Update "now" every minute to refresh relative timestamps
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const removeEntry = (id: string) => {
    historyService.remove(id);
    setHistory(historyService.getAll());
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ts: number) => {
    const diff = now - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  if (history.length === 0) return null;

  return (
    <section id="history" className="scroll-mt-32">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">
          <Lock className="w-3 h-3" /> Browser-Side Only
        </div>
        <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase text-white leading-tight">
          Local <span className="text-gradient">Vault</span>
        </h2>
        <p className="text-text-muted text-sm md:text-base font-medium max-w-xl mx-auto opacity-60">
          A private record of your uploads. Stored only in this browser.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="glass-effect rounded-[40px] border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">File</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hidden md:table-cell">Size</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hidden lg:table-cell">Sealed At</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {history.map((item) => (
                    <motion.tr 
                      key={item.blobId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate max-w-[200px] md:max-w-xs">{item.name}</p>
                            <p className="text-[10px] font-mono text-white/20 truncate max-w-[150px]">{item.blobId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 hidden md:table-cell">
                        <span className="text-xs font-medium text-text-muted">{formatSize(item.size)}</span>
                      </td>
                      <td className="px-8 py-6 hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <Clock className="w-3.5 h-3.5 opacity-40" />
                          {formatTime(item.uploadedAt)}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => copyId(item.blobId)}
                            className="p-2.5 rounded-lg bg-white/5 hover:bg-primary/20 text-white/40 hover:text-primary transition-all active:scale-90"
                            title="Copy Blob ID"
                          >
                            {copiedId === item.blobId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <a 
                            href={`/retrieve?blob=${item.blobId}`}
                            className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all active:scale-90"
                            title="Open in Recovery"
                          >
                            <Search className="w-4 h-4" />
                          </a>
                          <button 
                            onClick={() => removeEntry(item.blobId)}
                            className="p-2.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all active:scale-90"
                            title="Remove from history"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          <div className="p-8 bg-black/20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">
              Maximum 50 records stored locally
            </p>
            <button 
              onClick={() => { if(confirm('Clear all history?')) { historyService.clear(); setHistory([]); } }}
              className="text-[10px] font-black text-red-400/40 hover:text-red-400 uppercase tracking-[0.4em] transition-colors"
            >
              Wipe Local Vault
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
