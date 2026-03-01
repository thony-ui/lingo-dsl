/**
 * Learning Modules Data
 * Structured educational content following the pedagogical path outlined in the README
 */

import type { LearningModule } from "@/lib/engine";

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: "module-1",
    title: "What Is Rendering?",
    description:
      "Understand the fundamentals of UI rendering and the render tree",
    order: 1,
    prerequisites: [],
    lessons: [
      {
        id: "lesson-1-1",
        title: "Static UI",
        objective: "Learn how declarative code becomes visual output",
        content: {
          explanation: `Rendering is the process of transforming declarative code into visual output.

Think of it like giving instructions to an artist: instead of moving their hand, you describe what you want to see.

In UI rendering:
- You declare WHAT you want (a button, text, heading)
- The rendering engine figures out HOW to display it
- The browser paints it to the screen

This is the foundation of all modern frameworks.`,
          codeExample: `# Your first render

Show a heading saying "Hello, World!".
Show a text saying "This is my first UI".
Show a button saying "Click me".`,
          keyPoints: [
            "Declarative code describes the desired output",
            "The engine handles the implementation details",
            "Each 'show' statement creates a node in the render tree",
            "The tree structure mirrors your code structure",
          ],
          visualizationFocus: "render-tree",
        },
        exercises: [
          {
            id: "exercise-1-1-1",
            instruction:
              "Create a simple greeting card with a heading, two paragraphs, and a button",
            starterCode: `# Create your greeting card here\n\n`,
            hints: [
              "Use 'Show a heading' for the title",
              "Use 'Show a text' for paragraphs",
              "Use 'Show a button' for interactive elements",
            ],
            solution: `Show a heading saying "Greeting Card".
Show a text saying "Hello! Welcome to my card.".
Show a text saying "Hope you have a great day!".
Show a button saying "Send Love ❤️".`,
          },
        ],
        verificationCriteria: [
          {
            check: (state) => {
              const tree = state.renderTree;
              if (!tree) return false;
              return tree.nodeMap.size >= 4; // At least 4 nodes including root
            },
            feedback: "✓ Great! You've created multiple UI elements",
          },
        ],
      },
      {
        id: "lesson-1-2",
        title: "Understanding the Render Tree",
        objective: "Visualize how code becomes a tree structure",
        content: {
          explanation: `Every UI is a tree.

The render tree is a hierarchical structure where:
- Each node represents a UI element
- Parent-child relationships create nesting
- The root contains everything

This tree mirrors your code's structure and helps the engine:
1. Know what exists in your UI
2. Efficiently update only what changes
3. Manage parent-child relationships

Understanding the tree is key to understanding React, Vue, and all modern frameworks.`,
          codeExample: `# Watch the tree grow

Show a heading saying "My App".
Show a text saying "Welcome!".

# These create a simple tree:
# Root
# ├── heading: "My App"
# └── text: "Welcome!"`,
          keyPoints: [
            "Every show statement adds a node to the tree",
            "The tree has one root that contains everything",
            "Nodes can have children (we'll learn this later)",
            "The visualizer shows this tree structure",
          ],
          visualizationFocus: "render-tree",
        },
        exercises: [
          {
            id: "exercise-1-2-1",
            instruction:
              "Create a profile page and observe how each element appears in the tree",
            starterCode: `# Build a profile page\n# Watch the render tree visualizer as you add elements\n\n`,
            hints: [
              "Add elements one by one",
              "Observe the tree growing with each statement",
              "Notice how each node appears in the visualizer",
            ],
            solution: `Show a heading saying "User Profile".
Show a text saying "Name: John Doe".
Show a text saying "Email: john@example.com".
Show a button saying "Edit Profile".
Show a button saying "Logout".`,
          },
        ],
        verificationCriteria: [
          {
            check: (state) =>
              state.renderTree !== null && state.renderTree.nodeMap.size >= 5,
            feedback: "✓ Excellent! You can see the tree structure forming",
          },
        ],
      },
      {
        id: "lesson-1-3",
        title: "Declarative Thinking",
        objective: "Master the declarative mindset",
        content: {
          explanation: `In traditional programming, you tell the computer HOW to do something step by step (imperative).

In UI frameworks, you tell it WHAT you want (declarative).

Imperative (old way):
- Create a div element
- Set its text content
- Add it to the document
- Style it
- Position it

Declarative (modern way):
- "Show a heading saying 'Hello'"

The engine handles all the HOW.

This shift is what makes modern UIs powerful and maintainable.`,
          codeExample: `# Declarative is simple:

Show a heading saying "Dashboard".
Show a text saying "Welcome back!".
Show a button saying "View Stats".

# The engine creates elements,
# adds them to the page,
# applies styles,
# and manages everything.`,
          keyPoints: [
            "Describe WHAT you want, not HOW to build it",
            "The engine translates declarations into implementation",
            "This makes code more readable and maintainable",
            "All modern frameworks use this approach",
          ],
          visualizationFocus: "execution-flow",
        },
        exercises: [
          {
            id: "exercise-1-3-1",
            instruction:
              "Create a simple blog post layout using only declarative statements",
            starterCode: `# Create a blog post layout\n\n`,
            hints: [
              "Think about WHAT you want to see, not HOW to build it",
              "Use headings for titles, texts for content, buttons for actions",
            ],
            solution: `Show a heading saying "My First Blog Post".
Show a text saying "Published on March 1, 2026".
Show a text saying "This is the content of my blog post. It explains something interesting.".
Show a button saying "Like".
Show a button saying "Share".
Show a button saying "Comment".`,
          },
        ],
        verificationCriteria: [
          {
            check: (state) => state.currentPhase === "COMPLETE",
            feedback: "✓ Perfect! You're thinking declaratively",
          },
        ],
      },
    ],
  },
  {
    id: "module-2",
    title: "What Is State?",
    description: "Learn how state makes UIs dynamic and reactive",
    order: 2,
    prerequisites: ["module-1"],
    lessons: [
      {
        id: "lesson-2-1",
        title: "Variables and Reactivity",
        objective: "Understand state variables and how they trigger updates",
        content: {
          explanation: `State is data that can change over time.

When state changes, the UI automatically updates to reflect the new value. This is called "reactivity."

Think of state as a living variable that:
1. Holds a value
2. Can change
3. Notifies the UI when it changes
4. Causes automatic re-renders

This is the magic behind interactive UIs.`,
          codeExample: `# State makes UIs dynamic

There is a number called count starting at 0.

Show a heading saying "Counter App".
Show a text saying "Current count: {count}".

# When count changes, the text automatically updates!`,
          keyPoints: [
            "State variables hold data that can change",
            "Curly braces {count} insert state values into UI",
            "When state changes, connected UI elements update",
            "This is automatic - you don't manually update the DOM",
          ],
          visualizationFocus: "state-changes",
        },
        exercises: [
          {
            id: "exercise-2-1-1",
            instruction: "Create a profile with name and email state variables",
            starterCode: `# Create state variables for a profile\n\n`,
            hints: [
              "Use 'There is a text called...' to create state",
              "Display the values using {name} and {email}",
            ],
            solution: `There is a text called name starting at "John Doe".
There is a text called email starting at "john@example.com".

Show a heading saying "Profile".
Show a text saying "Name: {name}".
Show a text saying "Email: {email}".`,
          },
        ],
        verificationCriteria: [
          {
            check: (state) => state.stateMap.variables.size >= 1,
            feedback: "✓ Great! You've created state variables",
          },
        ],
      },
      {
        id: "lesson-2-2",
        title: "Observing State Changes",
        objective: "Watch state updates flow through the system",
        content: {
          explanation: `Every state change creates a ripple effect:

1. State value updates
2. Engine detects the change
3. Finds all UI nodes using that state
4. Marks them for re-render
5. Updates only what changed

This is efficient - not everything re-renders, only what needs to.

The State Diff Viewer shows you:
- What changed
- Before/after values
- Which nodes will update`,
          codeExample: `There is a number called score starting at 0.
There is a text called status starting at "Ready".

Show a heading saying "Game Status".
Show a text saying "Score: {score}".
Show a text saying "Status: {status}".

# Watch the diff viewer when these change!`,
          keyPoints: [
            "Each state change is tracked with before/after snapshots",
            "The engine identifies which nodes depend on changed state",
            "Only dependent nodes re-render (efficiency!)",
            "The diff viewer makes this process visible",
          ],
          visualizationFocus: "state-changes",
        },
        exercises: [
          {
            id: "exercise-2-2-1",
            instruction:
              "Create a dashboard with multiple state variables and observe dependencies",
            starterCode: `# Create a dashboard with multiple state values\n\n`,
            hints: [
              "Create different types of state (number, text, boolean)",
              "Display them in different UI elements",
              "Notice which nodes are bound to which state",
            ],
            solution: `There is a number called users starting at 42.
There is a number called revenue starting at 1250.
There is a text called status starting at "All systems operational".

Show a heading saying "Dashboard".
Show a text saying "Active Users: {users}".
Show a text saying "Revenue: {revenue}".
Show a text saying "Status: {status}".`,
          },
        ],
        verificationCriteria: [
          {
            check: (state) => state.stateMap.variables.size >= 3,
            feedback: "✓ Excellent! Multiple state variables created",
          },
        ],
      },
      {
        id: "lesson-2-3",
        title: "Re-render Triggers",
        objective: "Understand what causes re-renders and why",
        content: {
          explanation: `Re-rendering is the process of updating the UI when state changes.

WHEN re-renders happen:
- State variable changes value
- Engine finds all nodes binding to that state
- Those nodes update their content

WHY this matters:
- Performance: Only changed nodes update
- Consistency: UI always reflects current state
- Automation: You don't manually update anything

The render tree visualizer highlights nodes that re-render, showing you the exact impact of each state change.`,
          codeExample: `There is a number called count starting at 0.
There is a text called message starting at "Hello".

Show a heading saying "Status: {message}".
Show a text saying "Count: {count}".
Show a text saying "This never re-renders".

# When count changes: only the "Count" text updates
# When message changes: only the heading updates
# The last text NEVER re-renders (no state binding)`,
          keyPoints: [
            "Only nodes with state bindings re-render",
            "Static nodes (no {state}) never re-render",
            "This is automatic and efficient",
            "Watch the render tree to see which nodes update",
          ],
          visualizationFocus: "render-tree",
        },
        exercises: [
          {
            id: "exercise-2-3-1",
            instruction:
              "Create a UI with both dynamic and static text to observe selective re-rendering",
            starterCode: `# Mix static and dynamic content\n\n`,
            hints: [
              "Some text should use {state} (dynamic)",
              "Some text should be plain (static)",
              "Observe which nodes would re-render when state changes",
            ],
            solution: `There is a number called temperature starting at 72.
There is a text called location starting at "New York".

Show a heading saying "Weather Dashboard".
Show a text saying "Location: {location}".
Show a text saying "Temperature: {temperature}°F".
Show a text saying "This dashboard updates in real-time.".`,
          },
        ],
        verificationCriteria: [
          {
            check: (state) => {
              if (!state.renderTree) return false;
              const hasStaticNode = Array.from(
                state.renderTree.nodeMap.values(),
              ).some(
                (node) =>
                  node.metadata.stateBindings.length === 0 &&
                  node.type !== "root",
              );
              const hasDynamicNode = Array.from(
                state.renderTree.nodeMap.values(),
              ).some((node) => node.metadata.stateBindings.length > 0);
              return hasStaticNode && hasDynamicNode;
            },
            feedback: "✓ Perfect! You understand static vs dynamic nodes",
          },
        ],
      },
    ],
  },
  {
    id: "module-3",
    title: "Events and Actions",
    description: "Make your UI interactive with event handlers",
    order: 3,
    prerequisites: ["module-2"],
    lessons: [
      {
        id: "lesson-3-1",
        title: "Event Handlers",
        objective: "Respond to user interactions",
        content: {
          explanation: `Events are user actions: clicks, typing, hovering, etc.

Event handlers are code that runs when events occur.

Structure:
- WHEN trigger happens (event)
- DO action (change state)

This creates the interaction loop:
User clicks → Event fires → State changes → UI updates`,
          codeExample: `There is a number called count starting at 0.

Show a text saying "Count: {count}".
Show a button saying "Increment".

When I click the button "Increment",
increase count by 1.

# Click → count changes → text updates`,
          keyPoints: [
            "Events connect user actions to state changes",
            "'When I click' creates an event handler",
            "Actions modify state",
            "State changes trigger re-renders",
          ],
          visualizationFocus: "state-changes",
        },
        exercises: [
          {
            id: "exercise-3-1-1",
            instruction:
              "Create a simple counter with increment and decrement buttons",
            starterCode: `# Build a counter app\n\n`,
            hints: [
              "Create a number state for the count",
              "Add buttons for increment and decrement",
              "Use 'When I click' to handle events",
            ],
            solution: `There is a number called count starting at 0.

Show a heading saying "Simple Counter".
Show a text saying "Count: {count}".
Show a button saying "Increment".
Show a button saying "Decrement".

When I click the button "Increment",
increase count by 1.

When I click the button "Decrement",
decrease count by 1.`,
          },
        ],
        verificationCriteria: [
          {
            check: (state) => {
              if (!state.ast) return false;
              return state.ast.statements.some((s) => s.type === "EVENT_BLOCK");
            },
            feedback: "✓ Great! You've added event handlers",
          },
        ],
      },
    ],
  },
];
