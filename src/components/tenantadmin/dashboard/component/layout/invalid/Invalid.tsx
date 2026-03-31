"use client"
import React, { useEffect, useState } from "react";
import { Card } from "antd";
import {
  filterWidgetsByRole,
  InvalidWidget,
  useHasMounted,
  useWindowWidth,
  getColSpan,
  getRowSpan,
} from "../../function";
import DndFunction from "../../function/resubaleDndContext";
import { connect, ConnectedProps } from "react-redux";
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

interface GetChartsProps {
  type: string;
  chartType?: string;
  chartChange?: boolean;
}

const getCharts = ({ type, chartType, chartChange }: GetChartsProps) => {
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
      return null;
  }
};

const mapState = (state: any) => ({
  getSelectedWidgets: state.dashboardReducer.getWidgets?.data?.response,
});

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface InvalidProps extends PropsFromRedux {
  isDragable?: boolean;
  handleSelect: (item: any) => void;
  selectedItems: any[];
  dashboard: any[];
  setDashboard: React.Dispatch<React.SetStateAction<any[]>>;
  selectedRole: string;
}

const Invalid: React.FC<InvalidProps> = ({
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
          {filterWidgetsByRole(InvalidWidget, selectedRole)
            ?.sort((a, b) => Number(a.orderValue) - Number(b.orderValue))
            ?.map((item, id) => {
              const style = {
                gridColumn: `span ${getColSpan(item.size, windowWidth)}`,
                gridRow: `span ${getRowSpan(item.size)}`,
                height: "100%",
              };

              return (
                <div key={id} style={style}>
                  <Card className="h-full">
                    <div className="text-end m-2">
                      <input
                        className="w-4 h-4 cursor-pointer"
                        type="checkbox"
                        checked={selectedItems?.some(
                          (element) => element.widgetId === item.widgetId
                        )}
                        onChange={() => handleSelect(item)}
                      />
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
}

export default connector(Invalid);
