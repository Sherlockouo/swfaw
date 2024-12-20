import { useEffect, useState, useCallback } from "react";
import { formatDateToYYYYMMDD, formatTime } from "@/lib/format";
import {
  Card,
  CardHeader,
  CardBody,
  CircularProgress,
  Button,
} from "@nextui-org/react";
import React from "react";
import { getTodayLastInteraction, getTodayRestCounts } from "@/lib/db";
import { LastInteraction } from "@/types/dbt";
import { eventBus } from "@/lib/event-bus";
import { useStore } from "@/store";

const Dashboard: React.FC = React.memo(() => {
  const { breakDuration, isWorkingTime } = useStore();
  const breakInterval = breakDuration * 60 * 1000; // 20分钟休息一次
  const [lastInteraction, updateLastInteraction] = useState(0);
  const [timeLeft, setTimeLeft] = useState(() => breakInterval);

  const [todayRestCount, setTodayRestCount] = useState(0);

  const refreshRestCount = (newRestcount: number) => {
    setTodayRestCount(newRestcount);
  };
  const refreshLastInteraction = (newLastInteraction: number) => {
    updateLastInteraction(newLastInteraction);
  };

  useEffect(() => {
    const l = async () => {
      await eventBus.on("refresh-rest-count", refreshRestCount);
      await eventBus.on("refresh-last-interaction", refreshLastInteraction);
    };

    l();

    const rm = async () => {
      await eventBus.removeAllListeners("refresh-rest-count");
      await eventBus.removeAllListeners("refresh-last-interaction");
    };

    return () => {
      rm();
    };
  }, []);

  // 今日休息次数
  useEffect(() => {
    getTodayRestCounts(formatDateToYYYYMMDD(new Date())).then(
      (restCount: number | null) => {
        console.log("today restcount ", restCount);
        if (restCount === null || restCount === undefined) {
          setTodayRestCount(0);
          return;
        }
        setTodayRestCount(restCount);
      },
    );
    getTodayLastInteraction(formatDateToYYYYMMDD(new Date())).then(
      (lastInteraction: LastInteraction | null) => {
        console.log("last interaction ", lastInteraction);
        if (lastInteraction === null || lastInteraction === undefined) {
          updateLastInteraction(Date.now());
          return;
        }
        updateLastInteraction(lastInteraction.timestamp);
      },
    );
  }, []);

  useEffect(() => {
    if (lastInteraction === 0 || !isWorkingTime) return; // 如果倒计时结束，停止计时

    const timerId = setInterval(() => {
      const timePassed = Date.now() - lastInteraction;
      // toast.info(`Time passed: ${timePassed / 1000}s`);
      setTimeLeft(breakInterval - timePassed);
    }, 1000); // 每秒更新一次

    return () => {
      clearInterval(timerId); // 清除定时器以防止内存泄漏
    };
  }, [lastInteraction, breakInterval]); // 修正依赖项，确保正确更新

  const handleReset = useCallback(() => {
    updateLastInteraction(Date.now());
    setTimeLeft(breakInterval);
  }, [updateLastInteraction, breakInterval]);

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-1 gap-4 m-1">
        <Card className="py-4">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            Time To Next Rest
          </CardHeader>
          <CardBody className="overflow-visible py-2 flex items-center justify-center">
            {isWorkingTime ? (
              <div>
                <CircularProgress
                  aria-label="Time To Next Rest"
                  value={(timeLeft / breakInterval) * 100}
                  color="success"
                  size={"lg"}
                  showValueLabel
                />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <CircularProgress
                  aria-label="NightTime"
                  value={0}
                  color="default"
                  size={"lg"}
                  showValueLabel
                />
                <span className="font-mono">{"NightTime"}</span>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                size={"sm"}
                color={isWorkingTime ? "warning" : "default"}
                onClick={handleReset}
                disabled={!isWorkingTime}
              >
                Reset
              </Button>
              <Button
                size={"sm"}
                color={isWorkingTime ? "danger" : "default"}
                onClick={handleReset}
                disabled={!isWorkingTime}
              >
                Stop
              </Button>
            </div>
          </CardBody>
        </Card>
        <Card className="py-4">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            Today's Rest Times
          </CardHeader>
          <CardBody className="overflow-visible py-2 flex items-center justify-center">
            <div>
              <span className="font-mono">{todayRestCount}</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
});

export default Dashboard;
