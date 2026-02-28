import { Program } from "../parser/AST";

export interface AnalysisResult {
  success: boolean;
  symbolTable: Map<string, SymbolInfo>;
  dependencies: Map<string, Set<string>>;
}

export interface SymbolInfo {
  name: string;
  type: "number" | "text" | "boolean" | "list";
  isInitialized: boolean;
}

export interface ISemanticAnalyzer {
  analyze(ast: Program): AnalysisResult;
}
