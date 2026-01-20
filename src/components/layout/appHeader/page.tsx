"use client";
import { Select } from "antd";
import { IoSettingsOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";

import { getheaderLogo, getResponePopup } from "@/util/reusableFunction";
import style from "./style.module.css";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import authTypes from "@/state/auth/model";
import {
  projectTypes,
  userRolesTypes,
} from "@/models/(withoutheader)/projects";
import { getStorage, setStorage } from "@/util/storage";
import HeaderProfile from "./profile/page";
import { ssoLogout } from "../../../../lib/authService";
import { actions as authAction } from "@/state/auth";
import { usePathname, useRouter } from "next/navigation";

function AppHeader({
  clientDetails,
  projectDetails,
  tinDetails,
  getAllProjects,
  getAllClientDetails,
  getAllRoles,
  getAllTin,
  setRole,
}: projectTypes) {
  const router = useRouter();
  const pathName = usePathname();
  const userRole = getStorage("userRole");
  const client = getStorage("client");
  const project = getStorage("project");
  const tinNumber = getStorage("tinNumber");

  const [seletedClient, setSelectedClient] = useState<string>();
  const [selectedProject, setSelectedProject] = useState<string>();
  const [currentRole, setCurrentRole] = useState<string>();
  const [selectedTin, setSelectedTin] = useState<string>();
  const [notificationCount, setNotificationCount] = useState<number>(0);

  const clientOptions = clientDetails?.map((client) => ({
    label: client.clientName,
    value: client.clientId,
  }));

  const projectOptions = projectDetails?.map((project) => ({
    label: project.projectName,
    value: project.id,
  }));

  const isRolePreset = ({ userRoles }: { userRoles: userRolesTypes[] }) => {
    return userRoles?.some((role) => userRole == role?.proxyRole);
  };

  const getRolesApi = async () => {
    try {
      const response = await getAllRoles();
      if (response?.status !== "SUCCESS") {
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error);
    }
  };
  const clientGetApi = async () => {
    try {
      const response = await getAllClientDetails();
      if (response?.status === "USER_DEFINED_ERROR") {
        ssoLogout();
      }
    } catch (error) {
      getResponePopup(error);
    }
  };

  const projectGetApi = async () => {
    try {
      const response = await getAllProjects();
      if (response?.status !== "SUCCESS") {
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error);
    }
  };

  const projectClientCall = async () => {
    try {
      clientGetApi();
      projectGetApi();
      getRolesApi();
      await getAllTin();
    } catch (e) {
      console.error("while calling the projectClientCall");
    }
  };

  const handleRoleDropChange = ({ key }: { key: string }) => {
    setStorage("isMultipleDelete", false);
    const allRoles = JSON.parse(getStorage("userAllRoles"));
    const client = getStorage("client");
    const project = getStorage("project");
    const tinNumber = getStorage("tinNumber");
    if (tinDetails?.length > 0 && userRole == "QA") {
      const initialTin = tinNumber || tinDetails?.[0]?.tinNumber;
      setSelectedTin(initialTin);
      setStorage("tinNumber", initialTin);
    }
    if (client) setSelectedClient(client);
    if (project) setSelectedProject(project);
    let selectedRoleObj = allRoles?.find(
      (res: userRolesTypes) => res?.proxyRole == key
    );

    if (!selectedRoleObj) {
      setNotificationCount(0);
      // getNotification()
      selectedRoleObj = allRoles?.find(
        (res: userRolesTypes) => res?.proxyRole == key
      );
    }
    const accessMenuList = selectedRoleObj?.panelList?.accessListForPanel1;
    const newAliasName = selectedRoleObj?.aliasName;
    const oldAliasName = getStorage("headerAliasName");

    setStorage("userRole", key);
    setRole(key);
    setStorage("proxyRole", selectedRoleObj?.proxyRole);
    setStorage("roleId", selectedRoleObj?.roleId);
    setStorage("panelName", selectedRoleObj?.panelList);
    setStorage("headerAliasName", newAliasName);
    setStorage("aliasName", newAliasName);
    setStorage("accessMenuList", JSON.stringify(accessMenuList));
    const firstAccess = accessMenuList[0];
    const dynamicPath =
      firstAccess?.title?.toLowerCase().replace(/\s+/g, "") || "dashboard";

    let dynamicRoute = "";
    if (
      selectedRoleObj?.role === "REVIEWER" ||
      selectedRoleObj?.role === "QA"
    ) {
      dynamicRoute = `/reviewer/${dynamicPath}`;
    } else {
      dynamicRoute = `/tenantadmin/${dynamicPath}`;
    }
    if (newAliasName !== oldAliasName) {
      setTimeout(() => {
        getResponePopup({
          status: "SUCCESS",
          message: "Role changed successfully",
          duration: 5,
        });
      }, 2000);
    }
    router.push(dynamicRoute);
  };

  const handleRoleCheck = async () => {
    const res = await getAllRoles();
    if (res?.status == "SUCCESS") {
      const userRoles = res?.response?.userRoles;
      setStorage("userAllRoles", res?.response?.userRoles);
      if (isRolePreset({ userRoles })) {
        handleRoleDropChange({ key: userRole });
        return true;
      } else {
        return false;
      }
    }
  };

  const handleChangeClient = async ({ e }: { e: string }) => {
    const previousClient = getStorage("client");
    setStorage("client", e);
    const res = await getAllProjects();
    if (res?.status == "SUCCESS") {
      if (!res?.response?.length) {
        setStorage("client", previousClient);
        setSelectedClient(previousClient);
        return getResponePopup({
          status: "EXCEPTION",
          message: "No projects",
          duration: 5,
        });
      } else {
        setSelectedClient(e);
        const roleCheck = await handleRoleCheck();
        if (!roleCheck) {
          setStorage("project", res?.response?.[0]?.id);
          setSelectedProject(res?.response?.[0]?.projectName);
        }
      }
    }
  };

  const handleChangeProject = async ({ e }: { e: string }) => {
    setStorage("project", e);
    setSelectedProject(e);
    await handleRoleCheck();
  };

  useEffect(() => {
    projectClientCall();
  }, []);

  useEffect(() => {
    if (tinDetails?.length > 0 && userRole == "QA") {
      const initialTin = tinNumber || tinDetails?.[0]?.tinNumber;
      if (!selectedTin) {
        setSelectedTin(initialTin);
        setStorage("tinNumber", initialTin);
      }
    }
    if (client) setSelectedClient(client);
    if (project) setSelectedProject(project);
    if (userRole) setRole(userRole);
  }, [tinDetails, selectedTin, userRole]);

  return (
    <div className={`${style.appheader}`}>
      <div className="flex items-center justify-between">
        <div className="flex gap-5 items-center ">
          <div>{getheaderLogo()}</div>
          <div>
            <Select
              className="select-divider"
              placeholder={"Select Client"}
              options={clientOptions}
              value={seletedClient}
              onChange={(e) => handleChangeClient({ e })}
            />
          </div>

          <div>
            <Select
              className="select-divider"
              placeholder={"Select Project"}
              options={projectOptions}
              value={selectedProject}
              onChange={(e) => handleChangeProject({ e })}
            />
          </div>
        </div>

        <div className="flex gap-5 justify-between items-center">
          <div className="flex gap-3">
            <div>
              <IoSettingsOutline className="text-xl" />
            </div>

            <div>
              <GoBell className="text-xl" />
            </div>
          </div>

          <div>
            <HeaderProfile handleRoleDropChange={handleRoleDropChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

const connector = connect(
  (state: { authReducer: authTypes }) => ({
    clientDetails: state?.authReducer?.clientDropDown?.data?.response,
    projectDetails: state?.authReducer?.projectDetails?.data?.response,
    allRolesData: state?.authReducer?.allRolesData?.data?.response,
    tinDetails: state?.authReducer?.tinDetails?.data?.response,
  }),
  {
    getAllClientDetails: authAction?.clientDetails,
    getAllProjects: authAction?.projectDetails,
    getAllRoles: authAction?.allRoles,
    getAllTin: authAction?.tinsDropdown,
    setRole: authAction?.setRole,
  }
);

export default connector(AppHeader);
