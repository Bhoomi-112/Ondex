import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stroopsToXLM(stroops: bigint | number): number {
  return Number(stroops) / 10_000_000;
}

export function formatXLM(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  }).format(amount);
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function stellarExpertTxUrl(hash: string): string {
  const base = process.env.NEXT_PUBLIC_EXPLORER_BASE_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_EXPLORER_BASE_URL is not set");
  }
  return `${base.replace(/\/$/, "")}/tx/${hash}`;
}

export function stellarExpertContractUrl(contractId: string): string {
  const base = process.env.NEXT_PUBLIC_EXPLORER_BASE_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_EXPLORER_BASE_URL is not set");
  }
  return `${base.replace(/\/$/, "")}/contract/${contractId}`;
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor(Date.now() / 1000 - timestamp);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
