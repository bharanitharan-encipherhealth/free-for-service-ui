"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";

import { actions as tableAction } from "@/state/table";
import TableViewType, { metaDataType } from "@/state/table/model";
import { actions as productivityAction } from "@/state/tenantadmin/productivity";
import ContentLayout from "@/components/layout/ContentLayout/page";
import {
  ProductivityPropsType,
  productivitytabelResposne,
} from "@/models/tenantadmin/productivity/page";
import { productivityPageId } from "@/util/pageIds";
import productivityReducerType from "@/state/tenantadmin/productivity/model";
import { getStorage } from "@/util/storage";
import { findMatchesByField, generateHeaderTab } from "@/util/reusableFunction";

import ReusableFilters from "@/components/ReusbaleFilter";
import ReusableTable from "@/components/ReusabelTable";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import { usePathname } from "next/navigation";
import { actions as logsAction } from "@/state/tenantadmin/tracking";
import LogsReducerType from "@/state/tenantadmin/tracking/model";
import { notification } from "antd";

function Productivity({
  getTableView,
  tableCustomizationCall,
  getAllRolesTab,
  allAllocationRoleData,
  allAllocationRoleLoading,
  tableData,
  tableLoader,
  getLogsReportDownload,
  exportLoading,
}: ProductivityPropsType) {
  const pathName = usePathname();
  const tin = getStorage("tinNumber");
  const projectId = getStorage("project");
  const clientId = getStorage("client");
  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<Record<string, string>>(
    {},
  );
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [searchText, setSearchText] = useState<Record<string, string>>({});
  const [pageNo, setPageNo] = useState(0);
  const [sort, setSort] = useState({
    computedDate: {
      sortDir: "DESC",
      sortField: "computedDate",
    },
  });
  const [paginationFirst, setPaginationFirst] = useState(0);

  const [roleAliasName, setRoleAliasName] = useState("");

  const [tableCustomization, setTableCustomization] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<metaDataType[]>([]);

  const [selectedColumns, setSelectedColumns] = useState<metaDataType[]>([]);

  const [row, setRow] = useState<number>(15);

  const [selectedDates, setSelectedDates] = useState({});

  const handleTabChange = useCallback(
    ({ item }: { item: { label: string; value: string } }) => {
      setActiveTab(item?.value);
      setRoleAliasName(item?.label);
    },
    [],
  );

  const generateBtnClick = useCallback(async () => {
    try {
      const response = await getLogsReportDownload({
        pageId: productivityPageId,
        roleId: activeTab,
        selectedDateRanges,
        selectedOption,
        searchText,
        isAdmin: true,
        sort,
        page: "productivity",
        clientId: clientId,
        projectId: projectId,
        tinIds: tin,
        allTin: true,
      });
      if (response?.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const filename = "Productivity Report.xlsx";
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        notification.success({
          message: "Productivity Excel Export Successfully!",
          duration: 1,
        });
      } else {
        notification.error({
          message: "Productivity Excel Export Fail!",
          duration: 1,
        });
      }
    } catch (err) {
      console.error("Error downloading reports:", err);
    }
  }, [
    selectedDateRanges,
    getLogsReportDownload,
    searchText,
    selectedOption,
    sort,
    activeTab,
    clientId,
    projectId,
    tin,
  ]);

  const layoutList = useMemo(() => {
    return [
      { isFilter: true, data: tableData?.metaDataDTO, loading: tableLoader },
      {
        isBtn: true,
        btnTitle: "Table Customization",
        onClick: () => setTableCustomization(!tableCustomization),
        loading: tableLoader,
      },
      {
        isBtn: true,
        btnTitle: "Export",
        onClick: () => generateBtnClick(),
        loading: tableLoader,
        disable: exportLoading || tableLoader,
      },
    ];
  }, [
    tableData,
    tableLoader,
    setTableCustomization,
    tableCustomization,
    generateBtnClick,
    exportLoading,
  ]);

  const tabList = useMemo(() => {
    return {
      isTab: true,
      tabList: generateHeaderTab({
        tabList: allAllocationRoleData?.allocationRoles,
        value: "aliasName",
        id: "roleId",
      }),
      loading: allAllocationRoleLoading,
      activeTab: activeTab,
      onClick: ({ item }: { item: { label: string; value: string } }) =>
        handleTabChange({ item }),
      value: "aliasName",
    };
  }, [
    allAllocationRoleData,
    allAllocationRoleLoading,
    activeTab,
    handleTabChange,
  ]);

  const onPageChange = useCallback(
    (e: PaginatorPageChangeEvent) => {
      setPaginationFirst(e.first);
      setPageNo(e.page);
    },
    [setPaginationFirst, setPageNo],
  );

  const getAllAllocation = useCallback(async () => {
    try {
      await getTableView({
        pageId: productivityPageId,
        pageNo,
        roleId: activeTab,
        selectedDateRanges,
        selectedOption,
        searchText,
        sort,
        tin,
        isMasterAudit: roleAliasName === "MASTER_AUDIT" ? true : false,
        allClient: false,
        allProject: false,
        allTin: true,
        clientId: clientId,
        projectId: projectId,
        tinIds: tin,
        router: pathName,
      });
    } catch (e) {
      console.error(e, "Error While Calling the Table Api Call");
    }
  }, [
    pageNo,
    activeTab,
    selectedDateRanges,
    selectedOption,
    searchText,
    sort,
    tin,
    roleAliasName,
    clientId,
    getTableView,
    projectId,
    pathName,
  ]);

  const getAllRoles = useCallback(async () => {
    const res = await getAllRolesTab({ pageId: productivityPageId });
    if (res?.status == "SUCCESS") {
      setActiveTab(res?.response?.allocationRoles?.[0]?.roleId);
    }
  }, [getAllRolesTab]);

  const handleRowChange = ({ value }: { value: number }) => {
    const totalRecords = tableData?.pageResponse?.totalElements || 0;

    const newTotalPages = Math.ceil(totalRecords / value);

    setRow(value);

    if (pageNo >= newTotalPages && newTotalPages > 0) {
      setPageNo(newTotalPages - 1);
      setPaginationFirst((newTotalPages - 1) * value);
    }
  };

  const handleInsert = useCallback(
    async ({ data }: { data: string[] }) => {
      const payload = {
        pageId: productivityPageId,
        headerNames: data,
      };

      const res = await tableCustomizationCall({ payload });
      if (res?.status == "SUCCESS") {
        await getAllAllocation();
      }
    },
    [tableCustomizationCall, getAllAllocation],
  );

  useEffect(() => {
    if (activeTab) getAllAllocation();
  }, [
    selectedOption,
    selectedDateRanges,
    searchText,
    pageNo,
    sort,
    paginationFirst,
    activeTab,
    roleAliasName,
  ]);

  useEffect(() => {
    getAllRoles();
  }, []);

  useEffect(() => {
    if (
      tableData?.metaDataDTO ||
      !findMatchesByField(activeFilters, tableData?.metaDataDTO)
    ) {
      const a = tableData?.metaDataDTO.filter(
        (item) => item.active && item?.filter?.style,
      );
      setActiveFilters(
        tableData?.metaDataDTO.filter(
          (item) => item.active && item?.filter?.style,
        ),
      );
      setSelectedColumns(tableData?.metaDataDTO);
      // setIsFilter(false);
    }
  }, [tableData?.metaDataDTO]);
  return (
    <>
      <ContentLayout
        pageTitle="Productivity"
        layoutList={layoutList}
        tabList={tabList}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        tableCustomization={tableCustomization}
        tableCustomizationData={selectedColumns}
        setSelectedColumns={setSelectedColumns}
        handleInsert={handleInsert}
        setTableCustomization={setTableCustomization}
      />
      <div className="content">
        <div className="flex">
          <ReusableFilters
            showFilter={false}
            setActiveFilters={setActiveFilters}
            setSearchText={setSearchText}
            searchText={searchText}
            setSelectedOption={setSelectedOption}
            selectedOption={selectedOption}
            setSelectedDateRanges={setSelectedDateRanges}
            // selectedDateRanges={selectedDateRanges}
            FilterItems={activeFilters}
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            activeFilters={activeFilters}
            setPageNo={setPageNo}
            tableLoader={tableLoader}
          />
        </div>

        <div>
          <ReusableTable
            data={tableData?.pageResponse?.content}
            column={tableData?.metaDataDTO?.filter(
              (item) => item?.active && item?.columnActive,
            )}
            loader={tableLoader}
            setSort={setSort}
            sort={sort}
            first={pageNo === 0 ? 0 : paginationFirst}
            totalRecords={tableData?.pageResponse?.totalElements}
            row={row}
            onPageChange={onPageChange}
            isPagination={true}
            isRowSizabel={true}
            count={30}
            handleRowChange={handleRowChange}
          />
        </div>
      </div>
    </>
  );
}

const connector = connect(
  (state: {
    tableView: TableViewType<productivitytabelResposne>;
    productivityReducer: productivityReducerType;
    logsReducer: LogsReducerType;
  }) => ({
    tableData: state?.tableView?.tableView?.data?.response,
    tableLoader: state?.tableView?.tableViewLoading,
    allAllocationRoleData:
      state?.productivityReducer?.allRolesAllocation?.data?.response,
    allAllocationRoleLoading:
      state?.productivityReducer?.allRolesAllocationLoading,
    exportLoading: state?.logsReducer?.exportLoading,
  }),
  {
    getTableView: tableAction?.tabelViewCall,
    tableCustomizationCall: tableAction?.tableDynamicColumn,
    getAllRolesTab: productivityAction?.getAllRoles,
    getLogsReportDownload: logsAction?.logsExport,
  },
);

export default connector(Productivity);
