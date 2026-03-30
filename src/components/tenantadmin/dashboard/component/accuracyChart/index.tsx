import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import {
  formatDate,
  formatDateLabel,
  getLast30Days,
  getLast7Days,
} from "@/util/reusableFunction";
import { formatKValue } from "../function";

interface SeriesItem {
  id?: string;
  name: string;
  type?: string;
  data: any[];
  plotConfig?: {
    dates?: string[];
    key?: string;
    value?: string;
  };
  [key: string]: any;
}

interface AccuracyChartProps {
  selectedValue?: string | null;
  customDate?: string[];
  type?: string;
  series?: SeriesItem[];
  yAxisFont1?: string;
  yAxisFont2?: string;
  yAxis1Title?: string;
  yAxis2Title?: string;
  xAxisFontColor?: string;
  LeftYaxisFont?: string;
  rightYaxisFont?: string;
}

const AccuracyChart: React.FC<AccuracyChartProps> = ({
  selectedValue,
  customDate = [],
  type,
  series = [],
  yAxisFont1,
  yAxisFont2,
  yAxis1Title,
  yAxis2Title,
  xAxisFontColor,
  LeftYaxisFont,
  rightYaxisFont,
}) => {
  const getXAxisData = (): string[] => {
    const seriesWithDates = series.find((s) => s.plotConfig?.dates);
    if (seriesWithDates && seriesWithDates.plotConfig?.dates) return seriesWithDates.plotConfig.dates;

    if (selectedValue === "custom" && customDate)
      return customDate.map((d) => formatDateLabel(d));
    if (selectedValue === "last_1_month") return getLast30Days();

    return getLast7Days();
  };

  const categories = getXAxisData();

  const formatSeries = (srs: SeriesItem[], cats: string[]) => {
    return srs.map((s) => {
      const { plotConfig } = s;

      if (!plotConfig) {
        const categorySet = new Set(cats);

        return {
          ...s,
          data: s.data
            ?.filter((p) => categorySet.has(formatDate(p.date)))
            ?.map((p) => p.value ?? 0),
        };
      }

      const { key = "date", value = "value" } = plotConfig;

      const mappedData = cats.map((cat) => {
        const point = s.data?.find((item) => formatDate(item[key]) === cat);
        return point ? (point[value] ?? 0) : 0;
      });

      const { plotConfig: _removed, ...rest } = s;

      return {
        ...rest,
        data: mappedData,
      };
    });
  };

  const findLargest = (srs: SeriesItem[], cats: string[]) => {
    let maxStackedTotal = 0;
    const columnSeries = srs.filter(
      (s) => s?.type?.toLowerCase() !== "spline",
    );

    cats.forEach((cat) => {
      let total = 0;
      columnSeries.forEach((s) => {
        const { plotConfig } = s;
        const key = plotConfig?.key || "date";
        const valueKey = plotConfig?.value || "value";
        if (valueKey?.toLowerCase() === "accuracy") return;
        const point = s.data?.find((item) => formatDate(item[key]) === cat);
        if (point != null) total += Number(point[valueKey]) || 0;
      });
      maxStackedTotal = Math.max(maxStackedTotal, total);
    });

    return maxStackedTotal;
  };

  const getSecondYAxisTickPositions = (maxValue: number) => {
    if (maxValue <= 0) return [0];
    const roundTo = maxValue < 100 ? 10 : 100;
    const roundedMax = Math.ceil(maxValue / roundTo) * roundTo;
    const step = Math.ceil(roundedMax / 5 / roundTo) * roundTo;
    const positions = [];
    for (let i = 0; i < roundedMax; i += step) positions.push(i);
    if (positions[positions.length - 1] !== roundedMax)
      positions.push(roundedMax);
    return positions;
  };

  const commonXAxis: Highcharts.XAxisOptions = {
    type: "category",
    categories,
    labels: {
      rotation: -45,
      autoRotation: [-45, -90],
      step: 1,
      overflow: "justify",
      formatter: function () {
        const val = String(this.value);
        return val.length > 10
          ? val.slice(0, 10) + "..."
          : val;
      },
      style: {
        color: xAxisFontColor,
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    lineColor: "#d9d9d9",
  };

  const commonYAxis: Highcharts.YAxisOptions[] = [
    {
      tickPositions: [0, 25, 50, 75, 100],
      title: {
        text: yAxis1Title,
        style: { color: yAxisFont2 },
      },
      labels: {
        format: "{value}%",
        style: {
          color: LeftYaxisFont,
          fontWeight: "500",
          fontSize: "14px",
        },
      },
      opposite: false,
      min: 0,
      max: 100,
      gridLineWidth: 0,
    },
    {
      title: {
        text: yAxis2Title,
        style: { color: yAxisFont1 },
      },
      labels: {
        formatter: function () {
          return formatKValue(Number(this.value));
        },
        style: {
          color: rightYaxisFont,
          fontWeight: "500",
        },
      },
      opposite: true,
      min: 0,
      max: undefined,
      tickPositions: getSecondYAxisTickPositions(
        findLargest(series, categories),
      ),
    },
  ];

  const getChartOption = (): Highcharts.Options => {
    const formattedSeries = formatSeries(series, categories) as Highcharts.SeriesOptionsType[];

    switch (type) {
      case "column":
        return {
          chart: { type: "column", height: 300 },
          title: { text: "" },
          xAxis: commonXAxis,
          yAxis: commonYAxis,
          credits: { enabled: false },
          tooltip: { shared: true },
          plotOptions: {
            column: {
              stacking: "normal",
              pointWidth: 20,
              borderRadius: 20,
              borderWidth: 0,
            },
          },
          series: formattedSeries,
          legend: {
            enabled: true,
            itemStyle: {
              fontSize: "12px",
              color: "#333",
            },
          },
        };

      case "line":
        return {
          chart: { type: "line", height: 300 },
          title: { text: "" },
          xAxis: commonXAxis,
          yAxis: commonYAxis,
          credits: { enabled: false },
          tooltip: { shared: true },
          series: formattedSeries,
          legend: { enabled: false },
        };

      case "bar":
        return {
          chart: { type: "bar", height: 300 },
          title: { text: "" },
          xAxis: commonXAxis,
          yAxis: commonYAxis[1],
          credits: { enabled: false },
          tooltip: { shared: true },
          plotOptions: {
            bar: {
              dataLabels: { enabled: true },
              borderRadius: 100,
              borderWidth: 0,
            },
          },
          series: formattedSeries,
          legend: { enabled: false },
        };

      default:
        return {};
    }
  };

  const config = getChartOption();

  return (
    <div style={{ marginTop: 20 }}>
      <HighchartsReact highcharts={Highcharts} options={config} />
    </div>
  );
};

export default AccuracyChart;
