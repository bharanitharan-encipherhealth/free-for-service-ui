import React, { useState, useMemo, useEffect } from "react";
import { DndContext, rectIntersection, DragOverlay } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import {
  DraggableBox,
  EmptyComponentZonePlaceholder,
  generateGridWithPlaceholders,
  handleDragEnd,
  handleDragStart,
} from "./dragDropFunction";
import { useWindowWidth } from "./index";
import { Widget } from "../../types";

interface DndFunctionProps {
  activeItem: Widget | null;
  setActiveItem: React.Dispatch<React.SetStateAction<Widget | null>>;
  dashboard: Widget[];
  components: Widget[];
  setComponents: React.Dispatch<React.SetStateAction<Widget[]>>;
  setDashboard: React.Dispatch<React.SetStateAction<Widget[]>>;
  getCharts: (params: { type: string; chartType?: string; chartChange?: boolean; accesslist?: string[] }) => React.ReactNode;
  selectedRole: string;
  handleSelect: (item: any) => void;
  selectedItems: any[];
}

export default function DndFunction({
  activeItem,
  setActiveItem,
  dashboard,
  components,
  setComponents,
  setDashboard,
  getCharts,
  selectedRole,
  handleSelect,
  selectedItems,
}: DndFunctionProps) {
  const [mounted, setMounted] = useState(false);
  const windowWidth = useWindowWidth();

  const OverlayRenderer = ({ item }: { item: Widget }) => {
    return (
      <div style={{ width: "60%", opacity: 0.8, pointerEvents: "none" }}>
        <div className="bg-white p-2">
          {getCharts({ type: item.widgetName, chartType: item.selectedChart, accesslist: item?.rolesAccessList })}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const fullDashboard = useMemo(
    () => generateGridWithPlaceholders(dashboard, windowWidth),
    [dashboard, windowWidth]
  );

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragStart={(e) =>
        handleDragStart({ ...e, setActiveItem, dashboard, components })
      }
      onDragEnd={(e) =>
        handleDragEnd({
          ...e,
          setComponents,
          setDashboard,
          setActiveItem,
          dashboard,
          components,
          windowWidth,
        })
      }
    >
      <SortableContext
        id="dashboard-zone"
        items={fullDashboard.map((i) => i.id)}
        strategy={rectSortingStrategy}
      >
        <div className="mb-4 p-2 relative h-[40vh] overflow-auto bg-[#f0f6fe]">
          <div className="w-full grid grid-cols-12 gap-4">
            {mounted &&
              fullDashboard.map((item, id) =>
                item.covered ? null : (
                  <DraggableBox
                    key={(item.item?.widgetId || item.id) + "-" + id}
                    item={item.item ?? (item as any)}
                    zone="dashboard"
                    getCharts={getCharts}
                    setDashboard={setDashboard}
                    setComponents={setComponents}
                  />
                )
              )}
          </div>
        </div>
      </SortableContext>

      <SortableContext
        id="component-zone"
        items={components.map((i) => i.widgetId)}
        strategy={rectSortingStrategy}
      >
        <div className="bg-[#f8f9fa] p-3">
          <p className="mb-2">
            <span className="text-[#dc3545]">*</span> Drag & drop the widgets below.
          </p>

          <div className="w-full p-2 grid grid-cols-12 gap-4 border-dashed border border-black min-h-[35vh]">
            {mounted &&
              [...components]
                .sort((a, b) => (a.widgetId || "").localeCompare(b.widgetId || ""))
                .map((item) => (
                  <DraggableBox
                    key={item.widgetId}
                    item={item}
                    zone="component"
                    setDashboard={setDashboard}
                    setComponents={setComponents}
                    getCharts={getCharts}
                  />
                ))}

            {mounted && components.length === 0 && (
              <EmptyComponentZonePlaceholder
                description={
                  components.length === 0 && dashboard.length === 0
                    ? "Select The Widget From Widget Management."
                    : "Drop The Component Here."
                }
              />
            )}
          </div>
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={null}>
        {activeItem && (
          <OverlayRenderer item={activeItem} />
        )}
      </DragOverlay>
    </DndContext>
  );
}
