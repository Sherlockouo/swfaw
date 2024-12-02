import {
  listen as tauriListen,
  emit as tauriEmit,
  UnlistenFn,
} from "@tauri-apps/api/event";

class EventBus {
  private listeners: Map<string, UnlistenFn[]> = new Map();

  // 注册事件监听器
  async on(eventName: string, callback: (payload: any) => void) {
    // 改名为 on
    try {
      const unlisten = await tauriListen(eventName, (event) => {
        callback(event.payload);
      });

      if (!this.listeners.has(eventName)) {
        this.listeners.set(eventName, []);
      }
      this.listeners.get(eventName)?.push(unlisten);
    } catch (error) {
      console.error(`Failed to listen to event "${eventName}":`, error);
    }
  }

  // 触发事件
  async trigger(eventName: string, data: any) {
    try {
      await tauriEmit(eventName, data);
    } catch (error) {
      console.error(`Failed to emit event "${eventName}":`, error);
    }
  }

  // 移除指定事件的所有监听器
  async removeAllListeners(eventName: string) {
    const unlistenFns = this.listeners.get(eventName);
    if (unlistenFns) {
      for (const unlisten of unlistenFns) {
        try {
          unlisten();
        } catch (error) {
          console.error(`Failed to unlisten event "${eventName}":`, error);
        }
      }
      this.listeners.delete(eventName);
    }
  }
}

export default EventBus;

// 创建事件总线实例
export const eventBus = new EventBus();
