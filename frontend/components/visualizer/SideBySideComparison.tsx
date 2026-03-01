/**
 * Side-by-Side Comparison Component
 * Single Responsibility: Display Lingo code alongside equivalent React code
 */

"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { ArrowRight, Code2, FileCode } from "lucide-react";
import { JAVASCRIPT_LANGUAGE, LINGO_LANGUAGE } from "@/constants/editorConfig";
import type { ReactEquivalent } from "@/lib/engine";

interface SideBySideComparisonProps {
  lingoCode: string;
  reactEquivalent: ReactEquivalent | null;
}

export function SideBySideComparison({
  lingoCode,
  reactEquivalent,
}: SideBySideComparisonProps) {
  if (!reactEquivalent) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full text-zinc-500">
          <div className="text-center">
            <Code2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>React equivalent will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4 min-h-[600px]">
      {/* Explanation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            React Translation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {reactEquivalent.explanation}
          </p>
        </CardContent>
      </Card>

      {/* Code Comparison */}
      <Card className="flex-1 flex flex-col min-h-0">
        <Tabs defaultValue="side-by-side" className="flex-1 flex flex-col">
          <CardHeader className="pb-0">
            <TabsList className="grid w-full max-w-md grid-cols-3 h-9 text-xs sm:text-sm">
              <TabsTrigger value="side-by-side" className="text-xs sm:text-sm px-1 sm:px-3">
                <span className="hidden sm:inline">Side by Side</span>
                <span className="sm:hidden">Both</span>
              </TabsTrigger>
              <TabsTrigger value="lingo" className="text-xs sm:text-sm px-1 sm:px-3">
                Lingo Only
              </TabsTrigger>
              <TabsTrigger value="react" className="text-xs sm:text-sm px-1 sm:px-3">
                React Only
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="flex-1 min-h-0 pt-4">
            <TabsContent value="side-by-side" className="m-0 h-auto lg:h-[500px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                <CodeSection
                  title="Lingo DSL"
                  code={lingoCode}
                  language="lingo"
                  icon={<FileCode className="w-4 h-4" />}
                  fullHeight
                />
                <CodeSection
                  title="React Equivalent"
                  code={reactEquivalent.componentCode}
                  language="javascript"
                  icon={<Code2 className="w-4 h-4" />}
                  fullHeight
                />
              </div>
            </TabsContent>

            <TabsContent value="lingo" className="m-0 h-[500px]">
              <CodeSection
                title="Lingo DSL"
                code={lingoCode}
                language="lingo"
                icon={<FileCode className="w-4 h-4" />}
                fullHeight
              />
            </TabsContent>

            <TabsContent value="react" className="m-0 h-[500px]">
              <CodeSection
                title="React Equivalent"
                code={reactEquivalent.componentCode}
                language="javascript"
                icon={<Code2 className="w-4 h-4" />}
                fullHeight
              />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Hook Mappings */}
      {reactEquivalent.hookUsage.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Hook Mappings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reactEquivalent.hookUsage.map((hook, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2 rounded bg-zinc-50 dark:bg-zinc-900"
                >
                  <div className="font-mono text-xs px-2 py-1 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                    {hook.hook}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{hook.purpose}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                      Lingo: <span className="font-mono">{hook.lingoEquivalent}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface CodeSectionProps {
  title: string;
  code: string;
  language: string;
  icon: React.ReactNode;
  fullHeight?: boolean;
}

function CodeSection({ title, code, language, icon, fullHeight }: CodeSectionProps) {
  return (
    <div className={`flex flex-col ${fullHeight ? "h-[300px] lg:h-full" : "h-[300px] lg:h-[400px]"}`}>
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        {icon}
        {title}
      </div>
      <div className="border border-zinc-200 dark:border-zinc-800 rounded overflow-auto flex-1">
        <CodeEditor
          value={code}
          language={language === "lingo" ? LINGO_LANGUAGE : JAVASCRIPT_LANGUAGE}
          onChange={() => {}}
        />
      </div>
    </div>
  );
}
