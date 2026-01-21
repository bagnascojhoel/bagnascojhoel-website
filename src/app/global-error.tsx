'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.1/tailwind.min.css"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --color-background: 45 30% 96%;
            --color-foreground: 25 20% 20%;
            --color-primary: 18 65% 55%;
            --color-primary-foreground: 45 30% 98%;
            --color-muted-foreground: 25 15% 45%;
            --color-card: 40 25% 98%;
            --color-border: 35 20% 85%;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --color-background: 25 20% 10%;
              --color-foreground: 40 20% 90%;
              --color-primary: 18 70% 60%;
              --color-primary-foreground: 25 20% 10%;
              --color-muted-foreground: 35 15% 60%;
              --color-card: 25 18% 14%;
              --color-border: 25 15% 25%;
            }
          }
          body {
            background-color: hsl(var(--color-background));
            color: hsl(var(--color-foreground));
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          }
        `}</style>
      </head>
      <body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            textAlign: 'center',
            gap: '1.5rem',
          }}
        >
          <div
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '16px',
              backgroundColor: 'hsl(var(--color-primary) / 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.5rem',
            }}
          >
            <svg
              style={{ width: '48px', height: '48px', color: 'hsl(var(--color-primary))' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0 }}>
            Something went wrong!
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              color: 'hsl(var(--color-muted-foreground))',
              maxWidth: '32rem',
              margin: 0,
            }}
          >
            We apologize for the inconvenience. Our team has been notified and is working on a fix.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '500',
              backgroundColor: 'hsl(var(--color-primary))',
              color: 'hsl(var(--color-primary-foreground))',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseOut={e => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
