"use client";

import { useState } from "react";
import { Wallet, LogOut, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useWalletContext } from "@/components/wallet/wallet-provider";
import { useAuthContext } from "@/components/auth/auth-provider";
import { truncateAddress } from "@/lib/utils";

export function ConnectButton() {
  const { address, isConnected, isConnecting, connect, disconnect } =
    useWalletContext();
  const { isAuthenticated, login, role } = useAuthContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isConnected) {
    return (
      <Button onClick={connect} disabled={isConnecting} variant="outline">
        <Wallet className="h-4 w-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400">
          {truncateAddress(address!)}
        </span>
        <Button onClick={() => login(address!)} size="sm">
          Sign In
        </Button>
      </div>
    );
  }

  const roleDashboardMap: Record<string, string> = {
    startup: "/app/startup/dashboard",
    jury: "/app/jury/dashboard",
    investor: "/app/investor/dashboard",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <div className="relative">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {address!.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-zinc-300">
            {truncateAddress(address!)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          {copied ? "Copied!" : "Copy Address"}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://stellar.expert/explorer/testnet/account/${address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </a>
        </DropdownMenuItem>
        {role && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href={roleDashboardMap[role] ?? "/app/dashboard"}>
                {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
              </a>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnect} className="text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
