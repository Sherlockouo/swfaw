import React, { useState, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import Rest from "@/page/notification/rest";
import { useStore } from "@/store";
import { useConfig } from "@/hooks/useConfig";

export default function Notify() {
  const [lastInteraction, setLastInteraction] = useConfig(
    "lastInteraction",
    Date.now(), // 默认值为 ISO 字符串
    { sync: true },
  );

  // 控制窗口的逻辑
  const focusAndMaximizeWindow = async () => {
    const currentWindow = getCurrentWindow();

    const isVisible = await currentWindow.isVisible();
    const isMaximized = await currentWindow.isMaximized();

    if (!isVisible) {
      await currentWindow.show();
    }

    if (!isMaximized) {
      await currentWindow.maximize();
    }

    // 等待动画完成（如有必要）
    await new Promise((resolve) => setTimeout(resolve, 200));

    await currentWindow.setFocus();
  };

  useEffect(() => {
    focusAndMaximizeWindow().then(() => {
      console.log("focusAndMaximizeWindow on ");
    });
  });
  return (
    <div className="h-screen w-screen">
      <Rest />
    </div>
  );
}
