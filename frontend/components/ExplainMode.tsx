"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  FileCode, Activity, GitBranch, Database, 
  MousePointer, Eye, Layers, ArrowRight,
  Circle, Hash, Type, ToggleLeft, List
} from "lucide-react";
import {
  LingoTokenizer,
  LingoParser,
  ConsoleErrorReporter,
  type StateDecl,
  type ShowStmt,
  type EventBlock,
  type IfBlock,
  type ForEachBlock,
  type Value
} from "@lingo-dsl/compiler";

interface ExplainModeProps {
  compiledCode: string;
  lingoCode?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  liveState?: Record<string, any>;
}

export default function ExplainMode({ compiledCode, lingoCode, liveState = {} }: ExplainModeProps) {
  // Parse the Lingo code to extract AST
  const ast = useMemo(() => {
    if (!lingoCode) return null;
    
    try {
      const errorReporter = new ConsoleErrorReporter();
      const tokenizer = new LingoTokenizer(errorReporter);
      const parser = new LingoParser(errorReporter);
      
      const tokens = tokenizer.tokenize(lingoCode);
      const ast = parser.parse(tokens);
      
      return ast;
    } catch (error) {
      console.error("Failed to parse Lingo code:", error);
      return null;
    }
  }, [lingoCode]);

  // Extract state declarations
  const stateDecls = useMemo(() => {
    if (!ast) return [];
    return ast.statements.filter((stmt): stmt is StateDecl => stmt.type === "STATE_DECL");
  }, [ast]);

  // Extract show statements
  const showStmts = useMemo(() => {
    if (!ast) return [];
    return ast.statements.filter((stmt): stmt is ShowStmt => stmt.type === "SHOW_STMT");
  }, [ast]);

  // Extract event blocks
  const eventBlocks = useMemo(() => {
    if (!ast) return [];
    return ast.statements.filter((stmt): stmt is EventBlock => stmt.type === "EVENT_BLOCK");
  }, [ast]);

  // Extract if blocks
  const ifBlocks = useMemo(() => {
    if (!ast) return [];
    return ast.statements.filter((stmt): stmt is IfBlock => stmt.type === "IF_BLOCK");
  }, [ast]);

  // Extract for-each blocks
  const forEachBlocks = useMemo(() => {
    if (!ast) return [];
    return ast.statements.filter((stmt): stmt is ForEachBlock => stmt.type === "FOR_EACH_BLOCK");
  }, [ast]);

  const getStateIcon = (type: string) => {
    switch (type) {
      case "number": return <Hash className="w-3.5 h-3.5" />;
      case "text": return <Type className="w-3.5 h-3.5" />;
      case "boolean": return <ToggleLeft className="w-3.5 h-3.5" />;
      case "list": return <List className="w-3.5 h-3.5" />;
      default: return <Circle className="w-3.5 h-3.5" />;
    }
  };

  const getStateColor = (type: string) => {
    switch (type) {
      case "number": return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30";
      case "text": return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30";
      case "boolean": return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30";
      case "list": return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30";
      default: return "text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/30";
    }
  };

  const formatInitialValue = (value: Value) => {
    if (value.type === "empty") return "[]";
    if (value.type === "text") return `"${value.value}"`;
    if (value.type === "boolean") return value.value ? "true" : "false";
    if (value.type === "number") return value.value.toString();
    if (value.type === "identifier") return value.name;
    return "unknown";
  };

  // Evaluate a condition based on current live state
  const evaluateCondition = (ifBlock: IfBlock): boolean => {
    const { identifier, comparator, value } = ifBlock.condition;
    const currentValue = liveState[identifier];
    
    // If we don't have live state yet, return false
    if (currentValue === undefined) return false;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let compareValue: any;
    if (value.type === "text") compareValue = value.value;
    else if (value.type === "number") compareValue = value.value;
    else if (value.type === "boolean") compareValue = value.value;
    else if (value.type === "identifier") compareValue = liveState[value.name];
    else compareValue = undefined;
    
    switch (comparator) {
      case "equal": return currentValue === compareValue;
      case "notEqual": return currentValue !== compareValue;
      case "greater": return currentValue > compareValue;
      case "less": return currentValue < compareValue;
      case "greaterOrEqual": return currentValue >= compareValue;
      case "lessOrEqual": return currentValue <= compareValue;
      default: return false;
    }
  };

  const renderShowStmt = (stmt: ShowStmt, index: number, depth: number = 0) => {
    const hasChildren = stmt.children && stmt.children.length > 0;
    const isContainer = hasChildren;
    
    let label = stmt.widget;
    if (stmt.config.type === "saying" && stmt.config.template) {
      label = `${stmt.widget}: "${stmt.config.template}"`;
    } else if (stmt.config.type === "called" && stmt.config.identifier) {
      label = `${stmt.widget} (${stmt.config.identifier})`;
    }

    return (
      <div key={index} className={`${depth > 0 ? 'ml-4 border-l-2 border-zinc-300 dark:border-zinc-700 pl-3' : ''}`}>
        <div className="flex items-start gap-2 py-1.5">
          <Eye className="w-3.5 h-3.5 text-violet-500 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <code className="text-xs font-mono text-zinc-700 dark:text-zinc-300 break-all">
              {label}
            </code>
            {stmt.styles && Object.keys(stmt.styles).length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {Object.entries(stmt.styles).map(([key, value]) => (
                  <span 
                    key={key} 
                    className="text-[10px] px-1.5 py-0.5 rounded bg-pink-100 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300"
                  >
                    {key}: {value}
                  </span>
                ))}
              </div>
            )}
          </div>
          {isContainer && (
            <Layers className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
          )}
        </div>
        {hasChildren && (
          <div className="mt-1">
            {stmt.children!.map((child, i) => renderShowStmt(child, i, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-y-auto flex flex-col">
      <div className="bg-linear-to-r from-blue-50 to-violet-50 dark:from-zinc-900 dark:to-zinc-900 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
        <FileCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Explain Mode
        </h2>
      </div>
      
      <div className="p-4 space-y-3 bg-zinc-50 dark:bg-zinc-900/50">
        {/* State Variables */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-sm">State Variables</CardTitle>
            </div>
            <CardDescription className="text-xs">Reactive data declared in your app</CardDescription>
          </CardHeader>
          <CardContent>
            {stateDecls.length > 0 ? (
              <div className="space-y-3">
                {stateDecls.map((decl, index) => (
                  <div 
                    key={index} 
                    className={`rounded-lg border ${getStateColor(decl.varType)}`}
                  >
                    {/* Variable Header */}
                    <div className="flex items-center gap-2 p-2.5 border-b border-current/20">
                      {getStateIcon(decl.varType)}
                      <code className="font-semibold text-xs">{decl.identifier}</code>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 opacity-75">
                        {decl.varType}
                      </span>
                    </div>
                    
                    {/* Initial vs Current Values */}
                    <div className="grid grid-cols-1">
                      {/* Initial Value */}
                      <div className="p-2.5">
                        <div className="text-[10px] font-semibold opacity-60 mb-1">INITIAL</div>
                        <code className="text-xs font-mono bg-white/50 dark:bg-zinc-900/50 px-2 py-1 rounded inline-block">
                          {formatInitialValue(decl.initialValue)}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                No state variables declared
              </p>
            )}
          </CardContent>
        </Card>

        {/* UI Elements */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <CardTitle className="text-sm">UI Elements (All Declared)</CardTitle>
            </div>
            <CardDescription className="text-xs">All visual components in your code</CardDescription>
          </CardHeader>
          <CardContent>
            {showStmts.length > 0 ? (
              <div className="space-y-1 max-h-75 overflow-y-auto">
                {showStmts.map((stmt, index) => renderShowStmt(stmt, index))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                No UI elements declared
              </p>
            )}
          </CardContent>
        </Card>

        {/* Currently Visible UI */}
        <Card className="border-2 border-green-300 dark:border-green-800">
          <CardHeader className="pb-3 bg-green-50 dark:bg-green-950/30">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
              <CardTitle className="text-sm text-green-900 dark:text-green-100">Currently Visible UI</CardTitle>
            </div>
            <CardDescription className="text-xs">Elements currently shown based on state</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {/* Always visible show statements */}
              {showStmts.map((stmt, index) => (
                <div key={`show-${index}`} className="bg-green-50 dark:bg-green-950/20 rounded p-2 border border-green-200 dark:border-green-900">
                  {renderShowStmt(stmt, index)}
                </div>
              ))}
              
              {/* Conditionally visible elements */}
              {ifBlocks.map((ifBlock, index) => {
                const isActive = evaluateCondition(ifBlock);
                if (!isActive) return null;
                
                return (
                  <div key={`if-${index}`} className="space-y-2">
                    {ifBlock.body.map((stmt, i) => (
                      <div key={i} className="bg-green-100 dark:bg-green-900/30 rounded p-2 border-2 border-green-400 dark:border-green-700">
                        <div className="text-[9px] text-green-700 dark:text-green-300 font-semibold mb-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          FROM CONDITIONAL
                        </div>
                        {stmt.type === "SHOW_STMT" && renderShowStmt(stmt, i)}
                      </div>
                    ))}
                  </div>
                );
              })}
              
              {showStmts.length === 0 && !ifBlocks.some(evaluateCondition) && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                  No UI elements currently visible
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Event Handlers */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MousePointer className="w-4 h-4 text-green-600 dark:text-green-400" />
              <CardTitle className="text-sm">Event Handlers</CardTitle>
            </div>
            <CardDescription className="text-xs">User interaction logic</CardDescription>
          </CardHeader>
          <CardContent>
            {eventBlocks.length > 0 ? (
              <div className="space-y-3">
                {eventBlocks.map((event, index) => {
                  const widgetLabel = event.widgetRef.type === "literal" 
                    ? `"${event.widgetRef.label}"` 
                    : event.widgetRef.identifier;
                  
                  return (
                    <div 
                      key={index} 
                      className="p-3 rounded-lg border bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <MousePointer className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                        <code className="text-xs font-semibold text-green-700 dark:text-green-300">
                          {event.verb} {widgetLabel}
                        </code>
                      </div>
                      <div className="ml-5 space-y-1">
                        {event.actions.map((actionStmt, i) => {
                          const action = actionStmt.action;
                          let actionText = "";
                          
                          if (action.type === "increase") {
                            actionText = `increase ${action.identifier} by ${action.amount}`;
                          } else if (action.type === "decrease") {
                            actionText = `decrease ${action.identifier} by ${action.amount}`;
                          } else if (action.type === "set") {
                            const valStr = action.value.type === "text" ? `"${action.value.value}"` : 
                                          action.value.type === "number" ? action.value.value :
                                          action.value.type === "boolean" ? action.value.value :
                                          action.value.type === "identifier" ? action.value.name : "";
                            actionText = `set ${action.identifier} to ${valStr}`;
                          } else if (action.type === "add") {
                            const valStr = action.value.type === "text" ? `"${action.value.value}"` : 
                                          action.value.type === "identifier" ? action.value.name : 
                                          action.value.type === "number" ? action.value.value :
                                          action.value.type === "boolean" ? action.value.value : "";
                            actionText = `add ${valStr} to ${action.list}`;
                          } else if (action.type === "remove") {
                            const valStr = action.value.type === "text" ? `"${action.value.value}"` : 
                                          action.value.type === "identifier" ? action.value.name : 
                                          action.value.type === "number" ? action.value.value :
                                          action.value.type === "boolean" ? action.value.value : "";
                            actionText = `remove ${valStr} from ${action.list}`;
                          } else if (action.type === "toggle") {
                            actionText = `toggle ${action.identifier}`;
                          } else if (action.type === "custom") {
                            actionText = `${action.name} ${action.identifier}`;
                          }
                          
                          return (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <ArrowRight className="w-3 h-3 text-green-500" />
                              <code className="text-zinc-700 dark:text-zinc-300">
                                {actionText}
                              </code>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                No event handlers defined
              </p>
            )}
          </CardContent>
        </Card>

        {/* Conditional Logic */}
        {ifBlocks.length > 0 && (
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <CardTitle className="text-sm">Conditional Logic</CardTitle>
              </div>
              <CardDescription className="text-xs">If statements controlling UI flow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ifBlocks.map((ifBlock, index) => {
                  const isActive = evaluateCondition(ifBlock);
                  const rightValue = ifBlock.condition.value.type === "text" 
                    ? `"${ifBlock.condition.value.value}"` 
                    : ifBlock.condition.value.type === "number" 
                    ? ifBlock.condition.value.value 
                    : ifBlock.condition.value.type === "boolean"
                    ? ifBlock.condition.value.value
                    : ifBlock.condition.value.type === "identifier"
                    ? ifBlock.condition.value.name
                    : "";
                  
                  const operatorMap: Record<string, string> = {
                    "equal": "is equal to",
                    "notEqual": "is not equal to",
                    "greater": "is greater than",
                    "less": "is less than",
                    "greaterOrEqual": "is greater than or equal to",
                    "lessOrEqual": "is less than or equal to"
                  };
                  
                  return (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg border transition-all ${
                        isActive 
                          ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-400 dark:border-purple-600 shadow-lg' 
                          : 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <GitBranch className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        <code className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                          if {ifBlock.condition.identifier} {operatorMap[ifBlock.condition.comparator] || ifBlock.condition.comparator} {rightValue}
                        </code>
                        <div className={`ml-auto flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive 
                            ? 'bg-green-500 text-white' 
                            : 'bg-zinc-400 dark:bg-zinc-600 text-white'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-white/50'}`}></span>
                          {isActive ? 'ACTIVE' : 'INACTIVE'}
                        </div>
                      </div>
                      <div className="ml-5 space-y-1.5 mt-2">
                        <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mb-1">
                          THEN {isActive ? '(Currently Visible)' : '(Hidden)'}:
                        </div>
                        {ifBlock.body.map((stmt, i) => (
                          <div key={i} className={`rounded p-2 ${
                            isActive 
                              ? 'bg-white/80 dark:bg-zinc-900/80 border-2 border-green-300 dark:border-green-700' 
                              : 'bg-white/50 dark:bg-zinc-900/50'
                          }`}>
                            {stmt.type === "SHOW_STMT" && renderShowStmt(stmt, i)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loop Logic */}
        {forEachBlocks.length > 0 && (
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <CardTitle className="text-sm">Loops</CardTitle>
              </div>
              <CardDescription className="text-xs">For-each loops iterating over data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {forEachBlocks.map((loop, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded-lg border bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                      <code className="text-xs font-semibold text-orange-700 dark:text-orange-300">
                        for each {loop.itemName} in {loop.listName}
                      </code>
                    </div>
                    <div className="ml-5 space-y-1.5 mt-2">
                      {loop.body.map((stmt, i) => (
                        <div key={i} className="bg-white/50 dark:bg-zinc-900/50 rounded p-2">
                          {stmt.type === "SHOW_STMT" && renderShowStmt(stmt, i)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Separator />

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
            <div className="bg-zinc-900 dark:bg-zinc-950 rounded-md p-3 max-h-75 overflow-auto">
              <pre className="text-xs text-zinc-100 font-mono whitespace-pre-wrap break-all">
                {compiledCode || "// No code compiled yet"}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
