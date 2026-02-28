import { IEffect, IScheduler } from "./IScheduler";

export class MicrotaskScheduler implements IScheduler {
  private pending = new Set<IEffect>();
  private flushing = false;
  private flushQueued = false;

  schedule(effect: IEffect): void {
    this.pending.add(effect);

    if (!this.flushing && !this.flushQueued) {
      this.flushQueued = true;
      queueMicrotask(() => {
        this.flushQueued = false;
        this.flush();
      });
    }
  }

  flush(): void {
    if (this.flushing) return;

    this.flushing = true;

    // Keep running effects until no more are pending
    // This handles chains of effects
    while (this.pending.size > 0) {
      const effects = Array.from(this.pending);
      this.pending.clear();

      for (const effect of effects) {
        effect.run();
      }
    }

    this.flushing = false;
  }

  batch(fn: () => void): void {
    const wasFlushing = this.flushing;
    this.flushing = true;

    fn();

    this.flushing = wasFlushing;

    if (!wasFlushing) {
      this.flush();
    }
  }
}
