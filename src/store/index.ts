import { create } from "zustand";
// import { getStoreValue, setStoreValue } from "./persist-store";

// 定义用户状态接口
interface State {
  // unit: minute
  breakDuration: number;
  isWorkingTime: boolean;
  setIsWorkingTime: (value: any) => void;
  updateWorkingTime: () => void;
}

export const useStore = create<State>((set) => ({
  breakDuration: 20,
  isWorkingTime: true,
  updateWorkingTime: () => {
    const currentTime = Date.now();
    const date = new Date(currentTime);
    const currentHour = date.getHours();
    // 仅在早上8点到晚上10点之间
    const isWorkingTime = currentHour >= 8 && currentHour < 22;
    set({ isWorkingTime });
  },
  setIsWorkingTime: (value: boolean) => {
    set({ isWorkingTime: value });
  },
}));
