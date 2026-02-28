export type RenderFunction = (root: HTMLElement) => void;

export function renderApp(
  renderFn: RenderFunction,
  rootElement?: HTMLElement,
): HTMLElement {
  const root = rootElement || document.getElementById("app") || document.body;

  // Clear existing content
  root.innerHTML = "";

  // Execute render function
  renderFn(root);

  return root;
}
