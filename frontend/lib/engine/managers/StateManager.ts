/**
 * State Manager Implementation
 * Single Responsibility: Track and manage application state changes
 */

import type { StateDecl, Value } from "@lingo-dsl/compiler";
import type {
  StateMap,
  StateVariable,
  StateChange,
  StateDiff,
  ChangeTrigger,
} from "../types";
import type { IStateManager } from "../interfaces";

export class StateManager implements IStateManager {
  private stateMap: StateMap = {
    variables: new Map(),
    changeHistory: [],
  };

  initialize(declarations: StateDecl[]): StateMap {
    this.stateMap = {
      variables: new Map(),
      changeHistory: [],
    };

    for (const decl of declarations) {
      const initialValue = this.extractValue(decl.initialValue);
      const stateVar: StateVariable = {
        name: decl.identifier,
        type: decl.varType,
        currentValue: initialValue,
        initialValue: initialValue,
        history: [],
      };

      this.stateMap.variables.set(decl.identifier, stateVar);
    }

    return this.snapshot();
  }

  updateState(
    variable: string,
    value: unknown,
    trigger: ChangeTrigger,
  ): StateDiff {
    const stateVar = this.stateMap.variables.get(variable);

    if (!stateVar) {
      throw new Error(`State variable "${variable}" not found`);
    }

    const previousValue = stateVar.currentValue;
    const change: StateChange = {
      timestamp: Date.now(),
      previousValue,
      newValue: value,
      trigger,
    };

    stateVar.currentValue = value;
    stateVar.history.push(change);
    this.stateMap.changeHistory.push(change);

    return {
      timestamp: change.timestamp,
      changes: [
        {
          variable,
          before: previousValue,
          after: value,
          affectedNodes: [], // Will be populated by render tree builder
        },
      ],
    };
  }

  getHistory(variable?: string): StateChange[] {
    if (variable) {
      const stateVar = this.stateMap.variables.get(variable);
      return stateVar?.history || [];
    }
    return this.stateMap.changeHistory;
  }

  getDiff(fromTimestamp: number, toTimestamp: number): StateDiff {
    const relevantChanges = this.stateMap.changeHistory.filter(
      (change) =>
        change.timestamp >= fromTimestamp && change.timestamp <= toTimestamp,
    );

    const changesByVariable = new Map<string, StateChange>();

    // Get latest change for each variable in the time range
    for (const change of relevantChanges) {
      for (const [varName, stateVar] of this.stateMap.variables) {
        if (stateVar.history.includes(change)) {
          changesByVariable.set(varName, change);
        }
      }
    }

    const changes = Array.from(changesByVariable.entries()).map(
      ([variable, change]) => ({
        variable,
        before: change.previousValue,
        after: change.newValue,
        affectedNodes: [],
      }),
    );

    return {
      timestamp: toTimestamp,
      changes,
    };
  }

  snapshot(): StateMap {
    // Deep clone the state map
    const variables = new Map<string, StateVariable>();

    for (const [name, stateVar] of this.stateMap.variables) {
      variables.set(name, {
        ...stateVar,
        history: [...stateVar.history],
      });
    }

    return {
      variables,
      changeHistory: [...this.stateMap.changeHistory],
    };
  }

  getCurrentState(): Record<string, unknown> {
    const state: Record<string, unknown> = {};

    for (const [name, stateVar] of this.stateMap.variables) {
      state[name] = stateVar.currentValue;
    }

    return state;
  }

  // ==================== Private Helper Methods ====================

  private extractValue(value: Value): unknown {
    switch (value.type) {
      case "number":
        return value.value;
      case "text":
        return value.value;
      case "boolean":
        return value.value;
      case "empty":
        return [];
      case "identifier":
        return this.stateMap.variables.get(value.name)?.currentValue ?? null;
      default:
        return null;
    }
  }
}
