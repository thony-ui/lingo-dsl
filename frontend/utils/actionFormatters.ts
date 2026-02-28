import type { Action, Value } from "@lingo-dsl/compiler";

function formatValue(value: Value): string {
  if (value.type === "text") return `"${value.value}"`;
  if (value.type === "number") return value.value.toString();
  if (value.type === "boolean") return value.value.toString();
  if (value.type === "identifier") return value.name;
  return "";
}

export function formatAction(action: Action): string {
  if (action.type === "increase") {
    return `increase ${action.identifier} by ${action.amount}`;
  }
  if (action.type === "decrease") {
    return `decrease ${action.identifier} by ${action.amount}`;
  }
  if (action.type === "set") {
    const valStr = formatValue(action.value);
    return `set ${action.identifier} to ${valStr}`;
  }
  if (action.type === "add") {
    const valStr = formatValue(action.value);
    return `add ${valStr} to ${action.list}`;
  }
  if (action.type === "remove") {
    const valStr = formatValue(action.value);
    return `remove ${valStr} from ${action.list}`;
  }
  if (action.type === "toggle") {
    return `toggle ${action.identifier}`;
  }
  if (action.type === "custom") {
    return `${action.name} ${action.identifier}`;
  }
  return "";
}
