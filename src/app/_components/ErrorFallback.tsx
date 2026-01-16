'use client';

import React from 'react';

interface ErrorFallbackProps {
  message?: string;
}

export default function ErrorFallback({ message }: ErrorFallbackProps) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-800">
      <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
      <p className="mb-4">{message ?? 'There was an error loading this section.'}</p>
      <div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
