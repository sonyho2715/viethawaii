'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            padding: '1rem',
          }}
        >
          <div style={{ maxWidth: '28rem', width: '100%', textAlign: 'center' }}>
            <div style={{ marginBottom: '1.5rem', fontSize: '4rem' }}>😔</div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '0.5rem',
              }}
            >
              Something went wrong
            </h1>
            <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
              A critical error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#e11d48',
                color: 'white',
                fontWeight: '600',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
