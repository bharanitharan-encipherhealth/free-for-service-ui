import { useEffect, useState } from "react";

//  last widgetId : acd1b072-3ca4-4bf2-8d32-973ab8c7c052 next continue with acd1b072-3ca4-4bf2-8d32-973ab8c7c053 for uniqueness
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
  // {
  //   orderValue: "2",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c002",
  //   size: "col-sm-7 col-md-7 col-lg-6 col-xl-12",
  //   widgetName: "RafAndRevenue",
  //   widgetTypes: ["area", "line", "bar"],
  //   selectedChart: "bar",
  //   role: "2",
  //   dashBoardPage: "DEFAULT",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  // },
  // {
  //   orderValue: "3",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c003",
  //   size: "col-12 row-1",
  //   widgetName: "TotalCodes",
  //   widgetTypes: ["area", "line", "stepline", "bar"],
  //   selectedChart: "line",
  //   role: "2",
  //   dashBoardPage: "DEFAULT",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  // },
  // {
  //   orderValue: "4",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c004",
  //   size: "col-12",
  //   widgetName: "HccCodes",
  //   widgetTypes: ["area", "line", "stepline", "bar"],
  //   selectedChart: "line",
  //   role: "2",
  //   dashBoardPage: "DEFAULT",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  // },
  // {
  //   orderValue: "5",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c005",
  //   size: "col-12",
  //   widgetName: "CareGapCodes",
  //   widgetTypes: ["area", "line", "stepline", "bar"],
  //   selectedChart: "line",
  //   role: "2",
  //   dashBoardPage: "DEFAULT",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  // },
  // {
  //   orderValue: "6",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c006",
  //   size: "col-12",
  //   widgetName: "PotientialCodes",
  //   widgetTypes: ["area", "line", "stepline", "bar"],
  //   selectedChart: "line",
  //   role: "2",
  //   dashBoardPage: "DEFAULT",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  // },
  // {
  //   orderValue: "7",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c007",
  //   size: "row-1 col-sm-5 col-md-5 col-lg-6 col-xl-12",
  //   widgetName: "labAndRadialogy",
  //   widgetTypes: ["area", "line", "bar"],
  //   selectedChart: "line",
  //   role: "2",
  //   dashBoardPage: "DEFAULT",
  // },
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
    widgetTypes: ["area","line", "bar"],
    selectedChart: "line",
    role: "2",
    dashBoardPage: "DEFAULT",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT", "DOWNLOADER"],
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
  // {
  //   orderValue: "9",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c010",
  //   size: "col-sm-6 col-md-6 col-lg-6 col-xl-12",
  //   widgetName: "TopOIGCodes",
  //   role: "2",
  //   dashBoardPage: "DEFAULT",
  //   selectedChart: "table",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  // },
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
  // {
  //   orderValue: "4",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c014",
  //   size: "col-sm-4 col-md-4 col-lg-6 col-xl-12",
  //   widgetName: "InvalidCredentails",
  //   widgetTypes: ["area", "line", "bar"],
  //   selectedChart: "line",
  //   role: "2",
  //   dashBoardPage: "INVALID",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  // },
  // {
  //   orderValue: "7",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c017",
  //   size: "col-sm-4 col-md-4 col-lg-6 col-xl-12",
  //   widgetName: "ScopeYearMis-match",
  //   widgetTypes: ["area", "line", "bar"],
  //   selectedChart: "line",
  //   role: "2",
  //   dashBoardPage: "INVALID",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  // },
  // {
  //   orderValue: "8",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c018",
  //   size: "col-sm-4 col-md-4 col-lg-6 col-xl-12",
  //   widgetName: "PatientDeceased",
  //   widgetTypes: ["area", "line", "bar"],
  //   selectedChart: "line",
  //   role: "2",
  //   dashBoardPage: "INVALID",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  // },
  // {
  //   orderValue: "9",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c019",
  //   size: "col-sm-4 col-md-4 col-lg-6 col-xl-12",
  //   widgetName: "MRNIDMismatch",
  //   widgetTypes: ["area", "line", "bar"],
  //   selectedChart: "line",
  //   role: "2",
  //   dashBoardPage: "INVALID",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  // },
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
  // {
  //   orderValue: "11",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c048",
  //   size: "col-sm-4 col-md-4 col-lg-6 col-xl-12",
  //   widgetName: "NoHccFound",
  //   widgetTypes: ["area", "line", "bar"],
  //   selectedChart: "line",
  //   role: "2",
  //   dashBoardPage: "INVALID",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  // },
  // {
  //   orderValue: "11",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c021",
  //   size: "col-sm-4 col-md-4 col-lg-6 col-xl-12",
  //   widgetName: "PatientIn-active",
  //   widgetTypes: ["area", "line", "bar"],
  //   selectedChart: "line",
  //   role: "2",
  //   dashBoardPage: "INVALID",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD", "CLIENT"],
  // },
];
export const WorkflowWidget = [
  // {
  //   orderValue: "1",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c022",
  //   widgetName: "OrgPieChartInfo",
  //   selectedChart: "donut",
  //   widgetTypes: ["donut", "bar", "line"],
  //   size: "col-sm-3 col-md-3 col-lg-4 col-xl-12 row-6",
  //   role: "2",
  //   dashBoardPage: "WORKFLOWS",
  //   title: "Organizations",
  // },
  {
    orderValue: "2",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c023",
    widgetName: "WorkFlowFiles",
    selectedChart: "line",
    widgetTypes: ["line", "bar"],
    size: "col-sm-9 col-md-9 col-lg-8 col-xl-12 row-6",
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
    title: "Coder 1 Status",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  },
  // {
  //   orderValue: "5",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c026",
  //   widgetName: "Coder 2",
  //   selectedChart: "donut",
  //   widgetTypes: ["donut", "bar", "line"],
  //   size: "col-sm-3 col-md-3 col-lg-3 col-xl-6 row-3",
  //   role: "2",
  //   dashBoardPage: "WORKFLOWS",
  //   title: "Coder 2 Status",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  // },
  // {
  //   orderValue: "6",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c027",
  //   widgetName: "QA",
  //   selectedChart: "donut",
  //   widgetTypes: ["donut", "bar", "line"],
  //   size: "col-sm-3 col-md-3 col-lg-3 col-xl-6 row-3",
  //   role: "2",
  //   dashBoardPage: "WORKFLOWS",
  //   title: "QA Status",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  // },
  // {
  //   orderValue: "7",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c028",
  //   widgetName: "Project Lead",
  //   selectedChart: "donut",
  //   widgetTypes: ["donut", "bar", "line"],
  //   size: "col-sm-3 col-md-3 col-lg-3 col-xl-6 row-3",
  //   role: "2",
  //   dashBoardPage: "WORKFLOWS",
  //   title: "Project Lead Status",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  // },
  // {
  //   orderValue: "8",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c029",
  //   widgetName: "QA Lead",
  //   selectedChart: "donut",
  //   widgetTypes: ["donut", "bar", "line"],
  //   size: "col-sm-3 col-md-3 col-lg-3 col-xl-6 row-3",
  //   role: "2",
  //   dashBoardPage: "WORKFLOWS",
  //   title: "QA Lead Status",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  // },
  // {
  //   orderValue: "9",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c036",
  //   widgetName: "Owner",
  //   selectedChart: "donut",
  //   widgetTypes: ["donut", "bar", "line"],
  //   size: "col-sm-3 col-md-3 col-lg-3 col-xl-6 row-3",
  //   role: "2",
  //   dashBoardPage: "WORKFLOWS",
  //   title: "Owner Status",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  // },
  // {
  //   orderValue: "10",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c037",
  //   widgetName: "Users",
  //   selectedChart: "donut",
  //   widgetTypes: ["donut", "line", "bar"],
  //   size: "col-sm-3 col-md-3 col-lg-3 col-xl-6 row-3",
  //   role: "2",
  //   dashBoardPage: "WORKFLOWS",
  //   title: "Users Status",
  //   rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  // },
  {
    orderValue: "11",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c038",
    widgetName: "Accuracy",
    size: "col-sm-9 col-md-9 col-lg-12 col-xl-12 row-4",
    role: "2",
    dashBoardPage: "WORKFLOWS",
    title: "Accuracy and Quality Insights",
    selectedChart: "table",
    rolesAccessList: ["ADMIN", "OWNER", "QA_LEAD", "PROJECT_LEAD"],
  },
  // {
  //   orderValue: "12",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c039",
  //   widgetName: "Notificatin",
  //   selectedChart: "Notificatin",
  //   size: "col-sm-3 col-md-3 col-lg-12 col-xl-12 row-4",
  //   role: "2",
  //   dashBoardPage: "WORKFLOWS",
  //   title: "Notifications",
  // },
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
    orderValue: "6",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c032",
    size: "col-sm-7 col-md-7 col-lg-12 col-xl-12 row-4",
    widgetName: "Accuracy",
    title: "User Quality Score",
    selectedChart: "line",
    role: "2",
    dashBoardPage: "WORKQUEUE",
    rolesAccessList: ["CODER_1", "CODER_2", "OWNER", "QA", "QA_LEAD"],
  },
  {
    orderValue: "7",
    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c033",
    size: "col-sm-5 col-md-5 col-lg-12 col-xl-12 row-4",
    widgetName: "Notifications",
    title: "Notifications",
    selectedChart: "line",
    role: "2",
    dashBoardPage: "WORKQUEUE",
    rolesAccessList: ["CODER_1", "CODER_2", "OWNER", "QA", "QA_LEAD"],
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
  // {
  //   orderValue: "6",
  //   widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c035",
  //   size: "col-sm-5 col-md-5 col-lg-12 col-xl-12 row-4",
  //   widgetName: "HoldStatus",
  //   title: "Hold Status",
  //   selectedChart: "line",
  //   role: "2",
  //   dashBoardPage: "WORKQUEUE",
  // },
];
//  last widgetId : acd1b072-3ca4-4bf2-8d32-973ab8c7c048 next continue with acd1b072-3ca4-4bf2-8d32-973ab8c7c049 for uniqueness

export const getColSpan = (cls = "", windowWidth) => {
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

export const getRowSpan = (cls = "") => {
  const match = cls.split(" ").find((c) => c.startsWith("row-"));
  return match ? +match.replace("row-", "") : 1;
};

export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
};

export const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth); // Initial set on mount

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
};

export const getFormattedChartData = (rawSeries, chartType) => {
  const categories = rawSeries.map((item) => item.name);
  const values = rawSeries.map((item) => item.value);
  const colors = rawSeries.map((item) => item.color);
  const legendData = rawSeries.map((item) => ({
    ...item,
    itemStyle: { color: item.color || item.itemStyle?.color },
  }));
  const formattedSeries =
    chartType === "bar" || chartType === "line"
      ? [
          {
            name: "Status",
            data: values,
            colorBy: "data",
            itemStyle: {
              color: (params) => colors[params.dataIndex],
            },
          },
        ]
      : rawSeries.map((item) => ({
          ...item,
          itemStyle: { color: item.color },
        }));

  return {
    categories,
    formattedSeries,
    legendData,
    height: chartType === "donut" ? 180 : 220,
  };
};

export const parseKValue = (val) => {
  if (typeof val === "string") {
    const num = parseFloat(val);
    if (val.toUpperCase().includes("K")) return num * 1_000;
    if (val.toUpperCase().includes("M")) return num * 1_000_000;
    if (val.toUpperCase().includes("B")) return num * 1_000_000_000;
    return num;
  }
  return typeof val === "number" ? val : 0;
};

export const formatKValue = (val) => {
  if (typeof val !== "number" || isNaN(val)) return "0";

  if (val >= 1_000_000_000) return (val / 1_000_000_000).toFixed(1) + "B";
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + "M";
  if (val >= 1_000) return (val / 1_000).toFixed(1) + "K";
  return val.toFixed(0);
};


export const toFixedNum = (value, precision = 2) => {
  return typeof value === "number" ? parseFloat(value?.toFixed(precision)) : 0;
};


export const roleAccessList = {
  Admin :   ["Default","Workflow","Invalid"],
  Owner :  ["Default","Workflow","Invalid"],
  Coder1 :  ["WorkQueue"],
  Coder2 : ["WorkQueue"],
  Qa :  ["WorkQueue"],
  Qalead : ["Default","Workflow","Invalid"],
  Projectlead : ["Default","Workflow","Invalid"],
  Downloader : ["Default"],
  Client : ["Default", "Workflow"]
}

export const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};
export const getWeeksInMonth = (year, month) => {
  const days = getDaysInMonth(year, month);
  const firstDay = new Date(year, month - 1, 1).getDay();
  return Math.ceil((days + firstDay) / 7);
};

export const getDateWeek = (date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayWeek = firstDayOfMonth.getDay();
  const currentDate = date.getDate();
  const startingWeek = Math.ceil((currentDate + firstDayWeek) / 7);
  return startingWeek;
};

export const filterWidgetsByRole = (widgets, selectedRole) => {
  if (!Array.isArray(widgets) || !selectedRole) return [];
  const format = (str) =>
    str.toLowerCase().replace(/[\s_]/g, "");
  const formattedSelectedRole = format(selectedRole);
  return widgets.filter((item) => {
    if (!item.rolesAccessList || item.rolesAccessList.length === 0) return true;

    return item.rolesAccessList
      .map((role) => format(role))
      .includes(formattedSelectedRole);
  });
};

export const getTotalChart = (series) => {
  return series.reduce((acc, item) => {
    return (item.name || item.status) === "Allocated" ? item.value : acc
  }, 0);
};