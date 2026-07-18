import { test, expect } from "@playwright/test";
import {
  authenticateAs,
  mockFreighterConnect,
  MOCK_WALLET_ADDRESSES,
} from "./fixtures/auth";

test.describe("Error Handling and 404", () => {
  test("navigate to /nonexistent shows 404 page", async ({ page }) => {
    await page.goto("/nonexistent");
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
    await expect(page.getByText(/page not found/i)).toBeVisible();
  });

  test("404 page has Back to Home link", async ({ page }) => {
    await page.goto("/nonexistent");
    const homeLink = page.getByRole("link", { name: /back to home/i });
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveAttribute("href", "/");
  });

  test("clicking Back to Home navigates to /", async ({ page }) => {
    await page.goto("/nonexistent");
    await page.getByRole("link", { name: /back to home/i }).click();
    await expect(page).toHaveURL("/");
    await expect(page).toHaveTitle(/Ondex/i);
  });

  test("unauthenticated user on /app/startup redirected to /login", async ({
    page,
  }) => {
    await page.goto("/app/startup");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/login/);
  });

  test("wrong role on wrong dashboard redirects to correct dashboard", async ({
    page,
  }) => {
    await mockFreighterConnect(page, MOCK_WALLET_ADDRESSES.startup);

    await authenticateAs(page, "startup");

    await page.goto("/app/jury");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/app\/startup/);
  });

  test("investor trying to access startup dashboard redirects to investor dashboard", async ({
    page,
  }) => {
    await mockFreighterConnect(page, MOCK_WALLET_ADDRESSES.investor);

    await authenticateAs(page, "investor");

    await page.goto("/app/startup");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/app\/investor/);
  });

  test("unauthenticated user on /app/investor redirected to /login", async ({
    page,
  }) => {
    await page.goto("/app/investor");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated user on /app/jury redirected to /login", async ({
    page,
  }) => {
    await page.goto("/app/jury");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/login/);
  });
});
