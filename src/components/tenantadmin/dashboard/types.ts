export interface Widget {
  active?: boolean;
  dashBoardPage: string;
  orderValue: string;
  role: string;
  selectedChart: string;
  size: string;
  title?: string;
  widgetId: string;
  widgetName: string;
  widgetTypes?: string[];
  empty?: boolean;
  rolesAccessList?: string[];
}

export type ReactChartType = "bar" | "line" | "pie" | "donut" | "area" | "stepline" | "table" | "card" | "count";

export type RoleType = 
  | "Admin" | "Coder1" | "Coder2" | "Owner" | "QA" | "QALead" | "ProjectLead"
  | "ADMIN" | "OWNER" | "CLIENT" | "CODER_1" | "CODER_2" | "QA_LEAD" | "PROJECT_LEAD" | "DOWNLOADER";

export interface DashboardTabs {
  Default: Widget[];
  Workflow: Widget[];
  WorkQueue: Widget[];
  Invalid: Widget[];
}

export interface DashboardStorage {
  [role: string]: DashboardTabs;
}

export interface ApiResponse<T = any> {
  response: T;
  status: string;
  message?: string;
}

export interface ReduxActionState<T = any> {
  loading: boolean;
  data: ApiResponse<T> | null;
  error: any;
}

export interface DashboardState {
  defaultTop10Codes: ReduxActionState;
  defaultTop10CodesLoader: boolean;
  defaultTop10OIG: ReduxActionState;
  defaultTop10OIGLoader: boolean;
  defaultFileDosCount: ReduxActionState;
  defaultFileDosCountLoader: boolean;
  defaultRafTotal: ReduxActionState;
  defaultRafTotalLoader: boolean;
  defaultRafHcc: ReduxActionState;
  defaultRafHccLoader: boolean;
  defaultRafCareGap: ReduxActionState;
  defaultRafCareGapLoader: boolean;
  defaultRafPotential: ReduxActionState;
  defaultRafPotentialLoader: boolean;
  defaultTinTable: ReduxActionState;
  defaultTinTableLoader: boolean;
  overallCountChart: ReduxActionState;
  overallCountChartLoader: boolean;
  inPatientDetailsChart: ReduxActionState;
  inPatientDetailsChartLoader: boolean;
  outPatientDetailsChart: ReduxActionState;
  outPatientDetailsChartLoader: boolean;
  workFlowFilesCount: ReduxActionState;
  workFlowFilesCountLoader: boolean;
  workFlowAllocatedStatusCount: ReduxActionState;
  workFlowAllocatedStatusCountLoader: boolean;
  workFlowCoder1StatusCount: ReduxActionState;
  workFlowCoder1StatusCountLoader: boolean;
  workFlowCoder2StatusCount: ReduxActionState;
  workFlowCoder2StatusCountLoader: boolean;
  workFlowQAStatusCount: ReduxActionState;
  workFlowQAStatusCountLoader: boolean;
  workFlowProjectLeadStatusCount: ReduxActionState;
  workFlowProjectLeadStatusCountLoader: boolean;
  workFlowOwnerStatusCount: ReduxActionState;
  workFlowOwnerStatusCountLoader: boolean;
  workFlowQALeadStatusCount: ReduxActionState;
  workFlowQALeadStatusCountLoader: boolean;
  workFlowUsersCount: ReduxActionState;
  workFlowUsersCountLoader: boolean;
  workFlowAccuracy: ReduxActionState;
  workFlowAccuracyLoader: boolean;
  workFlowAllocationStatus: ReduxActionState;
  workFlowAllocationStatusLoader: boolean;
  productivityStatusChart: ReduxActionState;
  productivityStatusChartLoader: boolean;
  workQueueSummary: ReduxActionState;
  workQueueSummaryLoader: boolean;
  workQueueDailySummary: ReduxActionState;
  workQueueDailySummaryLoader: boolean;
  workQueueProductivity: ReduxActionState;
  workQueueProductivityLoader: boolean;
  workQueueAccuracy: ReduxActionState;
  workQueueAccuracyLoader: boolean;
  dashboardNotification: ReduxActionState;
  dashboardNotificationLoader: boolean;
  getInvalidDosCount: ReduxActionState;
  getInvalidDosCountLoader: boolean;
  getInvalidDocument: ReduxActionState;
  getInvalidDocumentLoader: boolean;
  getInvalidTelevist: ReduxActionState;
  getInvalidTelevistLoader: boolean;
  getInvalidCredentails: ReduxActionState;
  getInvalidCredentailsLoader: boolean;
  getInvalidProviderMissed: ReduxActionState;
  getInvalidProviderMissedLoader: boolean;
  getInvalidProviderSignMissed: ReduxActionState;
  getInvalidProviderSignMissedLoader: boolean;
  getInvalidNoHccFound: ReduxActionState;
  getInvalidNoHccFoundLoader: boolean;
  getInvalidPatientDOBMismatch: ReduxActionState;
  getInvalidPatientDOBMismatchLoader: boolean;
  getInvalidPatientNameMismatch: ReduxActionState;
  getInvalidPatientNameMismatchLoader: boolean;
  getInvalidScopeYearMisMatch: ReduxActionState;
  getInvalidScopeYearMisMatchLoader: boolean;
  getInvalidPatientDeceased: ReduxActionState;
  getInvalidPatientDeceasedLoader: boolean;
  getInvalidMrnIdMismatch: ReduxActionState;
  getInvalidMrnIdMismatchLoader: boolean;
  getInvalidMultiplePatientFound: ReduxActionState;
  getInvalidMultiplePatientFoundLoader: boolean;
  getInvalidPatientInActive: ReduxActionState;
  getInvalidPatientInActiveLoader: boolean;
  setWidgets: ReduxActionState;
  setWidgetsLoader: boolean;
  getWidgets: ReduxActionState;
  getWidgetsLoader: boolean;
  getWidgetsList: ReduxActionState;
  getWidgetsListLoader: boolean;
  getTabAccess: ReduxActionState;
  getTabAccessLoader: boolean;
  getUserDropDown: ReduxActionState;
  getUserDropDownLoader: boolean;
  organizationStatus: ReduxActionState;
  organizationStatusLoader: boolean;
  holdStatus: ReduxActionState;
  holdStatusLoader: boolean;
}

export interface RootState {
  dashboardReducer: DashboardState;
}
