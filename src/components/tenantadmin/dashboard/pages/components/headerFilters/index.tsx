"use client"
import React, { useEffect, useState, useRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import dashboardActions from "@/state/tenantadmin/dashboard/actions";
import styles from "./styles.module.css";
import { Button, DatePicker, Select } from "antd";
import moment from "moment";
import {
  formatDateForIndex,
  disabledDate as reusableDisabledDate,
} from "@/util/reusableFunction";
import dayjs from "dayjs";
import { getStorage } from "@/util/storage";

const { RangePicker } = DatePicker;

const mapState = (state: any) => ({
  organizationStatusData: state.dashboardReducer?.organizationStatus?.data,
});

const mapDispatch = {
  getOrganizationStatusData: dashboardActions.organizationStatusAction,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface HeaderFiltersProps extends PropsFromRedux {
  activeBtn: string;
  setActiveBtn: (btn: string) => void;
  setDateRange: (range: { startDate: string; endDate: string }) => void;
  setSelectedValue: (value: string) => void;
  setDynamicModal: (modal: string) => void;
  selectedRole: string;
  handleOrganizationChange?: (value: string) => void;
  setSelectedOrganization?: (value: string) => void;
  selectedOrganization?: string;
  dateRange?: { startDate: string; endDate: string };
  handleChange?: (value: string) => void;
}

const HeaderFilters: React.FC<HeaderFiltersProps> = ({
  activeBtn,
  setActiveBtn,
  setDateRange,
  organizationStatusData,
  setSelectedValue,
  setDynamicModal,
  handleOrganizationChange,
  setSelectedOrganization,
  selectedOrganization,
  dateRange,
  handleChange,
}) => {
  const aliasName = getStorage("aliasName");
  const [tabs, setTabs] = useState<string[]>([]);
  const [isCustom, setIsCustom] = useState(false);
  const [selectedDates, setSelectedDates] = useState<any[]>([]);
  const pickerRef = useRef<any>(null);

  const handleDateChange = (value: string) => {
    if (value === "custom") {
      setIsCustom(true);
      setSelectedValue(value);
    } else {
      setIsCustom(false);
      setSelectedDates([]);
      let startDate = "";

      if (value === "last_1_week") {
        startDate = formatDateForIndex({
          date: moment().subtract(6, "days"),
          index: 0,
        });
        setSelectedValue(value);
      } else if (value === "last_1_month") {
        startDate = formatDateForIndex({
          date: moment().subtract(29, "days"),
          index: 0,
        });
        setSelectedValue(value);
      } else if (value === (undefined as any)) {
        setDateRange({ startDate: "", endDate: "" });
      }

      if (value !== (undefined as any)) {
        const endDate = formatDateForIndex({ date: moment(), index: 1 });
        setDateRange({ startDate, endDate });
      }
    }
  };

  const handleRange = (e: any) => {
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
    } else {
      setDateRange({
        startDate: formatDateForIndex({ date: e[0], index: 0 }),
        endDate: formatDateForIndex({ date: e[1], index: 1 }),
      });
    }
  };

  const disabled1YearDate = (current: any) => {
    const isDisabledByReusableFunction = reusableDisabledDate(
      current,
      selectedDates,
    );

    if (isDisabledByReusableFunction) {
      return true;
    }

    if (selectedDates && selectedDates[0]) {
      const from = dayjs(selectedDates[0]);
      return Math.abs(current.diff(from, "years")) >= 1;
    }

    return false;
  };

  const getTabList = () => {
    switch (aliasName) {
      case "CLIENT":
        return ["Default", "Invalid"];
      case "ADMIN":
      case "OWNER":
        return ["Default", "Workflows"];
      case "CODER_1":
      case "CODER_2":
      case "QA":
        return ["WorkQueue"];
      default:
        return ["Default"];
    }
  };

  useEffect(() => {
    setTabs(getTabList());
  }, [aliasName]);

  return (
    <div className={styles.container}>
      <div style={{ width: "75%" }}>
        <div className="flex gap-2 ">
          <section className="flex justify-between" style={{ width: "100%" }}>
            <section
              className={`flex justify-between gap-2 customDateSize ${!isCustom ? styles.customFilter3 : styles.customFilter1
                }`}
            >
              <div
                className="flex"
                style={{
                  width: isCustom ? "200px" : undefined,
                  minWidth: isCustom ? "150px" : undefined,
                }}
              >
                <div className={styles.flterContainer}>Date</div>
                <div
                  id="days-selector"
                  className="tenantSelectorCustom"
                  style={{ width: "100%" }}
                >
                  <Select
                    data-testid="select-days"
                    placeholder="Date"
                    defaultValue="last_1_week"
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
                <div className={`flex ${styles.customFilter2}`}>
                  <div className={`${styles.flterContainer}`}>Custom Date</div>
                  <div
                    id="custom-dateRange"
                    className="tenantSelectorCustom"
                  >
                    <RangePicker
                      ref={pickerRef}
                      data-testid="select-customDate"
                      size="large"
                      disabledDate={disabled1YearDate}
                      onCalendarChange={(val) => setSelectedDates(val as any)}
                      onChange={(e) => handleRange(e)}
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
      </div>

      <div className="flex">
        {(aliasName === "ADMIN" || aliasName === "OWNER") && (
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
          </div>
        )}
        {tabs?.length > 0 && (
          <div className="flex border border-dark rounded">
            {tabs.map((item, index) => (
              <button
                key={index}
                className={
                  activeBtn === item ? styles.activeBtn : styles.headerBtn
                }
                onClick={() => {
                  setActiveBtn(item);
                }}
                id={`tab-${index}`}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default connector(HeaderFilters);
