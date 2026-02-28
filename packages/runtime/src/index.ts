// Reactivity
export {
  Signal,
  Effect,
  createSignal,
  createEffect,
  setDefaultScheduler,
} from "./reactivity/Signal";
export type { ISignal } from "./reactivity/Signal";
export type { IScheduler, IEffect } from "./reactivity/IScheduler";
export { MicrotaskScheduler } from "./reactivity/Scheduler";

// DOM Rendering
export { renderApp } from "./dom/RenderApp";
export type { RenderFunction } from "./dom/RenderApp";
