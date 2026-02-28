import { Token, TokenType, SourceLocation } from "./Token";
import { ITokenizer } from "./ITokenizer";
import { IErrorReporter, ErrorSeverity } from "../errors/IErrorReporter";

export class LingoTokenizer implements ITokenizer {
  private source: string = "";
  private filename: string = "";
  private pos: number = 0;
  private line: number = 1;
  private column: number = 1;
  private tokens: Token[] = [];

  private readonly keywords: Map<string, TokenType> = new Map([
    ["There", TokenType.THERE],
    ["is", TokenType.IS],
    ["a", TokenType.A],
    ["an", TokenType.AN],
    ["called", TokenType.CALLED],
    ["starting", TokenType.STARTING],
    ["Show", TokenType.SHOW],
    ["show", TokenType.SHOW],
    ["saying", TokenType.SAYING],
    ["When", TokenType.WHEN],
    ["I", TokenType.I],
    ["click", TokenType.CLICK],
    ["type", TokenType.TYPE],
    ["the", TokenType.THE],
    ["If", TokenType.IF],
    ["For", TokenType.FOR],
    ["each", TokenType.EACH],
    ["in", TokenType.IN],
    ["increase", TokenType.INCREASE],
    ["decrease", TokenType.DECREASE],
    ["set", TokenType.SET],
    ["to", TokenType.TO],
    ["add", TokenType.ADD],
    ["remove", TokenType.REMOVE],
    ["from", TokenType.FROM],
    ["toggle", TokenType.TOGGLE],
    ["with", TokenType.WITH],
    ["source", TokenType.SOURCE],
    ["by", TokenType.BY],
    ["and", TokenType.AND],
    ["greater", TokenType.GREATER],
    ["less", TokenType.LESS],
    ["than", TokenType.THAN],
    ["or", TokenType.OR],
    ["equal", TokenType.EQUAL],
    ["not", TokenType.NOT],
    // Types
    ["number", TokenType.NUMBER_TYPE],
    ["boolean", TokenType.BOOLEAN_TYPE],
    ["list", TokenType.LIST_TYPE],
    // Note: "text" is handled by TEXT widget token which doubles as TEXT_TYPE
    // Widgets (English-friendly names)
    ["heading", TokenType.HEADING],
    ["text", TokenType.TEXT], // "text" serves as both type and widget
    ["paragraph", TokenType.PARAGRAPH],
    ["button", TokenType.BUTTON],
    ["input", TokenType.INPUT],
    ["textarea", TokenType.TEXTAREA],
    ["image", TokenType.IMAGE],
    ["row", TokenType.ROW],
    ["column", TokenType.COLUMN],
    ["container", TokenType.CONTAINER],
    ["division", TokenType.DIVISION],
    ["italic", TokenType.ITALIC],
    ["bold", TokenType.BOLD],
    ["strong", TokenType.STRONG],
    ["emphasis", TokenType.EMPHASIS],
    ["underline", TokenType.UNDERLINE],
    ["small", TokenType.SMALL],
    ["mark", TokenType.MARK],
    ["highlight", TokenType.MARK], // alias for mark
    ["deleted", TokenType.DELETED],
    ["strikethrough", TokenType.DELETED], // alias
    ["inserted", TokenType.INSERTED],
    ["subscript", TokenType.SUBSCRIPT],
    ["superscript", TokenType.SUPERSCRIPT],
    ["code", TokenType.CODE],
    ["preformatted", TokenType.PREFORMATTED],
    ["quote", TokenType.QUOTE],
    ["blockquote", TokenType.QUOTE], // alias
    ["link", TokenType.LINK],
    ["unorderedlist", TokenType.UNORDERED_LIST],
    ["orderedlist", TokenType.ORDERED_LIST],
    ["numberedlist", TokenType.ORDERED_LIST], // alias
    ["listitem", TokenType.LISTITEM],
    ["section", TokenType.SECTION],
    ["article", TokenType.ARTICLE],
    ["aside", TokenType.ASIDE],
    ["header", TokenType.HEADER],
    ["footer", TokenType.FOOTER],
    ["nav", TokenType.NAV],
    ["navigation", TokenType.NAV], // alias
    ["main", TokenType.MAIN],
    ["span", TokenType.SPAN],
    ["linebreak", TokenType.LINEBREAK],
    ["break", TokenType.LINEBREAK], // alias
    ["rule", TokenType.RULE],
    ["line", TokenType.RULE], // alias
    ["table", TokenType.TABLE],
    ["tablerow", TokenType.TABLEROW],
    ["tabledata", TokenType.TABLEDATA],
    ["tableheader", TokenType.TABLEHEADER],
    // Literals
    ["true", TokenType.TRUE],
    ["false", TokenType.FALSE],
    ["empty", TokenType.EMPTY],
  ]);

  constructor(private errorReporter: IErrorReporter) {}

  tokenize(source: string, filename: string = "<input>"): Token[] {
    this.source = source;
    this.filename = filename;
    this.pos = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];

    while (!this.isAtEnd()) {
      this.scanToken();
    }

    this.addToken(TokenType.EOF, "");
    return this.tokens;
  }

  private scanToken(): void {
    const char = this.peek();

    // Skip whitespace (except newlines)
    if (char === " " || char === "\t" || char === "\r") {
      this.advance();
      return;
    }

    // Newline
    if (char === "\n") {
      this.addToken(TokenType.NEWLINE, "\n");
      this.advance();
      this.line++;
      this.column = 1;
      return;
    }

    // Comment
    if (char === "#") {
      this.scanComment();
      return;
    }

    // String
    if (char === '"') {
      this.scanString();
      return;
    }

    // Number
    if (this.isDigit(char) || (char === "-" && this.isDigit(this.peekNext()))) {
      this.scanNumber();
      return;
    }

    // Identifier or Keyword
    if (this.isAlpha(char) || char === "_") {
      this.scanIdentifier();
      return;
    }

    // Punctuation
    if (char === ".") {
      this.addToken(TokenType.PERIOD, ".");
      this.advance();
      return;
    }

    if (char === ",") {
      this.addToken(TokenType.COMMA, ",");
      this.advance();
      return;
    }

    // Unknown character
    this.reportError(`Unexpected character: '${char}'`);
    this.advance();
  }

  private scanComment(): void {
    const start = this.currentLocation();
    this.advance(); // Skip '#'

    let value = "";
    while (!this.isAtEnd() && this.peek() !== "\n") {
      value += this.peek();
      this.advance();
    }

    // Don't add comment tokens, just skip them
  }

  private scanString(): void {
    const start = this.currentLocation();
    this.advance(); // Skip opening "

    let value = "";
    while (!this.isAtEnd() && this.peek() !== '"') {
      if (this.peek() === "\\") {
        this.advance();
        if (this.isAtEnd()) break;

        const escaped = this.peek();
        switch (escaped) {
          case "n":
            value += "\n";
            break;
          case "t":
            value += "\t";
            break;
          case "\\":
            value += "\\";
            break;
          case '"':
            value += '"';
            break;
          default:
            value += escaped;
        }
        this.advance();
      } else {
        if (this.peek() === "\n") {
          this.line++;
          this.column = 1;
        }
        value += this.peek();
        this.advance();
      }
    }

    if (this.isAtEnd()) {
      this.reportError("Unterminated string", start);
      return;
    }

    this.advance(); // Skip closing "
    this.addToken(TokenType.STRING, value, start);
  }

  private scanNumber(): void {
    const start = this.currentLocation();
    let value = "";

    if (this.peek() === "-") {
      value += this.peek();
      this.advance();
    }

    while (this.isDigit(this.peek())) {
      value += this.peek();
      this.advance();
    }

    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      value += this.peek();
      this.advance();

      while (this.isDigit(this.peek())) {
        value += this.peek();
        this.advance();
      }
    }

    this.addToken(TokenType.NUMBER, value, start);
  }

  private scanIdentifier(): void {
    const start = this.currentLocation();
    let value = "";

    while (this.isAlphaNumeric(this.peek())) {
      value += this.peek();
      this.advance();
    }

    const type = this.keywords.get(value) || TokenType.IDENTIFIER;
    this.addToken(type, value, start);
  }

  private isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
  }

  private isAlpha(char: string): boolean {
    return (
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      char === "_"
    );
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }

  private peek(): string {
    if (this.isAtEnd()) return "\0";
    return this.source[this.pos];
  }

  private peekNext(): string {
    if (this.pos + 1 >= this.source.length) return "\0";
    return this.source[this.pos + 1];
  }

  private advance(): void {
    if (!this.isAtEnd()) {
      this.pos++;
      this.column++;
    }
  }

  private isAtEnd(): boolean {
    return this.pos >= this.source.length;
  }

  private currentLocation(): SourceLocation {
    return {
      line: this.line,
      column: this.column,
      filename: this.filename,
    };
  }

  private addToken(
    type: TokenType,
    value: string,
    location?: SourceLocation,
  ): void {
    this.tokens.push({
      type,
      value,
      location: location || this.currentLocation(),
    });
  }

  private reportError(message: string, location?: SourceLocation): void {
    this.errorReporter.report({
      message,
      location: location || this.currentLocation(),
      severity: ErrorSeverity.ERROR,
    });
  }
}
