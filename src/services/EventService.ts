import type { GameInternalEvent } from '../types/game';

export class EventService {
  private listeners: Map<string, Array<(event: GameInternalEvent) => void>> = new Map();

  // 订阅事件
  subscribe(eventType: string, callback: (event: GameInternalEvent) => void): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)?.push(callback);
  }

  // 取消订阅
  unsubscribe(eventType: string, callback: (event: GameInternalEvent) => void): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // 发布事件
  publish(event: GameInternalEvent): void {
    const callbacks = this.listeners.get(event.type);
    if (callbacks) {
      callbacks.forEach(callback => callback(event));
    }
  }

  // 清除所有监听器
  clear(): void {
    this.listeners.clear();
  }
}