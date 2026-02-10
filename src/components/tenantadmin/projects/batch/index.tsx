import { metaDataType } from "@/state/table/model";
import ReusableFilters from "@/components/ReusbaleFilter";
import { useCallback, useEffect, useMemo, useState } from "react";
import { connect, ConnectedProps } from "react-redux";

import { actions as projectAction } from "@/state/tenantadmin/project";
import { DateRange } from "@/models/reusableFilter";
import {
  bacthContentArrayType,
  bacthTableType,
} from "@/models/tenantadmin/project/batch";
import projectReducerType from "@/state/tenantadmin/project/model";
import ReusableTable from "@/components/ReusabelTable";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import BatchDetails from "./batchDetails";

type BatchReduxProps = ConnectedProps<typeof connector>;
function Batch({ getBatchTable, tableData, tableLoader }: BatchReduxProps) {
  const batchFilterColumn: metaDataType[] = useMemo(
    () => [
      {
        active: true,
        actualField: "search",
        columnActive: true,
        design: [],
        filter: { filter: "", style: "SEARCH", options: [], nameOptions: [] },
        headerName: "Search by Name",
        orderValue: 1,
      },
      {
        headerName: "Date",
        actualField: "computedDate",
        active: true,
        columnActive: true,
        design: ["DATE"],
        filter: {
          style: "DATE",
          options: [],
          nameOptions: [],
          filter: "",
        },
        orderValue: 2,
      },
      {
        active: true,
        actualField: "status",
        columnActive: true,
        filter: {
          filter: "",
          style: "DROP_DOWN",
          options: [],
          nameOptions: [
            { name: "Processed", id: "PROCESSED" },
            { name: "Processing", id: "PROCESSING" },
            { name: "Not Processed", id: "NOTPROCESSED" },
          ],
        },
        headerName: "Status",
        orderValue: 3,
        design: ["COMPUTATION_STATUS"],
      },
    ],
    [],
  );

  const [activeFilters, setActiveFilters] =
    useState<metaDataType[]>(batchFilterColumn);

  const [searchText, setSearchText] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<Record<string, string>>(
    {},
  );
  const [selectedDateRanges, setSelectedDateRanges] = useState<
    Record<string, DateRange>
  >({});
  const [selectedDates, setSelectedDates] = useState({});
  const [pageNo, setPageNo] = useState(0);

  const [columnData, setColumnData] = useState<metaDataType[]>([]);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [row, setRow] = useState<number>(15);

  const [showBatchDetails, setShowBatchDetails] = useState<{
    status: boolean;
    data: null | bacthContentArrayType;
  }>({
    status: false,
    data: null,
  });

  const onPageChange = useCallback(
    (e: PaginatorPageChangeEvent) => {
      setPaginationFirst(e.first);
      setPageNo(e.page);
    },
    [setPaginationFirst, setPageNo],
  );

  const handleRowChange = ({ value }: { value: number }) => {
    const totalRecords = tableData?.totalElements || 0;

    const newTotalPages = Math.ceil(totalRecords / value);

    setRow(value);

    if (pageNo >= newTotalPages && newTotalPages > 0) {
      setPageNo(newTotalPages - 1);
      setPaginationFirst((newTotalPages - 1) * value);
    }
  };

  const getBatchTableCall = useCallback(async () => {
    const table = await getBatchTable({
      page: pageNo,
      search: searchText?.search,
      batchUploadStatus: selectedOption?.status,
      startDate: selectedDateRanges?.computedDate?.startDate,
      endDate: selectedDateRanges?.computedDate?.endDate,
    });
  }, [getBatchTable, selectedOption, searchText, pageNo, selectedDateRanges]);

  const handleRowClick = ({ record }: { record: bacthContentArrayType }) => {
    setShowBatchDetails({ status: true, data: record });
  };

  useEffect(() => {
    getBatchTableCall();
  }, [searchText, selectedOption, selectedDateRanges, pageNo]);

  useEffect(() => {
    const column = [
      {
        headerName: "Batch Name",
        columnActive: true,
        actualField: "name",
        active: true,
        design: [""],
      },
      {
        headerName: "Count",
        columnActive: true,
        actualField: "totalFileCount",
        active: true,
        design: ["fileCount"],
      },
      {
        headerName: "Initiated Date & Time",
        columnActive: true,
        actualField: "createdDate",
        design: ["DATE_TIME"],
        active: true,
      },
      {
        headerName: "Processed Date & Time",
        columnActive: true,
        actualField: "endTime",
        active: true,
        design: ["DATE_TIME"],
      },
      {
        headerName: "Status",
        columnActive: true,
        actualField: "batchUploadStatus",
        design: ["COMPUTATION_STATUS"],
        active: true,
      },
    ];
    setColumnData(column);
  }, [tableData]);

  return (
    <>
      {showBatchDetails.status ? (
        <BatchDetails
          bacthInfo={showBatchDetails?.data}
          setViewDetailedBatch={setShowBatchDetails}
        />
      ) : (
        <div className="content">
          <ReusableFilters
            showFilter={false}
            setActiveFilters={setActiveFilters}
            setSearchText={setSearchText}
            searchText={searchText}
            setSelectedOption={setSelectedOption}
            selectedOption={selectedOption}
            setSelectedDateRanges={setSelectedDateRanges}
            FilterItems={activeFilters}
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            activeFilters={activeFilters}
            setPageNo={setPageNo}
            tableLoader={tableLoader}
          />

          <ReusableTable
            data={tableData?.content}
            column={columnData}
            loader={tableLoader}
            first={pageNo === 0 ? 0 : paginationFirst}
            totalRecords={tableData?.totalElements}
            row={row}
            onPageChange={onPageChange}
            isPagination
            isRowSizabel={false}
            count={30}
            handleRowChange={handleRowChange}
            onRowClick={handleRowClick}
          />
        </div>
      )}
    </>
  );
}

const connector = connect(
  (state: { projectReducer: projectReducerType<bacthTableType> }) => ({
    tableData: state?.projectReducer?.allBatches?.data?.response,
    tableLoader: state?.projectReducer?.allBatchesLoad,
  }),
  {
    getBatchTable: projectAction?.getAllBatches,
  },
);

export default connector(Batch);
