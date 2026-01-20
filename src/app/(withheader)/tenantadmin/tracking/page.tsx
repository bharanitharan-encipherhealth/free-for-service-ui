"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import ContentLayout from "@/components/layout/ContentLayout/page";
import { connect } from "react-redux";
import { notification } from "antd";

import { actions as tableAction } from "@/state/table";
import TableViewType, { metaDataType, SortType } from "@/state/table/model";
import {
  getTableViewResponse,
  TrackingPropsType,
} from "@/models/tenantadmin/tracking";
import ReusableFilters from "@/components/ReusbaleFilter";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import ReusableTable from "@/components/ReusabelTable";

import { actions as logsAction } from "@/state/tenantadmin/tracking";
import { logsPageId } from "@/util/pageIds";
import { getStorage } from "@/util/storage";
import LogsReducerType from "@/state/tenantadmin/tracking/model";

function Logs({
  getTableView,
  tableData,
  tableCustomizationCall,
  tableLoader,
  getLogsReportDownload,
  exportLoading,
}: TrackingPropsType) {
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [sort, setSort] = useState<SortType>({
    allocatedOn: {
      sortDir: "DESC",
      sortField: "allocatedOn",
    },
    dueDate: {
      sortDir: "DESC",
      sortField: "dueDate",
    },
    auditAllocatedDate: {
      sortDir: "DESC",
      sortField: "auditAllocatedDate",
    },
    auditDueDate: {
      sortDir: "DESC",
      sortField: "auditDueDate",
    },
    sort: { sortDir: "DESC", sortField: "" },
  });
  const [searchText, setSearchText] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<Record<string, string>>(
    {}
  );
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState({});
  const [row, setRow] = useState<number>(15);
  const [tableCustomization, setTableCustomization] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<metaDataType[]>([]);

  const [selectedColumns, setSelectedColumns] = useState<metaDataType[]>([]);

  // Refs to track previous values for deep comparison
  const prevSelectedOptionRef = useRef<typeof selectedOption | null>(null);
  const prevSelectedDateRangesRef = useRef<typeof selectedDateRanges | null>(
    null
  );
  const prevSearchTextRef = useRef<typeof searchText | null>(null);
  const prevSortRef = useRef<typeof sort | null>(null);
  const prevPageNoRef = useRef<number | null>(null);
  const prevRowRef = useRef<number | null>(null);
  const prevMetaDataRef = useRef<metaDataType[] | undefined>(undefined);
  const isInitialMount = useRef<boolean>(true);

  const generateBtnClick = useCallback(async () => {
    try {
      const response = await getLogsReportDownload({
        pageId: logsPageId,
        roleId: "",
        selectedDateRanges,
        selectedOption,
        searchText,
        isAdmin: true,
        sort,
        page: "logs",
      });
      if (response?.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const filename = "Logs Report.xlsx";
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        notification.success({
          message: "Logs Excel Export Successfully!",
          duration: 1,
        });
      } else {
        notification.error({
          message: "Logs Excel Export Fail!",
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
  ]);

  const handleTableCustomizationClick = useCallback(() => {
    setTableCustomization((prev) => !prev);
  }, []);

  const layoutList = useMemo(
    () => [
      {
        isFilter: true,
        data: tableData?.metaDataDTO,
        loading: tableLoader,
      },
      {
        isBtn: true,
        btnTitle: "Table Customization",
        onClick: handleTableCustomizationClick,
        loading: tableLoader,
      },
      {
        btnTitle: "Export",
        onClick: () => generateBtnClick(),
        loading: tableLoader,
        disable:
          selectedOption?.computing != "2" ||
          !selectedOption?.coder1Status ||
          exportLoading ||
          tableLoader,
        toolTip:
          "To export the logs, select Processing Status as Processed and choose an EH Coder Status.",
        isToolTip: true,
      },
    ],
    [
      tableData?.metaDataDTO,
      handleTableCustomizationClick,
      generateBtnClick,
      tableLoader,
      selectedOption,
      exportLoading,
    ]
  );

  const handleRowChange = ({ value }: { value: number }) => {
    const totalRecords = tableData?.pageResponse?.totalElements || 0;

    const newTotalPages = Math.ceil(totalRecords / value);

    setRow(value);

    if (pageNo >= newTotalPages && newTotalPages > 0) {
      setPageNo(newTotalPages - 1);
      setPaginationFirst((newTotalPages - 1) * value);
    }
  };

  const getAllTracking = useCallback(async () => {
    const userId = getStorage("userId");
    await getTableView({
      pageId: logsPageId,
      pageNo,
      pageSize: row,
      roleId: "",
      isAdmin: true,
      patientAllocated: userId,
      selectedDateRanges,
      selectedOption,
      searchText,
      sort,
    });
  }, [
    row,
    pageNo,
    selectedDateRanges,
    selectedOption,
    searchText,
    sort,
    getTableView,
  ]);

  const onPageChange = useCallback(
    (e: PaginatorPageChangeEvent) => {
      setPaginationFirst(e.first);
      setPageNo(e.page);
    },
    [setPaginationFirst, setPageNo]
  );

  const handleInsert = useCallback(
    async ({ data }: { data: string[] }) => {
      const payload = {
        pageId: logsPageId,
        headerNames: data,
      };

      const res = await tableCustomizationCall({ payload });
      if (res?.status == "SUCCESS") {
        await getAllTracking();
      }
    },
    [tableCustomizationCall, getAllTracking]
  );

  // Deep comparison helper for objects
  const hasObjectChanged = useCallback(
    (prev: unknown, current: unknown): boolean => {
      if (prev === current) return false;
      if (!prev || !current) return true;
      const prevStr = JSON.stringify(prev);
      const currentStr = JSON.stringify(current);
      return prevStr !== currentStr;
    },
    []
  );

  useEffect(() => {
    // Always call on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Update refs with initial values
      prevSelectedOptionRef.current = selectedOption;
      prevSelectedDateRangesRef.current = selectedDateRanges;
      prevSearchTextRef.current = searchText;
      prevSortRef.current = sort;
      prevPageNoRef.current = pageNo;
      prevRowRef.current = row;
      getAllTracking();
      return;
    }

    // Check if any dependency has actually changed
    const optionChanged = hasObjectChanged(
      prevSelectedOptionRef.current,
      selectedOption
    );
    const dateRangesChanged = hasObjectChanged(
      prevSelectedDateRangesRef.current,
      selectedDateRanges
    );
    const searchTextChanged = hasObjectChanged(
      prevSearchTextRef.current,
      searchText
    );
    const sortChanged = hasObjectChanged(prevSortRef.current, sort);
    const activeTabChanged = prevPageNoRef.current !== pageNo;
    const rowChanged = prevRowRef.current !== row;

    if (
      optionChanged ||
      dateRangesChanged ||
      searchTextChanged ||
      sortChanged ||
      activeTabChanged ||
      rowChanged
    ) {
      // Update refs
      prevSelectedOptionRef.current = selectedOption;
      prevSelectedDateRangesRef.current = selectedDateRanges;
      prevSearchTextRef.current = searchText;
      prevSortRef.current = sort;
      prevPageNoRef.current = pageNo;
      prevRowRef.current = row;

      getAllTracking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedOption,
    selectedDateRanges,
    searchText,
    pageNo,
    sort,
    row,
    hasObjectChanged,
  ]);

  useEffect(() => {
    if (!tableData?.metaDataDTO) return;

    // Compare with previous value to avoid unnecessary updates
    const currentMetaData = tableData.metaDataDTO;
    const prevMetaData = prevMetaDataRef.current;

    // Check if metadata has actually changed using reference and length first (faster)
    if (prevMetaData === currentMetaData) return;

    const hasChanged =
      !prevMetaData ||
      prevMetaData.length !== currentMetaData.length ||
      JSON.stringify(prevMetaData) !== JSON.stringify(currentMetaData);

    if (hasChanged) {
      const newActiveFilters = currentMetaData.filter(
        (item) => item.active && item?.filter?.style
      );

      setActiveFilters(newActiveFilters);
      setSelectedColumns(currentMetaData);
      prevMetaDataRef.current = currentMetaData;
    }
  }, [tableData?.metaDataDTO]);
  return (
    <>
      <ContentLayout
        pageTitle="Logs"
        layoutList={layoutList}
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
            //customize table
            tableLoader={tableLoader}
          />
        </div>

        <div>
          <ReusableTable
            data={tableData?.pageResponse?.content}
            column={tableData?.metaDataDTO?.filter(
              (item) => item?.active && item?.columnActive
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
    tableView: TableViewType<getTableViewResponse>;
    logsReducer: LogsReducerType;
  }) => ({
    tableData: state?.tableView?.tableView?.data?.response,
    tableLoader: state?.tableView?.tableViewLoading,
    exportLoading: state?.logsReducer?.exportLoading,
  }),
  {
    getTableView: tableAction?.tabelViewCall,
    tableCustomizationCall: tableAction?.tableDynamicColumn,
    getLogsReportDownload: logsAction?.logsExport,
  }
);

export default connector(Logs);
