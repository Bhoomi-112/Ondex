import { type Page, expect } from "@playwright/test";

export const MOCK_WALLET_ADDRESSES = {
  startup: "GASTARTUP00000000000000000000000000000000000000000000000",
  jury: "GAJURY00000000000000000000000000000000000000000000000000",
  investor: "GAINVESTOR000000000000000000000000000000000000000000000",
} as const;

export type UserRole = keyof typeof MOCK_WALLET_ADDRESSES;

const MOCK_API_BASE = "http://localhost:3002";

function buildFreighterMock(address: string) {
  return `
    window.freighter = {
      isConnected: () => Promise.resolve(true),
      getPublicKey: () => Promise.resolve("${address}"),
      requestAccess: () => Promise.resolve(),
      signTransaction: (xdr, opts) =>
        Promise.resolve({ signedTxXdr: xdr + "_signed_by_freighter_mock" }),
      signMessage: (msg) => Promise.resolve({ signedMessage: msg + "_signed" }),
      disconnect: () => Promise.resolve(),
    };
  `;
}

export async function mockFreighterConnect(
  page: Page,
  address: string = MOCK_WALLET_ADDRESSES.startup
) {
  await page.addInitScript(buildFreighterMock(address));
}

export async function mockFreighterSign(page: Page) {
  await page.addInitScript(`
    if (window.freighter) {
      const orig = window.freighter.signTransaction;
      window.freighter.signTransaction = (xdr, opts) =>
        Promise.resolve({ signedTxXdr: xdr + "_signed_by_freighter_mock" });
    }
  `);
}

export async function mockApiAuth(page: Page) {
  await page.route(`${MOCK_API_BASE}/api/v1/auth/**`, async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (url.endsWith("/auth/me") && method === "GET") {
      const cookie = route.request().headers()["cookie"] || "";
      const match = cookie.match(/ondex_session=(\d+)/);
      if (match) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: {
              wallet: MOCK_WALLET_ADDRESSES.startup,
              role: "startup",
            },
          }),
        });
      }
      return route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "Not authenticated" }),
      });
    }

    if (url.endsWith("/auth/challenge") && method === "POST") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            tx: "AAAAAgAAAADk0v3o4JnIY0I80YhWB3nTLP8hMzSvb1GJY9dPrB3qfAAAAGQAAAAAAAAAAAAAAAABAAAAAQAAAADk0v3o4JnIY0I80YhWB3nTLP8hMzSvb1GJY9dPrB3qfAAAAAEAAAAA",
            network_passphrase: "Test SDF Network ; September 2015",
          },
        }),
      });
    }

    if (url.endsWith("/auth/verify") && method === "POST") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: null }),
        headers: {
          "Set-Cookie": "ondex_session=1; Path=/; HttpOnly; SameSite=Lax",
        },
      });
    }

    if (url.endsWith("/auth/logout") && method === "DELETE") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: null }),
        headers: {
          "Set-Cookie":
            "ondex_session=; Path=/; HttpOnly; Max-Age=0",
        },
      });
    }

    return route.fallback();
  });
}

function getDashboardPath(role: UserRole): string {
  return `/app/${role}`;
}

async function handleWalletModal(page: Page) {
  const modalVisible = await page
    .locator('[class*="swkit"], [role="dialog"]')
    .first()
    .isVisible({ timeout: 3000 })
    .catch(() => false);

  if (modalVisible) {
    const freighterBtn = page
      .getByRole("button", { name: /freighter/i })
      .first();
    const altBtn = page.locator("button").filter({ hasText: /freighter/i }).first();

    if (await freighterBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await freighterBtn.click();
    } else if (await altBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await altBtn.click();
    }
  }
}

export async function authenticateAs(page: Page, role: UserRole) {
  const address = MOCK_WALLET_ADDRESSES[role];

  await mockFreighterConnect(page, address);

  await page.goto("/login");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: /connect wallet/i }).click();

  await handleWalletModal(page);

  await expect(
    page.getByRole("button", { name: /sign in/i })
  ).toBeVisible({ timeout: 10000 });

  await page.getByRole("button", { name: /sign in/i }).click();

  const dashboardPath = getDashboardPath(role);
  await page.waitForURL(`**${dashboardPath}**`, { timeout: 15000 });
}
