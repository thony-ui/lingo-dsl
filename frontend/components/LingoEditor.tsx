"use client";

import Editor from "@monaco-editor/react";
import { Code2 } from "lucide-react";

interface LingoEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LingoEditor({ value, onChange }: LingoEditorProps) {
  return (
    <div className="h-full w-full border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
      <div className="bg-gradient-to-r from-violet-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-900 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
        <Code2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Lingo Editor
        </h2>
      </div>
      <Editor
        height="100%"
        defaultLanguage="plaintext"
        value={value}
        onChange={(value) => onChange(value || "")}
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
    </div>
  );
}
