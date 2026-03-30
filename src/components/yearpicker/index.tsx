import { DatePicker, Select } from "antd";
import React from "react";
import dayjs from "dayjs";
import { DownOutlined } from "@ant-design/icons";

export const monthNames = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

interface YearPickerProps {
  onChangeMonth: (value: any) => void;
  onChangeYear: (date: any, dateString: string | string[]) => void;
  type?: string;
  bgColor?: string;
  val?: any;
  val1?: any;
  hideMonth?: boolean;
  className?: string;
  disabledDate?: (current: any) => boolean;
  id?: string;
  selectid?: string;
}

const YearPicker: React.FC<YearPickerProps> = ({
  onChangeMonth,
  onChangeYear,
  type,
  bgColor,
  val,
  val1,
  hideMonth,
  className,
  disabledDate,
  id,
  selectid
}) => {
  const currentDate = dayjs().format("MM");
  const currentYearDate = dayjs().format("DD/MM/YYYY");

  return (
    <div id={id} className="flex items-center">
      <div className={hideMonth ? "" : "flex bg-white rounded-xl w-[100px] h-[35px] mr-[10px] xl:w-[87px] xl:mr-[2px]"}>
        <DatePicker
          data-testid="date-picker-inner"
          onChange={onChangeYear}
          picker="year"
          allowClear={false}
          value={val1 ? dayjs(val1, "YYYY") : dayjs(currentYearDate, "DD/MM/YYYY")}
          format="YYYY"
          className={`border-none w-full h-full shadow-none focus:ring-0 ${className || ""}`}
          style={{ backgroundColor: bgColor }}
          suffixIcon={<DownOutlined className="text-gray-400" />}
          disabledDate={disabledDate || ((current) => current && current > dayjs().endOf('year'))}
        />
      </div>
      {type !== "Monthly" && !hideMonth && (
        <Select
          data-testid={selectid}
          value={val ? { label: val < 10 ? `0${val}` : val, value: val } : { label: currentDate, value: currentDate }}
          onChange={(e) => onChangeMonth(e)}
          className={`w-[100px] xl:w-[58px] ${bgColor === "#F3F3FF" ? "custom_MonthSelect2" : "custom_MonthSelect"}`}
          options={monthNames?.map((item, index) => ({
            label: item,
            value: index + 1,
          }))}
          style={{ borderRadius: "10px", height: "35px" }}
        />
      )}
    </div>
  );
};

export default YearPicker;
