import { test, expect } from "@playwright/test";
import { mockFreighterConnect, MOCK_WALLET_ADDRESSES } from "./fixtures/auth";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
  });

  test('loads with "Welcome to Ondex" heading', async ({ page }) => {
    await expect(page.getByRole("heading", { name: /welcome to ondex/i })).toBeVisible();
  });

  test("shows connect wallet button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /connect wallet/i })).toBeVisible();
  });

  test("shows SEP-10 info text", async ({ page }) => {
    await expect(page.getByText(/sep-10/i)).toBeVisible();
  });

  test("clicking connect button triggers wallet interaction", async ({ page }) => {
    await mockFreighterConnect(page, MOCK_WALLET_ADDRESSES.startup);

    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /connect wallet/i }).click();

    const modalVisible = await page
      .locator('[class*="swkit"], [role="dialog"]')
      .first()
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    if (modalVisible) {
      const freighterBtn = page
        .getByRole("button", { name: /freighter/i })
        .first();
      if (await freighterBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await freighterBtn.click();
      }
    }

    await expect(
      page.getByRole("button", { name: /sign in/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("after connecting, shows Sign In option", async ({ page }) => {
    await mockFreighterConnect(page, MOCK_WALLET_ADDRESSES.startup);

    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /connect wallet/i }).click();

    const modalVisible = await page
      .locator('[class*="swkit"], [role="dialog"]')
      .first()
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    if (modalVisible) {
      const freighterBtn = page
        .getByRole("button", { name: /freighter/i })
        .first();
      if (await freighterBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await freighterBtn.click();
      }
    }

    const signInBtn = page.getByRole("button", { name: /sign in/i });
    await expect(signInBtn).toBeVisible({ timeout: 10000 });
  });

  test("after sign in, redirects to dashboard", async ({ page }) => {
    await mockFreighterConnect(page, MOCK_WALLET_ADDRESSES.startup);

    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /connect wallet/i }).click();

    const modalVisible = await page
      .locator('[class*="swkit"], [role="dialog"]')
      .first()
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    if (modalVisible) {
      const freighterBtn = page
        .getByRole("button", { name: /freighter/i })
        .first();
      if (await freighterBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await freighterBtn.click();
      }
    }

    await expect(
      page.getByRole("button", { name: /sign in/i })
    ).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: /sign in/i }).click();

    await page.waitForURL("**/app/**", { timeout: 15000 });
  });

  test("back to home link works", async ({ page }) => {
    const backLink = page.getByRole("link", { name: /back to home/i });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL("/");
  });
});
