import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ConnectButton } from "@/components/wallet/connect-button";

const mockConnect = vi.fn();
const mockDisconnect = vi.fn();
const mockLogin = vi.fn();

let walletState = {
  address: null as string | null,
  isConnected: false,
  isConnecting: false,
  connect: mockConnect,
  disconnect: mockDisconnect,
  signXdr: vi.fn(),
};

let authState = {
  isAuthenticated: false,
  login: mockLogin,
  logout: vi.fn(),
  role: null as string | null,
};

vi.mock("@/components/wallet/wallet-provider", () => ({
  useWalletContext: () => walletState,
}));

vi.mock("@/components/auth/auth-provider", () => ({
  useAuthContext: () => authState,
}));

vi.mock("lucide-react", () => ({
  Wallet: (props: any) => <svg data-testid="wallet-icon" {...props} />,
  LogOut: (props: any) => <svg data-testid="logout-icon" {...props} />,
  Copy: (props: any) => <svg data-testid="copy-icon" {...props} />,
  ExternalLink: (props: any) => <svg data-testid="external-link-icon" {...props} />,
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: any) => <div data-testid="dropdown">{children}</div>,
  DropdownMenuTrigger: ({ children, asChild }: any) => <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick, asChild }: any) => {
    if (asChild) return children;
    return <div data-testid="dropdown-item" onClick={onClick}>{children}</div>;
  },
  DropdownMenuSeparator: () => <hr data-testid="dropdown-separator" />,
}));

vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children }: any) => <div data-testid="avatar">{children}</div>,
  AvatarFallback: ({ children }: any) => <span data-testid="avatar-fallback">{children}</span>,
}));

beforeEach(() => {
  vi.clearAllMocks();
  walletState = {
    address: null,
    isConnected: false,
    isConnecting: false,
    connect: mockConnect,
    disconnect: mockDisconnect,
    signXdr: vi.fn(),
  };
  authState = {
    isAuthenticated: false,
    login: mockLogin,
    logout: vi.fn(),
    role: null,
  };
});

describe("ConnectButton", () => {
  it("shows Connect Wallet when not connected", () => {
    render(<ConnectButton />);
    expect(screen.getByText("Connect Wallet")).toBeInTheDocument();
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("shows Connecting... when connecting", () => {
    walletState = { ...walletState, isConnecting: true };
    render(<ConnectButton />);
    expect(screen.getByText("Connecting...")).toBeInTheDocument();
  });

  it("shows Sign In button when connected but not authenticated", () => {
    walletState = {
      ...walletState,
      isConnected: true,
      address: "GABCEF1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ012345",
    };
    render(<ConnectButton />);
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("GABC...2345")).toBeInTheDocument();
  });

  it("shows address with dropdown when authenticated", () => {
    walletState = {
      ...walletState,
      isConnected: true,
      address: "GABCEF1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ012345",
    };
    authState = {
      ...authState,
      isAuthenticated: true,
      role: "startup",
    };
    render(<ConnectButton />);
    expect(screen.getByText("GABC...2345")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown")).toBeInTheDocument();
  });

  it("shows disconnect option in dropdown", () => {
    walletState = {
      ...walletState,
      isConnected: true,
      address: "GABCEF1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ012345",
    };
    authState = {
      ...authState,
      isAuthenticated: true,
      role: "investor",
    };
    render(<ConnectButton />);
    expect(screen.getByText("Disconnect")).toBeInTheDocument();
  });
});
