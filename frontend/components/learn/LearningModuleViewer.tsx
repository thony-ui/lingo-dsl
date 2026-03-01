/**
 * Learning Module Viewer Component
 * Single Responsibility: Display structured learning content
 */

"use client";

import { useState } from "react";
import type { LearningModule, Lesson } from "@/lib/engine";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, CheckCircle, Circle, ChevronRight, Lightbulb, Target } from "lucide-react";

interface LearningModuleViewerProps {
  modules: LearningModule[];
  currentModuleId: string | null;
  currentLessonId: string | null;
  completedLessons: Set<string>;
  onSelectLesson: (moduleId: string, lessonId: string, code: string) => void;
  showCard?: boolean; // Optional: whether to wrap in Card (default true for desktop sidebar)
}

export function LearningModuleViewer({
  modules,
  currentModuleId,
  currentLessonId,
  completedLessons,
  onSelectLesson,
  showCard = true,
}: LearningModuleViewerProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>(currentModuleId || modules[0]?.id || null);

  const content = (
    <div className="space-y-3">
      {modules.map((module) => (
        <ModuleCard
          key={module.id}
          module={module}
          isExpanded={expandedModule === module.id}
          currentLessonId={currentLessonId}
          completedLessons={completedLessons}
          onToggle={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
          onSelectLesson={(lessonId, code) => onSelectLesson(module.id, lessonId, code)}
        />
      ))}
    </div>
  );

  if (!showCard) {
    return <div className="h-full">{content}</div>;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          Learning Path
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto">
        {content}
      </CardContent>
    </Card>
  );
}

interface ModuleCardProps {
  module: LearningModule;
  isExpanded: boolean;
  currentLessonId: string | null;
  completedLessons: Set<string>;
  onToggle: () => void;
  onSelectLesson: (lessonId: string, code: string) => void;
}

function ModuleCard({
  module,
  isExpanded,
  currentLessonId,
  completedLessons,
  onToggle,
  onSelectLesson,
}: ModuleCardProps) {
  const completedCount = module.lessons.filter(l => completedLessons.has(l.id)).length;
  const totalCount = module.lessons.length;
  const isComplete = completedCount === totalCount;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-violet-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-900 hover:from-violet-100 hover:to-blue-100 dark:hover:from-zinc-800 dark:hover:to-zinc-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full text-purple-500 font-bold text-sm">
            {module.order}
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm">{module.title}</div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">{module.description}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete && <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />}
          <span className="text-xs text-zinc-500">{completedCount}/{totalCount}</span>
          <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
        </div>
      </button>

      {isExpanded && (
        <div className="p-2 space-y-1 bg-white dark:bg-zinc-950">
          {module.lessons.map((lesson, index) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              isActive={lesson.id === currentLessonId}
              isCompleted={completedLessons.has(lesson.id)}
              lessonNumber={index + 1}
              onSelect={() => onSelectLesson(lesson.id, lesson.exercises[0]?.starterCode || "")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface LessonItemProps {
  lesson: Lesson;
  isActive: boolean;
  isCompleted: boolean;
  lessonNumber: number;
  onSelect: () => void;
}

function LessonItem({ lesson, isActive, isCompleted, lessonNumber, onSelect }: LessonItemProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        w-full text-left px-3 py-2 rounded-lg transition-colors
        ${isActive ? "bg-violet-100 dark:bg-violet-900/30 border border-violet-300 dark:border-violet-700" : ""}
        ${!isActive ? "hover:bg-zinc-100 dark:hover:bg-zinc-900" : ""}
      `}
    >
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-0.5">
          {isCompleted ? (
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
          ) : (
            <Circle className="w-4 h-4 text-zinc-400" />
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium flex items-center gap-2">
            <span className="text-xs text-zinc-500">{lessonNumber}.</span>
            {lesson.title}
          </div>
          <div className="flex items-start gap-1 mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            <Target className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <span>{lesson.objective}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export function LessonContentViewer({ lesson }: { lesson: Lesson | null }) {
  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] text-zinc-500">
        <div className="text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Select a lesson to begin</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <BookOpen className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          {lesson.title}
        </CardTitle>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          <Target className="w-4 h-4" />
          {lesson.objective}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto space-y-4">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="whitespace-pre-line">{lesson.content.explanation}</div>
        </div>

        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Key Points
          </h4>
          <ul className="space-y-1 text-sm list-disc list-inside">
            {lesson.content.keyPoints.map((point, index) => (
              <li key={index} className="text-zinc-700 dark:text-zinc-300">{point}</li>
            ))}
          </ul>
        </div>

        {lesson.exercises.length > 0 && (
          <div className="p-4 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
            <h4 className="text-sm font-semibold mb-2">Exercise</h4>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{lesson.exercises[0].instruction}</p>
            
            {lesson.exercises[0].hints.length > 0 && (
              <Accordion type="single" collapsible className="mt-3">
                <AccordionItem value="hints">
                  <AccordionTrigger className="text-sm">Show Hints</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-1 text-sm list-disc list-inside">
                      {lesson.exercises[0].hints.map((hint, index) => (
                        <li key={index}>{hint}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
