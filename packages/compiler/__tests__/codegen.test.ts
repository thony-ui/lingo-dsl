import { JSCodeGenerator } from "../src/codegen/JSCodeGenerator";
import { LingoTokenizer } from "../src/tokenizer/LingoTokenizer";
import { LingoParser } from "../src/parser/LingoParser";
import { ConsoleErrorReporter } from "../src/errors/ConsoleErrorReporter";

describe("JSCodeGenerator", () => {
  let generator: JSCodeGenerator;
  let tokenizer: LingoTokenizer;
  let parser: LingoParser;
  let errorReporter: ConsoleErrorReporter;

  beforeEach(() => {
    errorReporter = new ConsoleErrorReporter();
    jest.spyOn(console, "error").mockImplementation(() => {});
    tokenizer = new LingoTokenizer(errorReporter);
    parser = new LingoParser(errorReporter);
    generator = new JSCodeGenerator();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const generate = (source: string): string => {
    const tokens = tokenizer.tokenize(source);
    const ast = parser.parse(tokens);
    const result = generator.generate(ast);
    return result.code;
  };

  describe("Imports and Structure", () => {
    it("should generate runtime import", () => {
      const source = "There is a number called count starting at 0.";
      const code = generate(source);

      expect(code).toContain(
        "import { createSignal, createEffect, renderApp } from '@lingo-dsl/runtime'",
      );
    });

    it("should wrap in createApp function", () => {
      const source = "There is a number called count starting at 0.";
      const code = generate(source);

      expect(code).toContain("export function createApp()");
      expect(code).toContain("return renderApp");
    });
  });

  describe("State Generation", () => {
    it("should generate signal for number", () => {
      const source = "There is a number called count starting at 0.";
      const code = generate(source);

      expect(code).toContain("const count = createSignal(0, 'count')");
    });

    it("should generate signal for text", () => {
      const source = 'There is text called name starting at "John".';
      const code = generate(source);

      expect(code).toContain("const name = createSignal(\"John\", 'name')");
    });

    it("should generate signal for boolean", () => {
      const source = "There is a boolean called isOpen starting at true.";
      const code = generate(source);

      expect(code).toContain("const isOpen = createSignal(true, 'isOpen')");
    });

    it("should generate signal for list with empty array", () => {
      const source = "There is a list called todos starting empty.";
      const code = generate(source);

      expect(code).toContain("const todos = createSignal([], 'todos')");
    });

    it("should generate multiple signals", () => {
      const source = `There is a number called x starting at 1.
There is a number called y starting at 2.`;
      const code = generate(source);

      expect(code).toContain("const x = createSignal(1, 'x')");
      expect(code).toContain("const y = createSignal(2, 'y')");
    });
  });

  describe("Show Statement Generation", () => {
    it("should generate heading element", () => {
      const source = 'Show a heading saying "Counter".';
      const code = generate(source);

      expect(code).toContain("document.createElement('h1')");
      expect(code).toContain(".textContent = `Counter`");
    });

    it("should generate text element", () => {
      const source = 'Show text saying "Hello".';
      const code = generate(source);

      expect(code).toContain("document.createElement('p')");
    });

    it("should generate button element", () => {
      const source = 'Show a button saying "Click me".';
      const code = generate(source);

      expect(code).toContain("document.createElement('button')");
      expect(code).toContain(".textContent = `Click me`");
    });

    it("should generate input element", () => {
      const source = "Show an input called name.";
      const code = generate(source);

      expect(code).toContain("document.createElement('input')");
      expect(code).toContain(".dataset.identifier = 'name'");
    });

    it("should generate image element", () => {
      const source = 'Show an image with source "logo.png".';
      const code = generate(source);

      expect(code).toContain("document.createElement('img')");
      expect(code).toContain('.src = "logo.png"');
    });

    it("should generate row container", () => {
      const source = "Show a row.";
      const code = generate(source);

      expect(code).toContain("document.createElement('div')");
      expect(code).toContain(".className = 'row'");
    });

    it("should generate column container", () => {
      const source = "Show a column.";
      const code = generate(source);

      expect(code).toContain("document.createElement('div')");
      expect(code).toContain(".className = 'column'");
    });
  });

  describe("Template Interpolation", () => {
    it("should generate template with single variable", () => {
      const source = `There is a number called count starting at 0.
Show text saying "Count: {count}".`;
      const code = generate(source);

      expect(code).toContain("`Count: ${count.get()}`");
    });

    it("should generate template with multiple variables", () => {
      const source = `There is a number called x starting at 1.
There is a number called y starting at 2.
Show text saying "{x} + {y}".`;
      const code = generate(source);

      expect(code).toContain("`${x.get()} + ${y.get()}`");
    });

    it("should generate reactive effect for templates", () => {
      const source = `There is a number called count starting at 0.
Show text saying "Count: {count}".`;
      const code = generate(source);

      expect(code).toContain("createEffect(() => {");
      expect(code).toContain(".textContent = `Count: ${count.get()}`");
    });
  });

  describe("Event Handler Generation", () => {
    it("should generate click event handler with literal selector", () => {
      const source = `When I click the button "Add",
increase count by 1.`;
      const code = generate(source);

      expect(code).toContain("root.addEventListener('click'");
      expect(code).toContain("e.target.tagName === 'BUTTON'");
      expect(code).toContain('e.target.textContent === "Add"');
      expect(code).toContain("count.set(count.get() + 1)");
    });

    it("should generate click event handler with identifier selector", () => {
      const source = `When I click the button called submitBtn,
increase count by 1.`;
      const code = generate(source);

      expect(code).toContain("root.addEventListener('click'");
      expect(code).toContain('e.target.dataset.identifier === "submitBtn"');
      expect(code).toContain("count.set(count.get() + 1)");
    });

    it("should generate input event handler", () => {
      const source = `When I type the input called name,
set name to empty.`;
      const code = generate(source);

      expect(code).toContain("addEventListener('input'");
    });
  });

  describe("Action Generation", () => {
    it("should generate increase action", () => {
      const source = `When I click the button "Add",
increase count by 5.`;
      const code = generate(source);

      expect(code).toContain("count.set(count.get() + 5)");
    });

    it("should generate decrease action", () => {
      const source = `When I click the button "Sub",
decrease count by 1.`;
      const code = generate(source);

      expect(code).toContain("count.set(count.get() - 1)");
    });

    it("should generate set action with literal value", () => {
      const source = `When I click the button "Reset",
set count to 0.`;
      const code = generate(source);

      expect(code).toContain("count.set(0)");
    });

    it("should generate set action with identifier value", () => {
      const source = `When I click the button "Copy",
set x to y.`;
      const code = generate(source);

      expect(code).toContain("x.set(y.get())");
    });

    it("should generate add action", () => {
      const source = `When I click the button "Add",
add "item" to todos.`;
      const code = generate(source);

      expect(code).toContain('todos.set([...todos.get(), "item"])');
    });

    it("should generate remove action", () => {
      const source = `When I click the button "Remove",
remove "item" from todos.`;
      const code = generate(source);

      expect(code).toContain(
        'todos.set(todos.get().filter(item => item !== "item"))',
      );
    });

    it("should generate toggle action", () => {
      const source = `When I click the button "Toggle",
toggle isOpen.`;
      const code = generate(source);

      expect(code).toContain("isOpen.set(!isOpen.get())");
    });

    it("should generate multiple actions", () => {
      const source = `When I click the button "Update",
increase x by 1.
increase y by 2.`;
      const code = generate(source);

      expect(code).toContain("x.set(x.get() + 1)");
      expect(code).toContain("y.set(y.get() + 2)");
    });
  });

  describe("Conditional Generation", () => {
    it("should generate if block with equal condition", () => {
      const source = `If count is equal to 5,
show text saying "Five".`;
      const code = generate(source);

      expect(code).toContain("if (count.get() === 5)");
    });

    it("should generate if block with not equal condition", () => {
      const source = `If count is not equal to 0,
show text saying "Not zero".`;
      const code = generate(source);

      expect(code).toContain("if (count.get() !== 0)");
    });

    it("should generate if block with greater than condition", () => {
      const source = `If count is greater than 10,
show text saying "High".`;
      const code = generate(source);

      expect(code).toContain("if (count.get() > 10)");
    });

    it("should generate if block with less than condition", () => {
      const source = `If count is less than 5,
show text saying "Low".`;
      const code = generate(source);

      expect(code).toContain("if (count.get() < 5)");
    });
  });

  describe("Complete Programs", () => {
    it("should generate complete counter app", () => {
      const source = `There is a number called count starting at 0.

Show a heading saying "Counter".
Show text saying "Count: {count}".
Show a button saying "Increment".

When I click the button "Increment",
increase count by 1.`;

      const code = generate(source);

      expect(code).toContain("const count = createSignal(0, 'count')");
      expect(code).toContain("createElement('h1')");
      expect(code).toContain("createElement('button')");
      expect(code).toContain("addEventListener('click'");
      expect(code).toContain("count.set(count.get() + 1)");
    });

    it("should generate valid JavaScript syntax", () => {
      const source = `There is a number called count starting at 0.
Show text saying "Hello".`;

      const code = generate(source);

      // Strip imports and exports for syntax checking
      const codeWithoutModuleSyntax = code
        .replace(/import .* from .*;\n/g, "")
        .replace(/export /g, "");

      // Should not throw syntax error
      expect(() => new Function(codeWithoutModuleSyntax)).not.toThrow();
    });
  });

  describe("Dependencies", () => {
    it("should return runtime dependency", () => {
      const source = "There is a number called count starting at 0.";
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);
      const result = generator.generate(ast);

      expect(result.dependencies).toContain("@lingo-dsl/runtime");
    });
  });
});
