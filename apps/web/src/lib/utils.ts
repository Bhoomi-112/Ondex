import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address || address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatAmount(amount: bigint | string | number, decimals = 7): string {
  const n = typeof amount === "bigint" ? Number(amount) : typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(n / Math.pow(10, decimals));
}

export function explorerTxUrl(hash: string): string {
  return `https://stellar.expert/explorer/testnet/tx/${hash}`;
}

export function explorerContractUrl(id: string): string {
  return `https://stellar.expert/explorer/testnet/contract/${id}`;
}
