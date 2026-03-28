"use client";
import {
  checkWithIncludesKey,
  CreateIdGens,
  findItemWithTrueOrFalse,
  formatDateTime,
  renderUserProfile,
  reusableEllipses,
} from "@/util/reusableFunction";
import {
  Button,
  Checkbox,
  Popover,
  Progress,
  Select,
  Skeleton,
  Spin,
  Switch,
  Table,
  Tooltip,
} from "antd";
import React, { useCallback, useMemo } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

import style from "./style.module.css";
import { metaDataType, SortType } from "@/state/table/model";
import { Paginator } from "primereact/paginator";
import { IoClose } from "react-icons/io5";
import { BiEdit } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  AppTableType,
  handleRowCheckboxChangeType,
} from "@/models/ReusabelTable";
import { usePathname } from "next/navigation";
import { getProcessStatusKey, statusColorPick } from "@/resuabelFunction/Menu";

interface TableParams<T extends Record<string, unknown>> {
  columnItem: newColumnType;
  item: T;
  colIndex: number;
}

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
  edit: boolean;
  btnShow?: boolean;
  title?: string;
  handleClick: ({ item }: { item: string }) => void;
  id: string;
}

interface newColumnType extends Partial<metaDataType>, Partial<DynamicColumn> {}
export default function ReusabelTable<
  T extends Record<string, unknown> = Record<string, unknown>,
>({
  data,
  column,
  loader,
  row,
  totalRecords,
  count,
  isBtnShow,
  isCheckBox,
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
  tableId,
  handleAction,
  content,
  visiblePopoverKey,
  setVisiblePopoverKey,
  setEditingUser,
  onCloseIconClick,
  id,
  checkedHeader,
  disabled,
  handleRowCheckboxChange,
  checkBoxLoader,
  selectedRows,
  onRowClick,
}: AppTableType<T>) {
  const pathname = usePathname();
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
        btnShow: true,
        value: isBtnShow?.value,
        title: isBtnShow?.title,
        handleClick: isBtnShow?.onClick,
        id: isBtnShow?.id,
      });
    }
    if (isCheckBox?.show) {
      newColumns.push({
        checkBox: true,
        value: isCheckBox?.value,
        header: true,
      });
    }
    if (isEdit?.show) {
      newColumns.push({ edit: true, value: isEdit?.value });
    }

    if (isGenerateReportDownload?.show) {
      newColumns.push({
        active: true,
        value: isGenerateReportDownload?.value,
        header: false,
      });
    }
    if (isGenerateReport?.show) {
      newColumns.push({
        active: true,
        value: isGenerateReport?.value,
        header: true,
      });
    }

    if (isUpload?.show) {
      newColumns.push({
        active: true,
        value: isUpload?.value,
      });
    }

    if (isTrigger?.show) {
      newColumns.push({
        value: isTrigger?.value,
      });
    }

    return newColumns;
  }, [
    column,
    isCheckBox,
    isUpload,
    isTrigger,
    isEdit,
    isGenerateReportDownload,
    isGenerateReport,
    isBtnShow,
  ]);

  const handleRowClick = (record: T, event: React.MouseEvent<HTMLElement>) => {
    // Check if the click target is an interactive element
    const target = event?.target as HTMLElement | null;
    if (target) {
      // Check if the clicked element or its parent is an interactive element
      const isInteractiveElement = target.closest(
        'button, input, select, textarea, a, [role="button"]',
      );
      if (isInteractiveElement) {
        return; // Don't trigger row click for interactive elements
      }
    }

    if (onRowClick) {
      onRowClick({ record });
    }
  };

  const processstatusBodyTemplate = ({
    item,
    actualField,
  }: {
    item: T;
    actualField?: string;
  }) => {
    const rawValue =
      actualField && item[actualField] !== undefined
        ? (item[actualField] as string | number)
        : "";
    const rowStatus: string = getProcessStatusKey({ item: rawValue });
    return (
      <div
        className={style.roleStyle}
        style={statusColorPick({ status: rowStatus })}
      >
        {rowStatus === "Processing" && (
          <Spin
            indicator={
              <AiOutlineLoading3Quarters
                style={{ color: "white", fontSize: "12px" }}
              />
            }
            style={{ color: "#452b90", margin: "0 10px 0 0" }}
          />
        )}
        {rowStatus}
      </div>
    );
  };

  const renderEditCell = useCallback(
    (columnItem: newColumnType, item: T, colIndex: number) => {
      const record = item as T & { accountStatus?: boolean; id?: string };
      return record.accountStatus === true ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleAction?.(item);
          }}
        >
          {content ? (
            <Popover
              content={content?.(item)}
              title={
                <div className="flex justify-between items-center">
                  <span>Change Role</span>
                  <IoClose
                    className="cursor-pointer"
                    onClick={onCloseIconClick}
                    id={
                      tableId
                        ? CreateIdGens("closeIcon" + tableId + colIndex)
                        : CreateIdGens("closeIcon" + colIndex)
                    }
                  />
                </div>
              }
              placement="bottom"
              trigger="click"
              open={visiblePopoverKey === record.id}
              onOpenChange={(visible) => {
                if (visible) {
                  if (setEditingUser) setEditingUser(item);
                  if (record.id !== undefined) setVisiblePopoverKey?.(record.id);
                }
              }}
            >
              <div
                onClick={() => handleAction?.(item)}
                className="cursor-pointer editIcon"
              >
                <BiEdit className="text-md" size={16} />
              </div>
            </Popover>
          ) : (
            <div
              onClick={() => {
                handleAction?.(item);
                if (setEditingUser) setEditingUser(item);
              }}
              className="cursor-pointer editIcon"
            >
              <BiEdit className="text-md" size={16} />
            </div>
          )}
        </div>
      ) : (
        <div>
          <BiEdit />
        </div>
      );
    },
    [
      handleAction,
      content,
      setEditingUser,
      setVisiblePopoverKey,
      tableId,
      visiblePopoverKey,
      onCloseIconClick,
    ],
  );

  const renderCheckboxCell = useCallback(
    ({ columnItem, item, colIndex }: TableParams<T>) => {
      const record = item as T & { status?: string };
      const valueKey = columnItem.value;
      return (
        <div
          className={`flex justify-center items-center`}
          style={{ height: "32px" }}
        >
          {checkBoxLoader ? (
            <Skeleton.Button
              active
              size="small"
              style={{ width: 20, height: 20 }}
            />
          ) : record?.status === "FAILED" ? (
            "---"
          ) : (
            <Checkbox
              onChange={(e) => {
                e.stopPropagation();
                handleRowCheckboxChange?.({
                  e,
                  row: item,
                  singleCheck: true,
                } as handleRowCheckboxChangeType<T>);
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              checked={selectedRows?.some(
                (row) =>
                  valueKey !== undefined &&
                  row === (item as Record<string, unknown>)[valueKey],
              )}
              id={
                tableId
                  ? CreateIdGens("checkBox" + tableId + colIndex)
                  : CreateIdGens(
                      "checkbox" + pathname.replaceAll("/", " ") + colIndex,
                    )
              }
              className={`custom-checkbox`}
            />
          )}
        </div>
      );
    },
    [checkBoxLoader, handleRowCheckboxChange, tableId, selectedRows, pathname],
  );

  const renderBtnCell = useCallback(
    ({ columnItem, item, colIndex }: TableParams<T>) => {
      const idKey = columnItem?.id;
      return (
        <Button
          className="cursor-pointer"
          onClick={() =>
            idKey !== undefined &&
            columnItem?.handleClick?.({
              item: String((item as Record<string, unknown>)[idKey] ?? ""),
            })
          }
          key={colIndex}
        >
          {columnItem?.value}
        </Button>
      );
    },
    [],
  );

  const renderCellContent = useCallback(
    ({ columnItem, item, colIndex }: TableParams<T>) => {
      const record = item as Record<string, unknown>;
      const filed: string | undefined = columnItem?.actualField;
      const value: string | undefined = columnItem?.value;

      const actualField = filed !== undefined ? record[filed] : undefined;
      const cellValue = value !== undefined ? record[value] : undefined;

      if (columnItem?.design?.includes("TOGGLE")) {
        return (
          <Switch
            className="custom-switch"
            checked={
              record?.userName
                ? switchStates?.[record.userName as string]
                : true
            }
            onChange={(checked) =>
              onSwitchToggle?.({ item: record?.userName as string, checked })
            }
            disabled={record?.currentUser === true}
            key={colIndex}
          />
        );
      }

      if (
        columnItem?.design?.includes("DATE") ||
        columnItem?.design?.includes("DATE_TIME")
      ) {
        return (
          <div
            style={{
              color: record?.accountStatus === false ? "gray" : "",
            }}
          >
            {actualField ? (
              columnItem.design?.includes("DATE_TIME") ? (
                formatDateTime({
                  date: actualField,
                  formatType: "dateTime",
                })
              ) : (
                formatDateTime({
                  date: actualField,
                  formatType: "date",
                })
              )
            ) : (
              <div className="d-flex px-4">---</div>
            )}
          </div>
        );
      }

      if (findItemWithTrueOrFalse(columnItem.design, "PROFILE")) {
        return (
          <div
            style={{
              color: record?.accountStatus === false ? "gray" : "",
            }}
          >
            {renderUserProfile(item, columnItem)}
          </div>
        );
      }

      if (columnItem?.design?.includes("COMPUTATION_STATUS")) {
        return processstatusBodyTemplate({
          item,
          actualField: columnItem?.actualField,
        });
      }

      if (columnItem?.design?.includes("PROGRESS_BAR")) {
        const percentField = columnItem?.actualField;
        return (
          <div className="d-flex justify-content-start gap-3">
            <Progress
              percent={
                percentField !== undefined
                  ? (record[percentField] as number)
                  : undefined
              }
              format={(percent) => `${percent}%`}
            />
          </div>
        );
      }

      // Default cell content
      if (columnItem?.columnActive) {
        return (
          <div
            style={{
              color: record?.accountStatus === false ? "gray" : "",
            }}
          >
            {typeof cellValue === "boolean" ? (
              <div className="flex px-4">{cellValue ? "True" : "False"}</div>
            ) : actualField != null && actualField !== "" ? (
              <Tooltip title={String(actualField)}>
                {reusableEllipses({
                  str: String(actualField),
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
    [count, switchStates, onSwitchToggle],
  );

  const antdColumns = useMemo(() => {
    const dynamicCols = (dynamicColumns || []).map((item, index) => {
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
        render: (_value: newColumnType, record: T, rowIndex: number) =>
          renderCellContent({
            columnItem: item,
            item: record,
            colIndex: rowIndex,
          }),
      };

      if (item?.btnShow && item?.title) {
        columnConfig.title = item?.title;
        columnConfig.render = (_text, record, rowIndex) =>
          renderBtnCell({ columnItem: item, item: record, colIndex: rowIndex });
      }

      if (item.checkBox && item?.header) {
        columnConfig.title = (
          <div
            className="flex items-center justify-center"
            style={{ height: "32px" }}
          >
            <div className="mx-2">All</div>
            <Checkbox
              className="mx-2 custom-table-checkbox"
              onChange={(e) => {
                e.stopPropagation();
                handleRowCheckboxChange?.({
                  e,
                  row: item as unknown as T,
                  singleCheck: false,
                  checked: e.target.checked,
                });
              }}
              id={
                id
                  ? CreateIdGens("tableCheckbox" + id)
                  : CreateIdGens(
                      "tableCheckbox" + pathname.replaceAll("/", " "),
                    )
              }
              checked={data?.length > 0 && !loader && checkedHeader}
              disabled={data?.length === 0 || disabled || loader}
            />
            <span>{item.name}</span>
          </div>
        );
        columnConfig.render = (_text, record, rowIndex) =>
          renderCheckboxCell({
            columnItem: item,
            item: record,
            colIndex: rowIndex,
          });
      }
      if (item.edit) {
        const isUsersPage = window.location.pathname.includes(
          "tenantadmin/settings",
        );
        columnConfig.title = isUsersPage ? "Edit" : "Action";
        columnConfig.render = (_text, record, rowIndex) =>
          renderEditCell(item, record, rowIndex);
      }
      return columnConfig;
    });
    return dynamicCols;
  }, [
    dynamicColumns,
    setSort,
    renderCellContent,
    sort,
    renderEditCell,
    id,
    checkedHeader,
    disabled,
    pathname,
    handleRowCheckboxChange,
    renderCheckboxCell,
    renderBtnCell,
  ]);

  return (
    <div>
      {loader || data === undefined || data === null ? (
        <Table
          key={"tableLoader"}
          columns={Array.from({ length: 5 }).map((_, i) => ({
            key: `dummy-col-${i}`,
            title: (
              <div className="flex items-center justify-center">
                <Skeleton.Button
                  active
                  size="small"
                  style={{ width: 80, height: 20 }}
                />
              </div>
            ),
            render: () => (
              <div className="flex items-center justify-center">
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: 100, height: 20 }}
                />
              </div>
            ),
          }))}
          dataSource={Array.from({ length: 10 }, (_, index) => ({
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
            dataSource={data}
            pagination={false}
            scroll={{ x: "max-content" }}
            className={`${style?.spacedTable}`}
            rowClassName={() => style.pointerRow}
            onRow={(record: T) => ({
              onClick: (event) => handleRowClick(record, event),
            })}
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
                    if (handleRowChange) handleRowChange({ value });
                  }}
                />
              )}

              <div className="total-pages mx-2">
                Total count: {totalRecords ? totalRecords : "0"}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
