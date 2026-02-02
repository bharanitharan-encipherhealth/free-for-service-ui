import { createAction } from "redux-actions";
import { createActionThunk } from "@/util/redux";
import { fetchFromEndpoint, fetchFromEndpointPost } from "./network";

type ApiDefinition = {
  key: string;
  endpoint: string;
  isPost?: boolean;
}
type ThunkActionCreator = (params?: any) => any;

type ActionsMap = {
  [key: string]: ThunkActionCreator;
};

// List of endpoints with optional fixed params
const apiDefinitions: ApiDefinition[] = [
  //default apis
  {key: "defaultTop10Codes", endpoint: "dashboard/default/top10-codes"},
  {key: "defaultTop10OIG", endpoint: "dashboard/default/top10-oig"},
  {key: "defaultFileDosCount", endpoint: "dashboard/default/file-dos-count"},
  {key: "defaultRafTotal", endpoint: "dashboard/default/raf-total"},
  {key: "defaultRafHcc", endpoint: "dashboard/default/raf-hcc"},
  {key: "defaultRafCareGap", endpoint: "dashboard/default/raf-caregap"},
  {key: "defaultRafPotential", endpoint: "dashboard/default/raf-potential"},
  {key: "defaultTinTable", endpoint: "dashboard/default/tindetails"},
  //workflow apis
  {key: "workFlowFilesCount", endpoint: "dashboard/workflow/files-count"},
  {key: "workFlowAllocatedStatusCount", endpoint: "dashboard/workflow/allocated-status"},
  {key: "workFlowCoder1StatusCount", endpoint: "dashboard/workflow/user-summary"},
  {key: "workFlowCoder2StatusCount", endpoint: "dashboard/workflow/user-summary"},
  {key: "workFlowQAStatusCount", endpoint: "dashboard/workflow/user-summary"},
  {key: "workFlowProjectLeadStatusCount", endpoint: "dashboard/workflow/user-summary"},
  {key: "workFlowOwnerStatusCount", endpoint: "dashboard/workflow/user-summary"},
  {key: "workFlowQALeadStatusCount", endpoint: "dashboard/workflow/user-summary"},
  {key: "workFlowUsersCount", endpoint: "dashboard/workflow/users-count"},
  {key: "workFlowAccuracy", endpoint: "dashboard/workflow/accuracy"},
  //workQueue apis
  { key: "workQueueSummary", endpoint: "dashboard/workqueue/user-summary" },
  {
    key: "workQueueDailySummary",
    endpoint: "dashboard/workqueue/user-summary/daily",
  },
  {
    key: "workQueueProductivity",
    endpoint: "dashboard/workqueue/user-productivity",
  },
  { key: "workQueueAccuracy", endpoint: "dashboard/workqueue/user-accuracy" },
  { key: "dashboardNotification", endpoint: "notification/getbyuserto" },
  { key: "workFlow", endpoint: "user/getusercountbyrole" },
  { key: "dailyTask", endpoint: "user/get?userName=" },
  { key: "accuracy", endpoint: "user/getusercountbyrole" },
  { key: "completedScore", endpoint: "user/getusercountbyrole" },
  { key: "holdStatus", endpoint: "user/getusercountbyrole" },
  { key: "notification", endpoint: "user/getusercountbyrole" },
  { key: "tenentLogo", endpoint: "user/getusercountbyrole" },
  { key: "teamChart", endpoint: "user/getusercountbyrole" },
  { key: "getSelectUserList", endpoint: "user/getusercountbyrole" },
  { key: "getDeliveryStatus", endpoint: "user/getusercountbyrole" },
  { key: "getDateRange", endpoint: "user/getusercountbyrole" },
  { key: "getInvalidDosCount", endpoint: "invalid/dashboard/count/flag" },
  { key: "getInvalidDocument", endpoint: "invalid/dashboard/count/flag" },
  { key: "getInvalidTelevist", endpoint: "invalid/dashboard/count/flag" },
  { key: "getInvalidCredentails", endpoint: "invalid/dashboard/count/flag" },
  { key: "getInvalidProviderMissed", endpoint: "invalid/dashboard/count/flag" },
  { key: "getInvalidProviderSignMissed", endpoint: "invalid/dashboard/count/flag" },
  { key: "getInvalidNoHccFound", endpoint: "invalid/dashboard/count/flag" },
  {
    key: "getInvalidPatientDOBMismatch",
    endpoint: "invalid/dashboard/count/flag",
  },
  {
    key: "getInvalidPatientNameMismatch",
    endpoint: "invalid/dashboard/count/flag",
  },
  {
    key: "getInvalidScopeYearMisMatch",
    endpoint: "invalid/dashboard/count/flag",
  },
  {
    key: "getInvalidPatientDeceased",
    endpoint: "invalid/dashboard/count/flag",
  },
  { key: "getInvalidMrnIdMismatch", endpoint: "invalid/dashboard/count/flag" },
  {
    key: "getInvalidMultiplePatientFound",
    endpoint: "invalid/dashboard/count/flag",
  },
  {
    key: "getInvalidPatientInActive",
    endpoint: "invalid/dashboard/count/flag",
  },
  { key: "setWidgets", endpoint: "widget/save", isPost: true },
  { key: "getWidgets", endpoint: "widget/get" },
  { key: "getWidgetsList", endpoint: "widget/get" },
  { key: "getTabAccess", endpoint: "widget/role-pageaccess" },
];

const actions: ActionsMap = {};

apiDefinitions.forEach(({ key, endpoint, isPost = false }) => {
  if (isPost) {
    actions[`${key}Action`] = createActionThunk(key.toUpperCase(), (params: any) =>
      fetchFromEndpointPost({ endpoint, params })
    );
  } else {
    actions[`${key}Action`] = createActionThunk(key.toUpperCase(), (params: any) =>
      fetchFromEndpoint({ endpoint, params })
    );
  }
});

export default actions;
