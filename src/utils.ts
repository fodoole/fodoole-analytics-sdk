/**
 * @file utils.ts
 * @description Utility functions for Qeen Analytics SDK.
 */

/**
 * Wrapper for the onload event.
 * @param {Function} fn - function to be executed on load.
 */
export function onLoad(fn: Function): void {
  if (document.body === null) {
    document.addEventListener('DOMContentLoaded', function (): void {
      fn();
    }, false);
  } else {
    fn();
  }
}

/**
 * Wrapper for beforeunload event.
 * @param {Function} fn - function to be executed before the page is unloaded.
 */
export function beforeUnload(fn: Function): void {
  window.addEventListener('beforeunload', function (): void {
    fn();
  }, false);
}

/**
 * @class Debouncer
 * @param {Function} fn - the function to be debounced.
 * @param {number} delay - the time in milliseconds to wait before calling the function.
 * @returns {Debouncer} - an object containing the debounced function, a trigger function, and a clear function.
 * @method debounced - the function to debounce the function.
 * @method trigger - the function to trigger the function immediately.
 * @method clear - the function to clear the timeout.
 * @method flushAll - the function to flush all pending debounced events.
 * @property {Debouncer[]} debouncedEvents - an array of all debounced events.
 * @description After creating a debouncer object, start the timeout through the debounced function. Any extra calls to the debounced function within the delay time will reset the timer and the function will only be called after the delay time has passed without any calls. The debouncer can be forced to trigger immediately by calling the trigger function. The debouncer can be cleared by calling the clear function.
 */
export class Debouncer {
  public fn: Function;
  public delay: number;

  static debouncedEvents: Debouncer[] = [];
  private timer: number = 0;
  private context: any | null = null;
  private args: any[] | null = null;

  constructor(fn: Function, delay: number) {
    this.fn = fn;
    this.delay = delay;
  }

  /**
   * Clear the timeout.
   */
  clear = (): void => {
    window.clearTimeout(this.timer);
    this.context = null;
    this.args = null;
    const index: number = Debouncer.debouncedEvents.indexOf(this);
    if (index !== -1) {
      Debouncer.debouncedEvents.splice(index, 1);
    }
  }

  /**
   * Debounce the function.
   * @param {...any} args - arguments to be passed to the function.
   */
  debounced = (...args: any[]): void => {
    this.context = this;
    this.args = args;
    const clearFunc: Function = this.clear;
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.fn.apply(this.context, this.args);
      clearFunc();
    }, this.delay);
    const index: number = Debouncer.debouncedEvents.indexOf(this);
    if (index === -1) {
      Debouncer.debouncedEvents.push(this);
    }
  }

  /**
   * Trigger the function immediately.
   */
  trigger = (): void => {
    if (this.context && this.args) {
      this.fn.apply(this.context, this.args);
    }
    this.clear();
  }

  /**
   * Flush all pending debounced events.
   */
  static flushAll = (): void => {
    Debouncer.debouncedEvents.forEach(debouncer => {
      debouncer.trigger();
    });
  }
}

/**
 * Function for generating a random 16-digit number.
 * @returns {number} - A random number between `10^15` and `10^16 - 1`.
 */
export function randInt(): number {
  const min: number = 1;
  const max: number = Math.pow(10, 16) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Function for limiting a value between a minimum and maximum value.
 * @param {number} value - The value to be limited.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @param {number} defaultValue - The default value.
 * @returns {number} - The limited value.
 */
export function limit(value: number, min: number, max: number, defaultValue: number = 0): number {
  return Math.min(Math.max(value, min), max) || defaultValue;
}
