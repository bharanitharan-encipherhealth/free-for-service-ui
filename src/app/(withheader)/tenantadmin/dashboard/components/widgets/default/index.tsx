import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { DashboardState } from "@/state/admin/dashboard/model";
import actions from "@/state/admin/dashboard/actions";

/* ===================== TYPES ===================== */

export interface DashboardWidget {
  widgetId: string;
  orderValue: number;
  active: boolean;
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
  dateRange?: any;
  dashboardData?: DashboardState["getWidgets"];
  dispatch: Dispatch;
}

function Index({
  selectedRole,
  dashboardData,
  dateRange,
  dispatch,
}: IndexProps) {
  console.log(
    "selectedRole in default widget:",
    selectedRole,
    dashboardData?.data?.response,
    dateRange,
  );

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
  ];

  const apiKeys = api.filter((item) =>
    item.widgetId.some((id) =>
      showDashboard.some((widget) => widget.widgetId === id),
    ),
  );

  // const apiKeys = api;

  const getInitialApiCall = async () => {
    // debugger;
    // if (!dateRange?.startDate || !dateRange?.endDate) return;

    try {
      const params: DateRange = {
        startDate: "2026-01-03T18:30:00.000Z",
        endDate: "2026-02-02T18:29:59.999Z",
      };

      for (const item of apiKeys) {
        const actionKey = `${item.key}Action`;
        const action = actions[actionKey];
        if (action) dispatch(action(params));
        console.log("Dispatched action:", actionKey);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    getInitialApiCall();
  }, []);

  return <div />;
}

/* ===================== REDUX ===================== */

export default connect((state: { dashboardReducer: DashboardState }) => ({
  dashboardData: state.dashboardReducer?.getWidgets,
}))(Index);
