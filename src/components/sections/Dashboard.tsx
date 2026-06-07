import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Share2, Lock, UploadCloud, Zap, HelpCircle, 
  Loader2, ShieldCheck,
  Globe, Shield, Fingerprint, ZapIcon, FileText,
  Download, QrCode as QrIcon, Trash2, Plus, Info
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
import { Explorer } from './Explorer';
import { CopyButton } from '../ui/CopyButton';
import { FilePreview } from '../ui/FilePreview';
import { calculateHash } from '../../utils/hash';
import { useNetwork } from '../../context/NetworkContext';
import { UploadAnalyticsCard } from '../ui/UploadAnalyticsCard';
import { SecurityModelSection } from './SecurityModelSection';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const RETENTION_OPTIONS = [
  { label: '14 Days', days: 14 },
  { label: '30 Days', days: 30 },
  { label: '90 Days', days: 90 },
  { label: '180 Days', days: 180 },
];

interface UploadQueueItem {
  id: string;
  file: File;
  status: 'pending' | 'encrypting' | 'uploading' | 'success' | 'error';
  progress: number;
  result?: { blobId: string; key: string; url: string };
  analytics?: {
    size: string;
    time: string;
    speed: string;
    network: string;
  };
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

export default function Dashboard() {
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [retentionDays, setRetentionDays] = useState(30);
  const [showQR, setShowQR] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadStartTimeRef = useRef<number>(0);
  
  const { network } = useNetwork();

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

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processQueue = useCallback(async () => {
    const pending = queue.find(item => item.status === 'pending');
    if (!pending) return;

    updateItem(pending.id, { status: 'encrypting' });

    try {
      // 1. Encrypt with Metadata
      const { encryptedBlob, key } = await encryptFile(pending.file, true);
      
      // 2. Upload
      updateItem(pending.id, { status: 'uploading' });
      uploadStartTimeRef.current = Date.now();
      
      const encryptedFile = new File([encryptedBlob], pending.file.name, { type: pending.file.type });
      
      // Internal conversion: 30 days = 1 epoch
      const epochs = Math.max(1, Math.ceil(retentionDays / 30));
      const result = await publishBlob(encryptedFile, epochs);

      if (result) {
        const finalResult = { ...result, key };
        const duration = (Date.now() - uploadStartTimeRef.current) / 1000;
        
        updateItem(pending.id, { 
          status: 'success', 
          result: finalResult, 
          progress: 100,
          analytics: {
            size: formatSize(pending.file.size),
            time: duration > 60 ? `${(duration / 60).toFixed(1)}m` : `${duration.toFixed(1)}s`,
            speed: stats?.speed || 'Fast',
            network: network.toUpperCase()
          }
        });
        
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
  }, [queue, publishBlob, retentionDays, updateItem, stats, network]);

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

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setSelectedFiles(Array.from(files));
  };

  const confirmAndUpload = () => {
    if (!selectedFiles) return;
    const newItems: UploadQueueItem[] = selectedFiles.map(f => ({
      id: Math.random().toString(36).slice(2, 11),
      file: f,
      status: 'pending',
      progress: 0
    }));
    setQueue(prev => [...prev, ...newItems]);
    setSelectedFiles(null);
  };

  const downloadRecoveryPackage = async (item: UploadQueueItem) => {
    if (!item.result) return;
    
    // Calculate hash of original file for the package (P8)
    const fileHash = await calculateHash(item.file);
    
    const nowTimestamp = new Date().getTime();
    const pkg = {
      blobId: item.result.blobId,
      key: item.result.key,
      metadata: {
        name: item.file.name,
        type: item.file.type,
        size: item.file.size,
        uploadedAt: nowTimestamp,
        hash: fileHash
      },
      version: '2.2.0'
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
                      queue.length === 0 && !selectedFiles ? "h-[450px] md:h-[550px] flex flex-col items-center justify-center" : "p-8",
                      "bg-[#0D1121]/50 border-2 border-dashed",
                      isDragging ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20 hover:bg-[#0D1121]/80"
                    )}
                  >
                    <input type="file" multiple ref={fileInputRef} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                    
                    {queue.length === 0 && !selectedFiles ? (
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
                      <div className="space-y-10">
                        {selectedFiles && (
                           <div className="space-y-8">
                              <div className="flex justify-between items-center px-4">
                                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Selection Preview</h3>
                                 <button onClick={() => setSelectedFiles(null)} className="text-[10px] font-black uppercase tracking-widest text-red-400/40 hover:text-red-400 transition-colors">Cancel</button>
                              </div>
                              <div className="space-y-4">
                                 {selectedFiles.map((file, i) => (
                                    <FilePreview key={i} file={file} />
                                 ))}
                              </div>

                              <div className="bg-black/40 rounded-3xl border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                                 <div className="space-y-4 text-left w-full md:w-auto">
                                    <div className="flex items-center gap-3">
                                       <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Storage Duration</label>
                                       <div className="group relative">
                                          <Info className="w-3.5 h-3.5 text-white/20 cursor-help" />
                                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-black border border-white/10 rounded-xl text-[8px] font-bold text-white/60 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                             Longer storage duration increases blob availability across the Walrus network.
                                          </div>
                                       </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                       {RETENTION_OPTIONS.map((opt) => (
                                          <button
                                             key={opt.days}
                                             onClick={() => setRetentionDays(opt.days)}
                                             className={cn(
                                                "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                retentionDays === opt.days 
                                                   ? "bg-primary text-black" 
                                                   : "bg-white/5 text-white/40 border border-white/5 hover:border-white/10"
                                             )}
                                          >
                                             {opt.label}
                                          </button>
                                       ))}
                                    </div>
                                 </div>

                                 <button 
                                    onClick={confirmAndUpload}
                                    className="w-full md:w-auto px-12 py-6 rounded-pill bg-white text-black font-black text-[12px] uppercase tracking-[0.4em] hover:scale-[1.05] active:scale-[0.95] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4"
                                 >
                                    <Lock className="w-5 h-5" /> Confirm & Seal
                                 </button>
                              </div>
                           </div>
                        )}

                        {queue.length > 0 && (
                           <div className="space-y-6 pt-10 border-t border-white/5">
                              <div className="flex justify-between items-center px-4">
                                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Upload Queue</h3>
                                 <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">
                                    <Plus className="w-4 h-4" /> Add More
                                 </button>
                              </div>
                              
                              <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
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

                                       {item.status === 'success' && item.analytics && (
                                          <UploadAnalyticsCard 
                                             size={item.analytics.size}
                                             time={item.analytics.time}
                                             speed={item.analytics.speed}
                                             network={item.analytics.network}
                                             className="mt-2"
                                          />
                                       )}

                                       {item.result && (
                                          <div className="grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-white/5">
                                             <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex justify-between items-center group/sub">
                                                <p className="text-[8px] font-mono text-white/20 truncate pr-2">{item.result.blobId}</p>
                                                <CopyButton text={item.result.blobId} className="bg-transparent border-none p-1" />
                                             </div>
                                             <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex justify-between items-center group/sub">
                                                <p className="text-[8px] font-mono text-white/20 truncate pr-2">{item.result.key}</p>
                                                <CopyButton text={item.result.key} className="bg-transparent border-none p-1" />
                                             </div>
                                          </div>
                                       )}
                                    </motion.div>
                                    ))}
                                 </AnimatePresence>
                              </div>

                              <div className="pt-6 border-t border-white/5 flex justify-between items-center px-4">
                                 <div className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
                                    <Shield className="w-3.5 h-3.5" /> AES-256 GCM
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
        
        <UploadHistory />

        <Explorer />

        <RecoveryBlock />

        <RecoveryGuide />

        <SecurityModelSection />

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
               { q: 'How secure is WalBlob?', a: 'Your file is encrypted locally in your browser using AES-256 GCM before it ever leaves your device. We never see your content, passwords, or encryption keys. The security is mathematically guaranteed by client-side cryptography.' },
               { q: 'What is the "Walrus" network?', a: 'Walrus is a decentralized storage protocol from Mysten Labs. It fragments your encrypted data and distributes it across a global network of independent nodes, ensuring your data is always available and resistant to censorship.' },
               { q: 'How do I recover my files?', a: 'You must save the Blob ID and Decryption Key provided after upload. We recommend downloading the .walblob recovery package. Without these two pieces of information, your data is permanently inaccessible even to us.' },
               { q: 'Can I delete my files?', a: 'Files on Walrus are stored for the duration you selected (retention period). Once that period expires, the network shards are no longer guaranteed to be stored by nodes. WalBlob does not currently support manual deletion due to the immutable nature of the shards.' },
               { q: 'Is there a file size limit?', a: 'WalBlob supports files up to 2GB in the current v2.2-Stable release. Larger files may require longer processing times for client-side encryption and network sharding.' },
               { q: 'What happens if WalBlob goes down?', a: 'WalBlob is just an interface. Since your data is on the decentralized Walrus network and you have your decryption key, you can use any other Walrus explorer or utility to recover your data.' }
             ].map((item, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, y: 0 }}
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
                   <div className="flex flex-col">
                      <span className="text-2xl md:text-3xl font-display font-black tracking-tighter uppercase text-white tracking-[0.2em]">WalBlob</span>
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-1">Version 2.2.0-Stable</span>
                   </div>
                 </div>
                 <p className="text-white/30 text-xl md:text-2xl font-light max-w-sm leading-relaxed italic">
                   "Redefining data sovereignty in the decentralized era."
                 </p>
              </div>
              
              <div className="space-y-8 md:space-y-12">
                 <h6 className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] md:tracking-[0.6em] text-white/20 uppercase tracking-widest">Protocol</h6>
                 <ul className="space-y-6 md:space-y-8 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-text-muted">
                    <li><a href="/docs" className="hover:text-white transition-all hover:translate-x-1 inline-block">Technical Docs</a></li>
                    <li><a href="https://github.com/Juniorj87/walblob" target="_blank" rel="noreferrer" className="hover:text-white transition-all hover:translate-x-1 inline-block">Source Code</a></li>
                    <li><a href="/status" className="hover:text-white transition-all hover:translate-x-1 inline-block">Network Health</a></li>
                    <li><a href="https://walrus.xyz" target="_blank" rel="noreferrer" className="hover:text-white transition-all hover:translate-x-1 inline-block text-primary">About Walrus</a></li>
                 </ul>
              </div>

              <div className="space-y-8 md:space-y-12">
                 <h6 className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] md:tracking-[0.6em] text-white/20 uppercase tracking-widest">Connect</h6>
                 <ul className="space-y-6 md:space-y-8 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-text-muted">
                    <li><a href="https://x.com/Soulpureaux" target="_blank" rel="noreferrer" className="hover:text-white transition-all hover:translate-x-1 inline-block">Twitter / X</a></li>
                    <li><a href="/privacy" className="hover:text-white transition-all hover:translate-x-1 inline-block">Privacy Policy</a></li>
                    <li><a href="/retrieve" className="hover:text-white transition-all hover:translate-x-1 inline-block">Retrieve Files</a></li>
                 </ul>
              </div>
           </div>
           
           <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:gap-14 pt-16 md:pt-20 border-t border-white/5">
              <p className="text-[10px] md:text-[11px] font-black text-white/10 uppercase tracking-[0.6em] md:tracking-[0.8em] text-center md:text-left">© 2026 WALBLOB · POWERED BY MYSTEN LABS WALRUS</p>
              <div className="flex items-center gap-4 md:gap-6 text-white/20 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] bg-white/5 px-6 py-2.5 md:px-8 md:py-3 rounded-full border border-white/5">
                <Globe className="w-4 h-4 md:w-5 md:h-5" /> Distributed Storage Protocol
              </div>
           </div>
        </div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />
      </footer>
    </div>
  );
}
