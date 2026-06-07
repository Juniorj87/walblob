import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Share2, Lock, UploadCloud, Zap, HelpCircle, 
  Loader2, Copy, ShieldCheck, Check,
  Globe, Shield, Fingerprint, ZapIcon, FileText, Key,
  Download, QrCode as QrIcon, Trash2, Plus
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { useWalrus } from '../../hooks/useWalrus';
import { encryptFile } from '../../utils/encryption';
import { historyService } from '../../utils/history';
import { UploadHistory } from './UploadHistory';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Header } from '../ui/Header';
import { OrbitalParticles } from '../animations/OrbitalParticles';
import { RecoveryBlock } from './RecoveryBlock';
import { RecoveryGuide } from './RecoveryGuide';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UploadQueueItem {
  id: string;
  file: File;
  status: 'pending' | 'encrypting' | 'uploading' | 'success' | 'error';
  progress: number;
  result?: { blobId: string; key: string; url: string };
  error?: string;
}

const GlassCard = ({ children, className = "", hoverGlow = false }: { children: React.ReactNode, className?: string, hoverGlow?: boolean }) => (
  <motion.div 
    whileHover={hoverGlow ? { y: -5 } : {}}
    className={cn("glass-effect rounded-card premium-shadow overflow-hidden relative group/card", className)}
  >
    {hoverGlow && (
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
    )}
    {children}
  </motion.div>
);

const SectionTitle = ({ children, subtitle, align = "center" }: { children: React.ReactNode, subtitle?: string, align?: "center" | "left" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8 }}
    className={cn("mb-16 md:mb-20 space-y-4", align === "center" ? "text-center" : "text-left")}
  >
    <h2 className="text-4xl md:text-7xl font-display font-black tracking-tighter uppercase text-white leading-tight">
      {children}
    </h2>
    {subtitle && <p className={cn("text-text-muted text-base md:text-lg font-medium max-w-2xl leading-relaxed", align === "center" && "mx-auto")}>{subtitle}</p>}
  </motion.div>
);

const TrustBadge = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/5 text-[11px] font-black uppercase tracking-widest text-white/80 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20">
    <Check className="w-4 h-4 text-emerald-400" /> {children}
  </div>
);

export default function Dashboard() {
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [retention, setRetention] = useState(30);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQR, setShowQR] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showQR) {
      const url = `${window.location.origin}/retrieve?blob=${showQR}`;
      QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }).then(setQrDataUrl).catch(console.error);
    }
  }, [showQR]);

  const { publishBlob, stats } = useWalrus();

  const updateItem = useCallback((id: string, updates: Partial<UploadQueueItem>) => {
    setQueue(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  }, []);

  const processQueue = useCallback(async () => {
    const pending = queue.find(item => item.status === 'pending');
    if (!pending) return;

    updateItem(pending.id, { status: 'encrypting' });

    try {
      // 1. Encrypt with Metadata
      const { encryptedBlob, key } = await encryptFile(pending.file, true);
      
      // 2. Upload
      updateItem(pending.id, { status: 'uploading' });
      const encryptedFile = new File([encryptedBlob], pending.file.name, { type: pending.file.type });
      const result = await publishBlob(encryptedFile, Math.ceil(retention / 30));

      if (result) {
        const finalResult = { ...result, key };
        updateItem(pending.id, { status: 'success', result: finalResult, progress: 100 });
        
        // 3. Save to History
        historyService.save({
          blobId: result.blobId,
          name: pending.file.name,
          size: pending.file.size,
          uploadedAt: Date.now(),
          url: result.url
        });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Processing failed';
      updateItem(pending.id, { status: 'error', error: errorMessage });
    }
  }, [queue, publishBlob, retention, updateItem]);

  useEffect(() => {
    const active = queue.some(item => item.status === 'encrypting' || item.status === 'uploading');
    if (!active) {
       // Defer to avoid cascading render warning
       const timer = setTimeout(() => {
          processQueue();
       }, 0);
       return () => clearTimeout(timer);
    }
  }, [queue, processQueue]);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newItems: UploadQueueItem[] = Array.from(selectedFiles).map(f => ({
      id: Math.random().toString(36).slice(2, 11),
      file: f,
      status: 'pending',
      progress: 0
    }));
    setQueue(prev => [...prev, ...newItems]);
  };

  const downloadRecoveryPackage = (item: UploadQueueItem) => {
    if (!item.result) return;
    const nowTimestamp = new Date().getTime();
    const pkg = {
      blobId: item.result.blobId,
      key: item.result.key,
      metadata: {
        name: item.file.name,
        type: item.file.type,
        size: item.file.size,
        uploadedAt: nowTimestamp
      },
      version: '2.1.0'
    };
    
    const blob = new Blob([JSON.stringify(pkg, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.file.name}.walblob`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/30">
      <OrbitalParticles />
      <Header />

      <section className="relative min-h-[100vh] flex flex-col items-center justify-center pt-32 md:pt-40 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] border border-white/[0.05] rounded-full"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-6xl"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 rounded-pill bg-white/5 border border-white/10 text-primary text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] mb-10 md:mb-14 shadow-2xl backdrop-blur-xl"
          >
            <Fingerprint className="w-3.5 h-3.5 md:w-4 md:h-4" /> Zero-Knowledge Storage
          </motion.div>
          
          <h1 className="text-5xl md:text-[120px] font-display font-black tracking-tighter leading-[0.8] mb-10 md:mb-14 text-white text-center">
            <span className="text-gradient">Seal Your Files</span> <br />
            <motion.span 
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="italic font-light text-white/40"
            >
              Beyond Borders
            </motion.span>
          </h1>

          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-[48px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative bg-[#0A0D1D]/80 backdrop-blur-[60px] rounded-[44px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden">
               <div className="p-4 md:p-6">
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                    className={cn(
                      "relative group/drop cursor-pointer rounded-[36px] transition-all duration-700",
                      queue.length === 0 ? "h-[450px] md:h-[550px] flex flex-col items-center justify-center" : "p-8",
                      "bg-[#0D1121]/50 border-2 border-dashed",
                      isDragging ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20 hover:bg-[#0D1121]/80"
                    )}
                  >
                    <input type="file" multiple ref={fileInputRef} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                    
                    {queue.length === 0 ? (
                      <div onClick={() => fileInputRef.current?.click()} className="relative z-10 flex flex-col items-center gap-8 md:gap-12 text-center w-full max-w-xl px-6">
                        <div className="relative">
                          <motion.div 
                            animate={isDragging ? { scale: 1.2 } : { scale: 1 }}
                            className="w-24 h-24 md:w-40 md:h-40 bg-white/5 rounded-2xl md:rounded-[48px] border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden group-hover/drop:border-primary/40 transition-all duration-500"
                          >
                             <UploadCloud className={cn("w-12 h-12 md:w-20 md:h-20 transition-all duration-500", isDragging ? "text-primary" : "text-white/40 group-hover/drop:text-primary")} />
                          </motion.div>
                        </div>
                        <div className="space-y-4">
                           <h2 className="text-2xl md:text-5xl font-display font-black text-white tracking-tight leading-tight">
                             <span className="text-primary">Drag & Drop</span> to Seal
                           </h2>
                           <p className="text-text-muted text-sm font-medium opacity-60">Multiple files supported (Batch v2.1)</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center px-4">
                           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Upload Queue</h3>
                           <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">
                              <Plus className="w-4 h-4" /> Add Files
                           </button>
                        </div>
                        
                        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                           <AnimatePresence mode="popLayout">
                              {queue.map((item) => (
                                <motion.div 
                                  key={item.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  className="bg-black/40 rounded-2xl border border-white/5 p-4 flex flex-col gap-4 group/item"
                                >
                                   <div className="flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-4 min-w-0">
                                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                            {item.status === 'success' ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <FileText className="w-5 h-5 text-white/20" />}
                                         </div>
                                         <div className="min-w-0">
                                            <p className="text-xs font-bold text-white truncate max-w-[200px]">{item.file.name}</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">{formatSize(item.file.size)} · {item.status}</p>
                                         </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-3">
                                         {(item.status === 'encrypting' || item.status === 'uploading') && (
                                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                         )}
                                         {item.status === 'success' && (
                                            <div className="flex items-center gap-2">
                                               <button onClick={() => downloadRecoveryPackage(item)} className="p-2 rounded-lg bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 transition-all" title="Download .walblob package">
                                                  <Download className="w-4 h-4" />
                                               </button>
                                               <button onClick={() => setShowQR(item.result?.blobId || null)} className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-all">
                                                  <QrIcon className="w-4 h-4" />
                                               </button>
                                            </div>
                                         )}
                                         <button 
                                           onClick={() => setQueue(prev => prev.filter(i => i.id !== item.id))}
                                           className="p-2 rounded-lg bg-white/5 text-white/20 hover:text-red-400 transition-all opacity-0 group-hover/item:opacity-100"
                                         >
                                            <Trash2 className="w-4 h-4" />
                                         </button>
                                      </div>
                                   </div>

                                   {item.status === 'uploading' && stats && (
                                      <div className="space-y-2 px-2">
                                         <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${stats.percentage}%` }} className="h-full bg-primary" />
                                         </div>
                                         <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/30">
                                            <span>{stats.speed}</span>
                                            <span>{stats.remaining} left</span>
                                         </div>
                                      </div>
                                   )}

                                   {item.result && (
                                      <div className="grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-white/5">
                                         <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex justify-between items-center group/sub">
                                            <p className="text-[8px] font-mono text-white/20 truncate pr-2">{item.result.blobId}</p>
                                            <button onClick={() => copyToClipboard(item.result!.blobId, item.id + 'id')} className="shrink-0 text-white/20 hover:text-primary transition-all">
                                               {copiedId === item.id + 'id' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                         </div>
                                         <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex justify-between items-center group/sub">
                                            <p className="text-[8px] font-mono text-white/20 truncate pr-2">{item.result.key}</p>
                                            <button onClick={() => copyToClipboard(item.result!.key, item.id + 'key')} className="shrink-0 text-white/20 hover:text-primary transition-all">
                                               {copiedId === item.id + 'key' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                         </div>
                                      </div>
                                   )}
                                </motion.div>
                              ))}
                           </AnimatePresence>
                        </div>

                        <div className="pt-6 border-t border-white/5 flex justify-between items-center px-4">
                           <div className="flex items-center gap-6">
                              <select 
                                value={retention}
                                onChange={(e) => setRetention(Number(e.target.value))}
                                className="bg-transparent text-[10px] font-black uppercase tracking-widest text-white/40 outline-none cursor-pointer hover:text-white transition-all"
                              >
                                 <option className="bg-[#050816]" value={30}>30 Days</option>
                                 <option className="bg-[#050816]" value={365}>1 Year</option>
                                 <option className="bg-[#050816]" value={3650}>Permanent</option>
                              </select>
                              <div className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
                                 <Shield className="w-3.5 h-3.5" /> AES-256 GCM
                              </div>
                           </div>
                           <button 
                             onClick={() => setQueue([])}
                             className="text-[10px] font-black uppercase tracking-widest text-red-400/40 hover:text-red-400 transition-colors"
                           >
                              Clear Queue
                           </button>
                        </div>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* QR MODAL */}
      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowQR(null)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-[#0A0D1D] rounded-[48px] border border-white/10 p-12 md:p-16 max-w-sm w-full text-center space-y-8">
               <h4 className="text-xl font-display font-black uppercase tracking-tighter text-white">Mobile Recovery</h4>
               <div className="bg-white p-6 rounded-3xl inline-block shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                  {qrDataUrl && <img src={qrDataUrl} alt="Recovery QR" className="w-[180px] h-[180px]" />}
               </div>
               <p className="text-text-muted text-xs leading-relaxed">Scan to open the recovery screen on your mobile device. You will still need to enter your Decryption Key manually.</p>
               <button onClick={() => setShowQR(null)} className="w-full bg-white/5 border border-white/10 py-5 rounded-pill font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="max-w-[1440px] mx-auto px-6 md:px-10 space-y-40 md:space-y-80 pb-40 md:pb-80 relative z-10">
        
        {/* LOCAL HISTORY SECTION (Priority 6) */}
        <UploadHistory />

        {/* STANDALONE RECOVERY SECTION */}
        <RecoveryBlock />

        {/* HOW RECOVERY WORKS GUIDE (Priority 2) */}
        <RecoveryGuide />

        {/* HOW WALBLOB PROTECTS YOUR FILES */}
        <section className="scroll-mt-48">
           <div className="grid lg:grid-cols-2 gap-16 md:gap-32 items-start">
              <div className="space-y-16">
                 <SectionTitle 
                   subtitle="Your files are encrypted directly in your browser before leaving your device. WalBlob stores only encrypted data on Walrus, ensuring that only you control access to your information."
                   align="left"
                 >
                   Encrypt. <br />
                   Upload. <br />
                   Share.
                 </SectionTitle>
                 
                 <div className="flex flex-col gap-5">
                    <TrustBadge>Client-side Encryption</TrustBadge>
                    <TrustBadge>Decentralized Walrus Storage</TrustBadge>
                    <TrustBadge>You Control The Keys</TrustBadge>
                 </div>
              </div>

              <div className="relative space-y-8">
                 {/* Visual Flow Diagram */}
                 {[
                   { step: 1, title: 'FILE', icon: FileText, desc: 'Select any file up to the supported size limit.', color: 'white' },
                   { step: 2, title: 'AES-256 ENCRYPTION', icon: Lock, desc: 'The file is encrypted locally in your browser before upload.', color: 'primary', glow: true },
                   { step: 3, title: 'ENCRYPTED BLOB', icon: Database, desc: 'The original content becomes unreadable encrypted data.', color: 'secondary', floating: true },
                   { step: 4, title: 'WALRUS STORAGE', icon: Globe, desc: 'The encrypted blob is distributed and stored on the Walrus network.', color: 'primary', nodes: true },
                   { step: 5, title: 'PRIVATE ACCESS', icon: Key, desc: 'Only the holder of the decryption key can access the original file.', color: 'emerald-400', glow: true, emerald: true }
                 ].map((item, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, x: 20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="relative"
                   >
                     <div className={cn(
                        "flex items-center gap-8 p-8 rounded-[32px] border transition-all duration-700 backdrop-blur-3xl group/step",
                        item.glow && i === 1 ? "bg-primary/5 border-primary/20 shadow-[0_0_50px_rgba(0,209,255,0.1)]" : 
                        item.emerald ? "bg-emerald-400/5 border-emerald-400/20 shadow-[0_0_50px_rgba(52,211,153,0.1)]" :
                        "bg-white/5 border-white/10"
                     )}>
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl relative overflow-hidden",
                          item.color === 'primary' ? "bg-primary/20 text-primary" : 
                          item.color === 'secondary' ? "bg-secondary/20 text-secondary" :
                          item.color === 'emerald-400' ? "bg-emerald-400/20 text-emerald-400" :
                          "bg-white/10 text-white"
                        )}>
                           <item.icon className="w-8 h-8 relative z-10" />
                           {item.floating && <div className="absolute inset-0 bg-secondary/10 animate-pulse" />}
                        </div>
                        <div className="space-y-2 text-left">
                           <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Step 0{item.step}</span>
                              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white tracking-widest">{item.title}</h4>
                           </div>
                           <p className="text-text-muted text-sm font-medium leading-relaxed opacity-60 group-hover/step:opacity-100 transition-opacity">{item.desc}</p>
                        </div>
                     </div>
                     {i < 4 && (
                       <div className="flex justify-center py-2 h-8">
                          <motion.div 
                            animate={{ y: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-px h-full bg-gradient-to-b from-white/20 to-transparent" 
                          />
                       </div>
                     )}
                   </motion.div>
                 ))}

                 {/* Zero-Knowledge Note */}
                 <div className="mt-12 p-8 rounded-[32px] bg-emerald-400/5 border border-emerald-400/10 text-left relative overflow-hidden">
                    <div className="relative z-10 space-y-3">
                       <h5 className="text-emerald-400 text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3">
                         <ShieldCheck className="w-5 h-5" /> Zero-Knowledge Design
                       </h5>
                       <p className="text-text-muted text-sm font-medium leading-relaxed opacity-80">
                         WalBlob never sees your original files, passwords, or encryption keys. Storage providers only receive encrypted blobs.
                       </p>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />
                 </div>
              </div>
           </div>
        </section>

        <section id="security" className="scroll-mt-32 md:scroll-mt-48">
          <SectionTitle subtitle="Walrus technology distributes data across independent nodes for maximum reliability.">Network Reliability</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 relative text-center">
            <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10" />
            
            {[
              { title: 'Upload', icon: UploadCloud, desc: 'Data flows from your browser to a secure buffer.' },
              { title: 'Encrypt', icon: Lock, desc: 'Client-side AES-256 sealing. We never see your files.' },
              { title: 'Store', icon: Database, desc: 'Fragmentation and distribution across the global Walrus network.' },
              { title: 'Access', icon: Share2, desc: 'Private link and key generation for instant retrieval.' }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                className="group relative"
              >
                <div className="w-20 h-20 md:w-28 md:h-28 bg-white/[0.03] backdrop-blur-md rounded-[32px] md:rounded-[40px] border border-white/5 flex items-center justify-center mx-auto mb-8 md:mb-12 group-hover:bg-primary/15 group-hover:border-primary/30 group-hover:scale-110 transition-all duration-700 shadow-2xl relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <step.icon className="w-8 h-8 md:w-12 md:h-12 text-white/40 group-hover:text-primary transition-all duration-500 relative z-10" />
                </div>
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-white/80 group-hover:text-white transition-colors tracking-widest">{step.title}</h3>
                  <p className="text-text-muted text-xs md:text-sm font-medium leading-relaxed px-4 md:px-6 opacity-60 group-hover:opacity-100 transition-opacity">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="product" className="scroll-mt-32 md:scroll-mt-48">
           <SectionTitle subtitle="Uncompromising security and next-generation performance.">The Benefits</SectionTitle>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {[
                { title: 'Zero Trust', icon: Shield, desc: 'Complete privacy. Encryption happens in your browser, keys never leave your device.' },
                { title: 'Anonymous', icon: Fingerprint, desc: 'No registration required. Just connect your Sui wallet to interact with the protocol.' },
                { title: 'Eternity', icon: ZapIcon, desc: 'Choose permanent storage for data that should outlast the current internet generation.' },
                { title: 'Instant', icon: Zap, desc: 'Global caching and parallel fragment loading ensure lightning-fast access.' },
                { title: 'Scalable', icon: Globe, desc: 'Walrus is ready for any volume — from family archives to enterprise databases.' },
                { title: 'Sui Integrated', icon: Database, desc: 'Powered by Sui for transparent transactions and low-cost storage.' }
              ].map((f, i) => (
                <GlassCard key={i} hoverGlow className="p-8 md:p-14 transition-all duration-1000">
                   <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 rounded-2xl md:rounded-3xl flex items-center justify-center mb-8 md:mb-12 border border-white/5 group-hover/card:bg-white group-hover/card:scale-110 transition-all duration-700">
                      <f.icon className="w-6 h-6 md:w-7 md:h-7 text-white/40 group-hover/card:text-black transition-colors" />
                   </div>
                   <h4 className="text-lg md:text-xl font-black uppercase tracking-[0.2em] text-white mb-6 md:mb-8 tracking-widest text-left">{f.title}</h4>
                   <p className="text-text-muted text-sm md:text-base font-medium leading-relaxed opacity-70 group-hover/card:opacity-100 transition-opacity text-left">{f.desc}</p>
                </GlassCard>
              ))}
           </div>
        </section>

        <section id="faq" className="scroll-mt-32 md:scroll-mt-48 pt-20 md:pt-40">
          <SectionTitle subtitle="Frequently asked questions about technology and security.">FAQ</SectionTitle>
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
             {[
               { q: 'How secure is it?', a: 'Your file is encrypted in the browser using AES-256. We never gain access to your content or keys. Security is mathematically guaranteed.' },
               { q: 'What is Walrus?', a: 'It is a decentralized storage network from Mysten Labs that fragments files and distributes them among independent validators.' },
               { q: 'How to recover a file?', a: 'You need to save the Blob ID and Encryption Key. With them, you can retrieve your file via WalBlob or any other Walrus explorer.' },
               { q: 'What is the storage price?', a: 'The cost depends on current Walrus network parameters and retention period. Payment occurs once at the time of data recording.' }
             ].map((item, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
               >
                 <GlassCard className="p-8 md:p-12 hover:bg-white/[0.04] transition-all duration-700 border-white/5 group/faq text-left">
                    <h4 className="text-lg md:text-xl font-bold text-white mb-6 md:mb-8 flex items-center gap-4 md:gap-6 group-hover/faq:text-primary transition-colors leading-tight">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      {item.q}
                    </h4>
                    <p className="text-text-muted text-base md:text-lg leading-relaxed font-medium pl-12 md:pl-16 border-l border-white/10 opacity-70">{item.a}</p>
                 </GlassCard>
               </motion.div>
             ))}
          </div>
        </section>
      </main>

      <footer className="bg-black py-32 md:py-52 border-t border-white/5 px-6 md:px-10 relative z-20 overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-32 mb-32 md:mb-52 text-left">
              <div className="col-span-1 md:col-span-2 space-y-12 md:space-y-16">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl text-center">
                     <Database className="w-7 h-7 md:w-8 md:h-8 text-black mx-auto" />
                   </div>
                   <span className="text-2xl md:text-3xl font-display font-black tracking-tighter uppercase text-white tracking-[0.2em]">WalBlob</span>
                 </div>
                 <p className="text-white/30 text-xl md:text-2xl font-light max-w-sm leading-relaxed italic">
                   "A new standard for privacy in a decentralized world."
                 </p>
              </div>
              
              <div className="space-y-8 md:space-y-12">
                 <h6 className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] md:tracking-[0.6em] text-white/20 uppercase tracking-widest">Ecosystem</h6>
                 <ul className="space-y-6 md:space-y-8 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-text-muted">
                    <li><a href="/docs" className="hover:text-white transition-all hover:translate-x-1 inline-block">Documentation</a></li>
                    <li><a href="https://github.com/Juniorj87/walblob" target="_blank" rel="noreferrer" className="hover:text-white transition-all hover:translate-x-1 inline-block">GitHub / Source</a></li>
                    <li><a href="/status" className="hover:text-white transition-all hover:translate-x-1 inline-block">Network Status</a></li>
                 </ul>
              </div>

              <div className="space-y-8 md:space-y-12">
                 <h6 className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] md:tracking-[0.6em] text-white/20 uppercase tracking-widest">Community</h6>
                 <ul className="space-y-6 md:space-y-8 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-text-muted">
                    <li><a href="https://x.com/Soulpureaux" target="_blank" rel="noreferrer" className="hover:text-white transition-all hover:translate-x-1 inline-block">Twitter / X</a></li>
                    <li><a href="/privacy" className="hover:text-white transition-all hover:translate-x-1 inline-block">Privacy</a></li>
                 </ul>
              </div>
           </div>
           
           <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:gap-14 pt-16 md:pt-20 border-t border-white/5">
              <p className="text-[10px] md:text-[11px] font-black text-white/10 uppercase tracking-[0.6em] md:tracking-[0.8em] text-center md:text-left">© 2026 WALBLOB · BUILT ON SUI & WALRUS</p>
              <div className="flex items-center gap-4 md:gap-6 text-white/20 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] bg-white/5 px-6 py-2.5 md:px-8 md:py-3 rounded-full border border-white/5">
                <Globe className="w-4 h-4 md:w-5 md:h-5" /> Global Distributed Layer
              </div>
           </div>
        </div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />
      </footer>
    </div>
  );
}
