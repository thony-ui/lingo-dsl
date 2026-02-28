#!/usr/bin/env node

import {
  Compiler,
  LingoTokenizer,
  LingoParser,
  LingoAnalyzer,
  JSCodeGenerator,
  ConsoleErrorReporter,
} from "@lingo-dsl/compiler";
import { BuildCommand } from "./commands/BuildCommand";
import { DevCommand } from "./commands/DevCommand";
import { ICommand } from "./commands/ICommand";

function createCompiler(): Compiler {
  const errorReporter = new ConsoleErrorReporter();
  const tokenizer = new LingoTokenizer(errorReporter);
  const parser = new LingoParser(errorReporter);
  const analyzer = new LingoAnalyzer(errorReporter);
  const codegen = new JSCodeGenerator();

  return new Compiler(tokenizer, parser, analyzer, codegen, errorReporter);
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const compiler = createCompiler();
  const commands = new Map<string, ICommand>([
    ["dev", new DevCommand(compiler)],
    ["build", new BuildCommand(compiler)],
  ]);

  if (!command || !commands.has(command)) {
    console.log("LingoUI CLI");
    console.log("");
    console.log("Usage:");
    console.log("  lingoui dev    - Start development server");
    console.log("  lingoui build  - Build for production");
    process.exit(1);
  }

  const cmd = commands.get(command)!;
  cmd.execute(args.slice(1)).catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });
}

main();
