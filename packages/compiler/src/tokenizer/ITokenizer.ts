import { Token } from "./Token";

export interface ITokenizer {
  tokenize(source: string, filename: string): Token[];
}
