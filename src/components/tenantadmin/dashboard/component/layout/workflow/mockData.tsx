import React from "react";
import { getFormattedChartData, getTotalChart } from "../../function";
import AppChart from "../../appchart";
import AccuracyChart from "../../accuracyChart";
import StatCard from "../../statChart";
import styles from "../../../reviewerStyles.module.css";
import { IoSpeedometerOutline } from "react-icons/io5";
import Notifications from "../../notifications";
import {
  getColorValue,
  getStatusColor,
  getRoleColor,
} from "@/util/reusableFunction";
import { companyDeatils } from "../../../../../../util/config";
import CardSkeleton from "@/components/skeleton/card";

const processing = "/images/dashboard/processing.svg";
const failed = "/images/dashboard/failed.svg";
const completed = "/images/dashboard/completed.svg";
const processingContainer = "/images/dashboard/processingContainer.webp";
const completedContainer = "/images/dashboard/completedContainer.webp";
const failedContainer = "/images/dashboard/failedContainer.webp";

const statCardsData = [
  {
    icon: processing,
    title: "AI Processing",
    value: 4,
    bgColor: processingContainer,
  },
  {
    icon: completed,
    title: "AI Completed",
    value: 293,
    bgColor: completedContainer,
  },
  {
    icon: failed,
    title: "AI Failed",
    value: 4,
    bgColor: failedContainer,
  },
];

const dummyData = [
  {
    id: 1,
    content: "Test notification 1 from dummy",
    createdDate: new Date().toISOString(),
    fromUserDetails: {
      firstName: "Priya",
      lastName: "V",
      role: "Developer",
    },
  },
  {
    id: 2,
    content: "System update scheduled",
    createdDate: new Date().toISOString(),
    fromUserDetails: {
      firstName: "Rahul",
      lastName: "Sharma",
      role: "Admin",
    },
  },
];

interface ChartProps {
  chartType?: string;
  chartChange?: boolean;
}

export const OrgPieChartInfo: React.FC<ChartProps> = ({ chartType, chartChange }) => {
  const OrgPieChartSeries = [
    { name: "Three Gen", value: 5, color: getColorValue("1") },
    { name: "Health Med Pro", value: 10, color: getColorValue("3") },
    { name: "Encipher Health", value: 13, color: getColorValue("6") },
    { name: "Vanguard", value: 6, color: getColorValue("4") },
    { name: "Cogent Health", value: 15, color: getColorValue("2") },
  ];
  const {
    categories: OrgPieChartCategories,
    formattedSeries: OrgPieChartFormatted,
    legendData: OrePieChartLegendData,
  } = getFormattedChartData(OrgPieChartSeries, chartType as any);

  return chartChange ? (
    <div className="">
      <CardSkeleton count={1} height={200} />
    </div>
  ) : (
    <AppChart
      type={chartType}
      categories={OrgPieChartCategories}
      series={OrgPieChartFormatted}
      legendData={OrePieChartLegendData}
      height={300}
      showLegend={true}
      radius={["55%", "60%"]}
      showLabel={true}
      xAxisRotated={true}
    />
  );
};

export const WorkFlowFiles: React.FC<ChartProps> = ({ chartType }) => {
  return (
    <>
      <div className="flex justify-between w-full flex-wrap gap-3">
        {statCardsData.map((card) => (
          <StatCard
            key={card.title}
            icon={card.icon}
            title={card.title}
            value={card.value}
            bgColor={card.bgColor}
            padding="16px"
            minWidth="200px"
            gap="12px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="14px"
            height="60px"
            fontSize="20px"
            fontWeight={700}
            textColor={"white"}
            textAlign="center"
            border="4px solid #B3B3B3"
          />
        ))}
      </div>

      <AppChart
        type={chartType}
        categories={[
          "June 19", "June 21", "June 23", "June 25", "June 27", "June 29", "Jul 01", "Jul 03", "Jul 05"
        ]}
        series={[
          {
            name: "Completed",
            data: [12, 13, 25, 8, 10, 25, 8, 13, 27],
            color: getColorValue("5"),
          },
          {
            name: "Processing",
            data: [5, 20, 25, 5, 20, 25, 5, 20, 25],
            color: getColorValue("7"),
          },
          {
            name: "Failed",
            data: [10, 15, 30, 10, 15, 30, 10, 15, 30],
            color: getColorValue("1"),
          },
        ]}
      />
    </>
  );
};

export const AllocatedStatus: React.FC<ChartProps> = ({ chartType, chartChange }) => {
  const allocatedSeries = [
    { name: "Allocated", value: 210, color: getStatusColor("1") },
    { name: "Not Allocated", value: 0, color: getStatusColor("2") },
  ];

  const {
    categories: allocatedCategories,
    formattedSeries: allocatedFormatted,
    height: allocatedHeight,
  } = getFormattedChartData(allocatedSeries, chartType as any);

  return chartChange ? (
    <div className="">
      <CardSkeleton count={1} height={200} />
    </div>
  ) : (
    <AppChart
      type={chartType}
      categories={allocatedCategories}
      series={allocatedFormatted}
      height={allocatedHeight}
      showLegend={true}
      showLegendBarLine={false}
    />
  );
};

export const Coder1: React.FC<ChartProps> = ({ chartType, chartChange }) => {
  const coder1Series = [
    { name: "Allocated", value: 2, color: getStatusColor("1") },
    { name: "Completed", value: 3, color: getStatusColor("2") },
    { name: "InProgress", value: 5, color: getStatusColor("7") },
  ];

  const {
    categories: coder1Categories,
    formattedSeries: coder1Formatted,
    height: coder1Height,
  } = getFormattedChartData(coder1Series, chartType as any);

  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      categories={coder1Categories}
      series={coder1Formatted}
      height={coder1Height}
      showLegend={true}
      showLegendBarLine={false}
      xAxisRotated={true}
      total={getTotalChart(coder1Series)}
    />
  );
};

export const Coder2: React.FC<ChartProps> = ({ chartType, chartChange }) => {
  const coder2Series = [
    { name: "Allocated", value: 3, color: getStatusColor("1") },
    { name: "Completed", value: 2, color: getStatusColor("2") },
    { name: "InProgress", value: 5, color: getStatusColor("7") },
  ];
  const {
    categories: coder2Categories,
    formattedSeries: coder2Formatted,
    height: coder2Height,
  } = getFormattedChartData(coder2Series, chartType as any);

  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      categories={coder2Categories}
      series={coder2Formatted}
      height={coder2Height}
      showLegend={true}
      showLegendBarLine={false}
      xAxisRotated={true}
      total={getTotalChart(coder2Series)}
    />
  );
};

export const QA: React.FC<ChartProps> = ({ chartType, chartChange }) => {
  const QASeries = [
    { name: "Allocated", value: 3, color: getStatusColor("1") },
    { name: "Completed", value: 6, color: getStatusColor("2") },
    { name: "InProgress", value: 2, color: getStatusColor("7") },
  ];
  const {
    categories: QACategories,
    formattedSeries: QAFormatted,
    height: QAHeight,
  } = getFormattedChartData(QASeries, chartType as any);

  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      categories={QACategories}
      series={QAFormatted}
      height={QAHeight}
      showLegend={true}
      showLegendBarLine={false}
      xAxisRotated={true}
      total={getTotalChart(QASeries)}
    />
  );
};

export const ProjectLead: React.FC<ChartProps> = ({ chartType, chartChange }) => {
  const PLSeries = [
    { name: "Allocated", value: 3, color: getStatusColor("1") },
    { name: "Completed", value: 7, color: getStatusColor("2") },
    { name: "InProgress", value: 4, color: getStatusColor("7") },
    { name: "ReassignedPending", value: 2, color: getStatusColor("4") },
    { name: "ReassignedCompleted", value: 7, color: getStatusColor("5") },
    { name: "QueriedApproved", value: 4, color: getStatusColor("3") },
    { name: "QueriedPending", value: 2, color: getStatusColor("6") },
  ];
  const {
    categories: PLCategories,
    formattedSeries: PLFormatted,
    height: PLHeight,
  } = getFormattedChartData(PLSeries, chartType as any);

  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      categories={PLCategories}
      series={PLFormatted}
      height={PLHeight}
      showLegend={true}
      showLegendBarLine={false}
      xAxisRotated={true}
      total={getTotalChart(PLSeries)}
    />
  );
};

export const QALead: React.FC<ChartProps> = ({ chartType, chartChange }) => {
  const QALeadSeries = [
    { name: "Allocated", value: 3, color: getStatusColor("1") },
    { name: "Completed", value: 6, color: getStatusColor("2") },
    { name: "InProgress", value: 3, color: getStatusColor("7") },
    { name: "ReassignedPending", value: 7, color: getStatusColor("4") },
    { name: "ReassignedCompleted", value: 8, color: getStatusColor("5") },
    { name: "QueriedApproved", value: 9, color: getStatusColor("3") },
    { name: "QueriedPending", value: 10, color: getStatusColor("6") },
  ];
  const {
    categories: QALeadCategories,
    formattedSeries: QALeadFormatted,
    height: QALeadHeight,
  } = getFormattedChartData(QALeadSeries, chartType as any);

  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      categories={QALeadCategories}
      series={QALeadFormatted}
      height={QALeadHeight}
      showLegend={true}
      showLegendBarLine={false}
      xAxisRotated={true}
      total={getTotalChart(QALeadSeries)}
    />
  );
};

export const Owner: React.FC<ChartProps> = ({ chartType, chartChange }) => {
  const OwnerSeries = [
    { name: "Allocated", value: 5, color: getStatusColor("1") },
    { name: "Completed", value: 3, color: getStatusColor("2") },
    { name: "InProgress", value: 8, color: getStatusColor("7") },
    { name: "ReassignedPending", value: 2, color: getStatusColor("4") },
    { name: "ReassignedCompleted", value: 8, color: getStatusColor("5") },
    { name: "QueriedApproved", value: 3, color: getStatusColor("3") },
    { name: "QueriedPending", value: 6, color: getStatusColor("6") },
  ];
  const {
    categories: OwnerCategories,
    formattedSeries: OwnerFormatted,
    height: OwnerHeight,
  } = getFormattedChartData(OwnerSeries, chartType as any);

  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      categories={OwnerCategories}
      series={OwnerFormatted}
      height={OwnerHeight}
      showLegend={true}
      showLegendBarLine={false}
      xAxisRotated={true}
      total={getTotalChart(OwnerSeries)}
    />
  );
};

export const Users: React.FC<ChartProps> = ({ chartType, chartChange }) => {
  const UsersSeries = [
    { name: "Admin", value: 2, color: getRoleColor("1") },
    { name: "Coder 1", value: 6, color: getRoleColor("2") },
    { name: "Coder 2", value: 8, color: getRoleColor("3") },
    { name: "QA", value: 12, color: getRoleColor("4") },
    { name: "QA Lead", value: 4, color: getRoleColor("5") },
    { name: "Project Lead", value: 13, color: getRoleColor("6") },
    { name: "Owner", value: 6, color: getRoleColor("7") },
  ];
  const {
    categories: UsersSeriesCategories,
    formattedSeries: UsersSeriesFormatted,
    height: UsersSeriesHeight,
  } = getFormattedChartData(UsersSeries, chartType as any);

  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      categories={UsersSeriesCategories}
      series={UsersSeriesFormatted}
      height={UsersSeriesHeight}
      showLegend={true}
      showLegendBarLine={false}
      xAxisRotated={true}
    />
  );
};

interface AccuracyProps extends ChartProps {
  series: "Accuracy" | "productivityStatus";
}

export const Accuracy: React.FC<AccuracyProps> = ({ chartType, chartChange, series }) => {
  const date = ["2026-01-04", "2026-01-05", "2026-01-06", "2026-01-07", "2026-01-08", "2026-01-09", "2026-01-10"];
  const accuracyChart = [
    { name: "Total Codes Count", data: [{ date: "2026-01-04", value: 7 }, { date: "2026-01-05", value: 18 }, { date: "2026-01-06", value: 10 }, { date: "2026-01-07", value: 25 }, { date: "2026-01-08", value: 14 }, { date: "2026-01-09", value: 9 }, { date: "2026-01-10", value: 22 }], color: "#2472FF", type: "column" },
    { name: "Engine Score", data: [{ date: "2026-01-04", value: 70 }, { date: "2026-01-05", value: 90 }, { date: "2026-01-06", value: 78 }, { date: "2026-01-07", value: 100 }, { date: "2026-01-08", value: 82 }, { date: "2026-01-09", value: 74 }, { date: "2026-01-10", value: 88 }], color: "#2CAFFE", type: "spline" },
  ];

  const productivityChart = [
    { name: "Add", type: "column", color: getColorValue("5"), stack: "allocation", data: [{ date: "2026-01-04", pendingCount: 15 }, { date: "2026-01-05", pendingCount: 9 }, { date: "2026-01-06", pendingCount: 14 }, { date: "2026-01-07", pendingCount: 11 }, { date: "2026-01-08", pendingCount: 17 }, { date: "2026-01-09", pendingCount: 8 }, { date: "2026-01-10", pendingCount: 20 }], plotConfig: { key: "date", value: "pendingCount" } },
    { name: "Edit", type: "column", color: getColorValue("2"), stack: "allocation", data: [{ date: "2026-01-04", completedCount: 35 }, { date: "2026-01-05", completedCount: 40 }, { date: "2026-01-06", completedCount: 32 }, { date: "2026-01-07", completedCount: 38 }, { date: "2026-01-08", completedCount: 29 }, { date: "2026-01-09", completedCount: 33 }, { date: "2026-01-10", completedCount: 41 }], plotConfig: { key: "date", value: "completedCount" } },
    { name: "Accuracy %", type: "spline", color: "#2CAFFE", data: [{ date: "2026-01-04", accuracyScore: 91 }, { date: "2026-01-05", accuracyScore: 86 }, { date: "2026-01-06", accuracyScore: 89 }, { date: "2026-01-07", accuracyScore: 93 }, { date: "2026-01-08", accuracyScore: 88 }, { date: "2026-01-09", accuracyScore: 84 }, { date: "2026-01-10", accuracyScore: 92 }], plotConfig: { key: "date", value: "accuracyScore" } },
  ];

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className={`${series === "Accuracy" ? "col-span-9" : "col-span-12"}`}>
        <AccuracyChart
          yAxis1Title={series === "Accuracy" ? "Accuracy Changes Count" : "Accuracy"}
          yAxis2Title={series === "Accuracy" ? "Accuracy Changes Count" : "Total Codes"}
          yAxisFont1="#2CAFFE"
          yAxisFont2="#2472FF"
          customDate={date}
          selectedValue={"custom"}
          series={series === "Accuracy" ? accuracyChart : (productivityChart as any)}
        />
      </div>
      {series === "Accuracy" && (
        <div className="col-span-3">
          <div className="p-4 border rounded bg-blue-50 text-center">
            <IoSpeedometerOutline className="text-2xl mx-auto mb-2" />
            <div className="font-bold">Average Score</div>
            <h1>93%</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export const Notificatin: React.FC = () => {
  return (
    <div className="py-2">
      <Notifications useDummyData={true} dummyNotificationData={dummyData} />
    </div>
  );
};

export const allocationStatusData = ({ chartType }: ChartProps) => [
  {
    type: chartType,
    size: "col-12",
    categories: ["Feb 26", "Mar 1", "Mar 4", "Mar 7", "Mar 9", "Mar 13", "Mar 16"],
    series: [
      { name: "Allocated", data: [10, 20, 30, 40, 50, 60, 70], color: getColorValue("2"), stack: "same" },
      { name: "Pending", data: [2, 6, 9, 3, 5, 7, 8], color: getColorValue("3"), stack: "same" },
      { name: "Completed", data: [8, 14, 21, 37, 45, 53, 62], color: getColorValue("4"), stack: "same" },
    ],
  },
];
