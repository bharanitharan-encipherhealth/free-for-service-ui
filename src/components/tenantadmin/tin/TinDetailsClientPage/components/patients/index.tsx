import React, { useCallback, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";

import { actions as tableAction } from "@/state/table";
import {
  tinPatientsTabType,
  tinPatientTableResposneType,
  productivityContentArrayType,
} from "@/models/tenantadmin/tin/patients";
import { patientPageId } from "@/util/pageIds";
import { getStorage, setStorage } from "@/util/storage";
import TableViewType, { SortType } from "@/state/table/model";
import ReusableFilters from "@/components/ReusbaleFilter";
import ReusableTable from "@/components/ReusabelTable";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import { useRouter } from "next/navigation";
import { notification } from "antd";

type patientTabReduxType = ConnectedProps<typeof connector>;

type patientTabProps = tinPatientsTabType & patientTabReduxType;
function PatientsTab({
  activeFilters,
  setActiveFilters,
  getTableView,
  tableData,
  tableLoader,
  triggerTableCustomization,
  setTriggerTableCustomization,
  getRoutedData,
}: patientTabProps) {
  const route = useRouter();
  const tin = getStorage("tinNumber");
  const [selectedOption, setSelectedOption] = useState<Record<string, string>>(
    {},
  );
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [searchText, setSearchText] = useState<Record<string, string>>({});
  const [pageNo, setPageNo] = useState(0);
  const [sort, setSort] = useState<SortType>({
    computedDate: {
      sortDir: "DESC",
      sortField: "computedDate",
    },
  });
  const [selectedDates, setSelectedDates] = useState({});
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [row, setRow] = useState<number>(15);

  const onPageChange = useCallback(
    (e: PaginatorPageChangeEvent) => {
      setPaginationFirst(e.first);
      setPageNo(e.page);
    },
    [setPaginationFirst, setPageNo],
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

  const getAllPatients = useCallback(async () => {
    await getTableView({
      pageId: patientPageId,
      pageNo,
      pageSize: 15,
      roleId: "",
      tin,
      isAdmin: true,
      selectedOption,
      selectedDateRanges,
      searchText,
      sort,
    });
    setTriggerTableCustomization((prev) => ({ ...prev, patients: false }));
  }, [
    pageNo,
    selectedOption,
    searchText,
    selectedDateRanges,
    sort,
    getTableView,
    tin,
    setTriggerTableCustomization,
  ]);

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
      console.log(record, "record");
      if (record?.computing === 2) {
        const controller = new AbortController();
        controller.abort();
        setStorage("patientId", record?.patientId);
        setStorage("routeBackTo", "/tenantadmin/tin/tindetails?tab=Patients");
        getRoutedData(params);
        route.push("/tenantadmin/tin/details");
      } else {
        notification.warning({
          message: record?.patientName + " file not processed. Please wait!",
        });
      }
    },
    [getRoutedData, params, route],
  );
  useEffect(() => {
    getAllPatients();
  }, [pageNo, selectedOption, searchText, selectedDateRanges, sort]);

  useEffect(() => {
    if (triggerTableCustomization?.patients) {
      getAllPatients();
    }
  }, [triggerTableCustomization?.patients]);

  return (
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

      <ReusableTable<productivityContentArrayType>
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
        onRowClick={goToPatientDetails}
      />
    </div>
  );
}

const connector = connect(
  (state: { tableView: TableViewType<tinPatientTableResposneType> }) => ({
    tableData: state?.tableView?.tableView?.data?.response,
    tableLoader: state?.tableView?.tableViewLoading,
  }),
  {
    getTableView: tableAction?.tabelViewCall,
    getRoutedData: tableAction?.getReportTable,
  },
);

export default connector(PatientsTab);
