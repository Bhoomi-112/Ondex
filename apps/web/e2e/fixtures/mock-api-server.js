const http = require("http");

const sessions = new Map();
let nextCookieId = 1;

const MOCK_WALLET_ADDRESSES = {
  startup: "GASTARTUP00000000000000000000000000000000000000000000000",
  jury: "GAJURY00000000000000000000000000000000000000000000000000",
  investor: "GAINVESTOR000000000000000000000000000000000000000000000",
};

function roleFromWallet(wallet) {
  if (!wallet) return "startup";
  if (wallet.startsWith("GAJURY")) return "jury";
  if (wallet.startsWith("GAINVESTOR")) return "investor";
  return "startup";
}

function parseCookies(header) {
  const cookies = {};
  if (!header) return cookies;
  header.split(";").forEach((c) => {
    const [k, ...rest] = c.trim().split("=");
    if (k) cookies[k] = rest.join("=");
  });
  return cookies;
}

function json(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    });
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const cookies = parseCookies(req.headers.cookie);

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    let parsed = {};
    try {
      parsed = JSON.parse(body);
    } catch {}

    if (path === "/api/v1/auth/me" && req.method === "GET") {
      const sessionId = cookies["ondex_session"];
      const session = sessionId ? sessions.get(sessionId) : null;
      if (session) {
        return json(res, 200, { data: session });
      }
      return json(res, 401, { error: "Not authenticated" });
    }

    if (path === "/api/v1/auth/challenge" && req.method === "POST") {
      return json(res, 200, {
        data: {
          tx: "AAAAAgAAAADk0v3o4JnIY0I80YhWB3nTLP8hMzSvb1GJY9dPrB3qfAAAAGQAAAAAAAAAAAAAAAABAAAAAQAAAADk0v3o4JnIY0I80YhWB3nTLP8hMzSvb1GJY9dPrB3qfAAAAAEAAAAA",
          network_passphrase: "Test SDF Network ; September 2015",
        },
      });
    }

    if (path === "/api/v1/auth/verify" && req.method === "POST") {
      const wallet = parsed.wallet || MOCK_WALLET_ADDRESSES.startup;
      const role = roleFromWallet(wallet);
      const cookieId = String(nextCookieId++);
      sessions.set(cookieId, { wallet, role });
      res.setHeader(
        "Set-Cookie",
        `ondex_session=${cookieId}; Path=/; HttpOnly; SameSite=Lax`
      );
      return json(res, 200, { data: null });
    }

    if (path === "/api/v1/auth/logout" && req.method === "DELETE") {
      const sessionId = cookies["ondex_session"];
      if (sessionId) sessions.delete(sessionId);
      res.setHeader(
        "Set-Cookie",
        "ondex_session=; Path=/; HttpOnly; Max-Age=0"
      );
      return json(res, 200, { data: null });
    }

    if (path === "/api/v1/campaigns" && req.method === "GET") {
      return json(res, 200, { data: [] });
    }

    if (path === "/api/v1/campaigns" && req.method === "POST") {
      return json(res, 200, {
        data: {
          id: "cmp_" + Date.now(),
          title: parsed.title || "Test Campaign",
          description: parsed.description || "",
          funding_amount: parsed.funding_amount || "10000000000",
          status: "PENDING",
          milestones: parsed.milestone_description
            ? [
                {
                  id: "ms_1",
                  description: parsed.milestone_description,
                  completed: false,
                },
              ]
            : [],
          created_at: new Date().toISOString(),
        },
      });
    }

    if (path === "/api/v1/cases" && req.method === "GET") {
      return json(res, 200, { data: [] });
    }

    json(res, 404, { error: "Not found" });
  });
});

const PORT = process.env.MOCK_API_PORT || 3002;
server.listen(PORT, () => {
  console.log(`[mock-api] listening on http://localhost:${PORT}`);
});
