"use client"
import { Card } from "antd";
import React, { useEffect, useState } from "react";
import {
  filterWidgetsByRole,
  useHasMounted,
  useWindowWidth,
  workQueueWidget,
  getColSpan,
  getRowSpan,
} from "../../function";
import Notifications from "../../notifications";
import Holdstatus from "../../holdstatus";
import DndFunction from "../../function/resubaleDndContext";
import { connect, ConnectedProps } from "react-redux";
import {
  Accuracy,
  chart5Data,
  CompletedStatus,
  DailyTask5,
  DailyTask7,
  WorkFlow,
  WorkFlowCharat7,
} from "./mockData";
import CardSkeleton from "@/components/skeleton/card";

const dummyData = [
  {
    id: 1,
    content: "Test notification 1 from dummy",
    createdDate: new Date().toISOString(),
    fromUserDetails: {
      firstName: "Priya",
      lastName: "V",
      role: "Developer",
    },
  },
  {
    id: 2,
    content: "System update scheduled",
    createdDate: new Date().toISOString(),
    fromUserDetails: {
      firstName: "Rahul",
      lastName: "Sharma",
      role: "Admin",
    },
  },
];

const dummyHoldData = [
  {
    patientId: "PID-001",
    noteText: "Waiting for test results",
    holdNotes: [{ 2023: "Hold due to pending reports" }],
  },
  {
    patientId: "PID-002",
    noteText: "Insurance issue",
    holdNotes: [{ 2023: "Pending claim review" }],
  },
];

interface GetChartsProps {
  selectedRole: string;
  type: string;
  chartType: string;
  chartChange?: boolean;
  accesslist?: any;
  windowWidth: number | null;
}

const getCharts = ({
  selectedRole,
  type,
  chartType,
  chartChange,
  windowWidth,
}: GetChartsProps) => {
  switch (type) {
    case "WorkFlow":
      return (
        <WorkFlow
          chartType={chartType}
          chartChange={chartChange}
          selectedRole={selectedRole}
          chartData={chart5Data}
        />
      );
    case "DailyTask5":
      return (
        <DailyTask5
          chartType={chartType}
          chartChange={chartChange}
          selectedRole={selectedRole}
          windowWidth={windowWidth}
        />
      );
    case "DailyTask7":
      return (
        <DailyTask7
          chartType={chartType}
          chartChange={chartChange}
          selectedRole={selectedRole}
          windowWidth={windowWidth}
        />
      );

    case "Accuracy":
      return (
        <Accuracy
          chartType={chartType}
          chartChange={chartChange}
          selectedRole={selectedRole}
        />
      );
    case "Notifications":
      return (
        <Notifications useDummyData={true} dummyNotificationData={dummyData} />
      );
    case "CompletedStatus":
      return (
        <CompletedStatus
          chartType={chartType}
          chartChange={chartChange}
          selectedRole={selectedRole}
        />
      );
    case "HoldStatus":
      return <Holdstatus useDummyData={true} dummyHoldData={dummyHoldData} />;
    case "WorkFlowChart7":
      return (
        <WorkFlowCharat7
          chartType={chartType}
          chartChange={chartChange}
          selectedRole={selectedRole}
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

interface WorkQueueProps extends PropsFromRedux {
  isDragable?: boolean;
  handleSelect: (item: any) => void;
  selectedItems: any[];
  dashboard: any[];
  setDashboard: React.Dispatch<React.SetStateAction<any[]>>;
  selectedRole: string;
}

const WorkQueue: React.FC<WorkQueueProps> = ({
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
          getCharts={(params: any) => getCharts({ ...params, selectedRole, windowWidth })}
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
          {filterWidgetsByRole(workQueueWidget, selectedRole)
            ?.sort((a, b) => Number(a.orderValue) - Number(b.orderValue))
            ?.map((item, id) => {
              const style = {
                gridColumn: `span ${getColSpan(item.size, windowWidth)}`,
                gridRow: `span ${getRowSpan(item.size)}`,
                height: "100%",
              };

              return (
                <div key={id} style={style} className="dynamicChart">
                  <Card h-full>
                    <div className="m-2 flex justify-between w-full">
                      <div className="font-bold mb-2 text-xl">
                        {item.title !== "Notifications" &&
                          item.title !== "Hold Status"
                          ? item.title
                          : null}
                      </div>
                      <input
                        className="w-4 h-4 cursor-pointer"
                        type="checkbox"
                        checked={selectedItems?.some(
                          (element) => element.widgetId === item.widgetId,
                        )}
                        onChange={() => handleSelect(item)}
                      />
                    </div>
                    {getCharts({
                      selectedRole,
                      type: item.widgetName,
                      chartType: item.selectedChart,
                      accesslist: item.rolesAccessList,
                      windowWidth,
                    })}
                  </Card>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}

export default connector(WorkQueue);
