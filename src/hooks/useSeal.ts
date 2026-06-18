import { useState, useCallback, useRef, useEffect } from 'react';
import { SealClient, SessionKey } from '@mysten/seal';
import { Transaction } from '@mysten/sui/transactions';
import { fromHex } from '@mysten/sui/utils';
import { useCurrentAccount, useSignPersonalMessage, useSuiClient } from '@mysten/dapp-kit';

const SEAL_PACKAGE_ID = import.meta.env.VITE_SEAL_PACKAGE_ID || '';
const SEAL_REGISTRY_ID = import.meta.env.VITE_SEAL_REGISTRY_ID || '';
const SEAL_API_KEY = import.meta.env.VITE_SEAL_API_KEY || '';

const MODULE_NAME = 'access_control';

function getServerConfigs() {
  const configs: Array<{
    objectId: string;
    aggregatorUrl: string;
    weight: number;
    apiKeyName?: string;
    apiKey?: string;
  }> = [
    {
      objectId: '0x686098f1439237fff9f36b99c7329683c22979d2005c2465cb891acb012a7595',
      aggregatorUrl: 'https://seal-aggregator-mainnet.mystenlabs.com',
      weight: 1,
    },
  ];

  if (SEAL_API_KEY) {
    configs[0].apiKeyName = 'Authorization';
    configs[0].apiKey = SEAL_API_KEY;
  }

  return configs;
}

function buildSealApproveTx(packageId: string, id: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::${MODULE_NAME}::seal_approve`,
    arguments: [
      tx.pure.vector('u8', fromHex(id)),
      tx.object(SEAL_REGISTRY_ID),
    ],
  });
  return tx;
}

export function useSeal() {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<SealClient | null>(null);
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();
  const suiClient = useSuiClient();

  useEffect(() => {
    if (!SEAL_PACKAGE_ID || !SEAL_REGISTRY_ID) {
      console.warn('Seal: VITE_SEAL_PACKAGE_ID and VITE_SEAL_REGISTRY_ID not configured');
    }
    try {
      clientRef.current = new SealClient({
        suiClient: suiClient as never,
        serverConfigs: getServerConfigs(),
        verifyKeyServers: false,
      });
    } catch (err) {
      console.error('Failed to initialize SealClient:', err);
    }
  }, [suiClient]);

  const encrypt = useCallback(async (blobId: string, data: Uint8Array): Promise<{
    encryptedBytes: Uint8Array;
    backupKey: string;
  }> => {
    if (!SEAL_PACKAGE_ID) throw new Error('Seal package ID not configured');
    if (!clientRef.current) throw new Error('Seal client not initialized');

    setIsEncrypting(true);
    setError(null);

    try {
      const idHex = blobId.startsWith('0x') ? blobId : `0x${blobId}`;

      const result = await clientRef.current.encrypt({
        threshold: 5,
        packageId: SEAL_PACKAGE_ID,
        id: idHex,
        data,
      });

      return { encryptedBytes: result.encryptedObject, backupKey: Array.from(result.key).map(b => b.toString(16).padStart(2, '0')).join('') };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Seal encryption failed';
      setError(msg);
      throw err;
    } finally {
      setIsEncrypting(false);
    }
  }, []);

  const decrypt = useCallback(async (
    encryptedBytes: Uint8Array,
    blobId: string,
  ): Promise<Uint8Array> => {
    if (!SEAL_PACKAGE_ID) throw new Error('Seal package ID not configured');
    if (!currentAccount) throw new Error('Wallet not connected');
    if (!clientRef.current) throw new Error('Seal client not initialized');

    setIsDecrypting(true);
    setError(null);

    try {
      const sessionKey = await SessionKey.create({
        address: currentAccount.address,
        packageId: SEAL_PACKAGE_ID,
        ttlMin: 10,
        suiClient: suiClient as never,
      });

      const message = sessionKey.getPersonalMessage();
      const { signature } = await signPersonalMessage({ message });
      sessionKey.setPersonalMessageSignature(signature);

      const idHex = blobId.startsWith('0x') ? blobId : `0x${blobId}`;
      const tx = buildSealApproveTx(SEAL_PACKAGE_ID, idHex);
      const txBytes = await tx.build({
        client: suiClient as never,
        onlyTransactionKind: true,
      });

      const decryptedBytes = await clientRef.current.decrypt({
        data: encryptedBytes,
        sessionKey,
        txBytes,
      });

      return decryptedBytes;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Seal decryption failed';
      setError(msg);
      throw err;
    } finally {
      setIsDecrypting(false);
    }
  }, [currentAccount, signPersonalMessage, suiClient]);

  const isConfigured = Boolean(SEAL_PACKAGE_ID && SEAL_REGISTRY_ID);

  return {
    encrypt,
    decrypt,
    isEncrypting,
    isDecrypting,
    error,
    isConfigured,
    packageId: SEAL_PACKAGE_ID,
    registryId: SEAL_REGISTRY_ID,
  };
}
