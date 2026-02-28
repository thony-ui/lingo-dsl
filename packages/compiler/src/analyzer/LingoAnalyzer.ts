import {
  Program,
  Statement,
  ASTNodeType,
  StateDecl,
  ShowStmt,
  EventBlock,
  IfBlock,
  ForEachBlock,
  ActionStmt,
  Value,
  Action,
} from "../parser/AST";
import {
  ISemanticAnalyzer,
  AnalysisResult,
  SymbolInfo,
} from "./ISemanticAnalyzer";
import { IErrorReporter, ErrorSeverity } from "../errors/IErrorReporter";

export class LingoAnalyzer implements ISemanticAnalyzer {
  private symbolTable: Map<string, SymbolInfo> = new Map();
  private dependencies: Map<string, Set<string>> = new Map();

  constructor(private errorReporter: IErrorReporter) {}

  analyze(ast: Program): AnalysisResult {
    this.symbolTable = new Map();
    this.dependencies = new Map();

    // First pass: collect all state declarations
    for (const statement of ast.statements) {
      if (statement.type === ASTNodeType.STATE_DECL) {
        this.collectStateDeclaration(statement);
      }
    }

    // Second pass: validate usage
    for (const statement of ast.statements) {
      this.validateStatement(statement);
    }

    return {
      success: !this.errorReporter.hasErrors(),
      symbolTable: new Map(this.symbolTable),
      dependencies: new Map(this.dependencies),
    };
  }

  private collectStateDeclaration(stmt: StateDecl): void {
    if (this.symbolTable.has(stmt.identifier)) {
      this.reportError(
        `Variable '${stmt.identifier}' is already declared`,
        stmt.location,
      );
      return;
    }

    this.symbolTable.set(stmt.identifier, {
      name: stmt.identifier,
      type: stmt.varType,
      isInitialized: true,
    });
  }

  private validateStatement(stmt: Statement): void {
    switch (stmt.type) {
      case ASTNodeType.STATE_DECL:
        this.validateStateDecl(stmt);
        break;
      case ASTNodeType.SHOW_STMT:
        this.validateShowStmt(stmt);
        break;
      case ASTNodeType.EVENT_BLOCK:
        this.validateEventBlock(stmt);
        break;
      case ASTNodeType.IF_BLOCK:
        this.validateIfBlock(stmt);
        break;
      case ASTNodeType.FOR_EACH_BLOCK:
        this.validateForEachBlock(stmt);
        break;
    }
  }

  private validateStateDecl(stmt: StateDecl): void {
    // Validate initial value type matches declared type
    if (
      stmt.initialValue.type !== "empty" &&
      stmt.initialValue.type !== "identifier"
    ) {
      const valueType = stmt.initialValue.type;

      // Map value types to state types
      const typeMap: Record<string, string> = {
        number: "number",
        text: "text",
        boolean: "boolean",
      };

      const expectedType = typeMap[valueType];
      if (expectedType !== stmt.varType && stmt.varType !== "list") {
        this.reportError(
          `Type mismatch: cannot initialize '${stmt.varType}' with '${valueType}'`,
          stmt.location,
        );
      }
    }

    // Validate identifier in initial value
    if (stmt.initialValue.type === "identifier") {
      this.checkIdentifierExists(stmt.initialValue.name, stmt.location);
    }
  }

  private validateShowStmt(stmt: ShowStmt): void {
    if (stmt.config.type === "saying") {
      // Extract dependencies from template string
      const deps = this.extractTemplateDependencies(stmt.config.template);
      for (const dep of deps) {
        this.checkIdentifierExists(dep, stmt.location);
      }
    } else if (stmt.config.type === "called") {
      // Input/widget identifier doesn't need to be declared beforehand
      // It's a reference to the widget itself
    }
  }

  private validateEventBlock(stmt: EventBlock): void {
    // Validate widget reference identifier
    if (stmt.widgetRef.type === "identifier") {
      // Widget identifiers reference UI elements, not variables
      // They're validated differently
    }

    // Validate actions
    for (const actionStmt of stmt.actions) {
      this.validateAction(actionStmt.action, actionStmt.location);
    }
  }

  private validateAction(action: Action, location: any): void {
    switch (action.type) {
      case "increase":
      case "decrease":
        this.checkIdentifierExists(action.identifier, location);
        this.checkTypeCompatibility(action.identifier, "number", location);
        break;

      case "set":
        this.checkIdentifierExists(action.identifier, location);
        this.validateValue(action.value, location);
        // Could add type compatibility check here
        break;

      case "add":
      case "remove":
        this.checkIdentifierExists(action.list, location);
        this.checkTypeCompatibility(action.list, "list", location);
        this.validateValue(action.value, location);
        break;

      case "toggle":
        this.checkIdentifierExists(action.identifier, location);
        this.checkTypeCompatibility(action.identifier, "boolean", location);
        break;
    }
  }

  private validateIfBlock(stmt: IfBlock): void {
    // Validate condition identifier
    this.checkIdentifierExists(
      stmt.condition.identifier,
      stmt.condition.location,
    );
    this.validateValue(stmt.condition.value, stmt.condition.location);

    // Validate body
    for (const showStmt of stmt.body) {
      this.validateShowStmt(showStmt);
    }
  }

  private validateForEachBlock(stmt: ForEachBlock): void {
    // Validate list exists and is a list type
    this.checkIdentifierExists(stmt.listName, stmt.location);
    this.checkTypeCompatibility(stmt.listName, "list", stmt.location);

    // Item name is a local variable in the loop scope
    // In a more advanced implementation, we'd create a new scope
    const originalSymbol = this.symbolTable.get(stmt.itemName);

    // Temporarily add item to symbol table for body validation
    this.symbolTable.set(stmt.itemName, {
      name: stmt.itemName,
      type: "text", // Assuming list items are text/primitives for v0.1
      isInitialized: true,
    });

    // Validate body
    for (const bodyStmt of stmt.body) {
      this.validateShowStmt(bodyStmt);
    }

    // Restore original symbol or remove
    if (originalSymbol) {
      this.symbolTable.set(stmt.itemName, originalSymbol);
    } else {
      this.symbolTable.delete(stmt.itemName);
    }
  }

  private validateValue(value: Value, location: any): void {
    if (value.type === "identifier") {
      this.checkIdentifierExists(value.name, location);
    }
  }

  private checkIdentifierExists(identifier: string, location: any): boolean {
    if (!this.symbolTable.has(identifier)) {
      this.reportError(`Undefined variable: '${identifier}'`, location);
      return false;
    }
    return true;
  }

  private checkTypeCompatibility(
    identifier: string,
    expectedType: string,
    location: any,
  ): boolean {
    const symbol = this.symbolTable.get(identifier);
    if (!symbol) return false;

    if (symbol.type !== expectedType) {
      this.reportError(
        `Type error: '${identifier}' is '${symbol.type}', expected '${expectedType}'`,
        location,
      );
      return false;
    }
    return true;
  }

  private extractTemplateDependencies(template: string): string[] {
    const deps: string[] = [];
    const regex = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;
    let match;

    while ((match = regex.exec(template)) !== null) {
      deps.push(match[1]);
    }

    return deps;
  }

  private reportError(message: string, location: any): void {
    this.errorReporter.report({
      message,
      location,
      severity: ErrorSeverity.ERROR,
    });
  }
}
