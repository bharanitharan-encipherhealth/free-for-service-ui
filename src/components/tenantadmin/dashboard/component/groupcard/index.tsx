import React from "react";
import dynamic from "next/dynamic";
const AppChart = dynamic(() => import("../appchart"), { ssr: false });
import ChartHeader from "../chartheader";
import StatCard from "../statChart";

interface ChartItem {
  type: string;
  size: string;
  categories?: any[];
  series?: any[];
  title?: string;
  mainTitle?: string;
  icon?: any;
  value?: string | number;
  bgColor?: any;
  height?: number | string;
  chartBackground?: string;
  customHeader?: any;
  plotConfig?: any;
  backgroundColor?: string;
  textColor?: string;
}

interface GroupCardProps {
  charts: ChartItem[];
  chartType: string;
  dates?: any[];
  stacked?: boolean;
  isShowLine?: boolean;
}

const GroupCard: React.FC<GroupCardProps> = ({ charts, chartType, dates, stacked, isShowLine }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: 20,
        height: "100%",
      }}
    >
      {charts?.map((item, id) => {
        const getColSpan = (cls = "") => {
          const match = cls.split(" ").find((c) => c.startsWith("col-"));
          return match ? +match.replace("col-", "") : 1;
        };

        const getRowSpan = (cls = "") => {
          const match = cls.split(" ").find((c) => c.startsWith("row-"));
          return match ? +match.replace("row-", "") : 1;
        };

        const style = {
          gridColumn: `span ${getColSpan(item.size)}`,
          gridRow: `span ${getRowSpan(item.size)}`,
          height: "100%",
        };

        return (
          <div key={id} style={style}>
            {item.customHeader && (
              <ChartHeader customHeader={item.customHeader} />
            )}
            {item.type === "stat" ? (
              <div>
                <div className="font-medium text-xl">{item.mainTitle}</div>
                <div className="flex justify-center items-center mt-5 pt-4">
                  <StatCard
                    key={item.title}
                    icon={item.icon}
                    title={item.title || ""}
                    value={item.value || 0}
                    bgColor={item.bgColor}
                    padding="16px"
                    minWidth="220px"
                    gap="12px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="10px"
                    height="150px"
                    fontSize="20px"
                    fontWeight={700}
                    textColor={"white"}
                    textAlign={"center"}
                    border="4px solid #B3B3B3"
                  />
                </div>
              </div>
            ) : (
              <AppChart
                type={item.type || chartType}
                categories={item.categories}
                series={item.series}
                height={item.height || "100%"}
                chartBackground={item.chartBackground}
                plotConfig={item.plotConfig}
                backgroundColor={item.backgroundColor}
                textColor={item.textColor}
                dates={dates}
                stacked={stacked}
                isShowLine={isShowLine}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GroupCard;
