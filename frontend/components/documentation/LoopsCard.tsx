import { Card } from "@/components/ui/card";

export function LoopsCard() {
  return (
    <Card className="p-5 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20">
      <h3 className="font-bold text-base mb-3 text-zinc-900 dark:text-zinc-50">
        🔁 Loops
      </h3>
      <div className="space-y-3 text-sm">
        <ForEachLoop />
      </div>
    </Card>
  );
}

function ForEachLoop() {
  return (
    <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
      <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
        For-Each Loop
      </div>
      <code className="text-xs block text-zinc-600 dark:text-zinc-400 mb-2">
        For each [itemName] in [listVariable],
      </code>
      <code className="text-xs block text-zinc-600 dark:text-zinc-400 ml-4">
        [statement].
      </code>
      <div className="mt-3 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 p-2 rounded">
        <strong>Example:</strong>
        <code className="block mt-1 text-zinc-600 dark:text-zinc-400">
          For each todo in todos,
          <br />
          show a text saying &quot;• {"{todo}"}&quot;.
        </code>
      </div>
    </div>
  );
}
