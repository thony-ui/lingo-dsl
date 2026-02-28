"use client";

import { useEffect, useRef } from "react";

interface LivePreviewProps {
  compiledCode: string;
  error: string | null;
}

export default function LivePreview({ compiledCode, error }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;
    
    if (!compiledCode) {
      return;
    }
    

    const sandboxHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 16px;
      font-family: system-ui, -apple-system, sans-serif;
    }
    * {
      box-sizing: border-box;
    }
    button {
      margin: 4px;
      padding: 8px 16px;
      cursor: pointer;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
    }
    button:hover {
      background: #0056b3;
    }
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    // Inline minimal runtime (no ES modules)
    let currentEffect = null;
    
    class Signal {
      constructor(initialValue) {
        this.value = initialValue;
        this.subscribers = new Set();
      }
      
      get() {
        if (currentEffect) {
          this.subscribers.add(currentEffect);
        }
        return this.value;
      }
      
      set(newValue) {
        if (this.value !== newValue) {
          this.value = newValue;
          this.subscribers.forEach(effect => effect());
        }
      }
    }
    
    function createSignal(initialValue) {
      return new Signal(initialValue);
    }
    
    function createEffect(fn) {
      currentEffect = fn;
      fn();
      currentEffect = null;
    }
    
    function renderApp(renderFn) {
      const root = document.getElementById('app');
      root.innerHTML = '';
      renderFn(root);
      return root;
    }
    
    // Now execute the compiled code
    try {
      ${compiledCode
        .replace(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"];?\s*/g, '')
        .replace("export function createApp() {", 'function createApp() {')}
      
      createApp();
    } catch (error) {
      console.error('Runtime error:', error);
      document.getElementById('app').innerHTML = '<div style="color: red; padding: 20px; border: 1px solid red; border-radius: 4px;"><strong>Error:</strong><br>' + error.message + '<br><pre style="font-size: 10px;">' + error.stack + '</pre></div>';
    }
  </script>
</body>
</html>
    `;

    iframeRef.current.srcdoc = sandboxHTML;
  }, [compiledCode]);

  return (
    <div className="h-full w-full flex flex-col border-r border-zinc-200 dark:border-zinc-800">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-zinc-900 dark:to-zinc-900 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Live Preview
        </h2>
      </div>
      {error ? (
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900 h-full overflow-y-auto">
          <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              Compilation Error
            </h3>
            <pre className="text-xs text-red-600 dark:text-red-300 whitespace-pre-wrap font-mono bg-white dark:bg-zinc-950 p-3 rounded border border-red-200 dark:border-red-900">
              {error}
            </pre>
          </div>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          className="w-full h-full bg-white dark:bg-zinc-950"
          sandbox="allow-scripts allow-same-origin"
          title="Live Preview"
        />
      )}
    </div>
  );
}
