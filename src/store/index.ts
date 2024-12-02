import { create } from "zustand";
import { getStoreValue, setStoreValue } from "./persist-store";

// 定义用户状态接口
interface State {
  lastInteraction: Date;
  updateLastInteraction: () => void;
}

// 创建 Zustand Store，使用中间件
export const useStore = create<State>((set) => ({
  lastInteraction: new Date(), // 临时初始值
  updateLastInteraction: () => {
    const newDate = new Date();
    set({ lastInteraction: newDate });
    setStoreValue("lastInteraction", newDate);
  },
}));
