import {
  clientDetailsTypes,
  clinetDetailsDropDowntypes,
  projectDetailsDropDownTypes,
  roleResponseType,
  tinDropDownResponseType,
} from "@/models/(withoutheader)/projects";
import { WidgtetsResponseData } from "@/models/dashboard";
import {
  DefaultFileDosCount,
  defaultFileDosCount,
  DefaultRafCarGapCount,
  defaultRafTotal,
  DefaultTop10Codes,
} from "@/models/dashboard/widgets/default";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface AsyncState<T = any> {
  loading: boolean;
  data: T | null;
  error: any;
}

export interface GetWidgetsResponse {
  widgets: dashboardTypes["getWidgtetsData"]["data"];
  top10Codes: dashboardTypes["defaultTop10Codes"]["data"];
  fileDosCount: dashboardTypes["defaultFileDosCount"]["data"];
  rafTotal:dashboardTypes["defaultRafTotal"]["data"]
  rafCareGap:dashboardTypes["defaultRafCareGap"]["data"]
}

export interface CodesAndRafSummaryDTO {
  date: string;             // e.g., "2026-01-29"
  totalCount: number;
  hccCount: number;
  suggestedCount: number;
  potentialCount: number;
  totalRaf: number;
  hccRafScore: number;
  suggestedRafScore: number;
  potentialRafScore: number;
  totalPremium: number;
  hccPremium: number;
  suggestedPremium: number;
  potentialPremium: number;
}


export interface DashboardState {
  getWidgets: AsyncState<GetWidgetsResponse["widgets"]> | null | undefined;
  getWidgetsLoader: AsyncState<boolean>;
  defaultTop10Codes:
    | AsyncState<GetWidgetsResponse["top10Codes"]>
    | null
    | undefined;
  defaultFileDosCount:
    | AsyncState<GetWidgetsResponse["fileDosCount"]>
    | null
    | undefined;
  defaultRafTotal:
    | AsyncState<GetWidgetsResponse["rafTotal"]>
    | null
    | undefined;
  defaultRafCareGap:
    | AsyncState<GetWidgetsResponse["rafCareGap"]>
    | null
    | undefined;
}

export default class dashboardTypes {
  getWidgtetsData: {
    data: WidgtetsResponseData;
    error?: string | null;
    loading: boolean;
  };

  defaultTop10Codes: {
    data: DefaultTop10Codes;
    error?: string | null;
    loading: boolean;
  };

  defaultFileDosCount: {
    data: defaultFileDosCount;
    error?: string | null;
    loading: boolean;
  };

  defaultRafTotal:{
    data:defaultRafTotal;
    error?: string | null;
    loading: boolean;
  }
  defaultRafCareGap:{
    data:DefaultRafCarGapCount;
    error?: string | null;
    loading: boolean;
  }

  constructor(
    getWidgtetsData: {
      data: {
        status: "";
        message: "";
        response: [
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
          },
        ];
      };
      loading: boolean;
    },
    defaultTop10Codes: {
      data: {
        status: "";
        message: "";
        response: {
          topDiseaseDTOList: [];
          totalCount: 0;
          topDiseaseTotalCount: 0;
        };
      };
      loading: boolean;
    },
    defaultFileDosCount: {
      data: {
        status: "";
        message: "";
        response: {
          codesAndRafSummaryDTOList: null;
          dosCount: 0;
          fileCount: 0;
          overallCodesCount: 0;
          overallPremium: 0;
          overallRaf: 0;
          pageCount: 0;
          tinCount: 0;
          tinStatisticsResponseDtoList: null;
        };
      };
      loading: boolean;
    },
    defaultRafTotal: {
      data: {
        status: "";
        message: "";
        response: {
          codesAndRafSummaryDTOList: [];
          dosCount: 0;
          fileCount: 0;
          overallCodesCount: 0;
          overallPremium: 0;
          overallRaf: 0;
          pageCount: 0;
          tinCount: 0;
          tinStatisticsResponseDtoList: null;
        };
      };
      loading:false
    },
    defaultRafCareGap:{
      data:{
        status: "";
        message: "";
        response:{
        fileCount: 0,
        dosCount: 0,
        pageCount: 0,
        codesAndRafSummaryDTOList:CodesAndRafSummaryDTO[],
        overallCodesCount:0,
        overallRaf: 0,
        overallPremium: 0,
        tinStatisticsResponseDtoList: null,
        tinCount: 0
        }
      }
      loading:false
    }
  ) {
    this.getWidgtetsData = getWidgtetsData;
    this.defaultTop10Codes = defaultTop10Codes;
    this.defaultFileDosCount = defaultFileDosCount;
    this.defaultRafTotal = defaultRafTotal;
    this.defaultRafCareGap = defaultRafCareGap;
  }
}
