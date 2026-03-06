"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Sparkles, BookOpen, Code2, Palette, Zap, GitBranch, Repeat, Menu, X } from "lucide-react";
import { EXAMPLES } from "@/constants/examples";
import { TypeSystemCard } from "@/components/documentation/TypeSystemCard";
import { StylingCard } from "@/components/documentation/StylingCard";
import { WidgetsCard } from "@/components/documentation/WidgetsCard";
import { ActionsCard } from "@/components/documentation/ActionsCard";
import { EventsCard } from "@/components/documentation/EventsCard";
import { ConditionalsCard } from "@/components/documentation/ConditionalsCard";
import { LoopsCard } from "@/components/documentation/LoopsCard";

const NAV_SECTIONS = [
  { id: "getting-started", title: "Getting Started", icon: BookOpen },
  { id: "type-system", title: "Type System", icon: Code2 },
  { id: "styling", title: "Styling", icon: Palette },
  { id: "widgets", title: "Widgets", icon: Zap },
  { id: "actions", title: "Actions", icon: Code2 },
  { id: "events", title: "Events", icon: Zap },
  { id: "conditionals", title: "Conditionals", icon: GitBranch },
  { id: "loops", title: "Loops", icon: Repeat },
  { id: "examples", title: "Examples", icon: BookOpen },
];

export default function DocsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <DocsNavigation 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      <div className="container mx-auto flex">
        <DocsSidebar 
          mobileMenuOpen={mobileMenuOpen} 
          setMobileMenuOpen={setMobileMenuOpen} 
        />
        <DocsContent />
      </div>
    </div>
  );
}

function DocsNavigation({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen: boolean; setMobileMenuOpen: (open: boolean) => void }) {
  return (
    <nav className="border-b bg-white dark:bg-zinc-900 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            LingoUI
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/playground">
              <span className="hidden sm:inline">Try Playground</span>
              <span c{ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen: boolean; setMobileMenuOpen: (open: boolean) => void }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8">
        <nav className="px-4 space-y-1">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
            Documentation
          </p>
          {NAV_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 rounded-md transition-colors"
              >
                <Icon className="w-4 h-4" />
                {section.title}
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-white dark:bg-zinc-900">
          <nav className="px-4 py-6 space-y-1 overflow-y-auto h-full">
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
              Documentation
            </p>
            {NAV_SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 rounded-md transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {section.title}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </   href={`#${section.id}`}
              className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 rounded-md transition-colors"
            >
              <Icon className="w-4 h-4" />
              {section.title}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

function DocsContent() {
  return (
    <main className="flex-1 py-8 px-4 lg:px-12 max-w-4xl">
      <DocsHeader />
      <div className="mt-12 space-y-16">
        <GettingStartedSection />
        <TypeSystemSection />
        <StylingSection />
        <WidgetsSection />
        <ActionsSection />
        <EventsSection />
        <ConditionalsSection />
        <LoopsSection />
        <ExamplesSection />
      </div>
    </main>
  );
}

function DocsHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
        Documentation
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl">
        Learn LingoUI with comprehensive guides and API references.
        Build beautiful UIs with natural, English-like syntax.
      </p>
    </div>
  );
}

function GettingStartedSection() {
  return (
    <section id="getting-started" className="scroll-mt-20">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        Getting Started
      </h2>
      <div className="prose dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mt-6 mb-3">
          Installation
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Install the LingoUI CLI globally using npm:
        </p>
        <pre className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg overflow-x-auto">
          <code className="text-sm text-zinc-800 dark:text-zinc-200">
            npm install -g @lingo-dsl/cli
          </code>
        </pre>

        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mt-8 mb-3">
          Project Setup
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Follow these steps to create your first LingoUI application:
        </p>
        
        <div className="bg-violet-50 dark:bg-violet-950/30 p-4 rounded-lg mb-4">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
            <strong>Step 1:</strong> Create a new project directory
          </p>
          <pre className="bg-white dark:bg-zinc-900 p-3 rounded overflow-x-auto">
            <code className="text-sm text-zinc-800 dark:text-zinc-200">
              mkdir my-lingo-app && cd my-lingo-app
            </code>
          </pre>
        </div>

        <div className="bg-violet-50 dark:bg-violet-950/30 p-4 rounded-lg mb-4">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
            <strong>Step 2:</strong> Create a <code className="text-sm bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded">src</code> directory
          </p>
          <pre className="bg-white dark:bg-zinc-900 p-3 rounded overflow-x-auto">
            <code className="text-sm text-zinc-800 dark:text-zinc-200">
              mkdir src
            </code>
          </pre>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
            All your <code className="text-sm bg-white dark:bg-zinc-900 px-1 py-0.5 rounded">.lingo</code> files must be placed in the <code className="text-sm bg-white dark:bg-zinc-900 px-1 py-0.5 rounded">src</code> directory.
          </p>
        </div>

        <div className="bg-violet-50 dark:bg-violet-950/30 p-4 rounded-lg mb-4">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
            <strong>Step 3:</strong> Create your first <code className="text-sm bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded">.lingo</code> file
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
            Create <code className="text-sm bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded">src/counter.lingo</code> with the following content:
          </p>
          <pre className="bg-white dark:bg-zinc-900 p-3 rounded overflow-x-auto">
            <code className="text-sm text-zinc-800 dark:text-zinc-200">
{`There is a number called count starting at 0.

Show a heading saying "Counter".
Show text saying "Count: {count}".
Show a button saying "Increment".

When I click the button "Increment",
increase count by 1.`}
            </code>
          </pre>
        </div>

        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mt-8 mb-3">
          Run Development Server
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Start the development server to see your app in action:
        </p>
        <pre className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg overflow-x-auto">
          <code className="text-sm text-zinc-800 dark:text-zinc-200">
            lingoui dev
          </code>
        </pre>
        <p className="text-zinc-600 dark:text-zinc-400 mt-4">
          Visit <code className="text-sm bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded">http://localhost:3000</code> in your browser.
        </p>

        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mt-8 mb-3">
          Build for Production
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          When you're ready to deploy, build your application:
        </p>
        <pre className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg overflow-x-auto">
          <code className="text-sm text-zinc-800 dark:text-zinc-200">
            lingoui build
          </code>
        </pre>
      </div>
    </section>
  );
}

function TypeSystemSection() {
  return (
    <section id="type-system" className="scroll-mt-20">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        Type System
      </h2>
      <TypeSystemCard />
    </section>
  );
}

function StylingSection() {
  return (
    <section id="styling" className="scroll-mt-20">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        Styling & Layout
      </h2>
      <StylingCard />
    </section>
  );
}

function WidgetsSection() {
  return (
    <section id="widgets" className="scroll-mt-20">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        UI Widgets
      </h2>
      <WidgetsCard />
    </section>
  );
}

function ActionsSection() {
  return (
    <section id="actions" className="scroll-mt-20">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        Actions
      </h2>
      <ActionsCard />
    </section>
  );
}

function EventsSection() {
  return (
    <section id="events" className="scroll-mt-20">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        Events
      </h2>
      <EventsCard />
    </section>
  );
}

function ConditionalsSection() {
  return (
    <section id="conditionals" className="scroll-mt-20">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        Conditionals
      </h2>
      <ConditionalsCard />
    </section>
  );
}

function LoopsSection() {
  return (
    <section id="loops" className="scroll-mt-20">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        Loops
      </h2>
      <LoopsCard />
    </section>
  );
}

function ExamplesSection() {
  return (
    <section id="examples" className="scroll-mt-20">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        Examples
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        Explore these examples to learn LingoUI patterns. Try them in the{" "}
        <Link href="/playground" className="text-violet-600 dark:text-violet-400 hover:underline">
          playground
        </Link>
        .
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {EXAMPLES.map((example, index) => (
          <div
            key={index}
            className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:border-violet-400 dark:hover:border-violet-600 transition-colors"
          >
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              {example.title}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              {example.description}
            </p>
            <pre className="bg-zinc-100 dark:bg-zinc-900 p-3 rounded text-xs overflow-x-auto">
              <code className="text-zinc-800 dark:text-zinc-200">
                {example.code.split('\n').slice(0, 5).join('\n')}
                {example.code.split('\n').length > 5 ? '\n...' : ''}
              </code>
            </pre>
          </div>
        ))}
      </div>
    </section>
  );
}
