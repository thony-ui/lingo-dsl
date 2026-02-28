import { renderApp } from "../src/dom/RenderApp";

describe("RenderApp", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.id = "app";
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should render to provided element", () => {
    const root = renderApp((root) => {
      const h1 = document.createElement("h1");
      h1.textContent = "Hello";
      root.appendChild(h1);
    }, container);

    expect(root).toBe(container);
    expect(container.querySelector("h1")?.textContent).toBe("Hello");
  });

  it("should clear existing content", () => {
    container.innerHTML = "<p>Old content</p>";

    renderApp((root) => {
      const h1 = document.createElement("h1");
      h1.textContent = "New content";
      root.appendChild(h1);
    }, container);

    expect(container.querySelector("p")).toBeNull();
    expect(container.querySelector("h1")?.textContent).toBe("New content");
  });

  it("should find app element if not provided", () => {
    renderApp((root) => {
      const h1 = document.createElement("h1");
      h1.textContent = "Auto-found";
      root.appendChild(h1);
    });

    expect(container.querySelector("h1")?.textContent).toBe("Auto-found");
  });

  it("should allow multiple elements", () => {
    renderApp((root) => {
      const h1 = document.createElement("h1");
      h1.textContent = "Title";
      root.appendChild(h1);

      const p = document.createElement("p");
      p.textContent = "Paragraph";
      root.appendChild(p);
    }, container);

    expect(container.children.length).toBe(2);
    expect(container.querySelector("h1")?.textContent).toBe("Title");
    expect(container.querySelector("p")?.textContent).toBe("Paragraph");
  });
});
