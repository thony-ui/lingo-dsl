import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Github, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <div className="container mx-auto px-4 py-20 md:py-32">
      <div className="max-w-5xl mx-auto text-center">
        <HeroBadge />
        <HeroHeading />
        <HeroSubheading />
        <HeroDescription />
        <HeroActions />
      </div>
    </div>
  );
}

function HeroBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-8">
      <Sparkles className="w-4 h-4" />
      Write UIs in Plain English
    </div>
  );
}

function HeroHeading() {
  return (
    <h1 className="text-6xl md:text-8xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-6 bg-gradient-to-r from-violet-600 to-blue-600 dark:from-violet-400 dark:to-blue-400 bg-clip-text text-transparent">
      Lingo DSL
    </h1>
  );
}

function HeroSubheading() {
  return (
    <p className="text-2xl md:text-3xl text-zinc-700 dark:text-zinc-300 mb-6 font-semibold">
      A human-friendly language for building reactive UIs
    </p>
  );
}

function HeroDescription() {
  return (
    <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
      Write interactive applications in plain English. No complex syntax, no
      boilerplate—just natural language that compiles to efficient, reactive
      JavaScript.
    </p>
  );
}

function HeroActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Button size="lg" className="text-lg px-8 py-6" asChild>
        <Link href="/playground">
          Try the Playground
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="text-lg px-8 py-6"
        asChild
      >
        <Link href="https://github.com/thony-ui/lingo-dsl" target="_blank">
          <Github className="w-5 h-5 mr-2" />
          View on GitHub
        </Link>
      </Button>
    </div>
  );
}
