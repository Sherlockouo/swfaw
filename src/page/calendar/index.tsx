import HeatMap from "@uiw/react-heat-map";
import { Tooltip } from "@nextui-org/tooltip";
import { useEffect, useState } from "react";
import { getRestCountsForYear } from "@/lib/db";
import { YearRestCount } from "@/types/rest";
import { Spacer } from "@nextui-org/react";

const CustomCalendar = () => {
  const [year] = useState(new Date().getFullYear());
  const [value, setValue] = useState<YearRestCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restCounts = async () => {
      setLoading(true); // 设置加载状态
      const res = await getRestCountsForYear(year);
      setValue(res);
      setLoading(false); // 数据加载完成
    };

    restCounts();
  }, [year]); // 确保在年份改变时重新加载数据
  return (
    <div className="w-full flex flex-col justify-center">
      <div className="flex justify-center mb-2">
        {/* TODO: 支持多语言  */}
        <span className="text-lg font-bold">{year} Rest Count</span>
      </div>
      <div className="">
        {loading ? (
          <Spacer className="w-full h-[700px]"></Spacer>
        ) : (
          <HeatMap
            className="w-full h-[700px]"
            rectSize={20}
            value={value}
            weekLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
            monthLabels={[
              "",
              "Jan",
              "",
              "Mar",
              "",
              "May",
              "",
              "Jul",
              "",
              "Sep",
              "",
              "Nov",
              "",
              "Dec",
              "",
            ]}
            startDate={new Date(`${year}-01-01`)}
            endDate={new Date(`${year}-12-31`)}
            rectProps={{
              rx: 4,
            }}
            rectRender={(props, data) => {
              // if (!data.count) return <rect {...props} />;
              return (
                <Tooltip
                  content={`count: ${data.count || 0}`}
                  delay={0}
                  motionProps={{
                    variants: {
                      exit: {
                        opacity: 0,
                        transition: {
                          duration: 0.1,
                          ease: "easeIn",
                        },
                      },
                      enter: {
                        opacity: 1,
                        transition: {
                          duration: 0.15,
                          ease: "easeOut",
                        },
                      },
                    },
                  }}
                >
                  <rect {...props} />
                </Tooltip>
              );
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CustomCalendar;
