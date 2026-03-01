import { Token, TokenType, SourceLocation } from "../tokenizer/Token";
import { IParser } from "./IParser";
import { IErrorReporter, ErrorSeverity } from "../errors/IErrorReporter";
import {
  Program,
  Statement,
  StateDecl,
  ShowStmt,
  EventBlock,
  IfBlock,
  ForEachBlock,
  ActionStmt,
  Condition,
  ASTNodeType,
  StateType,
  Value,
  WidgetType,
  ShowConfig,
  StyleProperties,
  EventVerb,
  WidgetRef,
  Action,
  Comparator,
} from "./AST";

export class LingoParser implements IParser {
  private tokens: Token[] = [];
  private current: number = 0;

  constructor(private errorReporter: IErrorReporter) {}

  parse(tokens: Token[]): Program {
    this.tokens = tokens;
    this.current = 0;

    const statements: Statement[] = [];

    while (!this.isAtEnd()) {
      // Skip newlines and comments at the top level
      if (this.check(TokenType.NEWLINE)) {
        this.advance();
        continue;
      }

      const stmt = this.parseStatement();
      if (stmt) {
        statements.push(stmt);
      }
    }

    return {
      type: ASTNodeType.PROGRAM,
      statements,
      location: this.currentLocation(),
    };
  }

  private parseStatement(): Statement | null {
    try {
      if (this.check(TokenType.THERE)) {
        return this.parseStateDecl();
      }
      if (this.check(TokenType.SHOW)) {
        return this.parseShowStmt();
      }
      if (this.check(TokenType.WHEN) || this.check(TokenType.ON)) {
        return this.parseEventBlock();
      }
      if (this.check(TokenType.IF)) {
        return this.parseIfBlock();
      }
      if (this.check(TokenType.FOR)) {
        return this.parseForEachBlock();
      }

      // Unknown statement, report error and skip to next line
      this.reportError(`Unexpected token: ${this.peek().value}`);
      this.synchronize();
      return null;
    } catch (error) {
      // Error already reported, synchronize to next statement
      this.synchronize();
      return null;
    }
  }

  private parseStateDecl(): StateDecl {
    const location = this.currentLocation();

    this.consume(TokenType.THERE, "Expected 'There'");
    this.consume(TokenType.IS, "Expected 'is'");

    // Article (a/an) - optional for backwards compatibility
    if (this.check(TokenType.A) || this.check(TokenType.AN)) {
      this.advance();
    }

    // Type
    const varType = this.parseType();

    this.consume(TokenType.CALLED, "Expected 'called'");

    const identifier = this.consumeIdentifierOrKeyword();

    this.consume(TokenType.STARTING, "Expected 'starting'");

    // Optional 'at' keyword (as identifier 'at')
    if (this.check(TokenType.IDENTIFIER) && this.peek().value === "at") {
      this.advance();
    }
    const initialValue = this.parseValue();

    this.consume(TokenType.PERIOD, "Expected '.'");
    this.skipNewlines();

    return {
      type: ASTNodeType.STATE_DECL,
      varType,
      identifier,
      initialValue,
      location,
    };
  }

  private parseType(): StateType {
    const token = this.peek();

    switch (token.type) {
      case TokenType.NUMBER_TYPE:
        this.advance();
        return "number";
      case TokenType.TEXT_TYPE:
      case TokenType.TEXT: // "text" can be both a type and a widget
        this.advance();
        return "text";
      case TokenType.BOOLEAN_TYPE:
        this.advance();
        return "boolean";
      case TokenType.LIST_TYPE:
        this.advance();
        return "list";
      case TokenType.INPUT:
      case TokenType.BUTTON:
      case TokenType.HEADING:
      case TokenType.IMAGE:
      case TokenType.ROW:
      case TokenType.COLUMN:
        // Widgets can also be used as types for convenience
        this.advance();
        return "text"; // Treat widget types as text for now
      default:
        this.reportError(`Expected type, got '${token.value}'`);
        this.advance();
        return "number"; // Default fallback
    }
  }

  private parseValue(): Value {
    const token = this.peek();

    if (token.type === TokenType.NUMBER) {
      this.advance();
      return { type: "number", value: parseFloat(token.value) };
    }

    if (token.type === TokenType.STRING) {
      this.advance();
      return { type: "text", value: token.value };
    }

    if (token.type === TokenType.TRUE) {
      this.advance();
      return { type: "boolean", value: true };
    }

    if (token.type === TokenType.FALSE) {
      this.advance();
      return { type: "boolean", value: false };
    }

    if (token.type === TokenType.EMPTY) {
      this.advance();
      return { type: "empty" };
    }

    // Allow identifiers and widget/type keywords as identifier values
    const allowedTypes = [
      TokenType.IDENTIFIER,
      TokenType.INPUT,
      TokenType.BUTTON,
      TokenType.TEXT,
      TokenType.HEADING,
      TokenType.IMAGE,
      TokenType.ROW,
      TokenType.COLUMN,
    ];

    if (allowedTypes.includes(token.type)) {
      this.advance();
      return { type: "identifier", name: token.value };
    }

    this.reportError(`Expected value, got '${token.value}'`);
    this.advance();
    return { type: "empty" };
  }

  private parseShowStmt(lowercase: boolean = false): ShowStmt {
    const location = this.currentLocation();

    this.consume(
      TokenType.SHOW,
      lowercase ? "Expected 'show'" : "Expected 'Show'",
    );

    // Article - optional for backwards compatibility
    if (this.check(TokenType.A) || this.check(TokenType.AN)) {
      this.advance();
    }

    // Check if this is a custom widget (identifier instead of keyword)
    const isCustom = this.check(TokenType.IDENTIFIER);
    const widget = isCustom ? this.parseCustomWidget() : this.parseWidget();
    const config = isCustom ? this.parseCustomConfig() : this.parseShowConfig();

    // Parse styling properties
    const styles = this.parseStyles();

    // Parse children for containers (row/column)
    let children: ShowStmt[] | undefined;
    if (this.check(TokenType.CONTAINING)) {
      children = this.parseContainerChildren();
    }

    // Period is not required if we have children (they end when next statement starts)
    if (!children) {
      this.consume(TokenType.PERIOD, "Expected '.'");
    }
    this.skipNewlines();

    return {
      type: ASTNodeType.SHOW_STMT,
      widget,
      config,
      styles,
      children,
      isCustom,
      location,
    };
  }

  private parseCustomWidget(): string {
    // Custom widget is just an identifier (e.g., "card", "modal", etc.)
    const token = this.consume(TokenType.IDENTIFIER, "Expected widget name");
    return token.value;
  }

  private parseCustomConfig(): ShowConfig {
    const params: Record<string, string> = {};

    // Parse: with key "value" and key2 "value2" ...
    if (this.check(TokenType.WITH)) {
      this.advance();

      do {
        // Parse parameter name (can be any identifier or keyword)
        const paramName = this.consumeIdentifierOrKeyword();

        // Parse parameter value (string)
        const paramValue = this.consume(
          TokenType.STRING,
          "Expected string value for parameter",
        ).value;

        params[paramName] = paramValue;

        // Check for "and" to continue with more parameters
        if (this.check(TokenType.AND)) {
          this.advance();
        } else {
          break;
        }
      } while (true);
    }

    return { type: "custom", params };
  }

  private parseWidget(): WidgetType {
    const token = this.peek();

    const widgets: TokenType[] = [
      TokenType.HEADING,
      TokenType.TEXT,
      TokenType.PARAGRAPH,
      TokenType.BUTTON,
      TokenType.INPUT,
      TokenType.TEXTAREA,
      TokenType.IMAGE,
      TokenType.ROW,
      TokenType.COLUMN,
      TokenType.CONTAINER,
      TokenType.DIVISION,
      TokenType.ITALIC,
      TokenType.BOLD,
      TokenType.STRONG,
      TokenType.EMPHASIS,
      TokenType.UNDERLINE,
      TokenType.SMALL,
      TokenType.MARK,
      TokenType.DELETED,
      TokenType.INSERTED,
      TokenType.SUBSCRIPT,
      TokenType.SUPERSCRIPT,
      TokenType.CODE,
      TokenType.PREFORMATTED,
      TokenType.QUOTE,
      TokenType.LINK,
      TokenType.UNORDERED_LIST,
      TokenType.ORDERED_LIST,
      TokenType.LISTITEM,
      TokenType.SECTION,
      TokenType.ARTICLE,
      TokenType.ASIDE,
      TokenType.HEADER,
      TokenType.FOOTER,
      TokenType.NAV,
      TokenType.MAIN,
      TokenType.SPAN,
      TokenType.LINEBREAK,
      TokenType.RULE,
      TokenType.TABLE,
      TokenType.TABLEROW,
      TokenType.TABLEDATA,
      TokenType.TABLEHEADER,
    ];

    if (!widgets.includes(token.type)) {
      this.reportError(`Expected widget type, got '${token.value}'`);
      this.advance();
      return "text"; // Default fallback
    }

    this.advance();

    // Map English-friendly names to HTML tags
    return this.mapTokenToWidgetType(token.type);
  }

  private mapTokenToWidgetType(tokenType: TokenType): WidgetType {
    const mapping: Record<string, WidgetType> = {
      // Original widgets - keep as-is for backwards compatibility
      [TokenType.HEADING]: "heading",
      [TokenType.TEXT]: "text",
      [TokenType.BUTTON]: "button",
      [TokenType.INPUT]: "input",
      [TokenType.IMAGE]: "image",
      [TokenType.ROW]: "row",
      [TokenType.COLUMN]: "column",
      // New HTML-friendly widgets
      [TokenType.PARAGRAPH]: "p",
      [TokenType.TEXTAREA]: "textarea",
      [TokenType.CONTAINER]: "div",
      [TokenType.DIVISION]: "div",
      [TokenType.ITALIC]: "i",
      [TokenType.BOLD]: "b",
      [TokenType.STRONG]: "strong",
      [TokenType.EMPHASIS]: "em",
      [TokenType.UNDERLINE]: "u",
      [TokenType.SMALL]: "small",
      [TokenType.MARK]: "mark",
      [TokenType.DELETED]: "del",
      [TokenType.INSERTED]: "ins",
      [TokenType.SUBSCRIPT]: "sub",
      [TokenType.SUPERSCRIPT]: "sup",
      [TokenType.CODE]: "code",
      [TokenType.PREFORMATTED]: "pre",
      [TokenType.QUOTE]: "blockquote",
      [TokenType.LINK]: "a",
      [TokenType.UNORDERED_LIST]: "ul",
      [TokenType.ORDERED_LIST]: "ol",
      [TokenType.LISTITEM]: "li",
      [TokenType.SECTION]: "section",
      [TokenType.ARTICLE]: "article",
      [TokenType.ASIDE]: "aside",
      [TokenType.HEADER]: "header",
      [TokenType.FOOTER]: "footer",
      [TokenType.NAV]: "nav",
      [TokenType.MAIN]: "main",
      [TokenType.SPAN]: "span",
      [TokenType.LINEBREAK]: "br",
      [TokenType.RULE]: "hr",
      [TokenType.TABLE]: "table",
      [TokenType.TABLEROW]: "tr",
      [TokenType.TABLEDATA]: "td",
      [TokenType.TABLEHEADER]: "th",
    };

    return mapping[tokenType] || "text";
  }

  private parseShowConfig(): ShowConfig {
    if (this.check(TokenType.SAYING)) {
      this.advance();
      const template = this.consume(
        TokenType.STRING,
        "Expected string after 'saying'",
      ).value;
      return { type: "saying", template };
    }

    if (this.check(TokenType.CALLED)) {
      this.advance();
      const identifier = this.consumeIdentifierOrKeyword();
      return { type: "called", identifier };
    }

    if (this.check(TokenType.WITH)) {
      this.advance();
      this.consume(TokenType.SOURCE, "Expected 'source' after 'with'");
      const source = this.consume(
        TokenType.STRING,
        "Expected string after 'source'",
      ).value;
      return { type: "image", source };
    }

    return { type: "empty" };
  }

  private parseStyles(): StyleProperties | undefined {
    const styles: StyleProperties = {};
    let hasStyles = false;

    // Parse styling keywords: colored, centered, aligned, background, gap
    while (
      this.check(TokenType.COLORED) ||
      this.check(TokenType.CENTERED) ||
      this.check(TokenType.ALIGNED) ||
      this.check(TokenType.BACKGROUND) ||
      this.check(TokenType.GAP) ||
      this.check(TokenType.AND)
    ) {
      // Skip "and" connectors
      if (this.check(TokenType.AND)) {
        this.advance();
        continue;
      }

      if (this.check(TokenType.COLORED)) {
        this.advance();
        // Next token should be an identifier (color name) or string
        const colorToken = this.peek();
        if (
          colorToken.type === TokenType.IDENTIFIER ||
          colorToken.type === TokenType.STRING
        ) {
          styles.color = this.advance().value;
          hasStyles = true;
        }
      } else if (this.check(TokenType.CENTERED)) {
        this.advance();
        styles.textAlign = "center";
        hasStyles = true;
      } else if (this.check(TokenType.ALIGNED)) {
        this.advance();
        // Next should be left, right, or center
        if (this.check(TokenType.LEFT)) {
          this.advance();
          styles.textAlign = "left";
          hasStyles = true;
        } else if (this.check(TokenType.RIGHT)) {
          this.advance();
          styles.textAlign = "right";
          hasStyles = true;
        } else if (this.check(TokenType.CENTER)) {
          this.advance();
          styles.textAlign = "center";
          hasStyles = true;
        }
      } else if (this.check(TokenType.BACKGROUND)) {
        this.advance();
        // Next token should be an identifier (color name) or string
        const bgToken = this.peek();
        if (
          bgToken.type === TokenType.IDENTIFIER ||
          bgToken.type === TokenType.STRING
        ) {
          styles.backgroundColor = this.advance().value;
          hasStyles = true;
        }
      } else if (this.check(TokenType.GAP)) {
        this.advance();
        // Next token should be a string or number
        const gapToken = this.peek();
        if (
          gapToken.type === TokenType.STRING ||
          gapToken.type === TokenType.NUMBER ||
          gapToken.type === TokenType.IDENTIFIER
        ) {
          styles.gap = this.advance().value;
          hasStyles = true;
        }
      }
    }

    return hasStyles ? styles : undefined;
  }

  private parseContainerChildren(): ShowStmt[] {
    this.consume(TokenType.CONTAINING, "Expected 'containing'");
    this.consume(TokenType.COMMA, "Expected ','");
    this.skipNewlines();

    const children: ShowStmt[] = [];

    // Parse child show statements until we hit a new statement
    while (!this.isAtEnd() && !this.isStatementStart()) {
      if (this.check(TokenType.NEWLINE)) {
        this.advance();
        continue;
      }

      if (this.check(TokenType.SHOW)) {
        const child = this.parseShowStmt(true);
        children.push(child);
      } else {
        break;
      }
    }

    return children;
  }

  private parseEventBlock(): EventBlock {
    const location = this.currentLocation();

    // Handle "On page load," syntax
    if (this.check(TokenType.ON)) {
      this.consume(TokenType.ON, "Expected 'On'");
      this.consume(TokenType.PAGE, "Expected 'page'");
      this.consume(TokenType.LOAD, "Expected 'load'");
      this.consume(TokenType.COMMA, "Expected ','");
      this.skipNewlines();

      const actions: ActionStmt[] = [];
      while (!this.isAtEnd() && !this.isStatementStart()) {
        if (this.check(TokenType.NEWLINE)) {
          this.advance();
          continue;
        }

        const action = this.parseActionStmt();
        if (action) {
          actions.push(action);
        } else {
          this.advance();
        }
      }

      return {
        type: ASTNodeType.EVENT_BLOCK,
        verb: "load",
        widgetRef: { type: "literal", widget: "div", label: "" }, // Dummy widget ref for load event
        actions,
        location,
      };
    }

    // Handle "When I..." syntax
    this.consume(TokenType.WHEN, "Expected 'When'");
    this.consume(TokenType.I, "Expected 'I'");

    const verb = this.parseEventVerb();
    this.consume(TokenType.THE, "Expected 'the'");

    const widgetRef = this.parseWidgetRef();

    this.consume(TokenType.COMMA, "Expected ','");
    this.skipNewlines();

    const actions: ActionStmt[] = [];
    while (!this.isAtEnd() && !this.isStatementStart()) {
      if (this.check(TokenType.NEWLINE)) {
        this.advance();
        continue;
      }

      const action = this.parseActionStmt();
      if (action) {
        actions.push(action);
      } else {
        // Prevent infinite loop: if we couldn't parse an action, skip this token
        this.advance();
      }
    }

    return {
      type: ASTNodeType.EVENT_BLOCK,
      verb,
      widgetRef,
      actions,
      location,
    };
  }

  private parseEventVerb(): EventVerb {
    const token = this.peek();

    if (token.type === TokenType.CLICK) {
      this.advance();
      return "click";
    }

    if (token.type === TokenType.TYPE) {
      this.advance();
      return "type";
    }

    this.reportError(`Expected event verb (click/type), got '${token.value}'`);
    this.advance();
    return "click";
  }

  private parseWidgetRef(): WidgetRef {
    const widget = this.parseWidget();

    if (this.check(TokenType.STRING)) {
      const label = this.advance().value;
      return { type: "literal", widget, label };
    }

    if (this.check(TokenType.CALLED)) {
      this.advance();
      const identifier = this.consume(
        TokenType.IDENTIFIER,
        "Expected identifier",
      ).value;
      return { type: "identifier", widget, identifier };
    }

    this.reportError("Expected string or 'called' after widget type");
    return { type: "literal", widget, label: "" };
  }

  private parseActionStmt(): ActionStmt | null {
    const location = this.currentLocation();
    const action = this.parseAction();

    if (!action) return null;

    this.consume(TokenType.PERIOD, "Expected '.' after action");
    this.skipNewlines();

    return {
      type: ASTNodeType.ACTION_STMT,
      action,
      location,
    };
  }

  private parseAction(): Action | null {
    if (this.check(TokenType.INCREASE)) {
      return this.parseIncreaseAction();
    }

    if (this.check(TokenType.DECREASE)) {
      return this.parseDecreaseAction();
    }

    if (this.check(TokenType.SET)) {
      return this.parseSetAction();
    }

    if (this.check(TokenType.ADD)) {
      return this.parseAddAction();
    }

    if (this.check(TokenType.REMOVE)) {
      return this.parseRemoveAction();
    }

    if (this.check(TokenType.TOGGLE)) {
      return this.parseToggleAction();
    }

    // Check for custom action (identifier)
    if (this.check(TokenType.IDENTIFIER)) {
      return this.parseCustomAction();
    }

    this.reportError(`Expected action keyword, got '${this.peek().value}'`);
    return null;
  }

  private parseCustomAction(): Action {
    const name = this.consume(
      TokenType.IDENTIFIER,
      "Expected action name",
    ).value;
    const identifier = this.consumeIdentifierOrKeyword();

    // Optional parameters: with param1 "value1" and param2 "value2"
    const params: Record<string, string> = {};
    if (this.check(TokenType.WITH)) {
      this.advance();

      do {
        const paramName = this.consumeIdentifierOrKeyword();
        const paramValue = this.consume(
          TokenType.STRING,
          "Expected string value",
        ).value;
        params[paramName] = paramValue;

        if (this.check(TokenType.AND)) {
          this.advance();
        } else {
          break;
        }
      } while (true);
    }

    return {
      type: "custom",
      name,
      identifier,
      params: Object.keys(params).length > 0 ? params : undefined,
    };
  }

  private parseIncreaseAction(): Action {
    this.consume(TokenType.INCREASE, "Expected 'increase'");
    const identifier = this.consumeIdentifierOrKeyword();
    this.consume(TokenType.BY, "Expected 'by'");
    const amount = parseFloat(
      this.consume(TokenType.NUMBER, "Expected number").value,
    );

    return { type: "increase", identifier, amount };
  }

  private parseDecreaseAction(): Action {
    this.consume(TokenType.DECREASE, "Expected 'decrease'");
    const identifier = this.consumeIdentifierOrKeyword();
    this.consume(TokenType.BY, "Expected 'by'");
    const amount = parseFloat(
      this.consume(TokenType.NUMBER, "Expected number").value,
    );

    return { type: "decrease", identifier, amount };
  }

  private parseSetAction(): Action {
    this.consume(TokenType.SET, "Expected 'set'");
    const identifier = this.consumeIdentifierOrKeyword();
    this.consume(TokenType.TO, "Expected 'to'");
    const value = this.parseValue();

    return { type: "set", identifier, value };
  }

  private parseAddAction(): Action {
    this.consume(TokenType.ADD, "Expected 'add'");
    const value = this.parseValue();
    this.consume(TokenType.TO, "Expected 'to'");
    const list = this.consumeIdentifierOrKeyword();

    return { type: "add", value, list };
  }

  private parseRemoveAction(): Action {
    this.consume(TokenType.REMOVE, "Expected 'remove'");
    const value = this.parseValue();
    this.consume(TokenType.FROM, "Expected 'from'");
    const list = this.consumeIdentifierOrKeyword();

    return { type: "remove", value, list };
  }

  private parseToggleAction(): Action {
    this.consume(TokenType.TOGGLE, "Expected 'toggle'");
    const identifier = this.consumeIdentifierOrKeyword();

    return { type: "toggle", identifier };
  }

  private parseIfBlock(): IfBlock {
    const location = this.currentLocation();

    this.consume(TokenType.IF, "Expected 'If'");
    const condition = this.parseCondition();
    this.consume(TokenType.COMMA, "Expected ','");
    this.skipNewlines();

    const body: ShowStmt[] = [];
    while (!this.isAtEnd() && !this.isStatementStart()) {
      if (this.check(TokenType.NEWLINE)) {
        this.advance();
        continue;
      }

      const showStmt = this.parseShowStmt(true);
      body.push(showStmt);
    }

    return {
      type: ASTNodeType.IF_BLOCK,
      condition,
      body,
      location,
    };
  }

  private parseCondition(): Condition {
    const location = this.currentLocation();

    const identifier = this.consumeIdentifierOrKeyword();
    this.consume(TokenType.IS, "Expected 'is'");

    const comparator = this.parseComparator();
    const value = this.parseValue();

    return {
      type: ASTNodeType.CONDITION,
      identifier,
      comparator,
      value,
      location,
    };
  }

  private parseComparator(): Comparator {
    // Handle 'not equal to'
    if (this.check(TokenType.NOT)) {
      this.advance();
      this.consume(TokenType.EQUAL, "Expected 'equal'");
      this.consume(TokenType.TO, "Expected 'to'");
      return "notEqual";
    }

    // Handle 'equal to'
    if (this.check(TokenType.EQUAL)) {
      this.advance();
      this.consume(TokenType.TO, "Expected 'to'");
      return "equal";
    }

    // Handle 'greater than [or equal to]'
    if (this.check(TokenType.GREATER)) {
      this.advance();
      this.consume(TokenType.THAN, "Expected 'than'");

      if (this.check(TokenType.OR)) {
        this.advance();
        this.consume(TokenType.EQUAL, "Expected 'equal'");
        this.consume(TokenType.TO, "Expected 'to'");
        return "greaterOrEqual";
      }

      return "greater";
    }

    // Handle 'less than [or equal to]'
    if (this.check(TokenType.LESS)) {
      this.advance();
      this.consume(TokenType.THAN, "Expected 'than'");

      if (this.check(TokenType.OR)) {
        this.advance();
        this.consume(TokenType.EQUAL, "Expected 'equal'");
        this.consume(TokenType.TO, "Expected 'to'");
        return "lessOrEqual";
      }

      return "less";
    }

    this.reportError("Expected comparator");
    return "equal";
  }

  private parseForEachBlock(): ForEachBlock {
    const location = this.currentLocation();

    this.consume(TokenType.FOR, "Expected 'For'");
    this.consume(TokenType.EACH, "Expected 'each'");

    const itemName = this.consumeIdentifierOrKeyword();

    this.consume(TokenType.IN, "Expected 'in'");

    const listName = this.consumeIdentifierOrKeyword();

    this.consume(TokenType.COMMA, "Expected ','");
    this.skipNewlines();

    const body: ShowStmt[] = [];
    while (!this.isAtEnd() && !this.isStatementStart()) {
      if (this.check(TokenType.NEWLINE)) {
        this.advance();
        continue;
      }

      const showStmt = this.parseShowStmt(true);
      body.push(showStmt);
    }

    return {
      type: ASTNodeType.FOR_EACH_BLOCK,
      itemName,
      listName,
      body,
      location,
    };
  }

  // Helper methods

  private isStatementStart(): boolean {
    const token = this.peek();
    return (
      this.check(TokenType.THERE) ||
      (this.check(TokenType.SHOW) && token.value === "Show") || // Only capitalized Show for top-level
      this.check(TokenType.WHEN) ||
      this.check(TokenType.IF) ||
      this.check(TokenType.FOR)
    );
  }

  private skipNewlines(): void {
    while (this.check(TokenType.NEWLINE)) {
      this.advance();
    }
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private consumeIdentifierOrKeyword(): string {
    const token = this.peek();
    // Allow identifiers and almost any keyword as identifiers in certain contexts
    // This is useful for variable names and custom widget parameters
    const allowedTypes = [
      TokenType.IDENTIFIER,
      // Widgets
      TokenType.INPUT,
      TokenType.BUTTON,
      TokenType.TEXT,
      TokenType.HEADING,
      TokenType.IMAGE,
      TokenType.ROW,
      TokenType.COLUMN,
      // Types
      TokenType.NUMBER_TYPE,
      TokenType.TEXT_TYPE,
      TokenType.BOOLEAN_TYPE,
      TokenType.LIST_TYPE,
      // Other keywords that might be used as parameter names
      TokenType.TYPE,
      TokenType.SOURCE,
      TokenType.BY,
      TokenType.TO,
      TokenType.FROM,
      TokenType.WITH,
      TokenType.AT,
    ];

    if (allowedTypes.includes(token.type)) {
      this.advance();
      return token.value;
    }

    this.reportError("Expected identifier");
    throw new Error("Expected identifier");
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();

    this.reportError(message);
    throw new Error(message);
  }

  private currentLocation(): SourceLocation {
    return this.peek().location;
  }

  private reportError(message: string): void {
    this.errorReporter.report({
      message,
      location: this.currentLocation(),
      severity: ErrorSeverity.ERROR,
    });
  }

  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.NEWLINE) {
        return;
      }

      if (this.isStatementStart()) {
        return;
      }

      this.advance();
    }
  }
}
