import { test, expect } from "@playwright/test";
import {
  authenticateAs,
  mockFreighterConnect,
  MOCK_WALLET_ADDRESSES,
} from "./fixtures/auth";

const MOCK_CAMPAIGNS = [
  {
    id: "cmp_inv001",
    identity_commitment: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6",
    title: "Stellar Bridge Protocol",
    description: "Cross-chain bridge for Stellar ecosystem",
    funding_amount: "75000000000",
    milestone_description: "Testnet bridge deployment",
    status: "APPROVED",
    created_at: "2025-06-15T00:00:00Z",
  },
  {
    id: "cmp_inv002",
    identity_commitment: "f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1",
    title: "DeFi Yield Optimizer",
    description: "Automated yield farming on Stellar AMMs",
    funding_amount: "30000000000",
    milestone_description: "Yield strategy alpha release",
    status: "APPROVED",
    created_at: "2025-07-01T00:00:00Z",
  },
];

test.describe("Investor Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await mockFreighterConnect(page, MOCK_WALLET_ADDRESSES.investor);

    await page.route("**/localhost:3002/api/v1/campaigns*", async (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: MOCK_CAMPAIGNS }),
      });
    });

    await page.route("**/soroban-testnet.stellar.org/**", async (route) => {
      const postData = route.request().postData();
      let body = {};

      if (postData) {
        try {
          const rpc = JSON.parse(postData);
          if (
            rpc.method === "sendTransaction"
          ) {
            body = {
              jsonrpc: "2.0",
              id: rpc.id || 1,
              result: {
                hash: "mock_deposit_tx_" + Date.now(),
                status: "PENDING",
              },
            };
          } else if (rpc.method === "simulateTransaction") {
            body = {
              jsonrpc: "2.0",
              id: rpc.id || 1,
              result: {
                status: "SUCCESS",
                result: { xdr: "AAAAAQ==", Return: { values: [] } },
              },
            };
          } else {
            body = { jsonrpc: "2.0", id: rpc.id || 1, result: {} };
          }
        } catch {
          body = { jsonrpc: "2.0", id: 1, result: {} };
        }
      }

      const url = route.request().url();
      if (url.includes("/accounts/")) {
        body = {
          id: MOCK_WALLET_ADDRESSES.investor,
          sequence: "0",
          balances: [],
          signers: [],
          thresholds: { low: 1, med: 1, high: 1 },
        };
      }

      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });

    await authenticateAs(page, "investor");
  });

  test('shows "Investor Dashboard" heading', async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /investor dashboard/i })
    ).toBeVisible();
  });

  test("shows stats cards", async ({ page }) => {
    await expect(page.getByText("Active Investments")).toBeVisible();
    await expect(page.getByText("Total Deployed")).toBeVisible();
    await expect(page.getByText("Returns")).toBeVisible();
  });

  test("campaign list renders", async ({ page }) => {
    await expect(page.getByText("Stellar Bridge Protocol")).toBeVisible();
    await expect(page.getByText("DeFi Yield Optimizer")).toBeVisible();
  });

  test("deposit button opens dialog", async ({ page }) => {
    await page.getByRole("button", { name: /deposit/i }).first().click();

    const dialog = page.getByRole("dialog");
    await expect(
      dialog.filter({ hasText: /deposit to campaign/i })
    ).toBeVisible();
  });

  test("deposit form has amount input", async ({ page }) => {
    await page.getByRole("button", { name: /deposit/i }).first().click();

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByPlaceholder(/1000/i)).toBeVisible();
    await expect(
      dialog.getByLabel(/amount/i)
    ).toBeVisible();
  });

  test("submitting deposit triggers wallet signing and shows toast", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /deposit/i }).first().click();

    const dialog = page.getByRole("dialog");
    await dialog.getByPlaceholder(/1000/i).fill("5000");

    await dialog.getByRole("button", { name: /^deposit$/i }).click();

    await expect(
      page.getByText(/deposit successful/i)
    ).toBeVisible({ timeout: 10000 });
  });
});
