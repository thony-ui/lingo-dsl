/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import LingoEditor from "@/components/LingoEditor";
import LivePreview from "@/components/LivePreview";
import ExplainMode from "@/components/ExplainMode";
import DocumentationPanel from "@/components/DocumentationPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Sparkles, Home, BookOpen, Code2, Eye, FileCode } from "lucide-react";
import { 
  Compiler,
  LingoTokenizer,
  LingoParser,
  LingoAnalyzer,
  JSCodeGenerator,
  ConsoleErrorReporter
} from "@lingo-dsl/compiler";
import { Panel, Group, Separator } from "react-resizable-panels";
import { DEFAULT_CODE, DEFAULT_FUNCTIONS } from "@/constants/examples";

export default function Playground() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [functions, setFunctions] = useState(DEFAULT_FUNCTIONS);
  const [compiledCode, setCompiledCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showDocs, setShowDocs] = useState(false);
  const [liveState, setLiveState] = useState<Record<string, any>>({});

  // Listen for state updates from the preview iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'STATE_UPDATE') {
        setLiveState(prev => ({
          ...prev,
          [event.data.name]: event.data.value
        }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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
    // Reset live state when code changes
    setLiveState({});
  }, [code, functions, compileCode]);
  const handleLoadExample = useCallback((exampleCode: string, exampleFunctions?: string) => {
    setCode(exampleCode);
    setFunctions(exampleFunctions || DEFAULT_FUNCTIONS);
    setShowDocs(false); // Close the docs after loading an example
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header Navigation */}
      <nav className="border-b bg-white dark:bg-zinc-900 px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-1 sm:gap-2">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600 dark:text-violet-400" />
          <span className="text-sm sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 truncate max-w-30 sm:max-w-none">
            Lingo DSL
            <span className="hidden sm:inline"> Playground</span>
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setShowDocs(!showDocs)}
            className="h-8 px-2 sm:px-3"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Docs</span>
          </Button>
          <Button variant="outline" size="sm" asChild className="h-8 px-2 sm:px-3">
            <Link href="/">
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>
        </div>
      </nav>

      {/* Desktop: Resizable Panels */}
      <div className="hidden md:flex flex-1 overflow-hidden">
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
            <ExplainMode compiledCode={compiledCode} lingoCode={code} liveState={liveState} />
          </Panel>
        </Group>
      </div>

      {/* Mobile: Tabbed Layout */}
      <div className="flex md:hidden flex-1 overflow-hidden">
        <Tabs defaultValue="editor" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 rounded-none border-b h-auto shrink-0">
            <TabsTrigger value="editor" className="text-xs">
              <Code2 className="w-3.5 h-3.5 mr-1.5" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="explain" className="text-xs">
              <FileCode className="w-3.5 h-3.5 mr-1.5" />
              Explain
            </TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="flex-1 m-0 overflow-hidden">
            <LingoEditor 
              lingoValue={code} 
              functionsValue={functions}
              onLingoChange={setCode}
              onFunctionsChange={setFunctions}
            />
          </TabsContent>
          <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
            <LivePreview compiledCode={compiledCode} error={error} />
          </TabsContent>
          <TabsContent value="explain" className="flex-1 m-0 overflow-hidden">
            <ExplainMode compiledCode={compiledCode} lingoCode={code} liveState={liveState} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Documentation Sheet Overlay */}
      <Sheet open={showDocs} onOpenChange={setShowDocs}>
        <SheetContent side="right" className="w-full sm:w-135 md:w-160 lg:w-185 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Documentation & Examples</SheetTitle>
            <SheetDescription>
              Browse Lingo examples and documentation
            </SheetDescription>
          </SheetHeader>
          <DocumentationPanel onLoadExample={handleLoadExample} onClose={() => setShowDocs(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
