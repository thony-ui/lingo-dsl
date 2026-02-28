import { useMemo } from "react";
import {
  LingoTokenizer,
  LingoParser,
  ConsoleErrorReporter,
  type StateDecl,
  type ShowStmt,
  type EventBlock,
  type IfBlock,
  type ForEachBlock,
} from "@lingo-dsl/compiler";

export function useLingoAST(lingoCode?: string) {
  return useMemo(() => {
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
}

export function useASTExtraction(ast: ReturnType<typeof useLingoAST>) {
  const stateDecls = useMemo(() => {
    if (!ast) return [];
    return ast.statements.filter(
      (stmt): stmt is StateDecl => stmt.type === "STATE_DECL"
    );
  }, [ast]);

  const showStmts = useMemo(() => {
    if (!ast) return [];
    return ast.statements.filter(
      (stmt): stmt is ShowStmt => stmt.type === "SHOW_STMT"
    );
  }, [ast]);

  const eventBlocks = useMemo(() => {
    if (!ast) return [];
    return ast.statements.filter(
      (stmt): stmt is EventBlock => stmt.type === "EVENT_BLOCK"
    );
  }, [ast]);

  const ifBlocks = useMemo(() => {
    if (!ast) return [];
    return ast.statements.filter(
      (stmt): stmt is IfBlock => stmt.type === "IF_BLOCK"
    );
  }, [ast]);

  const forEachBlocks = useMemo(() => {
    if (!ast) return [];
    return ast.statements.filter(
      (stmt): stmt is ForEachBlock => stmt.type === "FOR_EACH_BLOCK"
    );
  }, [ast]);

  return {
    stateDecls,
    showStmts,
    eventBlocks,
    ifBlocks,
    forEachBlocks,
  };
}
