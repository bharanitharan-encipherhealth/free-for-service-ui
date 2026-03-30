import { useEffect, useState } from "react";

export const toFixedNum = (value: any, precision = 2): number => {
  return typeof value === "number" ? parseFloat(value?.toFixed(precision)) : 0;
};

export const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return windowWidth;
};

export function formatDate(dateString: string | Date) {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  return month + day;
}

export function formatValues(values: any, dates: string[]) {
  const formatobj: any = {};

  if (Array.isArray(values)) {
    values.forEach((obj) => {
      const key = Object.keys(obj)[0];
      const formattedKey = formatDate(key);
      formatobj[formattedKey] = obj[key];
    });
  } else if (values && typeof values === "object") {
    Object.keys(values).forEach((key) => {
      const formattedKey = formatDate(key);
      formatobj[formattedKey] = values[key];
    });
  }
  let resultArray = [];
  if (dates.length === 1) {
    const singleDate = dates[0];
    const nextDate = new Date(singleDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const currentFormatted = formatDate(singleDate);
    const nextFormatted = formatDate(nextDate);

    resultArray = [
      formatobj[currentFormatted] || 0,
      formatobj[nextFormatted] || 0,
    ];
  } else {
    resultArray = dates.map((date) => formatobj[formatDate(date)] || 0);
  }

  return resultArray;
}

export const getChartTimeLine = (obj: any[], plotConfig: { key: string; value: string }) => {
  const { key, value } = plotConfig;
  const tempObj: any = {};
  if (obj) {
    for (const i of obj) {
      tempObj[i[key]] = toFixedNum(i[value], 2);
    }
  }
  return tempObj;
};

export const statusFormate = (status: any) => {
  return typeof status == "string"
    ? status?.replace(/([a-z](?=[A-Z]))/g, "$1 ")
    : status;
};

export const getChartTimeLineOld = (obj: any, plotConfig: any) => {
  if (!obj || !plotConfig) return {};
  const { key, value } = plotConfig;
  const tempObj: any = {};
  if (Array.isArray(obj)) {
    obj.forEach((i: any) => {
      tempObj[i[key]] = i[value];
    });
  }
  return tempObj;
};
