import { useCallback, useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useNetwork } from '../context/NetworkContext';
import { calculateFees, GAS_BUDGET_MIST, WAL_COIN_TYPE, WAL_DECIMALS, type FeeBreakdown, type PaymentToken } from '../utils/fees';

const WALBLOB_COMMISSION_ADDRESS = '0x30a293e77a0a23468a1c05149a985a3810ebca25cc7efe45952cd3e267bb90ef';

interface TransactionState {
  isProcessing: boolean;
  error: string | null;
  digest: string | null;
}

export function useWalrusTransaction() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const { network } = useNetwork();

  const [txState, setTxState] = useState<TransactionState>({
    isProcessing: false,
    error: null,
    digest: null,
  });

  const getFees = useCallback((fileSize: number, epochs: number): FeeBreakdown => {
    return calculateFees(fileSize, epochs);
  }, []);

  const executeStoragePayment = useCallback(async (
    fileSize: number,
    epochs: number,
    paymentToken: PaymentToken = 'SUI',
  ): Promise<{ digest: string; fees: FeeBreakdown }> => {
    if (!currentAccount) {
      throw new Error('Wallet not connected');
    }

    if (network !== 'mainnet') {
      throw new Error('Storage payment only required on mainnet');
    }

    const fees = calculateFees(fileSize, epochs);
    setTxState({ isProcessing: true, error: null, digest: null });

    try {
      const tx = new Transaction();

      if (paymentToken === 'WAL') {
        const totalWal = fees.totalCostWal;
        const totalWalMist = BigInt(Math.round(totalWal * Math.pow(10, WAL_DECIMALS)));
        const storageWalMist = BigInt(Math.round(fees.storageCostWal * Math.pow(10, WAL_DECIMALS)));
        const commissionWalMist = totalWalMist - storageWalMist;

        if (totalWalMist > 0n) {
          const [coin] = tx.splitCoins(tx.coin({ type: WAL_COIN_TYPE, balance: totalWalMist }), [totalWalMist]);

          if (commissionWalMist > 0n) {
            const [storageCoin, commissionCoin] = tx.splitCoins(coin, [storageWalMist, commissionWalMist]);
            tx.transferObjects([storageCoin], currentAccount.address);
            tx.transferObjects([commissionCoin], WALBLOB_COMMISSION_ADDRESS);
          } else {
            tx.transferObjects([coin], currentAccount.address);
          }
        }
      } else {
        const commissionMist = fees.commissionMist > 0n ? fees.commissionMist : 0n;

        if (fees.totalCostMist > 0n) {
          const [coin] = tx.splitCoins(tx.gas, [fees.totalCostMist]);

          if (commissionMist > 0n) {
            const [storageCoin, commissionCoin] = tx.splitCoins(coin, [fees.storageCostMist, commissionMist]);
            tx.transferObjects([storageCoin], currentAccount.address);
            tx.transferObjects([commissionCoin], WALBLOB_COMMISSION_ADDRESS);
          } else {
            tx.transferObjects([coin], currentAccount.address);
          }
        }
      }

      tx.setGasBudget(GAS_BUDGET_MIST);

      const result = await signAndExecute({
        transaction: tx,
        account: currentAccount,
        chain: 'sui:mainnet',
      });

      setTxState({
        isProcessing: false,
        error: null,
        digest: result.digest,
      });

      return { digest: result.digest, fees };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setTxState({
        isProcessing: false,
        error: errorMessage,
        digest: null,
      });
      throw err;
    }
  }, [currentAccount, signAndExecute, network, suiClient]);

  const resetState = useCallback(() => {
    setTxState({ isProcessing: false, error: null, digest: null });
  }, []);

  return {
    ...txState,
    getFees,
    executeStoragePayment,
    resetState,
    isConnected: !!currentAccount,
    address: currentAccount?.address,
  };
}
