import * as fs from "fs";
import * as path from "path";
import { ICommand } from "./ICommand";
import { Compiler } from "@lingo-dsl/compiler";

export class BuildCommand implements ICommand {
  private jsFiles: string[] = [];

  constructor(private compiler: Compiler) {}

  async execute(args: string[]): Promise<void> {
    console.log("Building LingoUI app...");

    const srcDir = path.join(process.cwd(), "src");
    const distDir = path.join(process.cwd(), "dist");

    // Create dist directory
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // Auto-detect JavaScript files
    this.jsFiles = this.findJSFiles(srcDir);
    if (this.jsFiles.length > 0) {
      console.log(`Found ${this.jsFiles.length} JavaScript file(s)`);
    }

    // Find all .lingo files
    const lingoFiles = this.findLingoFiles(srcDir);

    if (lingoFiles.length === 0) {
      console.error("No .lingo files found in src/");
      process.exit(1);
    }

    let hasErrors = false;

    // Combine all .lingo files into one source
    console.log(`Compiling ${lingoFiles.length} file(s)...`);
    const sources: string[] = [];
    for (const file of lingoFiles) {
      console.log(`  Reading ${path.relative(process.cwd(), file)}...`);
      const source = fs.readFileSync(file, "utf-8");
      sources.push(source);
    }
    const combinedSource = sources.join("\n\n");

    // Use auto-detected JS files
    const customFunctionsPath = this.jsFiles.length > 0 ? this.jsFiles[0] : undefined;

    // Compile all files as one
    const result = this.compiler.compile(combinedSource, lingoFiles[0], {
      customFunctionsPath,
    });

    if (result.success && result.code) {
      const outputPath = path.join(distDir, "app.js");

      // Create output directory if needed
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });

      // Process code: Replace runtime and custom function imports
      let code = result.code;
      
      // Replace runtime import with relative path
      code = code.replace(
        "from '@lingo-dsl/runtime'",
        "from './runtime.js'",
      );

      // Replace custom functions import paths
      this.jsFiles.forEach((jsFile, index) => {
        const fileName = path.basename(jsFile);
        const relativePath = path.relative(process.cwd(), jsFile);
        code = code.replace(
          `from '${relativePath}'`,
          `from './${fileName}'`,
        );
        code = code.replace(
          `from '${jsFile}'`,
          `from './${fileName}'`,
        );
      });

      // Write compiled code
      fs.writeFileSync(outputPath, code);
      console.log(`  ✓ Generated ${path.relative(process.cwd(), outputPath)}`);

      // Copy custom JS files to dist
      if (this.jsFiles.length > 0) {
        console.log("Copying custom JavaScript files...");
        this.jsFiles.forEach((jsFile) => {
          const fileName = path.basename(jsFile);
          const destPath = path.join(distDir, fileName);
          fs.copyFileSync(jsFile, destPath);
          console.log(`  ✓ Copied ${fileName}`);
        });
      }

      // Bundle runtime
      this.bundleRuntime(distDir);
    } else {
      hasErrors = true;
      console.error(`  ✗ Failed to compile`);
      for (const error of result.errors) {
        console.error(
          `    ${error.location.line}:${error.location.column} - ${error.message}`,
        );
      }
    }

    // Generate HTML file
    this.generateIndexHtml(distDir);

    if (hasErrors) {
      console.error("\nBuild completed with errors");
      process.exit(1);
    } else {
      console.log("\n✓ Build completed successfully");
      console.log(`Output: ${distDir}`);
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

  private bundleRuntime(distDir: string): void {
    console.log("Bundling runtime...");
    
    // Create a minimal runtime bundle for production
    const runtimeCode = `
// LingoUI Runtime - Production Bundle
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
  if (!root) {
    console.error('App root element not found');
    return null;
  }
  root.innerHTML = '';
  renderFn(root);
  return root;
}
`;

    const runtimePath = path.join(distDir, "runtime.js");
    fs.writeFileSync(runtimePath, runtimeCode);
    console.log("  ✓ Bundled runtime.js");
  }

  private generateIndexHtml(distDir: string): void {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LingoUI App</title>
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
    // Import and run the app
    import { createApp } from './app.js';
    createApp();
  </script>
</body>
</html>`;

    fs.writeFileSync(path.join(distDir, "index.html"), html);
    console.log("  ✓ Generated index.html");
  }
}
