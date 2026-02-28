import { LingoAnalyzer } from "../src/analyzer/LingoAnalyzer";
import { LingoTokenizer } from "../src/tokenizer/LingoTokenizer";
import { LingoParser } from "../src/parser/LingoParser";
import { ConsoleErrorReporter } from "../src/errors/ConsoleErrorReporter";

describe("LingoAnalyzer", () => {
  let analyzer: LingoAnalyzer;
  let tokenizer: LingoTokenizer;
  let parser: LingoParser;
  let errorReporter: ConsoleErrorReporter;

  beforeEach(() => {
    errorReporter = new ConsoleErrorReporter();
    jest.spyOn(console, "error").mockImplementation(() => {});
    tokenizer = new LingoTokenizer(errorReporter);
    parser = new LingoParser(errorReporter);
    analyzer = new LingoAnalyzer(errorReporter);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const analyze = (source: string) => {
    const tokens = tokenizer.tokenize(source);
    const ast = parser.parse(tokens);
    return analyzer.analyze(ast);
  };

  describe("Symbol Table", () => {
    it("should collect state declarations", () => {
      const source = `There is a number called count starting at 0.
There is text called name starting at "John".`;

      const result = analyze(source);

      expect(result.symbolTable.size).toBe(2);
      expect(result.symbolTable.has("count")).toBe(true);
      expect(result.symbolTable.has("name")).toBe(true);

      expect(result.symbolTable.get("count")?.type).toBe("number");
      expect(result.symbolTable.get("name")?.type).toBe("text");
    });

    it("should detect duplicate declarations", () => {
      const source = `There is a number called count starting at 0.
There is text called count starting at "test".`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(true);
      const errors = errorReporter.getErrors();
      expect(errors.some((e) => e.message.includes("already declared"))).toBe(
        true,
      );
    });

    it("should track all variable types", () => {
      const source = `There is a number called x starting at 0.
There is text called y starting at "hi".
There is a boolean called z starting at true.
There is a list called items starting empty.`;

      const result = analyze(source);

      expect(result.symbolTable.get("x")?.type).toBe("number");
      expect(result.symbolTable.get("y")?.type).toBe("text");
      expect(result.symbolTable.get("z")?.type).toBe("boolean");
      expect(result.symbolTable.get("items")?.type).toBe("list");
    });
  });

  describe("Type Checking", () => {
    it("should validate state declaration type matches initial value", () => {
      const source = `There is a number called count starting at "text".`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(true);
      const errors = errorReporter.getErrors();
      expect(errors.some((e) => e.message.includes("Type mismatch"))).toBe(
        true,
      );
    });

    it("should allow empty initial values", () => {
      const source = `There is a list called items starting empty.`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(false);
    });

    it("should check increase/decrease operates on numbers", () => {
      const source = `There is text called name starting at "John".

When I click the button "Test",
increase name by 1.`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(true);
      const errors = errorReporter.getErrors();
      expect(errors.some((e) => e.message.includes("expected 'number'"))).toBe(
        true,
      );
    });

    it("should check toggle operates on booleans", () => {
      const source = `There is a number called count starting at 0.

When I click the button "Test",
toggle count.`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(true);
      const errors = errorReporter.getErrors();
      expect(errors.some((e) => e.message.includes("expected 'boolean'"))).toBe(
        true,
      );
    });

    it("should check add/remove operates on lists", () => {
      const source = `There is a number called count starting at 0.

When I click the button "Test",
add "item" to count.`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(true);
      const errors = errorReporter.getErrors();
      expect(errors.some((e) => e.message.includes("expected 'list'"))).toBe(
        true,
      );
    });
  });

  describe("Undefined Variable Detection", () => {
    it("should detect undefined variables in show statements", () => {
      const source = `Show text saying "Count: {undefinedVar}".`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(true);
      const errors = errorReporter.getErrors();
      expect(
        errors.some((e) =>
          e.message.includes("Undefined variable: 'undefinedVar'"),
        ),
      ).toBe(true);
    });

    it("should detect undefined variables in actions", () => {
      const source = `When I click the button "Test",
increase undefinedCount by 1.`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(true);
      const errors = errorReporter.getErrors();
      expect(errors.some((e) => e.message.includes("Undefined variable"))).toBe(
        true,
      );
    });

    it("should detect undefined variables in set actions", () => {
      const source = `When I click the button "Test",
set undefinedVar to 5.`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(true);
    });

    it("should detect undefined variables in conditions", () => {
      const source = `If undefinedVar is greater than 5,
show text saying "High".`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(true);
    });

    it("should detect undefined lists in for-each", () => {
      const source = `For each item in undefinedList,
show text saying "{item}".`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(true);
    });
  });

  describe("Template Dependencies", () => {
    it("should extract dependencies from templates", () => {
      const source = `There is a number called count starting at 0.
There is text called name starting at "John".

Show text saying "Hello {name}, count is {count}".`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(false);
    });

    it("should detect undefined dependencies in templates", () => {
      const source = `There is a number called count starting at 0.

Show text saying "Count: {count}, Name: {undefinedName}".`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(true);
    });

    it("should handle multiple placeholders of same variable", () => {
      const source = `There is a number called x starting at 5.

Show text saying "{x} plus {x} equals {x}".`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(false);
    });
  });

  describe("For-Each Scope", () => {
    it("should allow item variable in for-each body", () => {
      const source = `There is a list called todos starting empty.

For each item in todos,
show text saying "{item}".`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(false);
    });

    it("should check list type in for-each", () => {
      const source = `There is a number called count starting at 0.

For each item in count,
show text saying "{item}".`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(true);
      const errors = errorReporter.getErrors();
      expect(errors.some((e) => e.message.includes("expected 'list'"))).toBe(
        true,
      );
    });

    it("should not leak item variable outside for-each", () => {
      const source = `There is a list called todos starting empty.

For each item in todos,
show text saying "{item}".

Show text saying "{item}".`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(true);
      const errors = errorReporter.getErrors();
      // The second reference to item should be undefined
      expect(
        errors.some((e) => e.message.includes("Undefined variable: 'item'")),
      ).toBe(true);
    });
  });

  describe("Valid Programs", () => {
    it("should accept valid counter program", () => {
      const source = `There is a number called count starting at 0.

Show a heading saying "Counter".
Show text saying "Count: {count}".
Show a button saying "Increment".

When I click the button "Increment",
increase count by 1.`;

      const result = analyze(source);

      expect(result.success).toBe(true);
      expect(errorReporter.hasErrors()).toBe(false);
    });

    it("should accept valid todo program", () => {
      const source = `There is a list called todos starting empty.
There is text called input starting at "".

Show a heading saying "Todos".
Show an input called input.
Show a button saying "Add".

When I click the button "Add",
add input to todos.

For each item in todos,
show text saying "{item}".`;

      const result = analyze(source);

      if (!result.success || errorReporter.hasErrors()) {
        console.log(
          "Errors:",
          errorReporter.getErrors().map((e) => e.message),
        );
      }

      expect(result.success).toBe(true);
      expect(errorReporter.hasErrors()).toBe(false);
    });

    it("should accept conditionals", () => {
      const source = `There is a number called score starting at 0.

If score is greater than 10,
show text saying "High score!".`;

      const result = analyze(source);

      expect(result.success).toBe(true);
      expect(errorReporter.hasErrors()).toBe(false);
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle multiple actions", () => {
      const source = `There is a number called x starting at 0.
There is a number called y starting at 0.

When I click the button "Update",
increase x by 1.
increase y by 2.`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(false);
    });

    it("should validate value references in actions", () => {
      const source = `There is a number called x starting at 0.
There is a number called y starting at 0.

When I click the button "Copy",
set x to y.`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(false);
    });

    it("should detect undefined value references", () => {
      const source = `There is a number called x starting at 0.

When I click the button "Set",
set x to undefinedVar.`;

      analyze(source);

      expect(errorReporter.hasErrors()).toBe(true);
    });
  });
});
