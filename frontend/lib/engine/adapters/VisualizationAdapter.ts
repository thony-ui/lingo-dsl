/**
 * Visualization Adapter
 * Single Responsibility: Transform engine data into visualization-ready formats
 */

import type { RenderTree, RenderNode, StateDiff, StateChange } from "../types";
import type { IVisualizationAdapter } from "../interfaces";

// Visualization-specific types
export interface TreeNodeData {
  id: string;
  name: string;
  type: string;
  children: TreeNodeData[];
  metadata: {
    renderCount: number;
    stateBindings: string[];
    isConditional: boolean;
  };
}

export interface GraphNodeData {
  id: string;
  label: string;
  type: string;
  x?: number;
  y?: number;
}

export interface GraphEdgeData {
  source: string;
  target: string;
  label?: string;
}

export interface TimelineEvent {
  timestamp: number;
  type: string;
  description: string;
  data: unknown;
}

export interface DiffViewData {
  timestamp: number;
  changes: Array<{
    variable: string;
    before: string;
    after: string;
    affectedNodes: Array<{
      id: string;
      type: string;
    }>;
  }>;
}

export class VisualizationAdapter implements IVisualizationAdapter {
  toTreeData(tree: RenderTree): TreeNodeData {
    return this.convertNodeToTreeData(tree.root);
  }

  toGraphData(tree: RenderTree): {
    nodes: GraphNodeData[];
    edges: GraphEdgeData[];
  } {
    const nodes: GraphNodeData[] = [];
    const edges: GraphEdgeData[] = [];

    this.buildGraph(tree.root, nodes, edges);

    return { nodes, edges };
  }

  toTimelineData(history: StateChange[]): TimelineEvent[] {
    return history.map((change) => ({
      timestamp: change.timestamp,
      type: this.getChangeType(change.trigger),
      description: this.describeChange(change),
      data: {
        before: change.previousValue,
        after: change.newValue,
        trigger: change.trigger,
      },
    }));
  }

  toDiffData(diff: StateDiff): DiffViewData {
    return {
      timestamp: diff.timestamp,
      changes: diff.changes.map((change) => ({
        variable: change.variable,
        before: this.formatValue(change.before),
        after: this.formatValue(change.after),
        affectedNodes: change.affectedNodes.map((id) => ({
          id,
          type: "unknown", // Would be populated from node map
        })),
      })),
    };
  }

  // ==================== Private Helper Methods ====================

  private convertNodeToTreeData(node: RenderNode): TreeNodeData {
    return {
      id: node.id,
      name: this.getNodeDisplayName(node),
      type: node.type,
      children: node.children.map((child) => this.convertNodeToTreeData(child)),
      metadata: {
        renderCount: node.metadata.renderCount,
        stateBindings: node.metadata.stateBindings,
        isConditional: node.metadata.isConditional,
      },
    };
  }

  private buildGraph(
    node: RenderNode,
    nodes: GraphNodeData[],
    edges: GraphEdgeData[],
    depth: number = 0,
  ): void {
    nodes.push({
      id: node.id,
      label: this.getNodeDisplayName(node),
      type: node.type,
      y: depth * 100,
    });

    node.children.forEach((child, index) => {
      edges.push({
        source: node.id,
        target: child.id,
        label: `child ${index}`,
      });

      this.buildGraph(child, nodes, edges, depth + 1);
    });
  }

  private getNodeDisplayName(node: RenderNode): string {
    if (node.type === "root") return "App Root";
    if (node.type === "conditional") return "Conditional";
    if (node.type === "loop") return `Loop: ${node.props.listName}`;

    const content = (node.props.content as string) || "";
    const truncated =
      content.length > 30 ? content.substring(0, 30) + "..." : content;

    return `${node.type}: ${truncated}`;
  }

  private formatValue(value: unknown): string {
    if (value === null || value === undefined) return "null";
    if (typeof value === "string") return `"${value}"`;
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  }

  private getChangeType(trigger: unknown): string {
    if (typeof trigger === "object" && trigger !== null) {
      const t = trigger as { type: string };
      return t.type;
    }
    return "unknown";
  }

  private describeChange(change: StateChange): string {
    const trigger = change.trigger;

    if (typeof trigger === "object" && trigger !== null) {
      const t = trigger as {
        type: string;
        eventType?: string;
        actionType?: string;
      };

      if (t.type === "initialization") {
        return `Initialized to ${this.formatValue(change.newValue)}`;
      }

      if (t.type === "event") {
        return `Changed by ${t.eventType} event`;
      }

      if (t.type === "action") {
        return `Updated by ${t.actionType} action`;
      }
    }

    return `Changed from ${this.formatValue(change.previousValue)} to ${this.formatValue(change.newValue)}`;
  }
}
