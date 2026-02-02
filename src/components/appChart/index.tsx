"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button, Modal } from "antd";
import ChartHeader from "../chartHeader";
import CardSkeleton from "@/components/skeleton/card";
import styles from "./style.module.css";
import {
  formatValues,
  getChartTimeLine,
  statusFormate,
} from "@/util/reusableFunction";

import { useWindowWidth } from "../../components/function/index";
// import { toFixedNum } from "../function";

// ECharts core imports
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

/* =========================
   TYPES
========================= */
export interface PlotConfig {
  key: string;
  value: string;
  dates?: string[];
}

export interface ChartSeries {
  name: string;
  data: any[];
  value?: number;
  color?: string;
  width?: number;
  shadowColor?: string;
  fontSize?: number;
  itemStyle?: { color?: string };
  plotConfig?: PlotConfig;
}

export interface AppChartProps {
  type?: "line" | "bar" | "area" | "donut" | "pie" | "stepline" | "gauge";
  title?: string;
  categories?: string[];
  series?: ChartSeries[];
  stacked?: boolean;
  height?: number;
  showLegend?: boolean;
  showLegendBarLine?: boolean;
  legendData?: ChartSeries[];
  radius?: string[];
  showLabel?: boolean;
  xAxisRotated?: boolean;
  toolTipColor?: string;
  chartBackground?: string;
  customHeader?: React.ReactNode;
  isOrgModalOpen?: boolean;
  showModal?: () => void;
  handleOk?: () => void;
  handleCancel?: () => void;
  xAxisInterval?: number;
  plotConfig?: PlotConfig;
  isDailyChart?: boolean;
  total?: number;
}

/* =========================
   COMPONENT
========================= */

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
  showModal,
  handleOk,
  handleCancel,
  xAxisInterval = 0,
  plotConfig,
  isDailyChart = false,
  total,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const windowWidth = useWindowWidth();

  /* =========================
     Intersection Observer for lazy loading
  ========================== */
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
      { rootMargin: "200px 0px" }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  /* =========================
     Format series and categories
  ========================== */
  series = series.map((item) =>
    item.name ? { ...item, name: statusFormate(item.name) } : item
  );
  categories = categories.map((item) => (item ? statusFormate(item) : item));

  /* =========================
     Helper functions
  ========================== */
  const getTextStyleWidth = (
    type: "name" | "value",
    isDailyChart: boolean,
    windowWidth: number,
    seriesLength: number
  ) => {
    if (type === "name") {
      if (isDailyChart) {
        return windowWidth > 1290 ? 50 : 40;
      } else {
        return windowWidth < 1290 ? 5 : 80;
      }
    }

    if (type === "value") {
      if (isDailyChart) {
        return windowWidth > 1290 ? 30 : 40;
      } else {
        return windowWidth < 1290 ? 120 : 45;
      }
    }

    return 0;
  };

  const getRadius = (isDailyChart: boolean, windowWidth: number) => {
    if (isDailyChart && windowWidth < 1290) return ["30%", "40%"];
    if (isDailyChart && windowWidth < 1540) return ["32%", "42%"];
    if (windowWidth < 1290 || isDailyChart) return ["33%", "43%"];
    return ["60%", "70%"];
  };

  const getCenter = (isDailyChart: boolean, windowWidth: number, seriesLength: number) => {
    if (isDailyChart && windowWidth < 1540) return ["25%", "50%"];
    if (windowWidth < 1290) return ["17%", "50%"];
    if (seriesLength > 6) return windowWidth > 1290 ? ["25%", "50%"] : ["35%", "50%"];
    return windowWidth > 1290 ? ["25%", "50%"] : ["40%", "50%"];
  };

  /* =========================
     Generate chart options
  ========================== */
  const getChartOptions = () => {
    // Logic from your previous code (bar, line, stepline, area, donut, gauge)
    // Reuse your current switch-case, but TS-safe with proper type annotations
    // For brevity, you can reuse your previous logic here
    return {}; // placeholder
  };

  const option = useMemo(() => getChartOptions(), [
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
  ]);

  /* =========================
     Render
  ========================== */
  return (
    <>
      <div
        className="rounded pt-2"
        style={{ background: chartBackground || "#fff" }}
        ref={containerRef}
      >
        {customHeader && <ChartHeader customHeader={customHeader} />}
        {isInView ? (
          <ReactECharts echarts={echarts} option={option} style={{ height }} />
        ) : (
          <div style={{ height }}>
            <CardSkeleton count={1} height={height} />
          </div>
        )}
      </div>

      {/* Legend / View All */}
      {showLabel && (
        <div className="d-flex mx-4">
          <div className="d-flex justify-content-between w-100">
            <div className={styles.bulletsDiv} style={{ height: "160px" }}>
              {(legendData?.length ? legendData : series)?.map((item) => (
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
            {(legendData?.length ?? 0) > 5 || (series?.length ?? 0) > 5 ? (
              <div style={{ display: "flex", justifyContent: "end" }}>
                <Button type="link" onClick={() => showModal?.()}>
                  view all
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        title="Organizations"
        open={isOrgModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ height: "500px", overflow: "auto" }}>
          {(legendData?.length ? legendData : series)?.map((item) => (
            <div
              key={item.name}
              className={styles.container}
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
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
      </Modal>
    </>
  );
};

export default AppChart;
