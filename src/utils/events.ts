export class BasicEventEmitter<T extends Record<keyof T, any[]>> {
  private _listeners: Record<keyof T, Set<Function>> = {} as any;

  on<K extends keyof T>(eventName: K, listener: (...args: T[K]) => void): this {
    if (!this._listeners[eventName]) {
      this._listeners[eventName] = new Set();
    }

    this._listeners[eventName].add(listener);
    return this;
  }

  off<K extends keyof T>(
    eventName: K,
    listener: (...args: T[K]) => void,
  ): this {
    this._listeners[eventName]?.delete(listener);
    return this;
  }

  emit<K extends keyof T>(eventName: K, ...args: T[K]) {
    const set = this._listeners[eventName];
    if (!set) {
      return;
    }

    for (const callback of set) {
      callback.apply(this, args);
    }
  }
}
