export interface SourceLocation {
  line: number;
  column: number;
  filename: string;
}

export enum TokenType {
  // Keywords
  THERE = "THERE",
  IS = "IS",
  A = "A",
  AN = "AN",
  CALLED = "CALLED",
  STARTING = "STARTING",
  SHOW = "SHOW",
  SAYING = "SAYING",
  WHEN = "WHEN",
  I = "I",
  CLICK = "CLICK",
  TYPE = "TYPE",
  THE = "THE",
  IF = "IF",
  FOR = "FOR",
  EACH = "EACH",
  IN = "IN",
  INCREASE = "INCREASE",
  DECREASE = "DECREASE",
  SET = "SET",
  TO = "TO",
  ADD = "ADD",
  REMOVE = "REMOVE",
  FROM = "FROM",
  TOGGLE = "TOGGLE",
  WITH = "WITH",
  SOURCE = "SOURCE",
  BY = "BY",
  AT = "AT",
  AND = "AND",
  GREATER = "GREATER",
  LESS = "LESS",
  THAN = "THAN",
  OR = "OR",
  EQUAL = "EQUAL",
  NOT = "NOT",

  // Styling keywords
  COLORED = "COLORED",
  CENTERED = "CENTERED",
  ALIGNED = "ALIGNED",
  CONTAINING = "CONTAINING",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  CENTER = "CENTER",
  BACKGROUND = "BACKGROUND",
  GAP = "GAP",

  // Types
  NUMBER_TYPE = "NUMBER_TYPE",
  TEXT_TYPE = "TEXT_TYPE",
  BOOLEAN_TYPE = "BOOLEAN_TYPE",
  LIST_TYPE = "LIST_TYPE",

  // Widgets (English-friendly names)
  HEADING = "HEADING",
  TEXT = "TEXT",
  PARAGRAPH = "PARAGRAPH",
  BUTTON = "BUTTON",
  INPUT = "INPUT",
  TEXTAREA = "TEXTAREA",
  IMAGE = "IMAGE",
  ROW = "ROW",
  COLUMN = "COLUMN",
  CONTAINER = "CONTAINER",
  ITALIC = "ITALIC",
  BOLD = "BOLD",
  STRONG = "STRONG",
  EMPHASIS = "EMPHASIS",
  UNDERLINE = "UNDERLINE",
  SMALL = "SMALL",
  MARK = "MARK",
  DELETED = "DELETED",
  INSERTED = "INSERTED",
  SUBSCRIPT = "SUBSCRIPT",
  SUPERSCRIPT = "SUPERSCRIPT",
  CODE = "CODE",
  PREFORMATTED = "PREFORMATTED",
  QUOTE = "QUOTE",
  LINK = "LINK",
  UNORDERED_LIST = "UNORDERED_LIST",
  ORDERED_LIST = "ORDERED_LIST",
  LISTITEM = "LISTITEM",
  SECTION = "SECTION",
  ARTICLE = "ARTICLE",
  ASIDE = "ASIDE",
  HEADER = "HEADER",
  FOOTER = "FOOTER",
  NAV = "NAV",
  MAIN = "MAIN",
  SPAN = "SPAN",
  DIVISION = "DIVISION",
  LINEBREAK = "LINEBREAK",
  RULE = "RULE",
  TABLE = "TABLE",
  TABLEROW = "TABLEROW",
  TABLEDATA = "TABLEDATA",
  TABLEHEADER = "TABLEHEADER",

  // Literals
  IDENTIFIER = "IDENTIFIER",
  NUMBER = "NUMBER",
  STRING = "STRING",
  TRUE = "TRUE",
  FALSE = "FALSE",
  EMPTY = "EMPTY",

  // Punctuation
  PERIOD = "PERIOD",
  COMMA = "COMMA",

  // Special
  NEWLINE = "NEWLINE",
  COMMENT = "COMMENT",
  EOF = "EOF",
}

export interface Token {
  type: TokenType;
  value: string;
  location: SourceLocation;
}
