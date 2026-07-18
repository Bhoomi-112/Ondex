"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const cache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

export function useFetch<T>(key: string, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | undefined>(() => {
    const cached = cache.get(key) as T | undefined;
    return cached;
  });
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(!cache.has(key));
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (inflight.has(key)) {
      try {
        const result = (await inflight.get(key)) as T;
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const promise = fetcherRef.current();
    inflight.set(key, promise);

    try {
      const result = await promise;
      cache.set(key, result);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      cache.delete(key);
    } finally {
      inflight.delete(key);
      setIsLoading(false);
    }
  }, [key]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setIsLoading(true);
      setError(null);

      if (inflight.has(key)) {
        try {
          const result = (await inflight.get(key)) as T;
          if (!cancelled) setData(result);
        } catch (err) {
          if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
          if (!cancelled) setIsLoading(false);
        }
        return;
      }

      const promise = fetcherRef.current();
      inflight.set(key, promise);

      try {
        const result = await promise;
        cache.set(key, result);
        if (!cancelled) setData(result);
      } catch (err) {
        cache.delete(key);
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        inflight.delete(key);
        if (!cancelled) setIsLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [key]);

  const refetch = useCallback(() => {
    cache.delete(key);
    inflight.delete(key);
    execute();
  }, [key, execute]);

  return { data, error, isLoading, refetch };
}
