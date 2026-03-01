# LingoUI

**A reactive UI framework with an English-like programming language**

LingoUI is a production-credible framework that lets you build reactive web applications using natural, readable syntax. Write UI logic in English-like statements and compile to efficient JavaScript.

## Features

- 🗣️ **Natural Language Syntax** - Write code in readable English sentences
- ⚡ **Reactive by Default** - Fine-grained reactivity with signals and effects
- 🎯 **Type-Safe** - Static analysis catches errors before runtime
- 📦 **Zero Dependencies** - Custom reactive runtime, no React/Vue required
- 🔧 **Production Ready** - SOLID architecture, 90%+ test coverage
- 🚀 **Fast** - Microtask-based scheduler prevents unnecessary updates

## Quick Start

### Installation

```bash
npm install -g lingoui
```

### Create Your First App

Create a `counter.lingo` file:

```lingo
There is a number called count starting at 0.

Show a heading saying "Counter".
Show text saying "Count: {count}".
Show a button saying "Increment".

When I click the button "Increment",
increase count by 1.
```

### Run Development Server

```bash
lingoui dev
```

Visit `http://localhost:3000`

### Build for Production

```bash
lingoui build
```

## Language Guide

### State Declarations

```lingo
There is a number called count starting at 0.
There is text called name starting at "Anthony".
There is a boolean called isOpen starting at false.
There is a list called todos starting empty.
```

### UI Elements

```lingo
Show a heading saying "My App".
Show text saying "Hello {name}!".
Show a button saying "Click me".
Show an input called username.
Show an image with source "logo.png".
```

### Styling & Layout

```lingo
# Text colors and alignment
Show a heading saying "Title" colored blue and centered.
Show a text saying "Green text" colored green and aligned left.

# Background colors
Show a text saying "Highlighted" background yellow.

# Layout containers
Show a row containing,
show a text saying "Item 1".
show a text saying "Item 2".
show a text saying "Item 3".

Show a column gap "10px" containing,
show a text saying "First".
show a text saying "Second".
show a text saying "Third".
```

**Available Style Properties:**

- `colored [color]` - Set text color
- `background [color]` - Set background color
- `centered` - Center align text
- `aligned left/right/center` - Align text
- `gap "[size]"` - Set spacing in layouts (for row/column)

**Layout Containers:**

- `row containing,` - Horizontal flex layout
- `column containing,` - Vertical flex layout

### Events & Actions

**Page Load Events:**  
Execute actions automatically when the page loads:

```lingo
On page load,
loadInitialData facts.
set count to 0.
```

**Click Events:**

```lingo
When I click the button "Submit",
increase score by 10.
set name to "Done".
add item to list.
remove item from list.
toggle isOpen.
```

**Input Events:**

```lingo
When I type the input called searchBox,
set query to searchBox.
```

**Custom Actions with Dynamic Variables:**  
Pass variable values to custom functions using `{variableName}` syntax:

```lingo
When I click the button "Fetch",
fetchData results with count "{numRecords}".
```

### Conditionals

```lingo
If count is greater than 5,
show text saying "High score!".

If name is equal to "Admin",
show text saying "Welcome, admin!".
```

### Loops

```lingo
For each todo in todos,
show text saying "• {todo}".
```

## Architecture

LingoUI follows clean code principles and SOLID design:

### Packages

- **@lingoui/compiler** - Tokenizer, Parser, Semantic Analyzer, Code Generator
- **@lingoui/runtime** - Reactive signals, effects, scheduler, DOM rendering
- **@lingoui/cli** - Development server and build tools

### Compilation Pipeline

```
.lingo file → Tokenizer → Parser → Analyzer → CodeGenerator → JavaScript
```

### Reactive System

- **Signals** - Observable state containers
- **Effects** - Automatically track and respond to signal changes
- **Scheduler** - Batches updates using microtasks for optimal performance

## Examples

See the `examples/` directory:

- `counter.lingo` - Simple counter with increment/decrement
- `todos.lingo` - Todo list with add/remove
- `profile.lingo` - Conditional rendering and multiple state types
- `styling-demo.lingo` - Styling and layout demonstration
- `custom-widgets.lingo` - Custom widgets with JavaScript functions

## Testing

Run tests with coverage:

```bash
npm test
```

Coverage threshold: 90% (branches, functions, lines, statements)

## Project Structure

```
lingo-code/
├── packages/
│   ├── compiler/         # Language compiler
│   │   ├── src/
│   │   │   ├── tokenizer/
│   │   │   ├── parser/
│   │   │   ├── analyzer/
│   │   │   └── codegen/
│   │   └── __tests__/
│   ├── runtime/          # Reactive runtime
│   │   ├── src/
│   │   │   ├── reactivity/
│   │   │   └── dom/
│   │   └── __tests__/
│   └── cli/              # CLI tools
│       ├── src/
│       │   └── commands/
│       └── __tests__/
├── examples/             # Example apps
└── package.json
```

## Roadmap

### v0.1 (Current)

- ✅ Core language features
- ✅ Reactive system
- ✅ CLI tools
- ✅ 90%+ test coverage

### v0.2 (Planned)

- Components and reusable blocks
- Props and composition
- Improved list rendering with diffing

### v0.3 (Planned)

- Router and navigation
- Multiple pages

### v0.4 (Planned)

- Async actions and fetch
- Loading states

### v1.0 (Goal)

- Stable language specification
- Plugin system
- Framework integration

## Contributing

LingoUI is built with:

- **TypeScript** for type safety
- **Jest** for testing
- **SOLID principles** for maintainability
- **Dependency Injection** for testability

## License

MIT

## Credits

Built with ❤️ by developers who believe code should be readable and maintainable.
