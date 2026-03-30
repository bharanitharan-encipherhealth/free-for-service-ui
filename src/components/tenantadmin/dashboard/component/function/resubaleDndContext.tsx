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
import { getColSpan, useWindowWidth, Widget } from "./index";

interface DndFunctionProps {
  activeItem: Widget | null;
  setActiveItem: (item: Widget | null) => void;
  dashboard: Widget[];
  components: Widget[];
  setComponents: React.Dispatch<React.SetStateAction<Widget[]>>;
  setDashboard: React.Dispatch<React.SetStateAction<Widget[]>>;
  getCharts: (params: any) => React.ReactNode;
}

export default function DndFunction({
  activeItem,
  setActiveItem,
  dashboard,
  components,
  setComponents,
  setDashboard,
  getCharts,
}: DndFunctionProps) {
  const [mounted, setMounted] = useState(false);
  const windowWidth = useWindowWidth();
  const OverlayRenderer = ({ item }: { item: Widget }) => {
    return (
      <div style={{ width: "60%", opacity: 0.8, pointerEvents: "none" }}>
        <div className="bg-white p-2">
          {getCharts({
            type: item.widgetName,
            chartType: item.selectedChart,
            accesslist: item?.rolesAccessList,
          })}
        </div>{" "}
      </div>
    );
  };
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 10);
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
        items={fullDashboard.map((i) => i.id || "")}
        strategy={rectSortingStrategy}
      >
        <div
          className="mb-4 p-2"
          style={{
            height: "40vh",
            overflow: "auto",
            background: "#f0f6fe",
          }}
        >
          <div
            className="container-fluid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: 16,
            }}
          >
            {mounted &&
              fullDashboard.map((item, id) =>
                item.covered ? null : (
                  <DraggableBox
                    key={(item.id || "") + "-" + id}
                    item={(item.item ?? item) as Widget}
                    zone="dashboard"
                    getCharts={getCharts}
                    activeBtn={"Default"}
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
        <div className="bg-light p-3">
          <h5>Customization Table</h5>
          <p className="mb-2">
            <span className="text-danger">*</span> Drag & drop the widgets
            below.
          </p>

          <div
            className="container-fluid p-2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: 16,
              border: "dashed 1px #000",
              minHeight: "35vh",
            }}
          >
            {mounted &&
              components
                .sort((a, b) => a.widgetId.localeCompare(b.widgetId))
                .map((item) => (
                  <DraggableBox
                    activeBtn={"Default"}
                    key={item.widgetId}
                    item={item}
                    zone="components"
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
