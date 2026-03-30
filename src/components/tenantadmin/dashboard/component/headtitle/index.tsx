import React, { useState, useEffect, useRef } from "react";
import { Button, DatePicker, Modal } from "antd";
import dayjs, { Dayjs } from "dayjs";
import styles from "./styles.module.css";
import { disabledDate } from "@/util/reusableFunction";
import { SlCalender } from "react-icons/sl";

const { RangePicker } = DatePicker;

interface HeadTitleProps {
  header: string;
  icon?: any;
  anchorTag?: string | null;
  handleOpen?: any;
  openPicker?: boolean;
  setOpenPicker?: (open: boolean) => void;
  isAdmin?: boolean;
  margin?: string | number;
  fontSize?: string | number;
  getDateRange?: (dates: { startDate: string; endDate: string } | null) => void;
  defaultDateRange?: { startDate: string; endDate: string };
}

const HeadTitle: React.FC<HeadTitleProps> = ({
  header,
  icon,
  anchorTag,
  handleOpen,
  openPicker = false,
  setOpenPicker = () => {},
  margin,
  fontSize,
  getDateRange = () => {},
  defaultDateRange,
}) => {
  const pickerRef = useRef<any>(null);
  const [tempDates, setTempDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [backupDates, setBackupDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [clearFlag, setClearFlag] = useState<boolean>(false);

  useEffect(() => {
    if (defaultDateRange?.startDate && defaultDateRange?.endDate) {
      const start = dayjs(defaultDateRange.startDate);
      const end = dayjs(defaultDateRange.endDate)
        .subtract(5, "hour")
        .subtract(30, "minute");
      setTempDates([start, end]);
      setBackupDates([start, end]);
    }
  }, [defaultDateRange]);

  const handleDatePickerChange = (date: any) => {
    if (!date || date.length === 0) {
      setTimeout(() => pickerRef.current?.focus(), 100);
    }
    if (date) {
      setTempDates(date as [Dayjs | null, Dayjs | null]);
      setClearFlag(false);
    } else {
      setTempDates(null);
      setClearFlag(true);
    }
  };

  const handleOk = () => {
    if (clearFlag) {
      getDateRange(null);
    } else if (tempDates && tempDates[0] && tempDates[1]) {
      const dates = {
        startDate: tempDates[0].format("YYYY-MM-DD") + "T00:00:00.000Z",
        endDate: tempDates[1].format("YYYY-MM-DD") + "T23:59:59.000Z",
      };
      getDateRange(dates);
    }
    setBackupDates(tempDates);
    setOpenPicker(false);
  };

  const handleCancel = () => {
    setTempDates(backupDates);
    setClearFlag(false);
    setOpenPicker(false);
  };

  return (
    <div
      className={styles.header}
      style={{ display: anchorTag ? "flex" : undefined, margin: margin }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div className={styles.title} style={{ fontSize: fontSize }}>
          {header}
        </div>
        {icon && (
          <div
            id="calendar-icon"
            className={`cursor-pointer ${styles.imgContainer}`}
          >
            <SlCalender />
          </div>
        )}
      </div>
      {anchorTag && (
        <span
          id={header}
          className={styles.anchor}
          onClick={typeof handleOpen === "function" ? handleOpen : undefined}
        >
          View All
        </span>
      )}
      <Modal
        open={openPicker}
        width={650}
        closable={false}
        onCancel={handleCancel}
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleCancel}
              style={{ marginRight: "10px" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleOk}
              type="primary"
            >
              Ok
            </Button>
          </div>
        }
        className={styles.customModal}
      >
        <div
          id="dashboard-picker"
          className={`${styles.modalDetails} flex justify-between`}
        >
          <RangePicker
            ref={pickerRef}
            getPopupContainer={() => document.getElementById("date-popup") as HTMLElement}
            value={tempDates}
            onChange={handleDatePickerChange}
            onCalendarChange={(val: any) => setTempDates(val)}
            format="MM-DD-YYYY"
            disabledDate={(currentDate) => disabledDate(currentDate, tempDates as any)}
            allowClear={true}
            inputReadOnly={true}
            open={openPicker}
            id="custom-picker"
          />
        </div>
        <div id="date-popup" style={{ position: "relative" }} />
      </Modal>
    </div>
  );
};

export default HeadTitle;
