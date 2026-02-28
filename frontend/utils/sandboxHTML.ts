export function generateSandboxHTML(compiledCode: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${getBaseStyles()}
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    ${getRuntimeCode()}
    ${getCompiledCode(compiledCode)}
  </script>
</body>
</html>
  `;
}

function getBaseStyles(): string {
  return `
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
  `;
}

function getRuntimeCode(): string {
  return `
    // Inline minimal runtime (no ES modules)
    let currentEffect = null;
    
    class Signal {
      constructor(initialValue, name) {
        this.value = initialValue;
        this.name = name;
        this.subscribers = new Set();
        
        // Notify parent of initial state
        if (this.name && window.parent) {
          window.parent.postMessage({
            type: 'STATE_UPDATE',
            name: this.name,
            value: this.value
          }, '*');
        }
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
          
          // Notify parent of state change
          if (this.name && window.parent) {
            window.parent.postMessage({
              type: 'STATE_UPDATE',
              name: this.name,
              value: this.value
            }, '*');
          }
        }
      }
    }
    
    function createSignal(initialValue, name) {
      return new Signal(initialValue, name);
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
    
    // Convert exported functions to customFunctions object
    const customFunctions = {};
  `;
}

function getCompiledCode(compiledCode: string): string {
  return `
    // Now execute the compiled code
    try {
      ${transformCompiledCode(compiledCode)}
      
      createApp();
    } catch (error) {
      console.error('Runtime error:', error);
      document.getElementById('app').innerHTML = '<div style="color: red; padding: 20px; border: 1px solid red; border-radius: 4px;"><strong>Error:</strong><br>' + error.message + '<br><pre style="font-size: 10px;">' + error.stack + '</pre></div>';
    }
  `;
}

function transformCompiledCode(code: string): string {
  return code
    .replace(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"];?\s*/g, "")
    .replace(
      /export\s+(async\s+)?function\s+(\w+)/g,
      (match, asyncKeyword, funcName) => {
        const isAsync = asyncKeyword ? "async " : "";
        return funcName === "createApp"
          ? `${isAsync}function createApp`
          : `customFunctions.${funcName} = ${isAsync}function`;
      }
    );
}
