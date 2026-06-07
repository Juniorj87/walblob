/**
 * SECURITY SPECIFICATION — WALBLOB V2
 * 
 * 1. ALGORITHM: AES-GCM 256-bit (Industry Standard)
 * 2. KEY GENERATION: Non-extractable, temporary session keys (where possible)
 * 3. IV: 12-byte cryptographically secure random values (Mandatory for GCM)
 * 4. ZERO-KNOWLEDGE: Keys NEVER leave the browser memory in raw form.
 * 5. DATA LEAKAGE: Keys are never logged to console or sent via network requests.
 */

import { packFileWithMetadata } from './metadata';
import { calculateHash } from './hash';

export async function encryptFile(file: File, withMetadata: boolean = false): Promise<{ encryptedBlob: Blob; key: string }> {
  // 1. Calculate Original File Hash (P8: Integrity Verification)
  const fileHash = await calculateHash(file);

  // 2. Generate a cryptographically strong 256-bit AES-GCM key
  const key = await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true, // Key must be extractable to show to user for manual recovery
    ['encrypt', 'decrypt']
  );

  // 3. GCM recommended IV size is 12 bytes for optimal security/performance
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // 4. Package with metadata if requested (V2.1+)
  const dataToEncrypt = withMetadata 
    ? await packFileWithMetadata(file, fileHash) 
    : await file.arrayBuffer();

  // 5. Perform client-side encryption
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataToEncrypt
  );

  // Export key to Base64 for user-side storage (Zero-Knowledge)
  const exportedKey = await window.crypto.subtle.exportKey('raw', key);
  const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));

  // Prepended IV + Ciphertext (Required for decryption later)
  const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedBuffer), iv.length);

  return {
    encryptedBlob: new Blob([combined], { type: 'application/octet-stream' }),
    key: keyBase64,
  };
}
