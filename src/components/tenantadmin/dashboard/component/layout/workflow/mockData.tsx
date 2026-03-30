import { getFormattedChartData, getTotalChart } from "../../function";
import AppChart from "../../appchart";
import AccuracyChart from "../../accuracyChart";
import StatCard from "../../statChart";
import processing from "@/images/tenantAdmin/processing.svg";
import failed from "@/images/tenantAdmin/failed.svg";
import completed from "@/images/tenantAdmin/completed.svg";
import styles from "../../../reviewerStyles.module.css";
import Buttonscroller from "@/components/buttonSroller";
import upload from "@/images/tenantAdmin/upload.svg";
import { FaGaugeHigh } from "react-icons/fa6";
import Notifications from "../../notifications";
import {
  getColorValue,
  getStatusColor,
  getRoleColor,
  getLast30Days,
  getLast7Days,
} from "@/util/reusableFunction";
import uploadContainer from "@/images/dashboard/uploadContainer.webp";

const statCardsData = [
  // {
  //   icon: upload,
  //   title: "AI Upload",
  //   value: 293,
  //   bgColor: uploadContainer,
  // },
  {
    icon: processing,
    title: "AI Processing",
    value: 4,
    bgColor: uploadContainer,
  },
  {
    icon: completed,
    title: "AI Completed",
    value: 293,
    bgColor: uploadContainer,
  },
  {
    icon: failed,
    title: "AI Failed",
    value: 4,
    bgColor: uploadContainer,
  },
  // {
  //   icon: failed,
  //   title: "AI Codes Captured",
  //   value: 4 || 0,
  //   bgColor: codeCaptureContainer,
  //   iconColor: "#ffdbcc",
  // },
];

const TabButtons = [
  {
    id: 1,
    title:
      companyDetails == "riskgenai"
        ? "AI Quality "
        : companyDetails == "encipher" || companyDetails == "abha"
          ? "CodeGen-i"
          : "CogentAI Accuracy",
  },
  {
    id: 2,
    title: "Organization Quality",
  },
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
export const OrgPieChartInfo = ({ chartType, chartChange }: { chartType: any; chartChange: any }) => {
  const OrgPieChartSeries = [
    { name: "Three Gen", value: 5, color: getColorValue("1") },
    { name: "Health Med Pro", value: 10, color: getColorValue("3") },
    { name: "Encipher Health", value: 13, color: getColorValue("6") },
    { name: "Vanguard", value: 6, color: getColorValue("4") },
    { name: "Cogent Health", value: 15, color: getColorValue("2") },
  ];
  const {
    categories: OrgPieChartCategories,
    formattedSeries: OrgPieChartFormatted,
    height: OrgPieChartHeight,
    legendData: OrePieChartLegendData,
  } = getFormattedChartData(OrgPieChartSeries, chartType);
  return chartChange ? (
    <div className="">
      <CardSkeleton count={1} height={200} />
    </div>
  ) : (
    <AppChart
      type={chartType}
      categories={OrgPieChartCategories}
      series={OrgPieChartFormatted}
      legendData={OrePieChartLegendData}
      height={300}
      showLegend={true}
      radius={["55%", "60%"]}
      showLabel={true}
      xAxisRotated={true}
    />
  );
};

export const WorkFlowFiles = ({ chartType }: { chartType: any }) => {
  return (
    <>
      <div className="flex justify-between w-full flex-wrap gap-3">
        {statCardsData.map((card) => (
          <StatCard
            key={card.title}
            icon={card.icon}
            title={card.title}
            value={card.value}
            bgColor={card.bgColor}
            padding="16px"
            minWidth="200px"
            gap="12px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="14px"
            height="60px"
            fontSize="20px"
            fontWeight={700}
            textColor={"white"}
            textAlign="center"
            border="4px solid #B3B3B3"
          />
        ))}
      </div>

      <AppChart
        type={chartType}
        categories={[
          "June 19",
          "June 21",
          "June 23",
          "June 25",
          "June 27",
          "June 29",
          "Jul 01",
          "Jul 03",
          "Jul 05",
        ]}
        series={[
          {
            name: "Completed",
            data: [12, 13, 25, 8, 10, 25, 8, 13, 27],
            color: getColorValue("5"),
          },
          {
            name: "Processing",
            data: [5, 20, 25, 5, 20, 25, 5, 20, 25],
            color: getColorValue("7"),
          },
          {
            name: "Failed",
            data: [10, 15, 30, 10, 15, 30, 10, 15, 30],
            color: getColorValue("1"),
          },
        ]}
      />
    </>
  );
};

export const AllocatedStatus = ({ chartType, chartChange }: { chartType: any; chartChange: any }) => {
  const allocatedSeries = [
    { name: "Allocated", value: 210, color: getStatusColor("1") },
    { name: "Not Allocated", value: 0, color: getStatusColor("2") },
  ];

  const {
    categories: allocatedCategories,
    formattedSeries: allocatedFormatted,
    height: allocatedHeight,
  } = getFormattedChartData(allocatedSeries, chartType);

  return chartChange ? (
    <div className="">
      <CardSkeleton count={1} height={200} />
    </div>
  ) : (
    <AppChart
      type={chartType}
      categories={allocatedCategories}
      series={allocatedFormatted}
      height={allocatedHeight}
      showLegend={true}
      showLegendBarLine={false}
    />
  );
};

export const Coder1 = ({ chartType, chartChange }: { chartType: any; chartChange: any }) => {
  const coder1Series = [
    { name: "Allocated", value: 2, color: getStatusColor("1") },
    { name: "Completed", value: 3, color: getStatusColor("2") },
    { name: "InProgress", value: 5, color: getStatusColor("7") },
    // { name: "ReassignedPending", value: 4, color: getStatusColor("4") },
    // { name: "ReassignedCompleted", value: 6, color: getStatusColor("5") },
  ];

  const {
    categories: coder1Categories,
    formattedSeries: coder1Formatted,
    height: coder1Height,
  } = getFormattedChartData(coder1Series, chartType);

  return chartChange ? (
    <div className="">
      <CardSkeleton count={1} height={200} />
    </div>
  ) : (
    <AppChart
      type={chartType}
      categories={coder1Categories}
      series={coder1Formatted}
      height={coder1Height}
      showLegend={true}
      showLegendBarLine={false}
      xAxisRotated={true}
      total={getTotalChart(coder1Series)}
    />
  );
};

export const Coder2 = ({ chartType, chartChange }: { chartType: any; chartChange: any }) => {
  const coder2Series = [
    { name: "Allocated", value: 3, color: getStatusColor("1") },
    { name: "Completed", value: 2, color: getStatusColor("2") },
    { name: "InProgress", value: 5, color: getStatusColor("7") },
    // { name: "ReassignedPending", value: 6, color: getStatusColor("4") },
    // { name: "ReassignedCompleted", value: 1, color: getStatusColor("5") },
    // { name: "QueriedApproved", value: 4, color: getStatusColor("3") },
    // { name: "QueriedPending", value: 7, color: getStatusColor("6") },
  ];
  const {
    categories: coder2Categories,
    formattedSeries: coder2Formatted,
    height: coder2Height,
  } = getFormattedChartData(coder2Series, chartType);

  return chartChange ? (
    <div className="">
      <CardSkeleton count={1} height={200} />
    </div>
  ) : (
    <AppChart
      type={chartType}
      categories={coder2Categories}
      series={coder2Formatted}
      height={coder2Height}
      showLegend={true}
      showLegendBarLine={false}
      xAxisRotated={true}
      total={getTotalChart(coder2Series)}
    />
  );
};

export const QA = ({ chartType, chartChange }: { chartType: any; chartChange: any }) => {
  const QASeries = [
    { name: "Allocated", value: 3, color: getStatusColor("1") },
    { name: "Completed", value: 6, color: getStatusColor("2") },
    { name: "InProgress", value: 2, color: getStatusColor("7") },
    // { name: "ReassignedPending", value: 5, color: getStatusColor("4") },
    // { name: "ReassignedCompleted", value: 2, color: getStatusColor("5") },
    // { name: "QueriedApproved", value: 6, color: getStatusColor("3") },
    // { name: "QueriedPending", value: 7, color: getStatusColor("6") },
  ];
  const {
    categories: QACategories,
    formattedSeries: QAFormatted,
    height: QAHeight,
  } = getFormattedChartData(QASeries, chartType);

  return chartChange ? (
    <div className="">
      <CardSkeleton count={1} height={200} />
    </div>
  ) : (
    <AppChart
      type={chartType}
      categories={QACategories}
      series={QAFormatted}
      height={QAHeight}
      showLegend={true}
      showLegendBarLine={false}
      xAxisRotated={true}
      total={getTotalChart(QASeries)}
    />
  );
};

export const ProjectLead = ({ chartType, chartChange }: { chartType: any; chartChange: any }) => {
  const PLSeries = [
    { name: "Allocated", value: 3, color: getStatusColor("1") },
    { name: "Completed", value: 7, color: getStatusColor("2") },
    { name: "InProgress", value: 4, color: getStatusColor("7") },
    { name: "ReassignedPending", value: 2, color: getStatusColor("4") },
    { name: "ReassignedCompleted", value: 7, color: getStatusColor("5") },
    { name: "QueriedApproved", value: 4, color: getStatusColor("3") },
    { name: "QueriedPending", value: 2, color: getStatusColor("6") },
  ];
  const {
    categories: PLCategories,
    formattedSeries: PLFormatted,
    height: PLHeight,
  } = getFormattedChartData(PLSeries, chartType);

  return chartChange ? (
    <div className="">
      <CardSkeleton count={1} height={200} />
    </div>
  ) : (
    <AppChart
      type={chartType}
      categories={PLCategories}
      series={PLFormatted}
      height={PLHeight}
      showLegend={true}
      showLegendBarLine={false}
      xAxisRotated={true}
      total={getTotalChart(PLSeries)}
    />
  );
};

export const QALead = ({ chartType, chartChange }: { chartType: any; chartChange: any }) => {
  const QALeadSeries = [
    { name: "Allocated", value: 3, color: getStatusColor("1") },
    { name: "Completed", value: 6, color: getStatusColor("2") },
    { name: "InProgress", value: 3, color: getStatusColor("7") },
    { name: "ReassignedPending", value: 7, color: getStatusColor("4") },
    { name: "ReassignedCompleted", value: 8, color: getStatusColor("5") },
    { name: "QueriedApproved", value: 9, color: getStatusColor("3") },
    { name: "QueriedPending", value: 10, color: getStatusColor("6") },
  ];
  const {
    categories: QALeadCategories,
    formattedSeries: QALeadFormatted,
    height: QALeadHeight,
  } = getFormattedChartData(QALeadSeries, chartType);

  return chartChange ? (
    <div className="">
      <CardSkeleton count={1} height={200} />
    </div>
  ) : (
    <AppChart
      type={chartType}
      categories={QALeadCategories}
      series={QALeadFormatted}
      height={QALeadHeight}
      showLegend={true}
      showLegendBarLine={false}
      xAxisRotated={true}
      total={getTotalChart(QALeadSeries)}
    />
  );
};

export const Owner = ({ chartType, chartChange }: { chartType: any; chartChange: any }) => {
  const OwnerSeries = [
    { name: "Allocated", value: 5, color: getStatusColor("1") },
    { name: "Completed", value: 3, color: getStatusColor("2") },
    { name: "InProgress", value: 8, color: getStatusColor("7") },
    { name: "ReassignedPending", value: 2, color: getStatusColor("4") },
    { name: "ReassignedCompleted", value: 8, color: getStatusColor("5") },
    { name: "QueriedApproved", value: 3, color: getStatusColor("3") },
    { name: "QueriedPending", value: 6, color: getStatusColor("6") },
  ];
  const {
    categories: OwnerCategories,
    formattedSeries: OwnerFormatted,
    height: OwnerHeight,
  } = getFormattedChartData(OwnerSeries, chartType);

  return chartChange ? (
    <div className="">
      <CardSkeleton count={1} height={200} />
    </div>
  ) : (
    <AppChart
      type={chartType}
      categories={OwnerCategories}
      series={OwnerFormatted}
      height={OwnerHeight}
      showLegend={true}
      showLegendBarLine={false}
      xAxisRotated={true}
      total={getTotalChart(OwnerSeries)}
    />
  );
};

export const Users = ({ chartType, chartChange }: { chartType: any; chartChange: any }) => {
  const UsersSeries = [
    { name: "Admin", value: 2, color: getRoleColor("1") },
    { name: "Coder 1", value: 6, color: getRoleColor("2") },
    { name: "Coder 2", value: 8, color: getRoleColor("3") },
    { name: "QA", value: 12, color: getRoleColor("4") },
    { name: "QA Lead", value: 4, color: getRoleColor("5") },
    { name: "Project Lead", value: 13, color: getRoleColor("6") },
    { name: "Owner", value: 6, color: getRoleColor("7") },
  ];
  const {
    categories: UsersSeriesCategories,
    formattedSeries: UsersSeriesFormatted,
    height: UsersSeriesHeight,
  } = getFormattedChartData(UsersSeries, chartType);

  return chartChange ? (
    <div className="">
      <CardSkeleton count={1} height={200} />
    </div>
  ) : (
    <AppChart
      type={chartType}
      categories={UsersSeriesCategories}
      series={UsersSeriesFormatted}
      height={UsersSeriesHeight}
      showLegend={true}
      showLegendBarLine={false}
      xAxisRotated={true}
    />
  );
};

export const Accuracy = ({ chartType, chartChange, series }: { chartType: any; chartChange: any; series: any }) => {
  const date = [
    "2026-01-04",
    "2026-01-05",
    "2026-01-06",
    "2026-01-07",
    "2026-01-08",
    "2026-01-09",
    "2026-01-10",
  ];
  const accuracyChart = [
    {
      name: "Total Codes Count",
      data: [
        { date: "2026-01-04", value: 7 },
        { date: "2026-01-05", value: 18 },
        { date: "2026-01-06", value: 10 },
        { date: "2026-01-07", value: 25 },
        { date: "2026-01-08", value: 14 },
        { date: "2026-01-09", value: 9 },
        { date: "2026-01-10", value: 22 },
      ],
      color: "#2472FF",
      yAxis: 1,
      type: "column",
    },
    {
      name: "Engine Score",
      data: [
        { date: "2026-01-04", value: 70 },
        { date: "2026-01-05", value: 90 },
        { date: "2026-01-06", value: 78 },
        { date: "2026-01-07", value: 100 },
        { date: "2026-01-08", value: 82 },
        { date: "2026-01-09", value: 74 },
        { date: "2026-01-10", value: 88 },
      ],
      color: "#2CAFFE",
      yAxis: 0,
      type: "spline",
    },
  ];

  const productivityChart = [
    {
      name: "Add",
      type: "column",
      color: getColorValue("5"),
      stack: "allocation",
      yAxis: 1,
      data: [
        { date: "2026-01-04", pendingCount: 15 },
        { date: "2026-01-05", pendingCount: 9 },
        { date: "2026-01-06", pendingCount: 14 },
        { date: "2026-01-07", pendingCount: 11 },
        { date: "2026-01-08", pendingCount: 17 },
        { date: "2026-01-09", pendingCount: 8 },
        { date: "2026-01-10", pendingCount: 20 },
      ],
      plotConfig: { key: "date", value: "pendingCount" },
    },
    {
      name: "Edit",
      type: "column",
      color: getColorValue("2"),
      stack: "allocation",
      yAxis: 1,
      data: [
        { date: "2026-01-04", completedCount: 35 },
        { date: "2026-01-05", completedCount: 40 },
        { date: "2026-01-06", completedCount: 32 },
        { date: "2026-01-07", completedCount: 38 },
        { date: "2026-01-08", completedCount: 29 },
        { date: "2026-01-09", completedCount: 33 },
        { date: "2026-01-10", completedCount: 41 },
      ],
      plotConfig: { key: "date", value: "completedCount" },
    },
    {
      name: "Move",
      type: "column",
      color: getColorValue("3"),
      stack: "allocation",
      yAxis: 1,
      data: [
        { date: "2026-01-04", rejectedCount: 4 },
        { date: "2026-01-05", rejectedCount: 6 },
        { date: "2026-01-06", rejectedCount: 3 },
        { date: "2026-01-07", rejectedCount: 5 },
        { date: "2026-01-08", rejectedCount: 2 },
        { date: "2026-01-09", rejectedCount: 4 },
        { date: "2026-01-10", rejectedCount: 6 },
      ],
      plotConfig: { key: "date", value: "rejectedCount" },
    },
    {
      name: "Delete",
      type: "column",
      color: getColorValue("1"),
      stack: "allocation",
      yAxis: 1,
      data: [
        { date: "2026-01-04", rejectedCount: 2 },
        { date: "2026-01-05", rejectedCount: 3 },
        { date: "2026-01-06", rejectedCount: 2 },
        { date: "2026-01-07", rejectedCount: 4 },
        { date: "2026-01-08", rejectedCount: 1 },
        { date: "2026-01-09", rejectedCount: 3 },
        { date: "2026-01-10", rejectedCount: 4 },
      ],
      plotConfig: { key: "date", value: "rejectedCount" },
    },
    {
      name: "Submit",
      type: "column",
      color: getColorValue("4"),
      stack: "allocation",
      yAxis: 1,
      data: [
        { date: "2026-01-04", rejectedCount: 5 },
        { date: "2026-01-05", rejectedCount: 6 },
        { date: "2026-01-06", rejectedCount: 4 },
        { date: "2026-01-07", rejectedCount: 7 },
        { date: "2026-01-08", rejectedCount: 3 },
        { date: "2026-01-09", rejectedCount: 5 },
        { date: "2026-01-10", rejectedCount: 6 },
      ],
      plotConfig: { key: "date", value: "rejectedCount" },
    },
    {
      name: "Accuracy %",
      type: "spline",
      color: "#2CAFFE",
      yAxis: 0,
      data: [
        { date: "2026-01-04", accuracyScore: 91 },
        { date: "2026-01-05", accuracyScore: 86 },
        { date: "2026-01-06", accuracyScore: 89 },
        { date: "2026-01-07", accuracyScore: 93 },
        { date: "2026-01-08", accuracyScore: 88 },
        { date: "2026-01-09", accuracyScore: 84 },
        { date: "2026-01-10", accuracyScore: 92 },
      ],
      plotConfig: { key: "date", value: "accuracyScore" },
    },
  ];
  return (
    <>
      <div
        style={{
          margin: "20px 20px 0px 0px",
          display: "flex",
        }}
        className="flex justify-end"
      >
        {/* <div>
          <Buttonscroller
            Buttons={TabButtons}
            handleButtonClick={() => {}}
            activeButton={0}
            activeColor="#fff"
            inActiveColor="#000000"
            activeBg="#2472FF"
            // inActiveBg="#E6EEFF"
            containerBg="#E6EEFF"
            width="150px"
          />
        </div> */}
      </div>
      <div className="flex flex-wrap">
        <div className={series === "Accuracy" ? "w-3/4" : "w-full"}>
          <AccuracyChart
            type="column"
            xAxisFontColor="Gray"
            LeftYaxisFont="black"
            yAxis1Title={
              series === "Accuracy" ? "Accuracy Changes Count" : "Accuracy"
            }
            yAxis2Title={
              series === "Accuracy" ? "Accuracy Changes Count" : "Total Codes"
            }
            yAxisFont1="#2CAFFE"
            yAxisFont2="#2472FF"
            rightYaxisFont="black"
            customDate={date}
            selectedValue={"custom"}
            series={series === "Accuracy" ? accuracyChart : productivityChart}
          />
        </div>
        {series === "Accuracy" && (
          <div className="w-1/4">
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
              <div className="p-4">
                <div className="flex justify-center py-2">
                  <FaGaugeHigh
                    className={`mt-1 ${styles.Img}`}
                  />
                  <div className={styles.heading}>Average Score</div>
                </div>
                <div className={styles.percentage}>
                  <h1 className="font-bold">93%</h1>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const Notificatin = () => {
  return (
    <div className="py-2">
      <Notifications useDummyData={true} dummyNotificationData={dummyData} />
    </div>
  );
};

export const allocationStatusData = ({ chartType }: { chartType: any }) => [
  {
    type: chartType,
    size: "col-12",
    categories: [
      "Feb 26",
      "Mar 1",
      "Mar 4",
      "Mar 7",
      "Mar 9",
      "Mar 13",
      "Mar 16",
    ],
    series: [
      {
        name: "Allocated",
        data: [10, 20, 30, 40, 50, 60, 70],
        color: getColorValue("2"),
        stack: "same",
      },
      {
        name: "Pending",
        data: [2, 6, 9, 3, 5, 7, 8],
        color: getColorValue("3"),
        stack: "same",
      },
      {
        name: "Completed",
        data: [8, 14, 21, 37, 45, 53, 62],
        color: getColorValue("4"),
        stack: "same",
      },
    ],
  },
];
