import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, Check, Search, 
  Trash2, Clock, FileText
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { historyService, type HistoryItem } from '../../utils/history';

export const UploadHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>(() => historyService.getAll());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
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
    <div id="history" className="w-full">
      <div className="max-w-5xl mx-auto">
        <div className="glass-effect rounded-[40px] premium-shadow border border-white/5 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Identifier</th>
                  <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hidden md:table-cell">Size</th>
                  <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hidden lg:table-cell">Timestamp</th>
                  <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {history.map((item) => (
                    <motion.tr 
                      key={item.blobId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0 text-white/20 group-hover:text-primary group-hover:border-primary/20 transition-all">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="min-w-0 space-y-1.5">
                            <p className="text-sm font-bold text-white truncate max-w-[200px] md:max-w-xs">{item.name}</p>
                            <p className="text-[11px] font-mono text-white/20 truncate max-w-[150px]">{item.blobId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 hidden md:table-cell">
                        <span className="text-xs font-bold text-text-dim">{formatSize(item.size)}</span>
                      </td>
                      <td className="px-10 py-8 hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-xs font-bold text-text-dim">
                          <Clock className="w-3.5 h-3.5 opacity-30" />
                          {formatTime(item.uploadedAt)}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => copyId(item.blobId)}
                            className="p-3 rounded-xl bg-white/5 hover:bg-primary/10 text-white/40 hover:text-primary transition-all active:scale-95"
                            title="Copy Blob ID"
                          >
                            {copiedId === item.blobId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <a 
                            href={`/retrieve?blob=${item.blobId}`}
                            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all active:scale-95"
                            title="Open in Recovery"
                          >
                            <Search className="w-4 h-4" />
                          </a>
                          <button 
                            onClick={() => removeEntry(item.blobId)}
                            className="p-3 rounded-xl bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all active:scale-95"
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
          
          <div className="p-10 bg-white/[0.01] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.3em]">
              LocalStorage Registry · v3.0 Secure Audit
            </p>
            <button 
              onClick={() => { if(confirm('Clear all local history?')) { historyService.clear(); setHistory([]); } }}
              className="text-[10px] font-bold text-red-400/30 hover:text-red-400 uppercase tracking-[0.3em] transition-colors"
            >
              Wipe Local Vault
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
