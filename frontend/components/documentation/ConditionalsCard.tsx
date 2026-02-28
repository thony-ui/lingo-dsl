import { Card } from "@/components/ui/card";

export function ConditionalsCard() {
  return (
    <Card className="p-5 bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/20 dark:to-red-950/20">
      <h3 className="font-bold text-base mb-3 text-zinc-900 dark:text-zinc-50">
        🔀 Conditionals
      </h3>
      <div className="space-y-3 text-sm">
        <ConditionalSyntax />
        <ComparisonOperators />
        <ConditionalExamples />
      </div>
    </Card>
  );
}

function ConditionalSyntax() {
  return (
    <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
      <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
        If Statement Syntax
      </div>
      <code className="text-xs block text-zinc-600 dark:text-zinc-400 mb-2">
        If [variable] is [operator] [value],
      </code>
      <code className="text-xs block text-zinc-600 dark:text-zinc-400 ml-4">
        [statement].
      </code>
    </div>
  );
}

function ComparisonOperators() {
  const operators = [
    { code: "equal to", desc: "Equals" },
    { code: "not equal to", desc: "Not equals" },
    { code: "greater than", desc: "Greater than" },
    { code: "less than", desc: "Less than" },
    { code: "greater than or equal to", desc: "≥" },
    { code: "less than or equal to", desc: "≤" },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
      <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
        Comparison Operators
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {operators.map((op) => (
          <div key={op.code}>
            <code className="text-violet-600 dark:text-violet-400">{op.code}</code> - {op.desc}
          </div>
        ))}
      </div>
    </div>
  );
}

function ConditionalExamples() {
  return (
    <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
      <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
        Examples
      </div>
      <div className="space-y-2 text-xs">
        <code className="block text-zinc-600 dark:text-zinc-400">
          If isLoggedIn is equal to true,
          <br />
          show a text saying &quot;Welcome!&quot;.
        </code>
        <code className="block text-zinc-600 dark:text-zinc-400">
          If score is greater than 50,
          <br />
          show a text saying &quot;High score!&quot;.
        </code>
      </div>
    </div>
  );
}
