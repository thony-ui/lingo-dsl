/**
 * Under the Hood Inspector Component
 * Single Responsibility: Display internal engine state for educational purposes
 */

"use client";

import type { ExecutionState } from "@/lib/engine";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Eye, Database, List as ListIcon, GitBranch, Activity } from "lucide-react";

interface UnderTheHoodInspectorProps {
  executionState: ExecutionState | null;
  isVisible: boolean;
  onToggle: () => void;
}

export function UnderTheHoodInspector({
  executionState,
  isVisible,
  onToggle,
}: UnderTheHoodInspectorProps) {
  if (!isVisible) {
    return (
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={onToggle}
          className="w-full px-4 py-2 rounded-lg bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30 border border-violet-200 dark:border-violet-800 transition-colors"
        >
          <div className="flex items-center justify-center gap-2 text-violet-700 dark:text-violet-300">
            <Eye className="w-4 h-4" />
            <span className="font-semibold">Show &ldquo;Under the Hood&rdquo; Internals</span>
          </div>
        </button>
      </div>
    );
  }

  if (!executionState || !executionState.ast) {
    return (
      <Card className="m-4">
        <CardContent className="flex items-center justify-center h-32 text-zinc-500">
          <p>No internal state available - run the code to see internals</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Eye className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          Under the Hood
        </h3>
        <button
          onClick={onToggle}
          className="text-xs text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
        >
          Hide
        </button>
      </div>

      <Tabs defaultValue="state-map" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-8">
          <TabsTrigger value="state-map" className="text-xs">
            State Map
          </TabsTrigger>
          <TabsTrigger value="ast" className="text-xs">
            AST
          </TabsTrigger>
          <TabsTrigger value="execution-steps" className="text-xs">
            Execution Steps
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="state-map" className="m-0">
            <StateMapView stateMap={executionState.stateMap} />
          </TabsContent>

          <TabsContent value="ast" className="m-0">
            <ASTView ast={executionState.ast} />
          </TabsContent>

          <TabsContent value="execution-steps" className="m-0">
            <ExecutionStepsView steps={executionState.steps} currentPhase={executionState.currentPhase} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function StateMapView({ stateMap }: { stateMap: ExecutionState["stateMap"] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Database className="w-4 h-4" />
          Internal State Map ({stateMap.variables.size} variables)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-64 overflow-auto">
        {stateMap.variables.size === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-4">No state variables yet</p>
        ) : (
          Array.from(stateMap.variables.entries()).map(([name, variable]) => (
            <div key={name} className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-semibold">{name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  {variable.type}
                </span>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400">Current:</span>
                  <span className="font-mono">{JSON.stringify(variable.currentValue)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400">Initial:</span>
                  <span className="font-mono">{JSON.stringify(variable.initialValue)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400">Changes:</span>
                  <span>{variable.history.length}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function ASTView({ ast }: { ast: ExecutionState["ast"] }) {
  if (!ast) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32 text-zinc-500">
          <p>No AST available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          Abstract Syntax Tree ({ast.statements.length} statements)
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-64 overflow-auto">
        <Accordion type="single" collapsible className="w-full">
          {ast.statements.map((stmt, index) => (
            <AccordionItem key={index} value={`stmt-${index}`}>
              <AccordionTrigger className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono">{stmt.type}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <pre className="text-xs bg-zinc-100 dark:bg-zinc-800 p-2 rounded overflow-x-auto">
                  {JSON.stringify(stmt, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function ExecutionStepsView({ steps, currentPhase }: { steps: ExecutionState["steps"]; currentPhase: string }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Execution Steps ({steps.length} steps)
        </CardTitle>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Current Phase: <span className="font-semibold">{currentPhase}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-1 max-h-64 overflow-auto">
        {steps.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-4">No execution steps yet</p>
        ) : (
          steps.map((step, index) => (
            <div key={index} className="p-2 rounded bg-zinc-100 dark:bg-zinc-800">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-mono text-xs">{step.phase}</span>
                <span className="text-xs text-zinc-500">
                  {new Date(step.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">{step.description}</div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
