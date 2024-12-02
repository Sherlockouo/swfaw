import { useCallback, useEffect } from "react";
import { listen, emit } from "@tauri-apps/api/event";
import { useGetState } from "./useGetState"; // 自定义 Hook，假设它返回 [state, setState, getState]
import { store } from "@/store/persist-store"; // 假设这是一个封装过的 store 实例
import debounce from "./debounce"; // 防抖函数

export const useConfig = <T>(
  key: string,
  defaultValue: T,
  options: { sync?: boolean } = {},
) => {
  const [property, setPropertyState, getProperty] = useGetState(defaultValue);
  const { sync = true } = options;

  // 同步到Store (State -> Store)
  const syncToStore = useCallback(
    debounce((v: any) => {
      store.set(key, v);
      store.save();
      let eventKey = key.replaceAll(".", "_").replaceAll("@", ":");
      emit(`${eventKey}_changed`, v);
    }, 300), // 假设防抖时间为 300ms
    [key],
  );

  // 同步到State (Store -> State)
  const syncToState = useCallback(
    (v: any) => {
      if (v !== null) {
        setPropertyState(v);
      } else {
        store.get(key).then((storedValue) => {
          if (storedValue === null || storedValue === undefined) {
            setPropertyState(defaultValue);
            store.set(key, defaultValue);
            store.save();
          } else {
            setPropertyState(storedValue);
          }
        });
      }
    },
    [key, defaultValue, setPropertyState],
  );

  const setProperty = useCallback(
    (v: any, forceSync = false) => {
      setPropertyState(v);
      const isSync = forceSync || sync;
      if (isSync) {
        syncToStore(v);
      }
    },
    [sync, syncToStore, setPropertyState],
  );

  // 初始化
  useEffect(() => {
    syncToState(null);
    const eventKey = key.replaceAll(".", "_").replaceAll("@", ":");
    const unlistenPromise = listen(`${eventKey}_changed`, (e) => {
      syncToState(e.payload);
    });

    return () => {
      unlistenPromise.then((unlisten) => {
        unlisten();
      });
    };
  }, [key, syncToState]);

  return [property, setProperty, getProperty];
};

export const deleteKey = async (key: string) => {
  try {
    const exists = await store.has(key);
    if (exists) {
      await store.delete(key);
      await store.save();
    }
  } catch (error) {
    console.error("Error deleting key:", error);
  }
};
