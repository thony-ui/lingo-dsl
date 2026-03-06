# LingoUI

**A reactive UI framework with an English-like programming language**

LingoUI is a production-ready framework that lets you build reactive web applications using natural, readable syntax. Write UI logic in English-like statements and compile to efficient JavaScript.

## Features

- **Natural Language Syntax** - Write code in readable English sentences
- **Reactive by Default** - Fine-grained reactivity with signals and effects
- **Type-Safe** - Static analysis catches errors before runtime
- **Zero Dependencies** - Custom reactive runtime, no React/Vue required
- **Production Ready** - SOLID architecture, 90%+ test coverage
- **Fast** - Microtask-based scheduler prevents unnecessary updates

## Documentation

For comprehensive guides, API reference, and interactive examples:

- **Online**: Visit [here](https://lingo-dsl.vercel.app/docs)
- **Local**: Run `cd frontend && npm run dev` and navigate to `/docs`

The documentation includes:

- Getting Started Guide
- Complete Language Reference
- Interactive Code Examples
- Styling and Layout Patterns

## Quick Start

### Installation

Install the LingoUI CLI globally:

```bash
npm install -g @lingo-dsl/cli
```

### Create Your First App

**Step 1:** Create a new project directory

```bash
mkdir my-lingo-app && cd my-lingo-app
```

**Step 2:** Create a `src` directory

```bash
mkdir src
```

All your `.lingo` files must be placed in the `src` directory.

**Step 3:** Create your first `.lingo` file

Create `src/counter.lingo`:

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

## Contributing

LingoUI is built with:

- **TypeScript** for type safety
- **Jest** for testing
- **SOLID principles** for maintainability
- **Dependency Injection** for testability

## License

MIT

## About

Built by developers who believe code should be readable and maintainable.
