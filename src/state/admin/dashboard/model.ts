import {
  clientDetailsTypes,
  clinetDetailsDropDowntypes,
  projectDetailsDropDownTypes,
  roleResponseType,
  tinDropDownResponseType,
} from "@/models/(withoutheader)/projects";
import { WidgtetsResponseData } from "@/models/dashboard";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface AsyncState<T = any> {
  loading: boolean;
  data: T | null;
  error: any;
}

export interface GetWidgetsResponse {
  widgets: dashboardTypes["getWidgtetsData"]["data"];
}

export interface DashboardState {
  getWidgets: AsyncState<GetWidgetsResponse["widgets"]> | null | undefined;
  getWidgetsLoader: AsyncState<boolean>;
} 

export default class dashboardTypes {
    getWidgtetsData: {
    data: WidgtetsResponseData;
    error?: string | null;
    loading: boolean;
  };

  constructor(getWidgtetsData:{
    data:{
        status: "";
        message: "";
        response:[
            {
                createdDate: "";
                lastModifiedDate: "";
                active: true;
                version: 0;
                createdBy: "";
                lastModifiedBy: "";
                id: "";
                widgetId: "";
                title: null;
                size: "";
                widgetName: "";
                widgetTypes: Array<"bar" | "line" | "donut" | "card">;
                selectedChart: "bar" | "line" | "donut" | "card";
                role: "";
                dashBoardPage: "DEFAULT";
                orderValue: 0;
                endpoint: null;
                rolesAccessList: Array<
                  "ADMIN" | "OWNER" | "QA_LEAD" | "PROJECT_LEAD" | "CLIENT"
                >;
            }
        ] ;
    };
    loading: boolean;
    }
   ) {this.getWidgtetsData = getWidgtetsData;}
}
