"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import ContentLayout from "@/components/layout/ContentLayout/page";
import { actions as tableAction } from "@/state/table";
import { connect, ConnectedProps } from "react-redux";
import { activeTinPageId } from "@/util/pageIds";
import { getStorage, setStorage } from "@/util/storage";
import TableViewType, { metaDataType } from "@/state/table/model";
import { contentArrayType, tinTableResponse } from "@/models/tenantadmin/tin";
import { findMatchesByField } from "@/util/reusableFunction";
import ReusableFilters from "@/components/ReusbaleFilter";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import ReusableTable from "@/components/ReusabelTable";
import { usePathname, useRouter } from "next/navigation";

type TinClientComponentProps = ConnectedProps<typeof connector>;
function TinClientComponent({
  getTableView,
  tableCustomizationCall,
  tableData,
  tableLoader,
  getRoutedData,
}: TinClientComponentProps) {
  const projectId = getStorage("project");
  const router = useRouter();
  const [searchText, setSearchText] = useState<Record<string, string>>({});
  const [pageNo, setPageNo] = useState(0);

  const [sort, setSort] = useState({});
  const [tableCustomization, setTableCustomization] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<metaDataType[]>([]);

  const [selectedColumns, setSelectedColumns] = useState<metaDataType[]>([]);

  const [selectedOption, setSelectedOption] = useState<Record<string, string>>(
    {},
  );
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState({});
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [row, setRow] = useState<number>(15);
  const layoutList = useMemo(
    () => [
      { isFilter: true, data: tableData?.metaDataDTO, loading: tableLoader },
      {
        isBtn: true,
        btnTitle: "Table Customization",
        onClick: () => setTableCustomization(!tableCustomization),
        loading: tableLoader,
      },
    ],
    [tableData, tableLoader, setTableCustomization, tableCustomization],
  );

  const getAllTins = useCallback(async () => {
    await getTableView({
      pageId: activeTinPageId,
      pageNo,
      searchText,
      pageSize: 15,
      roleId: "",
      projectId: "test",
      allTinIds: false,
      sort,
    });
  }, [pageNo, sort, searchText, getTableView, projectId]);

  const handleInsert = useCallback(
    async ({ data }: { data: string[] }) => {
      const payload = {
        pageId: activeTinPageId,
        headerNames: data,
      };

      const res = await tableCustomizationCall({ payload });
      if (res?.status == "SUCCESS") {
        await getAllTins();
      }
    },
    [tableCustomizationCall, getAllTins],
  );
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
    paginationFirst,
    sort,
    selectedOption,
    searchText,
    selectedDateRanges,
    selectedDates,
    activeFilters,
  };

  const gotoPatientDetails = ({ record }: { record: contentArrayType }) => {
    getTableView({ reloadTrue: true });
    setStorage("tinNumber", record.tinNumber);
    setStorage("routeBackTo", "/tenantadmin/tin");
    setStorage("activeTabTin", "active");
    setStorage("tinId", record?.id);
    getRoutedData(params);
    router.push("/tenantadmin/tin/tindetails?tab=Patients");
  };

  useEffect(() => {
    getAllTins();
  }, [pageNo, sort, searchText]);

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
        pageTitle="Tenant"
        layoutList={layoutList}
        handleInsert={handleInsert}
        setTableCustomization={setTableCustomization}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        tableCustomization={tableCustomization}
        tableCustomizationData={selectedColumns}
        setSelectedColumns={setSelectedColumns}
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
          onRowClick={gotoPatientDetails}
        />
      </div>
    </>
  );
}

const connector = connect(
  (state: { tableView: TableViewType<tinTableResponse> }) => ({
    tableData: state?.tableView?.tableView?.data?.response,
    tableLoader: state?.tableView?.tableViewLoading,
  }),
  {
    getTableView: tableAction?.tabelViewCall,
    tableCustomizationCall: tableAction?.tableDynamicColumn,
    getRoutedData: tableAction?.getReportTable,
  },
);

export default connector(TinClientComponent);
