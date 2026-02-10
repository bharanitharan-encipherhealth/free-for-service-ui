import ReusableFilters from "@/components/ReusbaleFilter";
import ReusableTable from "@/components/ReusabelTable";
import { getStorage, setStorage } from "@/util/storage";
import { useCallback, useEffect, useState } from "react";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import { findMatchesByField } from "@/util/reusableFunction";
import { patientProjectPageId } from "@/util/pageIds";
import { patientCallingProps } from "@/models/tenantadmin/project/patient";
import { connect, ConnectedProps } from "react-redux";
import { productivitytabelResposne } from "@/models/tenantadmin/productivity/page";
import TableViewType from "@/state/table/model";

import { actions as tableAction } from "@/state/table";
import { productivityContentArrayType } from "@/models/tenantadmin/tin/patients";
import { notification } from "antd";
import { useRouter } from "next/navigation";

type PatientReduxProps = ConnectedProps<typeof connector>;

type Props = patientCallingProps & PatientReduxProps;

function Patients({
  activeFilters,
  setActiveFilters,
  setSelectedColumns,
  tableLoader,
  tableData,
  setInsertTable,
  insertTable,

  getTableView,
  getRoutedData,
}: Props) {
  const route = useRouter();
  const tin = getStorage("tinNumber");
  const [pageNo, setPageNo] = useState(0);
  const [sort, setSort] = useState({
    computedDate: {
      sortDir: "DESC",
      sortField: "computedDate",
    },
    createdDate: {
      sortDir: "DESC",
      sortField: "createdDate",
    },
    sort: { sortDir: "DESC", sortField: "" },
  });
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [searchText, setSearchText] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<Record<string, string>>(
    {},
  );
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState({});
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
        setStorage("routeBackTo", "/tenantadmin/project");
        getRoutedData(params);
        route.push("/tenantadmin/project/details");
      } else {
        notification.warning({
          message: record?.patientName + " file not processed. Please wait!",
        });
      }
    },
    [getRoutedData, params, route],
  );

  const getPatients = useCallback(async () => {
    const pageId = patientProjectPageId;
    const response = await getTableView({
      pageId,
      pageNo,
      pageSize: row,
      roleId: "",
      tin,
      // patientAllocated: userId,
      isAdmin: true,
      selectedOption,
      selectedDateRanges,
      searchText,
      sort,
    });
    if (response?.status == "SUCCESS" && insertTable == "Patients") {
      setInsertTable("");
    }
  }, [
    pageNo,
    tin,
    selectedOption,
    selectedDateRanges,
    searchText,
    sort,
    getTableView,
    row,
    insertTable,
    setInsertTable,
  ]);

  useEffect(() => {
    getPatients();
  }, [pageNo, selectedOption, searchText, selectedDateRanges, sort, row]);
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

  useEffect(() => {
    if (insertTable == "Patients") getPatients();
  }, [insertTable]);
  return (
    <>
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
        onRowClick={goToPatientDetails}
      />
    </>
  );
}

const connector = connect(
  (state: { tableView: TableViewType<productivitytabelResposne> }) => ({
    tableData: state?.tableView?.tableView?.data?.response,
    tableLoader: state?.tableView?.tableViewLoading,
  }),
  {
    getTableView: tableAction?.tabelViewCall,
    getRoutedData: tableAction?.getReportTable,
  },
);

export default connector(Patients);
