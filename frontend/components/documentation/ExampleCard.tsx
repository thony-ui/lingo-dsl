"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Copy, Check, ChevronRight } from "lucide-react";
import type { Example } from "@/constants/examples";

interface ExampleCardProps {
  example: Example;
  index: number;
}

export function ExampleCard({ example, index }: ExampleCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(example.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLoadExample = () => {
    window.dispatchEvent(
      new CustomEvent("loadExample", {
        detail: { code: example.code, functions: example.functions },
      })
    );
  };

  return (
    <AccordionItem
      value={`item-${index}`}
      className="border rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-800/50"
    >
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-zinc-100 dark:hover:bg-zinc-800">
        <ExampleHeader example={example} />
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <Card className="p-4 bg-white dark:bg-zinc-900">
          <ExampleActions
            isCopied={isCopied}
            onCopy={handleCopy}
            onLoad={handleLoadExample}
          />
          <CodePreview code={example.code} />
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
}

interface ExampleHeaderProps {
  example: Example;
}

function ExampleHeader({ example }: ExampleHeaderProps) {
  return (
    <div className="flex flex-col items-start gap-2 text-left flex-1">
      <div className="flex items-center gap-2 w-full">
        <span className="font-semibold text-zinc-900 dark:text-zinc-50">
          {example.title}
        </span>
      </div>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        {example.description}
      </p>
      <ExampleTags tags={example.tags} />
    </div>
  );
}

interface ExampleTagsProps {
  tags: string[];
}

function ExampleTags({ tags }: ExampleTagsProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {tags.map((tag, tagIndex) => (
        <span
          key={tagIndex}
          className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

interface ExampleActionsProps {
  isCopied: boolean;
  onCopy: () => void;
  onLoad: () => void;
}

function ExampleActions({ isCopied, onCopy, onLoad }: ExampleActionsProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        Lingo Code
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          className="h-7 text-xs"
        >
          {isCopied ? (
            <>
              <Check className="w-3 h-3 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </>
          )}
        </Button>
        <Button
          size="sm"
          onClick={onLoad}
          className="h-7 text-xs bg-violet-600 hover:bg-violet-700"
        >
          <ChevronRight className="w-3 h-3 mr-1" />
          Load in Editor
        </Button>
      </div>
    </div>
  );
}

interface CodePreviewProps {
  code: string;
}

function CodePreview({ code }: CodePreviewProps) {
  return (
    <pre className="text-xs bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg overflow-x-auto border">
      <code className="text-zinc-800 dark:text-zinc-200">{code}</code>
    </pre>
  );
}
