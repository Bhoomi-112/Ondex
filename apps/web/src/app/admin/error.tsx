"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h2 className="text-lg font-semibold text-text-primary mb-2">
        Admin page error
      </h2>
      <p className="text-sm text-text-secondary mb-4">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md border border-border px-4 py-2 text-sm"
      >
        Retry
      </button>
    </div>
  );
}
