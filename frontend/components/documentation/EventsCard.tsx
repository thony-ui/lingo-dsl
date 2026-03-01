import { Card } from "@/components/ui/card";

export function EventsCard() {
  return (
    <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
      <h3 className="font-bold text-base mb-3 text-zinc-900 dark:text-zinc-50">
        🎯 Event Handling
      </h3>
      <div className="space-y-3 text-sm">
        <PageLoadSyntax />
        <ClickEventSyntax />
        <TypeEventSyntax />
      </div>
    </Card>
  );
}

function PageLoadSyntax() {
  return (
    <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
      <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
        Page Load Events
      </div>
      <code className="text-xs block text-zinc-600 dark:text-zinc-400 mb-2">
        On page load,
      </code>
      <code className="text-xs block text-zinc-600 dark:text-zinc-400 ml-4">
        [action].
      </code>
      <div className="mt-3 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 p-2 rounded">
        <strong>Example:</strong>
        <code className="block mt-1 text-zinc-600 dark:text-zinc-400">
          On page load,
          <br />
          loadInitialData facts.
        </code>
      </div>
    </div>
  );
}

function ClickEventSyntax() {
  return (
    <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
      <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
        Click Events
      </div>
      <code className="text-xs block text-zinc-600 dark:text-zinc-400 mb-2">
        When I click the button &quot;[buttonText]&quot;,
      </code>
      <code className="text-xs block text-zinc-600 dark:text-zinc-400 ml-4">
        [action].
      </code>
      <div className="mt-3 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 p-2 rounded">
        <strong>Example:</strong>
        <code className="block mt-1 text-zinc-600 dark:text-zinc-400">
          When I click the button &quot;Submit&quot;,
          <br />
          add inputText to todos.
        </code>
      </div>
    </div>
  );
}

function TypeEventSyntax() {
  return (
    <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
      <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
        Input Events
      </div>
      <code className="text-xs block text-zinc-600 dark:text-zinc-400 mb-2">
        When I type the input &quot;[inputName]&quot;,
      </code>
      <code className="text-xs block text-zinc-600 dark:text-zinc-400 ml-4">
        [action].
      </code>
      <div className="mt-3 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 p-2 rounded">
        <strong>Example:</strong>
        <code className="block mt-1 text-zinc-600 dark:text-zinc-400">
          When I type the input called searchBox,
          <br />
          set query to searchBox.
        </code>
      </div>
    </div>
  );
}
