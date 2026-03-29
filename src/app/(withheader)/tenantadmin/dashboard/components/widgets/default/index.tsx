import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { DashboardState } from "@/state/admin/dashboard/model";
import actions from "@/state/admin/dashboard/actions";
import { DashboardWidget } from "@/models/dashboard";
import { Card, Empty } from "antd";
import {
  getColorValue,
  getFormattedChartData,
  parseKValue,
  useWindowWidth,
} from "@/util/reusableFunction";
import GroupCard from "@/components/groupCard";
import CardSkeleton from "@/components/skeleton/card";
import AppChart from "@/components/appChart";
import { formatKValue, toFixedNum } from "@/components/function";
import {
  defaultFileDosCountResponse,
  DefaultRafCarGapResponse,
  defaultRafTotalResponse,
  DefaultTop10CodesResponse,
} from "@/models/dashboard/widgets/default";
import ReusableTable from "@/components/table";

import failed from "@/images/tenantAdmin/failed.svg";
import completed from "@/images/tenantAdmin/completed.svg";
import upload from "@/images/tenantAdmin/upload.svg";
import fileIcon from "@/images/tenantAdmin/file.svg";
import dosIcon from "@/images/tenantAdmin/dos.svg";
import pageIcon from "@/images/tenantAdmin/page.svg";
import pages from "@/images/dashboard/pages.webp";
import patientCount from "@/images/dashboard/patientCount.webp";
import dosCount from "../../../../../../../images/dashboard/dosCount.webp";
import uploadContainer from "@/images/dashboard/uploadContainer.webp";
import processingContainer from "@/images/dashboard/processingContainer.webp";
import completedContainer from "@/images/dashboard/completedContainer.webp";
import failedContainer from "@/images/dashboard/failedContainer.webp";
import codeCaptureContainer from "@/images/dashboard/codeCaptureContainer.webp";
import StatCard from "@/components/statCard";
import moment from "moment";
import { getLast30Days, getLast7Days } from "@/resuabelFunction/Menu";

export interface DashboardWidgets {
  widgetId: string;
  orderValue: number;
  active: boolean;
}

type WidgetSize = "SMALL" | "MEDIUM" | "LARGE";

interface getChartsProps {
  type: any;
  chartType: string;
  top10codes: DefaultTop10CodesResponse | undefined;
  fileDosCount: defaultFileDosCountResponse | undefined;
  rafTotal: defaultRafTotalResponse | undefined;
  rafCareGap: DefaultRafCarGapResponse | undefined;
}

interface DashboardItem {
  size: WidgetSize;
  widgetName: string;
  title?: string;
  selectedChart?: string;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

interface ApiConfig {
  key: string;
  widgetId: string[];
}

interface IndexProps {
  selectedRole: string;
  selectedValue: string;
  dateRange?: { startDate: string; endDate: string } | undefined;
  dashboardData?: DashboardState["getWidgets"];
  top10code?: DashboardState["defaultTop10Codes"];
  fileDosCount?: DashboardState["defaultFileDosCount"];
  rafTotal?: DashboardState["defaultRafTotal"];
  rafCareGap?:DashboardState["defaultRafCareGap"];
  dispatch: Dispatch;
  customDate?:string[]
}

const getColSpan = (size: string, windowWidth: number | null): number => {
  // your existing logic
  return 1;
};

const getRowSpan = (size: string): number => {
  // your existing logic
  return 1;
};

function Index({
  selectedRole,
  selectedValue,
  dashboardData,
  dateRange,
  top10code,
  fileDosCount,
  rafTotal,
  rafCareGap,
  dispatch,
  customDate
}: IndexProps) {
  console.log("fileDosCount", fileDosCount);
  const dates =
    selectedValue === "custom"
      ? customDate
      : selectedValue === "last_1_week"
      ? getLast7Days()
      : getLast30Days();

  const showDashboard: DashboardWidget[] =
    dashboardData?.data?.response
      ?.filter(
        (item): item is DashboardWidget =>
          Boolean(item?.active) && typeof item?.orderValue === "number",
      )
      .sort((a, b) => a.orderValue - b.orderValue) ?? [];

  const api: ApiConfig[] = [
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
  ];

  const apiKeys = api.filter((item) =>
    item.widgetId.some((id) =>
      showDashboard.some((widget) => widget.widgetId === id),
    ),
  );

  const getInitialApiCall = async () => {
    console.log("dateRange", dateRange, apiKeys);
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    try {
      const params: DateRange = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      };

      for (const item of apiKeys) {
        const actionKey = `${item.key}Action`;
        const action = actions[actionKey];
        if (action) dispatch(action(params));
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    getInitialApiCall();
  }, [dateRange?.startDate, dateRange?.endDate]);

  const getCharts = ({
    type,
    top10codes,
    fileDosCount,
    chartType,
    rafTotal,
  }: getChartsProps) => {
    switch (type) {
      case "filecount":
        const fileCountData = [
          {
            icon: fileIcon,
            title: "File / Patients Count",
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
          return (
            <div
              style={{
                display: "flex",
                width: "100%",
                gap: "10px",
                justifyContent: "flex-start",
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
                  // minWidth="150px"
                  fontWeight="bold"
                  flexDirection="column"
                  alignItems="center"
                  // justifyContent="center"
                  display="flex"
                  textAlign="center"
                  paddingTop="20px"
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

        return (
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
      case "Top10Diseases":
        return (
          <ReusableTable
            title="Top 10 HCC Codes"
            items={top10codes?.topDiseaseDTOList || []}
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
      case "TotalCodes":
        const totalCodesCategories = rafTotal?.codesAndRafSummaryDTOList?.map(
          (item) => moment(item.date).format("MMM D"),
        );
        const totalCodesChartData = (
          rafTotal?.codesAndRafSummaryDTOList || []
        ).map((item) => ({
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

        return (
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
                    plotConfig: {
                      key: "date",
                      value: "hccCount",
                      dates: dates,
                    },
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
                    plotConfig: {
                      key: "date",
                      value: "totalRaf",
                      dates: dates,
                    },
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
    }
  };

  const windowWidth: number | null = useWindowWidth();

  return (
    <div>
      {showDashboard?.length ? (
        <div className="dashboardGrid">
          {showDashboard.map((item: DashboardWidget, id: number) => {
            const style: React.CSSProperties = {
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
                      <div className="fw-bold mb-2 fs-5">{item.title}</div>
                    )}
                  {getCharts({
                    type: item.widgetName,
                    chartType: item?.selectedChart,
                    top10codes: top10code?.data?.response,
                    fileDosCount: fileDosCount?.data?.response,
                    rafTotal: rafTotal?.data?.response,
                  })}
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
}
const enhancer = connect((state: { dashboardReducer: DashboardState }) => ({
  dashboardData: state.dashboardReducer.getWidgets,
  top10code: state.dashboardReducer?.defaultTop10Codes,
  fileDosCount: state.dashboardReducer?.defaultFileDosCount,
  rafTotal: state.dashboardReducer?.defaultRafTotal,
  rafCareGap: state.dashboardReducer?.defaultRafCareGap
}));
export default enhancer(Index);
