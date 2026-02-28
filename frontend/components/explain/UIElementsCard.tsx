import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Layers } from "lucide-react";
import type { ShowStmt, StyleProperties } from "@lingo-dsl/compiler";

interface UIElementsCardProps {
  showStmts: ShowStmt[];
}

export function UIElementsCard({ showStmts }: UIElementsCardProps) {
  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <CardTitle className="text-sm">UI Elements (All Declared)</CardTitle>
        </div>
        <CardDescription className="text-xs">
          All visual components in your code
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showStmts.length > 0 ? (
          <UIElementsList showStmts={showStmts} />
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  );
}

interface UIElementsListProps {
  showStmts: ShowStmt[];
}

function UIElementsList({ showStmts }: UIElementsListProps) {
  return (
    <div className="space-y-1 max-h-75 overflow-y-auto">
      {showStmts.map((stmt, index) => (
        <ShowStmtRenderer key={index} stmt={stmt} index={index} />
      ))}
    </div>
  );
}

interface ShowStmtRendererProps {
  stmt: ShowStmt;
  index?: number;
  depth?: number;
}

export function ShowStmtRenderer({ stmt, depth = 0 }: ShowStmtRendererProps) {
  const hasChildren = stmt.children && stmt.children.length > 0;
  const isContainer = hasChildren ?? false;

  let label = stmt.widget;
  if (stmt.config.type === "saying" && stmt.config.template) {
    label = `${stmt.widget}: "${stmt.config.template}"`;
  } else if (stmt.config.type === "called" && stmt.config.identifier) {
    label = `${stmt.widget} (${stmt.config.identifier})`;
  }

  return (
    <div
      className={`${
        depth > 0
          ? "ml-4 border-l-2 border-zinc-300 dark:border-zinc-700 pl-3"
          : ""
      }`}
    >
      <ShowStmtItem label={label} styles={stmt.styles} isContainer={isContainer} />
      {hasChildren && (
        <div className="mt-1">
          {stmt.children!.map((child, i) => (
            <ShowStmtRenderer key={i} stmt={child} index={i} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface ShowStmtItemProps {
  label: string;
  styles?: StyleProperties;
  isContainer: boolean;
}

function ShowStmtItem({ label, styles, isContainer }: ShowStmtItemProps) {
  return (
    <div className="flex items-start gap-2 py-1.5">
      <Eye className="w-3.5 h-3.5 text-violet-500 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <code className="text-xs font-mono text-zinc-700 dark:text-zinc-300 break-all">
          {label}
        </code>
        {styles && Object.keys(styles).length > 0 && (
          <StyleTags styles={styles} />
        )}
      </div>
      {isContainer && (
        <Layers className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
      )}
    </div>
  );
}

interface StyleTagsProps {
  styles: StyleProperties;
}

function StyleTags({ styles }: StyleTagsProps) {
  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {Object.entries(styles).map(([key, value]) => (
        <span
          key={key}
          className="text-[10px] px-1.5 py-0.5 rounded bg-pink-100 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300"
        >
          {key}: {value}
        </span>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
      No UI elements declared
    </p>
  );
}
