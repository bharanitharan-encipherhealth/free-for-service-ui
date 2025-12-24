import React from "react";
import { IoIosArrowDown } from "react-icons/io";

import style from "../style.module.css";
import authTypes from "@/state/auth/model";
import { connect } from "react-redux";
import { projectTypes } from "@/models/(withoutheader)/projects";
function HeaderProfile({ allRolesData }: projectTypes) {
  const firstNameInitial = allRolesData?.firstName?.charAt(0) || " ";
  const secondNameInitial = allRolesData?.lastName?.charAt(0) || " ";
  return (
    <div
      className={`flex gap-2 items-center rounded-full ${style.loginInfoContainer}`}
    >
      <div
        className={`rounded-full border ${style.loginInfo} text-sm font-bold text-center`}
      >
        {firstNameInitial + secondNameInitial}
      </div>
      <div className={`${style.loginArrow} text-xl`}>
        <IoIosArrowDown />
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
