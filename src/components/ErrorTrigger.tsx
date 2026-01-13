import { useState } from 'react';

/**
 * Test component to trigger ErrorBoundary
 * This is for testing purposes only
 */
function ErrorTrigger() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Test error to trigger ErrorBoundary! This is a deliberate error for testing.');
  }

  return (
    <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
      <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
        <strong>ErrorBoundary Test:</strong> Click the button below to trigger an error and see the ErrorBoundary in action.
      </p>
      <button
        onClick={() => setShouldThrow(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
      >
        Trigger Error (Test ErrorBoundary)
      </button>
    </div>
  );
}

export default ErrorTrigger;
