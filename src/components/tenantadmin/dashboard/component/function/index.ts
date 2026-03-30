import { useEffect, useState } from "react";
import { Widget, ReactChartType, RoleType } from "../../types";

// last widgetId : acd1b072-3ca4-4bf2-8d32-973ab8c7c057 next continue with acd1b072-3ca4-4bf2-8d32-973ab8c7c058 for uniqueness
export const DefaultWidget: Widget[] = [
  // {
  //   orderValue: "1",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
  //   size: "col-sm-12 col-md-12 col-lg-12 col-xl-12",
  //   widgetName: "filecount",
  //   widgetTypes: ["card", "line", "bar", "donut"],
  //   role: "2",
  //   dashBoardPage: "DEFAULT",
  //   selectedChart: "card",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  // },
  // {
  //   orderValue: "11",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c041",
  //   widgetName: "AllocatedStatus",
  //   selectedChart: "donut",
  //   widgetTypes: ["donut", "bar", "line"],
  //   size: "col-sm-5 col-md-5 col-lg-6 col-xl-6 row-1",
  //   role: "2",
  //   dashBoardPage: "DEFAULT",
  //   title: "Allocated Status",
  //   rolesAccessList: ["CLIENT"],
  // },
  {
    orderValue: "4",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c008",
    size: "row-1 col-sm-12 col-md-12 col-lg-12 col-xl-12",
    widgetName: "fileChart",
    widgetTypes: ["area", "line", "bar"],
    selectedChart: "line",
    role: "2",
    dashBoardPage: "DEFAULT",
    rolesAccessList: [
      "ADMIN",
      "OWNER",
      "QA_LEAD",
      "PROJECT_LEAD",
      "CLIENT",
      "DOWNLOADER",
    ],
    title: "File",
  },
  {
    orderValue: "5",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c009",
    size: "col-sm-6 col-md-6 col-lg-6 col-xl-6",
    widgetName: "Top10Diseases",
    role: "2",
    dashBoardPage: "DEFAULT",
    selectedChart: "table",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  },
  {
    orderValue: "6",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c009",
    size: "col-sm-6 col-md-6 col-lg-6 col-xl-6",
    widgetName: "Top10AachiiCode",
    role: "2",
    dashBoardPage: "DEFAULT",
    selectedChart: "table",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  },
  // {
  //   orderValue: "12",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c040",
  //   size: "col-sm-12 col-md-12 col-lg-12 col-xl-12",
  //   widgetName: "TinTable",
  //   role: "2",
  //   dashBoardPage: "DEFAULT",
  //   selectedChart: "table",
  //   rolesAccessList: ["CLIENT"],
  // },
  {
    orderValue: "13",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c049",
    size: "col-6 row-1",
    widgetName: "OverallPerformance",
    widgetTypes: ["area", "line", "stepline", "bar"],
    selectedChart: "line",
    role: "2",
    dashBoardPage: "DEFAULT",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  },
  // {
  //   orderValue: "14",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c050",
  //   size: "col-6 row-1",
  //   widgetName: "DiseasesPerformance",
  //   widgetTypes: ["area", "line", "stepline", "bar"],
  //   selectedChart: "line",
  //   role: "2",
  //   dashBoardPage: "DEFAULT",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  // },
  // {
  //   orderValue: "15",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c051",
  //   size: "col-6 row-1",
  //   widgetName: "CareGapPerformance",
  //   widgetTypes: ["area", "line", "stepline", "bar"],
  //   selectedChart: "line",
  //   role: "2",
  //   dashBoardPage: "DEFAULT",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  // },
  // {
  //   orderValue: "16",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c052",
  //   size: "col-6 row-1",
  //   widgetName: "PotentialPerformance",
  //   widgetTypes: ["area", "line", "stepline", "bar"],
  //   selectedChart: "line",
  //   role: "2",
  //   dashBoardPage: "DEFAULT",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  // },
  {
    orderValue: "1",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c053",
    size: "col-sm-3 col-md-3 col-lg-3 col-xl-3",
    widgetName: "patientOverllCount",
    widgetTypes: ["card", "line", "bar", "count"],
    role: "2",
    dashBoardPage: "DEFAULT",
    selectedChart: "card",
    rolesAccessList: ["ADMIN"],
  },
  {
    orderValue: "2",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c054",
    size: "col-sm-5 col-md-5 col-lg-5 col-xl-5",
    widgetName: "inPatientDetails",
    widgetTypes: ["card", "line", "bar", "count"],
    role: "2",
    dashBoardPage: "DEFAULT",
    selectedChart: "card",
    rolesAccessList: ["ADMIN"],
    title: "In-Patient",
  },
  {
    orderValue: "3",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c055",
    size: "col-sm-4 col-md-4 col-lg-4 col-xl-4",
    widgetName: "outPatientDetails",
    widgetTypes: ["card", "line", "bar", "count"],
    role: "2",
    dashBoardPage: "DEFAULT",
    selectedChart: "card",
    rolesAccessList: ["ADMIN"],
    title: "Out-Patient",
  },
];

export const InvalidWidget: Widget[] = [
  {
    orderValue: "1",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c011",
    size: "col-sm-4 col-md-4 col-lg-6 col-xl-12",
    widgetName: "DOSCount",
    widgetTypes: ["area", "line", "bar"],
    selectedChart: "line",
    role: "2",
    dashBoardPage: "INVALID",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  },
  {
    orderValue: "2",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c012",
    size: "col-sm-4 col-md-4 col-lg-6 col-xl-12",
    widgetName: "InvalidDocument",
    widgetTypes: ["area", "line", "bar"],
    selectedChart: "line",
    role: "2",
    dashBoardPage: "INVALID",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  },
  {
    orderValue: "3",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c013",
    size: "col-sm-4 col-md-4 col-lg-6 col-xl-12",
    widgetName: "Televisit",
    widgetTypes: ["area", "line", "bar"],
    selectedChart: "line",
    role: "2",
    dashBoardPage: "INVALID",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  },
  {
    orderValue: "4",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c015",
    size: "col-sm-4 col-md-4 col-lg-6 col-xl-12",
    widgetName: "PatientDOBMismatch",
    widgetTypes: ["area", "line", "bar"],
    selectedChart: "line",
    role: "2",
    dashBoardPage: "INVALID",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  },
  {
    orderValue: "5",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c016",
    size: "col-sm-4 col-md-4 col-lg-6 col-xl-12",
    widgetName: "PatientNameMismatch",
    widgetTypes: ["area", "line", "bar"],
    selectedChart: "line",
    role: "2",
    dashBoardPage: "INVALID",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  },
  {
    orderValue: "6",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c020",
    size: "col-sm-4 col-md-4 col-lg-6 col-xl-12",
    widgetName: "MultiplePatientFound",
    widgetTypes: ["area", "line", "bar"],
    selectedChart: "line",
    role: "2",
    dashBoardPage: "INVALID",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  },
  {
    orderValue: "7",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c044",
    size: "col-sm-4 col-md-4 col-lg-6 col-xl-12",
    widgetName: "ProviderMissed",
    widgetTypes: ["area", "line", "bar"],
    selectedChart: "line",
    role: "2",
    dashBoardPage: "INVALID",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  },
  {
    orderValue: "8",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c045",
    size: "col-sm-4 col-md-4 col-lg-6 col-xl-12",
    widgetName: "ProviderSignMissed",
    widgetTypes: ["area", "line", "bar"],
    selectedChart: "line",
    role: "2",
    dashBoardPage: "INVALID",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  },
  {
    orderValue: "9",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c046",
    size: "col-sm-4 col-md-4 col-lg-6 col-xl-12",
    widgetName: "ProviderUnauthorized",
    widgetTypes: ["area", "line", "bar"],
    selectedChart: "line",
    role: "2",
    dashBoardPage: "INVALID",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  },
  {
    orderValue: "10",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c047",
    size: "col-sm-4 col-md-4 col-lg-6 col-xl-12",
    widgetName: "OutOfScope",
    widgetTypes: ["area", "line", "bar"],
    selectedChart: "line",
    role: "2",
    dashBoardPage: "INVALID",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  },
];

export const WorkflowWidget: Widget[] = [
  {
    orderValue: "2",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c023",
    widgetName: "WorkFlowFiles",
    selectedChart: "line",
    widgetTypes: ["line", "bar"],
    size: "col-sm-9 col-md-9 col-lg-9 col-xl-9 row-6",
    role: "2",
    dashBoardPage: "WORKFLOWS",
    title: "Files",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  },
  {
    orderValue: "3",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c024",
    widgetName: "AllocatedStatus",
    selectedChart: "donut",
    widgetTypes: ["donut", "bar", "line"],
    size: "col-sm-3 col-md-3 col-lg-3 col-xl-6 row-3",
    role: "2",
    dashBoardPage: "WORKFLOWS",
    title: "Allocated Status",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  },
  {
    orderValue: "4",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c025",
    widgetName: "Coder 1",
    selectedChart: "donut",
    widgetTypes: ["donut", "bar", "line"],
    size: "col-sm-3 col-md-3 col-lg-3 col-xl-6 row-3",
    role: "2",
    dashBoardPage: "WORKFLOWS",
    title: "EH Coder Status",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  },
  {
    orderValue: "5",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c026",
    widgetName: "Coder 2",
    selectedChart: "donut",
    widgetTypes: ["donut", "bar", "line"],
    size: "col-sm-3 col-md-3 col-lg-3 col-xl-6 row-3",
    role: "2",
    dashBoardPage: "WORKFLOWS",
    title: "Physician Status",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  },
  {
    orderValue: "6",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c027",
    widgetName: "QA",
    selectedChart: "donut",
    widgetTypes: ["donut", "bar", "line"],
    size: "col-sm-3 col-md-3 col-lg-3 col-xl-6 row-3",
    role: "2",
    dashBoardPage: "WORKFLOWS",
    title: "Coder Status",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  },
  {
    orderValue: "11",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c038",
    widgetName: "Accuracy",
    size: "col-sm-12 col-md-12 col-lg-12 col-xl-12 row-4",
    role: "2",
    dashBoardPage: "WORKFLOWS",
    title: "Accuracy and Quality Insights",
    selectedChart: "table",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  },
  {
    orderValue: "13",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c056",
    size: "col-12",
    widgetName: "allocationStatus",
    widgetTypes: ["area", "line", "stepline", "bar"],
    selectedChart: "bar",
    role: "2",
    dashBoardPage: "WORKFLOWS",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
    title: "Allocation Status",
  },
  {
    orderValue: "14",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c057",
    size: "col-12",
    widgetName: "productivityStatus",
    selectedChart: "table",
    role: "2",
    dashBoardPage: "WORKFLOWS",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
    title: "Productivity Status",
  },
];

export const workQueueWidget: Widget[] = [
  {
    orderValue: "1",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c030",
    size: "col-sm-4 col-md-4 col-lg-4 col-xl-12 row-4",
    widgetName: "WorkFlow",
    title: "Last 3 days work flow",
    widgetTypes: ["card", "line", "bar", "donut"],
    selectedChart: "card",
    role: "2",
    dashBoardPage: "WORKQUEUE",
    rolesAccessList: ["CODER_1", "OWNER"],
  },
  {
    orderValue: "2",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c042",
    size: "col-sm-4 col-md-4 col-lg-4 col-xl-12 row-4",
    widgetName: "WorkFlowChart7",
    title: "Last 3 days work flow",
    widgetTypes: ["card", "line", "bar", "donut"],
    selectedChart: "card",
    role: "2",
    dashBoardPage: "WORKQUEUE",
    rolesAccessList: ["CODER_2", "QA", "QA_LEAD"],
  },
  {
    orderValue: "3",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c031",
    size: "col-sm-8 col-md-8 col-lg-8 col-xl-12 row-4",
    widgetName: "DailyTask5",
    widgetTypes: ["line", "bar", "donut"],
    title: "Daily Task",
    selectedChart: "donut",
    role: "2",
    dashBoardPage: "WORKQUEUE",
    rolesAccessList: ["CODER_1"],
  },
  {
    orderValue: "4",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c043",
    size: "col-sm-8 col-md-8 col-lg-8 col-xl-12 row-4",
    widgetName: "DailyTask7",
    widgetTypes: ["line", "bar", "donut"],
    title: "Daily Task",
    selectedChart: "donut",
    role: "2",
    dashBoardPage: "WORKQUEUE",
    rolesAccessList: ["CODER_2", "OWNER", "QA", "QA_LEAD"],
  },
  {
    orderValue: "5",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c034",
    size: "col-sm-12 col-md-12 col-lg-12 col-xl-12 row-4",
    widgetName: "CompletedStatus",
    title: "Productivity Status",
    selectedChart: "line",
    role: "2",
    dashBoardPage: "WORKQUEUE",
    rolesAccessList: ["CODER_1", "CODER_2", "OWNER", "QA", "QA_LEAD"],
  },
];

export const getColSpan = (
  cls: string = "",
  windowWidth: number | null,
): number => {
  if (!windowWidth) return 12;

  const breakpoints = [
    { prefix: "col-sm-", min: 1630 },
    { prefix: "col-md-", min: 1537 },
    { prefix: "col-lg-", min: 1193 },
    { prefix: "col-xl-", min: 800 },
    { prefix: "col-", min: 0 },
  ];

  for (let bp of breakpoints) {
    if (windowWidth >= bp.min) {
      const match = cls.split(" ").find((c) => c.startsWith(bp.prefix));
      if (match) {
        const num = match.match(/\d+/);
        return num ? parseInt(num[0], 10) : 1;
      }
    }
  }

  return 1;
};

export const getRowSpan = (cls: string = ""): number => {
  const match = cls.split(" ").find((c) => c.startsWith("row-"));
  return match ? +match.replace("row-", "") : 1;
};

export const useHasMounted = (): boolean => {
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
};

export const useWindowWidth = (): number | null => {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
};

export interface ChartSeries {
  name?: string;
  status?: string;
  value?: number | any;
  color?: string | null;
  itemStyle?: { color: string | null };
}

export const getFormattedChartData = (
  rawSeries: ChartSeries[],
  chartType: string | any,
) => {
  const categories = rawSeries.map((item) => item.name || item.status || "");
  const values = rawSeries.map((item) => item.value);
  const colors = rawSeries.map(
    (item) => item.color || item.itemStyle?.color || "",
  );

  const legendData = rawSeries.map((item) => ({
    ...item,
    name: item.name || item.status,
    itemStyle: { color: item.color || item.itemStyle?.color || "" },
  }));

  const formattedSeries =
    chartType === "bar" || chartType === "line"
      ? [
          {
            name: "Status",
            data: values,
            colorBy: "data",
            itemStyle: {
              color: (params: { dataIndex: number }) =>
                colors[params.dataIndex] || "",
            },
          },
        ]
      : rawSeries.map((item) => ({
          ...item,
          name: item.name || item.status,
          itemStyle: { color: item.color || item.itemStyle?.color || "" },
        }));

  return {
    categories,
    formattedSeries,
    legendData,
    height: chartType === "donut" ? 180 : 220,
  };
};

export const parseKValue = (val: string | number): number => {
  if (typeof val === "string") {
    const num = parseFloat(val);
    if (val.toUpperCase().includes("K")) return num * 1_000;
    if (val.toUpperCase().includes("M")) return num * 1_000_000;
    if (val.toUpperCase().includes("B")) return num * 1_000_000_000;
    return num;
  }
  return typeof val === "number" ? val : 0;
};

export const formatKValue = (val: number): string => {
  if (typeof val !== "number" || isNaN(val)) return "0";

  if (val >= 1_000_000_000) return (val / 1_000_000_000).toFixed(1) + "B";
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + "M";
  if (val >= 1_000) return (val / 1_000).toFixed(1) + "K";
  return val.toFixed(0);
};

export const toFixedNum = (value: number, precision: number = 2): number => {
  return typeof value === "number" ? parseFloat(value?.toFixed(precision)) : 0;
};

export const roleAccessList: Record<string, string[]> = {
  Admin: ["Default", "Workflow", "Invalid"],
  Owner: ["Default", "Workflow", "Invalid"],
  Coder1: ["WorkQueue"],
  Coder2: ["WorkQueue"],
  QA: ["WorkQueue"],
  QALead: ["Default", "Workflow", "Invalid"],
  ProjectLead: ["Default", "Workflow", "Invalid"],
  Downloader: ["Default"],
  Client: ["Default", "Workflow"],
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

export const getWeeksInMonth = (year: number, month: number): number => {
  const days = getDaysInMonth(year, month);
  const firstDay = new Date(year, month - 1, 1).getDay();
  return Math.ceil((days + firstDay) / 7);
};

export const getDateWeek = (date: Date): number => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayWeek = firstDayOfMonth.getDay();
  const currentDate = date.getDate();
  return Math.ceil((currentDate + firstDayWeek) / 7);
};

export const filterWidgetsByRole = (
  widgets: Widget[],
  selectedRole: string,
): Widget[] => {
  if (!Array.isArray(widgets) || !selectedRole) return [];
  const format = (str: string) => str.toLowerCase().replace(/[\s_]/g, "");
  const formattedSelectedRole = format(selectedRole);
  return widgets.filter((item) => {
    if (!item.rolesAccessList || item.rolesAccessList.length === 0) return true;

    return item.rolesAccessList
      .map((role) => format(role))
      .includes(formattedSelectedRole);
  });
};

export const getTotalChart = (series: ChartSeries[]): number => {
  return series.reduce((acc, item) => {
    return (item.name || item.status) === "Allocated" ? item.value : acc;
  }, 0);
};
