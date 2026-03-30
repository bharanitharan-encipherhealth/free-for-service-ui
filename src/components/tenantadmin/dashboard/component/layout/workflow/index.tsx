"use client"
import { Card, Select } from "antd";
import React, { useEffect, useState } from "react";
import {
  filterWidgetsByRole,
  useHasMounted,
  useWindowWidth,
  WorkflowWidget,
  getColSpan,
  getRowSpan,
} from "../../function";
import DndFunction from "../../function/resubaleDndContext";
import { connect, ConnectedProps } from "react-redux";
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

interface GetChartsProps {
  type: string;
  chartType?: string;
  chartChange?: boolean;
}

const getCharts = ({ type, chartType, chartChange }: GetChartsProps) => {
  switch (type) {
    case "OrgPieChartInfo":
      return (
        <OrgPieChartInfo chartType={chartType} chartChange={chartChange} />
      );
    case "WorkFlowFiles":
      return <WorkFlowFiles chartType={chartType} chartChange={chartChange} />;

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
      return null;
  }
};

const mapState = (state: any) => ({
  getSelectedWidgets: state.dashboardReducer.getWidgets?.data?.response,
});

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface WorkflowProps extends PropsFromRedux {
  isDragable?: boolean;
  handleSelect: (item: any) => void;
  selectedItems: any[];
  dashboard: any[];
  setDashboard: React.Dispatch<React.SetStateAction<any[]>>;
  selectedRole: string;
}

const Workflow: React.FC<WorkflowProps> = ({
  isDragable,
  handleSelect,
  selectedItems,
  dashboard,
  setDashboard,
  getSelectedWidgets,
  selectedRole,
}) => {
  const windowWidth = useWindowWidth();
  const hasMounted = useHasMounted();
  const [components, setComponents] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [isUserWise, setIsUserWise] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (getSelectedWidgets) {
      setComponents(getSelectedWidgets?.filter((d: any) => !d.active));
    }
  }, [getSelectedWidgets]);

  if (!hasMounted)
    return (
      <div className="grid grid-cols-1 gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div className="grid grid-cols-4 gap-4 p-3" key={idx}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="col-span-2">
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
          selectedRole={selectedRole}
          handleSelect={handleSelect}
          selectedItems={selectedItems}
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
            ?.sort((a, b) => Number(a.orderValue) - Number(b.orderValue))
            ?.map((item, id) => {
              const style = {
                gridColumn: `span ${getColSpan(item.size, windowWidth)}`,
                gridRow: `span ${getRowSpan(item.size)}`,
                height: "100%",
              };

              return (
                <div key={id} style={style} className="dynamicChart">
                  <Card className="h-full">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <div className="flex gap-3 items-center">
                          {item.title !== "Notifications" && (
                            <div className="font-bold mb-2 text-xl">
                              {item.title}
                            </div>
                          )}
                          {(item?.widgetName === "productivityStatus" ||
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
                                  setIsUserWise((prev) => ({
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
                                  setIsUserWise((prev) => ({
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
                          className="w-4 h-4 cursor-pointer"
                          type="checkbox"
                          checked={selectedItems?.some(
                            (element) => element.widgetId === item.widgetId,
                          )}
                          onChange={() => handleSelect(item)}
                        />
                      </div>
                    </div>
                    {getCharts({
                      type: item.widgetName,
                      chartType: item.selectedChart,
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

export default connector(Workflow);
