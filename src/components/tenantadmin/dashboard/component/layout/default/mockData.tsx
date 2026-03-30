import processing from "@/images/tenantAdmin/processing.svg";
import failed from "@/images/tenantAdmin/failed.svg";
import completed from "@/images/tenantAdmin/completed.svg";
import upload from "@/images/tenantAdmin/upload.svg";
import fileIcon from "@/images/tenantAdmin/file.svg";
import dosIcon from "@/images/tenantAdmin/dos.svg";
import pageIcon from "@/images/tenantAdmin/page.svg";
import { getColorValue } from "@/util/reusableFunction";
import patientCount from "@/images/dashboard/patientCount.webp";
import dosCount from "@/images/dashboard/dosCount.webp";
import pages from "@/images/dashboard/pages.webp";
import uploadContainer from "@/images/dashboard/uploadContainer.webp";
import processingContainer from "@/images/dashboard/processingContainer.webp";
import completedContainer from "@/images/dashboard/completedContainer.webp";
import failedContainer from "@/images/dashboard/failedContainer.webp";
import codeCaptureContainer from "@/images/dashboard/codeCaptureContainer.webp";
import { formatKValue, toFixedNum } from "../../function";
export const statCardsData = [
  {
    title: "Radiology",
    value: 293,
    bgColor: codeCaptureContainer,
  },
  {
    title: "Lab",
    value: 4,
    bgColor: completedContainer,
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
    bgColor: processingContainer,
  },
  {
    icon: completed,
    title: "AI Completed",
    value: 293,
    bgColor: completedContainer,
  },
  {
    icon: failed,
    title: "AI Failed",
    value: 4,
    bgColor: failedContainer,
  },
  {
    icon: failed,
    title: "AI Codes Captured",
    value: 10,
    bgColor: codeCaptureContainer,
  },
];

export const rafAndRevenue = ({ chartType }: { chartType: string }) => [
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

export const totalCodes = ({ chartType }: { chartType: string }) => [
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
    // chartBackground: "#ECF3FF",
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
    // chartBackground: "#FCEEE9",
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
export const hccCodes = ({ chartType }: { chartType: string }) => [
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
    // chartBackground: "#EFECFE",
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
    // chartBackground: "#E2F1F3",
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
export const careGapCodes = ({ chartType }: { chartType: string }) => [
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

    // chartBackground: " #E2F1F3",
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
    // chartBackground: "#DAE0FC",
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
export const potientialCodes = ({ chartType }: { chartType: string }) => [
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
    // chartBackground: "#EFECFE",
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
    // chartBackground: "#EBFCFF",
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
    description: "Type 2 diabetes mellitus without complication",
    count: 487,
  },
  {
    diagnosisCode: "I10",
    description: "Essential (primary) hypertension",
    count: 269,
  },
  {
    diagnosisCode: "J189",
    description: "Pneumonia, unspecified",
    count: 208,
  },
  {
    diagnosisCode: "U823",
    description: "Hypertension",
    count: 204,
  },
  {
    diagnosisCode: "Z930",
    description: "Tracheostomy status",
    count: 148,
  },
  {
    diagnosisCode: "J459",
    description: "Asthma, unspecified",
    count: 147,
  },
  {
    diagnosisCode: "L899",
    description: "Bedsores",
    count: 125,
  },
  {
    diagnosisCode: "L89153",
    description: "Impaired skin integrity related to prolonged bed rest",
    count: 120,
  },
  {
    diagnosisCode: "J180",
    description: "Bronchopneumonia, unspecified",
    count: 118,
  },
  {
    diagnosisCode: "E039",
    description: "Hypothyroidism, unspecified",
    count: 100,
  },
];

export const topOIGCodesMock = [
  {
    diagnosisCode: "I10",
    description: "Essential (primary) hypertension",
    count: 621,
  },
  {
    diagnosisCode: "E785",
    description: "Hyperlipidemia, unspecified",
    count: 499,
  },
  {
    diagnosisCode: "I2510",
    description:
      "Atherosclerotic heart disease of native coronary artery without angina pectoris",
    count: 75,
  },
  {
    diagnosisCode: "E1122",
    description:
      '"Type 2 diabetes mellitus with diabetic chronic kidney disease"',
    count: 75,
  },
  {
    diagnosisCode: "Z6841",
    description: "Body mass index [BMI] 40.0-44.9, adult",
    count: 70,
  },
];

export const tinTableMock = [
  {
    tinNumber: "1234",
    tinName: "TIN 1",
    progressPercentage: 97,
  },
  {
    tinNumber: "5678",
    tinName: "TIN 2",
    progressPercentage: 80,
  },
  {
    tinNumber: "9876",
    tinName: "TIN 3",
    progressPercentage: 70,
  },
  {
    tinNumber: "5432",
    tinName: "TIN 4",
    progressPercentage: 60,
  },
  {
    tinNumber: "9876",
    tinName: "TIN 5",
    progressPercentage: 55,
  },
  {
    tinNumber: "4321",
    tinName: "TIN 6",
    progressPercentage: 50,
  },
  {
    tinNumber: "8765",
    tinName: "TIN 7",
    progressPercentage: 5,
  },
];

export const fileChartCategories = [
  "June 19",
  "June 21",
  "June 23",
  "June 25",
  "June 27",
  "June 29",
  "Jul 01",
  "Jul 03",
  "Jul 05",
];
export const fileChartSeries = [
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
];

export const overallPerformance = ({ chartType }: { chartType: string }) => [
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
        name: "Valid Codes",
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
];
export const diseasesPerformance = ({ chartType }: { chartType: string }) => [
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
    customHeader: {
      label: "Valid Disease Code Distribution",
      value: "290",
      header: "Valid Disease Performance",
    },
    series: [
      {
        name: "Valid Disease Code Distribution",
        data: [0, 0, 12.34, 0, 3, 0],
        color: getColorValue("1"),
        area: chartType === "area",
      },
    ],
  },
];
export const CareGapPerformance = ({ chartType }: { chartType: string }) => [
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
];
export const PotentialPerformance = ({ chartType }: { chartType: string }) => [
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
    bgColor: patientCount,
    color: getColorValue("1"),
  },
  {
    icon: dosIcon,
    title: "New Patient",
    value: "15 Charts",
    bgColor: dosCount,
    color: getColorValue("2"),
  },
  {
    icon: pageIcon,
    title: "Discharged Patient",
    value: "10 Charts",
    bgColor: pages,
    color: getColorValue("3"),
  },
];

export const outPatientDetailsData = [
  {
    icon: fileIcon,
    title: "ER",
    value: "25 Charts",
    bgColor: patientCount,
    color: getColorValue("1"),
  },
  {
    icon: dosIcon,
    title: "Consulation",
    value: "15 Charts",
    bgColor: dosCount,
    color: getColorValue("2"),
  },
];
