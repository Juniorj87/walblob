export interface WalBlobPackage {
  blobId: string;
  key: string;
  metadata?: {
    name?: string;
    type?: string;
    size?: number;
    uploadedAt?: number;
    hash?: string;
  };
  version: string;
}

export const parseRecoveryPackage = async (file: File): Promise<WalBlobPackage> => {
  if (!file.name.endsWith('.walblob')) {
    throw new Error('Invalid file extension. Please provide a .walblob package.');
  }

  try {
    const text = await file.text();
    const pkg = JSON.parse(text);

    if (!pkg.blobId || !pkg.key) {
      throw new Error('Invalid package format: Missing Blob ID or Key.');
    }

    return {
      blobId: pkg.blobId.trim(),
      key: pkg.key.trim(),
      metadata: pkg.metadata,
      version: pkg.version || 'unknown'
    };
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error('Failed to parse recovery package. The file may be corrupted.', { cause: err });
  }
};
