/**
 * DECRYPTION SPECIFICATION — WALBLOB V2
 * 
 * 1. INPUT: Encrypted Blob (IV + Ciphertext) and Base64 Key
 * 2. PROCESS: Extract 12-byte IV, import key, perform AES-GCM decryption
 * 3. OUTPUT: Decrypted File (Blob)
 */

import { unpackFileWithMetadata } from './metadata';

export async function decryptFile(encryptedBlob: Blob, keyBase64: string, originalName: string = 'decrypted-file'): Promise<File> {
  try {
    const combinedBuffer = await encryptedBlob.arrayBuffer();
    const combinedArray = new Uint8Array(combinedBuffer);

    // 1. Extract IV (First 12 bytes)
    const iv = combinedArray.slice(0, 12);
    const ciphertext = combinedArray.slice(12);

    // 2. Import the Key
    const keyData = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));
    const key = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    // 3. Decrypt
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    // 4. Handle Metadata (V2.1+)
    const unpacked = unpackFileWithMetadata(decryptedBuffer);
    if (unpacked) {
      const { metadata, data } = unpacked;
      return new File([data], metadata.name, { type: metadata.type || 'application/octet-stream' });
    }

    // 5. Fallback for raw blobs
    return new File([decryptedBuffer], originalName, { type: 'application/octet-stream' });
  } catch (err: unknown) {
    console.error('Decryption failed:', err);
    throw new Error('Invalid decryption key or corrupted data.', { cause: err });
  }
}
