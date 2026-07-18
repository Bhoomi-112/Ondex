import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TopNav } from "@/components/layout/top-nav";

vi.mock("@/components/wallet/wallet-provider", () => ({
  useWalletContext: () => ({
    address: null,
    isConnected: false,
    isConnecting: false,
    connect: vi.fn(),
    disconnect: vi.fn(),
    signXdr: vi.fn(),
  }),
}));

vi.mock("@/components/auth/auth-provider", () => ({
  useAuthContext: () => ({
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    role: null,
  }),
}));

vi.mock("lucide-react", () => ({
  Shield: (props: any) => <svg data-testid="shield-icon" {...props} />,
  Wallet: (props: any) => <svg {...props} />,
  LogOut: (props: any) => <svg {...props} />,
  Copy: (props: any) => <svg {...props} />,
  ExternalLink: (props: any) => <svg {...props} />,
}));

describe("TopNav", () => {
  it("shows Ondex logo text", () => {
    render(<TopNav />);
    expect(screen.getByText("Ondex")).toBeInTheDocument();
  });

  it("shows Testnet badge", () => {
    render(<TopNav />);
    expect(screen.getByText("Testnet")).toBeInTheDocument();
  });

  it("contains ConnectButton", () => {
    render(<TopNav />);
    expect(screen.getByText("Connect Wallet")).toBeInTheDocument();
  });
});
