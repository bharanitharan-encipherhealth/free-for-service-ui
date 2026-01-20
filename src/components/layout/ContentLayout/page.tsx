"use client";
import { IoFilterSharp } from "react-icons/io5";
import style from "./style.module.css";
import { Button, Checkbox, Drawer, Input, Popover, Tooltip } from "antd";
import { useCallback, useMemo } from "react";
import { metaDataType } from "@/state/table/model";
import { CiSearch } from "react-icons/ci";
import { connect } from "react-redux";
import { UserContentType } from "@/models/tenantadmin/users";
import { allocationRolesType } from "@/models/tenantadmin/productivity/page";

const Search = Input;

function ContentLayout({
  pageTitle,
  layoutList,
  activeFilters,
  setActiveFilters,
  tableCustomization,
  tableCustomizationData,
  setSelectedColumns,
  handleInsert,
  tabelData,
  setTableCustomization,
  tabList,
}: {
  activeFilters?: metaDataType[];
  setActiveFilters?: React.Dispatch<React.SetStateAction<metaDataType[]>>;
  pageTitle?: string;
  layoutList?: {
    isFilter?: boolean;
    data?: metaDataType[];
    isBtn?: boolean;
    btnTitle?: string;
    onClick?: () => void;
    loading: boolean;
    disable?: boolean;
    toolTip?: string;
    isToolTip?: boolean;
  }[];
  tableCustomization?: boolean;
  tableCustomizationData?: metaDataType[];
  setSelectedColumns?: React.Dispatch<
    React.SetStateAction<metaDataType[] | []>
  >;
  handleInsert?: ({ data }: { data: string[] }) => void;
  tabelData: metaDataType[];
  setTableCustomization?: React.Dispatch<React.SetStateAction<boolean>>;
  tabList?: {
    isTab: boolean;
    tabList: { lable: string; value: string }[];
    loading?: boolean;
    activeTab: string;
    onClick: ({ item }: { item: { lable: string; value: string } }) => void;
  };
}) {
  const handleTabelCustomizationRest = useCallback(() => {
    if (setSelectedColumns) setSelectedColumns(tabelData);
  }, [tabelData, setSelectedColumns]);

  const onCLickInsert = useCallback(() => {
    if (tableCustomizationData) {
      const data = tableCustomizationData
        ?.filter((item) => item.active && item.columnActive)
        .map((item) => item.actualField);
      if (handleInsert) handleInsert({ data });
    }
  }, [tableCustomizationData, handleInsert]);

  const handleSelectClearAll = useCallback(
    ({ status }: { status: boolean }) => {
      if (setSelectedColumns)
        setSelectedColumns((prev) =>
          prev.map((item) => ({
            ...item,
            active: status,
          }))
        );
    },
    [setSelectedColumns]
  );

  const handleSelectedColumn = useCallback(
    ({ item }: { item: metaDataType }) => {
      if (setSelectedColumns)
        setSelectedColumns((prev: metaDataType[] | []) => {
          const updated = prev.map((col) => {
            if (col.actualField === item?.actualField) {
              if (col.active) {
                return { ...col, active: false, order: null };
              }
              return { ...col, active: true };
            }
            return col;
          });
          const activeCols = updated
            .filter(
              (col) => col.active && col.actualField !== item?.actualField
            )
            .sort((a, b) => a!.orderValue! - b!.orderValue!);

          const clickedActive = updated.find(
            (col) => col.actualField === item?.actualField && col.active
          );
          if (clickedActive) activeCols.push(clickedActive);

          return updated.map((col) => {
            if (!col.active) return { ...col, order: null };
            const idx = activeCols.findIndex(
              (c) => c.actualField === col.actualField
            );
            return { ...col, orderValue: idx + 1 };
          });
        });
    },
    [setSelectedColumns]
  );

  const handleTableCustomization = useMemo(() => {
    if (tableCustomizationData) {
      return (
        <>
          <div className="flex justify-end gap-2">
            <Button
              className={style.headerBtnColor}
              onClick={() => handleSelectClearAll({ status: true })}
            >
              Select All
            </Button>
            <Button
              className={style.headerBtnColor}
              onClick={() => handleSelectClearAll({ status: false })}
            >
              Clear All
            </Button>
          </div>

          <div className="my-4">
            <Search
              placeholder="Search"
              prefix={<CiSearch className="text-lg" />}
            />
          </div>
          {tableCustomizationData?.map((item, index) => (
            <div
              key={index}
              className={`${style?.tableCheckBox} my-3 font-bold flex gap-3`}
              onClick={() => handleSelectedColumn({ item })}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: item?.active ? "none" : "2px solid #d9d9d9",
                  backgroundColor: item?.active ? "#0942C4" : "transparent",
                  color: item?.active ? "#fff" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  userSelect: "none",
                }}
              >
                {item?.active && item?.orderValue}
              </div>
              <div>{item?.headerName}</div>
            </div>
          ))}

          <div className="flex justify-center gap-2 bottom-0">
            <Button
              className={style.headerBtnColor}
              onClick={handleTabelCustomizationRest}
            >
              Reset
            </Button>

            <Button className={style.headerBtnColor} onClick={onCLickInsert}>
              Insert
            </Button>
          </div>
        </>
      );
    }
  }, [
    tableCustomizationData,
    handleSelectedColumn,
    onCLickInsert,
    handleTabelCustomizationRest,
    handleSelectClearAll,
  ]);

  const handleFilterStatusChange = useCallback(
    ({ item }: { item: metaDataType }) => {
      if (setActiveFilters)
        setActiveFilters((prev: metaDataType[]) =>
          prev.map((x) =>
            x.headerName === item.headerName ? { ...x, active: !x.active } : x
          )
        );
    },
    [setActiveFilters]
  );

  const handleReset = useCallback(() => {
    if (setActiveFilters)
      setActiveFilters((prev: metaDataType[]) =>
        prev.map((item) => ({ ...item, active: true }))
      );
  }, [setActiveFilters]);

  const filterPopupContent = useCallback(() => {
    if (activeFilters) {
      return (
        <>
          <div className={`${style?.filterSelectAll} font-bold pb-1`}>
            <Checkbox checked={activeFilters?.every((item) => item?.active)}>
              Select All
            </Checkbox>
          </div>
          {activeFilters?.map((item, index) => (
            <div key={index} className="py-1">
              <Checkbox
                checked={item?.active}
                onChange={() => handleFilterStatusChange({ item })}
              >
                {item?.headerName}
              </Checkbox>
            </div>
          ))}

          <div className="flex justify-between gap-2">
            <Button className={style.headerBtnColor}>Clear Filter</Button>

            <Button className={style.headerBtnColor} onClick={handleReset}>
              Reset
            </Button>
          </div>
        </>
      );
    }
  }, [activeFilters, handleFilterStatusChange, handleReset]);
  return (
    <>
      <div
        className={`${style?.contentLayout} h-[53px] px-2  flex items-center justify-between font-semibold`}
      >
        <div className="flex items-center gap-3">
          <div className={`${style?.pageTitle}  text-lg`}>{pageTitle}</div>

          {tabList?.isTab && (
            <div className="flex gap-4 contentTab text-xs items-center">
              {tabList?.tabList?.map((item, index) => (
                <div
                  key={index}
                  onClick={() => tabList?.onClick({ item: item })}
                  className={
                    tabList?.activeTab == item?.value
                      ? "activeContentTab cursor-pointer"
                      : "cursor-pointer"
                  }
                >
                  {item?.lable}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {layoutList &&
            layoutList.map((item, index) => {
              if (item?.isFilter) {
                return (
                  <Button
                    key={index}
                    className={`${style.headerBtnColor} no-loading-icon`}
                    disabled={item?.loading}
                  >
                    <Popover
                      placement="bottom"
                      content={filterPopupContent()}
                      trigger={["click"]}
                    >
                      <IoFilterSharp className="font-bold text-lg" />
                    </Popover>
                  </Button>
                );
              }

              if (item?.isToolTip) {
                return (
                  <Tooltip title={item?.toolTip || ""} key={index}>
                    <Button
                      className={`${style.headerBtnColor} no-loading-icon`}
                      onClick={() => {
                        if (item?.onClick) item?.onClick();
                      }}
                      disabled={item?.disable || item?.loading}
                    >
                      {item.btnTitle}
                    </Button>
                  </Tooltip>
                );
              }

              if (item?.isBtn) {
                return (
                  <Button
                    key={index}
                    className={`${style.headerBtnColor}`}
                    onClick={() => {
                      if (item?.onClick) item?.onClick();
                    }}
                    disabled={item?.disable || item?.loading}
                  >
                    {item.btnTitle}
                  </Button>
                );
              }
            })}
        </div>
      </div>

      <Drawer
        open={tableCustomization}
        onClose={() => setTableCustomization && setTableCustomization(false)}
        title="Table Customization"
      >
        {handleTableCustomization}
      </Drawer>
    </>
  );
}

const connector = connect(
  (state: { tableView: metaDataType[] }) => ({
    tabelData: state?.tableView,
  }),
  {}
);

export default connector(ContentLayout);
