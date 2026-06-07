/**
 * Calculates the SHA-256 hash of a Blob or File.
 * Returns a hex string representation of the hash.
 */
export async function calculateHash(data: Blob | File | ArrayBuffer): Promise<string> {
  const buffer = data instanceof ArrayBuffer ? data : await data.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
