import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads and shows Ondex in the title", async ({ page }) => {
    await expect(page).toHaveTitle(/Ondex/i);
  });

  test("shows hero heading with Fund the Future", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toContainText("Fund the Future");
  });

  test('shows "Get Started" button linking to /login', async ({ page }) => {
    const getStarted = page.getByRole("link", { name: /get started/i });
    await expect(getStarted).toBeVisible();
    await expect(getStarted).toHaveAttribute("href", "/login");
  });

  test("shows Connect Wallet button", async ({ page }) => {
    const connectBtn = page.getByRole("button", { name: /connect wallet/i });
    await expect(connectBtn).toBeVisible();
  });

  test("shows features section", async ({ page }) => {
    await expect(page.getByText("How It Works")).toBeVisible();
    await expect(page.getByText("Built for Trust")).toBeVisible();
    await expect(page.getByText("Identity Masking")).toBeVisible();
    await expect(page.getByText("Jury Curation")).toBeVisible();
    await expect(page.getByText("Escrow Protection")).toBeVisible();
  });

  test("navigation sign in link works", async ({ page }) => {
    const signIn = page.getByRole("link", { name: /sign in/i }).first();
    await expect(signIn).toBeVisible();
    await signIn.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("mobile viewport shows responsive layout", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const connectBtn = page.getByRole("button", { name: /connect wallet/i });
    await expect(connectBtn).toBeVisible();
  });
});
