"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import LingoEditor from "@/components/LingoEditor";
import LivePreview from "@/components/LivePreview";
import ExplainMode from "@/components/ExplainMode";
import { Button } from "@/components/ui/button";
import { Sparkles, Home } from "lucide-react";
import { 
  Compiler,
  LingoTokenizer,
  LingoParser,
  LingoAnalyzer,
  JSCodeGenerator,
  ConsoleErrorReporter
} from "@lingo-dsl/compiler";

const DEFAULT_CODE = 
`# Simple Counter Example
# Demonstrates: state, show statements, events, and actions

There is a number called count starting at 0.

Show a heading saying "Counter App".
Show a text saying "hello world".
Show a text saying "Current count: {count}".

Show a button saying "Increment".
Show a button saying "Decrement".
Show a button saying "Reset".

When I click the button "Increment",
increase count by 1.

When I click the button "Decrement",
decrease count by 1.

When I click the button "Reset",
set count to 0.
`;


export default function Playground() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [compiledCode, setCompiledCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const compileCode = useCallback((lingoCode: string) => {
    try {
      const errorReporter = new ConsoleErrorReporter();
      const tokenizer = new LingoTokenizer(errorReporter);
      const parser = new LingoParser(errorReporter);
      const analyzer = new LingoAnalyzer(errorReporter);
      const codeGenerator = new JSCodeGenerator();
      
      const compiler = new Compiler(
        tokenizer,
        parser,
        analyzer,
        codeGenerator,
        errorReporter
      );
      
      const result = compiler.compile(lingoCode);
      
      if (!result.success || !result.code) {
        throw new Error(result.errors.map(e => e.message).join('\n') || 'Compilation failed');
      }
      
      // Add import for runtime functions
      const replaceCodeWithImports = result.code.replace("import { createSignal, createEffect, renderApp } from '@lingo-dsl/runtime';", "import { createSignal, createEffect, renderApp } from 'https://cdn.jsdelivr.net/npm/@lingo-dsl/runtime@0.1.0/+esm';");
      const codeWithImports = `
${replaceCodeWithImports}
`;
      
      setCompiledCode(codeWithImports);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setCompiledCode("");
    }
  }, []);

  // Compile on mount and when code changes
  useEffect(() => {
    compileCode(code);
  }, [code, compileCode]);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header Navigation */}
      <nav className="border-b bg-white dark:bg-zinc-900 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <Link href="/" className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Lingo DSL Playground</span>
        </div>
        </Link>
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </Button>
      </nav>

      {/* Main Playground Grid */}
      <div className="grid grid-cols-3 flex-1 overflow-hidden">
        {/* Left Panel: Editor */}
        <LingoEditor value={code} onChange={setCode} />
        
        {/* Middle Panel: Live Preview */}
        <LivePreview compiledCode={compiledCode} error={error} />
        
        {/* Right Panel: Explain Mode */}
        <ExplainMode compiledCode={compiledCode} />
      </div>
    </div>
  );
}
