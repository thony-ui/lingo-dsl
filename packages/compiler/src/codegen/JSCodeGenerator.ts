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

    return `const ${stmt.identifier} = createSignal(${initialValue}, '${stmt.identifier}');`;
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
    let code = `${prefix}const ${id} = document.createElement('h1');\n`;

    if (config.type === "saying") {
      const template = this.generateTemplate(config.template);
      code += `${prefix}createEffect(() => { ${id}.textContent = ${template}; });\n`;
    }

    // Apply styles
    if (stmt.styles) {
      const styleCode = this.generateStyles(stmt.styles, id);
      code += styleCode.replace(/\n  /g, `\n${prefix}`);
    }

    code += `${prefix}root.appendChild(${id});`;
    return code;
  }

  private generateText(stmt: ShowStmt, id: string, prefix: string): string {
    const config = stmt.config;
    let code = `${prefix}const ${id} = document.createElement('p');\n`;

    if (config.type === "saying") {
      const template = this.generateTemplate(config.template);
      code += `${prefix}createEffect(() => { ${id}.textContent = ${template}; });\n`;
    }

    // Apply styles
    if (stmt.styles) {
      const styleCode = this.generateStyles(stmt.styles, id);
      code += styleCode.replace(/\n  /g, `\n${prefix}`);
    }

    code += `${prefix}root.appendChild(${id});`;
    return code;
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

    // Apply styles
    if (stmt.styles) {
      const styleCode = this.generateStyles(stmt.styles, id);
      code += styleCode.replace(/\n  /g, `\n${prefix}`);
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

    // Apply flex layout
    code += `${prefix}${id}.style.display = 'flex';\n`;
    code += `${prefix}${id}.style.flexDirection = '${type === "row" ? "row" : "column"}';\n`;

    // Apply styles
    if (stmt.styles) {
      const styleCode = this.generateStyles(stmt.styles, id);
      code += styleCode.replace(/\n  /g, `\n${prefix}`);
    }

    code += `${prefix}root.appendChild(${id});\n`;

    // Render children if present
    if (stmt.children && stmt.children.length > 0) {
      for (const child of stmt.children) {
        const childCode = this.generateShowStmt(child, prefix);
        // Replace 'root' with container id in child code
        const childCodeWithParent = childCode.replace(
          /root\.appendChild\(/g,
          `${id}.appendChild(`,
        );
        code += childCodeWithParent + "\n";
      }
    }

    return code.trimEnd();
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
      code += `${prefix}createEffect(() => { ${id}.textContent = ${template}; });\n`;
    } else if (config.type === "called") {
      const identifier = config.identifier;
      code += `${prefix}${id}.setAttribute('data-identifier', '${identifier}');\n`;
      code += `${prefix}createEffect(() => { ${id}.textContent = ${identifier}.get(); });\n`;
    }

    // Apply styles
    if (stmt.styles) {
      const styleCode = this.generateStyles(stmt.styles, id);
      code += styleCode.replace(/\n  /g, `\n${prefix}`);
    }

    code += `${prefix}root.appendChild(${id});`;

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

    // Handle "On page load," events - execute immediately
    if (stmt.verb === "load") {
      let code = "// Execute on page load\n";
      for (const action of stmt.actions) {
        const actionCode = this.generateAction(action.action);
        code += `${this.indentLine(actionCode)}\n`;
      }
      return code.trimEnd();
    }

    // Handle normal click/type events
    const eventType = stmt.verb === "click" ? "click" : "input";
    const handlerVar = `handler_${this.eventCounter++}`;

    let code = "";

    if (widget.type === "literal") {
      // Use event delegation for literal widgets (e.g., buttons with text)
      code += `root.addEventListener('${eventType}', (e) => {\n`;
      this.indent++;
      code += `${this.indentLine(`if (e.target.tagName === '${widget.widget.toUpperCase()}' && e.target.textContent === "${widget.label}") {`)}`;
      this.indent++;

      for (const action of stmt.actions) {
        const actionCode = this.generateAction(action.action);
        code += `\n${this.indentLine(actionCode)}`;
      }

      this.indent--;
      code += `\n${this.indentLine("}")}`;
      this.indent--;
      code += `\n${this.indentLine("});")}`;
    } else {
      // Use event delegation for identifier-based widgets
      code += `root.addEventListener('${eventType}', (e) => {\n`;
      this.indent++;
      code += `${this.indentLine(`if (e.target.dataset.identifier === "${widget.identifier}") {`)}`;
      this.indent++;

      for (const action of stmt.actions) {
        const actionCode = this.generateAction(action.action);
        code += `\n${this.indentLine(actionCode)}`;
      }

      this.indent--;
      code += `\n${this.indentLine("}")}`;
      this.indent--;
      code += `\n${this.indentLine("});")}`;
    }

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
            .map((val) => {
              // Check if parameter is a variable reference like "{variableName}"
              const varMatch = val.match(/^\{([a-zA-Z_][a-zA-Z0-9_]*)\}$/);
              if (varMatch) {
                // Pass the signal object itself (not .get()) so functions can call .set() or .get() as needed
                return `${varMatch[1]}`;
              }
              // Otherwise pass as a literal string
              return `"${val.replace(/"/g, '\\"')}"`;
            })
            .join(", ");
          return `customFunctions.${action.name}(${action.identifier}, ${paramValues});`;
        } else {
          return `customFunctions.${action.name}(${action.identifier});`;
        }
    }
  }

  private generateIfBlock(stmt: IfBlock): string {
    const condition = this.generateCondition(stmt);
    const containerId = `if_container_${this.widgetCounter++}`;

    let code = `const ${containerId} = document.createElement('div');\n`;
    code += `${this.indentLine(`root.appendChild(${containerId});`)}`;
    code += `\n${this.indentLine(`createEffect(() => {`)}`;

    this.indent++;
    code += `\n${this.indentLine(`if (${condition}) {`)}`;

    this.indent++;
    code += `\n${this.indentLine(`${containerId}.innerHTML = '';`)}`;

    // Generate code for each show statement in the body
    for (const showStmt of stmt.body) {
      const itemCode = this.generateShowStmtForLoop(showStmt, "", containerId);
      code += `\n${this.indentLine(itemCode)}`;
    }

    this.indent--;
    code += `\n${this.indentLine(`} else {`)}`;

    this.indent++;
    code += `\n${this.indentLine(`${containerId}.innerHTML = '';`)}`;

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

    // Handle custom widgets
    if (stmt.isCustom && stmt.config.type === "custom") {
      const params = Object.values(stmt.config.params)
        .map((val) => `"${val.replace(/"/g, '\\"')}"`)
        .join(", ");
      code += `customFunctions.${stmt.widget}(${containerId}, ${params});`;
      return code;
    }

    const elementType = this.getElementType(stmt.widget);
    code += `const ${widgetId} = document.createElement('${elementType}');`;

    // Handle row and column containers
    if (stmt.widget === "row" || stmt.widget === "column") {
      code += ` ${widgetId}.className = '${stmt.widget}';`;
      code += ` ${widgetId}.style.display = 'flex';`;
      code += ` ${widgetId}.style.flexDirection = '${stmt.widget === "row" ? "row" : "column"}';`;

      // Apply styles (including gap)
      if (stmt.styles) {
        const styleLines = this.generateStyles(stmt.styles, widgetId);
        // Remove leading whitespace and add to code
        code += ` ${styleLines.trim().replace(/\n/g, " ")}`;
      }

      code += ` ${containerId}.appendChild(${widgetId});`;

      // Render children if present
      if (stmt.children && stmt.children.length > 0) {
        for (const child of stmt.children) {
          const childCode = this.generateShowStmtForLoop(
            child,
            itemName,
            widgetId,
          );
          code += ` ${childCode}`;
        }
      }

      return code;
    }

    if (stmt.config.type === "saying") {
      const template = this.generateTemplateForLoop(
        stmt.config.template,
        itemName,
      );
      // Make text content reactive with createEffect
      code += ` createEffect(() => { ${widgetId}.textContent = ${template}; });`;
    } else if (stmt.config.type === "called") {
      // Handle input binding
      const identifier = stmt.config.identifier;
      code += ` ${widgetId}.value = ${identifier}.get();`;
      code += ` ${widgetId}.addEventListener('input', (e) => ${identifier}.set(e.target.value));`;
      code += ` createEffect(() => { ${widgetId}.value = ${identifier}.get(); });`;
    } else if (stmt.config.type === "image") {
      code += ` ${widgetId}.src = "${stmt.config.source}";`;
    }

    // Apply styles for non-container elements
    if (stmt.styles && stmt.widget !== "row" && stmt.widget !== "column") {
      const styleLines = this.generateStyles(stmt.styles, widgetId);
      code += ` ${styleLines.trim().replace(/\n/g, " ")}`;
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

  private generateStyles(
    styles: import("../parser/AST").StyleProperties | undefined,
    widget: string,
  ): string {
    if (!styles) return "";

    const styleLines: string[] = [];

    if (styles.color) {
      styleLines.push(`  ${widget}.style.color = '${styles.color}';`);
    }

    if (styles.backgroundColor) {
      styleLines.push(
        `  ${widget}.style.backgroundColor = '${styles.backgroundColor}';`,
      );
    }

    if (styles.textAlign) {
      styleLines.push(`  ${widget}.style.textAlign = '${styles.textAlign}';`);
    }

    if (styles.gap) {
      styleLines.push(`  ${widget}.style.gap = '${styles.gap}';`);
    }

    // Add flex layout styles for row/column
    if (widget.includes("row") || widget.includes("column")) {
      styleLines.push(`  ${widget}.style.display = 'flex';`);
      const flexDirection = widget.includes("row") ? "row" : "column";
      styleLines.push(`  ${widget}.style.flexDirection = '${flexDirection}';`);
    }

    return styleLines.length > 0 ? "\n" + styleLines.join("\n") : "";
  }
}
