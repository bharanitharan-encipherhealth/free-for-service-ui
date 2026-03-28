import React, { useCallback, useState } from "react";
import { IoIosArrowDown, IoMdCloseCircleOutline } from "react-icons/io";

import style from "../style.module.css";
import authTypes from "@/state/auth/model";
import { connect, ConnectedProps } from "react-redux";
import { Button, Dropdown, MenuProps, Popover } from "antd";
import { getStorage, removeStorage } from "@/util/storage";
import { RiLogoutCircleRLine } from "react-icons/ri";
import Swal from "sweetalert2";

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
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const firstNameInitial = allRolesData?.firstName?.charAt(0) || " ";
  const secondNameInitial = allRolesData?.lastName?.charAt(0) || " ";

  const setRollDropDown = () => {
    return allRolesData?.userRoles?.map((item) => ({
      key: item?.proxyRole,
      label: item?.aliasName,
    }));
  };

  const logoutFunction = useCallback(async () => {
    Swal.fire({
      title: "Warning!",
      text: "Do you want to Logout!",
      icon: "warning",
      confirmButtonText: "Logout",
      confirmButtonColor: "#DD6B55",
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      focusConfirm: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        removeStorage();
        window.location.href = "/login";
      }
    });
  }, []);

  const items: MenuProps["items"] = setRollDropDown();

  return (
    <div
      className={`flex gap-2 items-center rounded-full ${style.loginInfoContainer}`}
    >
      <Popover
        content={
          <>
            <div className="flex justify-between gap-5 border-b px-2 border-[#a8b3bd]">
              <div className="flex gap-2 items-center py-2 ">
                <div
          className={`rounded-full border ${style.loginInfo} text-lg font-bold text-center text-white uppercase w-10 h-10 flex items-center justify-center`}
                >
                  {firstNameInitial + secondNameInitial}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="font-bold text-xs">
                    {allRolesData?.firstName + " " + allRolesData?.lastName}
                  </div>
                  <div className="text-xs text-gray-400 capitalize font-bold">
                    {role?.at(0) + role?.slice(1)?.toLowerCase()}
                  </div>
                </div>
              </div>

              <div
                className="iconBagColor cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <IoMdCloseCircleOutline className="text-xl" />
              </div>
            </div>

            <div className="text-center" onClick={logoutFunction}>
              <Button className="border-none! shadow-none! text-orange-600! font-bold!">
                <RiLogoutCircleRLine /> Logout
              </Button>
            </div>
          </>
        }
        styles={{
          body: { width: 250 },
        }}
        open={open}
        onOpenChange={(newOpen) => setOpen(newOpen)}
        trigger={"click"}
      >
        <div
          className={`rounded-full border ${style.loginInfo} text-sm font-bold text-center text-white uppercase cursor-pointer`}
        >
          {firstNameInitial + secondNameInitial}
        </div>
      </Popover>
      <div className={`text-white`}>{role}</div>
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
  {},
);

export default connector(HeaderProfile);
