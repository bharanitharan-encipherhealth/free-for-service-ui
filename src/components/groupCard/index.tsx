import React from "react";
import dynamic from "next/dynamic";
const AppChart = dynamic(() => import("../appChart"), { ssr: false });
import ChartHeader, { CustomHeader } from "../chartHeader";
import StatCard from "../statCard";

interface ChartItem {
  type: string; // "stat" or chart type
  size?: string; // e.g., "col-6 row-2"
  title?: string;
  mainTitle?: string;
  value?: string | number;
  icon?: string;
  bgColor?: string;
  series?: any[]; // replace with your chart series type
  categories?: any[]; // replace with your chart categories type
  height?: number | string;
  chartBackground?: string;
  customHeader?: CustomHeader;
}

interface GroupCardProps {
  charts: ChartItem[];
  chartType?: string;
  dates?: { startDate?: string; endDate?: string };
}

const GroupCard: React.FC<GroupCardProps> = ({ charts, chartType, dates }) => {
  const getColSpan = (cls = "") => {
    const match = cls.split(" ").find((c) => c.startsWith("col-"));
    return match ? +match.replace("col-", "") : 1;
  };

  const getRowSpan = (cls = "") => {
    const match = cls.split(" ").find((c) => c.startsWith("row-"));
    return match ? +match.replace("row-", "") : 1;
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: 16,
        height: "100%",
      }}
    >
      {charts?.map((item, id) => {
        const style: React.CSSProperties = {
          gridColumn: `span ${getColSpan(item.size)}`,
          gridRow: `span ${getRowSpan(item.size)}`,
          height: "100%",
        };

        return (
          <div key={id} style={style}>
            {item.customHeader && <ChartHeader customHeader={item.customHeader} />}

            {item.type === "stat" ? (
              <div>
                {item.mainTitle && (
                  <div className="fw-medium fs-5">{item.mainTitle}</div>
                )}
                <div className="d-flex justify-content-center align-items-center mt-5 pt-4">
                  <StatCard
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    value={item.value}
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
                    textColor="white"
                    textAlign="center"
                    border="4px solid #B3B3B3"
                  />
                </div>
              </div>
            ) : (
              <AppChart
                key={id}
                type={item.type === "chartType" ? chartType : item.type}
                title={item.title}
                series={item.series || []}
                categories={item.categories || []}
                height={item.height}
                chartBackground={item.chartBackground}
                showLegendBarLine={id === 0 && (item.series?.length || 0) > 1}
                dates={dates}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GroupCard;
