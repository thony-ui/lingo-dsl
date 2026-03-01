/**
 * React Code Generator
 * Single Responsibility: Generate equivalent React code from Lingo AST
 */

import type {
  Program,
  StateDecl,
  ShowStmt,
  IfBlock,
  ForEachBlock,
} from "@lingo-dsl/compiler";
import type { ReactEquivalent, HookUsage, RenderNode } from "../types";
import type { IReactGenerator } from "../interfaces";

export class ReactGenerator implements IReactGenerator {
  generate(ast: Program): ReactEquivalent {
    const imports = this.generateImports();
    const component = this.generateComponent(ast);
    const hookUsage = this.extractHookUsage(ast);

    const componentCode = `${imports}\n\n${component}`;
    const explanation = this.generateExplanation(ast);

    return {
      componentCode,
      hookUsage,
      explanation,
    };
  }

  generateForNode(node: RenderNode): string {
    switch (node.type) {
      case "heading":
        return `<h1>${node.props.content}</h1>`;
      case "text":
        return `<p>${node.props.content}</p>`;
      case "button":
        return `<button>{${node.props.content}}</button>`;
      case "input":
        return `<input value={${node.props.name}} onChange={...} />`;
      default:
        return `<div>${node.props.content || ""}</div>`;
    }
  }

  explainMapping(lingoConstruct: string): string {
    const mappings: Record<string, string> = {
      "state declaration": "useState hook - manages component state",
      "show statement": "JSX element - renders UI",
      "event handler": "event handler function - responds to user interactions",
      conditional: "conditional rendering with && or ternary operator",
      loop: ".map() function - renders lists",
    };

    return mappings[lingoConstruct] || "Direct React equivalent";
  }

  // ==================== Private Helper Methods ====================

  private generateImports(): string {
    return `import { useState } from 'react';`;
  }

  private generateComponent(ast: Program): string {
    const stateDecls = ast.statements.filter(
      (stmt): stmt is StateDecl => stmt.type === "STATE_DECL",
    );

    const stateHooks = stateDecls
      .map((decl) => this.generateStateHook(decl))
      .join("\n  ");
    const jsx = this.generateJSX(ast);

    return `export default function App() {
  ${stateHooks}

  return (
    <div className="app">
${jsx}
    </div>
  );
}`;
  }

  private generateStateHook(decl: StateDecl): string {
    const initialValue = this.formatInitialValue(decl);
    const capitalizedName = this.capitalize(decl.identifier);

    return `const [${decl.identifier}, set${capitalizedName}] = useState(${initialValue});`;
  }

  private generateJSX(ast: Program): string {
    const lines: string[] = [];

    for (const stmt of ast.statements) {
      switch (stmt.type) {
        case "SHOW_STMT":
          lines.push(this.generateShowStmt(stmt as ShowStmt));
          break;
        case "IF_BLOCK":
          lines.push(this.generateConditional(stmt as IfBlock));
          break;
        case "FOR_EACH_BLOCK":
          lines.push(this.generateLoop(stmt as ForEachBlock));
          break;
        case "EVENT_BLOCK":
          // Event handlers are generated inline with elements
          break;
      }
    }

    return lines.map((line) => `      ${line}`).join("\n");
  }

  private generateShowStmt(stmt: ShowStmt): string {
    const content =
      stmt.config.type === "saying"
        ? this.interpolateContent(stmt.config.template)
        : "";
    const identifier =
      stmt.config.type === "called" ? stmt.config.identifier : "";

    switch (stmt.widget) {
      case "heading":
        return `<h1>${content}</h1>`;
      case "text":
        return `<p>${content}</p>`;
      case "button":
        return `<button onClick={handleClick}>${content}</button>`;
      case "input":
        return `<input value={${identifier}} onChange={(e) => set${this.capitalize(identifier)}(e.target.value)} />`;
      default:
        return `<div>${content}</div>`;
    }
  }

  private generateConditional(block: IfBlock): string {
    const condition = this.generateCondition(block);
    const body = block.body
      .filter((stmt): stmt is ShowStmt => stmt.type === "SHOW_STMT")
      .map((stmt) => this.generateShowStmt(stmt))
      .join("\n        ");

    return `{${condition} && (
        <>
${body ? "          " + body : ""}
        </>
      )}`;
  }

  private generateLoop(block: ForEachBlock): string {
    const body = block.body
      .filter((stmt): stmt is ShowStmt => stmt.type === "SHOW_STMT")
      .map((stmt) => this.generateShowStmt(stmt))
      .join("\n          ");

    return `{${block.listName}.map((${block.itemName}, index) => (
        <div key={index}>
          ${body}
        </div>
      ))}`;
  }

  private generateCondition(block: IfBlock): string {
    const { identifier, comparator, value } = block.condition;
    const rightSide = this.formatValue(value);

    const operatorMap: Record<string, string> = {
      equal: "===",
      notEqual: "!==",
      greater: ">",
      less: "<",
      greaterOrEqual: ">=",
      lessOrEqual: "<=",
    };

    return `${identifier} ${operatorMap[comparator]} ${rightSide}`;
  }

  private interpolateContent(content: string): string {
    return content.replace(/\{(\w+)\}/g, (_, varName) => `{${varName}}`);
  }

  private formatValue(value: unknown): string {
    if (typeof value === "object" && value !== null) {
      const v = value as { type: string; value?: unknown; name?: string };

      if (v.type === "text") return `"${v.value}"`;
      if (v.type === "number") return String(v.value);
      if (v.type === "boolean") return String(v.value);
      if (v.type === "identifier") return v.name || "";
    }

    return String(value);
  }

  private formatInitialValue(decl: StateDecl): string {
    const value = decl.initialValue;

    if (value.type === "empty") return "[]";
    if (value.type === "text") return `"${value.value}"`;
    if (value.type === "boolean") return String(value.value);
    if (value.type === "number") return String(value.value);

    return "null";
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private extractHookUsage(ast: Program): HookUsage[] {
    const stateDecls = ast.statements.filter(
      (stmt): stmt is StateDecl => stmt.type === "STATE_DECL",
    );

    return stateDecls.map((decl, index) => ({
      hook: "useState",
      line: index + 2, // After imports
      purpose: `Manages ${decl.identifier} state`,
      lingoEquivalent: `There is a ${decl.varType} called ${decl.identifier}`,
    }));
  }

  private generateExplanation(ast: Program): string {
    const stateCount = ast.statements.filter(
      (s) => s.type === "STATE_DECL",
    ).length;
    const showCount = ast.statements.filter(
      (s) => s.type === "SHOW_STMT",
    ).length;
    const eventCount = ast.statements.filter(
      (s) => s.type === "EVENT_BLOCK",
    ).length;

    return `This React component uses ${stateCount} state variable(s), renders ${showCount} UI element(s), and handles ${eventCount} event(s).`;
  }
}
