import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center px-6">
          <div className="max-w-2xl w-full text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Something went wrong
            </h1>
            <blockquote className="text-xl italic text-gray-600 dark:text-gray-400 mb-8 border-l-4 border-gray-300 dark:border-gray-600 pl-4">
              &ldquo;These fragments I have shored against my ruins.&rdquo;
              <footer className="text-sm mt-2 not-italic text-gray-500 dark:text-gray-500">
                — T.S. Eliot, <cite>The Waste Land</cite>
              </footer>
            </blockquote>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              We apologize for the inconvenience. An unexpected error occurred.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleGoHome}
                className="px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
              >
                Go Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Reload Page
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Error details (development only)
                </summary>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto text-xs text-gray-800 dark:text-gray-200">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
