import React from "react";
import { IoIosArrowDown } from "react-icons/io";

import style from "../style.module.css";
import authTypes from "@/state/auth/model";
import { connect, ConnectedProps } from "react-redux";
import { projectTypes } from "@/models/(withoutheader)/projects";
import { Dropdown, MenuProps } from "antd";
import { getStorage } from "@/util/storage";

type headerReduxtype = ConnectedProps<typeof connector>;
type HeaderProfilePropsType = {
  handleRoleDropChange: ({ key }: { key: string }) => void;
} & headerReduxtype;
function HeaderProfile({
  allRolesData,
  handleRoleDropChange,
}: HeaderProfilePropsType) {
  const role = getStorage("aliasName");
  const roleId = getStorage("proxyRole");
  const firstNameInitial = allRolesData?.firstName?.charAt(0) || " ";
  const secondNameInitial = allRolesData?.lastName?.charAt(0) || " ";

  const setRollDropDown = () => {
    return allRolesData?.userRoles?.map((item) => ({
      key: item?.proxyRole,
      label: item?.aliasName,
    }));
  };

  const items: MenuProps["items"] = setRollDropDown();

  return (
    <div
      className={`flex gap-2 items-center rounded-full ${style.loginInfoContainer}`}
    >
      <div
        className={`rounded-full border ${style.loginInfo} text-sm font-bold text-center dark:text-white text-white`}
      >
        {firstNameInitial + secondNameInitial}
      </div>
      <div className={`text-white font-bold`}>{role}</div>
      <div className={`${style.loginArrow} text-xl`}>
        <Dropdown
          menu={{
            items,
            selectable: true,
            defaultSelectedKeys: [roleId],
            onClick: handleRoleDropChange,
          }}
          trigger={["click"]}
        >
          <IoIosArrowDown />
        </Dropdown>
      </div>
    </div>
  );
}

const connector = connect(
  (state: { authReducer: authTypes }) => ({
    allRolesData: state?.authReducer?.allRolesData?.data?.response,
  }),
  {}
);

export default connector(HeaderProfile);
