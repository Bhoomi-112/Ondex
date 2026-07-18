import { AuthError, NotFoundError, AppError } from "./errors";

export class ApiError extends AppError {
  constructor(status: number, message: string) {
    super(message, status, "API_ERROR");
    this.name = "ApiError";
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const TIMEOUT_MS = 10_000;

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timer);

      const json = await res.json();

      if (!res.ok) {
        const message =
          typeof json === "object" && json !== null && "error" in json
            ? String(json.error)
            : `Request failed with status ${res.status}`;

        if (res.status === 401) throw new AuthError(message);
        if (res.status === 404) throw new NotFoundError(message);
        throw new ApiError(res.status, message);
      }

      return json as T;
    } catch (err) {
      clearTimeout(timer);

      if (err instanceof ApiError) throw err;

      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt === 0) continue;
    }
  }

  throw lastError ?? new ApiError(0, "Request failed");
}

export const api = {
  get<T>(path: string): Promise<T> {
    return request<T>("GET", path);
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>("POST", path, body);
  },

  del<T>(path: string): Promise<T> {
    return request<T>("DELETE", path);
  },
};
