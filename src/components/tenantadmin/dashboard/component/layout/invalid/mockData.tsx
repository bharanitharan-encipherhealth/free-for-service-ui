import React from "react";
import AppChart from "../../appchart";
import { getColorValue } from "@/util/reusableFunction";
import CardSkeleton from "@/components/skeleton/card";
import { formatKValue, toFixedNum } from "../../function";

const teleVisitNew = "/images/dashboard/televisitnew.webp";
const invalidNew = "/images/dashboard/invalidnew.webp";
const dosnew = "/images/dashboard/calender1.webp";
const multipleNew = "/images/dashboard/multiplenew.webp";
const mrnNew = "/images/dashboard/mrnnew.webp";
const illegalNew = "/images/dashboard/illelegalnew.webp";
const scopeNew = "/images/dashboard/scopenew.webp";
const imProper = "/images/dashboard/improper.webp";
const dos1 = "/images/dashboard/calenderDos1.webp";

const categoriesDate = [ "Feb 26", "Mar 1", "Mar 4", "Mar 7", "Mar 9", "Mar 13", "Mar 16" ];

interface WidgetComponentProps {
  chartType?: string;
  chartChange?: boolean;
}

export const DOSCount: React.FC<WidgetComponentProps> = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      categories={categoriesDate}
      series={[
        {
          name: "DOS Count",
          data: [361, 150, 40, 100, 25.6, 24.6, 26],
          color: (getColorValue("7") as any) || undefined,
        },
      ]}
      customHeader={{
        label: "Current / Overall",
        value: formatKValue(toFixedNum(732, 2)) + " / " + formatKValue(toFixedNum(800, 2)),
        images: dosnew,
        background: "#A8ADFF",
        header: "DOS Count",
      }}
    />
  );
};

export const InvalidDocument: React.FC<WidgetComponentProps> = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      categories={categoriesDate}
      customHeader={{
        label: "Current / Overall",
        value: 241 + " / " + formatKValue(toFixedNum(4000, 2)),
        images: imProper,
        background: "#FFDCDC",
        header: "Invalid Document",
      }}
      series={[
        {
          name: "Invalid Document",
          data: [36, 28, 40, 33, 31, 37, 36],
          color: (getColorValue("5") as any) || undefined,
        },
      ]}
    />
  );
};

export const Televisit: React.FC<WidgetComponentProps> = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: "111 / 200",
        images: teleVisitNew,
        background: "#CDE0FE",
        header: "Audio Visit Count",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Audio Visit Count",
          data: [14, 19, 10, 16, 12, 20, 20],
          color: (getColorValue("4") as any) || undefined,
        },
      ]}
    />
  );
};

export const InvalidCredentails: React.FC<WidgetComponentProps> = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: "76 / 90",
        images: invalidNew,
        background: "#D3F2F8",
        header: "Invalid Credentails",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Invalid Credentails",
          data: [9, 14, 7, 10, 11, 13, 12],
          color: (getColorValue("3") as any) || undefined,
        },
      ]}
    />
  );
};

export const PatientDOBMismatch: React.FC<WidgetComponentProps> = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: "32 / 40",
        images: dos1,
        background: "#D2CCFF",
        header: "Patient DOB Mismatch",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Patient DOB Mismatch",
          data: [4, 3, 6, 5, 4, 5, 5],
          color: (getColorValue("7") as any) || undefined,
        },
      ]}
    />
  );
};

export const PatientNameMismatch: React.FC<WidgetComponentProps> = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: "27 / " + formatKValue(toFixedNum(1000, 2)),
        images: multipleNew,
        background: "#CDE0FE",
        header: "Patient Name Mismatch",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Patient Name Mismatch",
          data: [3, 4, 2, 5, 3, 4, 6],
          color: (getColorValue("4") as any) || undefined,
        },
      ]}
    />
  );
};

export const ScopeYearMismatch: React.FC<WidgetComponentProps> = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: 68 + " / " + formatKValue(toFixedNum(2500, 2)),
        images: scopeNew,
        background: "#D1DAFA",
        header: "Scope Year Mis-match",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Scope Year Mis-match",
          data: [10, 7, 12, 9, 8, 11, 11],
          color: (getColorValue("1") as any) || undefined,
        },
      ]}
    />
  );
};

export const PatientDeceased: React.FC<WidgetComponentProps> = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: "8 / 50",
        images: multipleNew,
        background: "#CDE0FE",
        header: "Patient Deceased",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Patient Deceased",
          data: [1, 1, 2, 0, 1, 2, 1],
          color: (getColorValue("4") as any) || undefined,
        },
      ]}
    />
  );
};

export const MRNIDMismatch: React.FC<WidgetComponentProps> = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: 297 + " / " + formatKValue(toFixedNum(1500, 2)),
        images: mrnNew,
        background: "#D2CCFF",
        header: "MRN ID Mismatch",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "MRN ID Mismatch",
          data: [45, 38, 41, 36, 47, 43, 47],
          color: (getColorValue("7") as any) || undefined,
        },
      ]}
    />
  );
};

export const MultiplePatientFound: React.FC<WidgetComponentProps> = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: "5 / 30",
        images: multipleNew,
        background: "#CDE0FE",
        header: "Multiple Patient Found",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Multiple Patient Found",
          data: [1, 0, 0, 1, 1, 1, 1],
          color: (getColorValue("4") as any) || undefined,
        },
      ]}
    />
  );
};

export const PatientInActive: React.FC<WidgetComponentProps> = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: 297 + " / " + formatKValue(toFixedNum(3300, 2)),
        images: illegalNew,
        background: "#D3F2F8",
        header: "Patient In-active",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Patient In-active",
          data: [1, 1, 1, 1, 1, 0, 0],
          color: (getColorValue("3") as any) || undefined,
        },
      ]}
    />
  );
};

export const ProviderMissed: React.FC<WidgetComponentProps> = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: "8 / 50",
        images: mrnNew,
        background: "#D2CCFF",
        header: "Provider Missed",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Provider Missed",
          data: [1, 1, 2, 0, 1, 2, 1],
          color: (getColorValue("7") as any) || undefined,
        },
      ]}
    />
  );
};

export const ProviderSignMissed: React.FC<WidgetComponentProps> = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: 68 + " / " + formatKValue(toFixedNum(2500, 2)),
        images: mrnNew,
        background: "#D2CCFF",
        header: "Provider Sign Missed",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Provider Sign Missed",
          data: [10, 7, 12, 9, 8, 11, 11],
          color: (getColorValue("7") as any) || undefined,
        },
      ]}
    />
  );
};

export const NoHccFound: React.FC<WidgetComponentProps> = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: 297 + " / " + formatKValue(toFixedNum(3300, 2)),
        images: illegalNew,
        background: "#D3F2F8",
        header: "No HCC Found",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "No HCC Found",
          data: [1, 1, 1, 1, 1, 0, 0],
          color: (getColorValue("3") as any) || undefined,
        },
      ]}
    />
  );
};

export const OutOfScope: React.FC<WidgetComponentProps> = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: 297 + " / " + formatKValue(toFixedNum(3300, 2)),
        images: scopeNew,
        background: "#D1DAFA",
        header: "Out Of Scope",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Out Of Scope",
          data: [45, 38, 41, 36, 47, 43, 47],
          color: (getColorValue("1") as any) || undefined,
        },
      ]}
    />
  );
};

export const ProviderUnauthorized: React.FC<WidgetComponentProps> = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: "76 / 90",
        images: invalidNew,
        background: "#D3F2F8",
        header: "Provider Unauthorized",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Provider Unauthorized",
          data: [9, 14, 7, 10, 11, 13, 12],
          color: (getColorValue("3") as any) || undefined,
        },
      ]}
    />
  );
};