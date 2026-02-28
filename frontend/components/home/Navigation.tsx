import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Github, ArrowRight } from "lucide-react";

export function Navigation() {
  return (
    <nav className="border-b bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Logo />
        <NavigationActions />
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Sparkles className="w-6 h-6 text-violet-600 dark:text-violet-400" />
      <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
        Lingo DSL
      </span>
    </div>
  );
}

function NavigationActions() {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href="https://github.com/thony-ui/lingo-dsl" target="_blank">
          <Github className="w-4 h-4 mr-2" />
          GitHub
        </Link>
      </Button>
      <Button asChild>
        <Link href="/playground">
          Playground
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </Button>
    </div>
  );
}
