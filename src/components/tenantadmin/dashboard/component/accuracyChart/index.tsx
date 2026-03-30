import React from "react";
import AppChart from "../appchart";
import {
  getLast30Days,
  getLast7Days,
} from "../../../../../util/reusableFunction";
import { formatDate, statusFormate } from "../../../../../util/oldDashboardUtils";

const AccuracyChart = ({
  selectedValue,
  customDate,
  type,
  series = [],
  yAxisFont1,
  yAxisFont2,
  yAxis1Title,
  yAxis2Title,
  xAxisFontColor,
  LeftYaxisFont,
  rightYaxisFont,
}: any) => {
  const getXAxisData = () => {
    const seriesWithDates = series.find((s: any) => s.plotConfig?.dates);
    if (seriesWithDates) return seriesWithDates.plotConfig.dates;

    if (selectedValue === "custom" && Array.isArray(customDate))
      return customDate.map((d: any) => formatDate(d));
    if (selectedValue === "last_1_month") return getLast30Days();

    return getLast7Days();
  };

  const categories = getXAxisData();

  const getFormatSeries = () => {
    return series.map((s: any) => {
      const { plotConfig, data: rawData } = s;
      let chartData: any[] = [];

      if (!plotConfig) {
        const categorySet = new Set(categories);
        chartData = categories.map((cat: string) => {
          const point = rawData?.find((p: any) => formatDate(p.date) === cat);
          return point ? (point.value ?? 0) : 0;
        });
      } else {
        const { key = "date", value = "value" } = plotConfig;
        chartData = categories.map((cat: string) => {
          const point = rawData?.find(
            (item: any) => formatDate(item[key]) === cat,
          );
          return point ? (point[value] ?? 0) : 0;
        });
      }

      return {
        name: s.name,
        type: s.type === "spline" ? "line" : s.type || "bar",
        data: chartData,
        color: s.color,
        stack: s.stack === "normal" ? "total" : s.stack,
        yAxisIndex: s.yAxis === 1 ? 1 : 0,
        smooth: s.type === "spline",
      };
    });
  };

  const option = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      show: true,
      bottom: 0,
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: categories,
      axisLabel: {
        rotate: -45,
        color: xAxisFontColor,
      },
    },
    yAxis: [
      {
        type: "value",
        name: yAxis1Title,
        min: 0,
        max: 100,
        axisLabel: {
          formatter: "{value}%",
          color: LeftYaxisFont,
          hideOverlap: true,
        },
        splitLine: { show: false },
      },
      {
        type: "value",
        name: yAxis2Title,
        axisLabel: {
          color: rightYaxisFont,
          hideOverlap: true,
        },
        splitLine: { show: false },
      },
    ],
    series: getFormatSeries(),
  };

  return (
    <div className="mt-5 h-[350px]">
      <AppChart option={option} />
    </div>
  );
};

export default AccuracyChart;
