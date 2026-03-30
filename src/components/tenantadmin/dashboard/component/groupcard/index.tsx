import React from "react";
import dynamic from "next/dynamic";
import ChartHeader from "../chartheader";
import StatCard from "../statChart";

const AppChart = dynamic(() => import("../appchart"), { ssr: false });

interface ChartItem {
  size?: string;
  customHeader?: any;
  type?: string;
  mainTitle?: string;
  icon?: any;
  title?: string;
  value?: string | number;
  bgColor?: string;
  series?: any[];
  categories?: any[];
  height?: number | string;
  chartBackground?: string;
}

interface GroupCardProps {
  charts?: ChartItem[];
  chartType?: string;
  dates?: any[];
  stacked?: boolean;
  isShowLine?: boolean;
}

const GroupCard: React.FC<GroupCardProps> = ({ charts = [], chartType, dates, stacked, isShowLine }) => {
  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      {charts.map((item, id) => {
        const getColSpan = (cls: string = "") => {
          const match = cls.split(" ").find((c) => c.startsWith("col-"));
          return match ? +match.replace("col-", "") : 1;
        };

        const getRowSpan = (cls: string = "") => {
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
                type={item.type === "chartType" ? chartType : item.type}
                title={item.title}
                series={item.series}
                categories={item.categories}
                height={item?.height}
                chartBackground={item?.chartBackground}
                showLegendBarLine={
                  id === 0 && (item.series?.length || 0) > 1
                }
                stacked={!!stacked}
                isShowLine={!!isShowLine}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GroupCard;
