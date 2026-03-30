import React, { useEffect, useState, useRef } from "react";
import styles from "./styles.module.css";
import { connect } from "react-redux";
import { Button, DatePicker, Select } from "antd";
import moment from "moment";
import {
  formatDateForIndex,
  getRoleIdByRole,
  disabledDate as reusableDisabledDate,
} from "../../../../../../util/reusableFunction";
import dayjs from "dayjs";
import actions from "../../../../../../state/admin/dashboard/actions";
import { getStorage } from "../../../../../../util/storage";

const { RangePicker } = DatePicker;

interface HeaderFiltersProps {
  activeBtn: string;
  setActiveBtn: (tab: string) => void;
  setDateRange: (range: { startDate: string; endDate: string }) => void;
  organizationStatusData?: any;
  getOrganizationStatusData?: (params: any) => void;
  handleOrganizationChange: (value: string) => void;
  setSelectedOrganization: (value: string) => void;
  selectedOrganization: string;
  setSelectedValue: (value: any) => void;
  dateRange: { startDate: string; endDate: string };
  handleChange: (value: string) => void;
  setDynamicModal: (modal: string) => void;
  selectedRole: string;
}

const HeaderFilters: React.FC<HeaderFiltersProps> = ({
  activeBtn,
  setActiveBtn,
  setDateRange,
  organizationStatusData,
  getOrganizationStatusData,
  handleOrganizationChange,
  setSelectedValue,
  setDynamicModal,
  selectedRole,
}) => {
  const aliasName = getStorage("aliasName");
  const [tabs, setTabs] = useState<string[]>([]);
  const [isCustom, setIsCustom] = useState(false);
  const [selectedDates, setSelectedDates] = useState<any>([]);
  const pickerRef = useRef<any>();

  const handleDateChange = (value: string) => {
    if (value === "custom") {
      setIsCustom(true);
      setSelectedValue(value);
    } else {
      setIsCustom(false);
      setSelectedDates([]);
      let startDate: string = "";

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
      } else if (value === undefined) {
        setDateRange({ startDate: "", endDate: "" });
      }

      if (value !== undefined) {
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
      default:
        return ["Default", "Workflows", "Invalid", "WorkQueue"];
    }
  };

  useEffect(() => {
    setTabs(getTabList());
  }, [aliasName]);

  useEffect(() => {
    if (getOrganizationStatusData) {
      getOrganizationStatusData({});
    }
  }, []);

  const organizationOptions = organizationStatusData?.response?.map(
    (org: any) => ({
      value: org.id,
      label: org.name,
    }),
  );

  return (
    <div className={styles.container}>
      <div style={{ width: "75%" }}>
        <div className="flex gap-2">
          <section className="flex justify-between" style={{ width: "100%" }}>
            <section
              className={`customDateSize flex gap-2 justify-between ${
                !isCustom ? styles.customFilter3 : styles.customFilter1
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
                  className="tenantSelectorCustom w-full"
                >
                  <Select
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
                  <div className={styles.flterContainer}>Custom Date</div>
                  <div
                    id="custom-dateRange"
                    className="tenantSelectorCustom"
                  >
                    <RangePicker
                      ref={pickerRef}
                      size="large"
                      disabledDate={disabled1YearDate}
                      onCalendarChange={(val) => setSelectedDates(val)}
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
              className="w-full truncate tableButton"
              onClick={() => setDynamicModal("customization")}
            >
              Dashboard Customization
            </Button>
            <Button
              className="mx-2 w-full truncate tableButton"
              onClick={() => setDynamicModal("widget")}
            >
              Widget Management
            </Button>
          </div>
        )}
        
        {tabs?.length > 0 && (
          <div className="flex overflow-hidden rounded border border-black">
            {tabs.map((item) => (
              <button
                key={item}
                className={
                  activeBtn === item ? styles.activeBtn : styles.headerBtn
                }
                onClick={() => setActiveBtn(item)}
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

const enhancer = connect(
  (state: any) => ({
    organizationStatusData: state.admin.dashboard?.organizationStatus?.data,
  }),
  {
    getOrganizationStatusData: (actions as any).organizationStatusAction,
  }
);

export default enhancer(HeaderFilters);
