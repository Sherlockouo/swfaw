import React, { useState, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Button, Image } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";

export default function Main() {
  const breakInterval = 60 * 1000; // 25分钟休息间隔
  const [showOverlay, setShowOverlay] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [timeToNextBreak, setTimeToNextBreak] = useState(breakInterval);

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

  // 定时检查是否需要显示休息提醒
  useEffect(() => {
    const checkTime = async () => {
      const currentTime = Date.now();
      const timeSinceLastInteraction = currentTime - lastInteraction;

      if (timeSinceLastInteraction >= breakInterval) {
        setShowOverlay(true);
        await focusAndMaximizeWindow();
      }
    };

    const interval = setInterval(checkTime, 1000); // 每秒检查一次
    return () => clearInterval(interval);
  }, [lastInteraction]);

  // 实时更新距离下一次休息的倒计时
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastInteraction = currentTime - lastInteraction;
      const remainingTime = Math.max(
        breakInterval - timeSinceLastInteraction,
        0,
      );
      console.log("remain", remainingTime);
      setTimeToNextBreak(remainingTime);
    }, 1000); // 每秒更新一次倒计时

    return () => clearInterval(countdownInterval);
  }, [lastInteraction]);

  // 关闭休息提醒
  const handleCloseOverlay = async () => {
    setShowOverlay(false);
    setLastInteraction(Date.now()); // 重置最后交互时间

    const currentWindow = getCurrentWindow();
    await currentWindow.hide();
  };

  // 格式化倒计时为 mm:ss
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 1000 / 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="App h-screen w-screen">
      {showOverlay ? (
        // 休息提醒界面
        <div className="fixed inset-0 bg-green-200 flex justify-center items-center z-50">
          <Button
            color="success"
            onClick={handleCloseOverlay}
            className=" p-4 rounded-md shadow"
          >
            Take a Break
          </Button>
        </div>
      ) : (
        // 正常工作界面
        <div className="flex flex-col justify-center items-center h-screen">
          <h1 className="text-2xl font-bold">Stop working for a while?</h1>
          <p className="mt-4 text-lg">
            Time to next break:{" "}
            <span className="font-mono">{formatTime(timeToNextBreak)}</span>
          </p>
          <CircularProgress
            value={timeToNextBreak / breakInterval * 100}
            color="success"
            size="lg"
            showValueLabel
          />

          <Image
            isBlurred
            width={240}
            src="https://nextui.org/images/album-cover.png"
            alt="NextUI Album Cover"
            className="m-5"
          />
        </div>
      )}
    </div>
  );
}
