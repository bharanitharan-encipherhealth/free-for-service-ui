"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  formatDateForIndex,
  getRoleIdByRole,
  disabledDate as reusableDisabledDate,
} from "@/util/reusableFunction";
import moment from "moment";
import { getStorage } from "@/util/storage";
import { roleAccessList } from "../component/function";
import { connect, ConnectedProps } from "react-redux";
import styles from "../style.module.css";
import dashboardActions from "@/state/tenantadmin/dashboard/actions";
import { usePathname } from "next/navigation";
import { getResponePopup } from "../../../utils/reusable";
import { RootState, Widget } from "../types";
import ContentLayout from "@/components/layout/ContentLayout/page";
import dayjs from "dayjs";

const HeaderFilters = dynamic(() => import("./components/headerFilters"), {
  ssr: false,
});
const Default = dynamic(() => import("./default"), { ssr: false });
const Workflow = dynamic(() => import("./workflow"), { ssr: false });
const Invalid = dynamic(() => import("./invalid/Invalid"), { ssr: false });
const WorkQueue = dynamic(() => import("./workQueue"), { ssr: false });

import { DatePicker, Select } from "antd";

const { RangePicker } = DatePicker;
interface DateRange {
  startDate: string;
  endDate: string;
}

const mapState = (state: RootState) => ({
  getSelectedWidgets: state.dashboardReducer.getWidgetsList?.data?.response as
    | Widget[]
    | undefined,
});

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface DashboardPagesProps extends PropsFromRedux {
  setDynamicModal: (modal: string) => void;
  selectedRole: string;
  setSelectedTab: (tab: string) => void;
  selectedTab: string;
  dispatch: any;
  pagesLoader?: boolean;
  dynamicModal?: string;
}

const DashboardPages: React.FC<DashboardPagesProps> = ({
  setDynamicModal,
  selectedRole,
  setSelectedTab,
  selectedTab,
  dispatch,
}) => {
  const aliasName = getStorage("aliasName");
  const pathname = usePathname();
  const [currentAliasName, setCurrentAliasName] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);
  const [selectedDates, setSelectedDates] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: formatDateForIndex({
      date: moment().subtract(6, "days").format("YYYY-MM-DD"),
      index: 0,
    }),

    endDate: formatDateForIndex({
      date: moment().format("YYYY-MM-DD"),
      index: 1,
    }),
  });

  const formatRole = currentAliasName
    ? currentAliasName.split("_").join("")[0] +
      currentAliasName.split("_").join("").slice(1).toLowerCase()
    : "";

  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [customDate, setCustomDate] = useState<string[] | string>("");
  const [selectDos, setSelectDos] = useState<string>("DOSWISE");
  const pickerRef = useRef<any>(null);

  const handleApiCalls = async ({
    actionType = "",
    params,
  }: {
    actionType: string;
    params: any;
  }) => {
    const actionKey = `${actionType}Action`;
    const action = (dashboardActions as any)[actionKey];
    if (typeof action === "function") {
      return await dispatch(action(params));
    }
  };

  const handleOrganizationChange = (value: string) => {
    setSelectedOrganization(value);
  };

  const handleChange = (value: string) => {
    setSelectDos(value);
  };

  const handleGetWidgets = async () => {
    const getRoleId = getRoleIdByRole(
      aliasName?.toUpperCase().replaceAll(" ", "_") || "",
    );
    try {
      const res = await handleApiCalls({
        actionType: "getWidgetsList",
        params: {
          role: getRoleId,
          dashBoardPage:
            selectedTab === "Workflow"
              ? "WORKFLOWS"
              : selectedTab.toUpperCase(),
        },
      });
      if (res?.status !== "SUCCESS" && res) {
        getResponePopup(res);
      }
    } catch (error) {}
  };

  const getAllDatesInRange = (range: DateRange): string[] => {
    const dates: string[] = [];
    let currentDate = moment(range.startDate);

    while (currentDate.isSameOrBefore(range.endDate)) {
      dates.push(currentDate.format("MMMDD"));
      currentDate = currentDate.add(1, "days");
    }

    return dates;
  };

  const layoutList = useMemo(
    () => [
      {
        isBtn: true,
        btnTitle: "Widget Management",
        onclick: () => setDynamicModal("widget"),
        loading: false,
      },
      {
        isBtn: true,
        btnTitle: "Dashboard Customization",
        onclick: () => setDynamicModal("customization"),
        loading: false,
      },
    ],
    [setDynamicModal],
  );

  useEffect(() => {
    if (selectedTab) {
      handleGetWidgets();
    }
  }, [selectedTab]);

  useEffect(() => {
    const customRange = getAllDatesInRange(dateRange);
    setCustomDate(customRange);
  }, [dateRange]);

  useEffect(() => {
    if (!aliasName) return;
    const roleParts = aliasName.split("_").join("");
    const role = roleParts[0] + roleParts.slice(1).toLowerCase();

    if (pathname === "/reviewer/dashboard") {
      setSelectedTab("WorkQueue");
    } else {
      const accessList = (roleAccessList as any)[role] || [];
      setSelectedTab(accessList[0] || "Default");
    }
    setCurrentAliasName(aliasName);
  }, [aliasName, pathname, setSelectedTab]);

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

  return (
    <>
      <ContentLayout pageTitle="Dashboard" layoutList={layoutList} />
      <div className={styles.maincontainer}>
        <div style={{ width: "75%" }} className="mx-7">
          <div className="flex gap-2 ">
            <section className="flex justify-between" style={{ width: "100%" }}>
              <section
                className={`flex justify-between gap-2 customDateSize ${
                  !isCustom ? styles.customFilter3 : styles.customFilter1
                }`}
              >
                <div
                  className="flex flex-col items-start"
                  style={{
                    width: isCustom ? "200px" : undefined,
                    minWidth: isCustom ? "150px" : undefined,
                  }}
                >
                  <div className={`${styles.flterContainer} mx-1`}>Date</div>
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
                    <div className={`${styles.flterContainer}`}>
                      Custom Date
                    </div>
                    <div id="custom-dateRange" className="tenantSelectorCustom">
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
        {pathname !== "/reviewer/dashboard" &&
        !(roleAccessList as any)[formatRole]?.includes("WorkQueue") ? (
          <div>
            {selectedTab === "Default" && (
              <Default
                selectedRole={selectedRole}
                dateRange={dateRange}
                selectedValue={selectedValue}
                customDate={customDate}
              />
            )}
            {selectedTab === "Workflow" && (
              <Workflow
                selectedRole={selectedRole}
                dateRange={dateRange}
                selectedValue={selectedValue}
                customDate={customDate}
              />
            )}
            {selectedTab === "Invalid" && (
              <Invalid
                selectedRole={selectedRole}
                dateRange={dateRange}
                selectedOrganization={selectedOrganization}
                selectedValue={selectedValue}
                customDate={customDate}
              />
            )}
            {selectedTab === "WorkQueue" && (
              <WorkQueue selectedRole={selectedRole} />
            )}
          </div>
        ) : (
          <WorkQueue selectedRole={selectedRole} />
        )}
      </div>
    </>
  );
};

export default connector(DashboardPages);
