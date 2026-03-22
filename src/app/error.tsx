"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <h2>Page error</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {String(error?.message ?? error)}
      </pre>
      <button onClick={() => reset()}>Retry</button>
    </div>
  );
}