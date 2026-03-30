import { Card, Select } from "antd";
import React, { useEffect, useState } from "react";
import AppChart from "../../appchart";
import {
  filterWidgetsByRole,
  getFormattedChartData,
  useHasMounted,
  useWindowWidth,
  WorkflowWidget,
  Widget,
} from "../../function";
import DndFunction from "../../function/resubaleDndContext";
import { getColSpan } from "../../function";
import { getRowSpan } from "../../function";
import { connect } from "react-redux";
import {
  Accuracy,
  AllocatedStatus,
  allocationStatusData,
  Coder1,
  Coder2,
  Notificatin,
  OrgPieChartInfo,
  Owner,
  ProjectLead,
  QA,
  QALead,
  Users,
  WorkFlowFiles,
} from "./mockData";
import CardSkeleton from "@/components/skeleton/card";
import GroupCard from "../../groupcard";

const getCharts = ({ type, chartType, chartChange }: { type: string, chartType: string, chartChange: boolean }) => {
  switch (type) {
    case "OrgPieChartInfo":
      return (
        <OrgPieChartInfo chartType={chartType} chartChange={chartChange} />
      );
    case "WorkFlowFiles":
      return <WorkFlowFiles chartType={chartType} />;

    case "AllocatedStatus":
      return (
        <AllocatedStatus chartType={chartType} chartChange={chartChange} />
      );

    case "Coder 1":
      return <Coder1 chartType={chartType} chartChange={chartChange} />;

    case "Coder 2":
      return <Coder2 chartType={chartType} chartChange={chartChange} />;
    case "QA":
      return <QA chartType={chartType} chartChange={chartChange} />;
    case "Project Lead":
      return <ProjectLead chartType={chartType} chartChange={chartChange} />;

    case "QA Lead":
      return <QALead chartType={chartType} chartChange={chartChange} />;
    case "Owner":
      return <Owner chartType={chartType} chartChange={chartChange} />;
    case "Users":
      return <Users chartType={chartType} chartChange={chartChange} />;
    case "Accuracy":
      return <Accuracy chartType={chartType} chartChange={chartChange} series={"Accuracy"} />;
    case "Notificatin":
      return <Notificatin />;
    case "allocationStatus":
      return chartChange ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
          charts={allocationStatusData({ chartType })}
          stacked={true}
          chartType={chartType}
        />
      );
    case "productivityStatus":
      return chartChange ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <Accuracy
          chartType={chartType}
          chartChange={chartChange}
          series={"productivityStatus"}
        />
      );
    default:
      break;
  }
};
interface WorkflowProps {
  isDragable: boolean;
  handleSelect: (item: any) => void;
  selectedItems: any[];
  dashboard: Widget[];
  setDashboard: Dispatch<SetStateAction<Widget[]>>;
  getSelectedWidgets: any[];
  selectedRole: string;
}

const Workflow = ({
  isDragable,
  handleSelect,
  selectedItems,
  dashboard,
  setDashboard,
  getSelectedWidgets,
  selectedRole,
}: WorkflowProps) => {
  const windowWidth = useWindowWidth();
  const hasMounted = useHasMounted();
  const [components, setComponents] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [isUserWise, setIsUserWise] = useState<any>({});

  useEffect(() => {
    if (getSelectedWidgets) {
      setComponents(getSelectedWidgets?.filter((d) => !d.active));
    }
  }, [getSelectedWidgets]);

  if (!hasMounted)
    return (
      <div className="grid grid-cols-1 gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div className="grid grid-cols-1 gap-4 p-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="w-full md:w-1/2">
                <CardSkeleton count={1} height={200} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  return (
    <>
      {isDragable ? (
        <DndFunction
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          dashboard={dashboard}
          setDashboard={setDashboard}
          components={components}
          setComponents={setComponents}
          getCharts={getCharts}
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 16,
            height: "100%",
          }}
        >
          {filterWidgetsByRole(WorkflowWidget, selectedRole)
            ?.sort((a, b) => a.orderValue - b.orderValue)
            ?.map((item, id) => {
              const style = {
                gridColumn: `span ${getColSpan(item.size, windowWidth)}`,
                gridRow: `span ${getRowSpan(item.size)}`,
                height: "100%",
              };

              return (
                <div key={id} style={style} className="dynamicChart">
                  <Card>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                          {item.title === "Notifications" ? null : (
                            <div className="mb-2 text-lg font-bold">
                              {item.title === "Notifications"
                                ? null
                                : item.title}
                            </div>
                          )}
                          {(item?.widgetName == "productivityStatus" ||
                            item?.widgetName === "allocationStatus") && (
                            <div>
                              <Select
                                style={{ width: "150px" }}
                                placeholder={"Select Patient Type"}
                                dropdownStyle={{ zIndex: 100000 }}
                                options={[
                                  {
                                    label: "In-Patient",
                                    value: "INPATIENT",
                                  },
                                  {
                                    label: "Out-Patient",
                                    value: "OUTPATIENT",
                                  },
                                ]}
                              />
                            </div>
                          )}
                        </div>
                        {isUserWise?.[item?.widgetName] &&
                          (item?.widgetName === "allocationStatus" ||
                            item?.widgetName === "productivityStatus") && (
                            <div>
                              <Select
                                placeholder="Select User"
                                style={{
                                  width: "150px",
                                }}
                                dropdownStyle={{ zIndex: 100000 }}
                                options={[
                                  { label: "Mohammed", value: "mohammed" },
                                  {
                                    label: "Abdulrahman",
                                    value: "abdulrahman",
                                  },
                                  { label: "Fahad", value: "fahad" },
                                ]}
                              />
                            </div>
                          )}
                      </div>

                      <div className="m-2 flex gap-3 items-center">
                        {(item?.widgetName === "allocationStatus" ||
                          item?.widgetName === "productivityStatus") && (
                          <div className="flex items-center gap-2 dashboardSwitch cursor-pointer">
                            <div
                              className={`${!isUserWise?.[item?.widgetName] ? "active" : ""} px-2 py-1`}
                              onClick={() =>
                                setIsUserWise((prev: any) => ({
                                  ...prev,
                                  [item?.widgetName]: false,
                                }))
                              }
                            >
                              Overall
                            </div>
                            <div
                              className={`${isUserWise?.[item?.widgetName] ? "active" : ""} px-2 py-1`}
                              onClick={() =>
                                setIsUserWise((prev: any) => ({
                                  ...prev,
                                  [item?.widgetName]: true,
                                }))
                              }
                            >
                              User Wise
                            </div>
                          </div>
                        )}
                        <input
                          className="cursor-pointer"
                          type="checkbox"
                          id="selectAll"
                          checked={selectedItems?.some(
                            (element) => element.widgetId == item.widgetId,
                          )}
                          onClick={() => handleSelect(item)}
                        />
                      </div>
                    </div>
                    {getCharts({
                      type: item.widgetName,
                      chartType: item.selectedChart,
                      chartChange: false,
                    })}
                  </Card>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};
const enhancer = connect(
  (state: any) => ({
    getSelectedWidgets: state.admin.dashboard1.getWidgetsList?.data?.response,
  }),
  {},
);
export default enhancer(Workflow);
