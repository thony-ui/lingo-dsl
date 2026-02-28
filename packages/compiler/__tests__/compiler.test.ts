import { Compiler } from "../src/Compiler";
import { LingoTokenizer } from "../src/tokenizer/LingoTokenizer";
import { LingoParser } from "../src/parser/LingoParser";
import { LingoAnalyzer } from "../src/analyzer/LingoAnalyzer";
import { JSCodeGenerator } from "../src/codegen/JSCodeGenerator";
import { ConsoleErrorReporter } from "../src/errors/ConsoleErrorReporter";

describe("Compiler Integration", () => {
  let compiler: Compiler;
  let errorReporter: ConsoleErrorReporter;

  beforeEach(() => {
    errorReporter = new ConsoleErrorReporter();
    jest.spyOn(console, "error").mockImplementation(() => {});

    const tokenizer = new LingoTokenizer(errorReporter);
    const parser = new LingoParser(errorReporter);
    const analyzer = new LingoAnalyzer(errorReporter);
    const codegen = new JSCodeGenerator();

    compiler = new Compiler(
      tokenizer,
      parser,
      analyzer,
      codegen,
      errorReporter,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Full Pipeline", () => {
    it("should compile simple counter app", () => {
      const source = `There is a number called count starting at 0.

Show a heading saying "Counter".
Show text saying "Count: {count}".
Show a button saying "Increment".

When I click the button "Increment",
increase count by 1.`;

      const result = compiler.compile(source, "counter.lingo");

      expect(result.success).toBe(true);
      expect(result.code).toBeDefined();
      expect(result.code).toContain("createSignal");
      expect(result.code).toContain("createEffect");
      expect(result.dependencies).toContain("@lingo-dsl/runtime");
    });

    it("should handle tokenizer errors", () => {
      const source = 'There is a number called count starting at "unterminated';
      const result = compiler.compile(source);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should handle parser errors", () => {
      const source = "There is a number called count";
      const result = compiler.compile(source);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should handle semantic errors", () => {
      const source = 'Show text saying "{undefinedVar}".';
      const result = compiler.compile(source);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should compile todo app", () => {
      const source = `There is a list called todos starting empty.
There is text called input starting at "".

Show a heading saying "Todo List".
Show an input called input.
Show a button saying "Add Todo".

When I click the button "Add Todo",
add input to todos.
set input to "".

For each item in todos,
show text saying "{item}".`;

      const result = compiler.compile(source, "todos.lingo");

      expect(result.success).toBe(true);
      expect(result.code).toBeDefined();
    });

    it("should clear errors between compilations", () => {
      const badSource = "Invalid syntax here";
      const goodSource = "There is a number called count starting at 0.";

      compiler.compile(badSource);
      const result = compiler.compile(goodSource);

      expect(result.success).toBe(true);
    });
  });

  describe("Error Reporting", () => {
    it("should include line and column in errors", () => {
      const source = "Show text saying {bad}.";
      const result = compiler.compile(source, "test.lingo");

      expect(result.success).toBe(false);
      expect(result.errors[0].location).toBeDefined();
      expect(result.errors[0].location.filename).toBe("test.lingo");
    });

    it("should report multiple errors", () => {
      const source = `Show text saying "{undefined1}".
Show text saying "{undefined2}".`;
      const result = compiler.compile(source);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});
