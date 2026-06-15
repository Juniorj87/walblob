import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy, Check, Search,
  Trash2, Clock, FileText, Terminal
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
    <div className="terminal-window rounded-xl">
      {/* Terminal Header */}
      <div className="terminal-header px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="terminal-dot bg-secondary/80" />
          <div className="terminal-dot bg-accent/80" />
          <div className="terminal-dot bg-primary/80" />
        </div>
        <div className="text-[10px] font-mono text-text-muted">walblob history</div>
        <div className="w-16" />
      </div>

      {/* Terminal Body */}
      <div className="p-4 md:p-6">
        {/* Command Header */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted mb-4">
          <span className="text-primary">$</span>
          <span className="text-accent">walblob</span>
          <span>history --list --format=detailed</span>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="pb-2 text-[9px] font-mono text-text-muted uppercase tracking-wider">File</th>
                <th className="pb-2 text-[9px] font-mono text-text-muted uppercase tracking-wider hidden md:table-cell">Size</th>
                <th className="pb-2 text-[9px] font-mono text-text-muted uppercase tracking-wider hidden lg:table-cell">Time</th>
                <th className="pb-2 text-[9px] font-mono text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {history.map((item) => (
                  <motion.tr
                    key={item.blobId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="border-b border-border-subtle/50 last:border-none group"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate max-w-[150px] md:max-w-[200px]">{item.name}</p>
                          <p className="text-[10px] font-mono text-text-muted truncate max-w-[120px]">{item.blobId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 hidden md:table-cell">
                      <span className="text-[10px] font-mono text-text-muted">{formatSize(item.size)}</span>
                    </td>
                    <td className="py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted">
                        <Clock className="w-3 h-3 opacity-50" />
                        {formatTime(item.uploadedAt)}
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyId(item.blobId)}
                          className="p-1.5 rounded-md bg-background hover:bg-primary/10 text-text-muted hover:text-primary transition-all"
                          title="Copy Blob ID"
                        >
                          {copiedId === item.blobId ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <a
                          href={`/retrieve?blob=${item.blobId}`}
                          className="p-1.5 rounded-md bg-background hover:bg-white/10 text-text-muted hover:text-white transition-all"
                          title="Open in Recovery"
                        >
                          <Search className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => removeEntry(item.blobId)}
                          className="p-1.5 rounded-md bg-background hover:bg-secondary/10 text-text-muted hover:text-secondary transition-all"
                          title="Remove from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-[9px] font-mono text-text-muted">
            <Terminal className="w-3 h-3" />
            LocalStorage Registry · v3.0
          </div>
          <button
            onClick={() => { if (confirm('Clear all local history?')) { historyService.clear(); setHistory([]); } }}
            className="text-[9px] font-mono text-secondary/50 hover:text-secondary uppercase tracking-wider transition-colors"
          >
            [clear-all]
          </button>
        </div>
      </div>
    </div>
  );
};
