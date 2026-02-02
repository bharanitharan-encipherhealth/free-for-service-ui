
export interface DashboardWidget {
  createdDate: string;
  lastModifiedDate: string; 
  active: boolean;
  version: number;
  createdBy: string;
  lastModifiedBy: string;
  id: string;
  widgetId: string;
  title: string | null;
  size: string;
  widgetName: string;
  widgetTypes: Array<"bar" | "line" | "donut" | "card">;
  selectedChart: "bar" | "line" | "donut" | "card";
  role: string;
  dashBoardPage: "DEFAULT" | string;
  orderValue: number;
  endpoint: string | null;
  rolesAccessList: Array<
    "ADMIN" | "OWNER" | "QA_LEAD" | "PROJECT_LEAD" | "CLIENT"
  >;
}

export interface WidgtetsResponseData {
    status: string;
    message: string;
    response: DashboardWidget[] | null | undefined;
}