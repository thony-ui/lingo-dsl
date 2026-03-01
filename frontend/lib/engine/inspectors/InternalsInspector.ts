/**
 * Internals Inspector
 * Single Responsibility: Expose engine internals for educational purposes
 */

import type {
  EngineInternals,
  ComponentRegistration,
  RenderQueueItem,
  DiffStep,
  ReconciliationEntry,
} from "../types";
import type { IInternalsInspector } from "../interfaces";
import { StateManager } from "../managers/StateManager";

export class InternalsInspector implements IInternalsInspector {
  private componentRegistry = new Map<string, ComponentRegistration>();
  private renderQueue: RenderQueueItem[] = [];
  private diffLog: DiffStep[] = [];
  private reconciliationLog: ReconciliationEntry[] = [];
  private stateManager: StateManager;

  constructor(stateManager: StateManager) {
    this.stateManager = stateManager;
  }

  getInternals(): EngineInternals {
    return {
      stateMap: this.stateManager.snapshot(),
      componentRegistry: new Map(this.componentRegistry),
      renderQueue: [...this.renderQueue],
      diffAlgorithmSteps: [...this.diffLog],
      reconciliationLog: [...this.reconciliationLog],
    };
  }

  getRenderQueue(): RenderQueueItem[] {
    return [...this.renderQueue];
  }

  getDiffLog(): DiffStep[] {
    return [...this.diffLog];
  }

  getReconciliationLog(): ReconciliationEntry[] {
    return [...this.reconciliationLog];
  }

  // ==================== Internal Methods for Tracking ====================

  registerComponent(id: string, type: string): void {
    this.componentRegistry.set(id, {
      id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: type as any,
      registeredAt: Date.now(),
    });
  }

  enqueueRender(nodeId: string, reason: string, priority: number = 0): void {
    this.renderQueue.push({
      nodeId,
      priority,
      reason,
      enqueuedAt: Date.now(),
    });
  }

  logDiff(
    nodeId: string,
    operation: DiffStep["operation"],
    reason: string,
  ): void {
    this.diffLog.push({
      nodeId,
      operation,
      reason,
      timestamp: Date.now(),
    });
  }

  logReconciliation(
    phase: "diff" | "commit",
    nodesAffected: number,
    duration: number,
    details: string,
  ): void {
    this.reconciliationLog.push({
      timestamp: Date.now(),
      phase,
      nodesAffected,
      duration,
      details,
    });
  }

  clearQueue(): void {
    this.renderQueue = [];
  }

  clearLogs(): void {
    this.diffLog = [];
    this.reconciliationLog = [];
  }
}
