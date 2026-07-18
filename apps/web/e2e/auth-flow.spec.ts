import { test, expect } from "@playwright/test";
import {
  authenticateAs,
  mockFreighterConnect,
  MOCK_WALLET_ADDRESSES,
  mockApiAuth,
} from "./fixtures/auth";

test.describe("Full SEP-10 Auth Flow", () => {
  test("complete auth flow: landing → login → connect → sign in → dashboard", async ({
    page,
  }) => {
    await mockFreighterConnect(page, MOCK_WALLET_ADDRESSES.startup);
    await mockApiAuth(page);

    await page.goto("/");
    await expect(page).toHaveTitle(/Ondex/i);

    await page.getByRole("link", { name: /get started/i }).click();
    await expect(page).toHaveURL(/\/login/);

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

  test("session persists on reload", async ({ page }) => {
    await mockFreighterConnect(page, MOCK_WALLET_ADDRESSES.startup);

    await authenticateAs(page, "startup");

    await page.reload();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/app\/startup/);
  });

  test("logout clears session and redirects to /login", async ({ page }) => {
    await mockFreighterConnect(page, MOCK_WALLET_ADDRESSES.startup);

    await authenticateAs(page, "startup");

    const avatarBtn = page.locator("button").filter({ hasText: /GASTARTUP/i });
    if (await avatarBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await avatarBtn.click();
      const disconnectBtn = page.getByRole("menuitem", { name: /disconnect/i });
      if (await disconnectBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await disconnectBtn.click();
      }
    }

    await page.goto("/app/startup");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/login/);
  });
});
