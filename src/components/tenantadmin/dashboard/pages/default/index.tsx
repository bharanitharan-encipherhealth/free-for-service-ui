import { Card, Empty, Tooltip } from "antd";
import dynamic from "next/dynamic";
const ReusableTable = dynamic(() => import("../../component/table"), {
  ssr: false,
});
import StatCard from "../../component/statChart";
const GroupCard = dynamic(() => import("../../component/groupcard"), {
  ssr: false,
});
import {
  DefaultWidget,
  formatKValue,
  getFormattedChartData,
  useHasMounted,
  useWindowWidth,
} from "../../component/function";
import processing from "@/images/tenantAdmin/processing.svg";
import failed from "@/images/tenantAdmin/failed.svg";
import completed from "@/images/tenantAdmin/completed.svg";
import upload from "@/images/tenantAdmin/upload.svg";
import fileIcon from "@/images/tenantAdmin/file.svg";
import dosIcon from "@/images/tenantAdmin/dos.svg";
import pageIcon from "@/images/tenantAdmin/page.svg";
import codeIcon from "@/images/tenantAdmin/codecaptured.svg";
import { getColSpan, getRowSpan } from "../../component/function";
import AppChart from "../../component/appchart";
import { getStorage } from "../../../../../util/storage";
import EmptyComponent from "../../component/empty/EmptyComponent";
import { connect } from "react-redux";
import CardSkeleton from "@/components/skeleton/card";
import actions from "../../../../../state/admin/dashboard/actions";
import { useEffect } from "react";
import uploadContainer from "@/images/dashboard/uploadContainer.webp";
import {
  getColorValue,
  formatValues,
  getLast30Days,
  getLast7Days,
  getChartTimeLine,
  getStatusColor,
  parseKValue,
  toFixedNum,
} from "../../../../../util/reusableFunction";
import moment from "moment";
import { WorkFlow } from "../../component/layout/workQueue/mockData";

export interface Widget {
  widgetId: string;
  widgetName: string;
  title: string;
  size: string;
  active: boolean;
  orderValue: number;
  selectedChart: string;
  role: string | string[];
}

interface ChartProps {
  type: string;
  chartType: string;
  pagesLoader: boolean;
  top10Codes?: any;
  top10CodesLoading?: boolean;
  top10OIG?: any;
  top10OIGLoading?: boolean;
  tinTableData?: any;
  tinTableDataLoading?: boolean;
  fileDosCount?: any;
  fileDosCountLoading?: boolean;
  rafTotal?: any;
  rafTotalLoading?: boolean;
  rafHcc?: any;
  rafHccLoading?: boolean;
  rafCareGap?: any;
  rafCareGapLoading?: boolean;
  rafPotential?: any;
  rafPotentialLoading?: boolean;
  filesCountData?: any;
  filesCountDataLoading?: boolean;
  allocatedStatusCountData?: any;
  allocatedStatusCountDataLoading?: boolean;
  dates: any;
  selectedValue: any;
  customDate: any;
  windowWidth: number | null;
  overallCountChartData?: any;
  inPatientDetailsChartData?: any;
  outPatientDetailsChartData?: any;
  outPatientDetailsChartLoader?: boolean;
  inPatientDetailsChartLoader?: boolean;
  overallCountChartLoader?: boolean;
  selectedRole?: string;
}

const statCardsData = [
  {
    title: "Radiology",
    value: 293,
    bgColor: getColorValue("5"),
    icon: null,
  },
  {
    title: "Lab",
    value: 4,
    bgColor: getColorValue("6"),
    icon: null,
  },
];

const getCharts = ({
  type,
  chartType,
  pagesLoader,
  top10Codes,
  top10CodesLoading,
  top10OIG,
  top10OIGLoading,
  tinTableData,
  tinTableDataLoading,
  fileDosCount,
  fileDosCountLoading,
  rafTotal,
  rafTotalLoading,
  rafHcc,
  rafHccLoading,
  rafCareGap,
  rafCareGapLoading,
  rafPotential,
  rafPotentialLoading,
  filesCountData,
  filesCountDataLoading,
  allocatedStatusCountData,
  allocatedStatusCountDataLoading,
  dates,
  selectedValue,
  customDate,
  windowWidth,
  overallCountChartData,
  inPatientDetailsChartData,
  outPatientDetailsChartData,
  outPatientDetailsChartLoader,
  inPatientDetailsChartLoader,
  overallCountChartLoader,
  selectedRole,
}: ChartProps) => {
  switch (type) {
    case "filecount":
      const fileCountData = [
        {
          icon: fileIcon,
          title: "Patients Count",
          value: formatKValue(fileDosCount?.fileCount) || 0,
          bgColor: uploadContainer,
          color: getColorValue("1"),
        },
        {
          icon: dosIcon,
          title: "DOS Count",
          value: formatKValue(fileDosCount?.dosCount) || 0,
          bgColor: uploadContainer,
          color: getColorValue("2"),
        },
        {
          icon: pageIcon,
          title: "Pages",
          value: formatKValue(fileDosCount?.pageCount) || 0,
          bgColor: uploadContainer,
          color: getColorValue("3"),
        },
      ];
      if (chartType === "card") {
        return fileDosCountLoading || pagesLoader ? (
          <CardSkeleton count={1} height={250} />
        ) : (
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-start",
              gap: "20px",
            }}
            className="mx-auto flex"
          >
            {fileCountData.map((card, index) => (
              <StatCard
                key={index}
                icon={card.icon}
                title={card.title}
                value={card.value}
                bgColor={card.bgColor as any}
                imageSizes="(max-width: 768px) 90vw, 206px"
                lcpPriority={card.title === "DOS Count"}
                borderRadius="28px"
                padding="16px"
                fontWeight="bold"
                flexDirection="column"
                alignItems="center"
                display="flex"
                textAlign="center"
                height="283px"
                textColor={"white"}
                border="4px solid #B3B3B3"
                style={{
                  flex: "1 1 clamp(150px, 30%, 206px)",
                  minWidth: "150px",
                  maxWidth: "100%",
                }}
              />
            ))}
          </div>
        );
      }
      const formattedChartData = fileCountData.map((item) => ({
        name: item.title,
        value: parseKValue(item.value),
        color: item.color,
      }));
      const {
        categories: fileChartCategories,
        formattedSeries: fileChartFormatted,
        height: fileChartHeight,
      } = getFormattedChartData(formattedChartData, chartType);

      return fileDosCountLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <AppChart
          type={chartType}
          categories={fileChartCategories}
          series={fileChartFormatted}
          height={chartType !== "card" ? 250 : fileChartHeight}
          showLegend={true}
          showLegendBarLine={false}
          title={"Total Count"}
          legendData={[]}
          radius={0}
          toolTipColor=""
          customHeader={null}
          isShowLine={false}
        />
      );
    case "RafAndRevenue":
      return rafHccLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
          dates={dates}
          chartType={chartType}
          stacked={false}
          isShowLine={false}
          charts={[
            {
              type: "stat",
              size: "col-5",
              mainTitle: "HCC RAF",
              title: "HCC Raf",
              value: toFixedNum(rafHcc?.overallRaf, 3) || 0,
              bgColor: getColorValue("7"),
              backgroundColor: "transparent",
            },
            {
              type: chartType,
              size: "col-7",
              categories: dates,
              customHeader: {
                header: `HCC Revenue Impact`,
                value: formatKValue(rafHcc?.overallPremium),
              },
              series: [
                {
                  name: "Revenue",
                  data: rafHcc?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("7"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "hccPremium",
                    dates: dates,
                  },
                },
              ],
            },
          ]}
        />
      );
    case "TotalCodes":
      return rafTotalLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
          dates={dates}
          chartType={chartType}
          stacked={false}
          isShowLine={false}
          charts={[
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "Code Distribution",
                value: formatKValue(
                  toFixedNum(rafTotal?.overallCodesCount, 2) || 0,
                ),
                header: "Overall Performance",
              },
              series: [
                {
                  name: "Total Codes",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("3"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "totalCount",
                    dates: dates,
                  },
                },
                {
                  name: "HCC Codes",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("1"),
                  area: chartType === "area",
                  plotConfig: { key: "date", value: "hccCount", dates: dates },
                },
                {
                  name: "Care Gap Codes",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("2"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "suggestedCount",
                    dates: dates,
                  },
                },
                {
                  name: "Potiential Codes",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("4"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "potentialCount",
                    dates: dates,
                  },
                },
              ],
            },
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "Overall RAF Score",
                value: toFixedNum(rafTotal?.overallRaf, 3) || 0,
                header: "RAF Score",
              },

              series: [
                {
                  name: "Total RAF",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("3"),
                  area: chartType === "area",
                  plotConfig: { key: "date", value: "totalRaf", dates: dates },
                },
                {
                  name: "HCC RAF",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("1"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "hccRafScore",
                    dates: dates,
                  },
                },
                {
                  name: "Care Gap RAF",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("2"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "suggestedRafScore",
                    dates: dates,
                  },
                },
                {
                  name: "Potiential RAF",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("1"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "potentialRafScore",
                    dates: dates,
                  },
                },
              ],
            },
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "Overall Revenue Impact",
                value:
                  formatKValue(toFixedNum(rafTotal?.overallPremium, 2)) || 0,
                header: "Revenue",
              },
              series: [
                {
                  name: "Total Revenue",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("3"),
                  ...(chartType === "stepline" && { step: "middle" }),
                  plotConfig: {
                    key: "date",
                    value: "totalPremium",
                    dates: dates,
                  },
                },
                {
                  name: "HCC Revenue",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("1"),
                  ...(chartType === "stepline" && { step: "middle" }),
                  plotConfig: {
                    key: "date",
                    value: "hccPremium",
                    dates: dates,
                  },
                },
                {
                  name: "Care Gap Revenue",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("2"),
                  ...(chartType === "stepline" && { step: "middle" }),
                  plotConfig: {
                    key: "date",
                    value: "suggestedPremium",
                    dates: dates,
                  },
                },
                {
                  name: "Potiential Revenue",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("4"),
                  ...(chartType === "stepline" && { step: "middle" }),
                  plotConfig: {
                    key: "date",
                    value: "potentialPremium",
                    dates: dates,
                  },
                },
              ],
            },
          ]}
        />
      );
    case "HccCodes":
      return rafHccLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
          dates={dates}
          chartType={chartType}
          stacked={false}
          isShowLine={false}
          charts={[
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "HCC Code Distribution",
                value:
                  formatKValue(toFixedNum(rafHcc?.overallCodesCount, 2)) || 0,
                header: "HCC Performance",
              },
              series: [
                {
                  name: "HCC Code Distribution",
                  data: rafHcc?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("1"),
                  area: chartType === "area",
                  plotConfig: { key: "date", value: "hccCount", dates: dates },
                },
              ],
            },
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "HCC RAF",
                value: toFixedNum(rafHcc?.overallRaf, 3) || 0,
                header: "RAF Score",
              },
              series: [
                {
                  name: "HCC RAF",
                  data: rafHcc?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("1"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "hccRafScore",
                    dates: dates,
                  },
                },
              ],
            },
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "HCC Revenue Impact",
                value: formatKValue(toFixedNum(rafHcc?.overallPremium, 2)) || 0,
                header: "Revenue",
              },
              series: [
                {
                  name: "HCC Revenue Impact",
                  data: rafHcc?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("1"),
                  ...(chartType === "stepline" && { step: "middle" }),
                  plotConfig: {
                    key: "date",
                    value: "hccPremium",
                    dates: dates,
                  },
                },
              ],
            },
          ]}
        />
      );
    case "CareGapCodes":
      return rafCareGapLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
          dates={dates}
          chartType={chartType}
          stacked={false}
          isShowLine={false}
          charts={[
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "Care Gap Code Distribution",
                value: formatKValue(
                  toFixedNum(rafCareGap?.overallCodesCount, 2),
                ),
                header: "Care Gap Performance",
              },
              series: [
                {
                  name: "Care Gap Code Distribution",
                  data: rafCareGap?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("3"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "suggestedCount",
                    dates: dates,
                  },
                },
              ],
            },
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "Care Gap RAF",
                value: toFixedNum(rafCareGap?.overallRaf, 3),
                header: "RAF Score",
              },
              series: [
                {
                  name: "Care Gap RAF",
                  data: rafCareGap?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("3"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "suggestedRafScore",
                    dates: dates,
                  },
                },
              ],
            },
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "Care Gap Revenue Impact",
                value: formatKValue(toFixedNum(rafCareGap?.overallPremium, 2)),
                header: "Revenue",
              },
              series: [
                {
                  name: "Care Gap Revenue Impact",
                  data: rafCareGap?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("3"),
                  ...(chartType === "stepline" && { step: "middle" }),
                  plotConfig: {
                    key: "date",
                    value: "suggestedPremium",
                    dates: dates,
                  },
                },
              ],
            },
          ]}
        />
      );
    case "PotientialCodes":
      return rafPotentialLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
          dates={dates}
          chartType={chartType}
          stacked={false}
          isShowLine={false}
          charts={[
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "Potential Code Distribution",
                value: formatKValue(
                  toFixedNum(rafPotential?.overallCodesCount, 2),
                ),
                header: "Potential Performance",
              },
              series: [
                {
                  name: "Potential Code Distribution",
                  data: rafPotential?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("4"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "potentialCount",
                    dates: dates,
                  },
                },
              ],
            },
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "Potential RAF",
                value: toFixedNum(rafPotential?.overallRaf, 3),
                header: "RAF Score",
              },
              series: [
                {
                  name: "Potential RAF",
                  data: rafPotential?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("4"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "potentialRafScore",
                    dates: dates,
                  },
                },
              ],
            },
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "Potential Revenue Impact",
                value: formatKValue(
                  toFixedNum(rafPotential?.overallPremium, 2),
                ),
                header: "Revenue",
              },
              series: [
                {
                  name: "Potential Revenue Impact",
                  data: rafPotential?.codesAndRafSummaryDTOList || [],

                  color: getColorValue("4"),
                  ...(chartType === "stepline" && { step: "middle" }),
                  plotConfig: {
                    key: "date",
                    value: "potentialPremium",
                    dates: dates,
                  },
                },
              ],
            },
          ]}
        />
      );
    case "labAndRadialogy":
      return (
        <div>
          <div className="flex gap-3">
            {statCardsData.map((card) => (
              <StatCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                value={card.value}
                bgColor={card.bgColor}
                padding="16px"
                minWidth="140px"
                gap="12px"
                display="flex"
                alignItems="center"
                borderRadius="12px"
                height="80px"
                fontWeight={
                  card.title === "Processing" || card.title === "Failed"
                    ? "900"
                    : undefined
                }
                justifyContent="center"
                textColor={"white"}
                border="4px solid #B3B3B3"
              />
            ))}
          </div>
          {pagesLoader ? (
            <CardSkeleton count={1} height={300} />
          ) : (
            <AppChart
              type={chartType}
              categories={[
                "Feb 26",
                "Mar 1",
                "Mar 4",
                "Mar 7",
                "Mar 9",
                "Mar 13",
                "Mar 16",
              ]}
              series={[
                {
                  name: "Lab",
                  data: [0, 0, 12.34, 0, 3, 0],
                  color: getColorValue("5"),
                  area: chartType === "area",
                },
                {
                  name: "Radiology",
                  data: [20, 56, 34, 67, 12],
                  color: getColorValue("6"),
                  area: chartType === "area",
                },
              ]}
            />
          )}
        </div>
      );
    case "fileChart":
      const {
        computedFiles = 0,
        failedFiles = 0,
        processingFiles = 0,
        uploadedFiles = 0,
        capturedCodesCount = 0,
        computedStats = [],
        failedStats = [],
        processingStats = [],
      } = filesCountData || [];
      const fileCardsData = [
        {
          icon: processing,
          title: "AI Processing",
          value: processingFiles || 0,
          bgColor: processingContainer,
          iconColor: "#d0ccff",
        },
        {
          icon: completed,
          title: "AI Completed",
          value: computedFiles || 0,
          bgColor: completedContainer,
          iconColor: "#80ffd0",
        },
        {
          icon: failed,
          title: "AI Failed",
          value: failedFiles || 0,
          bgColor: failedContainer,
          iconColor: "#ff9191",
        },
        {
          icon: codeIcon,
          title: "Captured Codes",
          value: capturedCodesCount || 0,
          bgColor: codeCaptureContainer,
          iconColor: "#ffc280",
        },
      ];
      const categories = dates;
      const series = [
        {
          name: "Completed",
          data: computedStats || [],
          color: getColorValue("5"),
          plotConfig: {
            key: "date",
            value: "count",
            dates: dates,
          },
        },
        {
          name: "Processing",
          data: processingStats.map((item: any) => item.count) || [],
          color: getColorValue("7"),
        },
        {
          name: "Failed",
          data: failedStats.map((item: any) => item.count) || [],
          color: getColorValue("1"),
        },
      ];
      return (
        <div className="flex flex-col flex-wrap w-full">
          <div className="flex justify-between w-full flex-wrap gap-2">
            {fileCardsData.map((card) =>
              filesCountDataLoading || pagesLoader ? (
                <CardSkeleton count={1} height={70} />
              ) : (
                <StatCard
                  key={card.title}
                  icon={card.icon}
                  title={card.title}
                  value={card.value}
                  bgColor={card.bgColor}
                  padding="16px"
                  minWidth="180px"
                  gap="12px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="20px"
                  height="65px"
                  fontSize="20px"
                  fontWeight={700}
                  textColor={"white"}
                  textAlign={"center"}
                  border="4px solid #B3B3B3"
                />
              ),
            )}
          </div>
          {filesCountDataLoading || pagesLoader ? (
            <div className="py-2">
              <CardSkeleton count={1} height={250} />
            </div>
          ) : (
            <AppChart
              type={chartType}
              categories={categories}
              series={series}
              xAxisInterval={1}
            />
          )}
        </div>
      );
    case "Top10Diseases":
      return top10CodesLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <ReusableTable
          title="Top 10 Diseases"
          items={top10Codes?.topDiseaseDTOList || []}
          columns={[
            { title: "Code", dataIndex: "diagnosisCode" },
            {
              title: "Description",
              dataIndex: "description",
              className: "midRow",
            },
            { title: "Count", dataIndex: "count" },
          ]}
        />
      );
    case "TopOIGCodes":
      return top10OIGLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <ReusableTable
          title="Top 10 OIG Codes"
          items={top10OIG?.topDiseaseDTOList || []}
          columns={[
            { title: "Code", dataIndex: "diagnosisCode" },
            {
              title: "Description",
              dataIndex: "description",
              className: "midRow",
            },
            { title: "Count", dataIndex: "count" },
          ]}
        />
      );
    case "TinTable":
      return tinTableDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <ReusableTable
          title="TIN Status Table"
          items={tinTableData?.tinStatisticsResponseDtoList || []}
          columns={[
            { title: "TIN Number", dataIndex: "tinNumber" },
            { title: "TIN Name", dataIndex: "tinName", className: "midRow" },
            {
              title: "Status",
              dataIndex: "progressPercentage",
              isProgress: true,
            },
          ]}
        />
      );
    case "AllocatedStatus":
      const allocatedSeries = [
        {
          name: "Allocated",
          value: allocatedStatusCountData?.allocatedCount || 0,
          color: getStatusColor("1"),
        },
        {
          name: "Not Allocated",
          value: allocatedStatusCountData?.notAllocatedCount || 0,
          color: getStatusColor("2"),
        },
      ];

      const {
        categories: allocatedCategories,
        formattedSeries: allocatedFormatted,
        height: allocatedHeight,
      } = getFormattedChartData(allocatedSeries, chartType);

      return allocatedStatusCountDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={200} />
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
    case "OverallPerformance":
      return rafTotalLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
          dates={dates}
          chartType={chartType}
          stacked={false}
          isShowLine={true}
          charts={[
            {
              type: chartType,
              size: "col-12",
              categories: dates,
              customHeader: {
                label: "Code Distribution",
                value: formatKValue(
                  toFixedNum(rafTotal?.overallCodesCount, 2) || 0,
                ),
                header: "Overall Performance",
              },
              series: [
                {
                  name: "Total Codes",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("3"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "totalCount",
                    dates: dates,
                  },
                },
                {
                  name: "Valid Codes",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("1"),
                  area: chartType === "area",
                  plotConfig: { key: "date", value: "hccCount", dates: dates },
                },
                {
                  name: "Care Gap Codes",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("2"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "suggestedCount",
                    dates: dates,
                  },
                },
                {
                  name: "Potiential Codes",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("4"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "potentialCount",
                    dates: dates,
                  },
                },
              ],
            },
          ]}
        />
      );
    case "DiseasesPerformance":
      return rafHccLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
          dates={dates}
          chartType={chartType}
          stacked={false}
          isShowLine={true}
          charts={[
            {
              type: chartType,
              size: "col-12",
              categories: dates,
              customHeader: {
                label: "Valid Disease Code Distribution",
                value:
                  formatKValue(toFixedNum(rafHcc?.overallCodesCount, 2)) || 0,
                header: "Valid Disease Performance",
              },
              series: [
                {
                  name: "Valid Disease Code Distribution",
                  data: rafHcc?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("1"),
                  area: chartType === "area",
                  plotConfig: { key: "date", value: "hccCount", dates: dates },
                },
              ],
            },
          ]}
        />
      );
    case "CareGapPerformance":
      return rafCareGapLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
          dates={dates}
          chartType={chartType}
          stacked={false}
          isShowLine={true}
          charts={[
            {
              type: chartType,
              size: "col-12",
              categories: dates,
              customHeader: {
                label: "Care Gap Code Distribution",
                value: formatKValue(
                  toFixedNum(rafCareGap?.overallCodesCount, 2),
                ),
                header: "Care Gap Performance",
              },
              series: [
                {
                  name: "Care Gap Code Distribution",
                  data: rafCareGap?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("3"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "suggestedCount",
                    dates: dates,
                  },
                },
              ],
            },
          ]}
        />
      );
    case "PotentialPerformance":
      return rafPotentialLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
          dates={dates}
          chartType={chartType}
          stacked={false}
          isShowLine={true}
          charts={[
            {
              type: chartType,
              size: "col-12",
              categories: dates,
              customHeader: {
                label: "Potential Code Distribution",
                value: formatKValue(
                  toFixedNum(rafPotential?.overallCodesCount, 2),
                ),
                header: "Potential Performance",
              },
              series: [
                {
                  name: "Potential Code Distribution",
                  data: rafPotential?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("4"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "potentialCount",
                    dates: dates,
                  },
                },
              ],
            },
          ]}
        />
      );
    case "patientOverllCount":
      const patientOverllCountFormatData = [
        {
          status: "OverallPatientCount",
          value: overallCountChartData?.totalPatientCount || 0,
        },
        { status: "InPatient", value: overallCountChartData?.ipCount || 0 },
        { status: "OutPatient", value: overallCountChartData?.opCount || 0 },
      ];
      return overallCountChartLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <WorkFlow
          chartType={chartType}
          windowWidth={windowWidth}
          chartData={patientOverllCountFormatData}
          chartChange={false}
          selectedRole={selectedRole}
        />
      );
    case "inPatientDetails":
      const inPatientDetailsDataFormat = [
        {
          icon: fileIcon,
          title: "Exsisting Patient",
          value: `${inPatientDetailsChartData?.existingPatientCount || 0} Charts`,
          bgColor: patientCount,
          color: getColorValue("1"),
        },
        {
          icon: dosIcon,
          title: "New Patient",
          value: `${inPatientDetailsChartData?.newPatientCount || 0} Charts`,
          bgColor: dosCount,
          color: getColorValue("2"),
        },
        {
          icon: pageIcon,
          title: "Discharged Patient",
          value: `${inPatientDetailsChartData?.dischargePatientCount || 0} Charts`,
          bgColor: pages,
          color: getColorValue("3"),
        },
      ];
      if (chartType === "card") {
        return inPatientDetailsChartLoader ? (
          <CardSkeleton count={1} height={200} />
        ) : (
          <div
            style={{
              display: "flex",
              width: "100%",
              gap: "20px",
              height: "100%",
              justifyContent: "flex-start",
            }}
            className="mx-auto"
          >
            {inPatientDetailsDataFormat?.map((card, index) => (
              <StatCard
                key={index}
                icon={card.icon}
                title={card.title}
                value={card.value}
                bgColor={card.bgColor}
                borderRadius="28px"
                padding="16px"
                // minWidth="150px"
                fontWeight="bold"
                flexDirection="column"
                alignItems="center"
                // justifyContent="center"
                display="flex"
                textAlign="center"
                paddingTop="20px"
                height="225px"
                textColor={"white"}
                border="4px solid #B3B3B3"
                style={{
                  flex: "1 1 clamp(150px, 30%, 206px)",
                  minWidth: "150px",
                  maxWidth: "100%",
                }}
                fontSize={"20px"}
              />
            ))}
          </div>
        );
      }
      const formatInPatientDetailsData = inPatientDetailsDataFormat.map(
        (item) => ({
          name: item.title,
          value: parseKValue(item.value),
          color: item.color,
        }),
      );
      const {
        categories: inPatientChartCategories,
        formattedSeries: inPatientChartFormatted,
        height: inPatientChartHeight,
      } = getFormattedChartData(formatInPatientDetailsData, chartType);

      return inPatientDetailsChartLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={inPatientChartCategories}
          series={inPatientChartFormatted}
          height={chartType !== "card" ? 250 : inPatientChartHeight}
          showLegend={true}
          showLegendBarLine={false}
        />
      );
    case "outPatientDetails":
      const outPatientDetailsDataFormat = [
        {
          icon: fileIcon,
          title: "ER",
          value: `${outPatientDetailsChartData?.erCount || 0} Charts`,
          bgColor: patientCount,
          color: getColorValue("1"),
        },
        {
          icon: dosIcon,
          title: "Consulation",
          value: `${outPatientDetailsChartData?.consultationCount || 0} Charts`,
          bgColor: dosCount,
          color: getColorValue("2"),
        },
      ];
      if (chartType === "card") {
        return outPatientDetailsChartLoader ? (
          <CardSkeleton count={1} height={200} />
        ) : (
          <div
            style={{
              display: "flex",
              width: "100%",
              gap: "20px",
              height: "100%",
              justifyContent: "flex-start",
            }}
            className="mx-auto"
          >
            {outPatientDetailsDataFormat?.map((card, index) => (
              <StatCard
                key={index}
                icon={card.icon}
                title={card.title}
                value={card.value}
                bgColor={card.bgColor}
                borderRadius="28px"
                padding="16px"
                // minWidth="150px"
                fontWeight="bold"
                flexDirection="column"
                alignItems="center"
                // justifyContent="center"
                display="flex"
                textAlign="center"
                paddingTop="20px"
                height="225px"
                textColor={"white"}
                border="4px solid #B3B3B3"
                style={{
                  flex: "1 1 clamp(150px, 30%, 206px)",
                  minWidth: "150px",
                  maxWidth: "100%",
                }}
                fontSize={"20px"}
              />
            ))}
          </div>
        );
      }
      const formatOutPatientDetailsData = outPatientDetailsDataFormat.map(
        (item) => ({
          name: item.title,
          value: parseKValue(item.value),
          color: item.color,
        }),
      );
      const {
        categories: inPatientChartCategorie,
        formattedSeries: outPatientChartFormatted,
        height: outPatientChartHeight,
      } = getFormattedChartData(formatOutPatientDetailsData, chartType);

      return outPatientDetailsChartLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={inPatientChartCategorie}
          series={outPatientChartFormatted}
          height={chartType !== "card" ? 250 : outPatientChartHeight}
          showLegend={true}
          showLegendBarLine={false}
        />
      );
    default:
      return null;
  }
};

interface DefaultProps {
  dispatch: any;
  data: any;
  getSelectedWidgets: Widget[];
  getSelectedWidgetsLoader: boolean;
  dateRange: { startDate: string; endDate: string };
  top10Codes: any;
  top10CodesLoading: boolean;
  top10OIG: any;
  top10OIGLoading: boolean;
  tinTableData: any;
  tinTableDataLoading: boolean;
  fileDosCount: any;
  fileDosCountLoading: boolean;
  rafTotal: any;
  rafTotalLoading: boolean;
  rafHcc: any;
  rafHccLoading: boolean;
  rafCareGap: any;
  rafCareGapLoading: boolean;
  rafPotential: any;
  rafPotentialLoading: boolean;
  filesCountData: any;
  filesCountDataLoading: boolean;
  allocatedStatusCountData: any;
  allocatedStatusCountDataLoading: boolean;
  selectedValue: string | null;
  customDate: string[];
  overallCountChartData: any;
  inPatientDetailsChartData: any;
  outPatientDetailsChartData: any;
  outPatientDetailsChartLoader: boolean;
  inPatientDetailsChartLoader: boolean;
  overallCountChartLoader: boolean;
  selectedRole: string;
  pagesLoader: boolean;
  windowWidth: number | null;
}

const Default: React.FC<DefaultProps> = ({
  dispatch,
  data,
  getSelectedWidgets = [],
  getSelectedWidgetsLoader,
  dateRange,
  top10Codes,
  top10CodesLoading,
  top10OIG,
  top10OIGLoading,
  tinTableData,
  tinTableDataLoading,
  fileDosCount,
  fileDosCountLoading,
  rafTotal,
  rafTotalLoading,
  rafHcc,
  rafHccLoading,
  rafCareGap,
  rafCareGapLoading,
  rafPotential,
  rafPotentialLoading,
  filesCountData,
  filesCountDataLoading,
  allocatedStatusCountData,
  allocatedStatusCountDataLoading,
  selectedValue,
  customDate,
  overallCountChartData,
  inPatientDetailsChartData,
  outPatientDetailsChartData,
  outPatientDetailsChartLoader,
  inPatientDetailsChartLoader,
  overallCountChartLoader,
  selectedRole,
  pagesLoader,
  windowWidth,
}) => {
  const dates =
    selectedValue === "custom"
      ? customDate
      : selectedValue === "last_1_month"
        ? (getLast30Days() as string[])
        : (getLast7Days() as string[]);

  const showDashboard = getSelectedWidgets
    ?.filter((item: Widget) => item?.active)
    ?.sort((a: Widget, b: Widget) => +a?.orderValue - +b?.orderValue);

  const api = [
    {
      key: "defaultTop10Codes",
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c009"],
    },
    {
      key: "defaultTop10OIG",
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c010"],
    },
    {
      key: "defaultFileDosCount",
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c001"],
    },
    {
      key: "defaultRafTotal",
      widgetId: [
        "acd1b072-3ca4-4bf2-8d32-973ab8c7c003",
        "acd1b072-3ca4-4bf2-8d32-973ab8c7c049",
      ],
    },
    {
      key: "defaultRafHcc",
      widgetId: [
        "acd1b072-3ca4-4bf2-8d32-973ab8c7c004",
        "acd1b072-3ca4-4bf2-8d32-973ab8c7c002",
        "acd1b072-3ca4-4bf2-8d32-973ab8c7c050",
      ],
    },
    {
      key: "defaultRafCareGap",
      widgetId: [
        "acd1b072-3ca4-4bf2-8d32-973ab8c7c005",
        "acd1b072-3ca4-4bf2-8d32-973ab8c7c051",
      ],
    },
    {
      key: "defaultRafPotential",
      widgetId: [
        "acd1b072-3ca4-4bf2-8d32-973ab8c7c006",
        "acd1b072-3ca4-4bf2-8d32-973ab8c7c052",
      ],
    },
    {
      key: "workFlowFilesCount",
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c008"],
    },
    {
      key: "defaultTinTable",
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c040"],
    },
    {
      key: "workFlowAllocatedStatusCount",
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c041"],
    },
    {
      key: "overallCountChart",
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c053"],
    },
    {
      key: "inPatientDetailsChart",
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c054"],
    },
    {
      key: "outPatientDetailsChart",
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c055"],
    },
  ];

  const apiKeys = api.filter((item) =>
    item.widgetId?.some((id) =>
      showDashboard?.some((widget: Widget) => widget.widgetId === id),
    ),
  );

  const getInitialApiCall = async () => {
    try {
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      };

      for (const item of apiKeys) {
        const actionKey = `${item.key}Action`;
        if (typeof (actions as any)[actionKey] === "function") {
          dispatch((actions as any)[actionKey](params));
        } else {
          console.warn(`Action not found for key: ${actionKey}`);
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    getInitialApiCall();
  }, [dateRange, getSelectedWidgets]);

  const hasMounted = useHasMounted();
  if (!hasMounted) return null;

  return (
    <>
      {getSelectedWidgetsLoader ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            padding: 20,
          }}
          className="container-fluid"
        >
          <CardSkeleton count={9} height={300} />
        </div>
      ) : showDashboard?.length ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 16,
            height: "100%",
          }}
          className="container-fluid"
        >
          {showDashboard?.map((item: Widget, id: number) => {
            const gridStyle = {
              gridColumn: `span ${getColSpan(item.size, windowWidth as number)}`,
              gridRow: `span ${getRowSpan(item.size)}`,
              height: "100%",
            };

            return (
              <div className="dynamicChart" key={id} style={gridStyle}>
                <Card>
                  {item.widgetName !== "WorkFlow" &&
                    item.title !== "Notifications" &&
                    item.title !== "Hold Status" && (
                      <div className="font-bold mb-2 text-xl">{item.title}</div>
                    )}
                  {getCharts({
                    type: item.widgetName,
                    chartType: item?.selectedChart,
                    pagesLoader: getSelectedWidgetsLoader,
                    top10Codes,
                    top10CodesLoading,
                    top10OIG,
                    top10OIGLoading,
                    tinTableData,
                    tinTableDataLoading,
                    fileDosCount,
                    fileDosCountLoading,
                    rafTotal,
                    rafTotalLoading,
                    rafHcc,
                    rafHccLoading,
                    rafCareGap,
                    rafCareGapLoading,
                    rafPotential,
                    rafPotentialLoading,
                    filesCountData,
                    filesCountDataLoading,
                    allocatedStatusCountData,
                    allocatedStatusCountDataLoading,
                    dates,
                    selectedValue,
                    customDate,
                    windowWidth,
                    overallCountChartData,
                    inPatientDetailsChartData,
                    outPatientDetailsChartData,
                    outPatientDetailsChartLoader,
                    inPatientDetailsChartLoader,
                    overallCountChartLoader,
                    selectedRole,
                  })}
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyComponent />
      )}
    </>
  );
};

const enhancer = connect((state: any) => ({
  getSelectedWidgets: state.admin.dashboard1.getWidgetsList?.data?.response,
  getSelectedWidgetsLoader: state.admin.dashboard1.getWidgetsListLoader,
  data: state.admin?.dashboard1,
  top10Codes: state.admin?.dashboard1?.defaultTop10Codes?.data?.response,
  top10CodesLoading: state.admin?.dashboard1?.defaultTop10CodesLoader,
  top10OIG: state.admin?.dashboard1?.defaultTop10OIG?.data?.response,
  top10OIGLoading: state.admin?.dashboard1?.defaultTop10OIGLoader,
  fileDosCount: state.admin?.dashboard1?.defaultFileDosCount?.data?.response,
  fileDosCountLoading: state.admin?.dashboard1?.defaultFileDosCountLoader,
  rafTotal: state.admin?.dashboard1?.defaultRafTotal?.data?.response,
  rafTotalLoading: state.admin?.dashboard1?.defaultRafTotalLoader,
  rafHcc: state.admin?.dashboard1?.defaultRafHcc?.data?.response,
  rafHccLoading: state.admin?.dashboard1?.defaultRafHccLoader,
  tinTableData: state.admin?.dashboard1?.defaultTinTable?.data?.response,
  tinTableDataLoading: state.admin?.dashboard1?.defaultTinTableLoader,
  rafCareGap: state.admin?.dashboard1?.defaultRafCareGap?.data?.response,
  rafCareGapLoading: state.admin?.dashboard1?.defaultRafCareGapLoader,
  rafPotential: state.admin?.dashboard1?.defaultRafPotential?.data?.response,
  rafPotentialLoading: state.admin?.dashboard1?.defaultRafPotentialLoader,
  filesCountData: state.admin?.dashboard1?.workFlowFilesCount?.data?.response,
  filesCountDataLoading: state.admin?.dashboard1?.workFlowFilesCountLoader,
  allocatedStatusCountData:
    state.admin?.dashboard1?.workFlowAllocatedStatusCount?.data?.response,
  allocatedStatusCountDataLoading:
    state.admin?.dashboard1?.workFlowAllocatedStatusCountLoader,
  overallCountChartData:
    state.admin?.dashboard1?.overallCountChart?.data?.response,
  overallCountChartLoader: state.admin?.dashboard1?.overallCountChartLoader,
  inPatientDetailsChartData:
    state.admin?.dashboard1?.inPatientDetailsChart?.data?.response,
  outPatientDetailsChartData:
    state.admin?.dashboard1?.outPatientDetailsChart?.data?.response,
  inPatientDetailsChartLoader:
    state.admin?.dashboard1?.inPatientDetailsChartLoader,
  outPatientDetailsChartLoader:
    state.admin?.dashboard1?.outPatientDetailsChartLoader,
}));

export default enhancer(Default);
