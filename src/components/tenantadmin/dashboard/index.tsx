"use client"
import { Button, Modal, Skeleton, Spin } from "antd";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Widget = dynamic(() => import("./component/modal/widget"), {
  ssr: false,
});
const DragAndDrap = dynamic(() => import("./component/modal/dragAndDrap"), {
  ssr: false,
});
import {
  DefaultWidget,
  filterWidgetsByRole,
  InvalidWidget,
  WorkflowWidget,
  workQueueWidget,
  useWindowWidth,
} from "./component/function";
import { getResponePopup, getRoleIdByRole } from "../../../util/reusableFunction";
import DashboardPages from "./pages";
import { connect, useDispatch } from "react-redux";
import actions from "../../../state/admin/dashboard/actions";
import CardSkeleton from "../../skeleton/card";
import { getStorage } from "../../../util/storage";
import { CloseOutlined } from "@ant-design/icons";

interface WidgetItem {
  widgetId: string;
  orderValue: number;
  selectedChart: string;
  active?: boolean;
  [key: string]: any;
}

const roles = [
  "Admin",
  "Coder 1",
  "Coder 2",
  "QA",
];

const DynamicDashboard: React.FC<any> = ({
  dispatch,
  getSelectedWidgets,
  getSelectedWidgetsLoader,
}) => {
  const roleId = getStorage("roleId");
  const [tabNames, setTabNames] = useState<string[]>([]);
  const [dynamicModal, setDynamicModal] = useState("");
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [pagesLoader, setPagesLoader] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Default");
  const [selectedTabPage, setSelectedTabPage] = useState("");
  const [dashboard, setDashboard] = useState<WidgetItem[]>([]);
  const windowWidth = useWindowWidth();
  const [selectedItems, setSelectedItem] = useState<WidgetItem[]>([]);
  const [isDisable, setIsDisable] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);

  const handleApiCalls = async ({ actionType = "", params = {} }) => {
    const actionKey = `${actionType}Action`;
    if ((actions as any)[actionKey]) {
      return await dispatch((actions as any)[actionKey](params));
    }
    return null;
  };

  const handleCancel = () => {
    setDynamicModal("");
    setSelectedItem([]);
    setSelectedRole("Admin");
    setSelectedTab("Default");
    getWidgetsListActionApi();
  };

  const getWidgetsListActionApi = async () => {
    const getRoleId = getRoleIdByRole(
      selectedRole.toUpperCase().replaceAll(" ", "_")
    );

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

  const handleSelect = (item: WidgetItem) => {
    const isSelected = selectedItems.some(
      (el) => el.widgetId === item.widgetId
    );
    if (isSelected) {
      setSelectedItem((prev) =>
        prev.filter((el) => el.widgetId !== item.widgetId)
      );
    } else {
      const apiItem = getSelectedWidgets?.find(
        (el: WidgetItem) => el.widgetId === item.widgetId
      );
      setSelectedItem((prev) => [...prev, apiItem || item]);
    }
  };

  const getWidgets = (value: string) => {
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
    const roleIdVal = getRoleIdByRole(
      selectedRole.toUpperCase().replaceAll(" ", "_")
    );
    const obj = selectedItems?.map((item) => ({
      ...item,
      role: roleIdVal,
    }));
    try {
      setSaveLoading(true);
      const res = await handleApiCalls({
        actionType: "setWidgets",
        params: obj,
      });
      if (res.status === "SUCCESS") {
        handleGetWidgets();
        getResponePopup({
          status: "SUCCESS",
          message: "Widget Saved Successfully",
        });
      } else {
        getResponePopup(res);
      }
    } catch (error) {
    } finally {
      setSaveLoading(false);
    }
  };

  const handleGetWidgets = async () => {
    const roleIdVal = getRoleIdByRole(
      selectedRole.toUpperCase().replaceAll(" ", "_")
    );
    try {
      const res = await handleApiCalls({
        actionType: "getWidgets",
        params: {
          role: roleIdVal,
          dashBoardPage: selectedTab.toUpperCase(),
        },
      });
      if (res.status === "SUCCESS") {
        setSelectedItem(res.response);
      } else {
        getResponePopup(res);
      }
    } catch (error) { }
  };

  const handleGetSelectedWidget = async () => {
    const roleIdVal = getRoleIdByRole(
      selectedRole.toUpperCase().replaceAll(" ", "_")
    );
    try {
      const res = await handleApiCalls({
        actionType: "getWidgets",
        params: {
          role: roleIdVal,
          dashBoardPage: selectedTab.toUpperCase(),
        },
      });
      if (res.status === "SUCCESS") {
        setDashboard(
          res.response
            .filter((d: WidgetItem) => d.active)
            .sort((a: WidgetItem, b: WidgetItem) => a.orderValue - b.orderValue)
        );
      } else {
        getResponePopup(res);
      }
    } catch (error) { }
  };

  const handleSaveShowWidgets = async () => {
    const roleIdVal = getRoleIdByRole(
      selectedRole.toUpperCase().replaceAll(" ", "_")
    );
    let orderId = dashboard?.length || 0;
    const obj = getSelectedWidgets?.map((item: WidgetItem) => {
      orderId += 1;
      return {
        ...item,
        orderValue:
          dashboard.find((e) => e.widgetId === item.widgetId)?.orderValue ??
          orderId,
        active: dashboard.some((e) => e.widgetId === item.widgetId),
        selectedChart:
          dashboard.find((e) => e.widgetId === item.widgetId)?.selectedChart ??
          item.selectedChart,
        role: roleIdVal,
      };
    });
    setSaveLoading(true);
    try {
      const res = await handleApiCalls({
        actionType: "setWidgets",
        params: obj,
      });
      if (res.status === "SUCCESS") {
        handleGetWidgets();
        getResponePopup({
          status: "SUCCESS",
          message: "Widget Changed Successfully",
        });
      } else {
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
      if (res.status === "SUCCESS") {
        const tabs = res.response.map((item: string) =>
          item === "WORKQUEUE"
            ? "WorkQueue"
            : item.charAt(0) + item.slice(1).toLowerCase()
        );
        setTabNames(tabs);
        setSelectedTab(tabs[0]);
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
        ?.map((item: WidgetItem) => ({
          widgetId: item.widgetId,
        }))
        ?.sort((a: any, b: any) => a.widgetId?.localeCompare(b.widgetId));
      const temp2 = selectedItems
        ?.map((item: WidgetItem) => ({
          widgetId: item.widgetId,
        }))
        ?.sort((a: any, b: any) => a.widgetId?.localeCompare(b.widgetId));
      setIsDisable(JSON.stringify(temp) === JSON.stringify(temp2));
    } else {
      const temp = getSelectedWidgets
        ?.sort((a: WidgetItem, b: WidgetItem) => a.orderValue - b.orderValue)
        ?.filter((item: WidgetItem) => item.active)
        .map((item: WidgetItem) => ({
          widgetId: item.widgetId,
          orderValue: +item.orderValue,
          selectedChart: item.selectedChart,
        }));
      const temp2 = dashboard.map((item: WidgetItem) => ({
        widgetId: item.widgetId,
        orderValue: +item.orderValue,
        selectedChart: item.selectedChart,
      }));
      setIsDisable(JSON.stringify(temp) === JSON.stringify(temp2));
    }
  }, [dashboard, selectedItems, getSelectedWidgets, dynamicModal]);

  return (
    <div className="min-h-[85vh] bg-[#F4F7FE] p-4">
      <DashboardPages
        setDynamicModal={setDynamicModal}
        selectedRole={selectedRole}
        pagesLoader={pagesLoader}
        dynamicModal={dynamicModal}
        setSelectedTab={setSelectedTabPage}
        selectedTab={selectedTabPage}
        windowWidth={windowWidth}
      />
      <Modal
        open={!!dynamicModal}
        onCancel={handleCancel}
        width={1200}
        centered
        footer={null}
        title={
          <div className="flex flex-col gap-1 pr-8">
            <span className="text-xl font-bold">
              {dynamicModal === "widget" ? "Widget" : "Dashboard"} Customization
            </span>
            <span className="text-sm font-normal text-gray-500">
              <span className="text-red-500">*</span> Choose the appropriate
              widgets for the selected role to enable customization and save
              preferences.
            </span>
          </div>
        }
        closeIcon={<CloseOutlined className="text-xl" />}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Button
                  key={role}
                  className={`rounded-full border-none px-6 py-1 text-sm font-medium transition-all ${selectedRole === role
                      ? "bg-[#04306F] text-white shadow-md"
                      : "bg-[#E9EDF7] text-[#04306F] hover:bg-[#DDE4F0]"
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
              <div className="flex items-center gap-6">
                {dynamicModal === "widget" && (
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-semibold">
                      Total Widgets Selected:{" "}
                      <span className="text-[#04306F]">
                        {selectedItems?.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        className="h-4 w-4 cursor-pointer accent-[#04306F]"
                        type="checkbox"
                        id="selectAll"
                        checked={
                          !!(selectedItems.length &&
                            getWidgets(selectedTab)?.length ===
                            selectedItems?.length)
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                      <label
                        className="cursor-pointer text-sm font-medium text-gray-700"
                        htmlFor="selectAll"
                      >
                        Select All
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    className="h-9 rounded-lg border-none bg-gray-400 px-6 font-semibold text-white hover:bg-gray-500"
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
                    className={`h-9 rounded-lg border-none px-6 font-semibold text-white transition-all ${isDisable ? "bg-gray-300" : "bg-[#04306F] hover:bg-[#032555]"
                      }`}
                    onClick={handleSave}
                    disabled={isDisable}
                    loading={saveLoading}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-48">
                <CardSkeleton height={40} />
              </div>
            )}
          </div>

          <div className="flex gap-8 border-b border-gray-100">
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
                className={`cursor-pointer pb-2 text-sm font-bold transition-all ${selectedTab === tab
                    ? "border-b-2 border-[#04306F] text-[#04306F]"
                    : "text-gray-400 hover:text-[#04306F]"
                  }`}
              >
                {tab}
              </div>
            ))}
          </div>

          <div className="min-h-[500px]">
            {getSelectedWidgetsLoader ? (
              <CardSkeleton count={3} height={150} />
            ) : dynamicModal === "widget" ? (
              <Widget
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
                dashboard={dashboard}
                setDashboard={setDashboard}
                selectedRole={selectedRole}
              />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

const enhancer = connect((state: any) => ({
  getSelectedWidgets: state.admin.dashboard?.getWidgets?.data?.response,
  getSelectedWidgetsLoader: state.admin.dashboard?.getWidgetsLoader,
}))(DynamicDashboard);

export default enhancer;
