"use client";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { EXAMPLES } from "@/constants/examples";
import { ExampleCard } from "@/components/documentation/ExampleCard";
import { TypeSystemCard } from "@/components/documentation/TypeSystemCard";
import { StylingCard } from "@/components/documentation/StylingCard";
import { WidgetsCard } from "@/components/documentation/WidgetsCard";
import { ActionsCard } from "@/components/documentation/ActionsCard";
import { EventsCard } from "@/components/documentation/EventsCard";
import { ConditionalsCard } from "@/components/documentation/ConditionalsCard";
import { LoopsCard } from "@/components/documentation/LoopsCard";

interface DocumentationPanelProps {
  onLoadExample: (code: string, functions?: string) => void;
  onClose?: () => void;
}

export default function DocumentationPanel({ onLoadExample, onClose }: DocumentationPanelProps) {
  // Set up custom event listener for load example
  if (typeof window !== "undefined") {
    window.addEventListener("loadExample", ((e: CustomEvent) => {
      onLoadExample(e.detail.code, e.detail.functions);
    }) as EventListener);
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-white dark:bg-zinc-900">
      <DocumentationHeader onClose={onClose} />
      <DocumentationContent />
    </div>
  );
}

function DocumentationHeader({ onClose }: { onClose?: () => void }) {
  return (
    <div className="p-6 border-b sticky top-0 bg-white dark:bg-zinc-900 z-10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            📚 Documentation & Examples
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Click on any example to explore. Load it into the editor to try it out!
          </p>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0 h-8 w-8 rounded-full"
            aria-label="Close documentation"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function DocumentationContent() {
  return (
    <div className="p-6 space-y-4">
      <ExamplesSection />
      <LanguageReferenceSection />
    </div>
  );
}

function ExamplesSection() {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {EXAMPLES.map((example, index) => (
        <ExampleCard key={index} example={example} index={index} />
      ))}
    </Accordion>
  );
}

function LanguageReferenceSection() {
  return (
    <div className="space-y-4 mt-8">
      <LanguageReferenceHeader />
      <TypeSystemCard />
      <StylingCard />
      <WidgetsCard />
      <ActionsCard />
      <EventsCard />
      <ConditionalsCard />
      <LoopsCard />
    </div>
  );
}

function LanguageReferenceHeader() {
  return (
    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 border-b pb-2">
      📖 Language Reference
    </h2>
  );
}
