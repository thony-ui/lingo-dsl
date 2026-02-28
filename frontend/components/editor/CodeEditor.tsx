"use client";

import Editor from "@monaco-editor/react";
import { EDITOR_OPTIONS, EDITOR_THEME } from "@/constants/editorConfig";

interface CodeEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ value, language, onChange }: CodeEditorProps) {
  const handleChange = (newValue: string | undefined) => {
    onChange(newValue || "");
  };

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      value={value}
      onChange={handleChange}
      theme={EDITOR_THEME}
      options={EDITOR_OPTIONS}
    />
  );
}
