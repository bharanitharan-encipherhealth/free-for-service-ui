import React, { useEffect } from "react";
import { Card, Empty, Tooltip } from "antd";
import dynamic from "next/dynamic";
import { RootState, Widget } from "../../types";
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
  parseKValue,
  toFixedNum,
  useHasMounted,
  useWindowWidth,
} from "../../component/function";
const processing = "/images/tenantAdmin/processing.svg";
const failed = "/images/tenantAdmin/failed.svg";
const completed = "/images/tenantAdmin/completed.svg";
const fileIcon = "/images/tenantAdmin/file.svg";
const dosIcon = "/images/tenantAdmin/dos.svg";
const pageIcon = "/images/tenantAdmin/page.svg";
import { getColSpan } from "../../component/function";
import { getRowSpan } from "../../component/function";
import AppChart from "../../component/appchart";
import EmptyComponent from "../../component/empty/EmptyComponent";
import { getDashboardItems } from "../../component/function/resubaleGetStorage";
import { connect, ConnectedProps } from "react-redux";
import CardSkeleton from "@/components/skeleton/card";
import dashboardActions from "@/state/tenantadmin/dashboard/actions";
const pages = "/images/dashboard/pages.webp";
const patientCount = "/images/dashboard/patientCount.webp";
const dosCount = "/images/dashboard/dosCount.webp";
const uploadContainer = "/images/dashboard/uploadContainer.webp";
const processingContainer = "/images/dashboard/processingContainer.webp";
const completedContainer = "/images/dashboard/completedContainer.webp";
const failedContainer = "/images/dashboard/failedContainer.webp";
const codeCaptureContainer = "/images/dashboard/codeCaptureContainer.webp";
import {
  getColorValue,
  formatValues,
  getLast30Days,
  getLast7Days,
  getRoleIdByRole,
  statusFormate,
  getChartTimeLine,
  getStatusColor,
} from "@/util/reusableFunction";
import moment from "moment";
import { WorkFlow } from "../../component/layout/workQueue/mockData";
const statCardsData = [
  {
    title: "Radiology",
    value: 293,
    bgColor: getColorValue("5"),
  },
  {
    title: "Lab",
    value: 4,
    bgColor: getColorValue("6"),
  },
];

interface GetChartsProps {
  type: string;
  chartType: string;
  pagesLoader: boolean;
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
  dates: string[];
  selectedValue: string;
  customDate: any;
  windowWidth: number;
  overallCountChartData: any;
  inPatientDetailsChartData: any;
  outPatientDetailsChartData: any;
  outPatientDetailsChartLoader: boolean;
  inPatientDetailsChartLoader: boolean;
  overallCountChartLoader: boolean;
  selectedRole?: string;
}

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
}: GetChartsProps) => {
  switch (type) {
    case "filecount":
      const fileCountData = [
        {
          icon: fileIcon,
          title: "Patients Count",
          value: formatKValue(fileDosCount?.fileCount) || 0,
          bgColor: patientCount,
          color: getColorValue("1"),
        },
        {
          icon: dosIcon,
          title: "DOS Count",
          value: formatKValue(fileDosCount?.dosCount) || 0,
          bgColor: dosCount,
          color: getColorValue("2"),
        },
        {
          icon: pageIcon,
          title: "Pages",
          value: formatKValue(fileDosCount?.pageCount) || 0,
          bgColor: pages,
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
            className="mx-auto"
          >
            {fileCountData.map((card, index) => (
              <StatCard
                key={index}
                icon={card.icon}
                title={card.title}
                value={card.value}
                bgColor={card.bgColor}
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
                  flex: "1 1 calc(33.33% - 20px)",
                  maxWidth: "206px",
                }}
              />
            ))}
          </div>
        );
      }
      const formattedChartData = fileCountData.map((item: any) => ({
        name: item.title,
        value: parseKValue(item.value),
        color: item.color || undefined,
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
        />
      );
    case "RafAndRevenue":
      const rafAndRevenueCategories = rafHcc?.codesAndRafSummaryDTOList?.map(
        (item: any) => moment(item.date).format("MMM D"),
      );
      return rafHccLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
          dates={dates}
          charts={[
            {
              type: "stat",
              size: "col-5",
              mainTitle: "HCC RAF",
              title: "HCC Raf",
              value: toFixedNum(rafHcc?.overallRaf, 3) || 0,
              bgColor: patientCount,
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
      const totalCodesCategories = rafTotal?.codesAndRafSummaryDTOList?.map(
        (item: any) => moment(item.date).format("MMM D"),
      );
      const totalCodesChartData = (
        rafTotal?.codesAndRafSummaryDTOList || []
      ).map((item: any) => ({
        totalCount: toFixedNum(item?.totalCount, 2),
        hccCount: toFixedNum(item?.hccCount, 2),
        suggestedCount: toFixedNum(item?.suggestedCount, 2),
        potentialCount: toFixedNum(item?.potentialCount, 2),
        totalRaf: toFixedNum(item?.totalRaf, 2),
        hccRafScore: toFixedNum(item?.hccRafScore, 2),
        suggestedRafScore: toFixedNum(item?.suggestedRafScore, 2),
        potentialRafScore: toFixedNum(item?.potentialRafScore, 2),
        totalPremium: toFixedNum(item?.totalPremium, 2),
        hccPremium: toFixedNum(item?.hccPremium, 2),
        suggestedPremium: toFixedNum(item?.suggestedPremium, 2),
        potentialPremium: toFixedNum(item?.potentialPremium, 2),
      }));

      return rafTotalLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
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
              // chartBackground: "#ECF3FF",

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
              // chartBackground: "#FCEEE9",
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
      const hccCodesCategories = rafHcc?.codesAndRafSummaryDTOList?.map(
        (item: any) => moment(item.date).format("MMM D"),
      );
      const hccChartData = (rafHcc?.codesAndRafSummaryDTOList || []).map(
        (item: any) => ({
          hccCount: toFixedNum(item?.hccCount, 2),
          hccRafScore: toFixedNum(item?.hccRafScore, 2),
          hccPremium: toFixedNum(item?.hccPremium, 2),
        }),
      );
      return rafHccLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
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
              // chartBackground: "#EFECFE",
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
              // chartBackground: "#E2F1F3",
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
      const careGapChartData = (
        rafCareGap?.codesAndRafSummaryDTOList || []
      ).map((item: any) => ({
        suggestedCount: toFixedNum(item?.suggestedCount, 2),
        suggestedRafScore: toFixedNum(item?.suggestedRafScore, 2),
        suggestedPremium: toFixedNum(item?.suggestedPremium, 2),
      }));
      const careGapCodesCategories = rafCareGap?.codesAndRafSummaryDTOList?.map(
        (item: any) => moment(item.date).format("MMM D"),
      );
      return rafCareGapLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
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
              // chartBackground: " #E2F1F3",
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
              // chartBackground: "#DAE0FC",
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
      const potentialChartData = (
        rafPotential?.codesAndRafSummaryDTOList || []
      ).map((item: any) => ({
        potentialCount: toFixedNum(item?.potentialCount, 2),
        potentialRafScore: toFixedNum(item?.potentialRafScore, 2),
        potentialPremium: toFixedNum(item?.potentialPremium, 2),
      }));
      const potentialCodesCategories =
        rafPotential?.codesAndRafSummaryDTOList?.map((item: any) =>
          moment(item.date).format("MMM D"),
        );
      return rafPotentialLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
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
              // chartBackground: "#EFECFE",
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
              // chartBackground: "#EBFCFF",
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
                title={card.title}
                value={card.value}
                bgColor={card.bgColor || ""}
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
                  color: getColorValue("5") || undefined,
                },
                {
                  name: "Radiology",
                  data: [20, 56, 34, 67, 12],
                  color: getColorValue("6") || undefined,
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
        // {
        //   icon: upload,
        //   title: "AI Upload",
        //   value: uploadedFiles || 0,
        //   bgColor: uploadContainer,
        //   iconColor: "#d0ccff",
        // },
        {
          icon: processing,
          title: "AI Processing",
          value: processingFiles || 0,
          bgColor: "linear-gradient(129.12deg, #03512E -5.66%, rgba(3, 81, 46, 0.5) 102.29%)",
          iconColor: "#d0ccff",
        },
        {
          icon: completed,
          title: "AI Completed",
          value: computedFiles || 0,
          bgColor: "linear-gradient(126.88deg, #87C282 -2.24%, rgba(135, 194, 130, 0.5) 104.92%)",
          iconColor: "#adffb5",
        },
        {
          icon: failed,
          title: "AI Failed",
          value: failedFiles || 0,
          bgColor: "linear-gradient(128.05deg, #5ABA8A -8.93%, rgba(90, 186, 138, 0.5) 97.89%)",
          iconColor: "#ffdbcc",
        }
      ];
      const currentChartType = chartType || "line";
      const categories = dates;
      const series = [
        {
          name: "Completed",
          data: computedStats || [],
          color: getColorValue("3") || undefined,
          plotConfig: {
            key: "date",
            value: "count",
            dates: dates,
          },
        },
        {
          name: "Processing",
          data: processingStats || [],
          color: getColorValue("1") || undefined,
          plotConfig: {
            key: "date",
            value: "count",
            dates: dates,
          },
        },
        {
          name: "Failed",
          data: failedStats || [],
          color: getColorValue("2") || undefined,
          plotConfig: {
            key: "date",
            value: "count",
            dates: dates,
          },
        },
      ];
      return (
        <div className="flex flex-wrap -mx-2">
          <div className="flex justify-between w-full flex-wrap gap-2">
            {fileCardsData.map((card, index) =>
              filesCountDataLoading || pagesLoader ? (
                <CardSkeleton count={1} height={70} key={index} />
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
          <div className="w-full mt-4">
            {filesCountDataLoading || pagesLoader ? (
              <div className="py-2">
                <CardSkeleton count={1} height={180} />
              </div>
            ) : (
              <AppChart
                type={chartType}
                categories={categories}
                series={series}
                xAxisInterval={1}
                height={180}
              />
            )}
          </div>
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
    case "Top10AachiiCode":
      return (
        <ReusableTable
          title={
            <span>
              Top 10 <span>AACHII Codes</span>
            </span>
          }
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
                // {
                //   name: "Total Codes",
                //   data: rafTotal?.codesAndRafSummaryDTOList || [],
                //   color: getColorValue("3"),
                //   area: chartType === "area",
                //   plotConfig: {
                //     key: "date",
                //     value: "totalCount",
                //     dates: dates,
                //   },
                // },
                {
                  name: "Valid Codes",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("1"),
                  area: chartType === "area",
                  plotConfig: { key: "date", value: "hccCount", dates: dates },
                },
                // {
                //   name: "Care Gap Codes",
                //   data: rafTotal?.codesAndRafSummaryDTOList || [],
                //   color: getColorValue("2"),
                //   area: chartType === "area",
                //   plotConfig: {
                //     key: "date",
                //     value: "suggestedCount",
                //     dates: dates,
                //   },
                // },
                // {
                //   name: "Potiential Codes",
                //   data: rafTotal?.codesAndRafSummaryDTOList || [],
                //   color: getColorValue("4"),
                //   area: chartType === "area",
                //   plotConfig: {
                //     key: "date",
                //     value: "potentialCount",
                //     dates: dates,
                //   },
                // },
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
          chartChange={false}
          selectedRole={selectedRole || ""}
          chartData={patientOverllCountFormatData}
        />
      );
    case "inPatientDetails":
      const inPatientDetailsDataFormat = [
        {
          icon: fileIcon,
          title: "Exsisting Patient",
          value: `${inPatientDetailsChartData?.existingPatientCount || 0} Charts`,
          bgColor:
            "linear-gradient(129.12deg, #03512E -5.66%, rgba(3, 81, 46, 0.5) 102.29%)",
          color: getColorValue("1"),
        },
        {
          icon: dosIcon,
          title: "New Patient",
          value: `${inPatientDetailsChartData?.newPatientCount || 0} Charts`,
          bgColor:
            "linear-gradient(126.88deg, #87C282 -2.24%, rgba(135, 194, 130, 0.5) 104.92%)",
          color: getColorValue("2"),
        },
        {
          icon: pageIcon,
          title: "Discharged Patient",
          value: `${inPatientDetailsChartData?.dischargePatientCount || 0} Charts`,
          bgColor:
            "linear-gradient(128.05deg, #5ABA8A -8.93%, rgba(90, 186, 138, 0.5) 97.89%)",
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
              justifyContent: "flex-start",
              gap: "20px",
              height: "100%",
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
                fontWeight="bold"
                flexDirection="column"
                alignItems="center"
                display="flex"
                textAlign="center"
                paddingTop="20px"
                height="225px"
                textColor={"white"}
                border="4px solid #B3B3B3"
                style={{
                  flex: "1 1 calc(33.33% - 20px)",
                  maxWidth: "206px",
                }}
                fontSize={"20px"}
              />
            ))}
          </div>
        );
      }
      const formatInPatientDetailsData = inPatientDetailsDataFormat.map(
        (item: any) => ({
          name: item.title,
          value: parseKValue(item.value),
          color: item.color || undefined,
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
          bgColor:
            "linear-gradient(129.12deg, #03512E -5.66%, rgba(3, 81, 46, 0.5) 102.29%)",
          color: getColorValue("1"),
        },
        {
          icon: dosIcon,
          title: "Consulation",
          value: `${outPatientDetailsChartData?.consultationCount || 0} Charts`,
          bgColor:
            "linear-gradient(126.88deg, #87C282 -2.24%, rgba(135, 194, 130, 0.5) 104.92%)",
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
              justifyContent: "flex-start",
              gap: "20px",
              height: "100%",
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
                fontWeight="bold"
                flexDirection="column"
                alignItems="center"
                display="flex"
                textAlign="center"
                paddingTop="20px"
                height="225px"
                textColor={"white"}
                border="4px solid #B3B3B3"
                style={{
                  flex: "1 1 calc(50% - 20px)",
                  maxWidth: "250px",
                }}
                fontSize={"20px"}
              />
            ))}
          </div>
        );
      }
      const formatOutPatientDetailsData = outPatientDetailsDataFormat.map(
        (item: any) => ({
          name: item.title,
          value: parseKValue(item.value),
          color: item.color || undefined,
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
      break;
  }
};

const connector = connect(
  (state: RootState) => ({
    getSelectedWidgets: state.dashboardReducer.getWidgetsList?.data?.response as Widget[] | undefined,
    getSelectedWidgetsLoader: state.dashboardReducer.getWidgetsListLoader,
    data: state.dashboardReducer,
    top10Codes: state.dashboardReducer?.defaultTop10Codes?.data?.response,
    top10CodesLoading: state.dashboardReducer?.defaultTop10CodesLoader,
    top10OIG: state.dashboardReducer?.defaultTop10OIG?.data?.response,
    top10OIGLoading: state.dashboardReducer?.defaultTop10OIGLoader,
    fileDosCount: state.dashboardReducer?.defaultFileDosCount?.data?.response,
    fileDosCountLoading: state.dashboardReducer?.defaultFileDosCountLoader,
    rafTotal: state.dashboardReducer?.defaultRafTotal?.data?.response,
    rafTotalLoading: state.dashboardReducer?.defaultRafTotalLoader,
    rafHcc: state.dashboardReducer?.defaultRafHcc?.data?.response,
    rafHccLoading: state.dashboardReducer?.defaultRafHccLoader,
    rafCareGap: state.dashboardReducer?.defaultRafCareGap?.data?.response,
    rafCareGapLoading: state.dashboardReducer?.defaultRafCareGapLoader,
    rafPotential: state.dashboardReducer?.defaultRafPotential?.data?.response,
    rafPotentialLoading: state.dashboardReducer?.defaultRafPotentialLoader,
    filesCountData: state.dashboardReducer?.workFlowFilesCount?.data?.response,
    filesCountDataLoading: state.dashboardReducer?.workFlowFilesCountLoader,
    tinTableData: state.dashboardReducer?.defaultTinTable?.data?.response,
    tinTableDataLoading: state.dashboardReducer?.defaultTinTableLoader,
    allocatedStatusCountData: state.dashboardReducer?.workFlowAllocatedStatusCount?.data?.response,
    allocatedStatusCountDataLoading: state.dashboardReducer?.workFlowAllocatedStatusCountLoader,
    overallCountChartData: state.dashboardReducer?.overallCountChart?.data?.response,
    overallCountChartLoader: state.dashboardReducer?.overallCountChartLoader,
    inPatientDetailsChartData: state.dashboardReducer?.inPatientDetailsChart?.data?.response,
    outPatientDetailsChartData: state.dashboardReducer?.outPatientDetailsChart?.data?.response,
    inPatientDetailsChartLoader: state.dashboardReducer?.inPatientDetailsChartLoader,
    outPatientDetailsChartLoader: state.dashboardReducer?.outPatientDetailsChartLoader,
  }),
  (dispatch: any) => ({
    dispatch,
  })
);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface DefaultProps extends PropsFromRedux {
  selectedRole?: string;
  dateRange?: { startDate: string; endDate: string };
  selectedValue?: string;
  customDate?: any;
  pagesLoader?: boolean;
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
  pagesLoader,
  selectedRole,
}) => {
  const dates =
    selectedValue === "custom"
      ? customDate
      : selectedValue === "last_1_month"
        ? getLast30Days()
        : getLast7Days();
  const showDashboard = getSelectedWidgets
    .filter((item: any) => item?.active)
    .sort((a, b) => Number(a?.orderValue || 0) - Number(b?.orderValue || 0));
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

  const apiKeys = api.filter((item: any) =>
    item.widgetId?.some((id: string) =>
      showDashboard.some((widget: Widget) => widget.widgetId === id),
    ),
  );

  const getInitialApiCall = async () => {
    try {
      const params = {
        startDate: dateRange?.startDate || "",
        endDate: dateRange?.endDate || "",
      };

      // const apiKeys = [
      //   "defaultTop10Codes",
      //   "defaultTop10OIG",
      //   "defaultFileDosCount",
      //   "defaultRafTotal",
      //   "defaultRafHcc",
      //   "defaultRafCareGap",
      //   "defaultRafPotential",
      //   "workFlowFilesCount",
      // ];

      for (const item of apiKeys) {
        const actionKey = `${item.key}Action` as keyof typeof dashboardActions;
        const actionFunc = (dashboardActions as any)[actionKey];
        if (typeof actionFunc === "function") {
          dispatch(actionFunc(params));
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

  const windowWidth = useWindowWidth();
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
          className="w-full px-4"
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
          className="w-full px-4"
        >
          {showDashboard?.map((item, id) => {
            const style = {
              gridColumn: `span ${getColSpan(item.size, windowWidth)}`,
              gridRow: `span ${getRowSpan(item.size)}`,
              height: "100%",
            };

            return (
              <div className="dynamicChart" key={id} style={style}>
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
                    selectedValue: selectedValue || "",
                    customDate,
                    windowWidth: windowWidth || 0,
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
}
export default connector(Default);
