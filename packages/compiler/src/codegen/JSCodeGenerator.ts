import {
  Program,
  Statement,
  ASTNodeType,
  StateDecl,
  ShowStmt,
  EventBlock,
  IfBlock,
  ForEachBlock,
  Value,
  Action,
  ShowConfig,
} from "../parser/AST";
import {
  ICodeGenerator,
  CodegenResult,
  CodegenOptions,
} from "./ICodeGenerator";

export class JSCodeGenerator implements ICodeGenerator {
  private indent: number = 0;
  private widgetCounter: number = 0;
  private eventCounter: number = 0;
  private customFunctionsPath: string | undefined;

  generate(ast: Program, options?: CodegenOptions): CodegenResult {
    this.indent = 0;
    this.widgetCounter = 0;
    this.eventCounter = 0;
    this.customFunctionsPath = options?.customFunctionsPath;

    const lines: string[] = [];

    // Import runtime
    lines.push(
      "import { createSignal, createEffect, renderApp } from '@lingo-dsl/runtime';",
    );

    // Import custom functions if provided
    if (this.customFunctionsPath) {
      lines.push(
        `import * as customFunctions from '${this.customFunctionsPath}';`,
      );
    }

    lines.push("");

    // Generate main app function
    lines.push("export function createApp() {");
    this.indent++;

    // Generate state declarations
    const stateVars: string[] = [];
    for (const stmt of ast.statements) {
      if (stmt.type === ASTNodeType.STATE_DECL) {
        const code = this.generateStateDecl(stmt);
        lines.push(this.indentLine(code));
        stateVars.push(stmt.identifier);
      }
    }

    if (stateVars.length > 0) {
      lines.push("");
    }

    // Generate render function
    lines.push(this.indentLine("return renderApp((root) => {"));
    this.indent++;

    // Generate UI elements
    for (const stmt of ast.statements) {
      if (stmt.type === ASTNodeType.SHOW_STMT) {
        const code = this.generateShowStmt(stmt);
        lines.push(this.indentLine(code));
      } else if (stmt.type === ASTNodeType.IF_BLOCK) {
        const code = this.generateIfBlock(stmt);
        lines.push(this.indentLine(code));
      } else if (stmt.type === ASTNodeType.FOR_EACH_BLOCK) {
        const code = this.generateForEachBlock(stmt);
        lines.push(this.indentLine(code));
      }
    }

    // Generate event handlers
    for (const stmt of ast.statements) {
      if (stmt.type === ASTNodeType.EVENT_BLOCK) {
        const code = this.generateEventBlock(stmt);
        lines.push("");
        lines.push(this.indentLine(code));
      }
    }

    this.indent--;
    lines.push(this.indentLine("});"));

    this.indent--;
    lines.push("}");

    return {
      code: lines.join("\n"),
      dependencies: ["@lingo-dsl/runtime"],
    };
  }

  private generateStateDecl(stmt: StateDecl): string {
    let initialValue: string;

    if (stmt.initialValue.type === "empty") {
      // Empty value depends on the state type
      if (stmt.varType === "list") {
        initialValue = "[]";
      } else if (stmt.varType === "text") {
        initialValue = '""';
      } else if (stmt.varType === "number") {
        initialValue = "0";
      } else if (stmt.varType === "boolean") {
        initialValue = "false";
      } else {
        initialValue = '""';
      }
    } else {
      initialValue = this.generateValue(stmt.initialValue);
    }

    return `const ${stmt.identifier} = createSignal(${initialValue});`;
  }

  private generateShowStmt(stmt: ShowStmt, prefix: string = ""): string {
    const widgetId = `widget_${this.widgetCounter++}`;
    let code = "";

    // Handle custom widgets
    if (stmt.isCustom && stmt.config.type === "custom") {
      return this.generateCustomWidget(stmt, widgetId, prefix);
    }

    switch (stmt.widget) {
      case "heading":
        code = this.generateHeading(stmt, widgetId, prefix);
        break;
      case "text":
        code = this.generateText(stmt, widgetId, prefix);
        break;
      case "button":
        code = this.generateButton(stmt, widgetId, prefix);
        break;
      case "input":
        code = this.generateInput(stmt, widgetId, prefix);
        break;
      case "image":
        code = this.generateImage(stmt, widgetId, prefix);
        break;
      case "row":
        code = this.generateContainer(stmt, widgetId, "row", prefix);
        break;
      case "column":
        code = this.generateContainer(stmt, widgetId, "column", prefix);
        break;
      default:
        // Handle all other HTML elements (p, i, b, strong, em, etc.)
        code = this.generateGenericElement(stmt, widgetId, prefix);
        break;
    }

    return code;
  }

  private generateCustomWidget(
    stmt: ShowStmt,
    id: string,
    prefix: string,
  ): string {
    if (stmt.config.type !== "custom") {
      return "";
    }

    const widgetName = stmt.widget;
    const params = stmt.config.params;

    // Generate function call: customFunctions.card(root, "Hello", "World")
    const paramValues = Object.values(params)
      .map((val) => `"${val.replace(/"/g, '\\"')}"`)
      .join(", ");

    let code = `${prefix}const ${id} = customFunctions.${widgetName}(root`;
    if (paramValues) {
      code += `, ${paramValues}`;
    }
    code += `);`;

    return code;
  }

  private generateHeading(stmt: ShowStmt, id: string, prefix: string): string {
    const config = stmt.config;
    if (config.type === "saying") {
      const template = this.generateTemplate(config.template);
      return (
        `${prefix}const ${id} = document.createElement('h1');\n` +
        `${prefix}createEffect(() => { ${id}.textContent = ${template}; });\n` +
        `${prefix}root.appendChild(${id});`
      );
    }
    return `${prefix}const ${id} = document.createElement('h1');\n${prefix}root.appendChild(${id});`;
  }

  private generateText(stmt: ShowStmt, id: string, prefix: string): string {
    const config = stmt.config;
    if (config.type === "saying") {
      const template = this.generateTemplate(config.template);
      return (
        `${prefix}const ${id} = document.createElement('p');\n` +
        `${prefix}createEffect(() => { ${id}.textContent = ${template}; });\n` +
        `${prefix}root.appendChild(${id});`
      );
    }
    return `${prefix}const ${id} = document.createElement('p');\n${prefix}root.appendChild(${id});`;
  }

  private generateButton(stmt: ShowStmt, id: string, prefix: string): string {
    const config = stmt.config;
    let label = "";
    let identifier = "";

    if (config.type === "saying") {
      label = config.template;
    } else if (config.type === "called") {
      identifier = config.identifier;
    }

    let code = `${prefix}const ${id} = document.createElement('button');\n`;

    if (label) {
      const template = this.generateTemplate(label);
      code += `${prefix}createEffect(() => { ${id}.textContent = ${template}; });\n`;
    }

    if (identifier) {
      code += `${prefix}${id}.dataset.identifier = '${identifier}';\n`;
    }

    code += `${prefix}root.appendChild(${id});`;

    return code;
  }

  private generateInput(stmt: ShowStmt, id: string, prefix: string): string {
    const config = stmt.config;
    let code = `${prefix}const ${id} = document.createElement('input');\n`;

    if (config.type === "called") {
      const identifier = config.identifier;
      code += `${prefix}${id}.dataset.identifier = '${identifier}';\n`;
      code += `${prefix}createEffect(() => { ${id}.value = ${identifier}.get(); });\n`;
      code += `${prefix}${id}.addEventListener('input', (e) => { ${identifier}.set(e.target.value); });\n`;
    }

    code += `${prefix}root.appendChild(${id});`;
    return code;
  }

  private generateImage(stmt: ShowStmt, id: string, prefix: string): string {
    const config = stmt.config;
    let code = `${prefix}const ${id} = document.createElement('img');\n`;

    if (config.type === "image") {
      code += `${prefix}${id}.src = "${config.source}";\n`;
    }

    code += `${prefix}root.appendChild(${id});`;
    return code;
  }

  private generateContainer(
    stmt: ShowStmt,
    id: string,
    type: "row" | "column",
    prefix: string,
  ): string {
    let code = `${prefix}const ${id} = document.createElement('div');\n`;
    code += `${prefix}${id}.className = '${type}';\n`;
    code += `${prefix}root.appendChild(${id});`;
    return code;
  }

  private generateGenericElement(
    stmt: ShowStmt,
    id: string,
    prefix: string,
  ): string {
    const config = stmt.config;
    const tagName = stmt.widget; // Use the widget type as the HTML tag name

    let code = `${prefix}const ${id} = document.createElement('${tagName}');\n`;

    // Add href attribute for anchor tags to get proper link styling
    if (tagName === "a") {
      code += `${prefix}${id}.href = '#';\n`;
    }

    if (config.type === "saying") {
      const template = this.generateTemplate(config.template);
      code +=
        `${prefix}createEffect(() => { ${id}.textContent = ${template}; });\n` +
        `${prefix}root.appendChild(${id});`;
    } else if (config.type === "called") {
      const identifier = config.identifier;
      code += `${prefix}${id}.setAttribute('data-identifier', '${identifier}');\n`;
      code += `${prefix}createEffect(() => { ${id}.textContent = ${identifier}.get(); });\n`;
      code += `${prefix}root.appendChild(${id});`;
    } else {
      code += `${prefix}root.appendChild(${id});`;
    }

    return code;
  }

  private getElementType(widget: string): string {
    switch (widget) {
      case "heading":
        return "h1";
      case "text":
        return "p";
      case "button":
        return "button";
      case "input":
        return "input";
      case "image":
        return "img";
      case "row":
      case "column":
        return "div";
      default:
        return "div";
    }
  }

  private generateEventBlock(stmt: EventBlock): string {
    const widget = stmt.widgetRef;
    let selector = "";

    if (widget.type === "literal") {
      // Find button by text content
      selector = `Array.from(root.querySelectorAll('${widget.widget}')).find(el => el.textContent === "${widget.label}")`;
    } else {
      // Find by data-identifier
      selector = `root.querySelector('[data-identifier="${widget.identifier}"]')`;
    }

    const eventType = stmt.verb === "click" ? "click" : "input";
    const targetVar = `target_${this.eventCounter++}`;

    let code = `const ${targetVar} = ${selector};\n`;
    code += `${this.indentLine(`if (${targetVar}) {`)}`;

    this.indent++;
    code += `\n${this.indentLine(`${targetVar}.addEventListener('${eventType}', () => {`)}`;

    this.indent++;
    for (const action of stmt.actions) {
      const actionCode = this.generateAction(action.action);
      code += `\n${this.indentLine(actionCode)}`;
    }

    this.indent--;
    code += `\n${this.indentLine("});")}`;

    this.indent--;
    code += `\n${this.indentLine("}")}`;

    return code;
  }

  private generateAction(action: Action): string {
    switch (action.type) {
      case "increase":
        return `${action.identifier}.set(${action.identifier}.get() + ${action.amount});`;

      case "decrease":
        return `${action.identifier}.set(${action.identifier}.get() - ${action.amount});`;

      case "set":
        const value = this.generateValue(action.value);
        return `${action.identifier}.set(${value});`;

      case "add":
        const addValue = this.generateValue(action.value);
        return `${action.list}.set([...${action.list}.get(), ${addValue}]);`;

      case "remove":
        const removeValue = this.generateValue(action.value);
        return `${action.list}.set(${action.list}.get().filter(item => item !== ${removeValue}));`;

      case "toggle":
        return `${action.identifier}.set(!${action.identifier}.get());`;

      case "custom":
        // Generate call to custom function: customFunctions.actionName(signal, params...)
        if (action.params && Object.keys(action.params).length > 0) {
          const paramValues = Object.values(action.params)
            .map((val) => `"${val.replace(/"/g, '\\"')}"`)
            .join(", ");
          return `customFunctions.${action.name}(${action.identifier}, ${paramValues});`;
        } else {
          return `customFunctions.${action.name}(${action.identifier});`;
        }
    }
  }

  private generateIfBlock(stmt: IfBlock): string {
    const condition = this.generateCondition(stmt);
    let code = `createEffect(() => {\n`;

    this.indent++;
    code += `${this.indentLine(`if (${condition}) {`)}`;

    this.indent++;
    code += `\n${this.indentLine("// Conditional rendering placeholder")}`;
    // Note: Full conditional rendering would require more complex logic
    // For v0.1, we're simplifying

    this.indent--;
    code += `\n${this.indentLine("}")}`;

    this.indent--;
    code += `\n${this.indentLine("});")}`;

    return code;
  }

  private generateForEachBlock(stmt: ForEachBlock): string {
    const listName = stmt.listName;
    const itemName = stmt.itemName;
    const containerId = `list_container_${this.widgetCounter++}`;

    let code = `const ${containerId} = document.createElement('div');\n`;
    code += `${this.indentLine(`root.appendChild(${containerId});`)}`;
    code += `\n${this.indentLine(`createEffect(() => {`)}`;

    this.indent++;
    code += `\n${this.indentLine(`const items = ${listName}.get();`)}`;
    code += `\n${this.indentLine(`${containerId}.innerHTML = '';`)}`;
    code += `\n${this.indentLine(`items.forEach(${itemName} => {`)}`;

    this.indent++;

    // Generate code for each show statement in the body
    for (const showStmt of stmt.body) {
      const itemCode = this.generateShowStmtForLoop(
        showStmt,
        itemName,
        containerId,
      );
      code += `\n${this.indentLine(itemCode)}`;
    }

    this.indent--;
    code += `\n${this.indentLine("});")}`;

    this.indent--;
    code += `\n${this.indentLine("});")}`;

    return code;
  }

  private generateShowStmtForLoop(
    stmt: ShowStmt,
    itemName: string,
    containerId: string,
  ): string {
    const widgetId = `el_${this.widgetCounter++}`;
    let code = "";

    const elementType = this.getElementType(stmt.widget);
    code += `const ${widgetId} = document.createElement('${elementType}');`;

    if (stmt.config.type === "saying") {
      const template = this.generateTemplateForLoop(
        stmt.config.template,
        itemName,
      );
      code += ` ${widgetId}.textContent = ${template};`;
    }

    code += ` ${containerId}.appendChild(${widgetId});`;

    return code;
  }

  private generateTemplateForLoop(template: string, itemName: string): string {
    // Convert "• {item}" to `• ${item}` (direct variable, not a signal)
    const converted = template.replace(
      /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g,
      (_, identifier) => {
        if (identifier === itemName) {
          return `\${${identifier}}`;
        }
        return `\${${identifier}.get()}`;
      },
    );
    return `\`${converted}\``;
  }

  private generateCondition(stmt: IfBlock): string {
    const { identifier, comparator, value } = stmt.condition;
    const valueCode = this.generateValue(value);

    const ops: Record<string, string> = {
      equal: "===",
      notEqual: "!==",
      greater: ">",
      less: "<",
      greaterOrEqual: ">=",
      lessOrEqual: "<=",
    };

    return `${identifier}.get() ${ops[comparator]} ${valueCode}`;
  }

  private generateValue(value: Value): string {
    switch (value.type) {
      case "number":
        return String(value.value);
      case "text":
        return `"${value.value.replace(/"/g, '\\"')}"`;
      case "boolean":
        return String(value.value);
      case "empty":
        return '""';
      case "identifier":
        return `${value.name}.get()`;
    }
  }

  private generateTemplate(template: string): string {
    // Convert "Hello {name}" to `Hello ${name.get()}`
    const converted = template.replace(
      /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g,
      (_, identifier) => {
        return `\${${identifier}.get()}`;
      },
    );
    return `\`${converted}\``;
  }

  private indentLine(line: string): string {
    return "  ".repeat(this.indent) + line;
  }
}
