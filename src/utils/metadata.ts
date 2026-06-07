/**
 * WALBLOB METADATA PROTOCOL V2.1
 * 
 * Format: [HEADER: 12 bytes][JSON_LEN: 4 bytes][JSON_METADATA][FILE_DATA]
 * Header: 'WALBLOB-V2.1'
 */

export interface FileMetadata {
  name: string;
  type: string;
  size: number;
  uploadedAt: number;
  version: string;
}

const HEADER = 'WALBLOB-V2.1';
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function packFileWithMetadata(file: File): Promise<ArrayBuffer> {
  const metadata: FileMetadata = {
    name: file.name,
    type: file.type,
    size: file.size,
    uploadedAt: Date.now(),
    version: '2.1.0'
  };

  const metadataJson = JSON.stringify(metadata);
  const metadataBuffer = encoder.encode(metadataJson);
  const fileBuffer = await file.arrayBuffer();

  const headerBuffer = encoder.encode(HEADER); // 12 bytes
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
  
  // 1. Verify Header
  const header = decoder.decode(view.slice(0, 12));
  if (header !== HEADER) return null;

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
