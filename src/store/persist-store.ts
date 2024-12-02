import { Store } from "@tauri-apps/plugin-store";

// 创建一个全局的存储实例，默认使用 'settings.json'
export let store: Store;

// 初始化存储，确保只加载一次
export async function initializeStore(): Promise<Store> {
  if (!store) {
    store = await Store.load("settings.json");
  }
  return store;
}

// 设置存储值
export async function setStoreValue<T>(key: string, value: T): Promise<void> {
  const store = await initializeStore();
  await store.set(key, value);
  await store.save(); // 确保更改被保存到磁盘
}

// 获取存储值
export async function getStoreValue<T>(key: string): Promise<T | null> {
  const store = await initializeStore();
  const value = await store.get(key);
  return value !== undefined ? (value as T) : null; // 明确处理 undefined
}
