/**
 * Execution Stepper Component
 * Single Responsibility: Control and display step-by-step execution
 */

"use client";

import { useState } from "react";
import { ExecutionPhase, type ExecutionState } from "@/lib/engine";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  StepForward, 
  StepBack, 
  RotateCcw,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface ExecutionStepperProps {
  executionState: ExecutionState;
  onStep: () => Promise<ExecutionPhase> | void;
  onStepBack: () => void;
  onReset: () => void;
  onRunToPhase: (phase: ExecutionPhase) => void;
}

const PHASE_INFO: Record<ExecutionPhase, { label: string; description: string; icon: string }> = {
  [ExecutionPhase.IDLE]: {
    label: "Idle",
    description: "Ready to begin execution",
    icon: "⏸",
  },
  [ExecutionPhase.TOKENIZING]: {
    label: "Tokenizing",
    description: "Breaking source code into tokens",
    icon: "🔤",
  },
  [ExecutionPhase.PARSING]: {
    label: "Parsing",
    description: "Building Abstract Syntax Tree (AST)",
    icon: "🌳",
  },
  [ExecutionPhase.ANALYZING]: {
    label: "Analyzing",
    description: "Performing semantic analysis",
    icon: "🔍",
  },
  [ExecutionPhase.BUILDING_TREE]: {
    label: "Building Tree",
    description: "Constructing virtual render tree",
    icon: "🏗️",
  },
  [ExecutionPhase.BINDING_STATE]: {
    label: "Binding State",
    description: "Initializing state variables",
    icon: "🔗",
  },
  [ExecutionPhase.GENERATING_CODE]: {
    label: "Generating Code",
    description: "Generating executable JavaScript",
    icon: "⚙️",
  },
  [ExecutionPhase.COMPLETE]: {
    label: "Complete",
    description: "Execution completed successfully",
    icon: "✅",
  },
  [ExecutionPhase.ERROR]: {
    label: "Error",
    description: "An error occurred during execution",
    icon: "❌",
  },
};

const PHASE_ORDER: ExecutionPhase[] = [
  ExecutionPhase.IDLE,
  ExecutionPhase.TOKENIZING,
  ExecutionPhase.PARSING,
  ExecutionPhase.ANALYZING,
  ExecutionPhase.BUILDING_TREE,
  ExecutionPhase.BINDING_STATE,
  ExecutionPhase.GENERATING_CODE,
  ExecutionPhase.COMPLETE,
];

export function ExecutionStepper({
  executionState,
  onStep,
  onStepBack,
  onReset,
  onRunToPhase,
}: ExecutionStepperProps) {
  const [isRunning, setIsRunning] = useState(false);

  const currentPhaseIndex = PHASE_ORDER.indexOf(executionState.currentPhase);
  const canStepForward = executionState.currentPhase !== ExecutionPhase.COMPLETE && executionState.currentPhase !== ExecutionPhase.ERROR;
  const canStepBack = executionState.steps.length > 1;

  const handleRunAll = async () => {
    setIsRunning(true);
    try {
      let currentPhase = executionState.currentPhase;
      
      while (currentPhase !== ExecutionPhase.COMPLETE && currentPhase !== ExecutionPhase.ERROR) {
        const result = await onStep();
        currentPhase = result || executionState.currentPhase;
        // Small delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error("Error during run all:", error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          Execution Pipeline
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto space-y-4">
        {/* Control Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={onStepBack}
            disabled={!canStepBack || isRunning}
          >
            <StepBack className="w-3.5 h-3.5 mr-1.5" />
            Step Back
          </Button>

          <Button
            size="sm"
            onClick={onStep}
            disabled={!canStepForward || isRunning}
          >
            <StepForward className="w-3.5 h-3.5 mr-1.5" />
            Step Forward
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleRunAll}
            disabled={!canStepForward || isRunning}
          >
            <Play className="w-3.5 h-3.5 mr-1.5" />
            Run All
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onReset}
            disabled={isRunning}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset
          </Button>
        </div>

        {/* Phase Progress */}
        <div className="space-y-2">
          {PHASE_ORDER.slice(0, -1).map((phase, index) => {
            const isPast = index < currentPhaseIndex;
            const isCurrent = phase === executionState.currentPhase;
            const isFuture = index > currentPhaseIndex;

            return (
              <PhaseItem
                key={phase}
                phase={phase}
                isPast={isPast}
                isCurrent={isCurrent}
                isFuture={isFuture}
                onClick={() => !isPast && onRunToPhase(phase)}
              />
            );
          })}
        </div>

        {/* Current Step Details */}
        {executionState.steps.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <h4 className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
              Current Step
            </h4>
            <div className="text-sm">
              {executionState.steps[executionState.steps.length - 1].description}
            </div>
          </div>
        )}

        {/* Error Display */}
        {executionState.error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-900 dark:text-red-100">
                  Error in {executionState.error.phase}
                </h4>
                <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                  {executionState.error.message}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface PhaseItemProps {
  phase: ExecutionPhase;
  isPast: boolean;
  isCurrent: boolean;
  isFuture: boolean;
  onClick: () => void;
}

function PhaseItem({ phase, isPast, isCurrent, isFuture, onClick }: PhaseItemProps) {
  const info = PHASE_INFO[phase];

  return (
    <button
      onClick={onClick}
      disabled={isPast}
      className={`
        w-full text-left px-3 py-2 rounded-lg border transition-all duration-200
        ${isCurrent ? "bg-violet-100 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700 shadow-sm" : ""}
        ${isPast ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 opacity-75" : ""}
        ${isFuture ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-700" : ""}
      `}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{info.icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">{info.label}</span>
            {isPast && <Check className="w-4 h-4 text-green-600 dark:text-green-400" />}
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-400">
            {info.description}
          </div>
        </div>
      </div>
    </button>
  );
}
