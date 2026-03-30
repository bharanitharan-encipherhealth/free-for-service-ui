import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Card } from "antd";
import {
  filterWidgetsByRole,
  getFormattedChartData,
  useHasMounted,
  useWindowWidth,
  workQueueWidget,
  Widget,
} from "../../function";
import Notifications from "../../notifications";
import Holdstatus from "../../holdstatus";
import { getColSpan } from "../../function";
import { getRowSpan } from "../../function";
import DndFunction from "../../function/resubaleDndContext";
import { connect } from "react-redux";
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

const getCharts = ({
  selectedRole,
  type,
  chartType,
  chartChange,
  accesslist,
  windowWidth,
}: {
  selectedRole: string;
  type: string;
  chartType: string;
  chartChange: boolean;
  accesslist: string[] | undefined;
  windowWidth: number | null;
}) => {
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
      break;
  }
};
interface WorkQueueProps {
  isDragable: boolean;
  handleSelect: (item: any) => void;
  selectedItems: any[];
  dashboard: Widget[];
  setDashboard: Dispatch<SetStateAction<Widget[]>>;
  getSelectedWidgets: any[];
  selectedRole: string;
}

function WorkQueue({
  isDragable,
  handleSelect,
  selectedItems,
  dashboard,
  setDashboard,
  getSelectedWidgets,
  selectedRole,
}: WorkQueueProps) {
  const windowWidth = useWindowWidth();
  const hasMounted = useHasMounted();
  const [components, setComponents] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState<any>(null);

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
          getCharts={(params: any) =>
            getCharts({ ...params, selectedRole, chartChange: false })
          }
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
                    <div className="m-2 flex w-full items-center justify-between">
                      <div className="mb-2 text-lg font-bold">
                        {item.title === "Notifications" ||
                          item.title === "Hold Status"
                          ? null
                          : item.title}
                      </div>
                      <input
                        className="cursor-pointer"
                        type="checkbox"
                        id="selectAll"
                        checked={selectedItems?.some(
                          (element: any) => element.widgetId == item.widgetId,
                        )}
                        onClick={() => handleSelect(item)}
                      />
                    </div>
                    {getCharts({
                      selectedRole,
                      type: item.widgetName,
                      chartType: item.selectedChart,
                      accesslist: item.rolesAccessList,
                      windowWidth,
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
}
const enhancer = connect(
  (state: any) => ({
    getSelectedWidgets: state.admin.dashboard1.getWidgetsList?.data?.response,
  }),
  {},
);
export default enhancer(WorkQueue);
