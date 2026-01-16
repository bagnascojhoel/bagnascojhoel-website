import React from 'react';
import ErrorFallback from './ErrorFallback';

interface Props {
  hasError?: boolean;
  message?: string;
  children: React.ReactNode;
}

export default function PublicWorkErrorBoundary({ hasError, message, children }: Props) {
  if (hasError) {
    return <ErrorFallback message={message} />;
  }

  return <>{children}</>;
}
