/**
 * WALBLOB METADATA PROTOCOL V2.2
 * 
 * Format: [HEADER: 12 bytes][JSON_LEN: 4 bytes][JSON_METADATA][FILE_DATA]
 * Header: 'WALBLOB-V2.2'
 */

export interface FileMetadata {
  name: string;
  type: string;
  size: number;
  uploadedAt: number;
  version: string;
  hash?: string; // SHA-256 of the original file
}

const HEADER_V21 = 'WALBLOB-V2.1';
const HEADER_V22 = 'WALBLOB-V2.2';
const CURRENT_HEADER = HEADER_V22;
const CURRENT_VERSION = '2.2.0';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function packFileWithMetadata(file: File, fileHash?: string): Promise<ArrayBuffer> {
  const metadata: FileMetadata = {
    name: file.name,
    type: file.type,
    size: file.size,
    uploadedAt: Date.now(),
    version: CURRENT_VERSION,
    hash: fileHash
  };

  const metadataJson = JSON.stringify(metadata);
  const metadataBuffer = encoder.encode(metadataJson);
  const fileBuffer = await file.arrayBuffer();

  const headerBuffer = encoder.encode(CURRENT_HEADER); // 12 bytes
  const lenBuffer = new ArrayBuffer(4);
  new DataView(lenBuffer).setUint32(0, metadataBuffer.byteLength, false); // Big-endian

  const totalBuffer = new Uint8Array(
    headerBuffer.byteLength + 
    lenBuffer.byteLength + 
    metadataBuffer.byteLength + 
    fileBuffer.byteLength
  );

  let offset = 0;
  totalBuffer.set(headerBuffer, offset); offset += headerBuffer.byteLength;
  totalBuffer.set(new Uint8Array(lenBuffer), offset); offset += lenBuffer.byteLength;
  totalBuffer.set(metadataBuffer, offset); offset += metadataBuffer.byteLength;
  totalBuffer.set(new Uint8Array(fileBuffer), offset);

  return totalBuffer.buffer;
}

export function unpackFileWithMetadata(combinedBuffer: ArrayBuffer): { metadata: FileMetadata; data: ArrayBuffer } | null {
  const view = new Uint8Array(combinedBuffer);
  
  // 1. Verify Header (Supports V2.1 and V2.2)
  const header = decoder.decode(view.slice(0, 12));
  if (header !== HEADER_V21 && header !== HEADER_V22) return null;

  // 2. Read Metadata Length
  const jsonLen = new DataView(combinedBuffer).getUint32(12, false);

  // 3. Extract Metadata
  const jsonEnd = 16 + jsonLen;
  const metadataJson = decoder.decode(view.slice(16, jsonEnd));
  const metadata: FileMetadata = JSON.parse(metadataJson);

  // 4. Extract Data
  const data = combinedBuffer.slice(jsonEnd);

  return { metadata, data };
}
