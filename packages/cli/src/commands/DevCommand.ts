import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import { ICommand } from "./ICommand";
import { Compiler } from "@lingo-dsl/compiler";

export class DevCommand implements ICommand {
  private jsFiles: string[] = [];
  private sseClients: http.ServerResponse[] = [];
  private watchers: fs.FSWatcher[] = [];

  constructor(private compiler: Compiler) {}

  async execute(args: string[]): Promise<void> {
    const port = 3000;
    const srcDir = path.join(process.cwd(), "src");

    // Auto-detect JavaScript files
    this.jsFiles = this.findJSFiles(srcDir);
    if (this.jsFiles.length > 0) {
      console.log(`Found ${this.jsFiles.length} JavaScript file(s)`);
      this.jsFiles.forEach((file) => {
        console.log(`  - ${path.relative(process.cwd(), file)}`);
      });
    }

    console.log("Starting LingoUI dev server...");

    const server = http.createServer((req, res) => {
      const url = req.url || "/";

      if (url === "/" || url === "/index.html") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(this.generateDevHtml());
      } else if (url === "/app.js") {
        res.writeHead(200, { "Content-Type": "application/javascript" });
        const compiled = this.compileLingoFiles(srcDir);
        res.end(compiled);
      } else if (url === "/runtime.js") {
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(this.generateRuntimeStub());
      } else if (url === "/events") {
        // Server-Sent Events endpoint for hot reload
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        });
        res.write("data: connected\n\n");

        this.sseClients.push(res);

        req.on("close", () => {
          this.sseClients = this.sseClients.filter((client) => client !== res);
        });
      } else if (url.startsWith("/custom-") && url.endsWith(".js")) {
        // Serve auto-detected custom JS files
        const fileName = url.replace("/custom-", "");
        const matchingFile = this.jsFiles.find(
          (f) => path.basename(f) === fileName,
        );
        if (matchingFile) {
          try {
            const jsCode = fs.readFileSync(matchingFile, "utf-8");
            res.writeHead(200, { "Content-Type": "application/javascript" });
            res.end(jsCode);
          } catch (error) {
            res.writeHead(404);
            res.end("// JS file not found");
          }
        } else {
          res.writeHead(404);
          res.end("// JS file not found");
        }
      } else {
        res.writeHead(404);
        res.end("Not found");
      }
    });

    server.listen(port, () => {
      console.log(`\n✓ Dev server running at http://localhost:${port}`);
      console.log(`  Serving files from: ${srcDir}`);
      console.log(`  🔥 Hot reload enabled`);
      console.log("\n  Press Ctrl+C to stop\n");

      // Setup file watching for hot reload
      this.setupFileWatcher(srcDir);
    });

    // Clean up watchers on exit
    process.on("SIGINT", () => {
      this.watchers.forEach((watcher) => watcher.close());
      process.exit(0);
    });
  }

  private setupFileWatcher(srcDir: string): void {
    if (!fs.existsSync(srcDir)) {
      return;
    }

    // Watch the src directory recursively
    const watcher = fs.watch(
      srcDir,
      { recursive: true },
      (eventType, filename) => {
        if (
          filename &&
          (filename.endsWith(".lingo") || filename.endsWith(".js"))
        ) {
          console.log(`\n📝 File changed: ${filename}`);
          console.log("🔄 Reloading...\n");

          // Re-scan JS files in case new ones were added
          this.jsFiles = this.findJSFiles(srcDir);

          // Notify all connected clients to reload
          this.notifyClients("reload");
        }
      },
    );

    this.watchers.push(watcher);
  }

  private notifyClients(event: string): void {
    const message = `data: ${event}\n\n`;
    this.sseClients.forEach((client) => {
      try {
        client.write(message);
      } catch (error) {
        // Client disconnected, remove it
        this.sseClients = this.sseClients.filter((c) => c !== client);
      }
    });
  }

  private compileLingoFiles(srcDir: string): string {
    const lingoFiles = this.findLingoFiles(srcDir);

    if (lingoFiles.length === 0) {
      return "// No .lingo files found";
    }

    // Combine all .lingo files into one source
    const sources: string[] = [];
    for (const file of lingoFiles) {
      const source = fs.readFileSync(file, "utf-8");
      sources.push(source);
    }
    const combinedSource = sources.join("\n\n");

    // Use auto-detected JS files
    const customFunctionsPath =
      this.jsFiles.length > 0 ? this.jsFiles[0] : undefined;

    // Use the first file path for reference
    const result = this.compiler.compile(combinedSource, lingoFiles[0], {
      customFunctionsPath,
    });

    if (result.success && result.code) {
      // Replace runtime import with local stub
      let code = result.code.replace(
        "from '@lingo-dsl/runtime'",
        "from './runtime.js'",
      );

      // Replace custom functions import paths for dev server
      this.jsFiles.forEach((jsFile) => {
        const fileName = path.basename(jsFile);
        const relativePath = path.relative(process.cwd(), jsFile);
        code = code.replace(
          `from '${relativePath}'`,
          `from './custom-${fileName}'`,
        );
        code = code.replace(`from '${jsFile}'`, `from './custom-${fileName}'`);
      });

      return code;
    } else {
      let errorCode = "// Compilation errors:\n";
      for (const error of result.errors) {
        errorCode += `// ${error.location.line}:${error.location.column} - ${error.message}\n`;
      }
      return errorCode;
    }
  }

  private findLingoFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) {
      return [];
    }

    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...this.findLingoFiles(fullPath));
      } else if (entry.name.endsWith(".lingo")) {
        files.push(fullPath);
      }
    }

    return files;
  }

  private findJSFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) {
      return [];
    }

    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...this.findJSFiles(fullPath));
      } else if (entry.name.endsWith(".js")) {
        files.push(fullPath);
      }
    }

    return files;
  }

  private generateDevHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LingoUI Dev</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 20px;
    }
    #app {
      max-width: 600px;
      margin: 0 auto;
    }
    .row {
      display: flex;
      gap: 10px;
    }
    .column {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    button {
      padding: 8px 16px;
      cursor: pointer;
    }
    input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .hot-reload-indicator {
      position: fixed;
      top: 10px;
      right: 10px;
      background: #10b981;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }
    .hot-reload-indicator.show {
      opacity: 1;
    }
  </style>
</head>
<body>
  <div class="hot-reload-indicator" id="reload-indicator">🔄 Reloading...</div>
  <div id="app"></div>
  <script type="module">
    import { createApp } from './app.js';
    
    // Initialize app
    createApp();

    // Setup hot reload with Server-Sent Events
    const eventSource = new EventSource('/events');
    const indicator = document.getElementById('reload-indicator');

    eventSource.onmessage = (event) => {
      if (event.data === 'reload') {
        // Show reload indicator
        indicator.classList.add('show');
        
        // Reload the page after a brief delay
        setTimeout(() => {
          window.location.reload();
        }, 200);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Hot reload connection error:', error);
      eventSource.close();
    };

    // Display connection status in console
    eventSource.addEventListener('open', () => {
      console.log('🔥 Hot reload connected');
    });
  </script>
</body>
</html>`;
  }

  private generateRuntimeStub(): string {
    // Simplified runtime for dev mode
    return `
let currentEffect = null;

export class Signal {
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
      this.subscribers.forEach(effect => {
        queueMicrotask(() => effect.run());
      });
    }
  }
}

export class Effect {
  constructor(fn) {
    this.fn = fn;
    this.run();
  }

  run() {
    currentEffect = this;
    this.fn();
    currentEffect = null;
  }
}

export function createSignal(initialValue) {
  return new Signal(initialValue);
}

export function createEffect(fn) {
  return new Effect(fn);
}

export function renderApp(renderFn) {
  const root = document.getElementById('app');
  root.innerHTML = '';
  renderFn(root);
  return root;
}
`;
  }
}
