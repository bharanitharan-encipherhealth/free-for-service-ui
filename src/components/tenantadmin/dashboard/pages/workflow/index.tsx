"use client"
import { connect, ConnectedProps } from "react-redux";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import {
  getFormattedChartData,
  getTotalChart,
  useHasMounted,
  useWindowWidth,
  getColSpan,
  getRowSpan,
  WorkflowWidget
} from "../../component/function";
import dashboardActions from "@/state/tenantadmin/dashboard/actions";
import {
  getColorValue,
  getRoleIdByRole,
  getStatusColor,
} from "@/util/reusableFunction";
import CardSkeleton from "@/components/skeleton/card";
import { RootState, Widget } from "../../types";

const AppChart = dynamic(() => import("../../component/appchart"), { ssr: false });
const AccuracyChart = dynamic(() => import("../../component/accuracyChart"), { ssr: false });
const StatCard = dynamic(() => import("../../component/statChart"), { ssr: false });

const processing = "/images/tenantAdmin/processing.svg";
const failed = "/images/tenantAdmin/failed.svg";
const completed = "/images/tenantAdmin/completed.svg";
const processingContainer = "/images/dashboard/processingContainer.webp";
const completedContainer = "/images/dashboard/completedContainer.webp";
const failedContainer = "/images/dashboard/failedContainer.webp";

const mapState = (state: RootState) => ({
  filesCountData: state.dashboardReducer.workFlowFilesCount?.data?.response,
  filesCountDataLoading: state.dashboardReducer.workFlowFilesCountLoader,
  allocatedStatusCountData: state.dashboardReducer.workFlowAllocatedStatusCount?.data?.response,
  allocatedStatusCountDataLoading: state.dashboardReducer.workFlowAllocatedStatusCountLoader,
  coder1StatusCountData: state.dashboardReducer.workFlowCoder1StatusCount?.data?.response,
  coder1StatusCountDataLoading: state.dashboardReducer.workFlowCoder1StatusCountLoader,
  coder2StatusCountData: state.dashboardReducer.workFlowCoder2StatusCount?.data?.response,
  coder2StatusCountDataLoading: state.dashboardReducer.workFlowCoder2StatusCountLoader,
  qaStatusCountData: state.dashboardReducer.workFlowQAStatusCount?.data?.response,
  qaStatusCountDataLoading: state.dashboardReducer.workFlowQAStatusCountLoader,
  projectLeadStatusCountData: state.dashboardReducer.workFlowProjectLeadStatusCount?.data?.response,
  projectLeadStatusCountDataLoading: state.dashboardReducer.workFlowProjectLeadStatusCountLoader,
  ownerStatusCountData: state.dashboardReducer.workFlowOwnerStatusCount?.data?.response,
  ownerStatusCountDataLoading: state.dashboardReducer.workFlowOwnerStatusCountLoader,
  qaLeadStatusCountData: state.dashboardReducer.workFlowQALeadStatusCount?.data?.response,
  qaLeadStatusCountDataLoading: state.dashboardReducer.workFlowQALeadStatusCountLoader,
  usersStatusCountData: state.dashboardReducer.workFlowUsersCount?.data?.response,
  usersStatusCountDataLoading: state.dashboardReducer.workFlowUsersCountLoader,
  accuracyData: state.dashboardReducer.workFlowAccuracy?.data?.response,
  accuracyDataLoading: state.dashboardReducer.workFlowAccuracyLoader,
  getSelectedWidgets: state.dashboardReducer.getWidgets?.data?.response as Widget[] | undefined,
});

const mapDispatch = { dispatch: (action: any) => action };
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface WorkflowPageProps extends PropsFromRedux {
  selectedRole: string;
  dateRange: { startDate: string; endDate: string };
  selectedValue?: string;
  customDate?: any;
}

const getCharts = (params: any) => {
  const { type, chartType, filesCountData, dates, accuracyData, allocatedStatusCountData, allocatedStatusCountDataLoading, coder1StatusCountData, coder2StatusCountData, qaStatusCountData, qaLeadStatusCountData, projectLeadStatusCountData, ownerStatusCountData } = params;

  switch (type) {
    case "WorkFlowFiles":
      const { computedFiles = 0, failedFiles = 0, processingFiles = 0, computedStats = [], failedStats = [], processingStats = [] } = filesCountData || {};
      const fileCards = [
        { icon: processing, title: "AI Processing", value: processingFiles, bgColor: "linear-gradient(129.12deg, #03512E -5.66%, rgba(3, 81, 46, 0.5) 102.29%)", iconColor: "#d0ccff" },
        { icon: completed, title: "AI Completed", value: computedFiles, bgColor: "linear-gradient(126.88deg, #87C282 -2.24%, rgba(135, 194, 130, 0.5) 104.92%)", iconColor: "#adffb5" },
        { icon: failed, title: "AI Failed", value: failedFiles, bgColor: "linear-gradient(128.05deg, #5ABA8A -8.93%, rgba(90, 186, 138, 0.5) 97.89%)", iconColor: "#ffdbcc" },
      ];
      return (
        <>
          <div className="flex justify-between flex-wrap gap-3">
            {fileCards.map((c, i) => <StatCard key={i} {...c} padding="16px" minWidth="220px" gap="12px" display="flex" alignItems="center" justifyContent="center" borderRadius="14px" height="63px" fontSize="20px" fontWeight={700} textColor="white" border="4px solid #B3B3B3" />)}
          </div>
          <AppChart type={chartType} categories={dates} series={[
            { name: "Completed", data: computedStats, color: getColorValue("2") || undefined, plotConfig: { key: "date", value: "count", dates } },
            { name: "Processing", data: processingStats, color: getColorValue("3") || undefined, plotConfig: { key: "date", value: "count", dates } },
            { name: "Failed", data: failedStats, color: getColorValue("1") || undefined, plotConfig: { key: "date", value: "count", dates } }
          ]} />
        </>
      );
    case "AllocatedStatus":
      const allocated = [{ name: "Allocated", value: allocatedStatusCountData?.allocatedCount || 0, color: getStatusColor("1") }, { name: "Not Allocated", value: allocatedStatusCountData?.notAllocatedCount || 0, color: getStatusColor("2") }];
      const { categories: ac, formattedSeries: as, height: ah } = getFormattedChartData(allocated, chartType);
      return allocatedStatusCountDataLoading ? <CardSkeleton count={1} height={200} /> : <AppChart type={chartType} categories={ac} series={as} height={ah} showLegend />;

    case "Coder 1":
    case "Coder 2":
    case "QA":
    case "Project Lead":
    case "QA Lead":
    case "Owner":
      const statusData = type === "Coder 1" ? coder1StatusCountData : type === "Coder 2" ? coder2StatusCountData : type === "QA" ? qaStatusCountData : type === "Project Lead" ? projectLeadStatusCountData : type === "QA Lead" ? qaLeadStatusCountData : ownerStatusCountData;
      const seriesData = [
        { name: "Allocated", value: statusData?.allocatedCount || 0, color: getStatusColor("1") },
        { name: "Completed", value: statusData?.completedCount || 0, color: getStatusColor("2") },
        { name: "InProgress", value: statusData?.pendingCount || 0, color: getStatusColor("3") },
      ];
      const { categories: sc, formattedSeries: ss, height: sh } = getFormattedChartData(seriesData, chartType);
      return <AppChart type={chartType} categories={sc} series={ss} height={sh} showLegend xAxisRotated total={getTotalChart(seriesData)} />;

    case "Accuracy":
      const accuracyList = accuracyData?.accuracyResultDTOList || [];
      const accuracyChart = [
        { name: "Total Codes Count", data: accuracyList.map((item: any) => ({ date: item.date, value: +(item.correctedCodes?.toFixed?.(2) ?? 0) })), color: "#2472FF", type: "column" },
        { name: "Engine Score", data: accuracyList.map((item: any) => ({ date: item.date, value: +(item.machineAccuracy?.toFixed?.(2) ?? 0) })), color: "#2CAFFE", type: "spline" }
      ];
      return <div className="grid grid-cols-12 gap-4"><div className="col-span-12"><AccuracyChart yAxis1Title="Accuracy" yAxis2Title="Total Codes" customDate={dates} series={accuracyChart} /></div></div>;

    default: return null;
  }
};

const WorkflowPage: React.FC<WorkflowPageProps> = (props) => {
  const { dateRange, selectedRole, dispatch, getSelectedWidgets } = props;
  const windowWidth = useWindowWidth();
  const hasMounted = useHasMounted();

  const handleApiCalls = async (actionType: string, params: any) => {
    const actionKey = `${actionType}Action`;
    const action = (dashboardActions as any)[actionKey];
    if (typeof action === "function") {
      return await dispatch(action(params));
    }
  };

  useEffect(() => {
    const roleId = getRoleIdByRole(selectedRole.toUpperCase().replaceAll(" ", "_"));
    const params = { role: roleId, startDate: dateRange.startDate, endDate: dateRange.endDate, dashBoardPage: "WORKFLOWS" };
    handleApiCalls("workFlowFilesCount", params);
    handleApiCalls("workFlowAllocatedStatusCount", params);
    handleApiCalls("workFlowCoder1StatusCount", params);
    handleApiCalls("workFlowCoder2StatusCount", params);
    handleApiCalls("workFlowQAStatusCount", params);
    handleApiCalls("workFlowProjectLeadStatusCount", params);
    handleApiCalls("workFlowOwnerStatusCount", params);
    handleApiCalls("workFlowQALeadStatusCount", params);
    handleApiCalls("workFlowUsersCount", params);
    handleApiCalls("workFlowAccuracy", params);
    handleApiCalls("getWidgets", { role: roleId, dashBoardPage: "WORKFLOWS" });
  }, [dateRange, selectedRole]);

  if (!hasMounted) return <CardSkeleton count={4} height={300} />;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16, padding: "0 10px" }}>
      {(getSelectedWidgets || WorkflowWidget)?.filter((w: any) => w.active !== false).sort((a: any, b: any) => Number(a.orderValue) - Number(b.orderValue)).map((item: any, i: number) => (
        <div key={i} style={{ gridColumn: `span ${getColSpan(item.size, windowWidth)}`, gridRow: `span ${getRowSpan(item.size)}`, height: "100%" }}>
          <div className="bg-white border rounded shadow-sm overflow-hidden h-full">
            <div className="p-3 font-bold text-lg">{item.title || item.widgetName}</div>
            <div className="p-3">
              {getCharts({ ...props, type: item.widgetName, chartType: item.selectedChart, dates: props.customDate, windowWidth })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default connector(WorkflowPage);
