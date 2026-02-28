import type { Value, IfBlock } from "@lingo-dsl/compiler";
import { Hash, Type, ToggleLeft, List, Circle } from "lucide-react";

export function getStateIcon(type: string) {
  switch (type) {
    case "number":
      return Hash;
    case "text":
      return Type;
    case "boolean":
      return ToggleLeft;
    case "list":
      return List;
    default:
      return Circle;
  }
}

export function getStateColor(type: string) {
  switch (type) {
    case "number":
      return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30";
    case "text":
      return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30";
    case "boolean":
      return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30";
    case "list":
      return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30";
    default:
      return "text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/30";
  }
}

export function formatInitialValue(value: Value): string {
  if (value.type === "empty") return "[]";
  if (value.type === "text") return `"${value.value}"`;
  if (value.type === "boolean") return value.value ? "true" : "false";
  if (value.type === "number") return value.value.toString();
  if (value.type === "identifier") return value.name;
  return "unknown";
}

export function evaluateCondition(
  ifBlock: IfBlock,
  liveState: Record<string, unknown>
): boolean {
  const { identifier, comparator, value } = ifBlock.condition;
  const currentValue = liveState[identifier];

  if (currentValue === undefined) return false;

  let compareValue: unknown;
  if (value.type === "text") compareValue = value.value;
  else if (value.type === "number") compareValue = value.value;
  else if (value.type === "boolean") compareValue = value.value;
  else if (value.type === "identifier") compareValue = liveState[value.name];
  else compareValue = undefined;

  switch (comparator) {
    case "equal":
      return currentValue === compareValue;
    case "notEqual":
      return currentValue !== compareValue;
    case "greater":
      return (currentValue as number) > (compareValue as number);
    case "less":
      return (currentValue as number) < (compareValue as number);
    case "greaterOrEqual":
      return (currentValue as number) >= (compareValue as number);
    case "lessOrEqual":
      return (currentValue as number) <= (compareValue as number);
    default:
      return false;
  }
}

export const OPERATOR_MAP: Record<string, string> = {
  equal: "is equal to",
  notEqual: "is not equal to",
  greater: "is greater than",
  less: "is less than",
  greaterOrEqual: "is greater than or equal to",
  lessOrEqual: "is less than or equal to",
};
