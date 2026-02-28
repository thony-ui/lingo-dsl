import { Card } from "@/components/ui/card";

export function TypeSystemCard() {
  return (
    <Card className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
      <CardHeader />
      <StateDeclarationSyntax />
      <TypeExamples />
      <StringInterpolation />
    </Card>
  );
}

function CardHeader() {
  return (
    <h3 className="font-bold text-base mb-3 text-zinc-900 dark:text-zinc-50">
      📝 Type System
    </h3>
  );
}

function StateDeclarationSyntax() {
  return (
    <div className="space-y-3 text-sm">
      <div>
        <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
          State Declaration
        </h4>
        <code className="text-xs bg-white dark:bg-zinc-900 px-2 py-1 rounded block mb-2">
          There is a [type] called [name] starting at [value].
        </code>
      </div>
    </div>
  );
}

function TypeExamples() {
  const types = [
    {
      icon: "🔢",
      name: "Number",
      example: 'There is a number called count starting at 0.',
      description: "For numeric values (integers and decimals)",
    },
    {
      icon: "📄",
      name: "Text",
      example: 'There is a text called name starting at "Alice".',
      description: "For string values (must use quotes)",
    },
    {
      icon: "✅",
      name: "Boolean",
      example: "There is a boolean called isActive starting at true.",
      description: "For true/false values",
    },
    {
      icon: "📋",
      name: "List",
      example: "There is a list called items starting empty.",
      description: "For arrays of items",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
      {types.map((type) => (
        <TypeCard key={type.name} {...type} />
      ))}
    </div>
  );
}

interface TypeCardProps {
  icon: string;
  name: string;
  example: string;
  description: string;
}

function TypeCard({ icon, name, example, description }: TypeCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
      <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
        {icon} {name}
      </div>
      <code className="text-xs text-zinc-600 dark:text-zinc-400 block">
        {example}
      </code>
      <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
        {description}
      </p>
    </div>
  );
}

function StringInterpolation() {
  return (
    <div className="bg-violet-50 dark:bg-violet-950/30 p-3 rounded-lg mt-3">
      <p className="text-xs text-zinc-700 dark:text-zinc-300">
        <strong>💡 String Interpolation:</strong> Use{" "}
        <code className="bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded">
          {"{variableName}"}
        </code>{" "}
        to embed variables in strings
      </p>
      <code className="text-xs text-zinc-600 dark:text-zinc-400 block mt-2">
        Show a text saying &quot;Hello, {"{name}"}! You have {"{count}"}{" "}
        points.&quot;.
      </code>
    </div>
  );
}
