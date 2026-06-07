import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, UploadCloud,
  Loader2, ShieldCheck, Shield,
  FileText,
  Download, QrCode as QrIcon, Trash2, Plus, Info, ArrowRight,
  Zap,
  Image as ImageIcon,
  Video,
  Copy
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
import { PremiumBackground } from '../animations/PremiumBackground';
import { RecoveryBlock } from './RecoveryBlock';
import { RecoveryGuide } from './RecoveryGuide';
import { Explorer } from './Explorer';
import { CopyButton } from '../ui/CopyButton';
import { FilePreview } from '../ui/FilePreview';
import { calculateHash } from '../../utils/hash';
import { useNetwork } from '../../context/NetworkContext';
import { UploadAnalyticsCard } from '../ui/UploadAnalyticsCard';
import { FeatureGrid } from '../ui/FeatureGrid';
import { ProcessTimeline } from '../ui/ProcessTimeline';
import { VisualSecurityModel } from './VisualSecurityModel';
import { ProductFeatureCards } from './ProductFeatureCards';
import { FAQSection } from './FAQSection';
import { Footer } from '../ui/Footer';

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

const ShowcaseCardMock = () => {
  const MOCK_FILES = [
    { name: 'Whitepaper.pdf', size: '2.4 MB', id: 'blob_8f2a...3c1e', icon: FileText },
    { name: 'Architecture.png', size: '15.8 MB', id: 'blob_4d91...9b02', icon: ImageIcon },
    { name: 'Video.mp4', size: '128.1 MB', id: 'blob_e7c5...f4d1', icon: Video },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[620px] aspect-[550/620] glass-v3 rounded-[40px] premium-shadow overflow-hidden flex flex-col light-sweep border-white/[0.1]"
    >
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <img 
            src="/walblob-logo.png" 
            alt="WalBlob Logo" 
            className="h-8 w-auto object-contain" 
          />
          <span className="text-xl font-display font-bold tracking-tight text-white">WalBlob</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-3 h-3 rounded-full bg-white/5" />
          ))}
        </div>
      </div>

      <div className="p-10 flex-1 space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">Infrastructure</h3>
            <p className="text-lg font-bold text-white">Upload History</p>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest">
            Protocol v3.0
          </div>
        </div>

        <div className="space-y-5">
          {MOCK_FILES.map((file, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              className="flex items-center justify-between p-6 rounded-[28px] bg-white/[0.03] border border-white/5 group hover:bg-white/[0.06] transition-all duration-500"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                  <file.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-base font-bold text-white mb-1">{file.name}</p>
                  <p className="text-[11px] font-medium text-white/20 uppercase tracking-widest">{file.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-mono text-white/10 hidden md:block">{file.id}</span>
                <button className="p-2.5 rounded-xl bg-white/5 text-white/20 hover:text-white transition-all">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-10 bg-black/40 border-t border-white/5 grid grid-cols-2 gap-10">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Total Blobs</p>
          <p className="text-4xl font-display font-bold text-white">24</p>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Network Volume</p>
          <p className="text-4xl font-display font-bold text-white">146.3 <span className="text-base text-white/20 ml-1">MB</span></p>
        </div>
      </div>
    </motion.div>
  );
};

const SectionHeader = ({ children, subtitle, badge, center = true }: { children: React.ReactNode, subtitle?: string, badge?: string, center?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className={cn("mb-20 md:mb-32 space-y-8", center ? "text-center" : "text-left")}
  >
    {badge && (
      <div className={cn("inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.3em] backdrop-blur-xl", center && "mx-auto")}>
        {badge}
      </div>
    )}
    <h2 className="text-4xl md:text-8xl font-display font-bold tracking-tighter text-white leading-[1] max-w-4xl mx-auto">
      {children}
    </h2>
    {subtitle && <p className={cn("text-text-muted text-lg md:text-xl font-medium max-w-2xl leading-relaxed", center && "mx-auto")}>{subtitle}</p>}
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
  const appSectionRef = useRef<HTMLDivElement>(null);
  
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
      const { encryptedBlob, key } = await encryptFile(pending.file, true);
      updateItem(pending.id, { status: 'uploading' });
      uploadStartTimeRef.current = Date.now();
      const encryptedFile = new File([encryptedBlob], pending.file.name, { type: pending.file.type });
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
      version: '3.0.0'
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

  const scrollToApp = () => {
    appSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative min-h-screen bg-background text-white font-sans selection:bg-primary/30">
      <PremiumBackground />
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center pt-24 px-6 overflow-hidden">
        <div className="max-w-[1440px] mx-auto w-full grid lg:grid-cols-2 gap-16 md:gap-32 items-center">
          
          {/* LEFT: CONTENT */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12 relative z-10"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-primary text-[11px] font-bold uppercase tracking-[0.3em] backdrop-blur-3xl shadow-2xl">
              <Lock className="w-4 h-4" /> Secure. Private. Decentralized.
            </div>

            <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tighter leading-[0.95] text-white">
              Secure zero-knowledge <br />
              <span className="text-gradient-v3">encrypted</span> file storage <br />
              powered by <span className="text-gradient-v3">Walrus</span>
            </h1>

            <p className="text-text-muted text-xl md:text-2xl font-medium max-w-2xl leading-relaxed">
              Encrypt your files in your browser before upload. <br />
              Your keys never leave your device. <br />
              <span className="text-white">Store. Share. Recover. With complete privacy.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <button 
                onClick={scrollToApp}
                className="px-12 py-6 rounded-full bg-white text-black font-bold text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)] flex items-center justify-center gap-4 group btn-lift"
              >
                Launch App <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-12 py-6 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center backdrop-blur-xl">
                Learn More
              </button>
            </div>
          </motion.div>

          {/* RIGHT: SHOWCASE */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] aspect-square bg-primary/10 blur-[160px] rounded-full pointer-events-none" />
            <ShowcaseCardMock />
          </div>
        </div>
      </section>

      <main className="max-w-[1440px] mx-auto px-6 space-y-48 md:space-y-80 pb-64 relative z-10">
        
        {/* --- FEATURES SECTION --- */}
        <section id="features">
          <SectionHeader badge="Capabilities">Advanced Infrastructure</SectionHeader>
          <FeatureGrid />
        </section>

        {/* --- HOW IT WORKS SECTION --- */}
        <section id="how-it-works">
          <SectionHeader 
            badge="The Protocol"
            subtitle="Understand the end-to-end journey of your encrypted data, from local selection to decentralized sharding."
          >
            How It Works
          </SectionHeader>
          <ProcessTimeline />
        </section>

        {/* --- UPLOAD AREA (APP CORE) --- */}
        <section ref={appSectionRef} id="app" className="scroll-mt-40">
          <div className="max-w-5xl mx-auto relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-[56px] blur-3xl opacity-40 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative glass-v3 inner-glow rounded-[48px] overflow-hidden p-6 md:p-10">
               <div className="p-4 md:p-10 rounded-[40px] bg-black/40 border border-white/5">
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                    className={cn(
                      "relative group/drop cursor-pointer rounded-[36px] transition-all duration-700",
                      queue.length === 0 && !selectedFiles ? "h-[500px] md:h-[650px] flex flex-col items-center justify-center" : "p-10",
                      "bg-white/[0.01] border-2 border-dashed",
                      isDragging ? "border-primary bg-primary/5 scale-[0.99]" : "border-white/10 hover:border-white/20 hover:bg-white/[0.03]"
                    )}
                  >
                    <input type="file" multiple ref={fileInputRef} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                    
                    {queue.length === 0 && !selectedFiles ? (
                      <div onClick={() => fileInputRef.current?.click()} className="relative z-10 flex flex-col items-center gap-12 text-center w-full max-w-2xl px-10">
                        <motion.div 
                          animate={isDragging ? { scale: 1.1, rotate: 10 } : { scale: 1 }}
                          className="w-32 h-32 md:w-40 md:h-40 bg-primary/10 rounded-[40px] border border-primary/20 flex items-center justify-center shadow-3xl group-hover/drop:border-primary/40 transition-all duration-500 light-sweep"
                        >
                           <UploadCloud className={cn("w-14 h-14 md:w-20 md:h-20 transition-all duration-500", isDragging ? "text-primary" : "text-white/20 group-hover/drop:text-primary")} />
                        </motion.div>
                        <div className="space-y-6">
                           <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight leading-tight">
                             <span className="text-primary">Drag & Drop</span> <br /> to seal your files
                           </h2>
                           <p className="text-text-muted text-lg font-medium opacity-60">High-performance encrypted batch upload system v3.0</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-16">
                        {selectedFiles && (
                           <div className="space-y-12">
                              <div className="flex justify-between items-center px-6">
                                 <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-white/30">Selection Preview</h3>
                                 <button onClick={() => setSelectedFiles(null)} className="text-[11px] font-bold uppercase tracking-widest text-red-400/40 hover:text-red-400 transition-all">Cancel Selection</button>
                              </div>
                              <div className="space-y-6">
                                 {selectedFiles.map((file, i) => (
                                    <FilePreview key={i} file={file} />
                                 ))}
                              </div>

                              <div className="glass-v3 rounded-[40px] border-white/5 p-10 flex flex-col md:flex-row items-center justify-between gap-12">
                                 <div className="space-y-8 text-left w-full md:w-auto">
                                    <div className="flex items-center gap-3">
                                       <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40">Storage Duration</label>
                                       <Info className="w-4 h-4 text-white/10 cursor-help" />
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                       {RETENTION_OPTIONS.map((opt) => (
                                          <button
                                             key={opt.days}
                                             onClick={() => setRetentionDays(opt.days)}
                                             className={cn(
                                                "px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300",
                                                retentionDays === opt.days 
                                                   ? "bg-primary text-white shadow-[0_10px_30px_rgba(79,124,255,0.4)] scale-105" 
                                                   : "bg-white/5 text-white/30 border border-white/5 hover:border-white/10 hover:bg-white/10"
                                             )}
                                          >
                                             {opt.label}
                                          </button>
                                       ))}
                                    </div>
                                 </div>

                                 <button 
                                    onClick={confirmAndUpload}
                                    className="w-full md:w-auto px-16 py-8 rounded-full bg-white text-black font-bold text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.2)] flex items-center justify-center gap-5 btn-lift"
                                 >
                                    <Lock className="w-6 h-6" /> Confirm & Seal
                                 </button>
                              </div>
                           </div>
                        )}

                        {queue.length > 0 && (
                           <div className="space-y-10 pt-12 border-t border-white/5">
                              <div className="flex justify-between items-center px-6">
                                 <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-white/30">Active Protocol Queue</h3>
                                 <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-primary hover:text-white transition-all">
                                    <Plus className="w-4 h-4" /> Add More Blobs
                                 </button>
                              </div>
                              
                              <div className="space-y-5 max-h-[600px] overflow-y-auto custom-scrollbar pr-4">
                                 <AnimatePresence mode="popLayout">
                                    {queue.map((item) => (
                                    <motion.div 
                                       key={item.id}
                                       initial={{ opacity: 0, scale: 0.95 }}
                                       animate={{ opacity: 1, scale: 1 }}
                                       exit={{ opacity: 0, scale: 0.95 }}
                                       className="bg-white/[0.02] rounded-[36px] border border-white/5 p-8 flex flex-col gap-8 group/item hover:bg-white/[0.04] transition-all duration-500"
                                    >
                                       <div className="flex items-center justify-between gap-6">
                                          <div className="flex items-center gap-6 min-w-0">
                                             <div className="w-16 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                                                {item.status === 'success' ? <ShieldCheck className="w-7 h-7 text-emerald-400" /> : <FileText className="w-7 h-7 text-white/10" />}
                                             </div>
                                             <div className="min-w-0 space-y-1">
                                                <p className="text-lg font-bold text-white truncate max-w-[300px] md:max-w-md">{item.file.name}</p>
                                                <p className="text-xs font-bold uppercase tracking-widest text-white/20">{formatSize(item.file.size)} · {item.status}</p>
                                             </div>
                                          </div>
                                          
                                          <div className="flex items-center gap-5">
                                             {(item.status === 'encrypting' || item.status === 'uploading') && (
                                                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                             )}
                                             {item.status === 'success' && (
                                                <div className="flex items-center gap-3">
                                                   <button onClick={() => downloadRecoveryPackage(item)} className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/10 transition-all" title="Download Recovery Package">
                                                      <Download className="w-5 h-5" />
                                                   </button>
                                                   <button onClick={() => setShowQR(item.result?.blobId || null)} className="p-3.5 rounded-2xl bg-white/5 text-white/40 hover:text-white border border-white/5 transition-all">
                                                      <QrIcon className="w-5 h-5" />
                                                   </button>
                                                </div>
                                             )}
                                             <button 
                                                onClick={() => setQueue(prev => prev.filter(i => i.id !== item.id))}
                                                className="p-3.5 rounded-2xl bg-white/5 text-white/10 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover/item:opacity-100"
                                             >
                                                <Trash2 className="w-5 h-5" />
                                             </button>
                                          </div>
                                       </div>

                                       {item.status === 'uploading' && stats && (
                                          <div className="space-y-4 px-2">
                                             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${stats.percentage}%` }} className="h-full bg-primary shadow-[0_0_20px_rgba(79,124,255,0.6)]" />
                                             </div>
                                             <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                                                <span className="flex items-center gap-2"><Zap className="w-3 h-3" /> {stats.speed}</span>
                                                <span>{stats.remaining} remaining</span>
                                             </div>
                                          </div>
                                       )}

                                       {item.status === 'success' && item.analytics && (
                                          <UploadAnalyticsCard 
                                             size={item.analytics.size}
                                             time={item.analytics.time}
                                             speed={item.analytics.speed}
                                             network={item.analytics.network}
                                             className="mt-2 border-white/10 bg-white/[0.01]"
                                          />
                                       )}

                                       {item.result && (
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pt-8 border-t border-white/5">
                                             <div className="bg-black/60 p-5 rounded-2xl border border-white/5 flex justify-between items-center group/sub">
                                                <div className="min-w-0 space-y-1">
                                                   <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Blob Identifier</span>
                                                   <p className="text-[11px] font-mono text-white/40 truncate pr-6">{item.result.blobId}</p>
                                                </div>
                                                <CopyButton text={item.result.blobId} className="bg-white/5 border-none p-2.5 rounded-xl hover:bg-white/10 transition-all" />
                                             </div>
                                             <div className="bg-black/60 p-5 rounded-2xl border border-white/5 flex justify-between items-center group/sub">
                                                <div className="min-w-0 space-y-1">
                                                   <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Decryption Key</span>
                                                   <p className="text-[11px] font-mono text-white/40 truncate pr-6">{item.result.key}</p>
                                                </div>
                                                <CopyButton text={item.result.key} className="bg-white/5 border-none p-2.5 rounded-xl hover:bg-white/10 transition-all" />
                                             </div>
                                          </div>
                                       )}
                                    </motion.div>
                                    ))}
                                 </AnimatePresence>
                              </div>

                              <div className="pt-10 border-t border-white/5 flex justify-between items-center px-6">
                                 <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/20 flex items-center gap-4">
                                    <Shield className="w-5 h-5" /> AES-256 GCM PROTOCOL SEALED
                                 </div>
                                 <button 
                                    onClick={() => setQueue([])}
                                    className="text-[11px] font-bold uppercase tracking-widest text-red-400/30 hover:text-red-400 transition-colors"
                                 >
                                    Flush Active Queue
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
        </section>

        {/* --- SECURITY MODEL --- */}
        <section id="security">
          <SectionHeader badge="Zero-Knowledge">Military Grade Privacy</SectionHeader>
          <VisualSecurityModel />
        </section>

        {/* --- PRODUCT FEATURES --- */}
        <section>
          <SectionHeader 
            badge="Platform"
            subtitle="Deeply integrated tools that prioritize sovereign ownership of your data assets."
          >
            The Ecosystem
          </SectionHeader>
          <ProductFeatureCards />
        </section>

        {/* --- NETWORK EXPLORER --- */}
        <section id="explorer">
          <SectionHeader 
            badge="Infrastructure"
            subtitle="Global real-time visibility into the Walrus network storage layer."
          >
            Network Explorer
          </SectionHeader>
          <Explorer />
        </section>

        {/* --- LOCAL HISTORY --- */}
        <section id="history">
          <SectionHeader 
            badge="Registry"
            subtitle="Stateless browser-side vault for your secure storage record."
          >
            Vault History
          </SectionHeader>
          <UploadHistory />
        </section>

        {/* --- RETRIEVAL & RECOVERY --- */}
        <section id="retrieve">
          <SectionHeader 
            badge="Recovery"
            subtitle="Instantly reconstruct original data from sharded network blobs using your private key."
          >
            Secure Retrieval
          </SectionHeader>
          <RecoveryBlock />
          <div className="mt-32">
            <RecoveryGuide />
          </div>
        </section>

        {/* --- FAQ SECTION --- */}
        <section id="faq">
          <SectionHeader 
            badge="Assurance"
            subtitle="Detailed answers regarding our cryptographic protocol and decentralized storage."
          >
            Security FAQ
          </SectionHeader>
          <FAQSection />
        </section>

      </main>

      {/* QR MODAL */}
      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowQR(null)} className="absolute inset-0 bg-black/90 backdrop-blur-3xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative bg-[#020617] rounded-[56px] border border-white/10 p-12 md:p-20 max-w-lg w-full text-center space-y-12 shadow-3xl">
               <h4 className="text-3xl font-display font-bold text-white tracking-tight leading-tight">Secure Mobile <br /> Transfer Ready</h4>
               <div className="bg-white p-8 rounded-[48px] inline-block shadow-[0_0_80px_rgba(255,255,255,0.15)]">
                  {qrDataUrl && <img src={qrDataUrl} alt="Recovery QR" className="w-[200px] h-[200px]" />}
               </div>
               <div className="space-y-4">
                 <p className="text-text-muted text-base leading-relaxed font-medium">Scan to open recovery on your mobile device.</p>
                 <p className="text-[11px] font-bold uppercase tracking-widest text-primary/60">Keys are not embedded in QR for security</p>
               </div>
               <button onClick={() => setShowQR(null)} className="w-full bg-white/5 border border-white/10 py-7 rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all">Close Secure Modal</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
