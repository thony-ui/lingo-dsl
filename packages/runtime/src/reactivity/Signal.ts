import { IEffect, IScheduler } from "./IScheduler";

// Global context for tracking current effect
let currentEffect: Effect | null = null;

export interface ISignal<T> {
  get(): T;
  set(value: T): void;
  subscribe(effect: IEffect): () => void;
}

export class Signal<T> implements ISignal<T> {
  private value: T;
  private subscribers = new Set<IEffect>();

  constructor(
    initialValue: T,
    private scheduler: IScheduler,
  ) {
    this.value = initialValue;
  }

  get(): T {
    // Track dependency if we're inside an effect
    if (currentEffect) {
      const unsubscribe = this.subscribe(currentEffect);
      currentEffect.addUnsubscriber(unsubscribe);
    }
    return this.value;
  }

  set(newValue: T): void {
    if (this.value !== newValue) {
      this.value = newValue;
      this.notify();
    }
  }

  subscribe(effect: IEffect): () => void {
    this.subscribers.add(effect);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(effect);
    };
  }

  private notify(): void {
    for (const effect of this.subscribers) {
      this.scheduler.schedule(effect);
    }
  }
}

export class Effect implements IEffect {
  private dependencies = new Set<ISignal<any>>();
  private unsubscribers: Array<() => void> = [];

  constructor(
    private fn: () => void,
    private scheduler: IScheduler,
  ) {
    // Run effect immediately, but catch initialization errors
    try {
      this.run();
    } catch (error) {
      // Suppress errors during initialization to prevent crashes
      // Errors will propagate on subsequent runs during flush()
    }
  }

  run(): void {
    // Clean up previous dependencies
    this.cleanup();

    // Set global context
    const previousEffect = currentEffect;
    currentEffect = this;

    try {
      this.fn();
    } finally {
      // Restore previous context
      currentEffect = previousEffect;
    }
  }

  addUnsubscriber(unsubscribe: () => void): void {
    this.unsubscribers.push(unsubscribe);
  }

  cleanup(): void {
    // Unsubscribe from all dependencies
    for (const unsubscribe of this.unsubscribers) {
      unsubscribe();
    }
    this.unsubscribers = [];
    this.dependencies.clear();
  }
}

// Export function to create signals and effects
export function createSignal<T>(
  initialValue: T,
  scheduler?: IScheduler,
): ISignal<T> {
  const sch = scheduler || getDefaultScheduler();
  return new Signal(initialValue, sch);
}

export function createEffect(fn: () => void, scheduler?: IScheduler): IEffect {
  const sch = scheduler || getDefaultScheduler();
  return new Effect(fn, sch);
}

// Default scheduler instance
let defaultScheduler: IScheduler | null = null;

function getDefaultScheduler(): IScheduler {
  if (!defaultScheduler) {
    // Lazy import to avoid circular dependency
    const { MicrotaskScheduler } = require("./Scheduler");
    defaultScheduler = new MicrotaskScheduler();
  }
  return defaultScheduler!;
}

export function setDefaultScheduler(scheduler: IScheduler): void {
  defaultScheduler = scheduler;
}
