"use client";
import {
  checkWithIncludesKey,
  reusableEllipses,
} from "@/util/reusableFunction";
import { Select, Skeleton, Switch, Table, Tooltip } from "antd";
import React, { useCallback, useMemo } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

import style from "./style.module.css";
import { metaDataType, SortType } from "@/state/table/model";
import { contentType } from "@/models/tenantadmin/users";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
type btnType = {
  show: boolean;
  value: string;
};

interface DynamicColumn {
  view?: boolean;
  header?: boolean;
  reportDownload?: boolean;
  checkBox?: boolean;
  statusButton?: boolean;
  triggerButton?: string;
  name?: string;
  width?: number;
  align?: "left" | "right" | "center";
  value?: string;
}

interface newColumnType extends Partial<metaDataType>, Partial<DynamicColumn> {}
export default function ReusabelTable({
  data,
  column,
  loader,
  row,
  totalRecords,
  count,
  isBtnShow,
  isCheckbox,
  isEdit,
  isGenerateReport,
  isUpload,
  isTrigger,
  isGenerateReportDownload,
  sort,
  setSort,
  switchStates,
  onSwitchToggle,
  isPagination = false,
  first,
  onPageChange,
  isRowSizabel = false,
  handleRowChange,
}: {
  column: metaDataType[];
  data: contentType[];
  switchStates: { [key: string]: boolean };
  onSwitchToggle: ({
    item,
    checked,
  }: {
    item: string;
    checked: boolean;
  }) => void;
  loader: boolean;
  isPagination: boolean;
  row: number;
  isRowSizabel: boolean;
  setSort: React.Dispatch<React.SetStateAction<SortType>>;
  sort: SortType;
  first: number;
  totalRecords: number;
  onPageChange: (e: PaginatorPageChangeEvent) => void;
  handleRowChange?: ({ value }: { value: number }) => void;
  count?: number;
  isBtnShow?: btnType;
  isCheckbox?: btnType;
  isEdit?: btnType;
  isGenerateReport?: btnType;
  isUpload?: btnType;
  isTrigger?: btnType;
  isGenerateReportDownload?: btnType;
}) {
  const rowSizeOptions = [
    { label: "15", value: "15" },
    { label: "30", value: "30" },
    { label: "50", value: "50" },
    { label: "100", value: "100" },
  ];
  const dynamicColumns = useMemo(() => {
    const newColumns: newColumnType[] = [...(column || [])];
    if (isBtnShow?.show) {
      newColumns.push({
        active: true,
        value: isBtnShow?.value,
      });
    }
    if (isCheckbox?.show) {
      newColumns.push({
        active: true,
        actualField: isCheckbox?.value,
        header: true,
      });
    }
    if (isEdit?.show) {
      newColumns.push({ active: true, actualField: isEdit?.value });
    }

    if (isGenerateReportDownload?.show) {
      newColumns.push({
        active: true,
        actualField: isGenerateReportDownload?.value,
        header: false,
      });
    }
    if (isGenerateReport?.show) {
      newColumns.push({
        active: true,
        actualField: isGenerateReport?.value,
        header: true,
      });
    }

    if (isUpload?.show) {
      newColumns.push({
        active: true,
        actualField: isUpload?.value,
      });
    }

    if (isTrigger?.show) {
      newColumns.push({
        actualField: isTrigger?.value,
      });
    }

    return newColumns;
  }, [
    column,
    isCheckbox,
    isUpload,
    isTrigger,
    isEdit,
    isGenerateReportDownload,
    isGenerateReport,
    isBtnShow,
  ]);

  const renderCellContent = useCallback(
    ({
      columnItem,
      item,
      colIndex,
    }: {
      columnItem: newColumnType;
      item: contentType;
      colIndex: number;
    }) => {
      if (columnItem?.design?.includes("TOGGLE")) {
        return (
          <Switch
            checked={item?.userName ? switchStates?.[item?.userName] : true}
            onChange={(checked) =>
              onSwitchToggle({ item: item?.userName, checked })
            }
            disabled={item.currentUser === true}
            key={colIndex}
          />
        );
      }

      // Default cell content
      if (columnItem?.columnActive) {
        const filed: string = columnItem?.actualField;
        const value: string = columnItem.value;
        const actualField = item[filed];

        const cellValue = item?.[value];

        const displayValue =
          typeof cellValue === "string" || typeof cellValue === "number"
            ? cellValue
            : cellValue === true
            ? "True"
            : cellValue === false
            ? "False"
            : "";

        return (
          <div
            style={{
              color: item?.accountStatus === false ? "gray" : "",
            }}
          >
            {typeof cellValue === "boolean" ? (
              <div className="flex px-4">{cellValue ? "True" : "False"}</div>
            ) : item || actualField === 0 ? (
              <Tooltip title={displayValue}>
                {reusableEllipses({
                  str: actualField,
                  count: count || 20,
                })}
              </Tooltip>
            ) : (
              <div>---</div>
            )}
          </div>
        );
      }
    },
    [count, switchStates, onSwitchToggle]
  );

  const antdColumns = useMemo(() => {
    const dynamicCols = (dynamicColumns || []).map((item, index) => {
      console.log(sort?.sortField, item?.actualField, "sort");

      const columnConfig = {
        key: `column-${index}`,
        dataIndex: item?.actualField || item?.value,
        title: checkWithIncludesKey(item?.design, "SORTABLE") ? (
          <div className="flex items-center gap-2">
            <span>{item.headerName || item.name}</span>
            <div className="flex flex-column">
              {sort?.sortField === item.actualField &&
              sort?.sortDir === "ASC" ? (
                <FaArrowUp />
              ) : (
                <FaArrowDown />
              )}
            </div>
          </div>
        ) : (
          item.headerName || item.name
        ),
        width: item?.width,
        align: item?.align || "left",
        sorter: false,
        sortOrder: null,
        showSorterTooltip: false,
        onHeaderCell: () => ({
          onClick: checkWithIncludesKey(item?.design, "SORTABLE")
            ? () => {
                if (setSort) {
                  const newSortDir =
                    sort?.sortField === item.actualField &&
                    sort?.sortDir === "ASC"
                      ? "DESC"
                      : "ASC";
                  setSort((prev: SortType) => ({
                    ...prev,
                    [item!.actualField!]: {
                      sortField: item!.actualField!,
                      sortDir: newSortDir,
                    },
                    sortField: item!.actualField!,
                    sortDir: newSortDir,
                  }));
                }
              }
            : undefined,
        }),
        render: (value: newColumnType, record: contentType, rowIndex: number) =>
          renderCellContent({
            columnItem: item,
            item: record,
            colIndex: rowIndex,
          }),
      };
      return columnConfig;
    });
    return dynamicCols;
  }, [dynamicColumns, setSort, renderCellContent, sort]);
  console.log(loader, "loader");

  return (
    <div>
      {loader ? (
        <Table
          columns={antdColumns.map((col) => ({
            ...col,
            render: () => (
              <Skeleton.Input
                active
                size="small"
                style={{ width: col.width || 100, height: 20 }}
              />
            ),
          }))}
          dataSource={Array.from({ length: row || 15 }, (_, index) => ({
            key: `skeleton-${index}`,
          }))}
          pagination={false}
          className={`${style?.spacedTable}`}
          scroll={{ x: "max-content" }}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  style={{
                    ...props.style,
                    borderRight: "none !important",
                    position: "relative",
                  }}
                >
                  <style jsx>{`
                    th::before {
                      display: none !important;
                      content: none !important;
                      width: 0 !important;
                      height: 0 !important;
                    }
                  `}</style>
                  {props.children}
                </th>
              ),
            },
          }}
        />
      ) : (
        <>
          <Table
            columns={antdColumns}
            dataSource={data || []}
            pagination={false}
            scroll={{ x: "max-content" }}
            className={`${style?.spacedTable}`}
          />
          {isPagination && (
            <div className="pagination-container">
              <Paginator
                first={first}
                rows={row ? row : 15}
                totalRecords={totalRecords}
                onPageChange={onPageChange}
              />
              {isRowSizabel && (
                <Select
                  options={rowSizeOptions}
                  className="me-2"
                  // style={{ width: "75px" }}
                  value={row}
                  onChange={(value) => {
                    handleRowChange({ value });
                  }}
                />
              )}

              <div className="total-pages">
                Total count: {totalRecords ? totalRecords : "0"}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
