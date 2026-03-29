import { accessListForPanel1 } from "@/models/(withoutheader)/projects";
import { getStorage } from "@/util/storage";
import { MenuProps } from "antd";
import { ReactNode } from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { FaRegUser, FaUserNurse } from "react-icons/fa6";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";
import { MdAnalytics, MdGroups2, MdOutlineAnalytics } from "react-icons/md";
import { PiUserCircleDashedFill } from "react-icons/pi";
import { TbReportAnalytics } from "react-icons/tb";
import { TfiMapAlt } from "react-icons/tfi";

export type MenuItem = Required<MenuProps>["items"][number];
const createMenuItem = (
  label: ReactNode,
  key: string,
  icon?: ReactNode,
  children?: MenuItem[],
): MenuItem => ({
  key,
  icon,
  label,
  children,
});

export const PhysicanMenuList = (
  data: accessListForPanel1[] = [],
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
            <AiOutlineDashboard />,
          ),
        );
        break;

      case "My Work Queue":
        items.push(
          createMenuItem(
            "My Work Queue",
            "/reviewer/patients",
            <HiOutlineBars3BottomLeft />,
          ),
        );
        break;

      case "Report":
        items.push(
          createMenuItem("Report", "/reviewer/report", <TbReportAnalytics />),
        );
        break;

      case "Tracking":
        items.push(
          createMenuItem("Tracking", "/tenantadmin/tracking", <MdGroups2 />),
        );
        break;

      case "Logs":
        items.push(
          createMenuItem("Logs", "/tenantadmin/tracking", <TfiMapAlt />),
        );
        break;

      case "Productivity":
        items.push(
          createMenuItem(
            "Productivity",
            "/tenantadmin/productivity",
            <MdGroups2 />,
          ),
        );
        break;
    }
  });

  return items;
};

export const ProviderMenuList = (
  data: accessListForPanel1[] = [],
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
            <AiOutlineDashboard />,
          ),
        );
        break;

      case "Users":
        items.push(
          createMenuItem("Users", "/tenantadmin/users", <FaRegUser />),
        );
        break;

      case "TIN":
        items.push(
          createMenuItem("Tenant", "/tenantadmin/tin", <MdOutlineAnalytics />),
        );
        break;

      // case "Project":
      //   items.push(
      //     createMenuItem(
      //       "Project",
      //       "/tenantadmin/project",
      //       <PiUserCircleDashedFill />
      //     )
      //   );
      //   break;

      case "Report":
        items.push(
          createMenuItem(
            "Report",
            "/tenantadmin/report",
            <HiOutlineDocumentReport />,
          ),
        );
        break;

      case "Logs":
        items.push(
          createMenuItem("Logs", "/tenantadmin/tracking", <CiLocationOn />),
        );
        break;

      case "Productivity":
        items.push(
          createMenuItem(
            "Productivity",
            "/tenantadmin/productivity",
            <MdGroups2 />,
          ),
        );
        break;

      case "Notification":
        items.push(
          createMenuItem(
            "Notification",
            "/tenantadmin/notification",
            <MdGroups2 />,
          ),
        );
        break;

      case "My Work Queue":
        items.push(
          createMenuItem(
            "My Work Queue",
            "/tenantadmin/workqueue",
            <MdGroups2 />,
          ),
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
        color: "var(--foreground)",
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
    getStorage("accessMenuList"),
  );

  const currentTabs: string[] = accessMenuList?.find(
    (item) => item?.title === page,
  )?.[tab] ?? [];

  if (currentTabs) return currentTabs;
  return [];
};

export const getProcessStatusKey = ({ item }: { item: string | number }) => {
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

export const getRoleIdByRole = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "0";
    case "DOWNLOADER":
      return "1";
    case "OWNER":
      return "2";
    case "AI":
      return "3";
    case "CODER_1":
      return "4";
    case "CODER_2":
      return "5";
    case "QA":
      return "6";
    case "QA_LEAD":
      return "7";
    case "PROJECT_LEAD":
      return "8";
    case "CLIENT":
      return "9";
    default:
      return null;
  }
};

export function getLast7Days() {
  const date_seven_days = [];
  const currentDate = new Date();

  for (let i = 0; i < 7; i++) {
    const pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - i);
    date_seven_days.push(
      pastDate.toLocaleString("default", { month: "short" }) +
        pastDate.getDate()
    );
  }

  return date_seven_days.reverse();
}

export function getLast30Days() {
  const date_thirty_days = [];
  const currentDate = new Date();

  for (let i = 0; i < 30; i++) {
    const pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - i);
    date_thirty_days.push(
      pastDate.toLocaleString("default", { month: "short" }) +
        pastDate.getDate()
    );
  }

  return date_thirty_days.reverse();
}