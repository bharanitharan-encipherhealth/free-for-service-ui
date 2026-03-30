import { connect } from "react-redux";
import { Card, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import {
  getDateWeek,
  getDaysInMonth,
  getWeeksInMonth,
  getFormattedChartData,
  getTotalChart,
  useHasMounted,
  useWindowWidth,
  workQueueWidget,
} from "../../component/function";
import AppChart from "../../component/appchart";
import YearPicker from "../../../../yearpicker";
import styles from "../../reviewerStyles.module.css";
import Buttonscroller from "../../../../buttonSroller";
import { Buttons } from "./constants";
import {
  CalendarOutlined,
  DashboardOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import StatusCard from "../../component/statusCard";
import { Notifications } from "../../component/notifications";
import { HoldStatus } from "../../component/holdstatus";
import { getColSpan } from "../../component/function";
import { getRowSpan } from "../../component/function";
import { getLocalStored, getStorage } from "../../../../../util/storage";
import EmptyComponent from "../../component/empty/EmptyComponent";
import { getDashboardItems } from "../../component/function/resubaleGetStorage";
import Headtitle from "../../component/headtitle";
import {
  formatDateTime,
  getRoleIdByRole,
  statusFormate,
  getColorValue,
} from "../../../../../util/reusableFunction";
import dayjs from "dayjs";
import actions from "../../../../../state/admin/dashboard/actions";
import CardSkeleton from "../../../../skeleton/card";
interface WorkQueueProps {
  selectedRole: string;
  selectedValue: string;
  customDate: any;
  windowWidth: number | null;
  pagesLoader: boolean;
  data: any;
  userSummaryResponse: any;
  userSummaryLoading: boolean;
  userDailySummaryResponse: any;
  userDailySummaryLoading: boolean;
  accuracyResponse: any;
  accuracyLoading: boolean;
  productivityResponse: any;
  productivityLoading: boolean;
  dashboardNotification: any;
  dashboardNotificationLoading: boolean;
  getSelectedWidgets: any[];
  getSelectedWidgetsLoader: boolean;
  dispatch?: any;
}

interface GetChartsParams {
  selectedRole: string;
  type: string;
  chartType: string;
  pagesLoader: boolean;
  visibleTasks: any[];
  handlePrevious: () => void;
  handleNext: () => void;
  accuracyState: any;
  productivityState: any;
  handleButtonClick: (type: string, index: number, btn: string) => void;
  handleMonthChange: (type: string, date: any) => void;
  handleYearChange: (type: string, date: any, dateString: string) => void;
  userSummaryResponse: any;
  userSummaryLoading: boolean;
  dailyTaskLoading: boolean;
  userDailySummaryLoading: boolean;
  accuracyResponse: any;
  accuracyLoading: boolean;
  productivityResponse: any;
  productivityLoading: boolean;
  currentDate: Date;
  dashboardNotification: any;
  dashboardNotificationLoading: boolean;
  windowWidth: number | null;
}

const data = [
  { status: "Allocated", value: 5 },
  { status: "Completed", value: 8 },
  { status: "InProgress", value: 3 },
  { status: "Reassigned", value: 10 },
];

const generateMockTaskData = (date: any) => {
  const formattedDate = dayjs(date).format("MM-DD-YYYY");
  const dayName = dayjs(date).format("dddd");

  return {
    day: dayName,
    date: formattedDate,
    series: [
      { name: "Allocated", value: 0, color: "#B366FF" },
      {
        name: "Completed",
        value: 0,
        color: "#92D050",
      },
      {
        name: "InProgress",
        value: 0,
        color: "#00B0F0",
      },
      {
        name: "Reassigned",
        value: 0,
        color: "#FF5C5C",
      },
    ],
  };
};

const dummyData = [
  {
    id: 1,
    content: "Test notification 1 from dummy",
    createdDate: new Date().toISOString(),
    fromUserDetails: {
      firstName: "Priya",
      lastName: "V",
      role: "Developer",
    },
  },
  {
    id: 2,
    content: "System update scheduled",
    createdDate: new Date().toISOString(),
    fromUserDetails: {
      firstName: "Rahul",
      lastName: "Sharma",
      role: "Admin",
    },
  },
];

const dummyHoldData = [
  {
    patientId: "PID-001",
    noteText: "Waiting for test results",
    holdNotes: [{ 2023: "Hold due to pending reports" }],
  },
  {
    patientId: "PID-002",
    noteText: "Insurance issue",
    holdNotes: [{ 2023: "Pending claim review" }],
  },
];

const dailyTaskData5 = [
  "Allocated",
  "Completed",
  "InProgress",
  // "ReassignedPending",
  // "ReassignedCompleted",
];
const dailyTaskData7 = [
  "Allocated",
  "Completed",
  "InProgress",
  // "ReassignedPending",
  // "ReassignedCompleted",
  // "QueriedApproved",
  // "QueriedPending",
];

const getCharts = ({
  selectedRole,
  type,
  chartType,
  pagesLoader,
  visibleTasks,
  handlePrevious,
  handleNext,
  accuracyState,
  productivityState,
  handleButtonClick,
  handleMonthChange,
  handleYearChange,
  userSummaryResponse,
  userSummaryLoading,
  dailyTaskLoading,
  userDailySummaryLoading,
  accuracyResponse,
  accuracyLoading,
  productivityResponse,
  productivityLoading,
  currentDate,
  dashboardNotification,
  dashboardNotificationLoading,
  windowWidth,
}: any) => {
  switch (type) {
    case "WorkFlow":
      const chart5Data = [
        { status: "Allocated", value: userSummaryResponse?.allocatedCount },
        { status: "InProgress", value: userSummaryResponse?.pendingCount },
        { status: "Completed", value: userSummaryResponse?.completedCount },
        // {
        //   status: "ReassignedPending",
        //   value: userSummaryResponse?.reassignedPendingCount,
        // },
        // {
        //   status: "ReassignedCompleted",
        //   value: userSummaryResponse?.reassignedCompletedCount,
        // },
      ];
      const userSummaryData = chart5Data;
      if (chartType === "card") {
        return userSummaryLoading ? (
          <CardSkeleton count={1} height={200} />
        ) : (
          <div className="container">
            <div className="row g-2">
              {userSummaryData.map((item: any, idx: number) => (
                <div className={idx === 0 ? "col-12" : "col-6"} key={idx}>
                  <StatusCard
                    key={idx}
                    status={item.status}
                    value={item.value}
                    coderName={selectedRole}
                    col={idx === 0 ? "col-12" : "col-6"}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      }
      const defaultColors = [
        getColorValue("1"),
        getColorValue("2"),
        getColorValue("3"),
        getColorValue("4"),
        getColorValue("5"),
      ];
      const formattedChartData = userSummaryData.map((item, index) => ({
        name: item.status,
        value: item.value,
        color: defaultColors[index % defaultColors.length],
      }));

      const {
        categories: fileChartCategories,
        formattedSeries: fileChartFormatted,
        height: fileChartHeight,
      } = getFormattedChartData(formattedChartData, chartType);

      return pagesLoader || userSummaryLoading ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={fileChartCategories}
          series={fileChartFormatted}
          height={fileChartHeight}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated={true}
          total={getTotalChart(chart5Data)}
        />
      );
    case "DailyTask5":
      return (
        <div className="flex gap-3 justify-between flex-wrap">
          <div className="flex justify-between items-center w-100">
            <LeftOutlined
              className="font5 mt-5"
              id="prev-arrow"
              onClick={handlePrevious}
              style={{ cursor: "pointer" }}
            />
            {dailyTaskLoading || pagesLoader || userDailySummaryLoading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton.Node
                      active={true}
                      style={{
                        width: windowWidth > 1290 ? 300 : 200,
                        height: 250,
                      }}
                    />
                  ))
              : visibleTasks?.slice(0, 3).map((task: any, index: number) => {
                  const categories = task.series.map((s: any) => s.name);
                  const values = task.series.map((s: any) => s.value);
                  const colors = task.series.map((s: any) => s.color);
                  const formattedSeries =
                    chartType === "bar" || chartType === "line"
                      ? [
                          {
                            name: "Tasks",
                            data: values,
                            colorBy: "data",
                            itemStyle: {
                              color: (params: any) => colors[params.dataIndex],
                            },
                          },
                        ]
                      : task.series;
                  let filteredSeries;

                  if (chartType === "bar" || chartType === "line") {
                    const baseSeries = formattedSeries[0];

                    const filtered = task.series
                      .map((item: any, index: number) => ({
                        name: item.name,
                        value: baseSeries.data[index],
                        color: colors[index],
                      }))
                      .filter((item: any) => dailyTaskData5.includes(item.name));

                    filteredSeries = [
                      {
                        name: "Tasks",
                        data: filtered.map((item: any) => item.value),
                        itemStyle: {
                          color: (params: any) => filtered[params.dataIndex].color,
                        },
                        label: {
                          show: true,
                          formatter: (params: any) =>
                            `${filtered[params.dataIndex].name}: ${
                              params.value
                            }`,
                        },
                      },
                    ];
                  } else {
                    filteredSeries = formattedSeries.filter((item: any) =>
                      dailyTaskData5.includes(item.name)
                    );
                  }
                  const filteredCategories = categories.filter((item: any) =>
                    dailyTaskData5.includes(item)
                  );

                  return (
                    <div
                      key={index}
                      className="border rounded p-3 cr-pointer"
                      style={{
                        width: "28%",
                        minWidth: 250,
                        boxShadow: "0 0px 3px 0 rgba(0, 0, 0, 0.2)",
                        cursor: "pointer",
                        transition: "box-shadow 0.3s ease-in-out",
                      }}
                    >
                      <div className="font-bold text-center mb-2">
                        {task.day} ({task.date})
                      </div>

                      <AppChart
                        type={chartType}
                        categories={filteredCategories}
                        series={filteredSeries}
                        height={240}
                        showLegend={true}
                        showLegendBarLine={false}
                        radius={["40%", "70%"]}
                        isDailyChart={true}
                        xAxisRotated={true}
                        total={getTotalChart(task.series)}
                      />
                    </div>
                  );
                })}

            <RightOutlined
              id="next-arrowIcon"
              className="font5 mt-5"
              onClick={handleNext}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="flex justify-center w-100 my-2 gap-4 flex-wrap">
            {visibleTasks[0]?.series
              ?.filter((item: any) => dailyTaskData5.includes(item.name))
              ?.map((item: any) => (
                <div key={item.name} className="flex items-center">
                  <div
                    style={{
                      backgroundColor: item.color,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      marginRight: 8,
                    }}
                  ></div>
                  <span>{statusFormate(item.name)}</span>
                </div>
              ))}
          </div>
        </div>
      );
    case "DailyTask7":
      return (
        <div className="flex gap-3 justify-between flex-wrap">
          <div className="flex justify-between items-center w-100">
            <LeftOutlined
              className="font5 mt-5"
              id="prev-arrow"
              onClick={handlePrevious}
              style={{ cursor: "pointer" }}
            />
            {dailyTaskLoading || pagesLoader || userDailySummaryLoading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton.Node
                      active={true}
                      style={{
                        width: windowWidth > 1290 ? 300 : 200,
                        height: 250,
                      }}
                    />
                  ))
              : visibleTasks?.slice(0, 3).map((task: any, index: number) => {
                  const categories = task.series.map((s: any) => s.name);
                  const values = task.series.map((s: any) => s.value);
                  const colors = task.series.map((s: any) => s.color);

                  const formattedSeries =
                    chartType === "bar" || chartType === "line"
                      ? [
                          {
                            name: "Tasks",
                            data: values,
                            colorBy: "data",
                            itemStyle: {
                              color: (params: any) => colors[params.dataIndex],
                            },
                          },
                        ]
                      : task.series;
                  let filteredSeries;

                  if (chartType === "bar" || chartType === "line") {
                    const baseSeries = formattedSeries[0];

                    const filtered = task.series
                      .map((item: any, index: number) => ({
                        name: item.name,
                        value: baseSeries.data[index],
                        color: colors[index],
                      }))
                      .filter((item: any) => dailyTaskData7.includes(item.name));

                    filteredSeries = [
                      {
                        name: "Tasks",
                        data: filtered.map((item: any) => item.value),
                        itemStyle: {
                          color: (params: any) => filtered[params.dataIndex].color,
                        },
                        label: {
                          show: true,
                          formatter: (params: any) =>
                            `${filtered[params.dataIndex].name}: ${
                              params.value
                            }`,
                        },
                      },
                    ];
                  } else {
                    filteredSeries = formattedSeries.filter((item: any) =>
                      dailyTaskData7.includes(item.name)
                    );
                  }
                  const filteredCategories = categories.filter((item: any) =>
                    dailyTaskData7.includes(item)
                  );

                  return (
                    <div
                      key={index}
                      className="border rounded p-3 cr-pointer"
                      style={{
                        width: "28%",
                        minWidth: 250,
                        boxShadow: "0 0px 3px 0 rgba(0, 0, 0, 0.2)",
                        cursor: "pointer",
                        transition: "box-shadow 0.3s ease-in-out",
                      }}
                    >
                      <div className="font-bold text-center mb-2">
                        {task.day} ({task.date})
                      </div>

                      <AppChart
                        type={chartType}
                        categories={filteredCategories}
                        series={filteredSeries}
                        height={240}
                        showLegend={true}
                        showLegendBarLine={false}
                        radius={["40%", "70%"]}
                        isDailyChart={true}
                        xAxisRotated={true}
                        total={getTotalChart(task.series)}
                      />
                    </div>
                  );
                })}

            <RightOutlined
              id="next-arrowIcon"
              className="font5 mt-5"
              onClick={handleNext}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="flex justify-center w-100 my-2 gap-4 flex-wrap">
            {visibleTasks[0]?.series
              ?.filter((item: any) => dailyTaskData7.includes(item.name))
              ?.map((item: any) => (
                <div key={item.name} className="flex items-center">
                  <div
                    style={{
                      backgroundColor: item.color,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      marginRight: 8,
                    }}
                  ></div>
                  <span>{statusFormate(item.name)}</span>
                </div>
              ))}
          </div>
        </div>
      );
    case "Accuracy":
      let accuracyData = [];
      const accuracySelectedYear = accuracyState.selectedYear;
      const accuracySelectedMonth = accuracyState.selectedMonth;
      let accuracyDayCategories: any[] = [];
      const MONTH_NAMES = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
      if (accuracyState.currentBtn === "Daily") {
        accuracyDayCategories = Array.from(
          {
            length: getDaysInMonth(accuracySelectedYear, accuracySelectedMonth),
          },
          (_, i) => i + 1
        );
        const daysInMonth = getDaysInMonth(
          accuracySelectedYear,
          accuracySelectedMonth
        );
        accuracyData = new Array(daysInMonth).fill(0);
        accuracyResponse?.accuracyData?.forEach(({ day, accuracy }: any) => {
          if (day >= 1 && day <= daysInMonth) {
            accuracyData[day - 1] = accuracy;
          }
        });
      } else if (accuracyState.currentBtn === "Weekly") {
        const weeksInMonth = getWeeksInMonth(
          accuracySelectedYear,
          accuracySelectedMonth
        );
        accuracyData = new Array(weeksInMonth).fill(null);
        const maxWeek = Math.max(
          ...accuracyResponse?.accuracyData.map((item: any) => item.week)
        );
        accuracyDayCategories = Array.from(
          { length: maxWeek },
          (_, i) => `Week ${i + 1}`
        );
        accuracyResponse?.accuracyData?.forEach(({ week, accuracy }: any) => {
          if (week >= 1 && week <= weeksInMonth) {
            accuracyData[week - 1] = accuracy;
          }
        });
      } else if (accuracyState.currentBtn === "Monthly") {
        accuracyData = new Array(12).fill(0);
        const uniqueMonths = [
          ...new Set(
            accuracyResponse?.accuracyData.map((item: any) => item.month)
          ),
        ];
        accuracyDayCategories = uniqueMonths
          .sort((a: any, b: any) => a - b)
          .map((month: any) => MONTH_NAMES[month - 1]);
        accuracyResponse?.accuracyData?.forEach(
          ({ month, accuracy }: any) => {
            if (month >= 1 && month <= 12) {
              accuracyData[month - 1] = accuracy;
            }
          }
        );
      }

      const rawAccuracyData = accuracyResponse?.accuracyData || [];

      // const filteredAccuracies = rawAccuracyData
      //   .filter((entry) => {
      //     if (accuracyState.currentBtn === "Daily") {
      //       return entry.day <= new Date().getDate();
      //     } else if (accuracyState.currentBtn === "Weekly") {
      //       return entry.week <= getDateWeek(currentDate);
      //     } else if (accuracyState.currentBtn === "Monthly") {
      //       return entry.month <= currentDate.getMonth() + 1;
      //     }
      //     return false;
      //   })
      //   .map((entry) => entry.accuracy)
      //   .filter((accuracy) => typeof accuracy === "number" && accuracy > 0);

      // const averageAccuracy =
      //   filteredAccuracies.length > 0
      //     ? filteredAccuracies.reduce((a, b) => a + b, 0) /
      //       filteredAccuracies.length
      //     : 0;
      const today = new Date();
      const todayYear = today.getFullYear();
      const todayMonth = today.getMonth() + 1;
      const todayDay = today.getDate();
      const getWeekOfMonth = (date = new Date()) => {
        const day = date.getDate();
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthStartDay = monthStart.getDay() || 7;

        return Math.ceil((day + monthStartDay - 1) / 7);
      };

      const currentWeekOfMonth = getWeekOfMonth(today);
      const numericalData =
        rawAccuracyData?.length > 0 &&
        rawAccuracyData.filter((item: any) => {
          if (!item || item === false) return false;
          const { year, month, day, week } = item;
          if (year > todayYear) return false;
          if (year < todayYear || (year === todayYear && month < todayMonth)) {
            return true;
          }
          if (
            year === todayYear &&
            month === todayMonth &&
            week < currentWeekOfMonth
          ) {
            return true;
          }
          if (
            year === todayYear &&
            month === todayMonth &&
            week === currentWeekOfMonth &&
            day <= todayDay
          ) {
            return true;
          }
          return false;
        });

      const sum =
        numericalData &&
        numericalData?.reduce((acc: any, value: any) => acc + value.accuracy, 0);

      const averageAccuracy =
        numericalData?.length > 0 ? (sum as number) / numericalData.length : 0;
      return (
        <>
          <div className={`flex justify-end gap-4 w-100`}>
            <div className="flex justify-between">
              <YearPicker
                onChangeYear={(date: any, dateString: any) =>
                  handleYearChange("Accuracy", date, dateString)
                }
                onChangeMonth={(date: any) => handleMonthChange("Accuracy", date)}
                type={accuracyState.currentBtn}
                bgColor="#F3F3FF"
                val={accuracyState.month}
                val1={accuracyState.year}
                id="accuracy-picker1"
                selectid="accuracy-select"
              />
            </div>
            <div className={styles.btnScroller}>
              <Buttonscroller
                id="accuracy-btncontainer"
                Buttons={Buttons}
                activeColor="#fff"
                handleButtonClick={(index: number, btn: string) =>
                  handleButtonClick("Accuracy", index, btn)
                }
                activeButton={accuracyState.activeButton}
                inActiveColor="#000000"
                activeBg="#2472FF"
                containerBg="#E6EEFF"
              />
            </div>
          </div>
          {accuracyLoading ? (
            <div className="my-4">
              <CardSkeleton count={1} height={210} />
            </div>
          ) : (
            <div className="row">
              <div className="col-9">
                <AppChart
                  type={chartType}
                  categories={accuracyDayCategories}
                  series={[
                      {
                        name: "Accuracy",
                        data: accuracyData.map((v: any) => v || 0),
                        color: "#2CAFFE",
                      },
                  ]}
                />
              </div>
              <div className="col-3 my-4">
                <div
                  style={{
                    height: "200px",
                    borderRadius: "8px",
                    boxShadow: "0 0px 3px 0 rgba(0, 0, 0, 0.2)",
                    border: "0.5px solid #3479FE",
                    backgroundColor: "#F0F6FF",
                  }}
                  className="w-100"
                >
                  <div className="mt-5">
                    <div className="flex justify-center py-2">
                      <DashboardOutlined
                        className={`mt-1 ${styles.Img}`}
                      />
                      <div className={styles.heading}>Average Quality</div>
                    </div>
                    <div className={styles.percentage}>
                      <div className={styles.insideTitle}>
                        {averageAccuracy
                          ? `${Math.floor(averageAccuracy)}%`
                          : `0%`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      );
    case "Notifications":
      return (
        <Notifications
          notificationResponse={dashboardNotification}
          notificationLoading={dashboardNotificationLoading}
          webSocketNotificationData={null}
        />
      );
    case "CompletedStatus":
      let productivityAllocatedData = [];
      let productivityCompletedData = [];
      const productivitySelectedYear = productivityState.selectedYear;
      const productivitySelectedMonth = productivityState.selectedMonth;

      let productivityDayCategories: any[] = [];

      const MONTH_NAMES1 = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];

      if (productivityState.currentBtn === "Daily") {
        const daysInMonth = getDaysInMonth(
          productivitySelectedYear,
          productivitySelectedMonth
        );
        productivityAllocatedData = new Array(daysInMonth).fill(0);
        productivityCompletedData = new Array(daysInMonth).fill(0);
        productivityDayCategories = Array.from(
          {
            length: getDaysInMonth(
              productivitySelectedYear,
              productivitySelectedMonth
            ),
          },
          (_, i) => i + 1
        );
        productivityResponse?.productivityAllocatedCount?.forEach(
          ({ day, count }: any) => {
            if (day >= 1 && day <= 31) {
              productivityAllocatedData[day - 1] = count;
            }
          }
        );
        productivityResponse?.productivityCompletedCount?.forEach(
          ({ day, count }: any) => {
            if (day >= 1 && day <= 31) {
              productivityCompletedData[day - 1] = count;
            }
          }
        );
      } else if (productivityState.currentBtn === "Weekly") {
        const weeksInMonth = getWeeksInMonth(
          productivitySelectedYear,
          productivitySelectedMonth
        );
        productivityAllocatedData = new Array(weeksInMonth).fill(0);
        productivityCompletedData = new Array(weeksInMonth).fill(0);
        const maxWeek = Math.max(
          ...productivityResponse?.productivityAllocatedCount
            .map((item: any) => item.week)
            .filter((week: number) => week > 0)
        );
        productivityDayCategories = Array.from(
          { length: maxWeek },
          (_: any, i: number) => `Week ${i + 1}`
        );
        productivityResponse?.productivityAllocatedCount?.forEach(
          ({ week, count }: any) => {
            if (week >= 1) {
              productivityAllocatedData[week - 1] = count;
            }
          }
        );
        productivityResponse?.productivityCompletedCount?.forEach(
          ({ week, count }: any) => {
            if (week >= 1) {
              productivityCompletedData[week - 1] = count;
            }
          }
        );
      } else if (productivityState.currentBtn === "Monthly") {
        productivityAllocatedData = new Array(12).fill(0);
        productivityCompletedData = new Array(12).fill(0);
        const uniqueMonths = [
          ...new Set(
            productivityResponse?.productivityAllocatedCount.map(
              (item: any) => item.month
            )
          ),
        ];
        productivityDayCategories = uniqueMonths
          .sort((a: any, b: any) => a - b)
          .map((month: any) => MONTH_NAMES1[month - 1]);
        productivityResponse?.productivityAllocatedCount?.forEach(
          ({ month, count }: any) => {
            if (month >= 1 && month <= 12) {
              productivityAllocatedData[month - 1] = count;
            }
          }
        );
        productivityResponse?.productivityCompletedCount?.forEach(
          ({ month, count }: any) => {
            if (month >= 1 && month <= 12) {
              productivityCompletedData[month - 1] = count;
            }
          }
        );
      }
      return (
        <>
          <div className={`flex justify-end gap-4 w-100`}>
            <div className="flex justify-between">
              <YearPicker
                type={productivityState.currentBtn}
                bgColor="#F3F3FF"
                onChangeYear={(date: any, dateString: any) =>
                  handleYearChange("Productivity", date, dateString)
                }
                onChangeMonth={(date: any) =>
                  handleMonthChange("Productivity", date)
                }
                val={productivityState.month}
                val1={productivityState.year}
                selectid="productivity-select"
                id="productivity-picker1"
              />
            </div>
            <div className={styles.btnScroller}>
              <Buttonscroller
                Buttons={Buttons}
                activeColor="#fff"
                handleButtonClick={(index: number, btn: string) =>
                  handleButtonClick("Productivity", index, btn)
                }
                activeButton={productivityState.activeButton}
                inActiveColor="#000000"
                activeBg="#2472FF"
                containerBg="#F3F3FF"
                id="productivity-btncontainer"
              />
            </div>
          </div>
          {productivityLoading ? (
            <div className="my-4">
              <CardSkeleton count={1} height={210} />
            </div>
          ) : (
            <AppChart
              type={chartType}
              categories={productivityDayCategories}
              series={[
                {
                  name: "Completed",
                  data: productivityAllocatedData.map((v: any) => v || 0),
                  color: getColorValue("8"),
                },
                {
                  name: "Allocated",
                  data: productivityCompletedData.map((v: any) => v || 0),
                  color: getColorValue("3"),
                },
              ]}
            />
          )}
        </>
      );
    case "HoldStatus":
      return <HoldStatus useDummyData={true} dummyHoldData={dummyHoldData} />;
    case "WorkFlowChart7":
      const chart7Data = [
        { status: "Allocated", value: userSummaryResponse?.allocatedCount },
        { status: "InProgress", value: userSummaryResponse?.pendingCount },
        { status: "Completed", value: userSummaryResponse?.completedCount },
        // {
        //   status: "QueryPending",
        //   value: userSummaryResponse?.queryPendingCount,
        // },
        // {
        //   status: "QueryApproved",
        //   value: userSummaryResponse?.queryApprovedCount,
        // },
        // {
        //   status: "ReassignedPending",
        //   value: userSummaryResponse?.reassignedPendingCount,
        // },
        // {
        //   status: "ReassignedCompleted",
        //   value: userSummaryResponse?.reassignedCompletedCount,
        // },
      ];
      const userSummaryDatas = chart7Data;

      if (chartType === "card") {
        return userSummaryLoading ? (
          <CardSkeleton count={1} height={200} />
        ) : (
          <div className="container">
            <div className="row g-2">
              {userSummaryDatas.map((item, idx) => (
                <div className={idx === 0 ? "col-12" : "col-6"} key={idx}>
                  <StatusCard
                    key={idx}
                    status={item.status}
                    value={item.value}
                    coderName={selectedRole}
                    col={idx === 0 ? "col-12" : "col-6"}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      }
      const defaultColor = [
        getColorValue("1"),
        getColorValue("2"),
        getColorValue("3"),
        getColorValue("4"),
        getColorValue("5"),
        getColorValue("6"),
        getColorValue("7"),
      ];
      const formattedChartDatas = userSummaryDatas.map((item, index) => ({
        name: item.status,
        value: item.value,
        color: defaultColor[index % defaultColor.length],
      }));

      const {
        categories: fileChartCategorie,
        formattedSeries: fileChartFormatteds,
        height: fileChartHeights,
      } = getFormattedChartData(formattedChartDatas, chartType);

      return pagesLoader || userSummaryLoading ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={fileChartCategorie}
          series={fileChartFormatteds}
          height={fileChartHeights}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated={true}
          total={getTotalChart(chart7Data)}
        />
      );
    default:
      break;
  }
};

function WorkQueue({
  getSelectedWidgets = [],
  getSelectedWidgetsLoader,
  dispatch,
  data,
  selectedRole,
  userSummaryResponse,
  userSummaryLoading,
  userDailySummaryResponse,
  userDailySummaryLoading,
  accuracyResponse,
  accuracyLoading,
  productivityResponse,
  productivityLoading,
  dashboardNotification,
  dashboardNotificationLoading,
  selectedValue,
  customDate,
}: WorkQueueProps) {
  const showDashboard = getSelectedWidgets
    .filter((item: any) => item?.active)
    .sort((a: any, b: any) => a?.orderValue - b?.orderValue);
  // const {
  //   dashboardLayout = null,
  //   userName = "",
  //   aliasName = "",
  // } = getLocalStored();

  const aliasName = getStorage("aliasName");
  const userName = getStorage("userName");

  const currentDate = new Date();
  const [taskDataList, setTaskDataList] = useState({});
  const [isPageLoad, setIsPageLoad] = useState(true);
  const [visibleDates, setVisibleDates] = useState([
    dayjs().subtract(2, "days"),
    dayjs().subtract(1, "days"),
    dayjs(),
  ]);
  const [visibleTasks, setVisibleTasks] = useState<any[]>([]);
  const [dailyTaskLoading, setDailyTaskLoading] = useState(false);

  const fetchAndUpdate = async (dates: any) => {
    const results = await Promise.all(
      dates.map(async (date: any) => {
        const key = date.format("YYYY-MM-DD");
        const fetched = await getDailySummaryApiCall(date);
        return { key, data: fetched, date };
      })
    );

    const newEntries = {};
    results.forEach(({ key, data }: any) => {
      (newEntries as any)[key] = data;
    });

    setTaskDataList((prev) => ({
      ...prev,
      ...newEntries,
    }));

    return results;
  };

  const updateVisibleTasksFromDates = async (dates: any) => {
    setDailyTaskLoading(true);

    setTimeout(async () => {
      const results = await fetchAndUpdate(dates);

      const tasks = results.map(({ key, data, date }: any) => ({
        dateKey: key,
        day: date.format("dddd"),
        date: date.format("MM-DD-YYYY"),
        series: [
          {
            name: "Allocated",
            value: data?.allocatedCount || 0,
            color: getColorValue("1"),
          },
          {
            name: "Completed",
            value: data?.completedCount || 0,
            color: getColorValue("2"),
          },
          {
            name: "InProgress",
            value: data?.pendingCount || 0,
            color: getColorValue("7"),
          },
          {
            name: "ReassignedPending",
            value: data?.reassignedPendingCount || 0,
            color: getColorValue("4"),
          },
          {
            name: "ReassignedCompleted",
            value: data?.reassignedCompletedCount || 0,
            color: getColorValue("5"),
          },
          {
            name: "QueriedApproved",
            value: data?.queryApprovedCount || 0,
            color: getColorValue("3"),
          },
          {
            name: "QueriedPending",
            value: data?.queryPendingCount || 0,
            color: getColorValue("6"),
          },
        ],
      }));

      setVisibleTasks(tasks);
      setDailyTaskLoading(false);
    }, 300);
  };

  useEffect(() => {
    updateVisibleTasksFromDates(visibleDates);
  }, [visibleDates]);

  const handlePrevious = () => {
    const newDate = dayjs(visibleDates[0]).subtract(1, "day");
    const updated = [...visibleDates];
    updated.pop();
    updated.unshift(newDate);
    setVisibleDates(updated);
  };

  const handleNext = () => {
    const newDate = dayjs(visibleDates[visibleDates.length - 1]).add(1, "day");
    const tomorrow = dayjs().add(1, "day").startOf("day");

    if (newDate.isBefore(tomorrow)) {
      const updated = [...visibleDates];
      updated.shift();
      updated.push(newDate);
      setVisibleDates(updated);
    }
  };

  const [accuracyState, setAccuracyState] = useState<{
    activeButton: number;
    selectedMonth: string;
    selectedYear: string;
    year: any;
    month: any;
    currentBtn: string;
  }>({
    activeButton: 0,
    selectedMonth: (currentDate.getMonth() + 1).toString(),
    selectedYear: currentDate.getFullYear().toString(),
    year: undefined,
    month: undefined,
    currentBtn: "Daily",
  });

  const [productivityState, setProductivityState] = useState<{
    activeButton: number;
    selectedMonth: string;
    selectedYear: string;
    year: any;
    month: any;
    currentBtn: string;
  }>({
    activeButton: 0,
    selectedMonth: (currentDate.getMonth() + 1).toString(),
    selectedYear: currentDate.getFullYear().toString(),
    year: undefined,
    month: undefined,
    currentBtn: "Daily",
  });
  const [openPicker, setOpenPicker] = useState(false);
  const [DateRanges, setDateRanges] = useState<{
    clear: boolean;
    startDate: Date | null;
    endDate: Date | null;
  }>({
    clear: true,
    startDate: null,
    endDate: null,
  });

  const getInitialApiCall = async () => {
    const roleId = getRoleIdByRole(aliasName);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const defaultEndDate = new Date(currentDate);
    defaultEndDate.setDate(defaultEndDate.getDate());

    const defaultStartDate = new Date(currentDate);
    defaultStartDate.setDate(defaultStartDate.getDate() - 2);

    try {
      const apiKeys = [
        {
          key: "workQueueSummary",
          params: {
            roleId,
            username: userName,
            startDate: defaultStartDate.toISOString(),
            endDate: defaultEndDate.toISOString(),
          },
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c030"],
        },
        {
          key: "workQueueProductivity",
          params: {
            roleId,
            year: currentYear.toString(),
            month: currentMonth.toString(),
            range: "DAILY",
          },
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c034"],
        },
        {
          key: "workQueueAccuracy",
          params: {
            roleId,
            year: currentYear.toString(),
            month: currentMonth.toString(),
            range: "DAILY",
          },
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c032"],
        },
        {
          key: "dashboardNotification",
          params: {
            page: 0,
            limit: 100,
            rebuttal: true,
          },
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c033"],
        },
      ];
      const apiKeysNew = apiKeys.filter((item: any) =>
        item.widgetId?.some((id: string) =>
          showDashboard.some((widget: any) => widget.widgetId === id)
        )
      );
      for (const item of apiKeysNew) {
        const actionKey = `${item.key}Action`;
        if (typeof (actions as any)[actionKey] === "function") {
          dispatch((actions as any)[actionKey](item.params));
        } else {
          console.warn(`Action not found for key: ${actionKey}`);
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const getSummaryApiCall = async (startDate?: any, endDate?: any) => {
    const roleId = getRoleIdByRole(aliasName);
    const currentDate = new Date();

    const defaultEndDate = new Date(currentDate);
    defaultEndDate.setDate(defaultEndDate.getDate());

    const defaultStartDate = new Date(currentDate);
    defaultStartDate.setDate(defaultStartDate.getDate() - 2);

    try {
      const actionKey = `workQueueSummaryAction`;
      if (typeof (actions as any)[actionKey] === "function") {
        const payload: any = {
          roleId,
          username: userName,
        };

        if (startDate && endDate) {
          payload.startDate = startDate.toISOString();
          payload.endDate = endDate.toISOString();
        } else {
          payload.startDate = defaultStartDate.toISOString();
          payload.endDate = defaultEndDate.toISOString();
        }
        await dispatch((actions as any)[actionKey](payload));
      } else {
        console.warn(`Action not found for key: ${actionKey}`);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const getDailySummaryApiCall = async (date: any) => {
    const roleId = getRoleIdByRole(aliasName);
    try {
      const actionKey = `workQueueDailySummaryAction`;
      if (typeof (actions as any)[actionKey] === "function") {
        const payload: any = {
          roleId,
          username: userName,
        };

        if (date) {
          payload.date = date.toISOString();
        }
        const res = await dispatch((actions as any)[actionKey](payload));
        return res?.response;
      } else {
        console.warn(`Action not found for key: ${actionKey}`);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const getAccuracyApiCall = async (month: any, year: any, range: any) => {
    const roleId = getRoleIdByRole(aliasName);
    try {
      const actionKey = `workQueueAccuracyAction`;
      if (typeof (actions as any)[actionKey] === "function") {
        const payload: any = {
          roleId,
          username: userName,
        };
        if (month && year) {
          payload.month = month;
          payload.year = year;
          payload.range = range;
        }

        await dispatch((actions as any)[actionKey](payload));
      } else {
        console.warn(`Action not found for key: ${actionKey}`);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const getProductivityApiCall = async (month: any, year: any, range: any) => {
    const roleId = getRoleIdByRole(aliasName);
    try {
      const actionKey = `workQueueProductivityAction`;
      if (typeof (actions as any)[actionKey] === "function") {
        const payload: any = {
          roleId,
          username: userName,
        };
        if (month && year) {
          payload.month = month;
          payload.year = year;
          payload.range = range;
        }
        await dispatch((actions as any)[actionKey](payload));
      } else {
        console.warn(`Action not found for key: ${actionKey}`);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  useEffect(() => {
    getInitialApiCall();
  }, [getSelectedWidgets]);

  useEffect(() => {
    if (DateRanges.clear) {
      getSummaryApiCall();
    } else if (DateRanges.startDate && DateRanges.endDate) {
      getSummaryApiCall(new Date(DateRanges.startDate || ""), new Date(DateRanges.endDate || ""));
    }
  }, [DateRanges]);

  useEffect(() => {
    if (
      accuracyState.selectedMonth &&
      accuracyState.selectedYear &&
      accuracyState.currentBtn
    ) {
      getAccuracyApiCall(
        accuracyState.selectedMonth,
        accuracyState.selectedYear,
        accuracyState.currentBtn.toUpperCase()
      );
    }
  }, [
    accuracyState.selectedMonth,
    accuracyState.selectedYear,
    accuracyState.currentBtn,
  ]);

  useEffect(() => {
    if (
      productivityState.selectedMonth &&
      productivityState.selectedYear &&
      productivityState.currentBtn
    ) {
      getProductivityApiCall(
        productivityState.selectedMonth,
        productivityState.selectedYear,
        productivityState.currentBtn.toUpperCase()
      );
    }
  }, [
    productivityState.selectedMonth,
    productivityState.selectedYear,
    productivityState.currentBtn,
  ]);

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoad(false);
    }, 500);
  }, []);

  const windowWidth = useWindowWidth();
  const hasMounted = useHasMounted();
  if (!hasMounted) return null;
  const handleOpen = () => {
    setOpenPicker(!openPicker);
  };
  const handleButtonClick = (type: string, index: number, btn: string) => {
    if (type === "Accuracy") {
      setAccuracyState((prev) => ({
        ...prev,
        activeButton: index,
        currentBtn: btn,
      }));
    } else {
      setProductivityState((prev) => ({
        ...prev,
        activeButton: index,
        currentBtn: btn,
      }));
    }
  };

  const handleYearChange = (type: string, date: any, dateString: any) => {
    const update = {
      year: date,
      selectedYear: dateString,
    };

    if (type === "Accuracy") {
      setAccuracyState((prev) => ({ ...prev, ...update }));
    } else {
      setProductivityState((prev) => ({ ...prev, ...update }));
    }
  };

  const handleMonthChange = (type: string, date: any) => {
    const update = {
      month: date,
      selectedMonth: date,
    };

    if (type === "Accuracy") {
      setAccuracyState((prev) => ({ ...prev, ...update }));
    } else {
      setProductivityState((prev) => ({ ...prev, ...update }));
    }
  };

  return (
    <>
      {getSelectedWidgetsLoader || isPageLoad ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            padding: 20,
          }}
          className="container-fluid"
        >
          <CardSkeleton count={9} height={300} />
        </div>
      ) : showDashboard.length ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 16,
            height: "100%",
          }}
          className="container-fluid"
        >
          {showDashboard?.map((item: any, id: number) => {
            const style = {
              gridColumn: `span ${getColSpan(item.size, windowWidth)}`,
              gridRow: `span ${getRowSpan(item.size)}`,
              height: "100%",
            };

            return (
              <div className="dynamicChart" key={id} style={style}>
                <Card style={{ borderRadius: "20px" }}>
                  {(item.widgetName === "WorkFlow" ||
                    item.widgetName === "WorkFlowChart7") && (
                    <Headtitle
                      header={
                        !DateRanges || DateRanges?.clear
                          ? `Last 3 days work flow`
                          : `${formatDateTime({
                              date: DateRanges?.startDate,
                            })} - ${formatDateTime({
                              date: dayjs(DateRanges?.endDate)
                                .subtract(1, "day")
                                .toDate(),
                            })}`
                      }
                      icon={<CalendarOutlined />}
                      fontSize={"16px"}
                      anchorTag={false}
                      margin="0"
                      handleOpen={handleOpen}
                      openPicker={openPicker}
                      setOpenPicker={setOpenPicker}
                      defaultDateRange={DateRanges}
                      getDateRange={(dates: any) => {
                        if (dates) {
                          setDateRanges({
                            clear: false,
                            startDate: new Date(dates.startDate),
                            endDate: new Date(dates.endDate),
                          });
                        } else {
                          setDateRanges({
                            clear: true,
                            startDate: null,
                            endDate: null,
                          });
                        }
                      }}
                    />
                  )}
                  {item.widgetName !== "WorkFlow" &&
                    item.title !== "Notifications" &&
                    item.title !== "Hold Status" &&
                    item.widgetName !== "WorkFlowChart7" && (
                      <div className="font-bold mb-2 text-xl">{item.title}</div>
                    )}

                  {getCharts({
                    selectedRole,
                    type: item.widgetName,
                    chartType: item?.selectedChart,
                    pagesLoader: getSelectedWidgetsLoader,
                    visibleTasks,
                    handlePrevious,
                    handleNext,
                    accuracyState,
                    productivityState,
                    handleButtonClick,
                    handleMonthChange,
                    handleYearChange,
                    userSummaryResponse,
                    userSummaryLoading: !!userSummaryLoading,
                    dailyTaskLoading: !!dailyTaskLoading,
                    userDailySummaryLoading: !!userDailySummaryLoading,
                    accuracyResponse,
                    accuracyLoading: !!accuracyLoading,
                    productivityResponse,
                    productivityLoading: !!productivityLoading,
                    currentDate,
                    dashboardNotification,
                    dashboardNotificationLoading: !!dashboardNotificationLoading,
                    windowWidth,
                  })}
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyComponent />
      )}
    </>
  );
}

const enhancer = connect((state: any) => ({
  data: state.admin?.dashboard1,
  userSummaryResponse:
    state.admin?.dashboard1?.workQueueSummary?.data?.response,
  userSummaryLoading: !!state.admin?.dashboard1?.workQueueSummaryLoader,
  userDailySummaryResponse:
    state.admin?.dashboard1?.workQueueDailySummary?.data?.response,
  userDailySummaryLoading: !!state.admin?.dashboard1?.workQueueDailySummaryLoader,
  accuracyResponse: state.admin?.dashboard1?.workQueueAccuracy?.data?.response,
  accuracyLoading: !!state.admin?.dashboard1?.workQueueAccuracyLoader,
  productivityResponse:
    state.admin?.dashboard1?.workQueueProductivity?.data?.response,
  productivityLoading: !!state.admin?.dashboard1?.workQueueProductivityLoader,
  dashboardNotification: state.admin?.dashboard1?.dashboardNotification,
  dashboardNotificationLoading:
    !!state.admin?.dashboard1?.dashboardNotificationLoader,
  getSelectedWidgets: state.admin.dashboard1.getWidgetsList?.data?.response,
  getSelectedWidgetsLoader: !!state.admin.dashboard1.getWidgetsListLoader,
}));

export default enhancer(WorkQueue);
