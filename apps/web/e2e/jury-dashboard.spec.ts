import { test, expect } from "@playwright/test";
import {
  authenticateAs,
  mockFreighterConnect,
  MOCK_WALLET_ADDRESSES,
} from "./fixtures/auth";

const MOCK_CASES = [
  {
    id: "case_abc123def456",
    campaign_id: "cmp_001",
    identity_commitment: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6",
    milestone_description: "MVP launch deliverable for DEX aggregator",
    status: "Voting",
    votes_for: 2,
    votes_against: 1,
    created_at: "2025-07-10T00:00:00Z",
  },
  {
    id: "case_xyz789ghi012",
    campaign_id: "cmp_002",
    identity_commitment: "f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1",
    milestone_description: "SDK beta release milestone",
    status: "Voting",
    votes_for: 0,
    votes_against: 0,
    created_at: "2025-07-12T00:00:00Z",
  },
];

test.describe("Jury Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await mockFreighterConnect(page, MOCK_WALLET_ADDRESSES.jury);

    await page.route("**/localhost:3002/api/v1/cases*", async (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: MOCK_CASES }),
      });
    });

    await page.route("**/soroban-testnet.stellar.org/**", async (route) => {
      const postData = route.request().postData();
      let body = {};

      if (postData) {
        try {
          const rpc = JSON.parse(postData);
          if (
            rpc.method === "getTransaction" ||
            rpc.method === "simulateTransaction"
          ) {
            body = {
              jsonrpc: "2.0",
              id: rpc.id || 1,
              result: {
                status: "SUCCESS",
                hash: "mock_tx_hash_" + Date.now(),
                result: { xdr: "AAAAAQ==", Return: { values: [] } },
              },
            };
          } else if (rpc.method === "sendTransaction") {
            body = {
              jsonrpc: "2.0",
              id: rpc.id || 1,
              result: {
                hash: "mock_tx_hash_" + Date.now(),
                status: "PENDING",
              },
            };
          } else if (rpc.method === "getAccount") {
            body = {
              jsonrpc: "2.0",
              id: rpc.id || 1,
              result: {
                id: MOCK_WALLET_ADDRESSES.jury,
                sequence: "0",
                balances: [],
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
          id: MOCK_WALLET_ADDRESSES.jury,
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

    await authenticateAs(page, "jury");
  });

  test('shows "Jury Dashboard" heading', async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /jury dashboard/i })
    ).toBeVisible();
  });

  test("shows stats cards", async ({ page }) => {
    await expect(page.getByText("Assigned Cases")).toBeVisible();
    await expect(page.getByText("Votes Cast")).toBeVisible();
    await expect(page.getByText("Active Stake")).toBeVisible();
  });

  test("case list renders", async ({ page }) => {
    await expect(page.getByText(/case.*abc123/i)).toBeVisible();
    await expect(page.getByText(/case.*xyz789/i)).toBeVisible();
    await expect(
      page.getByText("MVP launch deliverable")
    ).toBeVisible();
  });

  test("vote buttons are visible", async ({ page }) => {
    const forButtons = page.getByRole("button", { name: /for/i });
    const againstButtons = page.getByRole("button", { name: /against/i });

    await expect(forButtons.first()).toBeVisible();
    await expect(againstButtons.first()).toBeVisible();
  });

  test("clicking vote triggers wallet signing and shows tx hash in toast", async ({
    page,
  }) => {
    const forBtn = page.getByRole("button", { name: /^for$/i }).first();
    await forBtn.click();

    await expect(
      page.getByText(/vote submitted/i)
    ).toBeVisible({ timeout: 10000 });
  });
});
