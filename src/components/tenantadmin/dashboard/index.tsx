"use client"
import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { connect, ConnectedProps } from "react-redux";
import { IoClose } from "react-icons/io5";

import {
  DefaultWidget,
  filterWidgetsByRole,
  InvalidWidget,
  WorkflowWidget,
  workQueueWidget,
} from "./component/function";
import { getResponePopup, getRoleIdByRole } from "../../utils/reusable";
import DashboardPages from "./pages";
import dashboardActions from "@/state/tenantadmin/dashboard/actions";
import style from "./style.module.css";
import CardSkeleton from "@/components/skeleton/card";
import { getStorage } from "@/util/storage";
import { Widget, RootState } from "./types";

const WidgetComponent = dynamic(() => import("./component/modal/widget"), {
  ssr: false,
});

const DragAndDrap = dynamic(() => import("./component/modal/dragAndDrap"), {
  ssr: false,
});

export const roleAccessList: Record<string, string[]> = {
  Admin: ["Default", "Workflow", "Invalid"],
  Owner: ["Default", "Workflow", "Invalid"],
  Coder1: ["WorkQueue"],
  Coder2: ["WorkQueue"],
  QA: ["WorkQueue"],
  QALead: ["Default", "Workflow", "Invalid"],
  ProjectLead: ["Default", "Workflow", "Invalid"],
  Downloader: ["Default"],
  Client: ["Default", "Workflow"],
};

const roles = [
  "Admin",
  "Coder 1",
  "Coder 2",
  "QA",
];

const mapState = (state: RootState) => ({
  getSelectedWidgets: state.dashboardReducer.getWidgets?.data?.response as Widget[] | undefined,
  getSelectedWidgetsLoader: state.dashboardReducer.getWidgetsLoader as boolean,
});

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {
  dispatch: any;
}

const DynamicDashboard: React.FC<Props> = ({
  dispatch,
  getSelectedWidgets,
  getSelectedWidgetsLoader,
}) => {
  const roleId = getStorage("roleId");
  const [tabNames, setTabNames] = useState<string[]>([]);
  const [dynamicModal, setDynamicModal] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("Admin");
  const [pagesLoader, setPagesLoader] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>("Default");
  const [selectedTabPage, setSelectedTabPage] = useState<string>("");
  const [dashboard, setDashboard] = useState<Widget[]>([]);
  const [selectedItems, setSelectedItem] = useState<Widget[]>([]);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [tabLoading, setTabLoading] = useState<boolean>(false);

  const handleApiCalls = async ({ actionType = "", params }: { actionType: string, params: any }) => {
    const actionKey = `${actionType}Action`;
    const action = (dashboardActions as any)[actionKey];
    if (typeof action === "function") {
      return await dispatch(action(params));
    }
  };

  const handleCancel = () => {
    setDynamicModal("");
    setSelectedItem([]);
    setSelectedRole("Admin");
    setSelectedTab("Default");
    getWidgetsListActionApi();
  };

  const getWidgetsListActionApi = async () => {
    try {
      await handleApiCalls({
        actionType: "getWidgetsList",
        params: {
          role: roleId,
          dashBoardPage:
            selectedTabPage === "Workflow"
              ? "WORKFLOWS"
              : selectedTabPage.toUpperCase(),
        },
      });
    } catch (error) { }
  };

  const handleSelect = (item: Widget) => {
    const isSelected = selectedItems.some(
      (el) => el.widgetId === item.widgetId
    );
    if (isSelected) {
      setSelectedItem((prev) =>
        prev.filter((el) => el.widgetId !== item.widgetId)
      );
    } else {
      const apiItem = getSelectedWidgets?.find(
        (el) => el.widgetId === item.widgetId
      );
      setSelectedItem((prev) => [...prev, apiItem || item]);
    }
  };

  const getWidgets = (value: string): Widget[] => {
    const widgets = (() => {
      switch (value) {
        case "Default":
          return DefaultWidget;
        case "Workflows":
          return WorkflowWidget;
        case "Invalid":
          return InvalidWidget;
        case "WorkQueue":
          return workQueueWidget;
        default:
          return [];
      }
    })();
    return filterWidgetsByRole(widgets, selectedRole);
  };

  const handleSelectAll = (value: boolean) => {
    if (!value) {
      setSelectedItem([]);
      return;
    }

    const widgetList = getWidgets(selectedTab);
    const existingIds = new Set(selectedItems.map((item) => item.widgetId));

    const remaining = widgetList.filter(
      (widget) => !existingIds.has(widget.widgetId)
    );

    const uniqueItems = [...selectedItems, ...remaining];
    setSelectedItem(uniqueItems);
  };

  const handleSaveWidgets = async () => {
    const getRoleIdValue = getRoleIdByRole(
      selectedRole.toUpperCase().replaceAll(" ", "_")
    );
    const obj = selectedItems?.map((item) => ({
      ...item,
      role: getRoleIdValue,
    }));
    try {
      setSaveLoading(true);
      const res = await handleApiCalls({
        actionType: "setWidgets",
        params: obj,
      });
      if (res?.status === "SUCCESS") {
        handleGetWidgets();
        getResponePopup({
          status: "SUCCESS",
          message: "Widget Saved Successfully",
        });
      } else if (res) {
        getResponePopup(res);
      }
    } catch (error) {
    } finally {
      setSaveLoading(false);
    }
  };

  const handleGetWidgets = async () => {
    const getRoleIdValue = getRoleIdByRole(
      selectedRole.toUpperCase().replaceAll(" ", "_")
    );
    try {
      const res = await handleApiCalls({
        actionType: "getWidgets",
        params: {
          role: getRoleIdValue,
          dashBoardPage: selectedTab.toUpperCase(),
        },
      });
      if (res?.status === "SUCCESS") {
        setSelectedItem(res.response);
      } else if (res) {
        getResponePopup(res);
      }
    } catch (error) { }
  };

  const handleGetSelectedWidget = async () => {
    const getRoleIdValue = getRoleIdByRole(
      selectedRole.toUpperCase().replaceAll(" ", "_")
    );
    try {
      const res = await handleApiCalls({
        actionType: "getWidgets",
        params: {
          role: getRoleIdValue,
          dashBoardPage: selectedTab.toUpperCase(),
        },
      });
      if (res?.status === "SUCCESS") {
        setDashboard(
          (res.response as Widget[])
            .filter((d) => d.active)
            .sort((a, b) => Number(a.orderValue) - Number(b.orderValue))
        );
      } else if (res) {
        getResponePopup(res);
      }
    } catch (error) { }
  };

  const handleSaveShowWidgets = async () => {
    const getRoleIdValue = getRoleIdByRole(
      selectedRole.toUpperCase().replaceAll(" ", "_")
    );
    let orderId = dashboard.length;
    const obj = getSelectedWidgets?.map((item) => {
      orderId += 1;
      return {
        ...item,
        orderValue:
          dashboard.find((e) => e.widgetId === item.widgetId)?.orderValue ||
          String(orderId),
        active: dashboard.some((e) => e.widgetId === item.widgetId),
        selectedChart:
          dashboard.find((e) => e.widgetId === item.widgetId)?.selectedChart ||
          item.selectedChart,
        role: getRoleIdValue,
      };
    });
    setSaveLoading(true);
    try {
      const res = await handleApiCalls({
        actionType: "setWidgets",
        params: obj,
      });
      if (res?.status === "SUCCESS") {
        handleGetWidgets();
        getResponePopup({
          status: "SUCCESS",
          message: "Widget Changed Successfully",
        });
      } else if (res) {
        getResponePopup(res);
      }
    } catch (error) {
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSave = () => {
    setPagesLoader(true);
    setTimeout(() => {
      if (dynamicModal === "widget") {
        handleSaveWidgets();
      } else {
        handleSaveShowWidgets();
      }
      setPagesLoader(false);
    }, 300);
  };

  const handleTapChange = ({ options }: { options: boolean }) => {
    if (options) {
      handleGetSelectedWidget();
      return;
    }
    setSelectedItem(getSelectedWidgets || []);
  };

  const getTabAccessApi = async () => {
    try {
      const res = await handleApiCalls({
        actionType: "getTabAccess",
        params: {
          role: getRoleIdByRole(
            selectedRole.toUpperCase().replaceAll(" ", "_")
          ),
        },
      });
      if (res?.status === "SUCCESS") {
        const tabs = (res.response as string[]).map((item) =>
          item === "WORKQUEUE"
            ? "WorkQueue"
            : item.charAt(0) + item.slice(1).toLowerCase()
        );
        setTabNames(tabs);
        setSelectedTab(tabs[0]);
      } else {
        const roleKey = selectedRole.replace(/\s/g, "");
        const tabs = roleAccessList[roleKey] || [];
        setTabNames(tabs);
        setSelectedTab(tabs?.[0] || "");
      }
    } catch (error) { }
  };

  useEffect(() => {
    getTabAccessApi();
  }, [selectedRole]);

  useEffect(() => {
    if (dynamicModal === "widget") {
      handleGetWidgets();
    } else if (dynamicModal) {
      handleGetSelectedWidget();
    }
  }, [dynamicModal, selectedRole, selectedTab]);

  useEffect(() => {
    if (dynamicModal === "widget") {
      const temp = getSelectedWidgets
        ?.map((item) => ({
          widgetId: item.widgetId,
        }))
        ?.sort((a, b) => (a.widgetId || "").localeCompare(b.widgetId || ""));
      const temp2 = selectedItems
        ?.map((item) => ({
          widgetId: item.widgetId,
        }))
        ?.sort((a, b) => (a.widgetId || "").localeCompare(b.widgetId || ""));
      setIsDisable(JSON.stringify(temp) === JSON.stringify(temp2));
    } else {
      const temp = getSelectedWidgets
        ?.sort((a, b) => Number(a.orderValue) - Number(b.orderValue))
        ?.filter((item) => item.active)
        .map((item) => ({
          widgetId: item.widgetId,
          orderValue: Number(item.orderValue),
          selectedChart: item.selectedChart,
        }));
      const temp2 = dashboard.map((item) => ({
        widgetId: item.widgetId,
        orderValue: Number(item.orderValue),
        selectedChart: item.selectedChart,
      }));
      setIsDisable(JSON.stringify(temp) === JSON.stringify(temp2));
    }
  }, [dashboard, selectedItems, getSelectedWidgets, dynamicModal]);

  console.log("dashboard", dynamicModal);

  return (
    <div className={style.showHeight}>
      <DashboardPages
        setDynamicModal={setDynamicModal}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        pagesLoader={pagesLoader}
        dynamicModal={dynamicModal}
        setSelectedTab={setSelectedTabPage}
        selectedTab={selectedTabPage}
        tabNames={tabNames}
      />
      <Modal
        open={!!dynamicModal}
        onCancel={handleCancel}
        width="95%"
        style={{ maxWidth: "95%" }}
        footer={null}
        centered
        className="dynamicDashboardModal"
        rootClassName="dynamicDashboardModalRoot"
        title={
          <div className="flex items-center justify-between w-full pr-8">
            <div>
              {dynamicModal === "widget" ? "Widget" : "Dashboard"} Customization
              <div className="text-sm text-gray-500 font-normal">
                <span style={{ color: "red" }}>*</span> Choose the appropriate
                widgets for the selected role to enable customization and save
                preferences.
              </div>
            </div>
          </div>
        }
        closeIcon={<IoClose className="text-xl" />}
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-wrap gap-2 my-4">
            {roles.map((role) => (
              <Button
                key={role}
                size="small"
                className={`rounded-full ${selectedRole === role
                  ? style.btnActive
                  : "border border-gray-400 text-gray-600"
                  }`}
                onClick={() => {
                  setTabLoading(true);
                  setSelectedItem([]);
                  setSelectedRole(role);
                  setSelectedTab("Default");
                  setTimeout(() => {
                    setTabLoading(false);
                  }, 1200);
                }}
              >
                {role === "Coder 1"
                  ? "EH Coder"
                  : role === "Coder 2"
                    ? "Physician"
                    : role === "QA"
                      ? "Coder"
                      : role}
              </Button>
            ))}
          </div>
          {!getSelectedWidgetsLoader && !tabLoading ? (
            <div className="flex flex-wrap gap-5 my-4 items-center">
              {dynamicModal === "widget" && (
                <div className="flex items-center">
                  <div className="font-bold">
                    Total Widgets Selected:{" "}
                    <span style={{ color: "#03512E" }}>
                      {selectedItems?.length}
                    </span>
                  </div>

                  <div className="flex items-center ms-3">
                    <input
                      className="w-4 h-4 cursor-pointer"
                      type="checkbox"
                      id="selectAll"
                      checked={
                        !!(selectedItems.length &&
                          getWidgets(selectedTab)?.length ===
                          selectedItems?.length)
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    <label className="ms-2 cursor-pointer" htmlFor="selectAll">
                      Select All
                    </label>
                  </div>
                </div>
              )}

              <div className="flex gap-1">
                <Button
                  className="btn btn-sm w-full text-ellipsis tableButton"
                  style={{ background: "#A6A8AC", color: "white" }}
                  onClick={() =>
                    handleTapChange({
                      options: dynamicModal !== "widget",
                    })
                  }
                  disabled={isDisable}
                >
                  {dynamicModal === "widget" ? "Cancel" : "Reset"}
                </Button>
                <Button
                  className="btn-sm w-full text-ellipsis tableButton bg-[#03512E] text-white"
                  onClick={handleSave}
                  disabled={isDisable}
                  loading={saveLoading}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-1/4">
              <CardSkeleton height={50} />
            </div>
          )}
        </div>

        <div className="flex gap-4 mx-1">
          {tabNames.map((tab) => (
            <div
              key={tab}
              onClick={() => {
                setTabLoading(true);
                setSelectedTab(tab);
                setSelectedItem([]);
                setTimeout(() => {
                  setTabLoading(false);
                }, 1200);
              }}
              style={{
                cursor: "pointer",
                fontWeight: selectedTab === tab ? "bold" : "normal",
                borderBottom:
                  selectedTab === tab ? "3px solid #03512E" : "none",
                color: selectedTab === tab ? "#03512E" : "inherit",
              }}
            >
              {tab}
            </div>
          ))}
        </div>
        <div style={{ minHeight: "80vh" }}>
          {getSelectedWidgetsLoader ? (
            <CardSkeleton count={5} height={200} />
          ) : dynamicModal === "widget" ? (
            <WidgetComponent
              selectedTab={selectedTab}
              selectedItems={selectedItems}
              setSelectedItem={setSelectedItem}
              handleSelect={handleSelect}
              dashboard={dashboard}
              setDashboard={setDashboard}
              selectedRole={selectedRole}
            />
          ) : (
            <DragAndDrap
              selectedTab={selectedTab}
              selectedItems={selectedItems}
              setSelectedItem={setSelectedItem}
              handleSelect={handleSelect}
              dashboard={dashboard}
              setDashboard={setDashboard}
              selectedRole={selectedRole}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default connector(DynamicDashboard);
