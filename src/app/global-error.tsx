"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ fontFamily: "system-ui", padding: 24 }}>
        <h1>Global error</h1>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {String(error?.message ?? error)}
        </pre>
        <button onClick={() => reset()}>Retry</button>
      </body>
    </html>
  );
}