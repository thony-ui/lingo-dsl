import {
  CompilationError,
  ErrorSeverity,
  IErrorReporter,
} from "./IErrorReporter";

export class ConsoleErrorReporter implements IErrorReporter {
  private errors: CompilationError[] = [];

  report(error: CompilationError): void {
    this.errors.push(error);
    const prefix = error.severity === ErrorSeverity.ERROR ? "Error" : "Warning";
    const location = `${error.location.filename}:${error.location.line}:${error.location.column}`;
    console.error(`${prefix}: ${location} - ${error.message}`);
  }

  hasErrors(): boolean {
    return this.errors.some((e) => e.severity === ErrorSeverity.ERROR);
  }

  getErrors(): CompilationError[] {
    return [...this.errors];
  }

  clear(): void {
    this.errors = [];
  }
}
