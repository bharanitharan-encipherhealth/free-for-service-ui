import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Card } from "antd";
import {
  filterWidgetsByRole,
  getFormattedChartData,
  InvalidWidget,
  useHasMounted,
  useWindowWidth,
  Widget,
} from "../../function";
import { getColSpan } from "../../function";
import { getRowSpan } from "../../function";
import DndFunction from "../../function/resubaleDndContext";
import { connect } from "react-redux";
import {
  DOSCount,
  InvalidCredentails,
  InvalidDocument,
  MRNIDMismatch,
  MultiplePatientFound,
  NoHccFound,
  OutOfScope,
  PatientDeceased,
  PatientDOBMismatch,
  PatientInActive,
  PatientNameMismatch,
  ProviderMissed,
  ProviderSignMissed,
  ProviderUnauthorized,
  ScopeYearMismatch,
  Televisit,
} from "./mockData";
import CardSkeleton from "@/components/skeleton/card";
interface InvalidProps {
  isDragable: boolean;
  handleSelect: (item: any) => void;
  selectedItems: any[];
  dashboard: Widget[];
  setDashboard: Dispatch<SetStateAction<Widget[]>>;
  getSelectedWidgets: any[];
  selectedRole: string;
}

function Invalid({
  isDragable,
  handleSelect,
  selectedItems,
  dashboard,
  setDashboard,
  getSelectedWidgets,
  selectedRole,
}: InvalidProps) {
  const getCharts = ({
    type,
    chartType,
    chartChange,
  }: {
    type: string;
    chartType: string;
    chartChange: boolean;
  }) => {
    switch (type) {
      case "DOSCount":
        return <DOSCount chartType={chartType} chartChange={chartChange} />;
      case "InvalidDocument":
        return (
          <InvalidDocument chartType={chartType} chartChange={chartChange} />
        );
      case "Televisit":
        return <Televisit chartType={chartType} chartChange={chartChange} />;
      case "ProviderMissed":
        return (
          <ProviderMissed chartType={chartType} chartChange={chartChange} />
        );
      case "ProviderSignMissed":
        return (
          <ProviderSignMissed chartType={chartType} chartChange={chartChange} />
        );
      case "ProviderUnauthorized":
        return (
          <ProviderUnauthorized
            chartType={chartType}
            chartChange={chartChange}
          />
        );
      case "PatientDOBMismatch":
        return (
          <PatientDOBMismatch chartType={chartType} chartChange={chartChange} />
        );
      case "PatientNameMismatch":
        return (
          <PatientNameMismatch
            chartType={chartType}
            chartChange={chartChange}
          />
        );
      case "MultiplePatientFound":
        return (
          <MultiplePatientFound
            chartType={chartType}
            chartChange={chartChange}
          />
        );
      case "OutOfScope":
        return <OutOfScope chartType={chartType} chartChange={chartChange} />;
      case "NoHccFound":
        return <NoHccFound chartType={chartType} chartChange={chartChange} />;
      case "InvalidCredentails":
        return (
          <InvalidCredentails chartType={chartType} chartChange={chartChange} />
        );
      case "ScopeYearMis-match":
        return (
          <ScopeYearMismatch chartType={chartType} chartChange={chartChange} />
        );
      case "PatientDeceased":
        return (
          <PatientDeceased chartType={chartType} chartChange={chartChange} />
        );
      case "MRNIDMismatch":
        return (
          <MRNIDMismatch chartType={chartType} chartChange={chartChange} />
        );
      case "PatientIn-active":
        return (
          <PatientInActive chartType={chartType} chartChange={chartChange} />
        );
      default:
        break;
    }
  };
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
            getCharts({ ...params, chartChange: false })
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
          {filterWidgetsByRole(InvalidWidget, selectedRole)
            ?.sort((a, b) => a.orderValue - b.orderValue)
            ?.map((item, id) => {
              const style = {
                gridColumn: `span ${getColSpan(item.size, windowWidth)}`,
                gridRow: `span ${getRowSpan(item.size)}`,
                height: "100%",
              };

              return (
                <div key={id} style={style}>
                  <Card>
                    <div className="text-right m-2">
                      <input
                        className="cursor-pointer"
                        type="checkbox"
                        id="selectAll"
                        checked={selectedItems?.some(
                          (element: any) => element.widgetId == item.widgetId
                        )}
                        onClick={() => handleSelect(item)}
                      />
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
}
const enhancer = connect(
  (state: any) => ({
    getSelectedWidgets: state.admin.dashboard1.getWidgetsList?.data?.response,
  }),
  {}
);
export default enhancer(Invalid);
