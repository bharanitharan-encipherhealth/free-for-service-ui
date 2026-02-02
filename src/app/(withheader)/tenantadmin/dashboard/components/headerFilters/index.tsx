'use client'
import { Button, DatePicker, Select } from "antd";
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import styles from './style.module.css'
import momentTimezone from "moment-timezone";
import { getStorage } from "@/util/storage";
import moment from "moment";
import { Dayjs } from "dayjs";

interface HeaderFiltersProps {
  setDateRange: (dateRange: {startDate: string, endDate: string}) => void;
  setActiveBtn: (btn: string) => void;
  activeBtn: string;
  setSelectedDates: (dates: [Dayjs | null, Dayjs | null] | null) => void;
}

export const formatDateForIndex = ({ date, index }: { date: moment.Moment, index: number }) => {
  if (!date) return "";

  const formattedDate = moment(date).format("YYYY-MM-DD");
  const dateFormat =
    index === 1
      ? `${formattedDate}T23:59:59.999Z`
      : `${formattedDate}T00:00:00.000Z`;
  if (!dateFormat) return dateFormat;
  const time = momentTimezone(dateFormat);
  const offset = momentTimezone.tz
    .zone(momentTimezone.tz.guess())
    ?.utcOffset(time.valueOf()) ?? 0;
  const adjustedTime = time.clone().add(offset, "minutes");

  return adjustedTime.toISOString();
};

function HeaderFilters({ setDateRange, setActiveBtn, activeBtn, setSelectedDates,  }: HeaderFiltersProps) {

  const [isCustom, setIsCustom] = useState(false);
  // const [selectedDates, setSelectedDates] = useState<any>([]);
  const [dynamicModal, setDynamicModal] = useState<string>("");
  const [tabs, setTabs] = useState<string[]| undefined>([]);
  const aliasName = getStorage("aliasName");
  const pickerRef = useRef<any>(null);
  const { RangePicker } = DatePicker;

  const disabled1YearDate = (current: any) => {
    // Can not select days before today and today
    return current && current > Date.now();
  }
  const getTabList = () => {
    switch (aliasName) {
      case "DOWNLOADER":
        return ["Default"];
      case "CLIENT":
        return ["Default", "Invalid"];
      case "ADMIN":
      case "OWNER":
        return ["Default", "Workflows", "Invalid"];
      default:
        break;
    }
  };
  const handleRange = ( e: [Dayjs | null, Dayjs | null] | null) => {
    setSelectedDates(e);
    if (!e || !e[0] || !e[1]) {
      setDateRange({
        startDate: formatDateForIndex({
          date: moment().subtract(29, "days"),
          index: 0,
        }),
        endDate: formatDateForIndex({ date: moment(), index: 1 }),
      });
      setTimeout(() => pickerRef.current?.focus(), 100);
    }else{
      setDateRange({
        startDate: formatDateForIndex({ date: moment(e[0].toISOString()), index: 0 }),
        endDate: formatDateForIndex({ date: moment(e[1].toISOString()), index: 1 }),
      });
    }
  };

  useEffect(() => {
    setTabs(getTabList());
  }, [aliasName]);

  const handleDateChange = (value:string) => {
    if (value === "custom") {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setSelectedDates([]);
      if (pickerRef && pickerRef.current) {
        pickerRef.current.picker.setValue([]);
      }
    }
  };

  return (
    <div className="flex justify-between align-center mb-4 bg-red p-2">
      <div className="w-1/2">
         <section className="d-flex justify-between" style={{ width: "100%" }}>
            <section
              className={`flex justify-between gap-2 customDateSize flex-column ${
                !isCustom ? styles.customFilter3 : styles.customFilter1
              }`}
            >
              <div
                className="flex"
                style={{
                  ...(isCustom && { width: "200px" }),
                  ...(isCustom && { minWidth: "150px"})
                }}
              >
                <div className={styles.flterContainer}>Date</div>
                <div
                  id="days-selector"
                  // name="days-selector"
                  className="tenantSelectorCustom"
                  style={{ width: "100%" }}
                >
                  <Select
                    data-testid="select-days"
                    // name="select-days"
                    size="large"
                    placeholder="Date"
                    defaultValue="Last 30 days"
                    options={[
                      { label: "Last 7 days", value: "last_1_week" },
                      { label: "Last 30 days", value: "last_1_month" },
                      { label: "Custom Date", value: "custom" },
                    ]}
                    onChange={handleDateChange}
                  />
                </div>
              </div>

              {isCustom && (
                <div className={`flex ${styles.customFilter2}` } >
                  <div className={`${styles.flterContainer}`}>Custom Date</div>
                  <div
                    id="custom-dateRange"
                    // name="custom-dateRange"
                    className="tenantSelectorCustom"
                  >
                    <RangePicker
                      ref={pickerRef}
                      data-testid="select-customDate"
                      name="select-customDate"
                      size="large"
                      disabledDate={disabled1YearDate}
                      onCalendarChange={(val) => setSelectedDates(val)}
                      onChange={(dates) => handleRange(dates)}
                      format={"MM-DD-YYYY"}
                      allowClear={true}
                      inputReadOnly
                    />
                  </div>
                </div>
              )}
            </section>
          </section>
      </div>
      <div className="w-1/2 flex justify-end items-center">  
        <div className="flex items-center">
          <Button
            className="btn-sm w-full text-ellipsis tableButton"
            onClick={() => setDynamicModal("customization")}
          >
            Dashboard Customization
          </Button>
          <Button
            className="btn-sm w-full text-ellipsis tableButton mx-2"
            onClick={() => setDynamicModal("widget")}
          >
            Widget Management
          </Button>
        {tabs?.length && (
          <div className="flex border border-dark rounded">
            {tabs.map((item) => (
              <button
                className={
                  activeBtn === item ? styles.activeBtn : styles.headerBtn
                }
                onClick={() => {
                  setActiveBtn(item);
                }}
                key={item}
                id="default-btn"
                name="default-btn"
              >
                {item}
              </button>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
const enhancer = connect((state: any) => ({}),{})
export default enhancer(HeaderFilters)
