"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import LingoEditor from "@/components/LingoEditor";
import LivePreview from "@/components/LivePreview";
import ExplainMode from "@/components/ExplainMode";
import DocumentationPanel from "@/components/DocumentationPanel";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Sparkles, Home, BookOpen } from "lucide-react";
import { 
  Compiler,
  LingoTokenizer,
  LingoParser,
  LingoAnalyzer,
  JSCodeGenerator,
  ConsoleErrorReporter
} from "@lingo-dsl/compiler";
import { Panel, Group, Separator } from "react-resizable-panels";

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

const DEFAULT_FUNCTIONS = 
`/**
 * Custom Functions for LingoUI
 * Define custom widgets and actions here!
 */

// Custom card widget
// Usage: Show a card with title "Hello" and description "World".
export function card(root, title, description) {
  const cardEl = document.createElement('div');
  cardEl.style.cssText = 'border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 8px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
  
  const titleEl = document.createElement('h3');
  titleEl.textContent = title;
  titleEl.style.marginTop = '0';
  cardEl.appendChild(titleEl);
  
  const descEl = document.createElement('p');
  descEl.textContent = description;
  descEl.style.marginBottom = '0';
  descEl.style.color = '#666';
  cardEl.appendChild(descEl);
  
  root.appendChild(cardEl);
  return cardEl;
}

// Custom action: Add one to a signal
// Usage: addOne count.
export function addOne(signal) {
  signal.set(signal.get() + 1);
}

// Custom action: Double a number
// Usage: double count.
export function double(signal) {
  signal.set(signal.get() * 2);
}

// Custom action: Reset to zero
// Usage: reset count.
export function reset(signal) {
  signal.set(0);
}
export async function fetchMeowFacts(signal) {
  try {
    const response = await fetch('https://meowfacts.herokuapp.com/');
    const data = await response.json();
    
    // The API returns { data: ["fact1", "fact2", ...] }
    if (data && data.data) {
      signal.set(data.data);
    }
  } catch (error) {
    console.error('Failed to fetch cat facts:', error);
    signal.set(['Failed to fetch cat facts. Please try again.']);
  }
}
export async function fetchMultipleMeowFacts(signal, count) {
  try {
    const response = await fetch(\`https://meowfacts.herokuapp.com/?count=\${count}\`);
    const data = await response.json();
    
    if (data && data.data) {
      signal.set(data.data);
    }
  } catch (error) {
    console.error('Failed to fetch cat facts:', error);
    signal.set(['Failed to fetch cat facts. Please try again.']);
  }
}

`;


export default function Playground() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [functions, setFunctions] = useState(DEFAULT_FUNCTIONS);
  const [compiledCode, setCompiledCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showDocs, setShowDocs] = useState(false);

  const compileCode = useCallback((lingoCode: string, customFunctions: string) => {
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
      
      // Inject custom functions before the main code
      const codeWithImports = `
${customFunctions}

${replaceCodeWithImports}
`;
      
      setCompiledCode(codeWithImports);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setCompiledCode("");
    }
  }, []);

  // Compile on mount and when code or functions change
  useEffect(() => {
    compileCode(code, functions);
  }, [code, functions, compileCode]);
  const handleLoadExample = useCallback((exampleCode: string, exampleFunctions?: string) => {
    setCode(exampleCode);
    setFunctions(exampleFunctions || DEFAULT_FUNCTIONS);
    setShowDocs(false); // Close the docs after loading an example
  }, []);

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
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setShowDocs(!showDocs)}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Docs & Examples
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
        </div>
      </nav>

      {/* Main Playground Grid */}
      <div className="flex flex-1 overflow-hidden">
        <Group orientation="horizontal">
          {/* Editor Panel */}
          <Panel defaultSize={33} minSize={20}>
            <LingoEditor 
              lingoValue={code} 
              functionsValue={functions}
              onLingoChange={setCode}
              onFunctionsChange={setFunctions}
            />
          </Panel>
          
          <Separator className="w-1 bg-zinc-200 dark:bg-zinc-800 hover:bg-violet-500 transition-colors" />
          
          {/* Preview Panel */}
          <Panel defaultSize={34} minSize={20}>
            <LivePreview compiledCode={compiledCode} error={error} />
          </Panel>
          
          <Separator className="w-1 bg-zinc-200 dark:bg-zinc-800 hover:bg-violet-500 transition-colors" />
          
          {/* Explain Mode Panel */}
          <Panel defaultSize={33} minSize={20}>
            <ExplainMode compiledCode={compiledCode} />
          </Panel>
        </Group>
      </div>

      {/* Documentation Sheet Overlay */}
      <Sheet open={showDocs} onOpenChange={setShowDocs}>
        <SheetContent side="right" className="w-full sm:w-[540px] md:w-[640px] lg:w-[740px] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Documentation & Examples</SheetTitle>
            <SheetDescription>
              Browse Lingo examples and documentation
            </SheetDescription>
          </SheetHeader>
          <DocumentationPanel onLoadExample={handleLoadExample} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
