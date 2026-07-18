import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { api, ApiError } from "@/lib/api-client";
import { AuthError, NotFoundError } from "@/lib/errors";

const mockFetch = vi.fn();
global.fetch = mockFetch;

function jsonResponse(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  mockFetch.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("api client", () => {
  it("GET request includes credentials", async () => {
    mockFetch.mockImplementation(() => jsonResponse({ id: 1 }));
    await api.get("/test");
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3001/test",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
      })
    );
  });

  it("POST request sends body as JSON", async () => {
    mockFetch.mockImplementation(() => jsonResponse({ ok: true }));
    await api.post("/submit", { name: "test" });
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3001/submit",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "test" }),
      })
    );
  });

  it("throws ApiError on non-ok response", async () => {
    mockFetch.mockImplementation(() =>
      jsonResponse({ error: "bad request" }, 400)
    );
    await expect(api.get("/fail")).rejects.toThrow(ApiError);
  });

  it("throws AuthError on 401", async () => {
    mockFetch.mockImplementation(() =>
      jsonResponse({ error: "unauthorized" }, 401)
    );
    await expect(api.get("/secure")).rejects.toThrow(AuthError);
  });

  it("throws NotFoundError on 404", async () => {
    mockFetch.mockImplementation(() =>
      jsonResponse({ error: "not found" }, 404)
    );
    await expect(api.get("/missing")).rejects.toThrow(NotFoundError);
  });

  it("handles network errors with retry", async () => {
    mockFetch
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockRejectedValueOnce(new TypeError("fetch failed"));
    await expect(api.get("/down")).rejects.toThrow();
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
