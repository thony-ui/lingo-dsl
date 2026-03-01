"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Home, Sparkles } from "lucide-react";
import { EXAMPLES } from "@/constants/examples";
import { ExampleCard } from "@/components/documentation/ExampleCard";
import { TypeSystemCard } from "@/components/documentation/TypeSystemCard";
import { StylingCard } from "@/components/documentation/StylingCard";
import { WidgetsCard } from "@/components/documentation/WidgetsCard";
import { ActionsCard } from "@/components/documentation/ActionsCard";
import { EventsCard } from "@/components/documentation/EventsCard";
import { ConditionalsCard } from "@/components/documentation/ConditionalsCard";
import { LoopsCard } from "@/components/documentation/LoopsCard";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-violet-950">
      <DocsNavigation />
      <DocsContent />
    </div>
  );
}

function DocsNavigation() {
  return (
    <nav className="border-b bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Lingo DSL
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/playground">
              Try Playground
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

function DocsContent() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <DocsHeader />
      <div className="mt-8 space-y-8">
        <ExamplesSection />
        <LanguageReferenceSection />
      </div>
    </div>
  );
}

function DocsHeader() {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
        📚 Documentation
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
        Learn Lingo DSL with examples and comprehensive reference guides.
        Build beautiful UIs with natural, English-like syntax.
      </p>
    </div>
  );
}

function ExamplesSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 pb-2 border-b">
        🎯 Examples
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
        Explore examples below. Use the playground to try them out interactively!
      </p>
      <Accordion type="single" collapsible className="space-y-4">
        {EXAMPLES.map((example, index) => (
          <ExampleCard 
            key={index} 
            example={example} 
            index={index}
          />
        ))}
      </Accordion>
    </div>
  );
}

function LanguageReferenceSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 pb-2 border-b">
        📖 Language Reference
      </h2>
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
