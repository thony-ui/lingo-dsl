import { SourceLocation } from "../tokenizer/Token";

export enum ErrorSeverity {
  ERROR = "ERROR",
  WARNING = "WARNING",
}

export interface CompilationError {
  message: string;
  location: SourceLocation;
  severity: ErrorSeverity;
}

export interface IErrorReporter {
  report(error: CompilationError): void;
  hasErrors(): boolean;
  getErrors(): CompilationError[];
  clear(): void;
}
