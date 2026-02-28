// Tokenizer
export type { Token, TokenType, SourceLocation } from "./tokenizer/Token";
export type { ITokenizer } from "./tokenizer/ITokenizer";
export { LingoTokenizer } from "./tokenizer/LingoTokenizer";

// Parser
export type { IParser } from "./parser/IParser";
export { LingoParser } from "./parser/LingoParser";
export * from "./parser/AST";

// Analyzer
export type {
  ISemanticAnalyzer,
  AnalysisResult,
  SymbolInfo,
} from "./analyzer/ISemanticAnalyzer";
export { LingoAnalyzer } from "./analyzer/LingoAnalyzer";

// Code Generator
export type {
  ICodeGenerator,
  CodegenResult,
  CodegenOptions,
} from "./codegen/ICodeGenerator";
export { JSCodeGenerator } from "./codegen/JSCodeGenerator";

// Error Reporting
export type {
  IErrorReporter,
  CompilationError,
  ErrorSeverity,
} from "./errors/IErrorReporter";
export { ConsoleErrorReporter } from "./errors/ConsoleErrorReporter";

// Compiler
export { Compiler } from "./Compiler";
export type { ICompiler, CompilationResult, CompileOptions } from "./Compiler";
