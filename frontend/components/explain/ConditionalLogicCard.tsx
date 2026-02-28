import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch } from "lucide-react";
import type { IfBlock, Value } from "@lingo-dsl/compiler";
import { evaluateCondition, OPERATOR_MAP } from "@/utils/explainModeUtils";
import { ShowStmtRenderer } from "./UIElementsCard";

interface ConditionalLogicCardProps {
  ifBlocks: IfBlock[];
  liveState: Record<string, unknown>;
}

export function ConditionalLogicCard({ ifBlocks, liveState }: ConditionalLogicCardProps) {
  if (ifBlocks.length === 0) return null;

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <CardTitle className="text-sm">Conditional Logic</CardTitle>
        </div>
        <CardDescription className="text-xs">
          If statements controlling UI flow
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ConditionalsList ifBlocks={ifBlocks} liveState={liveState} />
      </CardContent>
    </Card>
  );
}

interface ConditionalsListProps {
  ifBlocks: IfBlock[];
  liveState: Record<string, unknown>;
}

function ConditionalsList({ ifBlocks, liveState }: ConditionalsListProps) {
  return (
    <div className="space-y-3">
      {ifBlocks.map((ifBlock, index) => (
        <ConditionalItem key={index} ifBlock={ifBlock} liveState={liveState} />
      ))}
    </div>
  );
}

interface ConditionalItemProps {
  ifBlock: IfBlock;
  liveState: Record<string, unknown>;
}

function ConditionalItem({ ifBlock, liveState }: ConditionalItemProps) {
  const isActive = evaluateCondition(ifBlock, liveState);
  const rightValue = formatConditionValue(ifBlock.condition.value);
  const operator =
    OPERATOR_MAP[ifBlock.condition.comparator] || ifBlock.condition.comparator;

  return (
    <div
      className={`p-3 rounded-lg border transition-all ${
        isActive
          ? "bg-purple-100 dark:bg-purple-900/40 border-purple-400 dark:border-purple-600 shadow-lg"
          : "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900 opacity-60"
      }`}
    >
      <ConditionalHeader
        identifier={ifBlock.condition.identifier}
        operator={operator}
        rightValue={rightValue}
        isActive={isActive}
      />
      <ConditionalBody ifBlock={ifBlock} isActive={isActive} />
    </div>
  );
}

interface ConditionalHeaderProps {
  identifier: string;
  operator: string;
  rightValue: string;
  isActive: boolean;
}

function ConditionalHeader({ identifier, operator, rightValue, isActive }: ConditionalHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <GitBranch className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
      <code className="text-xs font-semibold text-purple-700 dark:text-purple-300">
        if {identifier} {operator} {rightValue}
      </code>
      <ActiveBadge isActive={isActive} />
    </div>
  );
}

interface ActiveBadgeProps {
  isActive: boolean;
}

function ActiveBadge({ isActive }: ActiveBadgeProps) {
  return (
    <div
      className={`ml-auto flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
        isActive
          ? "bg-green-500 text-white"
          : "bg-zinc-400 dark:bg-zinc-600 text-white"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? "bg-white animate-pulse" : "bg-white/50"
        }`}
      ></span>
      {isActive ? "ACTIVE" : "INACTIVE"}
    </div>
  );
}

interface ConditionalBodyProps {
  ifBlock: IfBlock;
  isActive: boolean;
}

function ConditionalBody({ ifBlock, isActive }: ConditionalBodyProps) {
  return (
    <div className="ml-5 space-y-1.5 mt-2">
      <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mb-1">
        THEN {isActive ? "(Currently Visible)" : "(Hidden)"}:
      </div>
      {ifBlock.body.map((stmt, i) => (
        <div
          key={i}
          className={`rounded p-2 ${
            isActive
              ? "bg-white/80 dark:bg-zinc-900/80 border-2 border-green-300 dark:border-green-700"
              : "bg-white/50 dark:bg-zinc-900/50"
          }`}
        >
          {stmt.type === "SHOW_STMT" && <ShowStmtRenderer stmt={stmt} index={i} />}
        </div>
      ))}
    </div>
  );
}

function formatConditionValue(value: Value): string {
  if (value.type === "text") return `"${value.value}"`;
  if (value.type === "number") return value.value.toString();
  if (value.type === "boolean") return value.value.toString();
  if (value.type === "identifier") return value.name;
  return "";
}
