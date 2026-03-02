import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import { ICommand } from "./ICommand";
import { Compiler } from "@lingo-dsl/compiler";

export class DevCommand implements ICommand {
  private jsFiles: string[] = [];

  constructor(private compiler: Compiler) {}

  async execute(args: string[]): Promise<void> {
    const port = 3000;
    const srcDir = path.join(process.cwd(), "src");

    // Auto-detect JavaScript files
    this.jsFiles = this.findJSFiles(srcDir);
    if (this.jsFiles.length > 0) {
      console.log(`Found ${this.jsFiles.length} JavaScript file(s)`);
      this.jsFiles.forEach(file => {
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
      } else if (url.startsWith("/custom-") && url.endsWith(".js")) {
        // Serve auto-detected custom JS files
        const fileName = url.replace("/custom-", "");
        const matchingFile = this.jsFiles.find(f => path.basename(f) === fileName);
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
      console.log("\n  Press Ctrl+C to stop\n");
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
    const customFunctionsPath = this.jsFiles.length > 0 ? this.jsFiles[0] : undefined;

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
        code = code.replace(
          `from '${jsFile}'`,
          `from './custom-${fileName}'`,
        );
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
  </style>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import { createApp } from './app.js';
    createApp();
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
