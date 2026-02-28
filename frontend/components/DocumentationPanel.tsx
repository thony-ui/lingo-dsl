"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check, ChevronRight } from "lucide-react";

interface Example {
  title: string;
  description: string;
  code: string;
  functions?: string;
  tags: string[];
}

const examples: Example[] = [
  {
    title: "Counter App",
    description: "Learn the basics: state, show statements, events, and actions",
    tags: ["Beginner", "State", "Events"],
    code: `# Simple Counter Example
# Demonstrates: state, show statements, events, and actions

There is a number called count starting at 0.

Show a heading saying "Counter App".
Show a text saying "hello world".
Show a text saying "Current count: {count}".

Show a button saying "Increment".
Show a button saying "Decrement".
Show a button saying "Reset".

When I click the button "Increment",
increase count by 1.

When I click the button "Decrement",
decrease count by 1.

When I click the button "Reset",
set count to 0.`,
  },
  {
    title: "Todo List",
    description: "Work with lists, for-each loops, and dynamic data",
    tags: ["Lists", "Loops", "Input"],
    code: `# Todo List Example
# Demonstrates: lists, for-each loops, and list manipulation

There is a list called todos starting empty.
There is a text called inputText starting at "".

Show a heading saying "My Todo List".

# Input area
Show an input called inputText.
Show a button saying "Add Todo".

# Add todo when button clicked
When I click the button "Add Todo",
add inputText to todos.
set inputText to "".

# Display all todos
For each item in todos,
show a text saying "• {item}".`,
  },
  {
    title: "Profile Settings",
    description: "Use conditionals, booleans, and toggle actions",
    tags: ["Conditionals", "Boolean", "State"],
    code: `# Profile Settings Example
# Demonstrates: conditionals, multiple state types, and toggle

There is a text called username starting at "Guest".
There is a boolean called isLoggedIn starting at false.
There is a number called score starting at 0.

Show a heading saying "User Profile".

# Login/Logout button
Show a button saying "Toggle Login".

When I click the button "Toggle Login",
toggle isLoggedIn.

# Conditional display based on login status
If isLoggedIn is equal to true,
show a text saying "Welcome, {username}!".
show a text saying "Your score: {score}".

If isLoggedIn is equal to false,
show a text saying "Please log in to view your profile.".

# Score controls (only visible when logged in)
If isLoggedIn is equal to true,
show a button saying "Earn Points".

When I click the button "Earn Points",
increase score by 10.

# High score message
If score is greater than 50,
show a text saying "🎉 High score achieved!".`,
  },
  {
    title: "Custom Widgets & Actions",
    description: "Extend Lingo with custom widgets and actions via JavaScript",
    tags: ["Advanced", "Custom", "Extensibility"],
    code: `# Custom Widgets Example
# This demonstrates using custom widgets defined in functions.js

There is a number called clicks starting at 0.

Show a heading saying "Custom Widgets & Actions Demo".

# Use custom card widget
Show a card with title "Welcome" and description "This is a custom card widget!".

Show a card with title "Features" and description "You can create any custom widget you want.".

# Use custom alert widget
Show a alert with message "This is an info alert" and type "info".

Show a alert with message "Warning: Custom widgets are powerful!" and type "warning".

# Use custom badge widget  
Show a badge with text "New" and color "blue".
Show a badge with text "Premium" and color "gold".
Show a badge with text "Sale" and color "red".

# Standard widgets and custom actions
Show a heading saying "Click Counter".

Show a button saying "Click me".
Show a button saying "Add One".
Show a button saying "Double".
Show a button saying "Reset".
Show a button saying "Divide By".

Show a text saying "Clicks: {clicks}".

# Standard increase action
When I click the button "Click me",
increase clicks by 1.

# Custom actions
When I click the button "Add One",
addOne clicks.

When I click the button "Double",
double clicks.

When I click the button "Reset",
reset clicks.

When I click the button "Divide By",
divideBy clicks with factor "2".`,
    functions: `// Custom card widget
export function card(root, title, description) {
  const cardEl = document.createElement('div');
  cardEl.style.cssText = 'border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 8px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
  
  const titleEl = document.createElement('h3');
  titleEl.textContent = title;
  titleEl.style.marginTop = '0';
  cardEl.appendChild(titleEl);
  
  const descEl = document.createElement('p');
  descEl.textContent = description;
  descEl.style.marginBottom = '0';
  descEl.style.color = '#666';
  cardEl.appendChild(descEl);
  
  root.appendChild(cardEl);
  return cardEl;
}

// Custom alert widget
export function alert(root, message, type = 'info') {
  const alertEl = document.createElement('div');
  const colors = {
    info: '#2196F3',
    warning: '#FF9800',
    error: '#f44336',
    success: '#4CAF50',
  };
  
  alertEl.style.cssText = 'background-color: ' + (colors[type] || colors.info) + '22; border-left: 4px solid ' + (colors[type] || colors.info) + '; padding: 12px 16px; margin: 8px 0; border-radius: 4px;';
  
  alertEl.textContent = message;
  root.appendChild(alertEl);
  return alertEl;
}

// Custom badge widget
export function badge(root, text, color) {
  const badgeEl = document.createElement('span');
  badgeEl.textContent = text;
  badgeEl.style.cssText = 'display: inline-block; background-color: ' + color + '; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; margin: 4px;';
  
  root.appendChild(badgeEl);
  return badgeEl;
}

// Custom action: Add one
export function addOne(signal) {
  signal.set(signal.get() + 1);
}

// Custom action: Double
export function double(signal) {
  signal.set(signal.get() * 2);
}

// Custom action: Reset
export function reset(signal) {
  signal.set(0);
}

// Custom action: Divide by factor
export function divideBy(signal, factor) {
  signal.set(signal.get() / parseInt(factor, 10));
}`,
  },
  {
    title: "Text Formatting",
    description: "Style text with various formatting options",
    tags: ["Widgets", "Formatting", "UI"],
    code: `# Text Formatting Example
# Demonstrates: Using various HTML-like widgets with English-friendly names

There is a text called userName starting at "Alice".

Show a heading saying "Text Formatting Demo".

# Paragraph
Show a paragraph saying "This is a paragraph of text.".

# Text formatting
Show an italic saying "This text is in italics.".
Show a bold saying "This text is bold.".
Show a strong saying "This text has strong emphasis.".
Show an emphasis saying "This text is emphasized.".
Show an underline saying "This text is underlined.".

# More formatting
Show a small saying "This is small text.".
Show a mark saying "This text is highlighted.".
Show a deleted saying "This text is deleted.".
Show a strikethrough saying "This text is struck through.".
Show a code saying "console.log('Hello')".

# Layout containers
Show a container saying "This is a container (div).".
Show a section saying "This is a section.".

# Links and lists
Show a link saying "Click here to visit".
Show an unorderedlist saying "".
Show a listitem saying "First item".
Show a listitem saying "Second item".

# Dynamic content
Show an italic saying "Welcome, {userName}!".
Show a paragraph saying "User {userName} is currently logged in.".`,
  },
  {
    title: "Styling & Layout",
    description: "Use colors, alignment, and layout containers to style your UI",
    tags: ["Styling", "Layout", "Design"],
    code: `# Styling Demo
# Demonstrates: colored text, centered alignment, row and column layouts

There is a number called count starting at 0.

Show a heading saying "Styling Demo" centered and colored blue.

Show a text saying "This text is green and centered" colored green and centered.

Show a text saying "This text is red and aligned right" colored red and aligned right.

Show a row containing,
show a text saying "Item 1" colored purple.
show a text saying "Item 2" colored orange.
show a text saying "Item 3" colored teal.

Show a column gap "10px" containing,
show a text saying "First in column" background lightblue.
show a text saying "Second in column" background lightgreen.
show a text saying "Third in column" background lightyellow.

Show a button saying "Increment".
Show a text saying "Count: {count}".

When I click the button "Increment",
increase count by 1.`,
  },
  {
    title: "API Handling",
    description: "Make API calls and display dynamic data",
    tags: ["API", "Dynamic Data", "Advanced"],
    code: `# Cat Facts API Example
# Demonstrates: API calls with custom functions and displaying fetched data

There is a list called facts starting empty.
There is a number called factCount starting at 3.

Show a heading saying "🐱 Cat Facts from MeowFacts API".

Show a text saying "Number of facts to fetch: {factCount}".
Show a button saying "Fetch Cat Facts".
Show a button saying "Fetch More (5 facts)".

# Fetch facts when button clicked
When I click the button "Fetch Cat Facts",
fetchMeowFacts facts.

When I click the button "Fetch More (5 facts)",
fetchMultipleMeowFacts facts with count "5".

# Display all fetched facts
For each fact in facts,
show a text saying "🐱 {fact}".
`
  }
];

interface DocumentationPanelProps {
  onLoadExample: (code: string, functions?: string) => void;
}

export default function DocumentationPanel({ onLoadExample }: DocumentationPanelProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (code: string, index: number) => {
    await navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-white dark:bg-zinc-900">
      <div className="p-6 border-b sticky top-0 bg-white dark:bg-zinc-900 z-10">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          📚 Documentation & Examples
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Click on any example to explore. Load it into the editor to try it out!
        </p>
      </div>

      <div className="p-6 space-y-4">
        <Accordion type="single" collapsible className="space-y-4">
          {examples.map((example, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-800/50"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <div className="flex flex-col items-start gap-2 text-left flex-1">
                  <div className="flex items-center gap-2 w-full">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {example.title}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {example.description}
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    {example.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Card className="p-4 bg-white dark:bg-zinc-900">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Lingo Code
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(example.code, index)}
                        className="h-7 text-xs"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onLoadExample(example.code, example.functions)}
                        className="h-7 text-xs bg-violet-600 hover:bg-violet-700"
                      >
                        <ChevronRight className="w-3 h-3 mr-1" />
                        Load in Editor
                      </Button>
                    </div>
                  </div>
                  <pre className="text-xs bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg overflow-x-auto border">
                    <code className="text-zinc-800 dark:text-zinc-200">
                      {example.code}
                    </code>
                  </pre>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Language Reference Section */}
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 border-b pb-2">
            📖 Language Reference
          </h2>

          {/* Type System */}
          <Card className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
            <h3 className="font-bold text-base mb-3 text-zinc-900 dark:text-zinc-50">
              📝 Type System
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">State Declaration</h4>
                <code className="text-xs bg-white dark:bg-zinc-900 px-2 py-1 rounded block mb-2">
                  There is a [type] called [name] starting at [value].
                </code>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
                    🔢 Number
                  </div>
                  <code className="text-xs text-zinc-600 dark:text-zinc-400 block">
                    There is a number called count starting at 0.
                  </code>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                    For numeric values (integers and decimals)
                  </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
                    📄 Text
                  </div>
                  <code className="text-xs text-zinc-600 dark:text-zinc-400 block">
                    There is a text called name starting at &quot;Alice&quot;.
                  </code>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                    For string values (must use quotes)
                  </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
                    ✅ Boolean
                  </div>
                  <code className="text-xs text-zinc-600 dark:text-zinc-400 block">
                    There is a boolean called isActive starting at true.
                  </code>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                    For true/false values
                  </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
                    📋 List
                  </div>
                  <code className="text-xs text-zinc-600 dark:text-zinc-400 block">
                    There is a list called items starting empty.
                  </code>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                    For arrays of items
                  </p>
                </div>
              </div>
              
              <div className="bg-violet-50 dark:bg-violet-950/30 p-3 rounded-lg mt-3">
                <p className="text-xs text-zinc-700 dark:text-zinc-300">
                  <strong>💡 String Interpolation:</strong> Use <code className="bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded">{`{variableName}`}</code> to embed variables in strings
                </p>
                <code className="text-xs text-zinc-600 dark:text-zinc-400 block mt-2">
                  Show a text saying &quot;Hello, {`{name}`}! You have {`{count}`} points.&quot;.
                </code>
              </div>
            </div>
          </Card>

          {/* Styling */}
          <Card className="p-5 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20">
            <h3 className="font-bold text-base mb-3 text-zinc-900 dark:text-zinc-50">
              🎨 Styling & Layout
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">Style Properties</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
                  Add style keywords after widget declarations to customize appearance.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
                    🎨 Text Color
                  </div>
                  <code className="text-xs text-zinc-600 dark:text-zinc-400 block mb-2">
                    colored [color]
                  </code>
                  <code className="text-[11px] text-zinc-500 dark:text-zinc-500 block bg-zinc-50 dark:bg-zinc-950 p-2 rounded">
                    Show a text saying &quot;Green text&quot; colored green.<br/>
                    Show a heading saying &quot;Title&quot; colored blue.
                  </code>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
                    🖼️ Background Color
                  </div>
                  <code className="text-xs text-zinc-600 dark:text-zinc-400 block mb-2">
                    background [color]
                  </code>
                  <code className="text-[11px] text-zinc-500 dark:text-zinc-500 block bg-zinc-50 dark:bg-zinc-950 p-2 rounded">
                    Show a text saying &quot;Highlighted&quot; background yellow.<br/>
                    Show a text saying &quot;Info&quot; background lightblue.
                  </code>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
                    📐 Text Alignment
                  </div>
                  <code className="text-xs text-zinc-600 dark:text-zinc-400 block mb-2">
                    centered | aligned left | aligned right | aligned center
                  </code>
                  <code className="text-[11px] text-zinc-500 dark:text-zinc-500 block bg-zinc-50 dark:bg-zinc-950 p-2 rounded">
                    Show a heading saying &quot;Title&quot; centered.<br/>
                    Show a text saying &quot;Right aligned&quot; aligned right.
                  </code>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
                    📦 Layout Containers
                  </div>
                  <code className="text-xs text-zinc-600 dark:text-zinc-400 block mb-2">
                    row containing, | column gap &quot;[size]&quot; containing,
                  </code>
                  <code className="text-[11px] text-zinc-500 dark:text-zinc-500 block bg-zinc-50 dark:bg-zinc-950 p-2 rounded">
                    Show a row containing,<br/>
                    show a text saying &quot;Item 1&quot;.<br/>
                    show a text saying &quot;Item 2&quot;.<br/>
                    <br/>
                    Show a column gap &quot;10px&quot; containing,<br/>
                    show a text saying &quot;First&quot;.<br/>
                    show a text saying &quot;Second&quot;.
                  </code>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
                    🌈 Combining Styles
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                    Use <code className="bg-violet-50 dark:bg-violet-950/30 px-1 rounded">and</code> to combine multiple styles:
                  </p>
                  <code className="text-[11px] text-zinc-500 dark:text-zinc-500 block bg-zinc-50 dark:bg-zinc-950 p-2 rounded">
                    Show a heading saying &quot;Welcome&quot; colored blue and centered.<br/>
                    Show a text saying &quot;Info&quot; colored white and background darkblue.
                  </code>
                </div>
              </div>
            </div>
          </Card>

          {/* Widgets */}
          <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <h3 className="font-bold text-base mb-3 text-zinc-900 dark:text-zinc-50">
              🧩 Widget Reference
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">Basic Syntax</h4>
                <code className="text-xs bg-white dark:bg-zinc-900 px-2 py-1 rounded block">
                  Show a [widget] saying &quot;[content]&quot;.
                </code>
              </div>
              
              <div className="grid grid-cols-1 gap-2 mt-3">
                <details className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <summary className="font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer text-xs">
                    Interactive Widgets
                  </summary>
                  <div className="mt-2 space-y-2 text-xs">
                    <div>
                      <code className="text-violet-600 dark:text-violet-400">button</code>
                      <span className="text-zinc-600 dark:text-zinc-400"> - Clickable button</span>
                      <code className="block mt-1 text-[11px] text-zinc-500 dark:text-zinc-500">
                        Show a button saying &quot;Click me&quot;.
                      </code>
                    </div>
                    <div>
                      <code className="text-violet-600 dark:text-violet-400">input</code>
                      <span className="text-zinc-600 dark:text-zinc-400"> - Text input field (binds to variable)</span>
                      <code className="block mt-1 text-[11px] text-zinc-500 dark:text-zinc-500">
                        Show an input called username.
                      </code>
                    </div>
                  </div>
                </details>

                <details className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <summary className="font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer text-xs">
                    Text & Headings
                  </summary>
                  <div className="mt-2 space-y-2 text-xs">
                    <div>
                      <code className="text-violet-600 dark:text-violet-400">heading</code>
                      <span className="text-zinc-600 dark:text-zinc-400"> - Large heading (h1)</span>
                    </div>
                    <div>
                      <code className="text-violet-600 dark:text-violet-400">text</code>
                      <span className="text-zinc-600 dark:text-zinc-400"> - Regular text (span)</span>
                    </div>
                    <div>
                      <code className="text-violet-600 dark:text-violet-400">paragraph</code>
                      <span className="text-zinc-600 dark:text-zinc-400"> - Paragraph (p)</span>
                    </div>
                  </div>
                </details>

                <details className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <summary className="font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer text-xs">
                    Text Formatting
                  </summary>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div><code className="text-violet-600 dark:text-violet-400">bold</code> - Bold text</div>
                    <div><code className="text-violet-600 dark:text-violet-400">italic</code> - Italic text</div>
                    <div><code className="text-violet-600 dark:text-violet-400">strong</code> - Strong emphasis</div>
                    <div><code className="text-violet-600 dark:text-violet-400">emphasis</code> - Emphasized text</div>
                    <div><code className="text-violet-600 dark:text-violet-400">underline</code> - Underlined text</div>
                    <div><code className="text-violet-600 dark:text-violet-400">strikethrough</code> - Strikethrough text</div>
                    <div><code className="text-violet-600 dark:text-violet-400">small</code> - Small text</div>
                    <div><code className="text-violet-600 dark:text-violet-400">mark</code> - Highlighted text</div>
                    <div><code className="text-violet-600 dark:text-violet-400">deleted</code> - Deleted text</div>
                    <div><code className="text-violet-600 dark:text-violet-400">code</code> - Code snippet</div>
                  </div>
                </details>

                <details className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <summary className="font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer text-xs">
                    Layout & Structure
                  </summary>
                  <div className="mt-2 space-y-2 text-xs">
                    <div>
                      <code className="text-violet-600 dark:text-violet-400">row</code>
                      <span className="text-zinc-600 dark:text-zinc-400"> - Horizontal flex container</span>
                      <code className="block mt-1 text-[11px] text-zinc-500 dark:text-zinc-500">
                        Show a row containing,
                      </code>
                    </div>
                    <div>
                      <code className="text-violet-600 dark:text-violet-400">column</code>
                      <span className="text-zinc-600 dark:text-zinc-400"> - Vertical flex container</span>
                      <code className="block mt-1 text-[11px] text-zinc-500 dark:text-zinc-500">
                        Show a column gap &quot;10px&quot; containing,
                      </code>
                    </div>
                    <div>
                      <code className="text-violet-600 dark:text-violet-400">container</code>
                      <span className="text-zinc-600 dark:text-zinc-400"> - Generic container (div)</span>
                    </div>
                    <div>
                      <code className="text-violet-600 dark:text-violet-400">section</code>
                      <span className="text-zinc-600 dark:text-zinc-400"> - Section element</span>
                    </div>
                  </div>
                </details>

                <details className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <summary className="font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer text-xs">
                    Links & Lists
                  </summary>
                  <div className="mt-2 space-y-2 text-xs">
                    <div>
                      <code className="text-violet-600 dark:text-violet-400">link</code>
                      <span className="text-zinc-600 dark:text-zinc-400"> - Hyperlink</span>
                    </div>
                    <div>
                      <code className="text-violet-600 dark:text-violet-400">unorderedlist</code>
                      <span className="text-zinc-600 dark:text-zinc-400"> - Bullet list (ul)</span>
                    </div>
                    <div>
                      <code className="text-violet-600 dark:text-violet-400">listitem</code>
                      <span className="text-zinc-600 dark:text-zinc-400"> - List item (li)</span>
                    </div>
                  </div>
                </details>

                <details className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <summary className="font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer text-xs">
                    Custom Widgets
                  </summary>
                  <div className="mt-2 space-y-2 text-xs">
                    <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                      Define your own widgets in a <code className="bg-violet-50 dark:bg-violet-950/30 px-1.5 py-0.5 rounded">functions.js</code> file:
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
                </details>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
            <h3 className="font-bold text-base mb-3 text-zinc-900 dark:text-zinc-50">
              ⚡ Actions Reference
            </h3>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
                    Number Actions
                  </div>
                  <div className="space-y-1 text-xs">
                    <code className="block text-zinc-600 dark:text-zinc-400">
                      increase [variable] by [amount].
                    </code>
                    <code className="block text-zinc-600 dark:text-zinc-400">
                      decrease [variable] by [amount].
                    </code>
                    <code className="block text-zinc-600 dark:text-zinc-400">
                      set [variable] to [value].
                    </code>
                  </div>
                  <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                    Example: <code>increase count by 1.</code>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
                    Boolean Actions
                  </div>
                  <div className="space-y-1 text-xs">
                    <code className="block text-zinc-600 dark:text-zinc-400">
                      toggle [variable].
                    </code>
                    <code className="block text-zinc-600 dark:text-zinc-400">
                      set [variable] to [true/false].
                    </code>
                  </div>
                  <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                    Example: <code>toggle isActive.</code>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
                    Text Actions
                  </div>
                  <div className="space-y-1 text-xs">
                    <code className="block text-zinc-600 dark:text-zinc-400">
                      set [variable] to &quot;[value]&quot;.
                    </code>
                  </div>
                  <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                    Example: <code>set username to &quot;Alice&quot;.</code>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
                    List Actions
                  </div>
                  <div className="space-y-1 text-xs">
                    <code className="block text-zinc-600 dark:text-zinc-400">
                      add [value] to [list].
                    </code>
                  </div>
                  <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                    Example: <code>add inputText to todos.</code>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
                    Custom Actions
                  </div>
                  <div className="space-y-1 text-xs">
                    <code className="block text-zinc-600 dark:text-zinc-400">
                      [customAction] [variable].
                    </code>
                    <code className="block text-zinc-600 dark:text-zinc-400">
                      [customAction] [variable] with [param] &quot;[value]&quot;.
                    </code>
                  </div>
                  <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                    Examples: <code>double count.</code> or <code>divideBy score with factor &quot;2&quot;.</code>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Events */}
          <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <h3 className="font-bold text-base mb-3 text-zinc-900 dark:text-zinc-50">
              🎯 Event Handling
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                <code className="text-xs block text-zinc-600 dark:text-zinc-400 mb-2">
                  When I click the button &quot;[buttonText]&quot;,
                </code>
                <code className="text-xs block text-zinc-600 dark:text-zinc-400 ml-4">
                  [action].
                </code>
                <div className="mt-3 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 p-2 rounded">
                  <strong>Example:</strong>
                  <code className="block mt-1 text-zinc-600 dark:text-zinc-400">
                    When I click the button &quot;Submit&quot;,<br/>
                    add inputText to todos.
                  </code>
                </div>
              </div>
            </div>
          </Card>

          {/* Conditionals */}
          <Card className="p-5 bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/20 dark:to-red-950/20">
            <h3 className="font-bold text-base mb-3 text-zinc-900 dark:text-zinc-50">
              🔀 Conditionals
            </h3>
            <div className="space-y-3 text-sm">
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

              <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
                  Comparison Operators
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><code className="text-violet-600 dark:text-violet-400">equal to</code> - Equals</div>
                  <div><code className="text-violet-600 dark:text-violet-400">not equal to</code> - Not equals</div>
                  <div><code className="text-violet-600 dark:text-violet-400">greater than</code> - Greater than</div>
                  <div><code className="text-violet-600 dark:text-violet-400">less than</code> - Less than</div>
                  <div><code className="text-violet-600 dark:text-violet-400">greater than or equal to</code> - ≥</div>
                  <div><code className="text-violet-600 dark:text-violet-400">less than or equal to</code> - ≤</div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border">
                <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-xs">
                  Examples
                </div>
                <div className="space-y-2 text-xs">
                  <code className="block text-zinc-600 dark:text-zinc-400">
                    If isLoggedIn is equal to true,<br/>
                    show a text saying &quot;Welcome!&quot;.
                  </code>
                  <code className="block text-zinc-600 dark:text-zinc-400">
                    If score is greater than 50,<br/>
                    show a text saying &quot;High score!&quot;.
                  </code>
                </div>
              </div>
            </div>
          </Card>

          {/* Loops */}
          <Card className="p-5 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20">
            <h3 className="font-bold text-base mb-3 text-zinc-900 dark:text-zinc-50">
              🔁 Loops
            </h3>
            <div className="space-y-3 text-sm">
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
                    For each todo in todos,<br/>
                    show a text saying &quot;• {`{todo}`}&quot;.
                  </code>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
