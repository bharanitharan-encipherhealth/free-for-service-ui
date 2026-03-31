import { DatePicker, Select } from "antd";
import React from "react";
import styles from "./style.module.css";
import dayjs from "dayjs";
import { FaAngleDown } from "react-icons/fa";

export const monthNames = [
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
const YearPicker = ({
  onChangeMonth,
  onChangeYear,
  type,
  bgColor,
  val,
  val1,
  hideMonth,
  className,
  disabledDate,
  id, selectid
}) => {
  const currentDate = dayjs().format("MM");
  const currentYearDate = dayjs().format("DD/MM/YYYY");

  return (
    <>
      <div id={id} className={hideMonth ? "" : styles.pickerBox}>
        {hideMonth ? (
          <DatePicker
            data-testid="date-picker1"
            name="date-picker1"
            onChange={onChangeYear}
            picker={"year"}
            value={val1 ? dayjs(val1) : dayjs()}
            format={"YYYY"}
            className={className}
            suffixIcon={<FaAngleDown />}
            disabledDate={disabledDate}
          />
        ) : (
          <DatePicker
            data-testid="date-picker2"
            name="date-picker2"
            onChange={onChangeYear}
            picker={"year"}
            allowClear={false}
            value={val1 ? dayjs(val1) : dayjs()}
            format={"YYYY"}
            className={`${styles.picker} pickerChnages`}
            style={{ backgroundColor: bgColor }}
            suffixIcon={<FaAngleDown />}
            disabledDate={(current) => {
              let customDate = dayjs().format("YYYY");
              return current && current.isAfter(dayjs(customDate, "YYYY"));
            }}
          />

        )}
      </div>
      {type !== "Monthly" && !hideMonth && (
        <Select
          data-testid={selectid}
          value={
            val
              ? { label: monthNames[val - 1], value: val }
              : { label: monthNames[parseInt(currentDate) - 1], value: parseInt(currentDate) }
          }
          onChange={(e) => onChangeMonth(e)}
          className={`${bgColor === "#F3F3FF"
              ? "custom_MonthSelect2"
              : "custom_MonthSelect"
            } ${styles.monthSelect}`}
          options={monthNames?.map((item, index) => ({
            label: item,
            value: index + 1,
          }))}
          style={{ borderRadius: "10px", height: "35px" }}
        />
      )}
    </>
  );
};

export default YearPicker;
