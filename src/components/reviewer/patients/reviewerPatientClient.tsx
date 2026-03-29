"use client";
import { findMatchesByField, generateHeaderTab } from "@/util/reusableFunction";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import ContentLayout from "@/components/layout/ContentLayout/page";
import TableViewType, { metaDataType, SortType } from "@/state/table/model";
import { connect, ConnectedProps } from "react-redux";

import { actions as tableAction } from "@/state/table";
import { ReviewerPatientType } from "@/models/reviewer/patients";
import { getStorage, setStorage } from "@/util/storage";
import { getTableViewResponse } from "@/models/tenantadmin/tracking";
import ReusableFilters from "@/components/ReusbaleFilter";
import ReusabelTable from "@/components/ReusabelTable";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import {
  productivityContentArrayType,
  tinPatientTableResposneType,
} from "@/models/tenantadmin/tin/patients";
import { useRouter } from "next/navigation";
import { notification } from "antd";

type ReviewerPatientClientReduxType = ConnectedProps<typeof connector>;
type ReviewerPatientClientPropsType = ReviewerPatientClientReduxType &
  ReviewerPatientType;
const ReviewerPatientClient = ({
  getTableView,
  tableCustomizationCall,
  pageId,
  isReAssigned,
  isQueried,
  routeTo,
  tableData,
  tableLoader,
  getRoutedData,
  routeBack,
}: ReviewerPatientClientPropsType) => {
  const route = useRouter();
  const userId = getStorage("userId");
  const reviewrTab = useMemo(
    () => [
      {
        id: "PENDING",
        value: `pending - ${tableData?.mciPatientCountDTO?.pendingCount || 0}`,
      },
      {
        id: "COMPLETED",
        value: `completed ${tableData?.mciPatientCountDTO?.approvedCount || 0}`,
      },
    ],
    [tableData],
  );

  const [activeTab, setActiveTab] = useState<string>("PENDING");
  const [pageNo, setPageNo] = useState(0);
  const [selectedOption, setSelectedOption] = useState<
    Record<string, string | string[]>
  >({});
  const [searchText, setSearchText] = useState<Record<string, string>>({});
  const [activeFilters, setActiveFilters] = useState<metaDataType[]>([]);
  const [selectedDates, setSelectedDates] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [row, setRow] = useState<number>(15);

  const [selectedColumns, setSelectedColumns] = useState<metaDataType[]>([]);
  const [sort, setSort] = useState<SortType>({
    allocatedOn: {
      sortDir: "DESC",
      sortField: "allocatedOn",
    },
    dueDate: {
      sortDir: "DESC",
      sortField: "dueDate",
    },
    processedDate: {
      sortDir: "DESC",
      sortField: "processedDate",
    },
  });

  const [tableCustomization, setTableCustomization] = useState<boolean>(false);

  const handleTabChange = useCallback(
    ({ item }: { item: { label: string; value: string } }) => {
      setActiveTab(item?.value);
    },
    [activeTab, setActiveTab],
  );
  const tabList = useMemo(() => {
    return {
      isTab: true,
      tabList: generateHeaderTab({
        tabList: reviewrTab,
        value: "value",
        id: "id",
      }),
      activeTab,
      onClick: ({ item }: { item: { label: string; value: string } }) =>
        handleTabChange({ item }),
    };
  }, [reviewrTab, handleTabChange, activeTab]);

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
    ],
    [tableLoader, tableData],
  );

  const getReviewerTable = useCallback(async () => {
    await getTableView({
      pageNo,
      pageSize: row,
      roleId: "",
      selectedOption,
      sort,
      selectedDateRanges,
      searchText,
      pageId,
      activeStatus: activeTab,
      isReAssigned,
      isQueried,
      patientAllocated: userId,
    });
  }, [
    getTableView,
    pageNo,
    row,
    selectedOption,
    sort,
    selectedDateRanges,
    searchText,
    pageId,
    activeTab,
    isReAssigned,
    isQueried,
  ]);

  const onPageChange = useCallback(
    (e: PaginatorPageChangeEvent) => {
      setPaginationFirst(e.first);
      setPageNo(e.page);
    },
    [setPaginationFirst, setPageNo],
  );

  const handleInsert = useCallback(
    async ({ data }: { data: string[] }) => {
      const payload = {
        pageId: pageId,
        headerNames: data,
      };

      const res = await tableCustomizationCall({ payload });
      if (res?.status == "SUCCESS") {
        await getReviewerTable();
      }
    },
    [tableCustomizationCall, getReviewerTable, pageId],
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

  const params = {
    pageNo,
    selectedDates,
    paginationFirst,
    sort,
    activeFilters,
    searchText,
    selectedOption,
    selectedDateRanges,
  };

  const goToPatientDetails = useCallback(
    ({ record }: { record: productivityContentArrayType }) => {
      if (record?.computing === 2) {
        const controller = new AbortController();
        controller.abort();
        setStorage("patientId", record?.patientId);
        setStorage("routeBackTo", routeBack);
        getRoutedData(params);
        route.push(routeTo);
      } else {
        notification.warning({
          message: record?.patientName + " file not processed. Please wait!",
        });
      }
    },
    [getRoutedData, params, routeTo, route, routeBack],
  );

  useEffect(() => {
    if (activeTab) {
      getReviewerTable();
    }
  }, [
    pageNo,
    selectedOption,
    selectedDateRanges,
    searchText,
    sort,
    row,
    activeTab,
  ]);

  useEffect(() => {
    const filterSet = () => {
      if (
        tableData?.metaDataDTO ||
        !findMatchesByField(activeFilters, tableData?.metaDataDTO)
      ) {
        setActiveFilters(
          tableData?.metaDataDTO.filter(
            (item) => item.columnActive && item?.filter?.style,
          ),
        );
        setSelectedColumns(tableData?.metaDataDTO);
      }
    };
    filterSet();
  }, [tableData?.metaDataDTO]);
  return (
    <>
      <ContentLayout
        pageTitle="Workqueue"
        tabList={tabList}
        layoutList={layoutList}
        tableCustomization={tableCustomization}
        setActiveFilters={setActiveFilters}
        activeFilters={activeFilters}
        tableCustomizationData={selectedColumns}
        setSelectedColumns={setSelectedColumns}
        handleInsert={handleInsert}
        setTableCustomization={setTableCustomization}
      />

      <div className="content">
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

        <ReusabelTable<productivityContentArrayType>
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
          isPagination={true}
          isRowSizabel={true}
          count={30}
          onPageChange={onPageChange}
          handleRowChange={handleRowChange}
          onRowClick={goToPatientDetails}
        />
      </div>
    </>
  );
};

ReviewerPatientClient.display = "ReviewerPatientClient";

const connector = connect(
  (state: { tableView: TableViewType<tinPatientTableResposneType> }) => ({
    tableData: state?.tableView?.tableView?.data?.response,
    tableLoader: state?.tableView?.tableViewLoading,
  }),
  {
    getTableView: tableAction?.tabelViewCall,
    tableCustomizationCall: tableAction?.tableDynamicColumn,
    getRoutedData: tableAction?.getReportTable,
  },
);

export default connector(ReviewerPatientClient);
