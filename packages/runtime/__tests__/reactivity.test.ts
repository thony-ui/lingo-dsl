import {
  Signal,
  Effect,
  createSignal,
  createEffect,
} from "../src/reactivity/Signal";
import { MicrotaskScheduler } from "../src/reactivity/Scheduler";

describe("Reactivity System", () => {
  let scheduler: MicrotaskScheduler;

  beforeEach(() => {
    scheduler = new MicrotaskScheduler();
  });

  describe("Signal", () => {
    it("should create signal with initial value", () => {
      const count = createSignal(0, scheduler);
      expect(count.get()).toBe(0);
    });

    it("should update signal value", () => {
      const count = createSignal(0, scheduler);
      count.set(5);
      expect(count.get()).toBe(5);
    });

    it("should handle different types", () => {
      const num = createSignal(42, scheduler);
      const str = createSignal("hello", scheduler);
      const bool = createSignal(true, scheduler);
      const arr = createSignal([1, 2, 3], scheduler);

      expect(num.get()).toBe(42);
      expect(str.get()).toBe("hello");
      expect(bool.get()).toBe(true);
      expect(arr.get()).toEqual([1, 2, 3]);
    });

    it("should not trigger on same value", () => {
      const count = createSignal(5, scheduler);
      const mockEffect = jest.fn();

      createEffect(() => {
        count.get();
        mockEffect();
      }, scheduler);

      mockEffect.mockClear();
      count.set(5); // Same value
      scheduler.flush();

      expect(mockEffect).not.toHaveBeenCalled();
    });
  });

  describe("Effect", () => {
    it("should run immediately on creation", () => {
      const mockFn = jest.fn();
      createEffect(mockFn, scheduler);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should track signal dependencies", () => {
      const count = createSignal(0, scheduler);
      const mockFn = jest.fn();

      createEffect(() => {
        count.get();
        mockFn();
      }, scheduler);

      mockFn.mockClear();
      count.set(1);
      scheduler.flush();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should track multiple signal dependencies", () => {
      const a = createSignal(1, scheduler);
      const b = createSignal(2, scheduler);
      const mockFn = jest.fn();

      createEffect(() => {
        a.get();
        b.get();
        mockFn();
      }, scheduler);

      mockFn.mockClear();

      a.set(10);
      scheduler.flush();
      expect(mockFn).toHaveBeenCalledTimes(1);

      mockFn.mockClear();
      b.set(20);
      scheduler.flush();
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should update dependencies dynamically", () => {
      const condition = createSignal(true, scheduler);
      const a = createSignal(1, scheduler);
      const b = createSignal(2, scheduler);
      let result = 0;

      createEffect(() => {
        result = condition.get() ? a.get() : b.get();
      }, scheduler);

      expect(result).toBe(1);

      // Change to use b
      condition.set(false);
      scheduler.flush();
      expect(result).toBe(2);

      // Updating a should not trigger effect now
      a.set(10);
      scheduler.flush();
      expect(result).toBe(2);

      // Updating b should trigger
      b.set(20);
      scheduler.flush();
      expect(result).toBe(20);
    });

    it("should handle computed values", () => {
      const count = createSignal(5, scheduler);
      let doubled = 0;

      createEffect(() => {
        doubled = count.get() * 2;
      }, scheduler);

      expect(doubled).toBe(10);

      count.set(7);
      scheduler.flush();
      expect(doubled).toBe(14);
    });
  });

  describe("Scheduler", () => {
    it("should support manual flush", () => {
      const count = createSignal(0, scheduler);
      const mockFn = jest.fn();

      createEffect(() => {
        count.get();
        mockFn();
      }, scheduler);

      mockFn.mockClear();

      count.set(5);
      expect(mockFn).not.toHaveBeenCalled();

      scheduler.flush();
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should support batch operations", () => {
      const a = createSignal(1, scheduler);
      const b = createSignal(2, scheduler);
      const mockFn = jest.fn();

      createEffect(() => {
        a.get();
        b.get();
        mockFn();
      }, scheduler);

      mockFn.mockClear();

      scheduler.batch(() => {
        a.set(10);
        b.set(20);
      });

      // Should run only once for both updates
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should prevent redundant updates", () => {
      const count = createSignal(0, scheduler);
      const mockFn = jest.fn();

      createEffect(() => {
        count.get();
        mockFn();
      }, scheduler);

      mockFn.mockClear();

      // Schedule same effect multiple times
      count.set(1);
      count.set(2);
      count.set(3);

      scheduler.flush();

      // Should run only once
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle chains of effects", () => {
      const a = createSignal(1, scheduler);
      const b = createSignal<number>(0, scheduler);
      const c = createSignal<number>(0, scheduler);

      createEffect(() => {
        b.set(a.get() * 2);
      }, scheduler);

      createEffect(() => {
        c.set(b.get() + 10);
      }, scheduler);

      scheduler.flush();
      expect(c.get()).toBe(12); // (1 * 2) + 10

      a.set(5);
      scheduler.flush();
      expect(c.get()).toBe(20); // (5 * 2) + 10
    });

    it("should handle multiple effects on same signal", () => {
      const count = createSignal(0, scheduler);
      const results: number[] = [];

      createEffect(() => {
        results.push(count.get() * 2);
      }, scheduler);

      createEffect(() => {
        results.push(count.get() * 3);
      }, scheduler);

      results.length = 0; // Clear initial runs

      count.set(5);
      scheduler.flush();

      expect(results).toContain(10); // 5 * 2
      expect(results).toContain(15); // 5 * 3
    });

    it("should not create memory leaks", () => {
      const count = createSignal(0, scheduler);
      const mockFn = jest.fn();

      const effect = createEffect(() => {
        count.get();
        mockFn();
      }, scheduler);

      mockFn.mockClear();

      effect.cleanup();

      count.set(5);
      scheduler.flush();

      // Effect should not run after cleanup
      expect(mockFn).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("should handle circular dependencies safely", () => {
      const a = createSignal(1, scheduler);
      const b = createSignal(2, scheduler);
      let iterations = 0;

      createEffect(() => {
        iterations++;
        if (iterations > 100) return; // Safety check

        const aVal = a.get();
        if (aVal < 10) {
          b.set(aVal + 1);
        }
      }, scheduler);

      createEffect(() => {
        iterations++;
        if (iterations > 100) return;

        const bVal = b.get();
        if (bVal < 10) {
          a.set(bVal + 1);
        }
      }, scheduler);

      scheduler.flush();

      // Should stabilize, not infinite loop
      expect(iterations).toBeLessThan(100);
    });

    it("should handle empty effects", () => {
      expect(() => {
        createEffect(() => {}, scheduler);
      }).not.toThrow();
    });

    it("should handle effects that throw errors", () => {
      const count = createSignal(0, scheduler);

      createEffect(() => {
        count.get();
        throw new Error("Test error");
      }, scheduler);

      // Should not crash the scheduler
      expect(() => {
        count.set(5);
        scheduler.flush();
      }).toThrow();
    });
  });
});
