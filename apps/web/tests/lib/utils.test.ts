import { describe, it, expect } from "vitest";
import { cn, truncateAddress, formatDate, formatAmount, explorerTxUrl, explorerContractUrl } from "@/lib/utils";

describe("cn", () => {
  it("merges classes correctly", () => {
    const result = cn("px-2", "py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", "extra");
    expect(result).toContain("base");
    expect(result).toContain("extra");
    expect(result).not.toContain("hidden");
  });
});

describe("truncateAddress", () => {
  it("truncates properly", () => {
    const addr = "GABCEF1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ012345";
    expect(truncateAddress(addr)).toBe("GABC...2345");
  });

  it("returns full address when short", () => {
    const addr = "GABC1234";
    expect(truncateAddress(addr)).toBe(addr);
  });
});

describe("formatDate", () => {
  it("formats dates", () => {
    const result = formatDate(new Date(2025, 0, 15));
    expect(result).toBe("Jan 15, 2025");
  });

  it("formats date strings", () => {
    const result = formatDate("2025-06-20");
    expect(result).toBe("Jun 20, 2025");
  });
});

describe("formatAmount", () => {
  it("formats numbers", () => {
    expect(formatAmount(1000000000, 7)).toBe("100");
  });

  it("formats bigint", () => {
    expect(formatAmount(BigInt("5000000000"), 7)).toBe("500");
  });

  it("formats string amounts", () => {
    expect(formatAmount("2500000000", 7)).toBe("250");
  });
});

describe("explorerTxUrl", () => {
  it("returns correct URL", () => {
    expect(explorerTxUrl("abc123")).toBe(
      "https://stellar.expert/explorer/testnet/tx/abc123"
    );
  });
});

describe("explorerContractUrl", () => {
  it("returns correct URL", () => {
    expect(explorerContractUrl("CXYZ789")).toBe(
      "https://stellar.expert/explorer/testnet/contract/CXYZ789"
    );
  });
});
