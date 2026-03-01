/**
 * Under the Hood Inspector Component
 * Single Responsibility: Display internal engine state for educational purposes
 */

"use client";

import type { EngineInternals } from "@/lib/engine";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Eye, Database, List as ListIcon, GitBranch, Activity } from "lucide-react";

interface UnderTheHoodInspectorProps {
  internals: EngineInternals | null;
  isVisible: boolean;
  onToggle: () => void;
}

export function UnderTheHoodInspector({
  internals,
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

  if (!internals) {
    return (
      <Card className="m-4">
        <CardContent className="flex items-center justify-center h-32 text-zinc-500">
          <p>No internal state available</p>
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
        <TabsList className="grid w-full grid-cols-4 h-8">
          <TabsTrigger value="state-map" className="text-xs">
            State Map
          </TabsTrigger>
          <TabsTrigger value="component-registry" className="text-xs">
            Components
          </TabsTrigger>
          <TabsTrigger value="render-queue" className="text-xs">
            Queue
          </TabsTrigger>
          <TabsTrigger value="reconciliation" className="text-xs">
            Reconciliation
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="state-map" className="m-0">
            <StateMapView stateMap={internals.stateMap} />
          </TabsContent>

          <TabsContent value="component-registry" className="m-0">
            <ComponentRegistryView registry={internals.componentRegistry} />
          </TabsContent>

          <TabsContent value="render-queue" className="m-0">
            <RenderQueueView queue={internals.renderQueue} />
          </TabsContent>

          <TabsContent value="reconciliation" className="m-0">
            <ReconciliationView
              diffSteps={internals.diffAlgorithmSteps}
              reconciliationLog={internals.reconciliationLog}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function StateMapView({ stateMap }: { stateMap: EngineInternals["stateMap"] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Database className="w-4 h-4" />
          Internal State Map ({stateMap.variables.size} variables)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-64 overflow-auto">
        {Array.from(stateMap.variables.entries()).map(([name, variable]) => (
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
        ))}
      </CardContent>
    </Card>
  );
}

function ComponentRegistryView({ registry }: { registry: EngineInternals["componentRegistry"] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <ListIcon className="w-4 h-4" />
          Component Registry ({registry.size} components)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 max-h-64 overflow-auto">
        {Array.from(registry.values()).map((component) => (
          <div key={component.id} className="flex items-center justify-between p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-sm">
            <span className="font-mono text-xs">{component.id}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                {component.type}
              </span>
              <span className="text-xs text-zinc-500">
                {new Date(component.registeredAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RenderQueueView({ queue }: { queue: EngineInternals["renderQueue"] }) {
  const sortedQueue = [...queue].sort((a, b) => b.priority - a.priority);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Render Queue ({queue.length} items)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 max-h-64 overflow-auto">
        {sortedQueue.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-4">Queue is empty</p>
        ) : (
          sortedQueue.map((item, index) => (
            <div key={index} className="p-2 rounded bg-zinc-100 dark:bg-zinc-800">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-mono text-xs">{item.nodeId}</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                  Priority: {item.priority}
                </span>
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">{item.reason}</div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function ReconciliationView({
  diffSteps,
  reconciliationLog,
}: {
  diffSteps: EngineInternals["diffAlgorithmSteps"];
  reconciliationLog: EngineInternals["reconciliationLog"];
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          Reconciliation Process
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="diff-steps">
            <AccordionTrigger className="text-sm">
              Diff Algorithm Steps ({diffSteps.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1 max-h-48 overflow-auto">
                {diffSteps.map((step, index) => (
                  <div key={index} className="p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono">{step.nodeId}</span>
                      <OperationBadge operation={step.operation} />
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-400">{step.reason}</div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="reconciliation-log">
            <AccordionTrigger className="text-sm">
              Reconciliation Log ({reconciliationLog.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1 max-h-48 overflow-auto">
                {reconciliationLog.map((entry, index) => (
                  <div key={index} className="p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold capitalize">{entry.phase} Phase</span>
                      <span className="text-zinc-500">{entry.duration}ms</span>
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-400">
                      {entry.nodesAffected} nodes affected - {entry.details}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

function OperationBadge({ operation }: { operation: string }) {
  const colors = {
    create: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    update: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    delete: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    skip: "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300",
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded ${colors[operation as keyof typeof colors] || colors.skip}`}>
      {operation}
    </span>
  );
}
