import { ITokenizer } from "./tokenizer/ITokenizer";
import { IParser } from "./parser/IParser";
import { ISemanticAnalyzer } from "./analyzer/ISemanticAnalyzer";
import {
  ICodeGenerator,
  CodegenResult,
  CodegenOptions,
} from "./codegen/ICodeGenerator";
import { IErrorReporter } from "./errors/IErrorReporter";

export interface CompileOptions {
  customFunctionsPath?: string;
}

export interface CompilationResult {
  success: boolean;
  code?: string;
  dependencies?: string[];
  errors: any[];
}

export interface ICompiler {
  compile(
    source: string,
    filename: string,
    options?: CompileOptions,
  ): CompilationResult;
}

export class Compiler implements ICompiler {
  constructor(
    private tokenizer: ITokenizer,
    private parser: IParser,
    private analyzer: ISemanticAnalyzer,
    private codeGenerator: ICodeGenerator,
    private errorReporter: IErrorReporter,
  ) {}

  compile(
    source: string,
    filename: string = "<input>",
    options?: CompileOptions,
  ): CompilationResult {
    // Clear previous errors
    this.errorReporter.clear();

    // Tokenize
    const tokens = this.tokenizer.tokenize(source, filename);
    if (this.errorReporter.hasErrors()) {
      return {
        success: false,
        errors: this.errorReporter.getErrors(),
      };
    }

    // Parse
    const ast = this.parser.parse(tokens);
    if (this.errorReporter.hasErrors()) {
      return {
        success: false,
        errors: this.errorReporter.getErrors(),
      };
    }

    // Analyze
    const analysisResult = this.analyzer.analyze(ast);
    if (!analysisResult.success || this.errorReporter.hasErrors()) {
      return {
        success: false,
        errors: this.errorReporter.getErrors(),
      };
    }

    // Generate code with options
    const codegenOptions: CodegenOptions = {
      customFunctionsPath: options?.customFunctionsPath,
    };
    const codegenResult = this.codeGenerator.generate(ast, codegenOptions);

    return {
      success: true,
      code: codegenResult.code,
      dependencies: codegenResult.dependencies,
      errors: [],
    };
  }
}
