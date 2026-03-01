/**
 * Core type definitions for the Frontend Systems Explorer execution engine
 * Following Interface Segregation Principle - focused, specific interfaces
 */

import type {
  Program,
  StateDecl,
  ShowStmt,
  EventBlock,
  IfBlock,
  ForEachBlock,
} from "@lingo-dsl/compiler";

// ==================== Execution Types ====================

export enum ExecutionPhase {
  IDLE = "IDLE",
  TOKENIZING = "TOKENIZING",
  PARSING = "PARSING",
  ANALYZING = "ANALYZING",
  BUILDING_TREE = "BUILDING_TREE",
  BINDING_STATE = "BINDING_STATE",
  GENERATING_CODE = "GENERATING_CODE",
  COMPLETE = "COMPLETE",
  ERROR = "ERROR",
}

export interface ExecutionStep {
  phase: ExecutionPhase;
  timestamp: number;
  description: string;
  data?: unknown;
}

export interface ExecutionState {
  currentPhase: ExecutionPhase;
  steps: ExecutionStep[];
  ast: Program | null;
  renderTree: RenderTree | null;
  stateMap: StateMap;
  error: ExecutionError | null;
}

export interface ExecutionError {
  phase: ExecutionPhase;
  message: string;
  details?: string;
}

// ==================== Render Tree Types ====================

export type RenderNodeType =
  | "root"
  | "heading"
  | "text"
  | "button"
  | "input"
  | "conditional"
  | "loop"
  | "fragment";

export interface RenderNode {
  id: string;
  type: RenderNodeType;
  children: RenderNode[];
  props: Record<string, unknown>;
  metadata: NodeMetadata;
}

export interface NodeMetadata {
  sourceStatement?: StateDecl | ShowStmt | EventBlock | IfBlock | ForEachBlock;
  stateBindings: string[]; // State variables this node depends on
  depth: number;
  isConditional: boolean;
  renderCount: number;
  lastRenderTimestamp: number;
}

export interface RenderTree {
  root: RenderNode;
  nodeMap: Map<string, RenderNode>;
  stateBindingIndex: Map<string, Set<string>>; // stateVar -> Set<nodeId>
}

// ==================== State Management Types ====================

export interface StateVariable {
  name: string;
  type: "number" | "text" | "boolean" | "list";
  currentValue: unknown;
  initialValue: unknown;
  history: StateChange[];
}

export interface StateChange {
  timestamp: number;
  previousValue: unknown;
  newValue: unknown;
  trigger: ChangeTrigger;
}

export type ChangeTrigger =
  | { type: "initialization" }
  | { type: "event"; eventType: string; target: string }
  | { type: "action"; actionType: string };

export interface StateMap {
  variables: Map<string, StateVariable>;
  changeHistory: StateChange[];
}

export interface StateDiff {
  timestamp: number;
  changes: Array<{
    variable: string;
    before: unknown;
    after: unknown;
    affectedNodes: string[]; // Node IDs that will re-render
  }>;
}

// ==================== React Equivalent Types ====================

export interface ReactEquivalent {
  componentCode: string;
  hookUsage: HookUsage[];
  explanation: string;
}

export interface HookUsage {
  hook: string;
  line: number;
  purpose: string;
  lingoEquivalent: string;
}

// ==================== Engine Internals Types ====================

export interface EngineInternals {
  stateMap: StateMap;
  componentRegistry: Map<string, ComponentRegistration>;
  renderQueue: RenderQueueItem[];
  diffAlgorithmSteps: DiffStep[];
  reconciliationLog: ReconciliationEntry[];
}

export interface ComponentRegistration {
  id: string;
  type: RenderNodeType;
  registeredAt: number;
}

export interface RenderQueueItem {
  nodeId: string;
  priority: number;
  reason: string;
  enqueuedAt: number;
}

export interface DiffStep {
  nodeId: string;
  operation: "create" | "update" | "delete" | "skip";
  reason: string;
  timestamp: number;
}

export interface ReconciliationEntry {
  timestamp: number;
  phase: "diff" | "commit";
  nodesAffected: number;
  duration: number;
  details: string;
}

// ==================== Learning Module Types ====================

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  prerequisites: string[];
}

export interface Lesson {
  id: string;
  title: string;
  objective: string;
  content: LessonContent;
  exercises: Exercise[];
  verificationCriteria: VerificationRule[];
}

export interface LessonContent {
  explanation: string;
  codeExample: string;
  keyPoints: string[];
  visualizationFocus: VisualizationFocus;
}

export type VisualizationFocus =
  | "render-tree"
  | "state-changes"
  | "execution-flow"
  | "performance"
  | "comparison";

export interface Exercise {
  id: string;
  instruction: string;
  starterCode: string;
  hints: string[];
  solution: string;
}

export interface VerificationRule {
  check: (state: ExecutionState) => boolean;
  feedback: string;
}
