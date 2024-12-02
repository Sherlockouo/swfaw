import React, { useState, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

const WindowControls: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const updateMaximizedState = async () => {
      const window = getCurrentWindow();
      setIsMaximized(await window.isMaximized());
    };

    updateMaximizedState();

    // 可以选择添加事件监听器来实时更新状态
    // window.addEventListener('resize', updateMaximizedState);

    return () => {
      // 如果添加了事件监听器，需要在组件卸载时移除
      // window.removeEventListener('resize', updateMaximizedState);
    };
  }, []);

  const handleMinimize = async () => {
    await getCurrentWindow().minimize();
  };

  const handleMaximize = async () => {
    const window = getCurrentWindow();
    if (isMaximized) {
      await window.unmaximize();
    } else {
      await window.maximize();
    }
    setIsMaximized(!isMaximized); // 更新状态
  };

  const handleClose = async () => {
    const window = getCurrentWindow();
    await window.close();
  };

  return (
    <div className="window-controls">
      <button onClick={handleClose}>x</button>
      <button onClick={handleMinimize}>-</button>
      <button onClick={handleMaximize}>{isMaximized ? "□" : "◻"}</button>
    </div>
  );
};

export default WindowControls;
