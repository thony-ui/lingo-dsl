import * as fs from "fs";
import * as path from "path";
import { ICommand } from "./ICommand";
import { Compiler } from "@lingo-dsl/compiler";

export class BuildCommand implements ICommand {
  constructor(private compiler: Compiler) {}

  async execute(args: string[]): Promise<void> {
    console.log("Building LingoUI app...");

    // Parse CLI arguments
    const customFunctionsPath = this.parseCustomFunctionsPath(args);

    const srcDir = path.join(process.cwd(), "src");
    const distDir = path.join(process.cwd(), "dist");

    // Create dist directory
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
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

    // Compile all files as one
    const result = this.compiler.compile(combinedSource, lingoFiles[0], {
      customFunctionsPath,
    });

    if (result.success && result.code) {
      const outputPath = path.join(distDir, "app.js");

      // Create output directory if needed
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });

      // Write compiled code
      fs.writeFileSync(outputPath, result.code);
      console.log(`  ✓ Generated ${path.relative(process.cwd(), outputPath)}`);
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

  private parseCustomFunctionsPath(args: string[]): string | undefined {
    const functionsIndex = args.indexOf("--functions");
    if (functionsIndex !== -1 && functionsIndex + 1 < args.length) {
      return args[functionsIndex + 1];
    }
    return undefined;
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
