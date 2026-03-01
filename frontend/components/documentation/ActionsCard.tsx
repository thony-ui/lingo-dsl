import { Card } from "@/components/ui/card";

export function ActionsCard() {
  return (
    <Card className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
      <h3 className="font-bold text-base mb-3 text-zinc-900 dark:text-zinc-50">
        ⚡ Actions Reference
      </h3>
      <div className="space-y-3 text-sm">
        <ActionCategories />
      </div>
    </Card>
  );
}

function ActionCategories() {
  const actionTypes = [
    {
      title: "Number Actions",
      actions: [
        { syntax: "increase [variable] by [amount].", example: "increase count by 1." },
        { syntax: "decrease [variable] by [amount].", example: "decrease count by 1." },
        { syntax: "set [variable] to [value].", example: "set count to 0." },
      ],
    },
    {
      title: "Boolean Actions",
      actions: [
        { syntax: "toggle [variable].", example: "toggle isActive." },
        { syntax: "set [variable] to [true/false].", example: "set isActive to true." },
      ],
    },
    {
      title: "Text Actions",
      actions: [
        { syntax: 'set [variable] to "[value]".', example: 'set username to "Alice".' },
      ],
    },
    {
      title: "List Actions",
      actions: [
        { syntax: "add [value] to [list].", example: "add inputText to todos." },
      ],
    },
    {
      title: "Custom Actions",
      actions: [
        { syntax: "[customAction] [variable].", example: "double count." },
        { syntax: '[customAction] [variable] with [param] "[value]".', example: 'divideBy score with factor "2".' },
        { syntax: '[customAction] [variable] with [param] "{variableName}".', example: 'fetchData results with count "{numRecords}".' },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3">
      {actionTypes.map((category) => (
        <ActionCategory key={category.title} {...category} />
      ))}
    </div>
  );
}

interface ActionCategoryProps {
  title: string;
  actions: Array<{ syntax: string; example: string }>;
}

function ActionCategory({ title, actions }: ActionCategoryProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
      <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
        {title}
      </div>
      <div className="space-y-1 text-xs">
        {actions.map((action, index) => (
          <code key={index} className="block text-zinc-600 dark:text-zinc-400">
            {action.syntax}
          </code>
        ))}
      </div>
      <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
        Example: <code>{actions[0].example}</code>
      </div>
    </div>
  );
}
