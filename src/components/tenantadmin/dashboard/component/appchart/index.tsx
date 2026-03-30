"use client"
import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import ChartHeader from "../chartheader";
import { Button, Modal } from "antd";
import styles from "./style.module.css";
import {
  formatValues,
  statusFormate,
  getChartTimeLine,
} from "@/util/reusableFunction";
import { useWindowWidth } from "../function";
import { toFixedNum } from "../function";
import CardSkeleton from "@/components/skeleton/card";

// ECharts core imports (modular)
import * as echarts from "echarts/core";
import { LineChart, BarChart, PieChart, GaugeChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  CanvasRenderer,
]);

const ReactECharts = dynamic(() => import("echarts-for-react/lib/core"), {
  ssr: false,
});

export interface SeriesItem {
  name?: string;
  status?: string;
  type?: string;
  data?: any[];
  plotConfig?: {
    dates: string[];
    key?: string;
    value?: string;
  };
  itemStyle?: {
    borderRadius?: number | number[];
    color?: string | ((params: any) => string);
  };
  color?: string;
  value?: number;
  title?: string;
  width?: number;
  shadowColor?: string;
  fontSize?: number;
  emphasis?: any;
  label?: any;
  stack?: string;
}

export interface AppChartProps {
  type?: string;
  title?: string;
  categories?: any[];
  series?: SeriesItem[];
  stacked?: boolean;
  height?: number | string;
  showLegend?: boolean;
  showLegendBarLine?: boolean;
  legendData?: any[];
  radius?: any;
  showLabel?: boolean;
  xAxisRotated?: boolean;
  toolTipColor?: string;
  chartBackground?: string;
  customHeader?: any;
  isOrgModalOpen?: boolean;
  showModal?: any;
  handleOk?: any;
  handleCancel?: any;
  xAxisInterval?: number;
  plotConfig?: any;
  isDailyChart?: boolean;
  total?: number;
  isShowLine?: boolean;
}

const AppChart: React.FC<AppChartProps> = ({
  type = "line",
  title,
  categories = [],
  series = [],
  stacked = false,
  height = 250,
  showLegend = true,
  showLegendBarLine = false,
  legendData,
  showLabel = false,
  xAxisRotated = false,
  toolTipColor,
  chartBackground = "#fff",
  customHeader,
  isOrgModalOpen,
  showModal,
  handleOk,
  handleCancel,
  isDailyChart = false,
  total,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const windowWidth = useWindowWidth();

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const formattedSeries = useMemo(() => {
    return series.map((item) => {
      const name = item.name || item.status;
      if (name) {
        return { ...item, name: statusFormate(name) };
      } else {
        return item;
      }
    });
  }, [series]);

  const formattedCategories = useMemo(() => {
    return categories?.map((item) => item && statusFormate(item));
  }, [categories]);

  const getTextStyleWidth = (t: string, daily: boolean, width: number | null) => {
    if (!width) return 0;
    if (t === "name") {
      if (daily) {
        if (width > 1500) return 50;
        if (width > 1290) return 50;
        return 40;
      } else {
        return width < 1290 ? 5 : 80;
      }
    }
    if (t === "value") {
      if (daily) {
        if (width > 1500) return 40;
        if (width > 1290) return 30;
        return 40;
      } else {
        return width < 1290 ? 120 : 45;
      }
    }
    return 0;
  };

  const getRadius = (daily: boolean, width: number | null) => {
    if (!width) return ["60%", "70%"];
    if (daily && width < 1290) {
      return ["30%", "40%"];
    } else if (daily && width < 1540) {
      return ["32%", "42%"];
    } else if (width < 1290 || daily) {
      return ["33%", "43%"];
    }
    return ["60%", "70%"];
  };

  const getCenter = (daily: boolean, width: number | null, len: number) => {
    if (!width) return ["25%", "50%"];
    if (daily && width < 1540) {
      return ["25%", "50%"];
    }
    if (width < 1290) {
      return ["17%", "50%"];
    }
    if (len > 6) {
      return width > 1290 ? ["25%", "50%"] : ["35%", "50%"];
    }
    return width > 1290 ? ["25%", "50%"] : ["40%", "50%"];
  };

  const getChartOptions = () => {
    let extraOptions: any = {};
    const currentWindowWidth = windowWidth;

    const seriesDataArr = formattedSeries.map((item, index) => {
      const mappedData = item?.plotConfig
        ? formatValues(
          getChartTimeLine(item?.data, item?.plotConfig),
          item?.plotConfig.dates,
        )
        : item.data;

      return {
        ...item,
        data: mappedData,
        type: "bar",
        stack: stacked ? "total" : undefined,
        itemStyle: {
          ...item.itemStyle,
          borderRadius: stacked
            ? index === formattedSeries.length - 1
              ? [20, 20, 0, 0]
              : 0
            : [20, 20, 0, 0],
        },
        label: { show: false },
        emphasis: { label: { show: false } },
      }
    });

    switch (type) {
      case "bar":
        extraOptions = {
          series: seriesDataArr,
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: { backgroundColor: toolTipColor || "gray" },
            },
          },
          legend: {
            show: true,
            bottom: 10,
            left: "center",
            itemGap: 20,
            textStyle: { fontSize: 12, color: "#333" },
          },
          grid: { top: 20, left: 0, right: 0, bottom: 40, containLabel: true },
          xAxis: {
            type: "category",
            data: formattedCategories || formattedSeries.map((s) => s.name),
            axisLabel: {
              interval: "auto",
              rotate: xAxisRotated ? 25 : 0,
              hideOverlap: true,
              formatter: function (value: string) {
                if (typeof value === "string" && value.includes("-")) {
                  const parts = value.split("-");
                  return parts.length === 3 ? `${parts[1]}-${parts[2]}` : value;
                }
                const truncateSize = (currentWindowWidth || 0) < 1290 ? 10 : 12;
                return value.length > truncateSize ? value.slice(0, truncateSize) + "..." : value;
              },
              margin: 12,
            },
          },
          yAxis: { type: "value", axisLabel: { rotate: 0 } },
        };
        break;

      case "stepline":
        extraOptions = {
          series: formattedSeries.map((item) => ({
            name: item.name,
            type: "line",
            data: item?.plotConfig
              ? formatValues(
                getChartTimeLine(item?.data, item?.plotConfig),
                item?.plotConfig.dates,
              )
              : item.data,
            step: "middle",
            stack: stacked ? "total" : undefined,
            lineStyle: { color: item.color },
            itemStyle: { color: item.color },
          })),
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: { type: "cross", label: { backgroundColor: toolTipColor || "gray" } },
          },
          legend: { show: showLegendBarLine, selectedMode: false },
          xAxis: {
            type: "category",
            data: formattedCategories || formattedSeries.map((s) => s.name),
            axisLabel: {
              interval: "auto",
              rotate: xAxisRotated ? 25 : 0,
              hideOverlap: true,
              formatter: (v: string) => v,
              margin: 12,
            },
          },
          yAxis: { type: "value" },
        };
        break;

      case "area":
      case "line":
        extraOptions = {
          series: formattedSeries.map((item) => ({
            name: item.name,
            type: "line",
            data: item?.plotConfig
              ? formatValues(
                getChartTimeLine(item?.data, item?.plotConfig),
                item?.plotConfig.dates,
              )
              : item.data,
            smooth: true,
            areaStyle: type === "area" ? {} : undefined,
            lineStyle: { color: item.color },
            itemStyle: { color: item.color },
          })),
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: { type: "cross", label: { backgroundColor: toolTipColor || "gray" } },
          },
          legend: { show: showLegendBarLine, selectedMode: false },
          xAxis: {
            type: "category",
            data: formattedCategories || formattedSeries.map((s) => s.name),
            axisLabel: {
              interval: "auto",
              rotate: xAxisRotated ? 25 : 0,
              hideOverlap: true,
              formatter: function (value: string) {
                if (typeof value === "string" && value.includes("-")) {
                  const parts = value.split("-");
                  return parts.length === 3 ? `${parts[1]}-${parts[2]}` : value;
                }
                return value;
              },
              margin: 12,
            },
          },
          yAxis: { type: "value" },
        };
        break;

      case "donut":
        extraOptions = {
          tooltip: { trigger: "item", formatter: "{b}: {c}" },
          legend: {
            selectedMode: true,
            orient: "vertical",
            right: 10,
            top: "middle",
            itemWidth: 6,
            itemHeight: 6,
            icon: "circle",
            formatter: (name: string) => {
              const item = formattedSeries.find((s) => s.name === name);
              if (!item) return name;
              const truncateSize = (currentWindowWidth || 0) < 1290 ? 10 : 12;
              const truncatedName = (item.name || "").length > truncateSize ? (item.name || "").slice(0, truncateSize) + "..." : (item.name || "");
              return `{name|${isDailyChart ? truncatedName : name}} {value|${item.value}}`;
            },
            textStyle: {
              rich: {
                name: {
                  width: getTextStyleWidth("name", isDailyChart, currentWindowWidth),
                  align: "left",
                  fontSize: 11,
                  padding: [0, 5, 0, 0],
                },
                value: {
                  width: getTextStyleWidth("value", isDailyChart, currentWindowWidth),
                  align: "right",
                  fontSize: 10,
                  fontWeight: 800,
                },
              },
            },
          },
          series: [
            {
              name: title,
              type: "pie",
              radius: getRadius(isDailyChart, currentWindowWidth),
              center: getCenter(isDailyChart, currentWindowWidth, formattedSeries.length),
              avoidLabelOverlap: false,
              label: {
                show: true,
                position: "center",
                formatter: () => {
                  const sumTotal = total ?? formattedSeries.reduce((sum, item) => sum + (item.value || 0), 0);
                  return `{value|${sumTotal}}\n{label|Total}`;
                },
                rich: {
                  value: { fontSize: 18, fontWeight: "bold", color: "#333" },
                  label: { fontSize: 12, color: "#666" },
                },
              },
              labelLine: { show: false },
              data: formattedSeries.map((item) => ({
                value: toFixedNum(item.value || 0, 2),
                name: `${item.name}`,
                itemStyle: { color: item.color },
              })),
            },
          ],
        };
        break;

      case "gauge":
        extraOptions = {
          title: {
            text: title || "",
            left: "center",
            top: "5%",
            textStyle: { fontSize: 45, fontWeight: "bold" },
          },
          tooltip: { formatter: "{a}: {c}" },
          series: formattedSeries.map((item, index) => ({
            name: item.title || `Metric ${index + 1}`,
            type: "gauge",
            min: 0,
            max: 100,
            progress: {
              show: (item.value || 0) > 0,
              roundCap: true,
              width: item.width || 10,
              itemStyle: {
                color: item.color || "pink",
                shadowBlur: 5,
                shadowColor: item.shadowColor || "red",
              },
            },
            detail: {
              show: true,
              formatter: (v: number) => v.toFixed(2),
              fontSize: item.fontSize || 32,
              offsetCenter: [0, 0],
            },
            pointer: { show: false },
            axisLine: { roundCap: true, lineStyle: { width: item.width || 10 } },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: {
              show: true,
              distance: -40,
              fontSize: 12,
              formatter: (v: number) => (v === 0 || v === 100 ? v.toString() : ""),
            },
            data: [{ value: (item.value || 0) > 0 ? toFixedNum(item.value || 0, 2) : 0, name: "" }],
          })),
        };
        break;

      default:
        extraOptions = {
          series: formattedSeries.map((item) => ({
            name: item.name,
            type: "line",
            data: item.data,
            itemStyle: { color: item.color },
          })),
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: { type: "cross", label: { backgroundColor: toolTipColor || "gray" } },
          },
        };
    }

    return {
      title: title && type !== "gauge" ? { text: title, left: "start", textStyle: { fontSize: 16 } } : undefined,
      tooltip: { trigger: type === "donut" ? "item" : "axis" },
      legend: showLegend && type !== "donut" && type !== "gauge" ? {} : undefined,
      grid: type !== "donut" && type !== "gauge" ? { left: "3%", right: "3%", bottom: "10%", containLabel: true } : undefined,
      xAxis: type !== "donut" && type !== "gauge" ? { type: "category", data: formattedCategories } : undefined,
      yAxis: type !== "donut" && type !== "gauge" ? { type: "value" } : undefined,
      ...extraOptions,
    };
  };

  const option = useMemo(() => getChartOptions(), [
    type, title, formattedCategories, formattedSeries, stacked, showLegend, showLegendBarLine,
    toolTipColor, isDailyChart, total, windowWidth
  ]);

  return (
    <>
      <div className="rounded pt-2" style={{ background: chartBackground || "#fff" }} ref={containerRef}>
        {customHeader && <ChartHeader customHeader={customHeader} />}
        {isInView ? (
          <ReactECharts echarts={echarts} option={option} style={{ height }} />
        ) : (
          <div style={{ height }}>
            <CardSkeleton count={1} height={Number(height)} />
          </div>
        )}
      </div>
      {showLabel && (
        <div className="flex mx-4">
          <div className="flex justify-between w-full">
            <div className={styles.bulletsDiv} style={{ height: "160px" }}>
              {(legendData?.length ? legendData : formattedSeries)?.map((item: any) => (
                <div key={item.name} className={styles.container}>
                  <div className="flex w-full">
                    <div className={styles.bgColor} style={{ backgroundColor: item?.itemStyle?.color || item.color }}></div>
                    <span className={styles.userNameTitle}>{item.name}</span>
                  </div>
                </div>
              ))}
            </div>
            {(legendData?.length || formattedSeries.length) > 5 && (
              <div className="flex justify-end">
                <Button type="link" onClick={showModal}>view all</Button>
              </div>
            )}
          </div>
        </div>
      )}
      <Modal title="Organizations" open={isOrgModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <div style={{ height: "500px", overflow: "auto" }}>
          {(legendData?.length ? legendData : formattedSeries)?.map((item: any) => (
            <div className={styles.container} key={item.name}>
              <div className="flex w-full">
                <div className={styles.bgColor} style={{ backgroundColor: item?.itemStyle?.color || item.color }}></div>
                <span className={styles.userNameTitle}>{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default AppChart;
