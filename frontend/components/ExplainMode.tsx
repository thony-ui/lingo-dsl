"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileCode, Activity, Zap, GitBranch } from "lucide-react";

interface ExplainModeProps {
  compiledCode: string;
}

export default function ExplainMode({ compiledCode }: ExplainModeProps) {
  return (
    <div className="h-full w-full overflow-y-auto flex flex-col">
      <div className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-zinc-900 dark:to-zinc-900 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
        <FileCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Explain Mode
        </h2>
      </div>
      
      <div className="p-4 space-y-3 bg-zinc-50 dark:bg-zinc-900/50">
        {/* Compiled JavaScript Output */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <CardTitle className="text-sm">Compiled JavaScript</CardTitle>
            </div>
            <CardDescription className="text-xs">Generated reactive code</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-zinc-900 dark:bg-zinc-950 rounded-md p-3 max-h-[300px] overflow-auto">
              <pre className="text-xs text-zinc-100 font-mono">
                {compiledCode || "// No code compiled yet"}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* State Tracking - Placeholder for future debug hooks */}
        <Card className="border-2 border-dashed">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-sm">Reactive State</CardTitle>
            </div>
            <CardDescription className="text-xs">Live state tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
              💡 Debug instrumentation coming soon...
            </p>
          </CardContent>
        </Card>

        {/* Event Log - Placeholder */}
        <Card className="border-2 border-dashed">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
              <CardTitle className="text-sm">Event Log</CardTitle>
            </div>
            <CardDescription className="text-xs">User interaction tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
              💡 Event tracking coming soon...
            </p>
          </CardContent>
        </Card>

        {/* Dependency Graph - Placeholder */}
        <Card className="border-2 border-dashed">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <CardTitle className="text-sm">Dependency Graph</CardTitle>
            </div>
            <CardDescription className="text-xs">Reactive dependency visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
              💡 Dependency visualization coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
