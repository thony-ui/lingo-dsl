"use client";

import { Code2, Braces } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { LINGO_LANGUAGE, JAVASCRIPT_LANGUAGE } from "@/constants/editorConfig";

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
  onFunctionsChange,
}: LingoEditorProps) {
  return (
    <Tabs
      defaultValue="lingo"
      className="h-full w-full border-r border-zinc-200 dark:border-zinc-800 flex flex-col"
    >
      <EditorHeader />
      <EditorTabs
        lingoValue={lingoValue}
        functionsValue={functionsValue}
        onLingoChange={onLingoChange}
        onFunctionsChange={onFunctionsChange}
      />
    </Tabs>
  );
}

function EditorHeader() {
  return (
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
  );
}

interface EditorTabsProps {
  lingoValue: string;
  functionsValue: string;
  onLingoChange: (value: string) => void;
  onFunctionsChange: (value: string) => void;
}

function EditorTabs({
  lingoValue,
  functionsValue,
  onLingoChange,
  onFunctionsChange,
}: EditorTabsProps) {
  return (
    <>
      <TabsContent value="lingo" className="flex-1 m-0">
        <CodeEditor
          value={lingoValue}
          language={LINGO_LANGUAGE}
          onChange={onLingoChange}
        />
      </TabsContent>
      <TabsContent value="functions" className="flex-1 m-0">
        <CodeEditor
          value={functionsValue}
          language={JAVASCRIPT_LANGUAGE}
          onChange={onFunctionsChange}
        />
      </TabsContent>
    </>
  );
}
