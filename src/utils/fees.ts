import { SUI_DECIMALS } from '@mysten/sui/utils';

export const SITE_COMMISSION_RATE = 0.02;
export const GAS_BUDGET_MIST = 50_000_000;
export const STORAGE_COST_PER_BYTE_PER_EPOCH = 10; // MIST per byte per epoch on mainnet

export const WAL_DECIMALS = 9;
export const WAL_COIN_TYPE = '0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf4ae57e9e1::wal::WAL';
export const SUI_TO_WAL_RATE = 0.07;

export type PaymentToken = 'SUI' | 'WAL';

export interface FeeBreakdown {
  fileSize: number;
  fileSizeFormatted: string;
  epochs: number;
  storageCostMist: bigint;
  storageCostSui: number;
  storageCostWal: number;
  commissionMist: bigint;
  commissionSui: number;
  commissionWal: number;
  totalCostMist: bigint;
  totalCostSui: number;
  totalCostWal: number;
  gasBudgetSui: number;
  totalWithGasSui: number;
  totalWithGasWal: number;
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function suiToWal(suiAmount: number): number {
  return suiAmount * SUI_TO_WAL_RATE;
}

export function calculateFees(fileSize: number, epochs: number): FeeBreakdown {
  const storageCostMist = BigInt(fileSize) * BigInt(STORAGE_COST_PER_BYTE_PER_EPOCH) * BigInt(epochs);
  const storageCostSui = Number(storageCostMist) / Math.pow(10, SUI_DECIMALS);
  const storageCostWal = suiToWal(storageCostSui);

  const commissionMist = (storageCostMist * BigInt(Math.round(SITE_COMMISSION_RATE * 100))) / 100n;
  const commissionSui = Number(commissionMist) / Math.pow(10, SUI_DECIMALS);
  const commissionWal = suiToWal(commissionSui);

  const totalCostMist = storageCostMist + commissionMist;
  const totalCostSui = storageCostMist + commissionMist > 0
    ? storageCostSui + commissionSui
    : 0;
  const totalCostWal = suiToWal(totalCostSui);

  const gasBudgetSui = GAS_BUDGET_MIST / Math.pow(10, SUI_DECIMALS);
  const totalWithGasSui = totalCostSui + gasBudgetSui;
  const totalWithGasWal = totalCostWal;

  return {
    fileSize,
    fileSizeFormatted: formatSize(fileSize),
    epochs,
    storageCostMist,
    storageCostSui,
    storageCostWal,
    commissionMist,
    commissionSui,
    commissionWal,
    totalCostMist,
    totalCostSui,
    totalCostWal,
    gasBudgetSui,
    totalWithGasSui,
    totalWithGasWal,
  };
}

export function estimateRetrievalFee(): number {
  return 0;
}

export function formatMistToSui(mist: bigint): string {
  return (Number(mist) / Math.pow(10, SUI_DECIMALS)).toFixed(4);
}
