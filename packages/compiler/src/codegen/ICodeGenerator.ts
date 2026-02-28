import { Program } from "../parser/AST";

export interface CodegenResult {
  code: string;
  dependencies: string[];
}

export interface CodegenOptions {
  customFunctionsPath?: string; // Optional path to custom functions file
}

export interface ICodeGenerator {
  generate(ast: Program, options?: CodegenOptions): CodegenResult;
}
