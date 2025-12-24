import { Select } from "antd";
import { IoSettingsOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";

import { getheaderLogo, getResponePopup } from "@/util/reusableFunction";
import style from "./style.module.css";
import { memo, useEffect, useState } from "react";
import { connect } from "react-redux";
import authTypes from "@/state/auth/model";
import {
  projectTypes,
  roleTypes,
  userRolesTypes,
} from "@/models/(withoutheader)/projects";
import { getStorage, setStorage } from "@/util/storage";
import HeaderProfile from "./profile/page";
import { ssoLogout } from "../../../../lib/authService";
import { actions as authAction } from "@/state/auth";

function AppHeader({
  clientDetails,
  projectDetails,
  tinDetails,
  getAllProjects,
  getAllClientDetails,
  getAllRoles,
  getAllTin,
}: projectTypes) {
  const userRole = getStorage("userRole");
  const client = getStorage("client");
  const project = getStorage("project");
  const tinNumber = getStorage("tinNumber");

  const [seletedClient, setSelectedClient] = useState<string>();
  const [selectedProject, setSelectedProject] = useState<string>();
  const [currentRole, setCurrentRole] = useState<string>();
  const [selectedTin, setSelectedTin] = useState<string>();

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
      console.log(response, "response");

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

  const handleSameRole = ({ role }: { role: string }) => {
    if (role == getStorage("userRole")) return;
  };

  const handleRoleCheck = async () => {
    const res = await getAllRoles();
    if (res?.status == "SUCCESS") {
      const userRoles = res?.response?.userRoles;
      if (isRolePreset({ userRoles })) {
        handleSameRole({ role: userRole });
      }
    }
  };

  const handleChangeClient = async ({ e }) => {
    const previousClient = getStorage("client");

    const res = await getAllProjects();
    if (res?.status == "SUCCESS") {
      if (!res?.response?.length) {
        setSelectedClient(previousClient);
        return getResponePopup({
          status: "EXCEPTION",
          message: "No projects",
          duration: 5,
        });
      } else {
        setStorage("client", e);
        setSelectedClient(e);
        await handleRoleCheck();
      }
    }
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
            <HeaderProfile />
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
  }
);

export default connector(AppHeader);
