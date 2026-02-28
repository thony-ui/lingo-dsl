interface CompilationErrorProps {
  error: string;
}

export function CompilationError({ error }: CompilationErrorProps) {
  return (
    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 h-full overflow-y-auto">
      <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900 rounded-lg p-4">
        <ErrorHeader />
        <ErrorMessage error={error} />
      </div>
    </div>
  );
}

function ErrorHeader() {
  return (
    <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
      <span className="text-lg">⚠️</span>
      Compilation Error
    </h3>
  );
}

interface ErrorMessageProps {
  error: string;
}

function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <pre className="text-xs text-red-600 dark:text-red-300 whitespace-pre-wrap font-mono bg-white dark:bg-zinc-950 p-3 rounded border border-red-200 dark:border-red-900">
      {error}
    </pre>
  );
}
