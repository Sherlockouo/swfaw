import { create } from "zustand";
// import { getStoreValue, setStoreValue } from "./persist-store";

// 定义用户状态接口
interface State {
  isWorkingTime: boolean;
  updateWorkingTime: () => void;
}

export const useStore = create<State>((set) => ({
  isWorkingTime: true,
  updateWorkingTime: () => {
    const currentTime = Date.now();
    const date = new Date(currentTime);
    const currentHour = date.getHours();
    // 仅在早上8点到晚上10点之间
    const isWorkingTime = currentHour >= 8 && currentHour < 22;
    set({ isWorkingTime });
  },
}));
