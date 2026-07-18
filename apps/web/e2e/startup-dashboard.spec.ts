import { test, expect } from "@playwright/test";
import {
  authenticateAs,
  mockFreighterConnect,
  MOCK_WALLET_ADDRESSES,
} from "./fixtures/auth";

const MOCK_CAMPAIGNS = [
  {
    id: "cmp_001",
    title: "Stellar DEX Aggregator",
    description: "A multi-hop swap optimizer for Stellar DEX",
    funding_amount: "50000000000",
    status: "APPROVED",
    milestones: [
      { id: "ms_1", description: "MVP launch", completed: true },
      { id: "ms_2", description: "Mainnet deployment", completed: false },
    ],
    created_at: "2025-06-01T00:00:00Z",
  },
  {
    id: "cmp_002",
    title: "Soroban Identity SDK",
    description: "Reusable identity verification SDK for Soroban contracts",
    funding_amount: "25000000000",
    status: "PENDING",
    milestones: [
      { id: "ms_3", description: "SDK beta release", completed: false },
    ],
    created_at: "2025-07-01T00:00:00Z",
  },
];

test.describe("Startup Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await mockFreighterConnect(page, MOCK_WALLET_ADDRESSES.startup);

    await page.route("**/localhost:3002/api/v1/campaigns", async (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: MOCK_CAMPAIGNS }),
        });
      }
      return route.fallback();
    });

    await authenticateAs(page, "startup");
  });

  test('shows "Startup Dashboard" heading', async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /startup dashboard/i })
    ).toBeVisible();
  });

  test("shows stats cards", async ({ page }) => {
    await expect(page.getByText("Active Applications")).toBeVisible();
    await expect(page.getByText("Total Funding")).toBeVisible();
    await expect(page.getByText("Milestones Completed")).toBeVisible();
  });

  test('"Apply for Funding" button opens dialog', async ({ page }) => {
    await page.getByRole("button", { name: /apply for funding/i }).click();

    await expect(
      page.getByRole("dialog").filter({ hasText: /apply for funding/i })
    ).toBeVisible();
  });

  test("dialog has form fields", async ({ page }) => {
    await page.getByRole("button", { name: /apply for funding/i }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByPlaceholder(/project name/i)).toBeVisible();
    await expect(dialog.getByPlaceholder(/description/i)).toBeVisible();
    await expect(dialog.getByPlaceholder(/10000/i)).toBeVisible();
    await expect(
      dialog.getByPlaceholder(/milestone/i)
    ).toBeVisible();
  });

  test("submitting form shows toast", async ({ page }) => {
    await page.route("**/localhost:3002/api/v1/campaigns", async (route) => {
      if (route.request().method() === "POST") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: {
              id: "cmp_new",
              title: "New Campaign",
              description: "Test",
              funding_amount: "10000000000",
              status: "PENDING",
              milestones: [],
              created_at: new Date().toISOString(),
            },
          }),
        });
      }
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: MOCK_CAMPAIGNS }),
        });
      }
      return route.fallback();
    });

    await page.getByRole("button", { name: /apply for funding/i }).click();

    const dialog = page.getByRole("dialog");
    await dialog.getByPlaceholder(/project name/i).fill("New Campaign");
    await dialog.getByPlaceholder(/10000/i).fill("5000");

    await dialog.getByRole("button", { name: /submit/i }).click();

    await expect(page.getByText(/submitted/i)).toBeVisible({ timeout: 5000 });
  });

  test("campaign list renders", async ({ page }) => {
    await expect(page.getByText("Stellar DEX Aggregator")).toBeVisible();
    await expect(
      page.getByText("Soroban Identity SDK")
    ).toBeVisible();
  });

  test("empty state shows when no campaigns", async ({ page }) => {
    await page.route("**/localhost:3002/api/v1/campaigns", async (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: [] }),
        });
      }
      return route.fallback();
    });

    await page.goto("/app/startup");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(/no applications yet/i)).toBeVisible();
  });
});
