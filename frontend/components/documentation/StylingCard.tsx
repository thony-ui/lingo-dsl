import { Card } from "@/components/ui/card";

export function StylingCard() {
  return (
    <Card className="p-5 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20">
      <h3 className="font-bold text-base mb-3 text-zinc-900 dark:text-zinc-50">
        🎨 Styling & Layout
      </h3>
      <div className="space-y-3 text-sm">
        <StylePropertiesHeader />
        <StylePropertyExamples />
      </div>
    </Card>
  );
}

function StylePropertiesHeader() {
  return (
    <div>
      <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
        Style Properties
      </h4>
      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
        Add style keywords after widget declarations to customize appearance.
      </p>
    </div>
  );
}

function StylePropertyExamples() {
  const properties = [
    {
      title: "🎨 Text Color",
      syntax: "colored [color]",
      examples: [
        'Show a text saying "Green text" colored green.',
        'Show a heading saying "Title" colored blue.',
      ],
    },
    {
      title: "🖼️ Background Color",
      syntax: "background [color]",
      examples: [
        'Show a text saying "Highlighted" background yellow.',
        'Show a text saying "Info" background lightblue.',
      ],
    },
    {
      title: "📐 Text Alignment",
      syntax: "centered | aligned left | aligned right | aligned center",
      examples: [
        'Show a heading saying "Title" centered.',
        'Show a text saying "Right aligned" aligned right.',
      ],
    },
    {
      title: "📦 Layout Containers",
      syntax: 'row containing, | column gap "[size]" containing,',
      examples: [
        "Show a row containing,",
        'show a text saying "Item 1".',
        'show a text saying "Item 2".',
        "",
        'Show a column gap "10px" containing,',
        'show a text saying "First".',
        'show a text saying "Second".',
      ],
    },
    {
      title: "🌈 Combining Styles",
      syntax: 'Use "and" to combine multiple styles:',
      examples: [
        'Show a heading saying "Welcome" colored blue and centered.',
        'Show a text saying "Info" colored white and background darkblue.',
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3">
      {properties.map((prop) => (
        <StylePropertyCard key={prop.title} {...prop} />
      ))}
    </div>
  );
}

interface StylePropertyCardProps {
  title: string;
  syntax: string;
  examples: string[];
}

function StylePropertyCard({ title, syntax, examples }: StylePropertyCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
      <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
        {title}
      </div>
      <code className="text-xs text-zinc-600 dark:text-zinc-400 block mb-2">
        {syntax}
      </code>
      <code className="text-[11px] text-zinc-500 dark:text-zinc-500 block bg-zinc-50 dark:bg-zinc-950 p-2 rounded">
        {examples.map((ex, i) => (
          <span key={i}>
            {ex}
            {i < examples.length - 1 && <br />}
          </span>
        ))}
      </code>
    </div>
  );
}
