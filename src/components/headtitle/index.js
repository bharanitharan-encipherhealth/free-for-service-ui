import React, { useState, useEffect, useRef } from "react";
import { Button, DatePicker, Modal } from "antd";
import dayjs from "dayjs";
import styles from "./styles.module.css";
import { disabledDate } from "../utils/reusable";
import { SlCalender } from "react-icons/sl";

const { RangePicker } = DatePicker;

const HeadTitle = ({
  header,
  icon,
  anchorTag,
  handleOpen,
  openPicker,
  setOpenPicker,
  isAdmin = false,
  margin,
  fontSize,
  getDateRange,
  defaultDateRange,
}) => {
  const pickerRef = useRef();
  const [tempDates, setTempDates] = useState([]);
  const [backupDates, setBackupDates] = useState([]);
  const [clearFlag, setClearFlag] = useState(false);

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

  const handleDatePickerChange = (date) => {
    if (!date || date.length === 0) {
      setTimeout(() => pickerRef.current?.focus(), 100);
    }
    if (date) {
      setTempDates(date);
      setClearFlag(false);
    } else {
      setTempDates([]);
      setClearFlag(true);
    }
  };

  const handleOk = () => {
    if (clearFlag) {
      getDateRange(null);
    } else if (tempDates?.length) {
      const dates = {
        startDate: dayjs(tempDates[0]).format("YYYY-MM-DD") + "T00:00:00.000Z",
        endDate: dayjs(tempDates[1]).format("YYYY-MM-DD") + "T23:59:59.000Z",
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

  const handleOpenPicker = () => {
    setBackupDates(tempDates);
    setOpenPicker(true);
  };

  return (
    <div
      className={styles.header}
      style={{ display: anchorTag && "flex", margin: margin }}
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
            name="calendar-icon"
            className={`cursor-pointer ${styles.imgContainer}`}
          >
            <SlCalender />
          </div>
        )}
      </div>
      {anchorTag && (
        <span
          id={header}
          name={header}
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
            <div id="cancel-Button" name="cancel-Button">
              <Button
                name="cancel-btn"
                id="cancel-btn"
                onClick={handleCancel}
                style={{ marginRight: "10px" }}
              >
                Cancel
              </Button>
            </div>
            <div id="ok-button" name="ok-button">
              <Button
                name="ok-btn"
                id="ok-btn"
                onClick={handleOk}
                type="primary"
              >
                Ok
              </Button>
            </div>
          </div>
        }
        className={styles.customModal}
      >
        <div
          id="dashboard-picker"
          name="dashboard-picker"
          className={`${styles.modalDetails} flex justify-between`}
        >
          <RangePicker
            ref={pickerRef}
            getPopupContainer={() => document.getElementById("date-popup")}
            value={tempDates?.length ? tempDates : null}
            onChange={handleDatePickerChange}
            onCalendarChange={(val) => setTempDates(val)}
            format="MM-DD-YYYY"
            disabledDate={(currentDate) => disabledDate(currentDate, tempDates)}
            allowClear={true}
            inputReadOnly={true}
            open={openPicker}
            id="custom-picker"
            name="custom-picker"
          />
        </div>
        <div id="date-popup" style={{ position: "relative" }} />
      </Modal>
    </div>
  );
};

export default HeadTitle;
