"use client"
import { connect, ConnectedProps } from "react-redux";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import moment from "moment";
import { 
  getFormattedChartData, 
  getTotalChart, 
  useHasMounted, 
  useWindowWidth, 
  getColSpan, 
  getRowSpan,
  workQueueWidget 
} from "../../component/function";
import dashboardActions from "@/state/tenantadmin/dashboard/actions";
import { getColorValue, getRoleIdByRole } from "@/util/reusableFunction";
import CardSkeleton from "@/components/skeleton/card";
import { FaTachometerAlt } from "react-icons/fa";
import { Buttons } from "@/util/dashboardConstants";
import { RootState, Widget } from "../../types";

const AppChart = dynamic(() => import("../../component/appchart"), { ssr: false });
const YearPicker = dynamic(() => import("@/components/yearpicker"), { ssr: false });
const Buttonscroller = dynamic(() => import("@/components/buttonSroller"), { ssr: false });
const StatusCard = dynamic(() => import("../../component/statusCard"), { ssr: false });

const mapState = (state: RootState) => ({
  userSummary: state.dashboardReducer.workQueueSummary?.data?.response,
  userSummaryLoading: state.dashboardReducer.workQueueSummaryLoader,
  userDailySummary: state.dashboardReducer.workQueueDailySummary?.data?.response,
  userDailySummaryLoading: state.dashboardReducer.workQueueDailySummaryLoader,
  accuracyData: state.dashboardReducer.workQueueAccuracy?.data?.response,
  accuracyDataLoading: state.dashboardReducer.workQueueAccuracyLoader,
  productivityData: state.dashboardReducer.workQueueProductivity?.data?.response,
  productivityDataLoading: state.dashboardReducer.workQueueProductivityLoader,
  getSelectedWidgets: state.dashboardReducer.getWidgets?.data?.response as Widget[] | undefined,
});

const mapDispatch = { dispatch: (action: any) => action };
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface WorkQueuePageProps extends PropsFromRedux {
  selectedRole: string;
}

const getCharts = (params: any) => {
  const { type, chartType, userSummary, userSummaryLoading, accuracyDataLoading, accuracyState, handleButtonClick, handleMonthChange, handleYearChange, selectedRole } = params;

  switch (type) {
    case "WorkFlow":
      const summary = [
        { status: "Allocated", value: userSummary?.allocatedCount || 0 },
        { status: "InProgress", value: userSummary?.pendingCount || 0 },
        { status: "Completed", value: userSummary?.completedCount || 0 },
      ];
      if (chartType === "card") {
        return userSummaryLoading ? <CardSkeleton count={1} height={200} /> : (
          <div className="flex flex-wrap -mx-1">
            {summary.map((item, i) => <div key={i} className={i === 0 ? "w-full" : "w-1/2 px-1"}><StatusCard status={item.status} value={item.value} coderName={selectedRole} /></div>)}
          </div>
        );
      }
      const { categories: wc, formattedSeries: ws, height: wh } = getFormattedChartData(summary.map(s => ({ name: s.status, value: s.value, color: getColorValue("1") })), chartType);
      return <AppChart type={chartType} categories={wc} series={ws} height={wh} showLegend xAxisRotated total={getTotalChart(summary)} />;

    case "Accuracy":
      return (
        <>
          <div className="flex justify-end gap-4 w-full">
            <YearPicker onChangeYear={(d: any, s: any) => handleYearChange("Accuracy", d, s)} onChangeMonth={(d: any) => handleMonthChange("Accuracy", d)} type={accuracyState.currentBtn} val={accuracyState.month} val1={accuracyState.year} />
            <Buttonscroller 
              Buttons={Buttons} 
              handleButtonClick={(i: number, b: any) => handleButtonClick("Accuracy", i, b)} 
              activeButton={accuracyState.activeButton} 
              activeBg="#2472FF" 
              containerBg="#E6EEFF"
              activeColor="white"
              inActiveColor="black"
              inActiveBg="#f0f0f0"
              width={true}
            />
          </div>
          {accuracyDataLoading ? <CardSkeleton count={1} height={210} /> : (
            <div className="flex flex-wrap -mx-2">
              <div className="w-9/12 px-2"><AppChart type={chartType} categories={[]} series={[{ name: "Accuracy", data: [], color: "#2CAFFE" }]} /></div>
              <div className="w-3/12 px-2 py-4"><div className="border rounded p-5 bg-blue-50 text-center"><FaTachometerAlt className="mx-auto mb-2" /><div>Average Quality</div><h2 className="text-2xl font-bold">95%</h2></div></div>
            </div>
          )}
        </>
      );

    default: return null;
  }
};

const WorkQueuePage: React.FC<WorkQueuePageProps> = (props) => {
  const { selectedRole, dispatch, getSelectedWidgets } = props;
  const windowWidth = useWindowWidth();
  const hasMounted = useHasMounted();

  const [accuracyState, setAccuracyState] = useState({ currentBtn: "Daily", activeButton: 0, year: moment(), month: moment() });
  const [productivityState, setProductivityState] = useState({ currentBtn: "Daily", activeButton: 0, year: moment(), month: moment() });

  const handleButtonClick = (type: string, index: number, button: any) => {
    if (type === "Accuracy") {
      setAccuracyState(prev => ({ ...prev, activeButton: index, currentBtn: button.value }));
    } else {
      setProductivityState(prev => ({ ...prev, activeButton: index, currentBtn: button.value }));
    }
  };

  const handleMonthChange = (type: string, date: any) => {
    if (type === "Accuracy") {
      setAccuracyState(prev => ({ ...prev, month: date }));
    } else {
      setProductivityState(prev => ({ ...prev, month: date }));
    }
  };

  const handleYearChange = (type: string, date: any, selection: any) => {
    if (type === "Accuracy") {
      setAccuracyState(prev => ({ ...prev, year: date }));
    } else {
      setProductivityState(prev => ({ ...prev, year: date }));
    }
  };

  useEffect(() => {
    const roleId = getRoleIdByRole(selectedRole.toUpperCase().replaceAll(" ", "_"));
    const action = (dashboardActions as any).workQueueSummaryAction;
    if (typeof action === "function") {
      dispatch(action({ role: roleId }));
    }
    const widgetAction = (dashboardActions as any).getWidgetsAction;
    if (typeof widgetAction === "function") {
      dispatch(widgetAction({ role: roleId, dashBoardPage: "WORKQUEUE" }));
    }
  }, [selectedRole]);

  if (!hasMounted) return <CardSkeleton count={4} height={300} />;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16, padding: "0 10px" }}>
      {(getSelectedWidgets || workQueueWidget).filter((w: any) => w.active !== false).sort((a: any, b: any) => Number(a.orderValue) - Number(b.orderValue)).map((item: any, i: number) => (
        <div key={i} style={{ gridColumn: `span ${getColSpan(item.size, windowWidth)}`, gridRow: `span ${getRowSpan(item.size)}`, height: "100%" }}>
          <div className="bg-white border rounded shadow-sm overflow-hidden h-full">
            <div className="p-3 font-bold text-lg">{item.title || item.widgetName}</div>
            <div className="p-3">
              {getCharts({ ...props, type: item.widgetName, chartType: item.selectedChart, accuracyState, productivityState, handleButtonClick, handleMonthChange, handleYearChange, windowWidth, selectedRole })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default connector(WorkQueuePage);
