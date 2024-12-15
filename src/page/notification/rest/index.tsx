import {
  getTodayRestCounts,
  insertOrUpdateLastInteraction,
  insertOrUpdateRestCount,
} from "@/lib/db";
import { Button, Image } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import { formatDateToYYYYMMDD } from "@/lib/format";
import { eventBus } from "@/lib/event-bus";

export default function Rest() {
  const breakDuration = 20; // 注意力放到远处 20 s
  const [restTime, setRestTime] = useState(0);
  const [todayRestCount, setTodayRestCount] = useState(0);
  useEffect(() => {
    getTodayRestCounts(formatDateToYYYYMMDD(new Date())).then(
      (restCount: number | null) => {
        if (restCount === null) {
          setTodayRestCount(0);
          return;
        }
        setTodayRestCount(restCount);
      },
    );
  }, []);

  useEffect(() => {
    if (restTime >= breakDuration) return; // 如果倒计时结束，停止计时

    const timerId = setInterval(() => {
      setRestTime((prevTime) => prevTime + 1);
      console.log("time", restTime);
    }, 1000); // 每秒更新一次

    return () => {
      clearInterval(timerId); // 清除定时器以防止内存泄漏
      setRestTime(0);
    };
  }, []);

  // 关闭休息提醒
  const handleCloseOverlay = async () => {
    const now = Date.now();
    await insertOrUpdateRestCount({
      duration: restTime,
      day: formatDateToYYYYMMDD(new Date()),
      created_at: now,
      updated_at: now,
    });
    setTodayRestCount(todayRestCount + 1);
    eventBus.trigger("refresh-rest-count", todayRestCount + 1);
    await insertOrUpdateLastInteraction({
      day: formatDateToYYYYMMDD(new Date()),
      created_at: now,
      updated_at: now,
      timestamp: now,
    });
    eventBus.trigger("refresh-last-interaction", now);

    const currentWindow = getCurrentWindow();
    await currentWindow.close();
  };

  return (
    <div className=" bg-black flex flex-col justify-center items-center h-screen w-screen">
      <Image
        isZoomed
        isBlurred
        width={280}
        src="https://nextui.org/images/album-cover.png"
        alt="NextUI Album Cover"
        className="m-1 "
      />

      <CircularProgress
        aria-label="Rest progress"
        value={(restTime / breakDuration) * 100}
        color="success"
        size={"lg"}
        showValueLabel
      />
      <div className="text-center text-lg font-bold text-yellow-500">
        向远处看20s
      </div>

      <div className=" flex flex-col justify-center items-center z-50">
        <Button
          aria-label="Close notification"
          color="warning"
          onClick={handleCloseOverlay}
          className=" p-4 rounded-md shadow"
        >
          Done
        </Button>
      </div>
    </div>
  );
}
