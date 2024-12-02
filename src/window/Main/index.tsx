import React, { useState, useEffect } from "react";
import Layout from "@/page/layout";
import { useStore } from "@/store";
import { invoke } from "@tauri-apps/api/core";
import { useConfig } from "@/hooks/useConfig";
import { insertOrUpdateLastInteraction } from "@/lib/db";
import { formatDateToYYYYMMDD } from "@/lib/format";
import { eventBus } from "@/lib/event-bus";

export default function Main() {
  const breakInterval = 20 * 60 * 1000; // 20分钟休息一次
  // const breakInterval = 1 * 60 * 1000; // 20分钟休息一次
  // 使用 useConfig 管理 'lastInteraction'，以字符串格式存储和恢复
  const [lastInteraction, setLastInteraction] = useConfig(
    "lastInteraction",
    Date.now(),
    {
      sync: true, // 同步到本地存储
    },
  );

  // 定时检查是否需要显示休息提醒
  useEffect(() => {
    const checkTime = async () => {
      const currentTime = Date.now();

      const date = new Date(currentTime);

      // 获取当前时间的小时
      const currentHour = date.getHours();

      // 仅在早上8点到晚上10点之间执行
      if (currentHour < 8 || currentHour >= 22) {
        console.log("Not in working time range.");
        return; // 如果不在指定时间范围内，直接返回
      }

      const timeSinceLastInteraction = currentTime - lastInteraction;
      if (timeSinceLastInteraction >= breakInterval) {
        await invoke("create_or_show_window", {
          label: "notify", // 窗口标识符
          title: "Stop Working For A While!", // 窗口标题
          width: 1024, // 窗口宽度
          height: 768, // 窗口高度
          show: false, // 窗口是否显示
        });

        const now = Date.now();
        await insertOrUpdateLastInteraction({
          day: formatDateToYYYYMMDD(new Date()),
          created_at: now,
          updated_at: now,
          timestamp: now,
        });
        eventBus.trigger("refresh-last-interaction", now);
        setLastInteraction(Date.now());
      }
    };

    const interval = setInterval(checkTime, 1000); // 每秒检查一次
    return () => clearInterval(interval);
  }, [lastInteraction]);

  return (
    <div className="App h-screen w-screen">
      <Layout />
    </div>
  );
}
