import { memo, useEffect, useState } from "react";

import { Layout, Menu } from "antd";
import { FaAnglesRight } from "react-icons/fa6";

import style from "./style.module.css";
import { getStorage } from "@/util/storage";
import { userRolesTypes } from "@/models/(withoutheader)/projects";
import { PhysicanMenuList, ProviderMenuList } from "@/resuabelFunction/Menu";
import { usePathname, useRouter } from "next/navigation";

const { Sider } = Layout;
function AppSideBar() {
  const pathName = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [menuList, setMenuList] = useState<any>([]);
  const [userRole, setUserRole] = useState(getStorage("userRole"));

  const getRoleMenuList = ({ userRole }) => {
    const allRoles = JSON?.parse(getStorage("userAllRoles"));
    console.log(allRoles, "allRoles");
    const selectedRoleObj = allRoles?.find(
      (res: userRolesTypes) => res.proxyRole === userRole
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
    const loginCheck = getStorage("loginCheck");
    const userRoleAlias = getStorage("headerAliasName");
    if (!userRole || !userRoleAlias) {
      return;
    }
    const menu = getRoleMenuList({ userRole });
    setMenuList(menu);
  }, [userRole, pathName]);

  console.log(menuList, "menuList");

  return (
    <div className={`${style.appSideBar}`}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className={`${style.arrowBoder}`}>
          <div className="p-2 flex justify-end">
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
          selectedKeys={[pathName]}
          onClick={({ key }) => router.push(key)}
        />
      </Sider>
    </div>
  );
}

export default memo(AppSideBar);
