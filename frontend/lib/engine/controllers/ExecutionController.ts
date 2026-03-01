/**
 * Execution Controller Implementation
 * Single Responsibility: Orchestrate step-by-step execution flow
 */

import {
  LingoTokenizer,
  LingoParser,
  LingoAnalyzer,
  JSCodeGenerator,
  ConsoleErrorReporter,
  type StateDecl,
} from "@lingo-dsl/compiler";
import { ExecutionPhase } from "../types";
import type { ExecutionState, ExecutionStep, ExecutionError } from "../types";
import type { IExecutionController } from "../interfaces";
import { RenderTreeBuilder } from "../builders/RenderTreeBuilder";
import { StateManager } from "../managers/StateManager";

export class ExecutionController implements IExecutionController {
  private sourceCode: string = "";
  private state: ExecutionState;
  private treeBuilder: RenderTreeBuilder;
  private stateManager: StateManager;
  private errorReporter: ConsoleErrorReporter;

  constructor() {
    this.treeBuilder = new RenderTreeBuilder();
    this.stateManager = new StateManager();
    this.errorReporter = new ConsoleErrorReporter();

    this.state = this.createInitialState();
  }

  async step(): Promise<ExecutionStep> {
    const currentPhase = this.state.currentPhase;

    try {
      switch (currentPhase) {
        case "IDLE":
          return await this.executeTokenizing();
        case "TOKENIZING":
          return await this.executeParsing();
        case "PARSING":
          return await this.executeAnalyzing();
        case "ANALYZING":
          return await this.executeBuildingTree();
        case "BUILDING_TREE":
          return await this.executeBindingState();
        case "BINDING_STATE":
          return await this.executeGeneratingCode();
        case "GENERATING_CODE":
          return this.executeComplete();
        default:
          throw new Error(`Cannot step from phase: ${currentPhase}`);
      }
    } catch (error) {
      return this.handleError(currentPhase, error);
    }
  }

  async stepBack(): Promise<ExecutionStep> {
    if (this.state.steps.length <= 1) {
      throw new Error("Cannot step back - at beginning of execution");
    }

    // Remove current step
    this.state.steps.pop();

    // Get previous step
    const previousStep = this.state.steps[this.state.steps.length - 1];
    this.state.currentPhase = previousStep.phase;

    return previousStep;
  }

  async runToPhase(targetPhase: string): Promise<void> {
    const phaseOrder = [
      ExecutionPhase.IDLE,
      ExecutionPhase.TOKENIZING,
      ExecutionPhase.PARSING,
      ExecutionPhase.ANALYZING,
      ExecutionPhase.BUILDING_TREE,
      ExecutionPhase.BINDING_STATE,
      ExecutionPhase.GENERATING_CODE,
      ExecutionPhase.COMPLETE,
      ExecutionPhase.ERROR,
    ];

    const currentIndex = phaseOrder.indexOf(this.state.currentPhase);
    const targetIndex = phaseOrder.indexOf(targetPhase as ExecutionPhase);

    if (targetIndex === -1) {
      throw new Error(`Invalid target phase: ${targetPhase}`);
    }

    if (targetIndex <= currentIndex) {
      throw new Error(`Target phase must be ahead of current phase`);
    }

    while (this.state.currentPhase !== targetPhase) {
      await this.step();

      if (this.state.currentPhase === ExecutionPhase.ERROR) {
        throw new Error(`Execution failed: ${this.state.error}`);
      }
    }
  }

  reset(): void {
    this.state = this.createInitialState();
  }

  getState(): ExecutionState {
    return { ...this.state };
  }

  setSourceCode(code: string): void {
    this.sourceCode = code;
    this.reset();
  }

  // ==================== Execution Phase Methods ====================

  private async executeTokenizing(): Promise<ExecutionStep> {
    const tokenizer = new LingoTokenizer(this.errorReporter);
    const tokens = tokenizer.tokenize(this.sourceCode);

    const step: ExecutionStep = {
      phase: ExecutionPhase.TOKENIZING,
      timestamp: Date.now(),
      description: `Tokenized source code into ${tokens.length} tokens`,
      data: { tokens, tokenCount: tokens.length },
    };

    this.state.currentPhase = ExecutionPhase.TOKENIZING;
    this.state.steps.push(step);

    return step;
  }

  private async executeParsing(): Promise<ExecutionStep> {
    const tokenizer = new LingoTokenizer(this.errorReporter);
    const parser = new LingoParser(this.errorReporter);

    const tokens = tokenizer.tokenize(this.sourceCode);
    const ast = parser.parse(tokens);

    const step: ExecutionStep = {
      phase: ExecutionPhase.PARSING,
      timestamp: Date.now(),
      description: `Parsed tokens into AST with ${ast.statements.length} statements`,
      data: { ast, statementCount: ast.statements.length },
    };

    this.state.currentPhase = ExecutionPhase.PARSING;
    this.state.ast = ast;
    this.state.steps.push(step);

    return step;
  }

  private async executeAnalyzing(): Promise<ExecutionStep> {
    if (!this.state.ast) {
      throw new Error("No AST available for analysis");
    }

    const analyzer = new LingoAnalyzer(this.errorReporter);
    analyzer.analyze(this.state.ast);

    const step: ExecutionStep = {
      phase: ExecutionPhase.ANALYZING,
      timestamp: Date.now(),
      description: "Performed semantic analysis on AST",
      data: { analyzed: true },
    };

    this.state.currentPhase = ExecutionPhase.ANALYZING;
    this.state.steps.push(step);

    return step;
  }

  private async executeBuildingTree(): Promise<ExecutionStep> {
    if (!this.state.ast) {
      throw new Error("No AST available for tree building");
    }

    const renderTree = this.treeBuilder.build(this.state.ast);

    const step: ExecutionStep = {
      phase: ExecutionPhase.BUILDING_TREE,
      timestamp: Date.now(),
      description: `Built render tree with ${renderTree.nodeMap.size} nodes`,
      data: {
        renderTree,
        nodeCount: renderTree.nodeMap.size,
      },
    };

    this.state.currentPhase = ExecutionPhase.BUILDING_TREE;
    this.state.renderTree = renderTree;
    this.state.steps.push(step);

    return step;
  }

  private async executeBindingState(): Promise<ExecutionStep> {
    if (!this.state.ast) {
      throw new Error("No AST available for state binding");
    }

    const stateDeclarations = this.state.ast.statements.filter(
      (stmt): stmt is StateDecl => stmt.type === "STATE_DECL",
    );

    const stateMap = this.stateManager.initialize(stateDeclarations);

    const step: ExecutionStep = {
      phase: ExecutionPhase.BINDING_STATE,
      timestamp: Date.now(),
      description: `Initialized ${stateMap.variables.size} state variables`,
      data: {
        stateMap,
        variableCount: stateMap.variables.size,
      },
    };

    this.state.currentPhase = ExecutionPhase.BINDING_STATE;
    this.state.stateMap = stateMap;
    this.state.steps.push(step);

    return step;
  }

  private async executeGeneratingCode(): Promise<ExecutionStep> {
    if (!this.state.ast) {
      throw new Error("No AST available for code generation");
    }

    const generator = new JSCodeGenerator();
    const generatedCode = generator.generate(this.state.ast);

    const step: ExecutionStep = {
      phase: ExecutionPhase.GENERATING_CODE,
      timestamp: Date.now(),
      description: "Generated JavaScript code",
      data: { code: generatedCode },
    };

    this.state.currentPhase = ExecutionPhase.GENERATING_CODE;
    this.state.steps.push(step);

    return step;
  }

  private executeComplete(): ExecutionStep {
    const step: ExecutionStep = {
      phase: ExecutionPhase.COMPLETE,
      timestamp: Date.now(),
      description: "Execution completed successfully",
    };

    this.state.currentPhase = ExecutionPhase.COMPLETE;
    this.state.steps.push(step);

    return step;
  }

  private handleError(phase: ExecutionPhase, error: unknown): ExecutionStep {
    const errorMessage = error instanceof Error ? error.message : String(error);

    const executionError: ExecutionError = {
      phase,
      message: errorMessage,
      details: error instanceof Error ? error.stack : undefined,
    };

    const step: ExecutionStep = {
      phase: ExecutionPhase.ERROR,
      timestamp: Date.now(),
      description: `Error during ${phase}: ${errorMessage}`,
      data: { error: executionError },
    };

    this.state.currentPhase = ExecutionPhase.ERROR;
    this.state.error = executionError;
    this.state.steps.push(step);

    return step;
  }

  private createInitialState(): ExecutionState {
    return {
      currentPhase: ExecutionPhase.IDLE,
      steps: [],
      ast: null,
      renderTree: null,
      stateMap: {
        variables: new Map(),
        changeHistory: [],
      },
      error: null,
    };
  }
}
