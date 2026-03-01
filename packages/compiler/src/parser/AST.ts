import { SourceLocation } from "../tokenizer/Token";

export enum ASTNodeType {
  PROGRAM = "PROGRAM",
  STATE_DECL = "STATE_DECL",
  SHOW_STMT = "SHOW_STMT",
  EVENT_BLOCK = "EVENT_BLOCK",
  IF_BLOCK = "IF_BLOCK",
  FOR_EACH_BLOCK = "FOR_EACH_BLOCK",
  ACTION_STMT = "ACTION_STMT",
  CONDITION = "CONDITION",
}

export interface ASTNode {
  type: ASTNodeType;
  location: SourceLocation;
}

export interface Program extends ASTNode {
  type: ASTNodeType.PROGRAM;
  statements: Statement[];
}

export type Statement =
  | StateDecl
  | ShowStmt
  | EventBlock
  | IfBlock
  | ForEachBlock;

export type StateType = "number" | "text" | "boolean" | "list";

export type Value =
  | { type: "number"; value: number }
  | { type: "text"; value: string }
  | { type: "boolean"; value: boolean }
  | { type: "empty" }
  | { type: "identifier"; name: string };

export interface StateDecl extends ASTNode {
  type: ASTNodeType.STATE_DECL;
  varType: StateType;
  identifier: string;
  initialValue: Value;
}

export type WidgetType =
  // Layout containers
  | "row"
  | "column"
  | "div"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "nav"
  | "main"
  // Headings
  | "heading"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  // Text elements
  | "text"
  | "p"
  | "span"
  | "i"
  | "b"
  | "strong"
  | "em"
  | "u"
  | "small"
  | "mark"
  | "del"
  | "ins"
  | "sub"
  | "sup"
  | "code"
  | "pre"
  | "blockquote"
  // Form elements
  | "button"
  | "input"
  | "textarea"
  | "select"
  | "option"
  | "label"
  | "form"
  | "checkbox"
  | "radio"
  // Media elements
  | "image"
  | "img"
  | "video"
  | "audio"
  // Lists
  | "ul"
  | "ol"
  | "li"
  // Links
  | "a"
  // Table elements
  | "table"
  | "tr"
  | "td"
  | "th"
  | "thead"
  | "tbody"
  | "tfoot"
  // Other
  | "hr"
  | string; // Allow custom widget names

export interface StyleProperties {
  color?: string;
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right";
  gap?: string;
}

export interface ShowStmt extends ASTNode {
  type: ASTNodeType.SHOW_STMT;
  widget: WidgetType;
  config: ShowConfig;
  styles?: StyleProperties; // Style properties
  children?: ShowStmt[]; // For layout containers
  isCustom?: boolean; // Flag to indicate custom widget
}

export type ShowConfig =
  | { type: "saying"; template: string }
  | { type: "called"; identifier: string }
  | { type: "image"; source: string }
  | { type: "custom"; params: Record<string, string> } // Custom widget parameters
  | { type: "empty" };

export type EventVerb = "click" | "type" | "load";

export interface EventBlock extends ASTNode {
  type: ASTNodeType.EVENT_BLOCK;
  verb: EventVerb;
  widgetRef: WidgetRef;
  actions: ActionStmt[];
}

export type WidgetRef =
  | { type: "literal"; widget: WidgetType; label: string }
  | { type: "identifier"; widget: WidgetType; identifier: string };

export interface ActionStmt extends ASTNode {
  type: ASTNodeType.ACTION_STMT;
  action: Action;
}

export type Action =
  | { type: "increase"; identifier: string; amount: number }
  | { type: "decrease"; identifier: string; amount: number }
  | { type: "set"; identifier: string; value: Value }
  | { type: "add"; value: Value; list: string }
  | { type: "remove"; value: Value; list: string }
  | { type: "toggle"; identifier: string }
  | {
      type: "custom";
      name: string;
      identifier: string;
      params?: Record<string, string>;
    };

export type Comparator =
  | "equal"
  | "notEqual"
  | "greater"
  | "less"
  | "greaterOrEqual"
  | "lessOrEqual";

export interface Condition extends ASTNode {
  type: ASTNodeType.CONDITION;
  identifier: string;
  comparator: Comparator;
  value: Value;
}

export interface IfBlock extends ASTNode {
  type: ASTNodeType.IF_BLOCK;
  condition: Condition;
  body: ShowStmt[];
}

export interface ForEachBlock extends ASTNode {
  type: ASTNodeType.FOR_EACH_BLOCK;
  itemName: string;
  listName: string;
  body: ShowStmt[];
}
