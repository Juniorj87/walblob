import { useState, useCallback } from 'react';

// Walrus Network Endpoints
const PUBLISHER_URL = import.meta.env.VITE_WALRUS_PUBLISHER_URL || 'https://publisher.walrus-testnet.walrus.space';
const AGGREGATOR_URL = import.meta.env.VITE_WALRUS_AGGREGATOR_URL || 'https://aggregator.walrus-testnet.walrus.space';

interface UploadStats {
  percentage: number;
  speed: string;
  size: string;
  remaining: string;
}

interface WalrusResponse {
  newlyCreated?: {
    blobObject: {
      blobId: string;
    };
  };
  alreadyCertified?: {
    blobId: string;
  };
  newBlob?: {
    blobId: string;
  };
  blobId?: string;
}

export function useWalrus() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stats, setStats] = useState<UploadStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const executeUpload = useCallback((url: string, file: File, epochs: number): Promise<WalrusResponse> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const startTime = Date.now();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentage = Math.round((e.loaded / e.total) * 100);
          const elapsedSeconds = (Date.now() - startTime) / 1000;
          const bytesPerSecond = e.loaded / (elapsedSeconds || 0.1);
          const remainingBytes = e.total - e.loaded;
          const remainingSeconds = remainingBytes / (bytesPerSecond || 1);

          setUploadProgress(percentage);
          setStats({
            percentage,
            speed: `${formatSize(bytesPerSecond)}/s`,
            size: formatSize(e.total),
            remaining: remainingSeconds > 60 
              ? `${Math.round(remainingSeconds / 60)}m` 
              : `${Math.round(remainingSeconds)}s`
          });
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            reject(new Error('Invalid response format from server'));
          }
        } else {
          reject({ status: xhr.status, text: xhr.responseText });
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Network failure')));
      xhr.addEventListener('timeout', () => reject(new Error('Request timed out')));

      xhr.open('PUT', `${url}?epochs=${epochs}`);
      xhr.timeout = 120000; // 120s timeout for large blobs
      xhr.send(file);
    });
  }, []);

  const publishBlob = async (file: File, epochs: number = 1) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    const endpoints = [
      `${PUBLISHER_URL}/v1/blobs`,
      `${PUBLISHER_URL}/v1/store` // Fallback endpoint
    ];

    let lastError = '';
    
    for (const endpoint of endpoints) {
      try {
        if (import.meta.env.DEV) console.log(`Walrus: Attempting upload to ${endpoint}`);
        const result = await executeUpload(endpoint, file, epochs);

        const blobId = 
          result.newlyCreated?.blobObject?.blobId || 
          result.alreadyCertified?.blobId || 
          result.newBlob?.blobId || 
          result.blobId;

        if (!blobId) throw new Error('Response missing Blob ID');

        setIsUploading(false);
        setUploadProgress(100);
        return { blobId, url: `${AGGREGATOR_URL}/v1/blobs/${blobId}` };

      } catch (err) {
        const error = err as { status?: number; text?: string; message?: string };
        lastError = error.status ? `Node error ${error.status}: ${error.text}` : (error.message || 'Unknown error');
        if (error.status !== 404) {
           // If it's not a 404, it might be a real network error, let's wait a bit and retry the same loop
           await new Promise(r => setTimeout(r, 1000));
        }
        if (import.meta.env.DEV) console.warn(`Walrus: Endpoint ${endpoint} failed:`, lastError);
      }
    }

    setError(`Upload failed after trying all endpoints: ${lastError}`);
    setIsUploading(false);
    throw new Error(lastError);
  };

  return { publishBlob, isUploading, uploadProgress, stats, error };
}
