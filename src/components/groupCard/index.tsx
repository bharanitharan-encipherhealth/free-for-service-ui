"use client";

import React from "react";
import dynamic from "next/dynamic";

import ChartHeader from "../chartHeader";
// import StatCard from "../statChart";

/* =========================
   Dynamic chart import
========================= */

const AppChart = dynamic(() => import("../appChart"), {
  ssr: false,
});

/* =========================
   TYPES
========================= */

export interface ChartSeries {
  name: string;
  data: any[];
  color?: string;
  area?: boolean;
  step?: string;
  plotConfig?: {
    key: string;
    value: string;
    dates?: string[];
  };
}

export interface CustomHeader {
  label?: string;
  header?: string;
  value?: string | number;
}

export interface GroupChartItem {
  type: "stat" | "bar" | "line" | "area" | "donut" | "pie" | "stepline";
  size: string;

  // chart
  series?: ChartSeries[];
  categories?: string[];
  height?: number;
  chartBackground?: string;
  title?: string;

  // stat card
  mainTitle?: string;
  icon?: React.ReactNode;
  value?: string | number;
  bgColor?: string;

  customHeader?: CustomHeader;
}

export interface GroupCardProps {
  charts: GroupChartItem[];
  chartType?: string;
  dates?: string[];
}

/* =========================
   COMPONENT
========================= */

const GroupCard: React.FC<GroupCardProps> = ({
  charts = [],
  chartType,
  dates,
}) => {
  const getColSpan = (cls = ""): number => {
    const match = cls.split(" ").find((c) => c.startsWith("col-"));
    return match ? Number(match.replace("col-", "")) : 1;
  };

  const getRowSpan = (cls = ""): number => {
    const match = cls.split(" ").find((c) => c.startsWith("row-"));
    return match ? Number(match.replace("row-", "")) : 1;
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
      {charts.map((item, index) => {
        const style: React.CSSProperties = {
          gridColumn: `span ${getColSpan(item.size)}`,
          gridRow: `span ${getRowSpan(item.size)}`,
          height: "100%",
        };

        return (
          <div key={index} style={style}>
            {item.customHeader && (
              <ChartHeader customHeader={item.customHeader} />
            )}

            {item.type === "stat" ? (
              <div>
                {item.mainTitle && (
                  <div className="fw-medium fs-5">{item.mainTitle}</div>
                )}

                <div className="d-flex justify-content-center align-items-center mt-5 pt-4">
                  <StatCard
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
                type={item.type === "chartType" ? chartType : item.type}
                title={item.title}
                series={item.series || []}
                categories={item.categories}
                height={item.height}
                chartBackground={item.chartBackground}
                showLegendBarLine={
                  index === 0 && (item.series?.length || 0) > 1
                }
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
