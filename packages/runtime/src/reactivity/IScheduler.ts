export interface IEffect {
  run(): void;
  cleanup(): void;
}

export interface IScheduler {
  schedule(effect: IEffect): void;
  flush(): void;
  batch(fn: () => void): void;
}
