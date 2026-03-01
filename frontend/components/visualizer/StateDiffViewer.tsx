/**
 * State Diff Viewer Component
 * Single Responsibility: Display state changes with before/after comparison
 */

"use client";

import { useState } from "react";
import type { DiffViewData } from "@/lib/engine";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Clock, Zap } from "lucide-react";

interface StateDiffViewerProps {
  diffs: DiffViewData[];
  onDiffSelect?: (timestamp: number) => void;
}

export function StateDiffViewer({ diffs, onDiffSelect }: StateDiffViewerProps) {
  const [selectedDiff, setSelectedDiff] = useState<number | null>(
    diffs.length > 0 ? diffs[diffs.length - 1].timestamp : null
  );

  if (diffs.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full text-zinc-500">
          <div className="text-center">
            <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No state changes yet</p>
            <p className="text-sm mt-1">State diffs will appear here when state updates</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentDiff = diffs.find(d => d.timestamp === selectedDiff) || diffs[diffs.length - 1];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          State Changes
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto space-y-3">
        <DiffTimeline
          diffs={diffs}
          selectedTimestamp={selectedDiff}
          onSelect={(timestamp) => {
            setSelectedDiff(timestamp);
            onDiffSelect?.(timestamp);
          }}
        />

        <Separator />

        {currentDiff && <DiffDetails diff={currentDiff} />}
      </CardContent>
    </Card>
  );
}

interface DiffTimelineProps {
  diffs: DiffViewData[];
  selectedTimestamp: number | null;
  onSelect: (timestamp: number) => void;
}

function DiffTimeline({ diffs, selectedTimestamp, onSelect }: DiffTimelineProps) {
  return (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-2">
        Timeline
      </h3>
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {diffs.map((diff, index) => {
          const isSelected = diff.timestamp === selectedTimestamp;
          const relativeTime = formatRelativeTime(diff.timestamp);
          
          return (
            <button
              key={diff.timestamp}
              onClick={() => onSelect(diff.timestamp)}
              className={`
                w-full text-left px-3 py-2 rounded text-sm
                transition-colors duration-150
                ${isSelected 
                  ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700" 
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Update #{index + 1}</span>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <Clock className="w-3 h-3" />
                  {relativeTime}
                </div>
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                {diff.changes.length} variable{diff.changes.length !== 1 ? "s" : ""} changed
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface DiffDetailsProps {
  diff: DiffViewData;
}

function DiffDetails({ diff }: DiffDetailsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
        Changes
      </h3>
      
      {diff.changes.map((change, index) => (
        <div key={index} className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
          <div className="font-mono text-sm font-semibold mb-2 text-violet-600 dark:text-violet-400">
            {change.variable}
          </div>
          
          <div className="flex items-center gap-3">
            <ValueDisplay value={change.before} label="Before" variant="before" />
            <ArrowRight className="w-4 h-4 text-zinc-400 flex-shrink-0" />
            <ValueDisplay value={change.after} label="After" variant="after" />
          </div>
          
          {change.affectedNodes.length > 0 && (
            <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                Affected Nodes:
              </div>
              <div className="flex flex-wrap gap-1">
                {change.affectedNodes.map(node => (
                  <span
                    key={node.id}
                    className="text-xs px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                  >
                    {node.type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface ValueDisplayProps {
  value: string;
  label: string;
  variant: "before" | "after";
}

function ValueDisplay({ value, label, variant }: ValueDisplayProps) {
  const colorClass = variant === "before" 
    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" 
    : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";

  return (
    <div className="flex-1">
      <div className="text-xs text-zinc-500 mb-1">{label}</div>
      <div className={`font-mono text-sm px-2 py-1 rounded border ${colorClass}`}>
        {value}
      </div>
    </div>
  );
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 1000) return "just now";
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return `${Math.floor(diff / 3600000)}h ago`;
}
