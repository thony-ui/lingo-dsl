/**
 * Render Tree Builder Implementation
 * Single Responsibility: Build and update virtual render trees from AST
 */

import type {
  Program,
  ShowStmt,
  IfBlock,
  ForEachBlock,
} from "@lingo-dsl/compiler";
import type {
  RenderTree,
  RenderNode,
  RenderNodeType,
  StateDiff,
} from "../types";
import type { IRenderTreeBuilder } from "../interfaces";

export class RenderTreeBuilder implements IRenderTreeBuilder {
  private nodeIdCounter = 0;

  build(ast: Program): RenderTree {
    const root = this.createRootNode();
    const nodeMap = new Map<string, RenderNode>();
    const stateBindingIndex = new Map<string, Set<string>>();

    nodeMap.set(root.id, root);

    // Extract show statements and build tree
    const showStatements = this.extractShowStatements(ast);
    const conditionalBlocks = this.extractConditionalBlocks(ast);
    const loopBlocks = this.extractLoopBlocks(ast);

    // Build children in order
    for (const stmt of showStatements) {
      const node = this.buildNodeFromShowStmt(stmt);
      root.children.push(node);
      this.registerNode(node, nodeMap, stateBindingIndex);
    }

    for (const block of conditionalBlocks) {
      const node = this.buildNodeFromConditional(block);
      root.children.push(node);
      this.registerNode(node, nodeMap, stateBindingIndex);
    }

    for (const block of loopBlocks) {
      const node = this.buildNodeFromLoop(block);
      root.children.push(node);
      this.registerNode(node, nodeMap, stateBindingIndex);
    }

    return { root, nodeMap, stateBindingIndex };
  }

  update(tree: RenderTree, changes: StateDiff): RenderTree {
    const affectedNodeIds = new Set<string>();

    // Find all nodes affected by state changes
    for (const change of changes.changes) {
      const boundNodes =
        tree.stateBindingIndex.get(change.variable) || new Set();
      boundNodes.forEach((nodeId) => affectedNodeIds.add(nodeId));
    }

    // Update metadata for affected nodes
    affectedNodeIds.forEach((nodeId) => {
      const node = tree.nodeMap.get(nodeId);
      if (node) {
        node.metadata.renderCount++;
        node.metadata.lastRenderTimestamp = Date.now();
      }
    });

    return tree;
  }

  getAffectedNodes(tree: RenderTree, stateVariables: string[]): Set<string> {
    const affected = new Set<string>();

    for (const variable of stateVariables) {
      const boundNodes = tree.stateBindingIndex.get(variable) || new Set();
      boundNodes.forEach((nodeId) => affected.add(nodeId));
    }

    return affected;
  }

  // ==================== Private Helper Methods ====================

  private createRootNode(): RenderNode {
    return {
      id: this.generateNodeId(),
      type: "root",
      children: [],
      props: {},
      metadata: {
        stateBindings: [],
        depth: 0,
        isConditional: false,
        renderCount: 1,
        lastRenderTimestamp: Date.now(),
      },
    };
  }

  private buildNodeFromShowStmt(stmt: ShowStmt): RenderNode {
    const type = this.mapWidgetToNodeType(stmt.widget);
    const content = stmt.config.type === "saying" ? stmt.config.template : "";
    const stateBindings = this.extractStateBindings(content);

    return {
      id: this.generateNodeId(),
      type,
      children: [],
      props: {
        content,
        widget: stmt.widget,
        config: stmt.config,
      },
      metadata: {
        sourceStatement: stmt,
        stateBindings,
        depth: 1,
        isConditional: false,
        renderCount: 1,
        lastRenderTimestamp: Date.now(),
      },
    };
  }

  private buildNodeFromConditional(block: IfBlock): RenderNode {
    const stateBindings = [block.condition.identifier];
    const children: RenderNode[] = [];

    // Build children from show statements inside conditional
    for (const stmt of block.body) {
      if (stmt.type === "SHOW_STMT") {
        const childNode = this.buildNodeFromShowStmt(stmt as ShowStmt);
        childNode.metadata.depth = 2;
        childNode.metadata.isConditional = true;
        children.push(childNode);
      }
    }

    return {
      id: this.generateNodeId(),
      type: "conditional",
      children,
      props: {
        condition: block.condition,
      },
      metadata: {
        sourceStatement: block,
        stateBindings,
        depth: 1,
        isConditional: true,
        renderCount: 1,
        lastRenderTimestamp: Date.now(),
      },
    };
  }

  private buildNodeFromLoop(block: ForEachBlock): RenderNode {
    const stateBindings = [block.listName];
    const children: RenderNode[] = [];

    // Build template node for loop items
    for (const stmt of block.body) {
      if (stmt.type === "SHOW_STMT") {
        const childNode = this.buildNodeFromShowStmt(stmt as ShowStmt);
        childNode.metadata.depth = 2;
        children.push(childNode);
      }
    }

    return {
      id: this.generateNodeId(),
      type: "loop",
      children,
      props: {
        listName: block.listName,
        itemName: block.itemName,
      },
      metadata: {
        sourceStatement: block,
        stateBindings,
        depth: 1,
        isConditional: false,
        renderCount: 1,
        lastRenderTimestamp: Date.now(),
      },
    };
  }

  private registerNode(
    node: RenderNode,
    nodeMap: Map<string, RenderNode>,
    stateBindingIndex: Map<string, Set<string>>,
  ): void {
    nodeMap.set(node.id, node);

    // Register state bindings
    for (const stateVar of node.metadata.stateBindings) {
      if (!stateBindingIndex.has(stateVar)) {
        stateBindingIndex.set(stateVar, new Set());
      }
      stateBindingIndex.get(stateVar)!.add(node.id);
    }

    // Register children recursively
    for (const child of node.children) {
      this.registerNode(child, nodeMap, stateBindingIndex);
    }
  }

  private extractShowStatements(ast: Program): ShowStmt[] {
    return ast.statements.filter(
      (stmt): stmt is ShowStmt => stmt.type === "SHOW_STMT",
    );
  }

  private extractConditionalBlocks(ast: Program): IfBlock[] {
    return ast.statements.filter(
      (stmt): stmt is IfBlock => stmt.type === "IF_BLOCK",
    );
  }

  private extractLoopBlocks(ast: Program): ForEachBlock[] {
    return ast.statements.filter(
      (stmt): stmt is ForEachBlock => stmt.type === "FOR_EACH_BLOCK",
    );
  }

  private mapWidgetToNodeType(widget: string): RenderNodeType {
    switch (widget) {
      case "heading":
        return "heading";
      case "text":
        return "text";
      case "button":
        return "button";
      case "input":
        return "input";
      default:
        return "text";
    }
  }

  private extractStateBindings(message: string): string[] {
    const bindings: string[] = [];
    const regex = /\{(\w+)\}/g;
    let match;

    while ((match = regex.exec(message)) !== null) {
      bindings.push(match[1]);
    }

    return bindings;
  }

  private generateNodeId(): string {
    return `node_${++this.nodeIdCounter}`;
  }
}
