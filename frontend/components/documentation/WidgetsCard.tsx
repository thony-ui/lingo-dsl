import { Card } from "@/components/ui/card";

export function WidgetsCard() {
  return (
    <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
      <h3 className="font-bold text-base mb-3 text-zinc-900 dark:text-zinc-50">
        🧩 Widget Reference
      </h3>
      <div className="space-y-3 text-sm">
        <WidgetSyntax />
        <WidgetCategories />
      </div>
    </Card>
  );
}

function WidgetSyntax() {
  return (
    <div>
      <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
        Basic Syntax
      </h4>
      <code className="text-xs bg-white dark:bg-zinc-900 px-2 py-1 rounded block">
        Show a [widget] saying &quot;[content]&quot;.
      </code>
    </div>
  );
}

function WidgetCategories() {
  return (
    <div className="grid grid-cols-1 gap-2 mt-3">
      <InteractiveWidgets />
      <TextWidgets />
      <FormattingWidgets />
      <LayoutWidgets />
      <LinkWidgets />
      <CustomWidgets />
    </div>
  );
}

function InteractiveWidgets() {
  return (
    <WidgetCategoryAccordion title="Interactive Widgets">
      <WidgetItem
        name="button"
        description="Clickable button"
        example='Show a button saying "Click me".'
      />
      <WidgetItem
        name="input"
        description="Text input field (binds to variable)"
        example="Show an input called username."
      />
    </WidgetCategoryAccordion>
  );
}

function TextWidgets() {
  return (
    <WidgetCategoryAccordion title="Text & Headings">
      <div className="space-y-2 text-xs">
        <WidgetListItem name="heading" description="Large heading (h1)" />
        <WidgetListItem name="text" description="Regular text (span)" />
        <WidgetListItem name="paragraph" description="Paragraph (p)" />
      </div>
    </WidgetCategoryAccordion>
  );
}

function FormattingWidgets() {
  const widgets = [
    { name: "bold", desc: "Bold text" },
    { name: "italic", desc: "Italic text" },
    { name: "strong", desc: "Strong emphasis" },
    { name: "emphasis", desc: "Emphasized text" },
    { name: "underline", desc: "Underlined text" },
    { name: "strikethrough", desc: "Strikethrough text" },
    { name: "small", desc: "Small text" },
    { name: "mark", desc: "Highlighted text" },
    { name: "deleted", desc: "Deleted text" },
    { name: "code", desc: "Code snippet" },
  ];

  return (
    <WidgetCategoryAccordion title="Text Formatting">
      <div className="grid grid-cols-2 gap-2 text-xs">
        {widgets.map((w) => (
          <div key={w.name}>
            <code className="text-violet-600 dark:text-violet-400">{w.name}</code> - {w.desc}
          </div>
        ))}
      </div>
    </WidgetCategoryAccordion>
  );
}

function LayoutWidgets() {
  return (
    <WidgetCategoryAccordion title="Layout & Structure">
      <div className="space-y-2 text-xs">
        <WidgetItem
          name="row"
          description="Horizontal flex container"
          example="Show a row containing,"
        />
        <WidgetItem
          name="column"
          description="Vertical flex container"
          example='Show a column gap "10px" containing,'
        />
        <WidgetListItem name="container" description="Generic container (div)" />
        <WidgetListItem name="section" description="Section element" />
      </div>
    </WidgetCategoryAccordion>
  );
}

function LinkWidgets() {
  return (
    <WidgetCategoryAccordion title="Links & Lists">
      <div className="space-y-2 text-xs">
        <WidgetListItem name="link" description="Hyperlink" />
        <WidgetListItem name="unorderedlist" description="Bullet list (ul)" />
        <WidgetListItem name="listitem" description="List item (li)" />
      </div>
    </WidgetCategoryAccordion>
  );
}

function CustomWidgets() {
  return (
    <WidgetCategoryAccordion title="Custom Widgets">
      <div className="space-y-2 text-xs">
        <p className="text-zinc-600 dark:text-zinc-400 mb-2">
          Define your own widgets in a{" "}
          <code className="bg-violet-50 dark:bg-violet-950/30 px-1.5 py-0.5 rounded">
            functions.js
          </code>{" "}
          file:
        </p>
        <code className="block text-[11px] text-zinc-500 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-950 p-2 rounded">
          Show a card with title &quot;Hello&quot; and description &quot;World&quot;.
        </code>
        <code className="block text-[11px] text-zinc-500 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-950 p-2 rounded">
          Show an alert with message &quot;Warning!&quot; and type &quot;warning&quot;.
        </code>
        <code className="block text-[11px] text-zinc-500 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-950 p-2 rounded">
          Show a badge with text &quot;New&quot; and color &quot;blue&quot;.
        </code>
      </div>
    </WidgetCategoryAccordion>
  );
}

interface WidgetCategoryAccordionProps {
  title: string;
  children: React.ReactNode;
}

function WidgetCategoryAccordion({ title, children }: WidgetCategoryAccordionProps) {
  return (
    <details className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
      <summary className="font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer text-xs">
        {title}
      </summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}

interface WidgetItemProps {
  name: string;
  description: string;
  example?: string;
}

function WidgetItem({ name, description, example }: WidgetItemProps) {
  return (
    <div>
      <code className="text-violet-600 dark:text-violet-400">{name}</code>
      <span className="text-zinc-600 dark:text-zinc-400"> - {description}</span>
      {example && (
        <code className="block mt-1 text-[11px] text-zinc-500 dark:text-zinc-500">
          {example}
        </code>
      )}
    </div>
  );
}

interface WidgetListItemProps {
  name: string;
  description: string;
}

function WidgetListItem({ name, description }: WidgetListItemProps) {
  return (
    <div>
      <code className="text-violet-600 dark:text-violet-400">{name}</code>
      <span className="text-zinc-600 dark:text-zinc-400"> - {description}</span>
    </div>
  );
}
