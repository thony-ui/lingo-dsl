import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Zap, Code2, Eye, ArrowRight, Github } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-violet-950">
      {/* Navigation */}
      <nav className="border-b bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Lingo DSL</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="https://github.com" target="_blank">
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
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Write UIs in Plain English
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-6 bg-gradient-to-r from-violet-600 to-blue-600 dark:from-violet-400 dark:to-blue-400 bg-clip-text text-transparent">
            Lingo DSL
          </h1>
          
          <p className="text-2xl md:text-3xl text-zinc-700 dark:text-zinc-300 mb-6 font-semibold">
            A human-friendly language for building reactive UIs
          </p>
          
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Write interactive applications in plain English. No complex syntax, no boilerplate—just natural language that compiles to efficient, reactive JavaScript.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/playground">
                Try the Playground
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link href="https://github.com" target="_blank">
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <CardTitle className="text-2xl">Natural Syntax</CardTitle>
              <CardDescription className="text-base">
                Write code that reads like English. No curly braces, no semicolons—just clear, declarative statements that anyone can understand.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-xl">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl">Reactive by Default</CardTitle>
              <CardDescription className="text-base">
                Built-in reactivity system automatically updates your UI when state changes. No manual DOM manipulation needed.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-green-300 dark:hover:border-green-700 transition-all hover:shadow-xl">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">Live Preview</CardTitle>
              <CardDescription className="text-base">
                See your changes instantly in the interactive playground. Edit code and watch your app come to life in real-time.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Code Example */}
        <div className="mt-32 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              See It in Action
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Build a fully functional counter app in just a few lines
            </p>
          </div>
          
          <Card className="border-2 overflow-hidden">
            <CardHeader className="bg-zinc-900 dark:bg-zinc-950 text-white">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <CardTitle className="text-sm font-mono text-zinc-400 ml-4">counter.lingo</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-zinc-900 dark:bg-zinc-950 p-8">
                <pre className="text-sm text-zinc-100 font-mono leading-relaxed">
                  <code className="language-lingo">{`# Create a counter in just a few lines
There is a number called count starting at 0.

Show a heading saying "Counter App".
Show a text saying "Count: {count}".
Show a button saying "Increment".

When I click the button "Increment",
increase count by 1.`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
          
          <p className="text-center mt-8 text-lg text-zinc-600 dark:text-zinc-400">
            That&apos;s it! No framework setup, no build tools—just plain Lingo. 🎉
          </p>
        </div>

        <Separator className="my-20 max-w-4xl mx-auto" />

        {/* Footer */}
        <div className="text-center text-zinc-500 dark:text-zinc-500 pb-8">
          <p className="text-lg">Built with TypeScript, React, and ❤️</p>
          <p className="mt-2 text-sm">© 2026 Lingo DSL. Open source and free forever.</p>
        </div>
      </div>
    </div>
  );
}
