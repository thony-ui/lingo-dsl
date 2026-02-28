import { LingoTokenizer } from "../src/tokenizer/LingoTokenizer";
import { TokenType } from "../src/tokenizer/Token";
import { ConsoleErrorReporter } from "../src/errors/ConsoleErrorReporter";

describe("LingoTokenizer", () => {
  let tokenizer: LingoTokenizer;
  let errorReporter: ConsoleErrorReporter;

  beforeEach(() => {
    errorReporter = new ConsoleErrorReporter();
    // Suppress console.error during tests
    jest.spyOn(console, "error").mockImplementation(() => {});
    tokenizer = new LingoTokenizer(errorReporter);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Keywords", () => {
    it("should tokenize state declaration keywords", () => {
      const source = "There is a number called";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.THERE);
      expect(tokens[1].type).toBe(TokenType.IS);
      expect(tokens[2].type).toBe(TokenType.A);
      expect(tokens[3].type).toBe(TokenType.NUMBER_TYPE);
      expect(tokens[4].type).toBe(TokenType.CALLED);
    });

    it("should tokenize show statement keywords", () => {
      const source = "Show a heading saying";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.SHOW);
      expect(tokens[1].type).toBe(TokenType.A);
      expect(tokens[2].type).toBe(TokenType.HEADING);
      expect(tokens[3].type).toBe(TokenType.SAYING);
    });

    it("should tokenize event keywords", () => {
      const source = "When I click the button";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.WHEN);
      expect(tokens[1].type).toBe(TokenType.I);
      expect(tokens[2].type).toBe(TokenType.CLICK);
      expect(tokens[3].type).toBe(TokenType.THE);
      expect(tokens[4].type).toBe(TokenType.BUTTON);
    });

    it("should tokenize action keywords", () => {
      const source = "increase decrease set to add remove from toggle";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.INCREASE);
      expect(tokens[1].type).toBe(TokenType.DECREASE);
      expect(tokens[2].type).toBe(TokenType.SET);
      expect(tokens[3].type).toBe(TokenType.TO);
      expect(tokens[4].type).toBe(TokenType.ADD);
      expect(tokens[5].type).toBe(TokenType.REMOVE);
      expect(tokens[6].type).toBe(TokenType.FROM);
      expect(tokens[7].type).toBe(TokenType.TOGGLE);
    });

    it("should tokenize control flow keywords", () => {
      const source = "If For each in";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.IF);
      expect(tokens[1].type).toBe(TokenType.FOR);
      expect(tokens[2].type).toBe(TokenType.EACH);
      expect(tokens[3].type).toBe(TokenType.IN);
    });
  });

  describe("Identifiers", () => {
    it("should tokenize simple identifiers", () => {
      const source = "count todos myVariable";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe("count");
      expect(tokens[1].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[1].value).toBe("todos");
      expect(tokens[2].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[2].value).toBe("myVariable");
    });

    it("should tokenize identifiers with underscores", () => {
      const source = "my_var _private";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe("my_var");
      expect(tokens[1].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[1].value).toBe("_private");
    });

    it("should tokenize identifiers with numbers", () => {
      const source = "var1 item2";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe("var1");
      expect(tokens[1].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[1].value).toBe("item2");
    });
  });

  describe("Numbers", () => {
    it("should tokenize positive integers", () => {
      const source = "0 123 456";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.NUMBER);
      expect(tokens[0].value).toBe("0");
      expect(tokens[1].type).toBe(TokenType.NUMBER);
      expect(tokens[1].value).toBe("123");
      expect(tokens[2].type).toBe(TokenType.NUMBER);
      expect(tokens[2].value).toBe("456");
    });

    it("should tokenize negative numbers", () => {
      const source = "-5 -100";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.NUMBER);
      expect(tokens[0].value).toBe("-5");
      expect(tokens[1].type).toBe(TokenType.NUMBER);
      expect(tokens[1].value).toBe("-100");
    });

    it("should tokenize decimal numbers", () => {
      const source = "3.14 -2.5 0.5";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.NUMBER);
      expect(tokens[0].value).toBe("3.14");
      expect(tokens[1].type).toBe(TokenType.NUMBER);
      expect(tokens[1].value).toBe("-2.5");
      expect(tokens[2].type).toBe(TokenType.NUMBER);
      expect(tokens[2].value).toBe("0.5");
    });
  });

  describe("Strings", () => {
    it("should tokenize simple strings", () => {
      const source = '"Hello" "World"';
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.STRING);
      expect(tokens[0].value).toBe("Hello");
      expect(tokens[1].type).toBe(TokenType.STRING);
      expect(tokens[1].value).toBe("World");
    });

    it("should tokenize strings with spaces", () => {
      const source = '"Hello World"';
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.STRING);
      expect(tokens[0].value).toBe("Hello World");
    });

    it("should handle escape sequences", () => {
      const source = '"Line 1\\nLine 2" "Quote: \\"Hello\\""';
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.STRING);
      expect(tokens[0].value).toBe("Line 1\nLine 2");
      expect(tokens[1].type).toBe(TokenType.STRING);
      expect(tokens[1].value).toBe('Quote: "Hello"');
    });

    it("should handle template placeholders", () => {
      const source = '"Count: {count}"';
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.STRING);
      expect(tokens[0].value).toBe("Count: {count}");
    });

    it("should report unterminated strings", () => {
      const source = '"Unterminated';
      tokenizer.tokenize(source, "test.lingo");

      expect(errorReporter.hasErrors()).toBe(true);
      const errors = errorReporter.getErrors();
      expect(errors[0].message).toBe("Unterminated string");
    });
  });

  describe("Punctuation", () => {
    it("should tokenize periods", () => {
      const source = ".";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.PERIOD);
      expect(tokens[0].value).toBe(".");
    });

    it("should tokenize commas", () => {
      const source = ",";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.COMMA);
      expect(tokens[0].value).toBe(",");
    });

    it("should tokenize newlines", () => {
      const source = "foo\nbar";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[1].type).toBe(TokenType.NEWLINE);
      expect(tokens[2].type).toBe(TokenType.IDENTIFIER);
    });
  });

  describe("Comments", () => {
    it("should skip comments", () => {
      const source = "# This is a comment\ncount";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.NEWLINE);
      expect(tokens[1].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[1].value).toBe("count");
    });

    it("should handle inline comments", () => {
      const source = "count # comment\n123";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe("count");
      expect(tokens[1].type).toBe(TokenType.NEWLINE);
      expect(tokens[2].type).toBe(TokenType.NUMBER);
    });
  });

  describe("Location tracking", () => {
    it("should track line and column numbers", () => {
      const source = "There is\na number";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].location.line).toBe(1);
      expect(tokens[0].location.column).toBe(1);
      expect(tokens[1].location.line).toBe(1);
      expect(tokens[1].location.column).toBe(7);
      expect(tokens[2].location.line).toBe(1);
      expect(tokens[3].location.line).toBe(2);
      expect(tokens[3].location.column).toBe(1);
    });

    it("should track filename", () => {
      const source = "count";
      const tokens = tokenizer.tokenize(source, "counter.lingo");

      expect(tokens[0].location.filename).toBe("counter.lingo");
    });
  });

  describe("Complex examples", () => {
    it("should tokenize a complete state declaration", () => {
      const source = "There is a number called count starting at 0.";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.THERE);
      expect(tokens[1].type).toBe(TokenType.IS);
      expect(tokens[2].type).toBe(TokenType.A);
      expect(tokens[3].type).toBe(TokenType.NUMBER_TYPE);
      expect(tokens[4].type).toBe(TokenType.CALLED);
      expect(tokens[5].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[5].value).toBe("count");
      expect(tokens[6].type).toBe(TokenType.STARTING);
      expect(tokens[7].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[7].value).toBe("at");
      expect(tokens[8].type).toBe(TokenType.NUMBER);
      expect(tokens[8].value).toBe("0");
      expect(tokens[9].type).toBe(TokenType.PERIOD);
    });

    it("should tokenize a show statement", () => {
      const source = 'Show a button saying "Click me".';
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.SHOW);
      expect(tokens[1].type).toBe(TokenType.A);
      expect(tokens[2].type).toBe(TokenType.BUTTON);
      expect(tokens[3].type).toBe(TokenType.SAYING);
      expect(tokens[4].type).toBe(TokenType.STRING);
      expect(tokens[4].value).toBe("Click me");
      expect(tokens[5].type).toBe(TokenType.PERIOD);
    });
  });

  describe("Error handling", () => {
    it("should report unexpected characters", () => {
      const source = "count @ 123";
      tokenizer.tokenize(source, "test.lingo");

      expect(errorReporter.hasErrors()).toBe(true);
      const errors = errorReporter.getErrors();
      expect(errors[0].message).toContain("Unexpected character");
    });

    it("should continue after errors", () => {
      const source = "count @ number";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[1].type).toBe(TokenType.NUMBER_TYPE);
    });
  });

  describe("EOF token", () => {
    it("should always end with EOF", () => {
      const source = "count";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens[tokens.length - 1].type).toBe(TokenType.EOF);
    });

    it("should have EOF even for empty input", () => {
      const source = "";
      const tokens = tokenizer.tokenize(source, "test.lingo");

      expect(tokens.length).toBe(1);
      expect(tokens[0].type).toBe(TokenType.EOF);
    });
  });
});
