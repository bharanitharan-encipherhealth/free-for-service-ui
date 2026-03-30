"use client"
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { formatDateForIndex, getRoleIdByRole } from "@/util/reusableFunction";
import moment from "moment";
import { getStorage } from "@/util/storage";
import { roleAccessList } from "../component/function";
import { connect, ConnectedProps } from "react-redux";
import styles from "../style.module.css"
import dashboardActions from "@/state/tenantadmin/dashboard/actions";
import { usePathname } from "next/navigation";
import { getResponePopup } from "../../../utils/reusable";
import { RootState, Widget } from "../types";

const HeaderFilters = dynamic(() => import("./components/headerFilters"), { ssr: false });
const Default = dynamic(() => import("./default"), { ssr: false });
const Workflow = dynamic(() => import("./workflow"), { ssr: false });
const Invalid = dynamic(() => import("./invalid/Invalid"), { ssr: false });
const WorkQueue = dynamic(() => import("./workQueue"), { ssr: false });

interface DateRange {
  startDate: string;
  endDate: string;
}

const mapState = (state: RootState) => ({
  getSelectedWidgets: state.dashboardReducer.getWidgetsList?.data?.response as Widget[] | undefined,
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

  const handleApiCalls = async ({ actionType = "", params }: { actionType: string, params: any }) => {
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
      aliasName?.toUpperCase().replaceAll(" ", "_") || ""
    );
    try {
      const res = await handleApiCalls({
        actionType: "getWidgetsList",
        params: {
          role: getRoleId,
          dashBoardPage: selectedTab === "Workflow" ? "WORKFLOWS" : selectedTab.toUpperCase(),
        },
      });
      if (res?.status !== "SUCCESS" && res) {
        getResponePopup(res);
      }
    } catch (error) { }
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

  return (
    <div className={styles.maincontainer}>
      {pathname !== "/reviewer/dashboard" &&
        !(roleAccessList as any)[formatRole]?.includes("WorkQueue") ? (
        <div>
          <div className="mx-2">
            <HeaderFilters
              activeBtn={selectedTab}
              setActiveBtn={setSelectedTab}
              setDateRange={setDateRange}
              handleOrganizationChange={handleOrganizationChange}
              setSelectedOrganization={setSelectedOrganization}
              selectedOrganization={selectedOrganization}
              setSelectedValue={setSelectedValue}
              dateRange={dateRange}
              handleChange={handleChange}
              setDynamicModal={setDynamicModal}
              selectedRole={formatRole}
            />
          </div>

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
            <WorkQueue
              selectedRole={selectedRole}
            />
          )}
        </div>
      ) : (
        <WorkQueue selectedRole={selectedRole} />
      )}
    </div>
  );
};

export default connector(DashboardPages);
