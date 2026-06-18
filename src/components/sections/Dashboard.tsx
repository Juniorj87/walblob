import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, UploadCloud,
  Loader2, ShieldCheck, Shield,
  FileText,
  Download, QrCode as QrIcon, Trash2, Plus, ArrowRight,
  Zap,
  Image as ImageIcon,
  Video,
  Copy,
  Terminal
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { useWalrus } from '../../hooks/useWalrus';
import { useWalrusTransaction } from '../../hooks/useWalrusTransaction';
import { useSeal } from '../../hooks/useSeal';
import { packFileWithMetadata } from '../../utils/metadata';
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
import { FeeConfirmationModal } from '../ui/FeeConfirmationModal';
import { type FeeBreakdown, type PaymentToken } from '../../utils/fees';

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
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[480px] terminal-window rounded-xl overflow-hidden"
    >
      {/* Terminal Header */}
      <div className="terminal-header px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="terminal-dot bg-secondary/80" />
          <div className="terminal-dot bg-accent/80" />
          <div className="terminal-dot bg-primary/80" />
        </div>
        <span className="text-[10px] font-mono text-text-muted">walblob-dashboard</span>
        <div className="w-16" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Command */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted">
          <span className="text-primary">$</span>
          <span className="text-accent">walblob</span>
          <span>status --verbose</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-white/[0.02] border border-border-subtle">
            <div className="text-[9px] font-mono text-text-muted uppercase tracking-wider mb-1">Total Blobs</div>
            <p className="text-2xl font-display font-bold text-white">24</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-border-subtle">
            <div className="text-[9px] font-mono text-text-muted uppercase tracking-wider mb-1">Volume</div>
            <p className="text-2xl font-display font-bold text-white">146.3 <span className="text-sm text-text-muted">MB</span></p>
          </div>
        </div>

        {/* File List */}
        <div className="space-y-2">
          {MOCK_FILES.map((file, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-border-subtle group hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <file.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{file.name}</p>
                  <p className="text-[9px] font-mono text-text-muted">{file.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-text-muted hidden md:block">{file.id}</span>
                <button className="p-1.5 rounded-md bg-background text-text-muted hover:text-white transition-all">
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SectionHeader = ({ children, subtitle, badge, center = true }: { children: React.ReactNode, subtitle?: string, badge?: string, center?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={cn("mb-12 md:mb-16 space-y-4", center ? "text-center" : "text-left")}
  >
    {badge && (
      <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-primary text-[10px] font-mono uppercase tracking-wider", center && "mx-auto")}>
        <Terminal className="w-3 h-3" />
        {badge}
      </div>
    )}
    <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-white leading-tight max-w-3xl mx-auto">
      {children}
    </h2>
    {subtitle && <p className={cn("text-text-muted text-sm md:text-base font-medium max-w-xl leading-relaxed", center && "mx-auto")}>{subtitle}</p>}
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

  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [currentFees, setCurrentFees] = useState<FeeBreakdown | null>(null);
  const [pendingFileName, setPendingFileName] = useState('');
  const [pendingTotalSize, setPendingTotalSize] = useState(0);
  const [txError, setTxError] = useState<string | null>(null);
  const [paymentToken, setPaymentToken] = useState<PaymentToken>('SUI');

  const { network } = useNetwork();
  const { getFees, executeStoragePayment, isConnected } = useWalrusTransaction();
  const { encrypt: sealEncrypt } = useSeal();

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
      const fileHash = await calculateHash(pending.file);
      const blobId = fileHash;

      const dataToEncrypt = await packFileWithMetadata(pending.file, fileHash);
      const { encryptedBytes } = await sealEncrypt(blobId, new Uint8Array(dataToEncrypt));

      updateItem(pending.id, { status: 'uploading' });
      uploadStartTimeRef.current = Date.now();
      const encryptedFile = new File([new Uint8Array(encryptedBytes)], pending.file.name, { type: 'application/octet-stream' });
      const epochs = Math.max(1, Math.ceil(retentionDays / 30));
      const result = await publishBlob(encryptedFile, epochs);

      if (result) {
        const finalResult = { blobId: result.blobId, key: '', url: result.url };
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
  }, [queue, publishBlob, retentionDays, updateItem, stats, network, sealEncrypt]);

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

    if (network === 'mainnet') {
      const totalSize = selectedFiles.reduce((acc, f) => acc + f.size, 0);
      const firstFileName = selectedFiles.length === 1
        ? selectedFiles[0].name
        : `${selectedFiles.length} files (${formatSize(totalSize)})`;
      const epochs = Math.max(1, Math.ceil(retentionDays / 30));
      const fees = getFees(totalSize, epochs);

      setCurrentFees(fees);
      setPendingFileName(firstFileName);
      setPendingTotalSize(totalSize);
      setTxError(null);
      setFeeModalOpen(true);
      return;
    }

    const newItems: UploadQueueItem[] = selectedFiles.map(f => ({
      id: Math.random().toString(36).slice(2, 11),
      file: f,
      status: 'pending',
      progress: 0
    }));
    setQueue(prev => [...prev, ...newItems]);
    setSelectedFiles(null);
  };

  const handleFeeConfirmed = async () => {
    if (!selectedFiles || !currentFees) return;

    try {
      await executeStoragePayment(pendingTotalSize, currentFees.epochs, paymentToken);

      const newItems: UploadQueueItem[] = selectedFiles.map(f => ({
        id: Math.random().toString(36).slice(2, 11),
        file: f,
        status: 'pending',
        progress: 0
      }));
      setQueue(prev => [...prev, ...newItems]);
      setSelectedFiles(null);
      setFeeModalOpen(false);
      setCurrentFees(null);
      setTxError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setTxError(errorMessage);
    }
  };

  const handleFeeCancelled = () => {
    setFeeModalOpen(false);
    setCurrentFees(null);
    setTxError(null);
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
    <div className="relative min-h-screen bg-background text-white font-sans">
      <PremiumBackground />
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center pt-20 px-4 md:px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT: CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 relative z-10"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-primary text-[10px] font-mono uppercase tracking-wider">
              <Lock className="w-3 h-3" /> Zero-Knowledge Storage
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight leading-[1.1] text-white">
              Encrypt. Store.{' '}
              <span className="text-gradient-terminal">Recover.</span>
              <br />
              <span className="text-text-muted text-3xl md:text-5xl">With zero trust required.</span>
            </h1>

            {/* Description */}
            <p className="text-text-muted text-sm md:text-base font-medium max-w-lg leading-relaxed">
              Client-side AES-256 encryption. Decentralized Walrus storage.
              Your keys never leave your browser. Period.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={scrollToApp}
                className="px-8 py-3 rounded-lg bg-primary text-black font-bold text-xs uppercase tracking-wider hover:bg-accent active:scale-95 transition-all flex items-center justify-center gap-2 btn-terminal"
              >
                Launch App <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-8 py-3 rounded-lg bg-white/5 border border-border-subtle text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all">
                Learn More
              </button>
            </div>
          </motion.div>

          {/* RIGHT: SHOWCASE */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
            <ShowcaseCardMock />
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 md:px-6 space-y-24 md:space-y-32 pb-32 relative z-10">

        {/* --- FEATURES SECTION --- */}
        <section id="features">
          <SectionHeader badge="Capabilities">Core Infrastructure</SectionHeader>
          <FeatureGrid />
        </section>

        {/* --- HOW IT WORKS SECTION --- */}
        <section id="how-it-works">
          <SectionHeader
            badge="Protocol"
            subtitle="The end-to-end journey of your encrypted data, from local selection to decentralized storage."
          >
            How It Works
          </SectionHeader>
          <ProcessTimeline />
        </section>

        {/* --- UPLOAD AREA (APP CORE) --- */}
        <section ref={appSectionRef} id="app" className="scroll-mt-24">
          <div className="max-w-4xl mx-auto">
            <div className="terminal-window rounded-xl overflow-hidden">
              {/* Terminal Header */}
              <div className="terminal-header px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="terminal-dot bg-secondary/80" />
                  <div className="terminal-dot bg-accent/80" />
                  <div className="terminal-dot bg-primary/80" />
                </div>
                <div className="text-[10px] font-mono text-text-muted">walblob upload</div>
                <div className="w-16" />
              </div>

              {/* Terminal Body */}
              <div className="p-4 md:p-6">
                {/* Command Header */}
                <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted mb-4">
                  <span className="text-primary">$</span>
                  <span className="text-accent">walblob</span>
                  <span>upload --encrypt --batch --retention={retentionDays}d</span>
                </div>

                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                  className={cn(
                    "rounded-lg transition-all duration-300",
                    queue.length === 0 && !selectedFiles
                      ? "min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-border-subtle hover:border-primary/30 bg-white/[0.01]"
                      : "bg-white/[0.02] border border-border-subtle p-4",
                    isDragging && "border-primary bg-primary/5 scale-[0.99]"
                  )}
                >
                  <input type="file" multiple ref={fileInputRef} className="hidden" onChange={(e) => handleFiles(e.target.files)} />

                  {queue.length === 0 && !selectedFiles ? (
                    <div onClick={() => fileInputRef.current?.click()} className="text-center space-y-4 p-6">
                      <motion.div
                        animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1 }}
                        className="w-16 h-16 mx-auto bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center"
                      >
                        <UploadCloud className={cn("w-8 h-8 transition-all", isDragging ? "text-primary" : "text-text-muted")} />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-display font-bold text-white mb-1">
                          <span className="text-primary">Drag & Drop</span> files here
                        </h3>
                        <p className="text-xs text-text-muted">or click to select files</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Selection Preview */}
                      {selectedFiles && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h3 className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Selection</h3>
                            <button onClick={() => setSelectedFiles(null)} className="text-[9px] font-mono text-secondary hover:text-secondary/80 uppercase">
                              [cancel]
                            </button>
                          </div>
                          <div className="space-y-2">
                            {selectedFiles.map((file, i) => (
                              <FilePreview key={i} file={file} />
                            ))}
                          </div>

                          {/* Retention & Confirm */}
                          <div className="p-4 rounded-lg bg-white/[0.02] border border-border-subtle space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider mr-2">Retention:</span>
                              {RETENTION_OPTIONS.map((opt) => (
                                <button
                                  key={opt.days}
                                  onClick={() => setRetentionDays(opt.days)}
                                  className={cn(
                                    "px-3 py-1.5 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all",
                                    retentionDays === opt.days
                                      ? "bg-primary text-black font-bold"
                                      : "bg-background border border-border-subtle text-text-muted hover:text-white"
                                  )}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={confirmAndUpload}
                              className="w-full bg-primary text-black py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-accent active:scale-95 transition-all flex items-center justify-center gap-2 btn-terminal"
                            >
                              <Lock className="w-4 h-4" /> Confirm & Seal
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Upload Queue */}
                      {queue.length > 0 && (
                        <div className="space-y-3 pt-3 border-t border-border-subtle">
                          <div className="flex justify-between items-center">
                            <h3 className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Queue</h3>
                            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 text-[9px] font-mono text-primary hover:text-accent uppercase">
                              <Plus className="w-3 h-3" /> Add More
                            </button>
                          </div>

                          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                            <AnimatePresence mode="popLayout">
                              {queue.map((item) => (
                                <motion.div
                                  key={item.id}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  className="bg-white/[0.02] rounded-lg border border-border-subtle p-3 group/item hover:border-primary/20 transition-all"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="w-8 h-8 rounded-md bg-background border border-border-subtle flex items-center justify-center shrink-0">
                                        {item.status === 'success' ? <ShieldCheck className="w-4 h-4 text-success" /> : <FileText className="w-4 h-4 text-text-muted" />}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-xs font-bold text-white truncate max-w-[200px]">{item.file.name}</p>
                                        <p className="text-[9px] font-mono text-text-muted">{formatSize(item.file.size)} · {item.status}</p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      {(item.status === 'encrypting' || item.status === 'uploading') && (
                                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                      )}
                                      {item.status === 'success' && (
                                        <>
                                          <button onClick={() => downloadRecoveryPackage(item)} className="p-1.5 rounded-md bg-success/10 text-success hover:bg-success/20 transition-all" title="Download Recovery Package">
                                            <Download className="w-3.5 h-3.5" />
                                          </button>
                                          <button onClick={() => setShowQR(item.result?.blobId || null)} className="p-1.5 rounded-md bg-background text-text-muted hover:text-white border border-border-subtle transition-all">
                                            <QrIcon className="w-3.5 h-3.5" />
                                          </button>
                                        </>
                                      )}
                                      <button
                                        onClick={() => setQueue(prev => prev.filter(i => i.id !== item.id))}
                                        className="p-1.5 rounded-md bg-background text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all opacity-0 group-hover/item:opacity-100"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Progress */}
                                  {item.status === 'uploading' && stats && (
                                    <div className="mt-3 space-y-1">
                                      <div className="h-1 w-full bg-background rounded-full overflow-hidden border border-border-subtle">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${stats.percentage}%` }} className="h-full bg-primary" />
                                      </div>
                                      <div className="flex justify-between text-[8px] font-mono text-text-muted uppercase">
                                        <span className="flex items-center gap-1"><Zap className="w-2.5 h-2.5" /> {stats.speed}</span>
                                        <span>{stats.remaining}</span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Analytics */}
                                  {item.status === 'success' && item.analytics && (
                                    <div className="mt-3">
                                      <UploadAnalyticsCard
                                        size={item.analytics.size}
                                        time={item.analytics.time}
                                        speed={item.analytics.speed}
                                        network={item.analytics.network}
                                      />
                                    </div>
                                  )}

                                  {/* Blob ID & Key */}
                                  {item.result && (
                                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border-subtle">
                                      <div className="p-2 rounded bg-background border border-border-subtle flex justify-between items-center">
                                        <div className="min-w-0">
                                          <span className="text-[8px] font-mono text-text-muted uppercase block">Blob ID</span>
                                          <p className="text-[9px] font-mono text-white/80 truncate pr-2">{item.result.blobId}</p>
                                        </div>
                                        <CopyButton text={item.result.blobId} className="bg-transparent border-none p-1" />
                                      </div>
                                      <div className="p-2 rounded bg-background border border-border-subtle flex justify-between items-center">
                                        <div className="min-w-0">
                                          <span className="text-[8px] font-mono text-text-muted uppercase block">Key</span>
                                          <p className="text-[9px] font-mono text-white/80 truncate pr-2">{item.result.key}</p>
                                        </div>
                                        <CopyButton text={item.result.key} className="bg-transparent border-none p-1" />
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>

                          {/* Queue Footer */}
                          <div className="pt-3 border-t border-border-subtle flex justify-between items-center">
                            <div className="text-[9px] font-mono text-text-muted flex items-center gap-2">
                              <Shield className="w-3 h-3" /> AES-256 GCM
                            </div>
                            <button
                              onClick={() => setQueue([])}
                              className="text-[9px] font-mono text-secondary/50 hover:text-secondary uppercase"
                            >
                              [clear]
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
          <SectionHeader badge="Security">Zero-Knowledge Architecture</SectionHeader>
          <VisualSecurityModel />
        </section>

        {/* --- PRODUCT FEATURES --- */}
        <section>
          <SectionHeader
            badge="Platform"
            subtitle="Integrated tools for sovereign data ownership."
          >
            The Ecosystem
          </SectionHeader>
          <ProductFeatureCards />
        </section>

        {/* --- NETWORK EXPLORER --- */}
        <section id="explorer">
          <SectionHeader
            badge="Infrastructure"
            subtitle="Real-time visibility into the Walrus network storage layer."
          >
            Network Explorer
          </SectionHeader>
          <Explorer />
        </section>

        {/* --- LOCAL HISTORY --- */}
        <section id="history">
          <SectionHeader
            badge="Registry"
            subtitle="Browser-side vault for your encrypted upload history."
          >
            Vault History
          </SectionHeader>
          <UploadHistory />
        </section>

        {/* --- RETRIEVAL & RECOVERY --- */}
        <section id="retrieve">
          <SectionHeader
            badge="Recovery"
            subtitle="Reconstruct original data from Walrus blobs using your private key."
          >
            Secure Retrieval
          </SectionHeader>
          <RecoveryBlock />
          <div className="mt-16">
            <RecoveryGuide />
          </div>
        </section>

        {/* --- FAQ SECTION --- */}
        <section id="faq">
          <SectionHeader
            badge="Knowledge Base"
            subtitle="Answers about our cryptographic protocol and decentralized storage."
          >
            Security FAQ
          </SectionHeader>
          <FAQSection />
        </section>

      </main>

      {/* QR MODAL */}
      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowQR(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative terminal-window rounded-xl p-8 max-w-sm w-full text-center space-y-6">
              {/* Header */}
              <div className="flex items-center justify-center gap-2">
                <QrIcon className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-display font-bold text-white uppercase tracking-wider">Mobile Transfer</h4>
              </div>

              {/* QR Code */}
              <div className="bg-white p-4 rounded-lg inline-block">
                {qrDataUrl && <img src={qrDataUrl} alt="Recovery QR" className="w-[160px] h-[160px]" />}
              </div>

              {/* Info */}
              <div className="space-y-2">
                <p className="text-xs text-text-muted">Scan to open recovery on your mobile device.</p>
                <p className="text-[9px] font-mono text-primary/60 uppercase">Keys are not embedded in QR</p>
              </div>

              {/* Close */}
              <button onClick={() => setShowQR(null)} className="w-full bg-white/5 border border-border-subtle py-2.5 rounded-lg font-bold text-[10px] font-mono uppercase tracking-wider hover:bg-white/10 transition-all">
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FEE CONFIRMATION MODAL */}
      <FeeConfirmationModal
        isOpen={feeModalOpen}
        fees={currentFees}
        fileName={pendingFileName}
        isProcessing={false}
        error={txError}
        isWalletConnected={isConnected}
        paymentToken={paymentToken}
        onTokenChange={setPaymentToken}
        onConfirm={handleFeeConfirmed}
        onCancel={handleFeeCancelled}
      />

      <Footer />
    </div>
  );
}
