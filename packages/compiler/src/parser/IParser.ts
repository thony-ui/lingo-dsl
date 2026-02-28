import { Program } from "./AST";
import { Token } from "../tokenizer/Token";

export interface IParser {
  parse(tokens: Token[]): Program;
}
