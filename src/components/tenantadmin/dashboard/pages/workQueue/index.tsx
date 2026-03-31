"use client";
import { connect, ConnectedProps } from "react-redux";
import { useEffect, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import moment from "moment";
import { Card, Modal, Skeleton } from "antd";
import {
  getFormattedChartData,
  getTotalChart,
  useHasMounted,
  useWindowWidth,
  getColSpan,
  getRowSpan,
  workQueueWidget,
  getDaysInMonth,
  getWeeksInMonth,
} from "../../component/function";
import dashboardActions from "@/state/tenantadmin/dashboard/actions";
import {
  getColorValue,
  getRoleIdByRole,
  statusFormate,
  formatDateTime,
} from "@/util/reusableFunction";
import CardSkeleton from "@/components/skeleton/card";
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCalendarOutline,
  IoSpeedometerOutline
} from "react-icons/io5";
import { Buttons } from "@/util/dashboardConstants";
import { RootState, Widget } from "../../types";
import { getStorage } from "@/util/storage";

const AppChart = dynamic(() => import("../../component/appchart"), { ssr: false });
const YearPicker = dynamic(() => import("@/components/yearpicker"), { ssr: false });
const Buttonscroller = dynamic(() => import("@/components/buttonSroller"), { ssr: false });
const StatusCard = dynamic(() => import("../../component/statusCard"), { ssr: false });
const Notifications = dynamic(() => import("../../component/notifications"), { ssr: false });
const Holdstatus = dynamic(() => import("../../component/holdstatus"), { ssr: false });
const Headtitle = dynamic(() => import("../../component/headtitle"), { ssr: false });
const EmptyComponent = dynamic(() => import("../../component/empty/EmptyComponent"), { ssr: false });

const mapState = (state: RootState) => ({
  userSummaryResponse: state.dashboardReducer.workQueueSummary?.data?.response,
  userSummaryLoading: state.dashboardReducer.workQueueSummaryLoader,
  accuracyResponse: state.dashboardReducer.workQueueAccuracy?.data?.response,
  accuracyLoading: state.dashboardReducer.workQueueAccuracyLoader,
  productivityResponse: state.dashboardReducer.workQueueProductivity?.data?.response,
  productivityLoading: state.dashboardReducer.workQueueProductivityLoader,
  dashboardNotification: state.dashboardReducer.dashboardNotification?.data?.response,
  dashboardNotificationLoading: state.dashboardReducer.dashboardNotificationLoader,
  holdStatus: state.dashboardReducer.holdStatus?.data?.response,
  holdStatusLoading: state.dashboardReducer.holdStatusLoader,
  getSelectedWidgets: state.dashboardReducer.getWidgetsList?.data?.response as Widget[] | undefined,
  getSelectedWidgetsLoader: state.dashboardReducer.getWidgetsListLoader,
});

const mapDispatch = { dispatch: (action: any) => action };
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface WorkQueuePageProps extends PropsFromRedux {
  selectedRole: string;
}

const dailyTaskData5 = ["Allocated", "Completed", "InProgress"];
const dailyTaskData7 = ["Allocated", "Completed", "InProgress"];

const getCharts = (params: any) => {
  const {
    type,
    chartType,
    userSummaryResponse,
    userSummaryLoading,
    visibleTasks,
    dailyTaskLoading,
    handlePrevious,
    handleNext,
    accuracyState,
    productivityState,
    handleButtonClick,
    handleMonthChange,
    handleYearChange,
    accuracyResponse,
    accuracyLoading,
    productivityResponse,
    productivityLoading,
    dashboardNotification,
    dashboardNotificationLoading,
    holdStatus,
    holdStatusLoading,
    windowWidth,
    selectedRole,
  } = params;

  switch (type) {
    case "WorkFlow":
    case "WorkFlowChart7":
      const summary = [
        { status: "Allocated", value: userSummaryResponse?.allocatedCount || 0 },
        { status: "InProgress", value: userSummaryResponse?.pendingCount || 0 },
        { status: "Completed", value: userSummaryResponse?.completedCount || 0 },
      ];
      if (chartType === "card") {
        return userSummaryLoading ? (
          <CardSkeleton count={1} height={200} />
        ) : (
          <div className="flex flex-wrap -mx-1">
            {summary.map((item, i) => (
              <div key={i} className={i === 0 ? "w-full p-1" : "w-1/2 p-1"}>
                <StatusCard status={item.status} value={item.value} coderName={selectedRole} />
              </div>
            ))}
          </div>
        );
      }
      const { categories: wc, formattedSeries: ws, height: wh } = getFormattedChartData(
        summary.map((s, index) => ({
          name: s.status,
          value: s.value,
          color: getColorValue((index + 1).toString()) as any,
        })),
        chartType
      );
      return (
        <AppChart
          type={chartType}
          categories={wc}
          series={ws}
          height={wh}
          showLegend
          xAxisRotated
          total={getTotalChart(summary)}
        />
      );

    case "DailyTask5":
    case "DailyTask7":
      const filterKeys = type === "DailyTask5" ? dailyTaskData5 : dailyTaskData7;
      return (
        <div className="flex flex-col gap-3 min-h-[300px]">
          <div className="flex justify-between items-center w-full relative">
            <IoChevronBackOutline
              className="text-2xl cursor-pointer hover:text-blue-500 transition-colors"
              onClick={handlePrevious}
            />
            <div className="flex justify-between w-full px-4 gap-4 overflow-hidden">
              {dailyTaskLoading ? (
                Array(3).fill(0).map((_, i) => <Skeleton.Node key={i} active style={{ width: 250, height: 250 }} />)
              ) : (
                visibleTasks?.map((task: any, index: number) => {
                  const categories = task.series.map((s: any) => s.name);
                  const filteredCategories = categories.filter((c: string) => filterKeys.includes(c));
                  const filteredSeries = task.series
                    .filter((s: any) => filterKeys.includes(s.name))
                    .map((s: any) => ({ ...s, color: (s.color as any) || undefined }));

                  return (
                    <div
                      key={index}
                      className="border rounded p-3 flex-1 min-w-[200px] shadow-sm hover:shadow-md transition-shadow cursor-pointer border-gray-100 bg-white"
                    >
                      <div className="font-bold text-center mb-2 text-gray-700">
                        {task.day} ({task.date})
                      </div>
                      <AppChart
                        type={chartType}
                        categories={filteredCategories}
                        series={filteredSeries}
                        height={200}
                        showLegend={true}
                        isDailyChart
                        xAxisRotated
                        total={getTotalChart(task.series)}
                      />
                    </div>
                  );
                })
              )}
            </div>
            <IoChevronForwardOutline
              className="text-2xl cursor-pointer hover:text-blue-500 transition-colors"
              onClick={handleNext}
            />
          </div>
          <div className="flex justify-center w-full my-2 gap-4 flex-wrap">
            {(visibleTasks?.[0]?.series || [
              { name: "Allocated", color: getColorValue("1") },
              { name: "Completed", color: getColorValue("2") },
              { name: "InProgres", color: getColorValue("3") }
            ])
              ?.filter((s: any) => filterKeys.includes(s.name))
              ?.map((item: any) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-gray-600">{statusFormate(item.name)}</span>
                </div>
              ))}
          </div>
        </div>
      );

    case "Accuracy":
    case "CompletedStatus":
      const isAccuracy = type === "Accuracy";
      const state = isAccuracy ? accuracyState : productivityState;
      const response = isAccuracy ? accuracyResponse : productivityResponse;
      const loading = isAccuracy ? accuracyLoading : productivityLoading;

      let chartData: any[] = [];
      let cat: any[] = [];
      const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

      if (state.currentBtn === "Daily") {
        const days = getDaysInMonth(state.selectedYear, state.selectedMonth);
        cat = Array.from({ length: days }, (_, i) => i + 1);
        chartData = new Array(days).fill(0);
        const dataKey = isAccuracy ? "accuracyData" : "productivityCompletedCount";
        response?.[dataKey]?.forEach((item: any) => {
          if (item.day >= 1 && item.day <= days) {
            chartData[item.day - 1] = isAccuracy ? item.accuracy : item.count;
          }
        });
      } else if (state.currentBtn === "Weekly") {
        const weeks = getWeeksInMonth(state.selectedYear, state.selectedMonth);
        cat = Array.from({ length: weeks }, (_, i) => `Week ${i + 1}`);
        chartData = new Array(weeks).fill(0);
        const dataKey = isAccuracy ? "accuracyData" : "productivityCompletedCount";
        response?.[dataKey]?.forEach((item: any) => {
          if (item.week >= 1 && item.week <= weeks) {
            chartData[item.week - 1] = isAccuracy ? item.accuracy : item.count;
          }
        });
      } else if (state.currentBtn === "Monthly") {
        cat = MONTH_NAMES;
        chartData = new Array(12).fill(0);
        const dataKey = isAccuracy ? "accuracyData" : "productivityCompletedCount";
        response?.[dataKey]?.forEach((item: any) => {
          if (item.month >= 1 && item.month <= 12) {
            chartData[item.month - 1] = isAccuracy ? item.accuracy : item.count;
          }
        });
      }

      const averageScore = response?.averageAccuracy || 0;

      return (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end gap-3 items-center">
            <YearPicker
              onChangeYear={(d: any, s: any) => handleYearChange(type, d, s)}
              onChangeMonth={(d: any) => handleMonthChange(type, d)}
              type={state.currentBtn}
              val={state.month}
              val1={state.year}
              bgColor="#F3F3FF"
              hideMonth={false}
              className=""
              disabledDate={() => false}
              id=""
              selectid=""
            />
            <Buttonscroller
              Buttons={Buttons}
              handleButtonClick={(i: number, b: any) => handleButtonClick(type, i, b.value)}
              activeButton={state.activeButton}
              activeBg="#2472FF"
              containerBg="#E6EEFF"
              activeColor="white"
              inActiveColor="black"
              width={true}
            />
          </div>
          {loading ? (
            <CardSkeleton count={1} height={210} />
          ) : (
            <div className="flex gap-4">
              <div className="w-9/12">
                <AppChart
                  type={chartType}
                  categories={cat}
                  series={[
                    {
                      name: isAccuracy ? "Accuracy" : "Productivity",
                      data: chartData,
                      color: isAccuracy ? "#2CAFFE" : "#00BC13",
                    },
                  ]}
                />
              </div>
              {isAccuracy && (
                <div className="w-3/12 py-4">
                  <div className="h-full rounded-lg border border-blue-200 bg-blue-50 flex flex-col items-center justify-center p-4 shadow-sm">
                    <IoSpeedometerOutline className="text-3xl text-blue-500 mb-2" />
                    <div className="text-sm font-semibold text-gray-600">Average Quality</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {averageScore ? `${Math.floor(averageScore)}%` : "0%"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );

    case "Notifications":
      return (
        <Notifications
          notificationResponse={dashboardNotification}
          notificationLoading={dashboardNotificationLoading}
        />
      );

    case "Hold Status":
      return <Holdstatus />;

    default:
      return null;
  }
};

const WorkQueuePage: React.FC<WorkQueuePageProps> = (props) => {
  const { selectedRole, dispatch, getSelectedWidgets, getSelectedWidgetsLoader } = props;
  const windowWidth = useWindowWidth();
  const hasMounted = useHasMounted();
  const [isPageLoad, setIsPageLoad] = useState(true);
  const aliasName = getStorage("aliasName");
  const userName = getStorage("username");

  const [dateRanges, setDateRanges] = useState<any>({
    clear: true,
    startDate: null,
    endDate: null,
  });

  const [accuracyState, setAccuracyState] = useState({
    currentBtn: "Daily",
    activeButton: 0,
    month: moment().month() + 1,
    year: moment(),
    selectedMonth: moment().month() + 1,
    selectedYear: moment().year(),
  });

  const [productivityState, setProductivityState] = useState({
    currentBtn: "Daily",
    activeButton: 0,
    month: moment().month() + 1,
    year: moment(),
    selectedMonth: moment().month() + 1,
    selectedYear: moment().year(),
  });

  const [visibleDates, setVisibleDates] = useState([
    moment().subtract(2, "days"),
    moment().subtract(1, "days"),
    moment(),
  ]);
  const [taskDataList, setTaskDataList] = useState<any>({});
  const [dailyTaskLoading, setDailyTaskLoading] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);

  const fetchDailySummary = useCallback(async (date: moment.Moment) => {
    const roleId = getRoleIdByRole(aliasName?.toUpperCase().replaceAll(" ", "_") || "");
    const res = await dispatch((dashboardActions as any).workQueueDailySummaryAction({
      roleId,
      username: userName,
      date: date.toISOString(),
    }));
    return (res as any)?.data?.response;
  }, [aliasName, userName, dispatch]);

  const updateVisibleTasks = useCallback(async (dates: moment.Moment[]) => {
    setDailyTaskLoading(true);
    const newEntries: any = {};
    const results = await Promise.all(
      dates.map(async (date) => {
        const key = date.format("YYYY-MM-DD");
        if (taskDataList[key]) return { key, data: taskDataList[key], date };
        const fetched = await fetchDailySummary(date);
        newEntries[key] = fetched;
        return { key, data: fetched, date };
      })
    );
    if (Object.keys(newEntries).length > 0) {
      setTaskDataList((prev: any) => ({ ...prev, ...newEntries }));
    }
    setDailyTaskLoading(false);
  }, [taskDataList, fetchDailySummary]);

  useEffect(() => {
    if (hasMounted && aliasName) {
      updateVisibleTasks(visibleDates);
    }
  }, [hasMounted, aliasName, visibleDates]);

  const visibleTasks = useMemo(() => {
    return visibleDates.map((date) => {
      const key = date.format("YYYY-MM-DD");
      const data = taskDataList[key];
      return {
        dateKey: key,
        day: date.format("dddd"),
        date: date.format("MM-DD-YYYY"),
        series: [
          { name: "Allocated", value: data?.allocatedCount || 0, color: getColorValue("1") },
          { name: "Completed", value: data?.completedCount || 0, color: getColorValue("2") },
          { name: "InProgress", value: data?.pendingCount || 0, color: getColorValue("7") },
        ],
      };
    });
  }, [visibleDates, taskDataList]);

  const handlePrevious = () => {
    setVisibleDates((prev) => prev.map((d) => moment(d).subtract(1, "days")));
  };

  const handleNext = () => {
    setVisibleDates((prev) => prev.map((d) => moment(d).add(1, "days")));
  };

  const handleButtonClick = (type: string, index: number, btn: string) => {
    const update = { activeButton: index, currentBtn: btn };
    if (type === "Accuracy") setAccuracyState((prev) => ({ ...prev, ...update }));
    else setProductivityState((prev) => ({ ...prev, ...update }));
  };

  const handleYearChange = (type: string, date: any, dateString: string) => {
    const update = { year: date, selectedYear: parseInt(dateString) };
    if (type === "Accuracy") setAccuracyState((prev) => ({ ...prev, ...update }));
    else setProductivityState((prev) => ({ ...prev, ...update }));
  };

  const handleMonthChange = (type: string, date: any) => {
    const update = { month: date, selectedMonth: date };
    if (type === "Accuracy") setAccuracyState((prev) => ({ ...prev, ...update }));
    else setProductivityState((prev) => ({ ...prev, ...update }));
  };

  const fetchInitialData = async () => {
    const roleId = getRoleIdByRole(aliasName?.toUpperCase().replaceAll(" ", "_") || "");

    dispatch((dashboardActions as any).getWidgetsListAction({
      role: roleId,
      dashBoardPage: "WORKQUEUE",
    }));

    const defaultStart = moment().subtract(2, "days");
    const defaultEnd = moment();
    dispatch((dashboardActions as any).workQueueSummaryAction({
      roleId,
      username: userName,
      startDate: defaultStart.toISOString(),
      endDate: defaultEnd.toISOString(),
    }));

    dispatch((dashboardActions as any).workQueueAccuracyAction({
      roleId,
      username: userName,
      month: accuracyState.selectedMonth,
      year: accuracyState.selectedYear,
      range: accuracyState.currentBtn.toUpperCase(),
    }));

    dispatch((dashboardActions as any).workQueueProductivityAction({
      roleId,
      username: userName,
      month: productivityState.selectedMonth,
      year: productivityState.selectedYear,
      range: productivityState.currentBtn.toUpperCase(),
    }));

    dispatch((dashboardActions as any).dashboardNotificationAction({
      page: 0,
      limit: 100,
      rebuttal: true,
    }));

    dispatch((dashboardActions as any).holdStatusAction());
  };

  useEffect(() => {
    if (hasMounted && aliasName) {
      fetchInitialData();
      setTimeout(() => setIsPageLoad(false), 500);
    }
  }, [hasMounted, aliasName, selectedRole]);

  useEffect(() => {
    if (!hasMounted) return;
    const roleId = getRoleIdByRole(aliasName?.toUpperCase().replaceAll(" ", "_") || "");
    dispatch((dashboardActions as any).workQueueAccuracyAction({
      roleId,
      username: userName,
      month: accuracyState.selectedMonth,
      year: accuracyState.selectedYear,
      range: accuracyState.currentBtn.toUpperCase(),
    }));
  }, [accuracyState.selectedMonth, accuracyState.selectedYear, accuracyState.currentBtn]);

  useEffect(() => {
    if (!hasMounted) return;
    const roleId = getRoleIdByRole(aliasName?.toUpperCase().replaceAll(" ", "_") || "");
    dispatch((dashboardActions as any).workQueueProductivityAction({
      roleId,
      username: userName,
      month: productivityState.selectedMonth,
      year: productivityState.selectedYear,
      range: productivityState.currentBtn.toUpperCase(),
    }));
  }, [productivityState.selectedMonth, productivityState.selectedYear, productivityState.currentBtn]);

  if (!hasMounted) return <CardSkeleton count={4} height={300} />;

  const showDashboard = (getSelectedWidgets || workQueueWidget)
    ?.filter((w: any) => w.active !== false)
    ?.sort((a: any, b: any) => Number(a.orderValue) - Number(b.orderValue)) || [];

  return (
    <div className="grid grid-cols-12 gap-4 px-4 w-full h-full pb-8">
      {getSelectedWidgetsLoader || isPageLoad ? (
        <div className="col-span-12 grid grid-cols-3 gap-4">
          <CardSkeleton count={9} height={300} />
        </div>
      ) : showDashboard.length ? (
        showDashboard.map((item: any, i: number) => {
          const colSpan = getColSpan(item.size, windowWidth);
          const rowSpan = getRowSpan(item.size);
          return (
            <div
              key={i}
              className="h-full mt-4"
              style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}` }}
            >
              <Card className="h-full rounded-2xl shadow-md border-gray-100 overflow-hidden" bodyStyle={{ padding: '20px' }}>
                {(item.widgetName === "WorkFlow" || item.widgetName === "WorkFlowChart7") && (
                  <Headtitle
                    header={
                      dateRanges.clear
                        ? `Last 3 days work flow`
                        : `${formatDateTime({ date: dateRanges.startDate })} - ${formatDateTime({
                          date: moment(dateRanges.endDate).subtract(1, "day").toDate(),
                        })}`
                    }
                    icon={<IoCalendarOutline className="text-xl" />}
                    fontSize="16px"
                    handleOpen={() => setOpenPicker(!openPicker)}
                    openPicker={openPicker}
                    setOpenPicker={setOpenPicker}
                    defaultDateRange={dateRanges}
                    getDateRange={(dates: any) => {
                      if (dates) {
                        setDateRanges({
                          clear: false,
                          startDate: new Date(dates.startDate),
                          endDate: new Date(dates.endDate),
                        });
                        const roleId = getRoleIdByRole(aliasName?.toUpperCase().replaceAll(" ", "_") || "");
                        dispatch((dashboardActions as any).workQueueSummaryAction({
                          roleId,
                          username: userName,
                          startDate: new Date(dates.startDate).toISOString(),
                          endDate: new Date(dates.endDate).toISOString(),
                        }));
                      } else {
                        setDateRanges({ clear: true, startDate: null, endDate: null });
                        const roleId = getRoleIdByRole(aliasName?.toUpperCase().replaceAll(" ", "_") || "");
                        dispatch((dashboardActions as any).workQueueSummaryAction({
                          roleId,
                          username: userName,
                          startDate: moment().subtract(2, "days").toISOString(),
                          endDate: moment().toISOString(),
                        }));
                      }
                    }}
                  />
                )}
                {item.widgetName !== "WorkFlow" &&
                  item.widgetName !== "WorkFlowChart7" &&
                  item.title !== "Notifications" &&
                  item.title !== "Hold Status" && (
                    <div className="font-bold mb-4 text-gray-700 text-lg border-b border-gray-100 pb-2">
                      {item.title || item.widgetName}
                    </div>
                  )}
                {getCharts({
                  ...props,
                  type: item.widgetName,
                  chartType: item.selectedChart,
                  visibleTasks,
                  dailyTaskLoading,
                  handlePrevious,
                  handleNext,
                  accuracyState,
                  productivityState,
                  handleButtonClick,
                  handleMonthChange,
                  handleYearChange,
                  windowWidth,
                  selectedRole,
                })}
              </Card>
            </div>
          );
        })
      ) : (
        <div className="col-span-12">
          <EmptyComponent />
        </div>
      )}
    </div>
  );
};

export default connector(WorkQueuePage);
