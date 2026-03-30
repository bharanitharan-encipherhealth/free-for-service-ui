import { IoCloseCircleOutline, IoPieChartOutline } from "react-icons/io5";
import { Button, Select, Skeleton } from "antd";
import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useSortable, arrayMove } from "@dnd-kit/sortable";
import { getColSpan, useHasMounted, getRowSpan, useWindowWidth } from "./index";
import { Widget } from "../../types";

const GRID_COLS = 12;
const MIN_GRID_ROWS = 9;

export interface GridCell {
  id: string;
  empty: boolean;
  className: string;
  item?: Widget;
  covered?: boolean;
  widgetId?: string;
}

export const generateGridWithPlaceholders = (items: Widget[], windowWidth: number | null): GridCell[] => {
  let gridRows = MIN_GRID_ROWS;
  let slotId = 0;
  let grid: (GridCell | null)[][];
  
  while (true) {
    grid = Array.from({ length: gridRows }, () =>
      Array.from({ length: GRID_COLS }, () => null)
    );
    let placed = new Set();
    for (const itm of items) {
      const colSpan = getColSpan(itm?.size, windowWidth);
      const rowSpan = getRowSpan(itm?.size);
      const pos = findFirstSlot2D(grid, colSpan, rowSpan);
      if (pos) {
        const [row, col] = pos;
        placed.add(itm?.widgetId);
        for (let r = row; r < row + rowSpan; r++) {
          for (let c = col; c < col + colSpan; c++) {
            if (r === row && c === col) {
              grid[r][c] = {
                id: itm?.widgetId,
                widgetId: itm?.widgetId,
                empty: false,
                className: itm?.size,
                item: itm,
              };
            } else {
              grid[r][c] = { id: `covered-${itm.widgetId}-${r}-${c}`, empty: false, className: "", covered: true };
            }
          }
        }
      }
    }
    
    if (placed.size === items.length) break;
    gridRows++;
    if (gridRows > 100) break; // Safety break
  }

  // Fill empty slots
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      if (!grid[row][col]) {
        grid[row][col] = {
          id: `empty-${slotId++}`,
          empty: true,
          className: "col-1 row-1",
        };
      }
    }
  }

  // Ensure minimum empty rows at bottom
  let emptyRowsAtBottom = 0;
  while (true) {
    emptyRowsAtBottom = 0;
    for (let row = grid.length - 1; row >= 0; row--) {
      let isEmptyRow = true;
      for (let col = 0; col < GRID_COLS; col++) {
        if (!grid[row][col]?.empty) {
          isEmptyRow = false;
          break;
        }
      }
      if (isEmptyRow) {
        emptyRowsAtBottom++;
      } else {
        break;
      }
    }
    if (emptyRowsAtBottom >= 10) break;
    grid.push(
      Array.from({ length: GRID_COLS }, () => ({
        id: `empty-${slotId++}`,
        empty: true,
        className: "col-1 row-1",
      }))
    );
  }
  
  return grid.flat() as GridCell[];
};

export function findFirstSlot2D(grid: (GridCell | null)[][], colSpan: number, rowSpan: number): [number, number] | null {
  const numRows = grid.length;
  const numCols = grid[0].length;
  for (let row = 0; row <= numRows - rowSpan; row++) {
    for (let col = 0; col <= numCols - colSpan; col++) {
      let fits = true;
      for (let r = row; r < row + rowSpan; r++) {
        for (let c = col; c < col + colSpan; c++) {
          if (grid[r][c]) {
            fits = false;
            break;
          }
        }
        if (!fits) break;
      }
      if (fits) return [row, col];
    }
  }
  return null;
}

export function updateDashboardOrderIds(items: Widget[]): Widget[] {
  return items.map((item, index) => ({
    ...item,
    orderValue: String(index + 1),
  }));
}

export function EmptyComponentZonePlaceholder({ description }: { description: string }) {
  const { setNodeRef } = useDroppable({ id: "empty-component-zone" });

  return (
    <div
      ref={setNodeRef}
      id="empty-component-zone"
      className="border border-[#6c757d] rounded text-[#6c757d] flex items-center justify-center italic"
      style={{
        gridColumn: "span 12",
        minHeight: "100px",
        background: "#f9f9f9",
      }}
    >
      {description}
    </div>
  );
}

interface DraggableBoxProps {
  item: Widget;
  zone: "dashboard" | "component";
  getProps?: any;
  setDashboard: React.Dispatch<React.SetStateAction<Widget[]>>;
  setComponents: React.Dispatch<React.SetStateAction<Widget[]>>;
  activeBtn?: string;
  getCharts: any;
}

export const DraggableBox = React.memo<DraggableBoxProps>(
  ({
    item,
    zone,
    setDashboard,
    setComponents,
    getCharts,
  }) => {
    const { setNodeRef, listeners, attributes, transition } =
      useSortable({
        id: item.widgetId || (item as any).id,
        data: {
          sortable: {
            containerId:
              zone === "dashboard" ? "dashboard-zone" : "component-zone",
          },
        },
      });
    const [chartChange, setChartChange] = useState(false);
    const windowWidth = useWindowWidth();
    const hasMounted = useHasMounted();

    const style: React.CSSProperties = {
      transition: transition,
      gridColumn: `span ${getColSpan(item.size, windowWidth)}`,
      gridRow: `span ${getRowSpan(item.size)}`,
      minHeight: 110,
      cursor: "grab",
      position: "relative",
      userSelect: "none",
      willChange: "transform",
      zIndex: (item as any).empty ? 0 : 1,
    };

    const removeDashboardComponent = () => {
      setDashboard((prev) => prev.filter((c) => c.widgetId !== item.widgetId));
      setComponents((prev) => [...prev, item]);
    };

    const changeChart = (type: string) => {
      setChartChange(true);
      setTimeout(() => {
        setDashboard((prev: Widget[]) =>
          prev.map((c) =>
            c.widgetId === item.widgetId ? { ...c, selectedChart: type as any } : c
          )
        );
        setChartChange(false);
      }, 300);
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`rounded bg-white border border-[#dad8e4] overflow-hidden ${(item as any).empty ? "empty-slot" : ""}`}
      >
        {!(item as any).empty && zone === "dashboard" && (
          <div
            className={`flex ${
              item.widgetTypes
                ? "justify-between"
                : "justify-end"
            } items-center px-3 py-2`}
          >
            {item.widgetTypes ? (
              <Select
                style={{
                  width: 150,
                  marginBottom: 16,
                  textTransform: "capitalize",
                }}
                placeholder={<IoPieChartOutline />}
                onChange={(selectedType) => {
                  changeChart(selectedType);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                value={item.selectedChart}
                getPopupContainer={(triggerNode: any) => (triggerNode.parentNode as HTMLElement)}
              >
                {item?.widgetTypes?.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type === "card" ? type : `${type} Chart`}
                  </Select.Option>
                ))}
              </Select>
            ) : null}
            <Button
              size="small"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={removeDashboardComponent}
            >
              <IoCloseCircleOutline />
            </Button>
          </div>
        )}

        {!(item as any).empty && (
          <div className="bg-white p-2">
            {item.title === "Notifications" ||
            item.title === "Hold Status" ? null : (
              <div className="font-bold mb-2 text-xl">
                {item.title}
              </div>
            )}
            {!hasMounted && (
              <div className="grid grid-cols-1 gap-3">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div className="grid grid-cols-4 gap-4 p-3" key={idx}>
                    {Array.from({ length: 4 }).map((_, idx2) => (
                      <div key={idx2} className="col-span-2">
                        <Skeleton.Node
                          active={true}
                          style={{ width: 800, height: 200 }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {hasMounted
              ? getCharts({
                  type: item.widgetName,
                  chartType: item?.selectedChart,
                  chartChange,
                  accesslist: item?.rolesAccessList
                })
              : null}
          </div>
        )}
      </div>
    );
  }
);

DraggableBox.displayName = "DraggableBox";

export function getOrderedDashboardFromGrid(dashboard: Widget[], windowWidth: number | null): Widget[] {
  const grid = generateGridWithPlaceholders(dashboard, windowWidth);
  const seen = new Set();
  const ordered: Widget[] = [];
  for (const cell of grid) {
    if (
      !cell.covered &&
      !cell.empty &&
      cell.item &&
      !seen.has(cell.item.widgetId)
    ) {
      ordered.push(cell.item);
      seen.add(cell.item.widgetId);
    }
  }
  return ordered;
}

export const handleDragEnd = (props: any) => {
  const {
    active,
    over,
    setComponents,
    setDashboard,
    setActiveItem,
    dashboard,
    components,
    windowWidth,
  } = props;
  const activeId = active.id;
  const fromZone = active.data.current.sortable.containerId;
  const overId = over?.id;
  const overZone = over?.data?.current?.sortable?.containerId ?? null;

  if (
    fromZone === "dashboard-zone" &&
    (overZone === "component-zone" || over?.id === "empty-component-zone")
  ) {
    const moved = dashboard.find((i: Widget) => i.widgetId === activeId);
    if (!moved) return;
    setDashboard((d: Widget[]) => d.filter((i) => i.widgetId !== activeId));
    setComponents((c: Widget[]) => [...c, moved]);
    setActiveItem(null);
    return;
  }

  if (fromZone === "component-zone" && overZone === "dashboard-zone") {
    const moved = components.find((i: Widget) => i.widgetId === activeId);
    if (!moved) return;
    setComponents((c: Widget[]) => c.filter((i) => i.widgetId !== activeId));
    setDashboard((d: Widget[]) =>
      updateDashboardOrderIds(
        getOrderedDashboardFromGrid([...d, moved], windowWidth)
      )
    );
    setActiveItem(null);
    return;
  }

  if (
    fromZone === "dashboard-zone" &&
    overZone === "dashboard-zone" &&
    overId
  ) {
    if (activeId !== overId) {
      const oldIdx = dashboard.findIndex((i: Widget) => i.widgetId === activeId);
      const newIdx = dashboard.findIndex((i: Widget) => i.widgetId === overId);
      if (oldIdx !== -1 && newIdx !== -1) {
          setDashboard((d: Widget[]) =>
            updateDashboardOrderIds(
              getOrderedDashboardFromGrid(arrayMove(d, oldIdx, newIdx), windowWidth)
            )
          );
      }
    }
  }

  setActiveItem(null);
};

export const handleDragStart = (props: any) => {
  const { active, setActiveItem, dashboard, components } = props;
  const it =
    dashboard.find((d: Widget) => d.widgetId === active.id) ||
    components.find((c: Widget) => (c.widgetId || (c as any).id) === active.id);
  setActiveItem(it);
};
