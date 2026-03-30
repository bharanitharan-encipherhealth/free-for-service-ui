export const DefaultWidget = [
  {
    orderValue: "1",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
    size: "col-sm-12 col-md-12 col-lg-12 col-xl-12",
    widgetName: "filecount",
    widgetTypes: ["card", "line", "bar", "donut"],
    role: "2",
    dashBoardPage: "DEFAULT",
    selectedChart: "card",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  },
  {
    orderValue: "11",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c041",
    widgetName: "AllocatedStatus",
    selectedChart: "donut",
    widgetTypes: ["donut", "bar", "line"],
    size: "col-sm-5 col-md-5 col-lg-6 col-xl-6 row-1",
    role: "2",
    dashBoardPage: "DEFAULT",
    title: "Allocated Status",
    rolesAccessList: ["CLIENT"],
  },
  {
    orderValue: "10",
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
  },
  {
    orderValue: "17",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c009",
    size: "col-sm-12 col-md-12 col-lg-12 col-xl-12",
    widgetName: "Top10Diseases",
    role: "2",
    dashBoardPage: "DEFAULT",
    selectedChart: "table",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  },
  {
    orderValue: "12",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c040",
    size: "col-sm-12 col-md-12 col-lg-12 col-xl-12",
    widgetName: "TinTable",
    role: "2",
    dashBoardPage: "DEFAULT",
    selectedChart: "table",
    rolesAccessList: ["CLIENT"],
  },
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
  {
    orderValue: "14",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c050",
    size: "col-6 row-1",
    widgetName: "DiseasesPerformance",
    widgetTypes: ["area", "line", "stepline", "bar"],
    selectedChart: "line",
    role: "2",
    dashBoardPage: "DEFAULT",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  },
  {
    orderValue: "15",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c051",
    size: "col-6 row-1",
    widgetName: "CareGapPerformance",
    widgetTypes: ["area", "line", "stepline", "bar"],
    selectedChart: "line",
    role: "2",
    dashBoardPage: "DEFAULT",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  },
  {
    orderValue: "16",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c052",
    size: "col-6 row-1",
    widgetName: "PotentialPerformance",
    widgetTypes: ["area", "line", "stepline", "bar"],
    selectedChart: "line",
    role: "2",
    dashBoardPage: "DEFAULT",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  },
  {
    orderValue: "17",
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
    orderValue: "18",
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
    orderValue: "19",
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

export const InvalidWidget = [
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
];

export const WorkflowWidget = [
  {
    orderValue: "2",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c023",
    widgetName: "WorkFlowFiles",
    selectedChart: "line",
    widgetTypes: ["line", "bar"],
    size: "col-sm-9 col-md-9 col-lg-9 col-xl-9 row-6",
    role: "2",
    dashBoardPage: "WORKFLOW",
    title: "Files",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  },
];

export const workQueueWidget = [
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
];

export const getColSpan = (cls = "", windowWidth: number | null) => {
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

  return 12; // Default to full width if no match
};

export const getRowSpan = (cls = "") => {
  const match = cls.split(" ").find((c) => c.startsWith("row-"));
  return match ? +match.replace("row-", "") : 1;
};

export const filterWidgetsByRole = (widgets: any[], selectedRole: string) => {
  if (!Array.isArray(widgets) || !selectedRole) return [];
  const role = selectedRole.toUpperCase().replace(/[\s_]/g, "");
  return widgets.filter(item => 
    item.rolesAccessList?.some((r: string) => r.replace(/[\s_]/g, "") === role)
  );
};
