"use client";
import { useEffect, useState } from "react";

import { getLogo, getResponePopup } from "@/util/reusableFunction";
import { Form, Modal, notification, Select, Skeleton, Spin } from "antd";
import { companyDeatils } from "@/util/config";
import { removeStorage, setStorage } from "@/util/storage";
import RegularButton from "@/components/regularButton";
import Footer from "@/components/footer";
import { connect } from "react-redux";
import authTypes from "@/state/auth/model";
import { actions as authAction } from "@/state/auth";
import { useRouter } from "next/navigation";
import { projectTypes } from "@/models/(withoutheader)/projects";
import { useMsal } from "@azure/msal-react";
import { ssoLogout } from "../../../../lib/authService";
function Projects({
  allRolesData,
  getAllRoles,
  getAllClientId,
  clientIdData,
  clientLoading,
  clientDetails,
  projectLoading,
  projectDetails,
  roleLoading,
  getAllClientDetails,
  getAllProjects,
  setRole,
}: projectTypes) {
  const router = useRouter();
  const { accounts } = useMsal();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(true);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [form] = Form.useForm();

  const clientOptions = clientDetails?.map((client) => ({
    label: client.clientName,
    value: client.clientId,
  }));

  const projectOptions = projectDetails?.map((client) => ({
    label: client.projectName,
    value: client.id,
  }));

  const roleOptions = allRolesData?.userRoles?.map((client) => ({
    label: client.aliasName.replaceAll("_", " "),
    value: client.proxyRole,
  }));

  const handleFormSubmit = async () => {
    setSubmitLoading(true);
    try {
      const values = await form.validateFields();
      const { client, project, role } = values;

      if (!client || !project || !role) {
        return;
      }

      const selectedRoleObj = allRolesData?.userRoles?.find(
        (role) => role.proxyRole === values.role
      );
      if (selectedRoleObj) {
        setStorage("proxyRole", selectedRoleObj?.proxyRole);
        setStorage("userAllRoles", JSON.stringify(allRolesData?.userRoles));
        setStorage(
          "accessMenuList",
          JSON.stringify(selectedRoleObj?.panelList?.accessListForPanel1)
        );
        setStorage("roleId", selectedRoleObj?.roleId);
        setStorage("aliasName", selectedRoleObj?.aliasName);
        setStorage("headerAliasName", selectedRoleObj?.aliasName);
        loginSuccessCallBack();
      }
    } catch (error) {
      console.error("Form validation failed:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const onValuesChange = ({ value, name }: { value: string; name: string }) => {
    if (name === "client") {
      setStorage("client", value);
      form.setFieldsValue({
        client: value,
        project: null,
        role: null,
      });
      removeStorage("project");
      removeStorage("proxyRole");
      projectGetApi();
    } else {
      setStorage("project", value);
      form.setFieldsValue({ project: value, role: null });
      removeStorage("proxyRole");
      getRolesApi();
    }
  };

  const handleLogout = () => {
    setConfirmModal(false);
    loginSuccessCallBack();
  };

  const loginSuccessCallBack = () => {
    notification.success({
      message: "Login Successfully",
      duration: 1,
    });

    const values = form.getFieldsValue();

    const selectedRoleObj = allRolesData?.userRoles?.find(
      (role) => role.proxyRole === values.role
    );

    const accessList = selectedRoleObj?.panelList?.accessListForPanel1 || [];
    const firstAccess = accessList[0];
    let dynamicRoute = "";

    if (firstAccess?.title) {
      const title = firstAccess.title.toLowerCase().replace(/\s+/g, "");
      if (
        selectedRoleObj?.role === "REVIEWER" ||
        selectedRoleObj?.role === "QA"
      ) {
        dynamicRoute = `/reviewer/${title}`;
      } else {
        dynamicRoute = `/tenantadmin/${title}`;
      }
    }

    setStorage("userRole", selectedRoleObj?.proxyRole);
    setRole(selectedRoleObj?.proxyRole);
    router?.push(dynamicRoute);
  };

  const clientGetApi = async () => {
    try {
      const response = await getAllClientDetails();
      if (response?.status !== "SUCCESS") {
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error);
    }
  };

  const clientIdApi = async () => {
    try {
      const response = await getAllClientId();
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

  useEffect(() => {
    clientIdApi();
  }, []);

  // Load client details when clientIdData is available
  useEffect(() => {
    if (clientIdData) {
      setStorage("orgId", clientIdData?.orgId);
      clientGetApi();
    }
  }, [clientIdData]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (accounts && accounts.length > 0) {
        setIsLoading(false);
      } else {
        const timeout = setTimeout(() => {
          if (!accounts || accounts.length === 0) {
            router.push("/");
          }
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [accounts, router]);
  return (
    <div className="page-wraper">
      <div className="login-account">
        <div className="align-self-center">
          <div
            className="login-content"
            style={{ position: "relative", textAlign: "center" }}
          >
            <p className="sub-title"></p>
            {getLogo()}
          </div>

          <div className="align-self-center">
            <div className="login-form">
              {isLoading ? (
                <div>
                  <Skeleton.Input
                    className="d-flex align-items-center justify-content-center project-loding"
                    active
                    block={true}
                  />
                </div>
              ) : (
                <div className="align-self-center">
                  <div className="d-flex align-items-center justify-content-center">
                    <h2 className="title fontWeight2">
                      {companyDeatils === "encipher" || companyDeatils == "abha"
                        ? "Welcome"
                        : companyDeatils == " riskgenai"
                        ? "Your Gateway to RiskGen-i"
                        : "Your Gateway To CogentAI!"}
                    </h2>
                  </div>
                  {/* <h6 className="login-title">
                    <span>Login</span>
                  </h6> */}
                  <Form
                    form={form}
                    onFinish={handleFormSubmit}
                    layout="vertical"
                    onValuesChange={(allValues) => {
                      const isAllFieldsFilled = allValues.role;
                      setIsFormValid(isAllFieldsFilled);
                    }}
                  >
                    <Form.Item
                      className="form-selected login-input"
                      name="client"
                      label={<>Client</>}
                    >
                      <Select
                        placeholder="Select Client"
                        loading={clientLoading}
                        style={{
                          width: "100%",
                          cursor: "pointer",
                        }}
                        onChange={(value) =>
                          onValuesChange({ value, name: "client" })
                        }
                        options={clientOptions}
                        notFoundContent={
                          clientLoading ? (
                            <div className="d-flex justify-content-center align-items-center">
                              <Spin size="small" />
                            </div>
                          ) : null
                        }
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        showSearch
                      />
                    </Form.Item>
                    <Form.Item
                      className="form-selected login-input"
                      name="project"
                      label={<>Project</>}
                    >
                      <Select
                        placeholder="Select Project"
                        loading={projectLoading}
                        style={{
                          width: "100%",
                          cursor: "pointer",
                        }}
                        onChange={(value) =>
                          onValuesChange({ value, name: "project" })
                        }
                        options={projectOptions}
                        disabled={!form.getFieldValue("client")}
                        notFoundContent={
                          projectLoading ? (
                            <div className="d-flex justify-content-center align-items-center">
                              <Spin size="small" />
                            </div>
                          ) : null
                        }
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        showSearch
                      />
                    </Form.Item>
                    <Form.Item
                      className="form-selected login-input"
                      name="role"
                      label={<>Role</>}
                    >
                      <Select
                        placeholder="Select Role"
                        loading={roleLoading}
                        style={{
                          width: "100%",
                          cursor: "pointer",
                        }}
                        options={roleOptions}
                        // onChange={(e) => form.setFieldValue("role", e)}
                        disabled={!form.getFieldValue("project")}
                        notFoundContent={
                          roleLoading ? (
                            <div className="d-flex justify-content-center align-items-center">
                              <Spin size="small" />
                            </div>
                          ) : null
                        }
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        showSearch
                      />
                    </Form.Item>
                    <div className="d-flex justify-content-between login-btn">
                      <RegularButton
                        type="submit"
                        name="Submit"
                        width="100%"
                        loading={!submitLoading}
                        disabled={!form.getFieldsValue()?.role}
                        padding="10px"
                      />
                    </div>
                  </Form>
                </div>
              )}
            </div>
            <div className="login-footer">
              <Footer isLogo={false} />
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={""}
        open={confirmModal}
        centered
        onOk={handleLogout}
        onCancel={() => setConfirmModal(false)}
      ></Modal>
    </div>
  );
}

const connector = connect(
  (state: { authReducer: authTypes }) => ({
    allRolesData: state?.authReducer?.allRolesData?.data?.response,
    clientIdData: state?.authReducer?.clientDetails?.data?.response,
    clientDetails: state?.authReducer?.clientDropDown?.data?.response,
    clientLoading: state?.authReducer?.clientDetailsLoading,
    projectDetails: state?.authReducer?.projectDetails?.data?.response,
    projectLoading: state?.authReducer?.projectDetailsLoading,
    roleLoading: state?.authReducer?.roleLoading,
  }),
  {
    getAllClientId: authAction?.clientId,
    getAllRoles: authAction?.allRoles,
    getAllClientDetails: authAction?.clientDetails,
    getAllProjects: authAction?.projectDetails,
    setRole: authAction?.setRole,
  }
);

export default connector(Projects);
