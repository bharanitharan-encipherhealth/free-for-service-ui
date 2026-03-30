import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const HeaderFilters = dynamic(() => import("./components/headerFilters"), { ssr: false });
import { formatDateForIndex, getRoleIdByRole } from "../../../../util/reusableFunction";
import moment from "moment";
import { getStorage } from "../../../../util/storage";
import { useRouter, usePathname } from "next/navigation";
import { roleAccessList } from "../component/function";
import { connect } from "react-redux";
import actions from "../../../../state/admin/dashboard/actions";
import styles from "../../dashboard/style.module.css";

interface DashboardPagesProps {
  setDynamicModal: (modal: string) => void;
  selectedRole: string;
  setSelectedTab: (tab: string) => void;
  selectedTab: string;
  windowWidth: number | null;
  dispatch: any;
  pagesLoader?: boolean;
  dynamicModal?: string;
  userDropDown?: any;
  allocationStatusLoading?: boolean;
  productivityStatusData?: any;
  productivityStatusLoading?: boolean;
}

const Default = dynamic(() => import("./default"), { ssr: false });
const Workflow = dynamic(() => import("./workflow"), { ssr: false });
const Invalid = dynamic(() => import("./invalid/Invalid"), { ssr: false });
const WorkQueue = dynamic(() => import("./workQueue"), { ssr: false });

const DashboardPages: React.FC<DashboardPagesProps> = ({
  setDynamicModal,
  userDropDown,
  allocationStatusLoading,
  productivityStatusData,
  productivityStatusLoading,
  selectedRole,
  setSelectedTab,
  selectedTab,
  dispatch,
  pagesLoader,
  windowWidth,
}) => {
  const aliasName = getStorage("aliasName");
  const router = useRouter();
  const pathname = usePathname();
  const [currentAliasName, setCurrentAliasName] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: formatDateForIndex({
      date: moment().subtract(6, "days").format("YYYY-MM-DD"),
      index: 0,
    }),
    endDate: formatDateForIndex({
      date: moment().format("YYYY-MM-DD"),
      index: 1,
    }),
  });

  const formatRole =
    currentAliasName?.split("_").join("")[0] +
    currentAliasName?.split("_").join("").slice(1).toLowerCase();

  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedValue, setSelectedValue] = useState<string>("last_7_days");
  const [customDate, setCustomDate] = useState<string[]>([]);
  const [selectDos, setSelectDos] = useState("DOSWISE");

  const handleApiCalls = async ({ actionType = "", params = {} }) => {
    const actionKey = `${actionType}Action`;
    if ((actions as any)[actionKey]) {
      return await dispatch((actions as any)[actionKey](params));
    }
    return null;
  };

  const handleOrganizationChange = (value: string) => {
    setSelectedOrganization(value);
  };

  const handleChange = (value: string) => {
    setSelectDos(value);
  };

  const handleGetWidgets = async () => {
    const roleId = getRoleIdByRole(
      (aliasName || "").toUpperCase().replaceAll(" ", "_")
    );
    try {
      await handleApiCalls({
        actionType: "getWidgetsList",
        params: {
          role: roleId,
          dashBoardPage: selectedTab.toUpperCase(),
        },
      });
    } catch (error) {}
  };

  const getAllDatesInRange = (range: any) => {
    const dates = [];
    let currentDate = moment(range?.startDate);
    while (currentDate.isSameOrBefore(range?.endDate)) {
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
    const role =
      aliasName?.split("_").join("")[0] +
      aliasName?.split("_").join("").slice(1).toLowerCase();
    if(pathname === "/reviewer/dashboard") {
      setSelectedTab("WorkQueue");
    } else {
      setSelectedTab((roleAccessList as any)[role]?.[0]);
    }
    setCurrentAliasName(aliasName || "");
  }, []);

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
              pagesLoader={pagesLoader || false}
              windowWidth={windowWidth}
            />
          )}
          {selectedTab === "Workflows" && (
            <Workflow
              selectedRole={selectedRole}
              dateRange={dateRange}
              selectedValue={selectedValue}
              customDate={customDate}
              pagesLoader={pagesLoader || false}
              windowWidth={windowWidth as number}
            />
          )}
          {selectedTab === "Invalid" && (
            <Invalid
              selectedRole={selectedRole}
              dateRange={dateRange}
              selectedOrganization={selectedOrganization}
              selectedValue={selectedValue}
              customDate={customDate}
              pagesLoader={pagesLoader || false}
              windowWidth={windowWidth}
            />
          )}
          {selectedTab === "WorkQueue" && (
            <WorkQueue
              selectedRole={selectedRole}
              selectedValue={selectedValue}
              customDate={customDate}
              pagesLoader={pagesLoader || false}
              windowWidth={windowWidth as number}
            />
          )}
        </div>
      ) : (
        <WorkQueue
          selectedRole={selectedRole}
          selectedValue={selectedValue}
          customDate={customDate}
          pagesLoader={pagesLoader || false}
          windowWidth={windowWidth as number}
        />
      )}
    </div>
  );
};

const enhancer = connect((state: any) => ({
  getSelectedWidgets: state.admin.dashboard?.getWidgetsList?.data?.response,
}))(DashboardPages);

export default enhancer;
