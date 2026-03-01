/**
 * Core interfaces for the execution engine
 * Following Dependency Inversion Principle - depend on abstractions
 */

import type {
  ExecutionState,
  ExecutionStep,
  RenderTree,
  RenderNode,
  StateMap,
  StateDiff,
  ReactEquivalent,
  EngineInternals,
} from "./types";

/**
 * Interface for execution control
 * Single Responsibility: Manage execution flow
 */
export interface IExecutionController {
  step(): Promise<ExecutionStep>;
  stepBack(): Promise<ExecutionStep>;
  runToPhase(phase: string): Promise<void>;
  reset(): void;
  getState(): ExecutionState;
}

/**
 * Interface for render tree building
 * Single Responsibility: Construct virtual render trees
 */
export interface IRenderTreeBuilder {
  build(ast: unknown): RenderTree;
  update(tree: RenderTree, changes: StateDiff): RenderTree;
  getAffectedNodes(tree: RenderTree, stateVariables: string[]): Set<string>;
}

/**
 * Interface for state management
 * Single Responsibility: Track and manage state changes
 */
export interface IStateManager {
  initialize(declarations: unknown[]): StateMap;
  updateState(variable: string, value: unknown, trigger: unknown): StateDiff;
  getHistory(variable?: string): unknown[];
  getDiff(from: number, to: number): StateDiff;
  snapshot(): StateMap;
}

/**
 * Interface for React code generation
 * Single Responsibility: Generate equivalent React code
 */
export interface IReactGenerator {
  generate(ast: unknown): ReactEquivalent;
  generateForNode(node: RenderNode): string;
  explainMapping(lingoConstruct: string): string;
}

/**
 * Interface for visualization
 * Single Responsibility: Prepare data for visual representation
 */
export interface IVisualizationAdapter {
  toTreeData(tree: RenderTree): unknown;
  toGraphData(tree: RenderTree): unknown;
  toTimelineData(history: unknown[]): unknown;
  toDiffData(diff: StateDiff): unknown;
}

/**
 * Interface for engine introspection
 * Single Responsibility: Expose internal engine state
 */
export interface IInternalsInspector {
  getInternals(): EngineInternals;
  getRenderQueue(): unknown[];
  getDiffLog(): unknown[];
  getReconciliationLog(): unknown[];
  clearLogs(): void;
}

/**
 * Main engine interface that coordinates all subsystems
 * Following Facade Pattern for simplified interface
 */
export interface IFrontendSystemsEngine {
  // Execution control
  readonly execution: IExecutionController;

  // Tree management
  readonly treeBuilder: IRenderTreeBuilder;

  // State management
  readonly stateManager: IStateManager;

  // Code generation
  readonly reactGenerator: IReactGenerator;

  // Visualization
  readonly visualizer: IVisualizationAdapter;

  // Internals inspection
  readonly inspector: IInternalsInspector;

  // Lifecycle
  initialize(code: string): Promise<void>;
  dispose(): void;
}
