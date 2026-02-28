"use client";

import { FileCode } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLingoAST, useASTExtraction } from "@/hooks/useLingoAST";
import { StateVariablesCard } from "@/components/explain/StateVariablesCard";
import { UIElementsCard } from "@/components/explain/UIElementsCard";
import { EventHandlersCard } from "@/components/explain/EventHandlersCard";
import { ConditionalLogicCard } from "@/components/explain/ConditionalLogicCard";
import { CompiledCodeCard } from "@/components/explain/CompiledCodeCard";

interface ExplainModeProps {
  compiledCode: string;
  lingoCode?: string;
  liveState?: Record<string, unknown>;
}

export default function ExplainMode({
  compiledCode,
  lingoCode,
  liveState = {},
}: ExplainModeProps) {
  const ast = useLingoAST(lingoCode);
  const { stateDecls, showStmts, eventBlocks, ifBlocks } = useASTExtraction(ast);

  return (
    <div className="h-full w-full overflow-y-auto flex flex-col">
      <ExplainModeHeader />
      <ExplainModeContent
        stateDecls={stateDecls}
        showStmts={showStmts}
        eventBlocks={eventBlocks}
        ifBlocks={ifBlocks}
        liveState={liveState}
        compiledCode={compiledCode}
      />
    </div>
  );
}

function ExplainModeHeader() {
  return (
    <div className="bg-linear-to-r from-blue-50 to-violet-50 dark:from-zinc-900 dark:to-zinc-900 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
      <FileCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Explain Mode
      </h2>
    </div>
  );
}

interface ExplainModeContentProps {
  stateDecls: ReturnType<typeof useASTExtraction>["stateDecls"];
  showStmts: ReturnType<typeof useASTExtraction>["showStmts"];
  eventBlocks: ReturnType<typeof useASTExtraction>["eventBlocks"];
  ifBlocks: ReturnType<typeof useASTExtraction>["ifBlocks"];
  liveState: Record<string, unknown>;
  compiledCode: string;
}

function ExplainModeContent({
  stateDecls,
  showStmts,
  eventBlocks,
  ifBlocks,
  liveState,
  compiledCode,
}: ExplainModeContentProps) {
  return (
    <div className="p-4 space-y-3 bg-zinc-50 dark:bg-zinc-900/50">
      <StateVariablesCard stateDecls={stateDecls} />
      <UIElementsCard showStmts={showStmts} />
      <EventHandlersCard eventBlocks={eventBlocks} />
      <ConditionalLogicCard ifBlocks={ifBlocks} liveState={liveState} />
      <Separator />
      <CompiledCodeCard compiledCode={compiledCode} />
    </div>
  );
}
