"use client";
import { memo, useEffect, useState } from "react";

import { Layout, Menu } from "antd";
import { FaAnglesRight } from "react-icons/fa6";

import style from "./style.module.css";
import { getStorage } from "@/util/storage";
import { userRolesTypes } from "@/models/(withoutheader)/projects";
import {
  MenuItem,
  PhysicanMenuList,
  ProviderMenuList,
} from "@/resuabelFunction/Menu";
import { usePathname, useRouter } from "next/navigation";
import { connect } from "react-redux";
import { appSideBarType } from "@/models/layout/appSideBar";

const { Sider } = Layout;
function AppSideBar({ selectedUserRole }: appSideBarType) {
  const pathName = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [menuList, setMenuList] = useState<MenuItem[]>([]);

  const getRoleMenuList = ({ userRole }: { userRole: string }) => {
    const allRoles = JSON?.parse(getStorage("userAllRoles"));
    const selectedRoleObj = allRoles?.find(
      (res: userRolesTypes) => res.proxyRole === userRole,
    );

    const accessMenuList = selectedRoleObj?.panelList?.accessListForPanel1
      ? selectedRoleObj?.panelList?.accessListForPanel1
      : selectedRoleObj?.accessList;

    switch (userRole) {
      case "CODER_1":
        return PhysicanMenuList(accessMenuList);
      case "CODER_2":
        return PhysicanMenuList(accessMenuList);
      case "QA":
        return PhysicanMenuList(accessMenuList);
      case "TENANT_ADMIN":
        return ProviderMenuList(accessMenuList);
      default:
        return [];
    }
  };

  useEffect(() => {
    const userRoleAlias = getStorage("headerAliasName");
    if (!selectedUserRole || !userRoleAlias) {
      return;
    }
    const menu = getRoleMenuList({ userRole: selectedUserRole });
    setMenuList(menu);
  }, [selectedUserRole, pathName]);

  return (
    <div className={`${style.appSideBar}`}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={160}
        collapsedWidth={75}
      >
        <div className={`${style.arrowBoder} ${collapsed ? "justify-center" : "justify-end"}`}>
          <div className={`p-2 flex  `}>
            <div
              className={`${style.sideNavArrow} rounded-full cursor-pointer`}
              onClick={() => {
                setCollapsed(!collapsed);
              }}
            >
              <FaAnglesRight className="font-bold" />
            </div>
          </div>
        </div>

        <Menu
          items={menuList}
          selectedKeys={(() => {
            const cleanPath = pathName?.replace(/\/$/, "") || "";
            const matchedKeys =
              menuList
                ?.filter((item) => {
                  const cleanKey = (item?.key as string)?.replace(/\/$/, "");
                  if (cleanPath.startsWith(cleanKey)) return true;

                  // Handle peer sub-routes for TIN module (e.g., /details vs /tindetails)
                  if (
                    cleanPath.startsWith("/tenantadmin/tin/") &&
                    cleanKey.startsWith("/tenantadmin/tin/")
                  ) {
                    return true;
                  }

                  return false;
                })
                ?.map((item) => item?.key as string) || [];
            return matchedKeys.length > 0 ? matchedKeys : [pathName];
          })()}
          onClick={({ key }) => router.push(key)}
        />
      </Sider>
    </div>
  );
}

const connector = connect((state: { authReducer: appSideBarType }) => ({
  selectedUserRole: state?.authReducer?.selectedUserRole,
}));

export default memo(connector(AppSideBar));
