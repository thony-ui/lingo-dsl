import { LingoParser } from "../src/parser/LingoParser";
import { LingoTokenizer } from "../src/tokenizer/LingoTokenizer";
import { ConsoleErrorReporter } from "../src/errors/ConsoleErrorReporter";
import { ASTNodeType } from "../src/parser/AST";

describe("LingoParser", () => {
  let parser: LingoParser;
  let tokenizer: LingoTokenizer;
  let errorReporter: ConsoleErrorReporter;

  beforeEach(() => {
    errorReporter = new ConsoleErrorReporter();
    jest.spyOn(console, "error").mockImplementation(() => {});
    tokenizer = new LingoTokenizer(errorReporter);
    parser = new LingoParser(errorReporter);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("State Declarations", () => {
    it("should parse number state declaration", () => {
      const source = "There is a number called count starting at 0.";
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      expect(ast.statements.length).toBe(1);
      const stmt = ast.statements[0];
      expect(stmt.type).toBe(ASTNodeType.STATE_DECL);

      if (stmt.type === ASTNodeType.STATE_DECL) {
        expect(stmt.varType).toBe("number");
        expect(stmt.identifier).toBe("count");
        expect(stmt.initialValue.type).toBe("number");
        if (stmt.initialValue.type === "number") {
          expect(stmt.initialValue.value).toBe(0);
        }
      }
    });

    it("should parse text state declaration", () => {
      const source = 'There is text called name starting at "Anthony".';
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      expect(stmt.type).toBe(ASTNodeType.STATE_DECL);

      if (stmt.type === ASTNodeType.STATE_DECL) {
        expect(stmt.varType).toBe("text");
        expect(stmt.identifier).toBe("name");
        expect(stmt.initialValue.type).toBe("text");
        if (stmt.initialValue.type === "text") {
          expect(stmt.initialValue.value).toBe("Anthony");
        }
      }
    });

    it("should parse boolean state declaration", () => {
      const source = "There is a boolean called isOpen starting at false.";
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.STATE_DECL) {
        expect(stmt.varType).toBe("boolean");
        expect(stmt.identifier).toBe("isOpen");
        expect(stmt.initialValue.type).toBe("boolean");
        if (stmt.initialValue.type === "boolean") {
          expect(stmt.initialValue.value).toBe(false);
        }
      }
    });

    it("should parse list state declaration", () => {
      const source = "There is a list called todos starting empty.";
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.STATE_DECL) {
        expect(stmt.varType).toBe("list");
        expect(stmt.identifier).toBe("todos");
        expect(stmt.initialValue.type).toBe("empty");
      }
    });

    it('should handle "an" article', () => {
      const source = "There is an input called myInput starting empty.";
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      expect(ast.statements.length).toBe(1);
      expect(errorReporter.hasErrors()).toBe(false);
    });
  });

  describe("Show Statements", () => {
    it("should parse heading with saying", () => {
      const source = 'Show a heading saying "Counter".';
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      expect(stmt.type).toBe(ASTNodeType.SHOW_STMT);

      if (stmt.type === ASTNodeType.SHOW_STMT) {
        expect(stmt.widget).toBe("heading");
        expect(stmt.config.type).toBe("saying");
        if (stmt.config.type === "saying") {
          expect(stmt.config.template).toBe("Counter");
        }
      }
    });

    it("should parse text with template", () => {
      const source = 'Show text saying "Count is {count}".';
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.SHOW_STMT) {
        expect(stmt.widget).toBe("text");
        expect(stmt.config.type).toBe("saying");
        if (stmt.config.type === "saying") {
          expect(stmt.config.template).toBe("Count is {count}");
        }
      }
    });

    it("should parse button with saying", () => {
      const source = 'Show a button saying "Click me".';
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.SHOW_STMT) {
        expect(stmt.widget).toBe("button");
      }
    });

    it("should parse input called", () => {
      const source = "Show an input called name.";
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.SHOW_STMT) {
        expect(stmt.widget).toBe("input");
        expect(stmt.config.type).toBe("called");
        if (stmt.config.type === "called") {
          expect(stmt.config.identifier).toBe("name");
        }
      }
    });

    it("should parse image with source", () => {
      const source = 'Show an image with source "logo.png".';
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.SHOW_STMT) {
        expect(stmt.widget).toBe("image");
        expect(stmt.config.type).toBe("image");
        if (stmt.config.type === "image") {
          expect(stmt.config.source).toBe("logo.png");
        }
      }
    });

    it("should parse row and column", () => {
      const source = "Show a row.\nShow a column.";
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      expect(ast.statements.length).toBe(2);
      if (ast.statements[0].type === ASTNodeType.SHOW_STMT) {
        expect(ast.statements[0].widget).toBe("row");
      }
      if (ast.statements[1].type === ASTNodeType.SHOW_STMT) {
        expect(ast.statements[1].widget).toBe("column");
      }
    });
  });

  describe("Event Blocks", () => {
    it("should parse click event with literal widget reference", () => {
      const source = `When I click the button "Add",
increase count by 1.`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      expect(stmt.type).toBe(ASTNodeType.EVENT_BLOCK);

      if (stmt.type === ASTNodeType.EVENT_BLOCK) {
        expect(stmt.verb).toBe("click");
        expect(stmt.widgetRef.type).toBe("literal");
        if (stmt.widgetRef.type === "literal") {
          expect(stmt.widgetRef.widget).toBe("button");
          expect(stmt.widgetRef.label).toBe("Add");
        }
        expect(stmt.actions.length).toBe(1);
      }
    });

    it("should parse click event with identifier widget reference", () => {
      const source = `When I click the button called submitBtn,
set name to "John".`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.EVENT_BLOCK) {
        expect(stmt.verb).toBe("click");
        expect(stmt.widgetRef.type).toBe("identifier");
        if (stmt.widgetRef.type === "identifier") {
          expect(stmt.widgetRef.identifier).toBe("submitBtn");
        }
      }
    });

    it("should parse type event", () => {
      const source = `When I type the input called name,
set name to empty.`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.EVENT_BLOCK) {
        expect(stmt.verb).toBe("type");
      }
    });

    it("should parse multiple actions", () => {
      const source = `When I click the button "Submit",
increase count by 1.
set name to "Done".`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.EVENT_BLOCK) {
        expect(stmt.actions.length).toBe(2);
      }
    });
  });

  describe("Actions", () => {
    it("should parse increase action", () => {
      const source = `When I click the button "Add",
increase count by 5.`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.EVENT_BLOCK) {
        const action = stmt.actions[0].action;
        expect(action.type).toBe("increase");
        if (action.type === "increase") {
          expect(action.identifier).toBe("count");
          expect(action.amount).toBe(5);
        }
      }
    });

    it("should parse decrease action", () => {
      const source = `When I click the button "Sub",
decrease count by 1.`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.EVENT_BLOCK) {
        const action = stmt.actions[0].action;
        expect(action.type).toBe("decrease");
        if (action.type === "decrease") {
          expect(action.identifier).toBe("count");
          expect(action.amount).toBe(1);
        }
      }
    });

    it("should parse set action", () => {
      const source = `When I click the button "Reset",
set count to 0.`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.EVENT_BLOCK) {
        const action = stmt.actions[0].action;
        expect(action.type).toBe("set");
        if (action.type === "set") {
          expect(action.identifier).toBe("count");
          expect(action.value.type).toBe("number");
        }
      }
    });

    it("should parse add action", () => {
      const source = `When I click the button "Add",
add item to todos.`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.EVENT_BLOCK) {
        const action = stmt.actions[0].action;
        expect(action.type).toBe("add");
        if (action.type === "add") {
          expect(action.list).toBe("todos");
          expect(action.value.type).toBe("identifier");
        }
      }
    });

    it("should parse remove action", () => {
      const source = `When I click the button "Remove",
remove item from todos.`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.EVENT_BLOCK) {
        const action = stmt.actions[0].action;
        expect(action.type).toBe("remove");
        if (action.type === "remove") {
          expect(action.list).toBe("todos");
        }
      }
    });

    it("should parse toggle action", () => {
      const source = `When I click the button "Toggle",
toggle isOpen.`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.EVENT_BLOCK) {
        const action = stmt.actions[0].action;
        expect(action.type).toBe("toggle");
        if (action.type === "toggle") {
          expect(action.identifier).toBe("isOpen");
        }
      }
    });
  });

  describe("If Blocks", () => {
    it("should parse if block with equal condition", () => {
      const source = `If count is equal to 5,
show text saying "Five!".`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      expect(stmt.type).toBe(ASTNodeType.IF_BLOCK);

      if (stmt.type === ASTNodeType.IF_BLOCK) {
        expect(stmt.condition.identifier).toBe("count");
        expect(stmt.condition.comparator).toBe("equal");
        expect(stmt.body.length).toBe(1);
      }
    });

    it("should parse if block with not equal condition", () => {
      const source = `If count is not equal to 0,
show text saying "Not zero".`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.IF_BLOCK) {
        expect(stmt.condition.comparator).toBe("notEqual");
      }
    });

    it("should parse if block with greater than condition", () => {
      const source = `If count is greater than 5,
show text saying "High!".`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.IF_BLOCK) {
        expect(stmt.condition.comparator).toBe("greater");
      }
    });

    it("should parse if block with less than condition", () => {
      const source = `If count is less than 10,
show text saying "Low".`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.IF_BLOCK) {
        expect(stmt.condition.comparator).toBe("less");
      }
    });

    it("should parse if block with greater or equal condition", () => {
      const source = `If count is greater than or equal to 10,
show text saying "At least 10".`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.IF_BLOCK) {
        expect(stmt.condition.comparator).toBe("greaterOrEqual");
      }
    });

    it("should parse if block with less or equal condition", () => {
      const source = `If count is less than or equal to 5,
show text saying "At most 5".`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.IF_BLOCK) {
        expect(stmt.condition.comparator).toBe("lessOrEqual");
      }
    });

    it("should parse if block with multiple show statements", () => {
      const source = `If count is greater than 5,
show text saying "Line 1".
show text saying "Line 2".`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.IF_BLOCK) {
        expect(stmt.body.length).toBe(2);
      }
    });
  });

  describe("For Each Blocks", () => {
    it("should parse for each block", () => {
      const source = `For each item in todos,
show text saying "{item}".`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      expect(stmt.type).toBe(ASTNodeType.FOR_EACH_BLOCK);

      if (stmt.type === ASTNodeType.FOR_EACH_BLOCK) {
        expect(stmt.itemName).toBe("item");
        expect(stmt.listName).toBe("todos");
        expect(stmt.body.length).toBe(1);
      }
    });

    it("should parse for each block with multiple show statements", () => {
      const source = `For each task in tasks,
show text saying "{task}".
show a button saying "Delete".`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      const stmt = ast.statements[0];
      if (stmt.type === ASTNodeType.FOR_EACH_BLOCK) {
        expect(stmt.body.length).toBe(2);
      }
    });
  });

  describe("Complex Programs", () => {
    it("should parse a complete counter example", () => {
      const source = `There is a number called count starting at 0.

Show a heading saying "Counter".
Show text saying "Count: {count}".
Show a button saying "Increment".

When I click the button "Increment",
increase count by 1.`;

      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      expect(ast.statements.length).toBe(5);
      expect(ast.statements[0].type).toBe(ASTNodeType.STATE_DECL);
      expect(ast.statements[1].type).toBe(ASTNodeType.SHOW_STMT);
      expect(ast.statements[2].type).toBe(ASTNodeType.SHOW_STMT);
      expect(ast.statements[3].type).toBe(ASTNodeType.SHOW_STMT);
      expect(ast.statements[4].type).toBe(ASTNodeType.EVENT_BLOCK);
    });

    it("should parse multiple statements", () => {
      const source = `There is a number called x starting at 0.
There is text called y starting at "hello".
Show text saying "{x}".
Show text saying "{y}".`;

      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      expect(ast.statements.length).toBe(4);
    });

    it("should skip blank lines", () => {
      const source = `There is a number called count starting at 0.


Show text saying "Hello".`;

      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      expect(ast.statements.length).toBe(2);
    });
  });

  describe("Error Handling", () => {
    it("should report missing period", () => {
      const source = "There is a number called count starting at 0";
      const tokens = tokenizer.tokenize(source);
      parser.parse(tokens);

      expect(errorReporter.hasErrors()).toBe(true);
    });

    it("should report invalid type", () => {
      const source = 'There is a string called name starting at "test".';
      const tokens = tokenizer.tokenize(source);
      parser.parse(tokens);

      expect(errorReporter.hasErrors()).toBe(true);
    });

    it("should recover from errors and continue parsing", () => {
      const source = `There is a number called count.
Show text saying "Hello".`;
      const tokens = tokenizer.tokenize(source);
      const ast = parser.parse(tokens);

      // Should still parse the second statement
      expect(ast.statements.length).toBeGreaterThan(0);
    });
  });
});
