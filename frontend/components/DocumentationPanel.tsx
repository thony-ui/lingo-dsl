"use client";

import { Accordion } from "@/components/ui/accordion";
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
}

export default function DocumentationPanel({ onLoadExample }: DocumentationPanelProps) {
  // Set up custom event listener for load example
  if (typeof window !== "undefined") {
    window.addEventListener("loadExample", ((e: CustomEvent) => {
      onLoadExample(e.detail.code, e.detail.functions);
    }) as EventListener);
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-white dark:bg-zinc-900">
      <DocumentationHeader />
      <DocumentationContent />
    </div>
  );
}

function DocumentationHeader() {
  return (
    <div className="p-6 border-b sticky top-0 bg-white dark:bg-zinc-900 z-10">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
        📚 Documentation & Examples
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Click on any example to explore. Load it into the editor to try it out!
      </p>
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
