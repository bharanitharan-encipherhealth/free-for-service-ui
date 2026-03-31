import AppChart from "../../appchart";
import YearPicker from "@/components/yearpicker";
import styles from "../../../reviewerStyles.module.css";
import Buttonscroller from "@/components/buttonSroller";
import { Buttons } from "@/util/dashboardConstants";
import { getColorValue, statusFormate } from "@/util/reusableFunction";
import StatusCard from "../../statusCard";
import {
  IoChevronForwardOutline,
  IoChevronBackOutline,
  IoSpeedometerOutline,
} from "react-icons/io5";
import { getFormattedChartData, getTotalChart } from "../../function";
import CardSkeleton from "@/components/skeleton/card";
import { Skeleton } from "antd";

export const chart5Data = [
  { status: "Allocated", value: 5 },
  { status: "InProgress", value: 3 },
  { status: "Completed", value: 8 },
  // { status: "ReassignedPending", value: 15 },
  // { status: "ReassignedCompleted", value: 18 },
];
const chart7Data = [
  { status: "Allocated", value: 5 },
  { status: "InProgress", value: 3 },
  { status: "Completed", value: 8 },
  // { status: "QueryPending", value: 4 },
  // { status: "QueryApproved", value: 5 },
  // { status: "ReassignedPending", value: 15 },
  // { status: "ReassignedCompleted", value: 18 },
];

const dailyTaskData = [
  {
    date: "07-16-2025",
    day: "Wednesday",
    series: [
      { name: "Allocated", value: 20, color: getColorValue("1") },
      { name: "Completed", value: 10, color: getColorValue("2") },
      { name: "InProgress", value: 40, color: getColorValue("3") },
      // { name: "ReassignedPending", value: 30, color: getColorValue("4") },
      // { name: "ReassignedCompleted", value: 30, color: getColorValue("5") },
    ],
  },
  {
    date: "07-17-2025",
    day: "Thursday",
    series: [
      { name: "Allocated", value: 0, color: getColorValue("1") },
      { name: "Completed", value: 0, color: getColorValue("2") },
      { name: "InProgress", value: 0, color: getColorValue("3") },
      // { name: "ReassignedPending", value: 0, color: getColorValue("4") },
      // { name: "ReassignedCompleted", value: 0, color: getColorValue("5") },
    ],
  },
  {
    date: "07-18-2025",
    day: "Friday",
    series: [
      { name: "Allocated", value: 0, color: getColorValue("1") },
      { name: "Completed", value: 0, color: getColorValue("2") },
      { name: "InProgress", value: 0, color: getColorValue("3") },
      // { name: "ReassignedPending", value: 0, color: getColorValue("4") },
      // { name: "ReassignedCompleted", value: 0, color: getColorValue("5") },
    ],
  },
];

const dailyTask7Data = [
  {
    date: "07-16-2025",
    day: "Wednesday",
    series: [
      { name: "Allocated", value: 20, color: getColorValue("1") },
      { name: "Completed", value: 10, color: getColorValue("2") },
      { name: "InProgress", value: 40, color: getColorValue("3") },
      // { name: "ReassignedPending", value: 30, color: getColorValue("4") },
      // { name: "ReassignedCompleted", value: 30, color: getColorValue("5") },
      // { name: "QueriedApproved", value: 30, color: getColorValue("3") },
      // { name: "QueriedPending", value: 30, color: getColorValue("6") },
    ],
  },
  {
    date: "07-17-2025",
    day: "Thursday",
    series: [
      { name: "Allocated", value: 0, color: getColorValue("1") },
      { name: "Completed", value: 0, color: getColorValue("2") },
      { name: "InProgress", value: 0, color: getColorValue("3") },
      // { name: "ReassignedPending", value: 0, color: getColorValue("4") },
      // { name: "ReassignedCompleted", value: 0, color: getColorValue("5") },
      // { name: "QueriedApproved", value: 0, color: getColorValue("3") },
      // { name: "QueriedPending", value: 0, color: getColorValue("6") },
    ],
  },
  {
    date: "07-18-2025",
    day: "Friday",
    series: [
      { name: "Allocated", value: 0, color: getColorValue("1") },
      { name: "Completed", value: 0, color: getColorValue("2") },
      { name: "InProgress", value: 0, color: getColorValue("3") },
      // { name: "ReassignedPending", value: 0, color: getColorValue("4") },
      // { name: "ReassignedCompleted", value: 0, color: getColorValue("5") },
      // { name: "QueriedApproved", value: 0, color: getColorValue("3") },
      // { name: "QueriedPending", value: 0, color: getColorValue("6") },
    ],
  },
];

const dailyTaskData5 = [
  "Allocated",
  "Completed",
  "InProgress",
  "ReassignedPending",
  "ReassignedCompleted",
];
const dailyTaskData7 = [
  "Allocated",
  "Completed",
  "InProgress",
  "ReassignedPending",
  "ReassignedCompleted",
  "QueriedApproved",
  "QueriedPending",
];

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

export const WorkFlow = ({
  chartType,
  chartChange,
  selectedRole,
  chartData,
}: {
  chartType: any;
  chartChange: any;
  selectedRole: any;
  chartData: any;
}) => {
  const data = chartData;
  if (chartType === "card") {
    return (
      <div className="container">
        <div className="grid grid-cols-12 gap-2">
          {data.map((item: any, idx: number) => (
            <div className={idx === 0 ? "col-span-12" : "col-span-6"} key={idx}>
              <StatusCard
                key={idx}
                status={item.status}
                value={item.value}
                coderName={selectedRole}
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
  ];
  const formattedChartData = data.map((item: any, index: number) => ({
    name: item.status,
    value: item.value,
    color: (defaultColors[index % defaultColors.length] as any) || undefined,
  }));

  const {
    categories: fileChartCategories,
    formattedSeries: fileChartFormatted,
    height: fileChartHeight,
  } = getFormattedChartData(formattedChartData, chartType);

  return chartChange ? (
    <CardSkeleton count={1} height={300} />
  ) : (
    <AppChart
      type={chartType}
      categories={fileChartCategories}
      series={fileChartFormatted}
      height={fileChartHeight}
      showLegend={true}
      showLegendBarLine={false}
      // xAxisRotated={true}
      total={getTotalChart(chart5Data)}
    />
  );
};

export const DailyTask5 = ({
  chartType,
  chartChange,
  selectedRole,
  windowWidth,
}: {
  chartType: any;
  chartChange: any;
  selectedRole: any;
  windowWidth: any;
}) => {
  return (
    <div className="flex gap-3 justify-between flex-wrap">
      <div className="flex justify-between items-center w-full gap-2">
        <IoChevronBackOutline
          className="font5 mt-5"
          id="prev-arrow"
          name="prev-arrow"
        />
        {chartChange
          ? Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton.Node
                active={true}
                key={i}
                style={{ width: windowWidth > 1290 ? 250 : 250, height: 250 }}
              />
            ))
          : dailyTaskData.map((task: any, index: number) => {
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
                      color: (params: any) => colors[params.dataIndex] || "",
                    },
                  },
                ]
                : task.series.map((s: any) => ({ ...s, color: (s.color as any) || undefined }));

            return (
              <div
                key={index}
                className="border rounded p-3 border-gray-300"
                style={{ width: "32%", minWidth: 250 }}
              >
                <div className="font-bold text-center mb-2">
                  {task.day} ({task.date})
                </div>

                <AppChart
                  type={chartType}
                  categories={categories}
                  series={formattedSeries}
                  height={240}
                  showLegend={true}
                  showLegendBarLine={false}
                  isDailyChart={true}
                  xAxisRotated={true}
                  total={getTotalChart(task.series)}
                />
              </div>
            );
          })}

        <IoChevronForwardOutline
          id="next-arrowIcon"
          name="next-arrowIcon"
          className="font5 mt-5"
        />
      </div>
      <div className="flex justify-center w-full my-2 gap-4 flex-wrap">
        {dailyTaskData[0]?.series
          ?.filter((item: any) => dailyTaskData5.includes(item.name))
          ?.map((item: any) => (
            <div key={item.name} className="flex items-center">
              <div
                style={{
                  backgroundColor: (item.color as any) || undefined,
                  width: 12,
                  height: 12,
                  borderRadius: "25%",
                  marginRight: 8,
                }}
              ></div>
              <span>{statusFormate(item.name)}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export const DailyTask7 = ({
  chartType,
  chartChange,
  selectedRole,
  windowWidth,
}: {
  chartType: any;
  chartChange: any;
  selectedRole: any;
  windowWidth: any;
}) => {
  return (
    <div className="flex gap-3 justify-between flex-wrap">
      <div className="flex justify-between items-center w-full gap-2">
        <IoChevronBackOutline
          className="font5 mt-5"
          id="prev-arrow"
          name="prev-arrow"
        />
        {chartChange
          ? Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton.Node
                active={true}
                key={i}
                style={{ width: windowWidth > 1290 ? 250 : 250, height: 250 }}
              />
            ))
          : dailyTask7Data.map((task: any, index: number) => {
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
                      color: (params: any) => colors[params.dataIndex] || "",
                    },
                  },
                ]
                : task.series.map((s: any) => ({ ...s, color: (s.color as any) || undefined }));

            return (
              <div
                key={index}
                className="border rounded p-3 border-gray-200"
                style={{ width: "32%", minWidth: 250 }}
              >
                <div className="font-bold text-center mb-2">
                  {task.day} ({task.date})
                </div>

                <AppChart
                  type={chartType}
                  categories={categories}
                  series={formattedSeries}
                  height={240}
                  showLegend={true}
                  showLegendBarLine={false}
                  isDailyChart={true}
                  xAxisRotated={true}
                  total={getTotalChart(task.series)}
                />
              </div>
            );
          })}

        <IoChevronForwardOutline
          id="next-arrowIcon"
          name="next-arrowIcon"
          className="font5 mt-5"
        />
      </div>
      <div className="flex justify-center w-full my-2 gap-4 flex-wrap">
        {dailyTask7Data[0]?.series
          ?.filter((item: any) => dailyTaskData7.includes(item.name))
          ?.map((item: any) => (
            <div key={item.name} className="flex items-center">
              <div
                style={{
                  backgroundColor: (item.color as any) || undefined,
                  width: 12,
                  height: 12,
                  borderRadius: "25%",
                  marginRight: 8,
                }}
              ></div>
              <span>{statusFormate(item.name)}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export const Accuracy = ({ chartType, chartChange, selectedRole }: { chartType: any, chartChange: any, selectedRole: any }) => {
  return (
    <>
      <div className={`flex justify-end gap-4 w-full`}>
        <div className="flex justify-between">
          <YearPicker
            type={"Daily"}
            val={"7"}
            val1={"2025"}
            onChangeMonth={() => { }}
            onChangeYear={() => { }}
            selectid="productivity-select"
            id="productivity-picker1"
            bgColor="#F3F3FF"
            hideMonth={false}
            className=""
            disabledDate={() => false}
          />
        </div>
        <div className={styles.btnScroller}>
          <Buttonscroller
            Buttons={Buttons}
            activeButton={0}
            activeColor="#fff"
            handleButtonClick={() => { }}
            inActiveColor="
                #000000"
            activeBg="#2472FF"
            containerBg="
                #E6EEFF"
            id="productivity-btncontainer"
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9">
          <AppChart
            type="line"
            categories={[
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
              20,
            ]}
            series={[
              {
                name: "Completed",
                data: [
                  0, 29, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0,
                ],
                color: (getColorValue("1") as any) || undefined,
              },
              {
                name: "Allocated",
                data: [
                  0, 0, 0, 8, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ],
                color: (getColorValue("2") as any) || undefined,
              },
            ]}
          />
        </div>
        <div className="col-span-3 my-4">
          <div
            style={{
              height: "200px",
              borderRadius: "8px",
              boxShadow: "0 0px 3px 0 rgba(0, 0, 0, 0.2)",
              border: "0.5px solid #3479FE",
              backgroundColor: "#F0F6FF",
            }}
            className="w-full"
          >
            <div className="p-4">
              <div className="flex justify-center py-2">
                <IoSpeedometerOutline className={`mt-1 text-2xl`} />
                <div className="text-lg font-medium">Average Quality</div>
              </div>
              <div className={styles.percentage}>
                <div className={styles.insideTitle}>96%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const CompletedStatus = ({ chartType, chartChange, selectedRole }: { chartType: any, chartChange: any, selectedRole: any }) => {
  return (
    <>
      <div className={`flex justify-end gap-4 w-full`}>
        <div className="flex justify-between">
          <YearPicker
            type={"Daily"}
            onChangeMonth={() => { }}
            onChangeYear={() => { }}
            val={"7"}
            val1={"2025"}
            selectid="productivity-select"
            id="productivity-picker1"
            bgColor="#F3F3FF"
            hideMonth={false}
            className=""
            disabledDate={() => false}
          />
        </div>
        <div className={styles.btnScroller}>
          <Buttonscroller
            Buttons={Buttons}
            activeButton={0}
            activeColor="#fff"
            handleButtonClick={() => { }}
            inActiveColor="#000000"
            activeBg="#2472FF"
            // inActiveBg="#F3F3FF"
            containerBg="#F3F3FF"
            id="productivity-btncontainer"
          />
        </div>
      </div>
      <AppChart
        type="line"
        categories={[
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        ]}
        series={[
          {
            name: "Completed",
            data: [0, 6, 0, 0, 7, 7, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            color: (getColorValue("1") as any) || undefined,
          },
          {
            name: "Allocated",
            data: [0, 0, 0, 1, 1, 0, 0, 2, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            color: (getColorValue("2") as any) || undefined,
          },
        ]}
      />
    </>
  );
};

export const WorkFlowCharat7 = ({ chartType, chartChange, selectedRole }: { chartType: any, chartChange: any, selectedRole: any }) => {
  const data = chart7Data;
  if (chartType === "card") {
    return (
      <div className="container">
        <div className="grid grid-cols-12 gap-2">
          {data.map((item: any, idx: number) => (
            <div className={idx === 0 ? "col-span-12" : "col-span-6"} key={idx}>
              <StatusCard
                key={idx}
                status={item.status}
                value={item.value}
                coderName={selectedRole}
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
  ];
  const formattedChartData = data.map((item: any, index: number) => ({
    name: item.status,
    value: item.value,
    color: (defaultColors[index % defaultColors.length] as any) || undefined,
  }));

  const {
    categories: fileChartCategories,
    formattedSeries: fileChartFormatted,
    height: fileChartHeight,
  } = getFormattedChartData(formattedChartData, chartType);

  return chartChange ? (
    <CardSkeleton count={1} height={300} />
  ) : (
    <AppChart
      type={chartType}
      categories={fileChartCategories}
      series={fileChartFormatted}
      height={fileChartHeight}
      showLegend={true}
      showLegendBarLine={false}
      // xAxisRotated={true}
      total={getTotalChart(chart7Data)}
    />
  );
};
