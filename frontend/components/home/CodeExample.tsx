import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const EXAMPLE_CODE = `# Create a counter in just a few lines
There is a number called count starting at 0.

Show a heading saying "Counter App".
Show a text saying "Count: {count}".
Show a button saying "Increment".

When I click the button "Increment",
increase count by 1.`;

export function CodeExample() {
  return (
    <div className="mt-32 max-w-4xl mx-auto">
      <CodeExampleHeader />
      <CodeExampleCard />
      <CodeExampleFooter />
    </div>
  );
}

function CodeExampleHeader() {
  return (
    <div className="text-center mb-8">
      <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
        See It in Action
      </h2>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        Build a fully functional counter app in just a few lines
      </p>
    </div>
  );
}

function CodeExampleCard() {
  return (
    <Card className="border-2 overflow-hidden">
      <CardHeader className="bg-zinc-900 dark:bg-zinc-950 text-white">
        <WindowControls />
      </CardHeader>
      <CardContent className="p-0">
        <CodeBlock code={EXAMPLE_CODE} />
      </CardContent>
    </Card>
  );
}

function WindowControls() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <CardTitle className="text-sm font-mono text-zinc-400 ml-4">
        counter.lingo
      </CardTitle>
    </div>
  );
}

interface CodeBlockProps {
  code: string;
}

function CodeBlock({ code }: CodeBlockProps) {
  return (
    <div className="bg-zinc-900 dark:bg-zinc-950 p-8">
      <pre className="text-sm text-zinc-100 font-mono leading-relaxed">
        <code className="language-lingo">{code}</code>
      </pre>
    </div>
  );
}

function CodeExampleFooter() {
  return (
    <p className="text-center mt-8 text-lg text-zinc-600 dark:text-zinc-400">
      That&apos;s it! No framework setup, no build tools—just plain Lingo. 🎉
    </p>
  );
}
