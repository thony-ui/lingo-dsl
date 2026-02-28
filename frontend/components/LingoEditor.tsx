"use client";

import Editor from "@monaco-editor/react";
import { Code2, Braces } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LingoEditorProps {
  lingoValue: string;
  functionsValue: string;
  onLingoChange: (value: string) => void;
  onFunctionsChange: (value: string) => void;
}

export default function LingoEditor({ 
  lingoValue, 
  functionsValue,
  onLingoChange, 
  onFunctionsChange 
}: LingoEditorProps) {
  return (
    <Tabs defaultValue="lingo" className="h-full w-full border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
      <div className="bg-gradient-to-r from-violet-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-900 px-4 py-2 border-b border-zinc-200 dark:border-zinc-800">
        <TabsList className="grid w-full grid-cols-2 h-9">
          <TabsTrigger value="lingo" className="text-xs">
            <Code2 className="w-3.5 h-3.5 mr-1.5" />
            Lingo Code
          </TabsTrigger>
          <TabsTrigger value="functions" className="text-xs">
            <Braces className="w-3.5 h-3.5 mr-1.5" />
            functions.js
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="lingo" className="flex-1 m-0">
        <Editor
          height="100%"
          defaultLanguage="plaintext"
          value={lingoValue}
          onChange={(value) => onLingoChange(value || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            padding: { top: 16, bottom: 16 },
          }}
        />
      </TabsContent>
      
      <TabsContent value="functions" className="flex-1 m-0">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={functionsValue}
          onChange={(value) => onFunctionsChange(value || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            padding: { top: 16, bottom: 16 },
          }}
        />
      </TabsContent>
    </Tabs>
  );
}
