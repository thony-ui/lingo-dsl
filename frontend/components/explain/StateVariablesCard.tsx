import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";
import type { StateDecl } from "@lingo-dsl/compiler";
import { getStateIcon, getStateColor, formatInitialValue } from "@/utils/explainModeUtils";

interface StateVariablesCardProps {
  stateDecls: StateDecl[];
}

export function StateVariablesCard({ stateDecls }: StateVariablesCardProps) {
  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <CardTitle className="text-sm">State Variables</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Reactive data declared in your app
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stateDecls.length > 0 ? (
          <StateVariablesList stateDecls={stateDecls} />
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  );
}

interface StateVariablesListProps {
  stateDecls: StateDecl[];
}

function StateVariablesList({ stateDecls }: StateVariablesListProps) {
  return (
    <div className="space-y-3">
      {stateDecls.map((decl, index) => (
        <StateVariableItem key={index} decl={decl} />
      ))}
    </div>
  );
}

interface StateVariableItemProps {
  decl: StateDecl;
}

function StateVariableItem({ decl }: StateVariableItemProps) {
  const Icon = getStateIcon(decl.varType);
  const colorClasses = getStateColor(decl.varType);

  return (
    <div className={`rounded-lg border ${colorClasses}`}>
      <StateVariableHeader
        Icon={Icon}
        identifier={decl.identifier}
        varType={decl.varType}
      />
      <StateVariableValue initialValue={formatInitialValue(decl.initialValue)} />
    </div>
  );
}

interface StateVariableHeaderProps {
  Icon: React.ComponentType<{ className?: string }>;
  identifier: string;
  varType: string;
}

function StateVariableHeader({ Icon, identifier, varType }: StateVariableHeaderProps) {
  return (
    <div className="flex items-center gap-2 p-2.5 border-b border-current/20">
      <Icon className="w-3.5 h-3.5" />
      <code className="font-semibold text-xs">{identifier}</code>
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 opacity-75">
        {varType}
      </span>
    </div>
  );
}

interface StateVariableValueProps {
  initialValue: string;
}

function StateVariableValue({ initialValue }: StateVariableValueProps) {
  return (
    <div className="p-2.5">
      <div className="text-[10px] font-semibold opacity-60 mb-1">INITIAL</div>
      <code className="text-xs font-mono bg-white/50 dark:bg-zinc-900/50 px-2 py-1 rounded inline-block">
        {initialValue}
      </code>
    </div>
  );
}

function EmptyState() {
  return (
    <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
      No state variables declared
    </p>
  );
}
