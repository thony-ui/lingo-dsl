/**
 * Frontend Systems Explorer Page
 * Main educational interface integrating all visualization and learning features
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Sparkles, Home, Network, Code2, BookOpen, Zap, Menu } from "lucide-react";
import { createEngine, ExecutionPhase } from "@/lib/engine";
import { ExecutionController } from "@/lib/engine/controllers/ExecutionController";
import type { ExecutionState, TreeNodeData, DiffViewData, ReactEquivalent, EngineInternals } from "@/lib/engine";
import { RenderTreeVisualizer } from "@/components/visualizer/RenderTreeVisualizer";
import { StateDiffViewer } from "@/components/visualizer/StateDiffViewer";
import { ExecutionStepper } from "@/components/visualizer/ExecutionStepper";
import { SideBySideComparison } from "@/components/visualizer/SideBySideComparison";
import { UnderTheHoodInspector } from "@/components/visualizer/UnderTheHoodInspector";
import { LearningModuleViewer, LessonContentViewer } from "@/components/learn/LearningModuleViewer";
import LingoEditor from "@/components/LingoEditor";
import { LEARNING_MODULES } from "@/constants/learningModules";
import type { LearningModule, Lesson } from "@/lib/engine";

export default function ExplorerPage() {
  const [code, setCode] = useState("");
  const [functions, setFunctions] = useState("");
  const [engine] = useState(() => createEngine());
  const [executionState, setExecutionState] = useState<ExecutionState | null>(null);
  const [treeData, setTreeData] = useState<TreeNodeData | null>(null);
  const [diffs] = useState<DiffViewData[]>([]);
  const [reactEquivalent, setReactEquivalent] = useState<ReactEquivalent | null>(null);
  const [internals, setInternals] = useState<EngineInternals | null>(null);
  const [showInternals, setShowInternals] = useState(false);
  const [currentModule, setCurrentModule] = useState<LearningModule | null>(LEARNING_MODULES[0]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessons] = useState<Set<string>>(new Set());
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const updateVisualizationData = useCallback(() => {
    const state = engine.execution.getState();
    setExecutionState(state);

    if (state.renderTree) {
      const treeViz = engine.visualizer.toTreeData(state.renderTree) as TreeNodeData;
      setTreeData(treeViz);
    }

    if (state.ast) {
      const reactCode = engine.reactGenerator.generate(state.ast);
      setReactEquivalent(reactCode);
    }

    const engineInternals = engine.inspector.getInternals();
    setInternals(engineInternals);
  }, [engine]);

  const handleStep = useCallback(async () => {
    try {
      await engine.execution.step();
      updateVisualizationData();
      return engine.execution.getState().currentPhase;
    } catch (error) {
      console.error("Error during step:", error);
      return engine.execution.getState().currentPhase;
    }
  }, [engine, updateVisualizationData]);

  const handleStepBack = useCallback(async () => {
    try {
      await engine.execution.stepBack();
      updateVisualizationData();
    } catch (error) {
      console.error("Error during step back:", error);
    }
  }, [engine, updateVisualizationData]);

  const handleReset = useCallback(() => {
    engine.execution.reset();
    updateVisualizationData();
  }, [engine, updateVisualizationData]);

  const handleRunToPhase = useCallback(async (phase: string) => {
    try {
      await engine.execution.runToPhase(phase as never);
      updateVisualizationData();
    } catch (error) {
      console.error("Error running to phase:", error);
    }
  }, [engine, updateVisualizationData]);

  const handleSelectLesson = useCallback(async (moduleId: string, lessonId: string, starterCode: string) => {
    const foundModule = LEARNING_MODULES.find(m => m.id === moduleId);
    const lesson = foundModule?.lessons.find(l => l.id === lessonId);
    
    if (foundModule && lesson) {
      setCurrentModule(foundModule);
      setCurrentLesson(lesson);
      setCode(starterCode);
      setIsMobileMenuOpen(false); // Close mobile menu when lesson is selected
      
      // Initialize engine with starter code (no auto-execution)
      (engine.execution as ExecutionController).setSourceCode(starterCode);
      updateVisualizationData();
    }
  }, [engine, updateVisualizationData]);

  const handleCodeChange = useCallback(async (newCode: string) => {
    setCode(newCode);
    // Reset execution when code changes (no auto-execution)
    (engine.execution as ExecutionController).setSourceCode(newCode);
    updateVisualizationData();
  }, [engine, updateVisualizationData]);

  // Initialize with first lesson
  useEffect(() => {
    if (LEARNING_MODULES[0]?.lessons[0] && !code) {
      const firstLesson = LEARNING_MODULES[0].lessons[0];
      const starterCode = firstLesson.exercises[0]?.starterCode || "";
      void handleSelectLesson(LEARNING_MODULES[0].id, firstLesson.id, starterCode);
    }
  // Only run on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-violet-950">
      <ExplorerNavigation />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Mobile Learning Path Selector */}
        <div className="md:hidden mb-4">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="w-full">
                <Card className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                        {currentModule?.title || "Learning Path"}
                      </span>
                      <Menu className="w-4 h-4 flex-shrink-0 text-zinc-400" />
                    </CardTitle>
                    {currentLesson && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        Lesson: {currentLesson.title}
                      </p>
                    )}
                  </CardHeader>
                </Card>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] sm:w-[400px] p-0">
              <SheetHeader className="p-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <SheetTitle className="text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  Learning Path
                </SheetTitle>
              </SheetHeader>
              <div className="overflow-auto h-[calc(100vh-80px)]">
                <div className="p-4">
                  <LearningModuleViewer
                    modules={LEARNING_MODULES}
                    currentModuleId={currentModule?.id || null}
                    currentLessonId={currentLesson?.id || null}
                    completedLessons={completedLessons}
                    onSelectLesson={handleSelectLesson}
                    showCard={false}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[calc(100vh-140px)] sm:min-h-[calc(100vh-120px)]">
          {/* Left Sidebar - Learning Modules */}
          <div className="hidden md:block col-span-1 md:col-span-3 overflow-hidden">
            <LearningModuleViewer
              modules={LEARNING_MODULES}
              currentModuleId={currentModule?.id || null}
              currentLessonId={currentLesson?.id || null}
              completedLessons={completedLessons}
              onSelectLesson={handleSelectLesson}
            />
          </div>

          {/* Main Content Area */}
          <div className="col-span-1 md:col-span-9 w-full">
            <Tabs defaultValue="learn" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="learn" className="text-xs sm:text-sm px-2 sm:px-4">
                  <BookOpen className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Learn</span>
                </TabsTrigger>
                <TabsTrigger value="visualize" className="text-xs sm:text-sm px-2 sm:px-4">
                  <Network className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Visualize</span>
                </TabsTrigger>
                <TabsTrigger value="compare" className="text-xs sm:text-sm px-2 sm:px-4">
                  <Code2 className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Compare</span>
                </TabsTrigger>
                <TabsTrigger value="explore" className="text-xs sm:text-sm px-2 sm:px-4">
                  <Zap className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Explore</span>
                </TabsTrigger>
              </TabsList>

              {/* Learn Mode */}
              <TabsContent value="learn" className="flex-1 m-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full min-h-[600px]">
                  <div className="min-h-[300px] lg:min-h-0">
                    <LessonContentViewer lesson={currentLesson} />
                  </div>
                  <div className="min-h-[400px] lg:min-h-0">
                    <LingoEditor
                      lingoValue={code}
                      functionsValue={functions}
                      onLingoChange={handleCodeChange}
                      onFunctionsChange={setFunctions}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Visualize Mode */}
              <TabsContent value="visualize" className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 m-0">
                <div className="space-y-4 overflow-auto">
                  <ExecutionStepper
                    executionState={executionState || {
                      currentPhase: ExecutionPhase.IDLE,
                      steps: [],
                      ast: null,
                      renderTree: null,
                      stateMap: { variables: new Map(), changeHistory: [] },
                      error: null,
                    }}
                    onStep={handleStep}
                    onStepBack={handleStepBack}
                    onReset={handleReset}
                    onRunToPhase={handleRunToPhase}
                  />
                  
                  <StateDiffViewer
                    diffs={diffs}
                    onDiffSelect={(timestamp) => {
                      // Highlight affected nodes
                      const diff = diffs.find(d => d.timestamp === timestamp);
                      if (diff) {
                        const nodeIds = new Set(diff.changes.flatMap(c => c.affectedNodes.map(n => n.id)));
                        setHighlightedNodes(nodeIds);
                      }
                    }}
                  />
                </div>

                <RenderTreeVisualizer
                  treeData={treeData}
                  highlightedNodeIds={highlightedNodes}
                  onNodeClick={(nodeId) => console.log("Node clicked:", nodeId)}
                />
              </TabsContent>

              {/* Compare Mode */}
              <TabsContent value="compare" className="flex-1 m-0 overflow-auto">
                <SideBySideComparison
                  lingoCode={code}
                  reactEquivalent={reactEquivalent}
                />
              </TabsContent>

              {/* Explore Mode */}
              <TabsContent value="explore" className="flex-1 m-0 flex flex-col overflow-hidden">
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
                  <LingoEditor
                    lingoValue={code}
                    functionsValue={functions}
                    onLingoChange={handleCodeChange}
                    onFunctionsChange={setFunctions}
                  />
                  <RenderTreeVisualizer
                    treeData={treeData}
                    highlightedNodeIds={highlightedNodes}
                    onNodeClick={(nodeId) => console.log("Node clicked:", nodeId)}
                  />
                </div>
                
                <UnderTheHoodInspector
                  internals={internals}
                  isVisible={showInternals}
                  onToggle={() => setShowInternals(!showInternals)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExplorerNavigation() {
  return (
    <nav className="border-b bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600 dark:text-violet-400" />
          <div>
            <span className="text-base sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Frontend Systems Explorer
            </span>
            <p className="hidden sm:block text-xs text-zinc-600 dark:text-zinc-400">
              Learn how modern UI frameworks actually work
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-4">
          <Button variant="ghost" size="sm" asChild className="px-2 sm:px-3">
            <Link href="/">
              <Home className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/playground">
              Playground
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/docs">
              Docs
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
