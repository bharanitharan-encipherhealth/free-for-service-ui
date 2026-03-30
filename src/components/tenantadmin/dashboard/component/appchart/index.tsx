import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import ChartHeader from "../chartheader";
import { Button, Modal } from "antd";
import styles from "./style.module.css";
import {
  formatValues,
  getChartTimeLine,
  statusFormate,
  useWindowWidth,
  toFixedNum,
} from "../../../../../util/oldDashboardUtils";
import CardSkeleton from "../../../../skeleton/card";

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

interface AppChartProps {
  type?: string;
  title?: string;
  categories?: any[];
  series?: any[];
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
  showModal?: () => void;
  handleOk?: () => void;
  handleCancel?: () => void;
  xAxisInterval?: number;
  plotConfig?: any;
  isDailyChart?: boolean;
  total?: number | string;
  isShowLine?: boolean;
  option?: any;
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
  radius,
  showLabel = false,
  xAxisRotated = false,
  toolTipColor,
  chartBackground = "#fff",
  customHeader,
  isOrgModalOpen,
  showModal = () => {},
  handleOk = () => {},
  handleCancel = () => {},
  xAxisInterval = 0,
  plotConfig,
  isDailyChart = false,
  total,
  isShowLine,
  option,
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

  const processedSeries = (series || []).map((item) => {
    if (item.name) {
      return { ...item, name: statusFormate(item.name) };
    } else {
      return item;
    }
  });

  const processedCategories = categories?.map((item) => item && statusFormate(item));

  const getTextStyleWidth = (itemType: "name" | "value", daily: boolean, width: number, seriesLength: number) => {
    if (itemType === "name") {
      if (daily) {
        if (width > 1500) return 50;
        if (width > 1290) return 50;
        return 40;
      } else {
        return width < 1290 ? 5 : 80;
      }
    }

    if (itemType === "value") {
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

  const getRadius = (daily: boolean, width: number) => {
    if (daily && width < 1290) {
      return ["30%", "40%"];
    } else if (daily && width < 1540) {
      return ["32%", "42%"];
    } else if (width < 1290 || daily) {
      return ["33%", "43%"];
    }
    return ["60%", "70%"];
  };

  const getCenter = (daily: boolean, width: number, seriesLength: number) => {
    if (daily && width < 1540) {
      return ["25%", "50%"];
    }

    if (width < 1290) {
      return ["17%", "50%"];
    }

    if (seriesLength > 6) {
      return width > 1290 ? ["25%", "50%"] : ["35%", "50%"];
    }

    return width > 1290 ? ["25%", "50%"] : ["40%", "50%"];
  };

  const getChartOptions = () => {
    let chartType = type;
    let extraOptions: any = {};
    const width = windowWidth || 0;
    const seriesLength = processedSeries.length;

    switch (type) {
      case "bar":
        chartType = "bar";
        extraOptions = {
          series: processedSeries.map((item, index) => {
            return {
              ...item,
              data: item?.plotConfig
                ? formatValues(
                    getChartTimeLine(item?.data, item?.plotConfig),
                    item?.plotConfig.dates,
                  )
                : item.data,
              type: chartType,
              stack: stacked ? "total" : undefined,
              itemStyle: {
                ...item.itemStyle,
                borderRadius: stacked
                  ? index === processedSeries.length - 1
                    ? [20, 20, 0, 0]
                    : 0
                  : [20, 20, 0, 0],
              },
              label: { show: false },
              emphasis: { label: { show: false } },
            };
          }),
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
          grid: {
            top: 20,
            left: "8%",
            right: "5%",
            bottom: 40,
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: processedCategories || processedSeries.map((s) => s.name),
            axisLabel: {
              interval: "auto",
              rotate: xAxisRotated ? 25 : 0,
              hideOverlap: true,
              formatter: function (value: any) {
                if (typeof value === "string" && value.includes("-")) {
                  const parts = value.split("-");
                  return parts.length === 3 ? `${parts[1]}-${parts[2]}` : value;
                }
                const truncateSize = width < 1290 ? 10 : 12;
                const strValue = String(value);
                const truncatedName =
                  strValue.length > truncateSize
                    ? strValue.slice(0, truncateSize) + "..."
                    : strValue;
                return truncatedName;
              },
              margin: 12,
            },
          },
          yAxis: {
            type: "value",
            axisLabel: { rotate: 0, hideOverlap: true },
            splitNumber: 4,
          },
        };
        break;

      case "stepline":
        chartType = "line";
        extraOptions = {
          series: processedSeries.map((item) => ({
            name: item.name,
            type: chartType,
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
            axisPointer: {
              type: "cross",
              label: { backgroundColor: toolTipColor || "gray" },
            },
          },
          legend: {
            show: showLegendBarLine,
            selectedMode: false,
          },
          xAxis: {
            type: "category",
            data: processedCategories || processedSeries.map((s) => s.name),
            axisLabel: {
              interval: "auto",
              rotate: xAxisRotated ? 25 : 0,
              hideOverlap: true,
              formatter: function (value: any) {
                if (typeof value === "string" && value.includes("-")) {
                  const parts = value.split("-");
                  return parts.length === 3 ? `${parts[1]}-${parts[2]}` : value;
                }
                return value;
              },
              margin: 12,
            },
          },
          yAxis: {
            type: "value",
            axisLabel: { rotate: 0, hideOverlap: true },
            splitNumber: 4,
          },
        };
        break;

      case "area":
        chartType = "line";
        extraOptions = {
          series: processedSeries.map((item) => ({
            name: item.name,
            type: chartType,
            data: item?.plotConfig
              ? formatValues(
                  getChartTimeLine(item?.data, item?.plotConfig),
                  item?.plotConfig.dates,
                )
              : item.data,
            smooth: true,
            areaStyle: {},
            lineStyle: { color: item.color },
            itemStyle: { color: item.color },
          })),
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: { backgroundColor: toolTipColor || "gray" },
            },
          },
          legend: {
            show: showLegendBarLine,
            selectedMode: false,
          },
          xAxis: {
            type: "category",
            data: processedCategories || processedSeries.map((s) => s.name),
            axisLabel: {
              interval: "auto",
              rotate: xAxisRotated ? 25 : 0,
              hideOverlap: true,
              formatter: function (value: any) {
                if (typeof value === "string" && value.includes("-")) {
                  const parts = value.split("-");
                  return parts.length === 3 ? `${parts[1]}-${parts[2]}` : value;
                }
                return value;
              },
              margin: 12,
            },
          },
          yAxis: {
            type: "value",
            axisLabel: { rotate: 0, hideOverlap: true },
            splitNumber: 4,
          },
        };
        break;

      case "line":
        chartType = "line";
        extraOptions = {
          series: processedSeries.map((item) => ({
            name: item.name,
            type: chartType,
            data: item?.plotConfig
              ? formatValues(
                  getChartTimeLine(item?.data, item?.plotConfig),
                  item?.plotConfig.dates,
                )
              : item.data,
            smooth: true,
            lineStyle: { color: item.color },
            itemStyle: { color: item.color },
          })),
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: { backgroundColor: toolTipColor || "gray" },
            },
          },
          legend: {
            show: showLegendBarLine,
            selectedMode: false,
          },
          xAxis: {
            type: "category",
            data: processedCategories || processedSeries.map((s) => s.name),
            axisLabel: {
              interval: "auto",
              rotate: xAxisRotated ? 25 : 0,
              hideOverlap: true,
              formatter: function (value: any) {
                if (typeof value === "string" && value.includes("-")) {
                  const parts = value.split("-");
                  return parts.length === 3 ? `${parts[1]}-${parts[2]}` : value;
                }
                const truncateSize = width < 1290 ? 10 : 12;
                const strValue = String(value);
                const truncatedName =
                  strValue.length > truncateSize
                    ? strValue.slice(0, truncateSize) + "..."
                    : strValue;
                return truncatedName;
              },
              margin: 12,
            },
          },
          yAxis: {
            type: "value",
            axisLabel: { rotate: 0, hideOverlap: true },
            splitNumber: 4,
          },
        };
        break;

      case "donut":
        chartType = "pie";
        extraOptions = {
          tooltip: {
            trigger: "item",
            formatter: "{b}: {c}",
          },
          legend: {
            selectedMode: true,
            orient: "vertical",
            right: 10,
            top: "middle",
            itemWidth: 6,
            itemHeight: 6,
            icon: "circle",
            formatter: function (name: string) {
              const item = processedSeries.find((s) => s.name === name);
              if (!item) return name;
              const truncateSize = width < 1290 ? 10 : 12;
              const truncatedName =
                item.name.length > truncateSize
                  ? item.name.slice(0, truncateSize) + "..."
                  : item.name;
              if (isDailyChart) {
                return `{name|${truncatedName}} {value|${item.value}}`;
              }
              return `{name|${name}} {value|${item.value}}`;
            },
            tooltip: {
              trigger: "item",
              show: true,
              formatter: function (params: any) {
                return `${params.name}`;
              },
            },
            textStyle: {
              rich: {
                name: {
                  width: getTextStyleWidth("name", !!isDailyChart, width, seriesLength),
                  align: "left",
                  fontSize: 11,
                  fontWeight: 400,
                  padding: [0, 5, 0, 0],
                },
                value: {
                  width: getTextStyleWidth("value", !!isDailyChart, width, seriesLength),
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
              type: chartType,
              radius: getRadius(!!isDailyChart, width),
              center: getCenter(!!isDailyChart, width, seriesLength),
              avoidLabelOverlap: false,
              label: {
                show: true,
                position: "center",
                formatter: () => {
                  const totalVal =
                    total ??
                    processedSeries.reduce((sum, item) => sum + (item.value || 0), 0);
                  return `{value|${totalVal}}\n{label|Total}`;
                },
                rich: {
                  value: { fontSize: 18, fontWeight: "bold", color: "#333" },
                  label: { fontSize: 12, color: "#666" },
                },
              },
              labelLine: { show: false },
              data: processedSeries.map((item) => ({
                value: toFixedNum(item.value, 2),
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
          series: processedSeries.map((item, index) => ({
            name: item.title || `Metric ${index + 1}`,
            type: "gauge",
            min: 0,
            max: 100,
            progress: {
              show: item.value > 0,
              roundCap: true,
              width: item.width || 10,
              itemStyle: {
                color: item.color || "pink",
                shadowBlur: 5,
                shadowColor: item.shadowColor || "red",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            detail: {
              show: true,
              formatter: (val: number) => val.toFixed(2),
              fontSize: item.fontSize || 32,
              offsetCenter: [0, 0],
            },
            pointer: { show: false },
            axisLine: {
              roundCap: true,
              lineStyle: { width: item.width || 10 },
            },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: {
              show: true,
              distance: -40,
              fontSize: 12,
              formatter: function (val: number) {
                return val === 0 || val === 100 ? val.toString() : "";
              },
            },
            data: [
              {
                value: item.value > 0 ? toFixedNum(item.value, 2) : 0,
                name: "",
              },
            ],
          })),
        };
        break;

      default:
        chartType = "line";
        extraOptions = {
          series: processedSeries.map((item) => ({
            name: item.name,
            type: chartType,
            data: item.data,
            itemStyle: { color: item.color },
          })),
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: { backgroundColor: toolTipColor || "gray" },
            },
          },
        };
    }

    return {
      title:
        title && type !== "gauge"
          ? { text: title, left: "start", textStyle: { fontSize: 16 } }
          : undefined,
      tooltip: { trigger: type === "donut" ? "item" : "axis" },
      legend:
        showLegend && type !== "donut" && type !== "gauge" ? {} : undefined,
      grid:
        type !== "donut" && type !== "gauge"
          ? { left: "10%", right: "5%", bottom: "15%", containLabel: true }
          : undefined,
      xAxis:
        type !== "donut" && type !== "gauge"
          ? {
              type: "category",
              data: processedCategories,
              boundaryGap: chartType === "bar" || chartType === "column",
            }
          : undefined,
      yAxis:
        type !== "donut" && type !== "gauge" ? { type: "value", splitNumber: 4, axisLabel: { hideOverlap: true } } : undefined,
      ...extraOptions,
    };
  };

  const chartOption = useMemo(
    () => option || getChartOptions(),
    [
      option,
      type,
      title,
      JSON.stringify(categories),
      JSON.stringify(series),
      stacked,
      showLegend,
      showLegendBarLine,
      legendData,
      radius,
      showLabel,
      xAxisRotated,
      toolTipColor,
      chartBackground,
      xAxisInterval,
      plotConfig,
      isDailyChart,
      total,
      windowWidth,
    ],
  );

  return (
    <>
      <div
        className="rounded-lg pt-2"
        style={{ background: chartBackground || "#fff" }}
        ref={containerRef}
      >
        {customHeader && <ChartHeader customHeader={customHeader} />}
        {isInView ? (
          <ReactECharts
            echarts={echarts}
            option={chartOption}
            style={{ height }}
          />
        ) : (
          <div style={{ height }}>
            <CardSkeleton count={1} height={Number(height) || 250} />
          </div>
        )}
      </div>
      {showLabel && (
        <div className="flex mx-4">
          <div className="flex justify-between w-full">
            <div className={styles.bulletsDiv} style={{ height: "160px" }}>
              {(legendData?.length ? legendData : processedSeries)?.map((item) => (
                <div key={item.name} className={styles.container}>
                  <div style={{ display: "flex", width: "100%" }}>
                    <div
                      className={styles.bgColor}
                      style={{ backgroundColor: item?.itemStyle?.color }}
                    ></div>
                    <span className={styles.userNameTitle}>{item.name}</span>
                  </div>
                </div>
              ))}
            </div>
            {(legendData && legendData.length > 5) || (!legendData && processedSeries?.length > 5) ? (
              <div className="flex justify-end">
                <Button
                  id="click-viewAll"
                  name="click-viewAll"
                  type="link"
                  onClick={() => {
                    showModal();
                  }}
                >
                  view all
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      )}
      <Modal
        title="Organizations"
        open={isOrgModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ height: "500px", overflow: "auto" }}>
          {(legendData?.length ? legendData : processedSeries)?.map((item) => {
            return (
              <div
                key={item.name}
                className={styles.container}
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <div style={{ display: "flex", width: "100%" }}>
                  <div
                    className={styles.bgColor}
                    style={{
                      backgroundColor: item?.itemStyle?.color,
                    }}
                  ></div>
                  <span className={styles.userNameTitle}>{item.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
};

export default AppChart;
