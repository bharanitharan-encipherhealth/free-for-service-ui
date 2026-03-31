import { getColorValue } from "@/util/reusableFunction";
import { formatKValue, toFixedNum } from "../../function";
import React from "react";
import StatusCard from "../../statusCard";
import CardSkeleton from "@/components/skeleton/card";
import AppChart from "../../appchart";
import { getTotalChart, getFormattedChartData } from "../../function";
import { IoChevronForwardOutline, IoChevronBackOutline } from "react-icons/io5";
import { Skeleton } from "antd";

const processing = "/images/dashboard/processing.svg";
const failed = "/images/dashboard/failed.svg";
const completed = "/images/dashboard/completed.svg";
const upload = "/images/dashboard/upload.svg";
const fileIcon = "/images/dashboard/file.svg";
const dosIcon = "/images/dashboard/dos.svg";
const pageIcon = "/images/dashboard/page.svg";
const patientCount = "/images/dashboard/patientCount.webp";
const dosCount = "/images/dashboard/dosCount.webp";
const pages = "/images/dashboard/pages.webp";
const processingContainer = "/images/dashboard/processingContainer.webp";
const completedContainer = "/images/dashboard/completedContainer.webp";
const failedContainer = "/images/dashboard/failedContainer.webp";
const codeCaptureContainer = "/images/dashboard/codeCaptureContainer.webp";

export const statCardsData = [
  {
    title: "Radiology",
    value: 293,
    bgColor: codeCaptureContainer,
    icon: processing,
  },
  {
    title: "Lab",
    value: 4,
    bgColor: completedContainer,
    icon: completed,
  },
];

export const fileCountData = [
  {
    icon: fileIcon,
    title: "Patients Count",
    value: "120",
    bgColor: patientCount,
    color: getColorValue("1"),
  },
  {
    icon: dosIcon,
    title: "DOS Count",
    value: "1K",
    bgColor: dosCount,
    color: getColorValue("2"),
  },
  {
    icon: pageIcon,
    title: "Pages",
    value: "3.2K",
    bgColor: pages,
    color: getColorValue("3"),
  },
];

export const statCardData = [
  {
    icon: processing,
    title: "AI Processing",
    value: 4,
    bgColor:
      "linear-gradient(129.12deg, #03512E -5.66%, rgba(3, 81, 46, 0.5) 102.29%)",
  },
  {
    icon: completed,
    title: "AI Completed",
    value: 293,
    bgColor:
      "linear-gradient(126.88deg, #87C282 -2.24%, rgba(135, 194, 130, 0.5) 104.92%)",
  },
  {
    icon: failed,
    title: "AI Failed",
    value: 4,
    bgColor:
      "linear-gradient(128.05deg, #5ABA8A -8.93%, rgba(90, 186, 138, 0.5) 97.89%)",
  },
];

export const rafAndRevenue = ({ chartType }: any) => [
  {
    type: "stat",
    size: "col-5",
    mainTitle: "HCC RAF",
    title: "HCC Raf",
    value: 242.6,
    bgColor: patientCount,
    backgroundColor: getColorValue("7"),
  },
  {
    type: chartType,
    size: "col-7",
    categories: [
      "Feb 26",
      "Mar 1",
      "Mar 4",
      "Mar 7",
      "Mar 9",
      "Mar 13",
      "Mar 16",
    ],
    customHeader: {
      header: "HCC Revenue Impact",
      value: formatKValue(21400),
    },
    legend: {
      show: true,
    },
    series: [
      {
        name: "Revenue",
        data: [0, 0, 12.34, 0, 3, 0],
        color: getColorValue("7"),
        area: chartType === "area",
      },
    ],
  },
];

export const totalCodes = ({ chartType }: any) => [
  {
    type: chartType,
    size: "col-4",
    categories: [
      "Feb 26",
      "Mar 1",
      "Mar 4",
      "Mar 7",
      "Mar 9",
      "Mar 13",
      "Mar 16",
    ],
    customHeader: {
      label: "Code Distribution",
      value: "831",
      header: "Overall Performance",
    },
    series: [
      {
        name: "Total Codes",
        data: [0, 0, 3.34, 0, 0.1, 0, 8.9],
        color: getColorValue("3"),
        area: chartType === "area",
      },
      {
        name: "HCC Codes",
        data: [0, 0, 0, 0.3, 0.6, 0, 4],
        color: getColorValue("1"),
        area: chartType === "area",
      },
      {
        name: "Care Gap Codes",
        data: [0, 0, 0, 1.3, 0.4, 0, 4],
        color: getColorValue("2"),
        area: chartType === "area",
      },
      {
        name: "Potiential Codes",
        data: [0, 0, 0.2, 0.4, 0, 0],
        color: getColorValue("4"),
        area: chartType === "area",
      },
    ],
  },
  {
    type: chartType,
    size: "col-4",
    categories: [
      "Feb 26",
      "Mar 1",
      "Mar 4",
      "Mar 7",
      "Mar 9",
      "Mar 13",
      "Mar 16",
    ],
    customHeader: {
      label: "Overall RAF Score",
      value: "58.237",
      header: "RAF Score",
    },
    series: [
      {
        name: "Total RAF",
        data: [0, 0, 0.2, 0.4, 0, 0],
        color: getColorValue("3"),
        area: chartType === "area",
      },
      {
        name: "HCC RAF",
        data: [0, 0, 2.1, 0, 0.1, 0, 8.9],
        color: getColorValue("1"),
        area: chartType === "area",
      },
      {
        name: "Care Gap RAF",
        data: [0, 0, 0, 1.3, 0.4, 0, 4],
        color: getColorValue("2"),
        area: chartType === "area",
      },
      {
        name: "Potiential RAF",
        data: [0, 0, 0.5, 0.3, 0.6, 0, 4],
        color: getColorValue("4"),
        area: chartType === "area",
      },
    ],
  },
  {
    type: chartType,
    size: "col-4",
    categories: [
      "Feb 26",
      "Mar 1",
      "Mar 4",
      "Mar 7",
      "Mar 9",
      "Mar 13",
      "Mar 16",
    ],
    customHeader: {
      label: "Overall Revenue Impact",
      value: formatKValue(toFixedNum(46800, 2)),
      header: "Revenue",
    },
    series: [
      {
        name: "Total Revenue",
        data: [100.455, 10, 34, 0.67, 12, 0],
        color: getColorValue("3"),
        step: "middle",
      },
      {
        name: "HCC Revenue",
        data: [0, 8, 0.5, 0.3, 0.6, 0, 4],
        color: getColorValue("1"),
        step: "middle",
      },
      {
        name: "Care Gap Revenue",
        data: [0, 0, 0, 1.3, 0.4, 0, 4],
        color: getColorValue("2"),
        step: "middle",
      },
      {
        name: "Potiential Revenue",
        data: [10, 0, 5, 2.3, 0, 1.445],
        color: getColorValue("4"),
        step: "middle",
      },
    ],
  },
];

export const hccCodes = ({ chartType }: any) => [
  {
    type: chartType,
    size: "col-4",
    categories: [
      "Feb 26",
      "Mar 1",
      "Mar 4",
      "Mar 7",
      "Mar 9",
      "Mar 13",
      "Mar 16",
    ],
    customHeader: {
      label: "HCC Code Distribution",
      value: "290",
      header: "HCC Performance",
    },
    series: [
      {
        name: "Diseases Code Distribution",
        data: [0, 0, 12.34, 0, 3, 0],
        color: getColorValue("1"),
        area: chartType === "area",
      },
    ],
  },
  {
    type: chartType,
    size: "col-4",
    categories: [
      "Feb 26",
      "Mar 1",
      "Mar 4",
      "Mar 7",
      "Mar 9",
      "Mar 13",
      "Mar 16",
    ],
    customHeader: {
      label: "HCC RAF",
      value: "24.091",
      header: "RAF Score",
    },
    series: [
      {
        name: "HCC RAF",
        data: [0, 0, 0.2, 0, 0.1, 0],
        color: getColorValue("1"),
        area: chartType === "area",
      },
    ],
  },
  {
    type: chartType,
    size: "col-4",
    categories: [
      "Feb 26",
      "Mar 1",
      "Mar 4",
      "Mar 7",
      "Mar 9",
      "Mar 13",
      "Mar 16",
    ],
    customHeader: {
      label: "HCC Revenue Impact",
      value: formatKValue(toFixedNum(19400, 2)) || 0,
      header: "Revenue",
    },
    series: [
      {
        name: "HCC Revenue Impact",
        data: [0, 0, 0, 106.78, 0, 0],
        color: getColorValue("1"),
        step: "middle",
      },
    ],
  },
];

export const careGapCodes = ({ chartType }: any) => [
  {
    type: chartType,
    size: "col-4",
    categories: [
      "Feb 26",
      "Mar 1",
      "Mar 4",
      "Mar 7",
      "Mar 9",
      "Mar 13",
      "Mar 16",
    ],
    customHeader: {
      label: "Care Gap Code Distribution",
      value: "241",
      header: "Care Gap Performance",
    },
    series: [
      {
        name: "Care Gap Code Distribution",
        data: [756, 92, 20, 91, 42, 24, 56],
        color: getColorValue("3"),
        area: chartType === "area",
      },
    ],
  },
  {
    type: chartType,
    size: "col-4",
    categories: [
      "Feb 26",
      "Mar 1",
      "Mar 4",
      "Mar 7",
      "Mar 9",
      "Mar 13",
      "Mar 16",
    ],
    customHeader: {
      label: "Care Gap RAF",
      value: "34.985",
      header: "RAF Score",
    },
    series: [
      {
        name: "Care Gap RAF",
        data: [0, 0, 0.2, 0, 0.1, 0],
        color: getColorValue("3"),
        area: chartType === "area",
      },
    ],
  },
  {
    type: chartType,
    size: "col-4",
    categories: [
      "Feb 26",
      "Mar 1",
      "Mar 4",
      "Mar 7",
      "Mar 9",
      "Mar 13",
      "Mar 16",
    ],
    customHeader: {
      label: "Care Gap Revenue Impact",
      value: formatKValue(toFixedNum(27409, 2)),
      header: "Revenue",
    },
    series: [
      {
        name: "Care Gap Revenue Impact",
        data: [0, 123.567, 0, 0, 137.423, 0, 0, 0],
        color: getColorValue("3"),
        step: "middle",
      },
    ],
  },
];

export const potientialCodes = ({ chartType }: any) => [
  {
    type: chartType,
    size: "col-4",
    categories: [
      "Feb 26",
      "Mar 1",
      "Mar 4",
      "Mar 7",
      "Mar 9",
      "Mar 13",
      "Mar 16",
    ],
    customHeader: {
      label: "Potential Code Distribution",
      value: "300",
      header: "Potential Performance",
    },
    series: [
      {
        name: "Potential Code Distribution",
        data: [762, 92, 20, 91, 132, 24, 56],
        color: getColorValue("4"),
        area: chartType === "area",
      },
    ],
  },
  {
    type: chartType,
    size: "col-4",
    categories: [
      "Feb 26",
      "Mar 1",
      "Mar 4",
      "Mar 7",
      "Mar 9",
      "Mar 13",
      "Mar 16",
    ],
    customHeader: {
      label: "Potential RAF",
      value: "18.230",
      header: "RAF Score",
    },
    series: [
      {
        name: "Potiential RAF",
        data: [0, 0, 0.2, 0, 0.1, 0],
        color: getColorValue("4"),
        area: chartType === "area",
      },
    ],
  },
  {
    type: chartType,
    size: "col-4",
    categories: [
      "Feb 26",
      "Mar 1",
      "Mar 4",
      "Mar 7",
      "Mar 9",
      "Mar 13",
      "Mar 16",
    ],
    customHeader: {
      label: "Potential Revenue Impact",
      value: formatKValue(toFixedNum(0, 2)),
      header: "Revenue",
    },
    series: [
      {
        name: "Potential Revenue Impact",
        data: [0, 0, 0, 106.78, 0, 0],
        color: getColorValue("4"),
        step: "middle",
      },
    ],
  },
];

export const top10DiseasesMock = [
  {
    diagnosisCode: "E119",
    description: "T2DM without complication",
    count: 487,
  },
  {
    diagnosisCode: "I10",
    description: "Essential (primary) hypertension",
    count: 269,
  },
];

export const topOIGCodesMock = [
  {
    diagnosisCode: "I10",
    description: "Essential (primary) hypertension",
    count: 621,
  },
];

export const tinTableMock = [
  { tinNumber: "1234", tinName: "TIN 1", progressPercentage: 97 },
];

export const fileChartSeries = [
  { name: "Completed", data: [12, 13, 25], color: getColorValue("5") },
  { name: "Processing", data: [5, 20, 25], color: getColorValue("7") },
  { name: "Failed", data: [10, 15, 30], color: getColorValue("1") },
];

export const overallPerformance = ({ chartType }: any) => [
  {
    type: chartType,
    size: "col-12",
    categories: ["Feb 26", "Mar 1"],
    customHeader: {
      label: "Code Distribution",
      value: "831",
      header: "Overall Performance",
    },
    series: [
      {
        name: "Total Codes",
        data: [10, 20, 30, 40, 50, 60, 70],
        color: getColorValue("1"),
        area: chartType === "area",
      },
    ],
  },
];

export const diseasesPerformance = ({ chartType }: any) => [
  {
    type: chartType,
    size: "col-12",
    categories: ["Feb 26", "Mar 1"],
    customHeader: {
      label: "Valid Disease Code Distribution",
      value: "290",
      header: "Valid Disease Performance",
    },
    series: [
      {
        name: "Valid Disease Code Distribution",
        data: [0, 0],
        color: getColorValue("1"),
        area: chartType === "area",
      },
    ],
  },
];

export const CareGapPerformance = ({ chartType }: any) => [
  {
    type: chartType,
    size: "col-12",
    categories: ["Feb 26", "Mar 1"],
    customHeader: {
      label: "Care Gap Code Distribution",
      value: "241",
      header: "Care Gap Performance",
    },
    series: [
      {
        name: "Care Gap Code Distribution",
        data: [756, 92],
        color: getColorValue("3"),
        area: chartType === "area",
      },
    ],
  },
];

export const PotentialPerformance = ({ chartType }: any) => [
  {
    type: chartType,
    size: "col-12",
    categories: ["Feb 26", "Mar 1"],
    customHeader: {
      label: "Potential Code Distribution",
      value: "300",
      header: "Potential Performance",
    },
    series: [
      {
        name: "Potential Code Distribution",
        data: [762, 92],
        color: getColorValue("4"),
        area: chartType === "area",
      },
    ],
  },
];

export const patientOverllCountData = [
  { status: "OverallPatientCount", value: 5 },
  { status: "InPatient", value: 3 },
  { status: "OutPatient", value: 8 },
];

export const inPatientDetailsData = [
  {
    icon: fileIcon,
    title: "Exsisting Patient",
    value: "25 Charts",
    bgColor:
      "linear-gradient(129.12deg, #03512E -5.66%, rgba(3, 81, 46, 0.5) 102.29%)",
    color: getColorValue("1"),
  },
  {
    icon: dosIcon,
    title: "New Patient",
    value: "15 Charts",
    bgColor:
      "linear-gradient(126.88deg, #87C282 -2.24%, rgba(135, 194, 130, 0.5) 104.92%)",
    color: getColorValue("2"),
  },
  {
    icon: pageIcon,
    title: "Discharged Patient",
    value: "10 Charts",
    bgColor:
      "linear-gradient(128.05deg, #5ABA8A -8.93%, rgba(90, 186, 138, 0.5) 97.89%)",
    color: getColorValue("3"),
  },
];

export const outPatientDetailsData = [
  {
    icon: fileIcon,
    title: "ER",
    value: "25 Charts",
    bgColor:
      "linear-gradient(129.12deg, #03512E -5.66%, rgba(3, 81, 46, 0.5) 102.29%)",
    color: getColorValue("1"),
  },
  {
    icon: dosIcon,
    title: "Consulation",
    value: "15 Charts",
    bgColor:
      "linear-gradient(126.88deg, #87C282 -2.24%, rgba(135, 194, 130, 0.5) 104.92%)",
    color: getColorValue("2"),
  },
];

interface WorkFlowProps {
  chartType: any;
  chartChange: any;
  selectedRole?: any;
  chartData: any;
  windowWidth?: any;
}

export const WorkFlow: React.FC<WorkFlowProps> = ({
  chartType,
  chartChange,
  selectedRole,
  chartData,
  windowWidth,
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
    color: defaultColors[index % defaultColors.length],
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
      total={getTotalChart(data)}
    />
  );
};
