import { accessListForPanel1 } from "@/models/(withoutheader)/projects";
import { getStorage } from "@/util/storage";
import { MenuProps } from "antd";
import { ReactNode } from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaRegUser, FaUserNurse } from "react-icons/fa6";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";
import { MdGroups2 } from "react-icons/md";
import { PiUserCircleDashedFill } from "react-icons/pi";
import { TbReportAnalytics } from "react-icons/tb";
import { TfiMapAlt } from "react-icons/tfi";

export type MenuItem = Required<MenuProps>["items"][number];
const createMenuItem = (
  label: ReactNode,
  key: string,
  icon?: ReactNode,
  children?: MenuItem[]
): MenuItem => ({
  key,
  icon,
  label,
  children,
});

export const PhysicanMenuList = (
  data: accessListForPanel1[] = []
): MenuItem[] => {
  const items: MenuItem[] = [];

  data.forEach((res) => {
    if (!res?.active) return;

    switch (res.title) {
      case "Dashboard":
        items.push(
          createMenuItem(
            "Dashboard",
            "/reviewer/dashboard",
            <AiOutlineDashboard />
          )
        );
        break;

      case "My Work Queue":
        items.push(
          createMenuItem(
            "My Work Queue",
            "/reviewer/patients",
            <HiOutlineBars3BottomLeft />
          )
        );
        break;

      case "Report":
        items.push(
          createMenuItem("Report", "/reviewer/report", <TbReportAnalytics />)
        );
        break;

      case "Tracking":
        items.push(
          createMenuItem("Tracking", "/tenantadmin/tracking", <MdGroups2 />)
        );
        break;

      case "Logs":
        items.push(
          createMenuItem("Logs", "/tenantadmin/tracking", <TfiMapAlt />)
        );
        break;

      case "Productivity":
        items.push(
          createMenuItem(
            "Productivity",
            "/tenantadmin/productivity",
            <MdGroups2 />
          )
        );
        break;
    }
  });

  return items;
};

export const ProviderMenuList = (
  data: accessListForPanel1[] = []
): MenuItem[] => {
  const items: MenuItem[] = [];

  data.forEach((res) => {
    if (!res?.active) return;

    switch (res.title) {
      case "Dashboard":
        items.push(
          createMenuItem(
            "Dashboard",
            "/tenantadmin/dashboard",
            <AiOutlineDashboard />
          )
        );
        break;

      case "Users":
        items.push(
          createMenuItem("Users", "/tenantadmin/users", <FaRegUser />)
        );
        break;

      case "TIN":
        items.push(
          createMenuItem("Tenant", "/tenantadmin/tin", <FaUserNurse />)
        );
        break;

      case "Project":
        items.push(
          createMenuItem(
            "Project",
            "/tenantadmin/project",
            <PiUserCircleDashedFill />
          )
        );
        break;

      case "Report":
        items.push(
          createMenuItem("Report", "/tenantadmin/report", <TbReportAnalytics />)
        );
        break;

      case "Logs":
        items.push(
          createMenuItem("Logs", "/tenantadmin/tracking", <TfiMapAlt />)
        );
        break;

      case "Productivity":
        items.push(
          createMenuItem(
            "Productivity",
            "/tenantadmin/productivity",
            <MdGroups2 />
          )
        );
        break;

      case "Notification":
        items.push(
          createMenuItem(
            "Notification",
            "/tenantadmin/notification",
            <MdGroups2 />
          )
        );
        break;

      case "My Work Queue":
        items.push(
          createMenuItem(
            "My Work Queue",
            "/tenantadmin/workqueue",
            <MdGroups2 />
          )
        );
        break;
    }
  });

  return items;
};

export const statusColorPick = ({ status }: { status: string }) => {
  switch (status?.toLowerCase()) {
    case "processed":
      return {
        backgroundColor: "var(--processed-bg-color)",
        color: "var(--defaultColor)",
      };
    case "processing":
      return {
        backgroundColor: "var(--processing-bg-color)",
        color: "var(--defaultColor)",
      };
    case "not processed":
    case "failed":
      return {
        backgroundColor: "var(--not-processed-bg-color)",
        color: "var(--defaultColor)",
      };
  }
};

export const getAccessTabItems = ({
  page,
  tab,
}: {
  page: string;
  tab: "tabMenuList" | "tabMenuList2";
}) => {
  const accessMenuList: accessListForPanel1[] = JSON.parse(
    getStorage("accessMenuList")
  );

  const currentTabs: string[] = accessMenuList?.find(
    (item) => item?.title === page
  )?.[tab] ?? [""];

  if (currentTabs) return currentTabs;
  return [];
};

export const getProcessStatusKey = ({ item }: { item: string | number }) => {
  console.log(item, "titntjnjx");

  switch (item) {
    case 0:
    case "NOTPROCESSED":
      return "Not Processed";
    case 1:
    case "PROCESSING":
      return "Processing";
    case 2:
    case "PROCESSED":
      return "Processed";
    case 3:
      return "Failed";
    default:
      return "";
  }
};
