import { ApiError } from "@/lib/api/http";

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-muted">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-accent" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorState({ error }: { error: unknown }) {
  const message =
    error instanceof ApiError
      ? error.message
      : "Something went wrong. Please try again.";

  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-8 text-center">
      <p className="font-medium text-red-300">{message}</p>
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface px-4 py-12 text-center text-sm text-muted">
      {label}
    </div>
  );
}
