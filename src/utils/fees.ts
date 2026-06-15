import { SUI_DECIMALS } from '@mysten/sui/utils';

export const SITE_COMMISSION_RATE = 0.02;
export const GAS_BUDGET_MIST = 50_000_000;
export const STORAGE_COST_PER_BYTE_PER_EPOCH = 10; // MIST per byte per epoch on mainnet

export interface FeeBreakdown {
  fileSize: number;
  fileSizeFormatted: string;
  epochs: number;
  storageCostMist: bigint;
  storageCostSui: number;
  commissionMist: bigint;
  commissionSui: number;
  totalCostMist: bigint;
  totalCostSui: number;
  gasBudgetSui: number;
  totalWithGasSui: number;
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function calculateFees(fileSize: number, epochs: number): FeeBreakdown {
  const storageCostMist = BigInt(fileSize) * BigInt(STORAGE_COST_PER_BYTE_PER_EPOCH) * BigInt(epochs);
  const storageCostSui = Number(storageCostMist) / Math.pow(10, SUI_DECIMALS);

  const commissionMist = (storageCostMist * BigInt(Math.round(SITE_COMMISSION_RATE * 100))) / 100n;
  const commissionSui = Number(commissionMist) / Math.pow(10, SUI_DECIMALS);

  const totalCostMist = storageCostMist + commissionMist;
  const totalCostSui = storageCostMist + commissionMist > 0
    ? storageCostSui + commissionSui
    : 0;

  const gasBudgetSui = GAS_BUDGET_MIST / Math.pow(10, SUI_DECIMALS);
  const totalWithGasSui = totalCostSui + gasBudgetSui;

  return {
    fileSize,
    fileSizeFormatted: formatSize(fileSize),
    epochs,
    storageCostMist,
    storageCostSui,
    commissionMist,
    commissionSui,
    totalCostMist,
    totalCostSui,
    gasBudgetSui,
    totalWithGasSui,
  };
}

export function estimateRetrievalFee(): number {
  return 0;
}

export function formatMistToSui(mist: bigint): string {
  return (Number(mist) / Math.pow(10, SUI_DECIMALS)).toFixed(4);
}
