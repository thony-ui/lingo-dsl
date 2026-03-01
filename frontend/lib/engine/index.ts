/**
 * Frontend Systems Engine - Main Entry Point
 * Following Facade Pattern: Provides unified interface to complex subsystems
 */

import type {
  IFrontendSystemsEngine,
  IExecutionController,
  IRenderTreeBuilder,
  IStateManager,
  IReactGenerator,
  IVisualizationAdapter,
  IInternalsInspector,
} from "./interfaces";

import { ExecutionController } from "./controllers/ExecutionController";
import { RenderTreeBuilder } from "./builders/RenderTreeBuilder";
import { StateManager } from "./managers/StateManager";
import { ReactGenerator } from "./generators/ReactGenerator";
import { VisualizationAdapter } from "./adapters/VisualizationAdapter";
import { InternalsInspector } from "./inspectors/InternalsInspector";

/**
 * Main engine class that coordinates all subsystems
 * Provides a clean, unified API for the educational platform
 */
export class FrontendSystemsEngine implements IFrontendSystemsEngine {
  readonly execution: IExecutionController;
  readonly treeBuilder: IRenderTreeBuilder;
  readonly stateManager: IStateManager;
  readonly reactGenerator: IReactGenerator;
  readonly visualizer: IVisualizationAdapter;
  readonly inspector: IInternalsInspector;

  constructor() {
    // Initialize subsystems - Dependency Injection pattern
    this.execution = new ExecutionController();
    this.treeBuilder = new RenderTreeBuilder();
    this.stateManager = new StateManager();
    this.reactGenerator = new ReactGenerator();
    this.visualizer = new VisualizationAdapter();
    this.inspector = new InternalsInspector(this.stateManager as StateManager);
  }

  async initialize(code: string): Promise<void> {
    // Set source code and reset execution state
    (this.execution as ExecutionController).setSourceCode(code);

    // Run through all phases automatically
    await this.execution.runToPhase("COMPLETE");
  }

  dispose(): void {
    // Clean up resources
    this.execution.reset();
    this.inspector.clearLogs();
  }
}

// Export default instance (singleton for convenience)
export const createEngine = (): FrontendSystemsEngine => {
  return new FrontendSystemsEngine();
};

// Export all types and interfaces
export * from "./types";
export * from "./interfaces";
export type {
  TreeNodeData,
  GraphNodeData,
  DiffViewData,
  TimelineEvent,
} from "./adapters/VisualizationAdapter";
