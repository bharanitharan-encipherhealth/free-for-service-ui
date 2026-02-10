import { metaDataType } from "@/state/table/model";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReusableFilters from "@/components/ReusbaleFilter";
import { connect, ConnectedProps } from "react-redux";
import projectReducerType from "@/state/tenantadmin/project/model";
import {
  bachInfoPramsType,
  bacthTableType,
} from "@/models/tenantadmin/project/batch";
import { actions as projectAction } from "@/state/tenantadmin/project";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import ReusableTable from "@/components/ReusabelTable";
import { formatDateTime } from "@/util/reusableFunction";
import PageHeaderLayout from "@/components/layout/pageHeaderLayout/page";
import { productivityContentArrayType } from "@/models/tenantadmin/tin/patients";
import { setStorage } from "@/util/storage";
import { actions as tableAction } from "@/state/table";
import { useRouter } from "next/navigation";
import { notification } from "antd";

type BatchReduxProps = ConnectedProps<typeof connector>;

type BacthPropsType = bachInfoPramsType & BatchReduxProps;
function BatchDetails({
  getBatchInfoDetails,
  bacthInfo,
  tableData,
  tableLoader,
  setViewDetailedBatch,
  getRoutedData,
}: BacthPropsType) {
  const route = useRouter();
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
    ],
    [],
  );

  const bactchInfoDetails = useMemo(
    () => [
      {
        title: "Batch Details",
        value: bacthInfo?.name || "",
      },
      {
        title: "Count",
        value: bacthInfo?.totalFileCount || "",
      },
      {
        title: "Initiated By",
        value: bacthInfo?.createdDate || "",
      },
      {
        title: "Batch Initiated",
        value: bacthInfo?.createdDate
          ? formatDateTime({ date: bacthInfo?.createdDate, formatType: "time" })
          : "---",
      },
      {
        title: "Status",
        value: bacthInfo?.batchUploadStatus
          ? bacthInfo?.batchUploadStatus
          : "---",
      },
    ],
    [bacthInfo],
  );

  const [activeFilters, setActiveFilters] =
    useState<metaDataType[]>(batchFilterColumn);
  const [searchText, setSearchText] = useState<Record<string, string>>({});
  const [pageNo, setPageNo] = useState(0);
  const [columnData, setColumnData] = useState<metaDataType[]>([]);
  const [paginationFirst, setPaginationFirst] = useState(0);

  const onPageChange = useCallback(
    (e: PaginatorPageChangeEvent) => {
      setPaginationFirst(e.first);
      setPageNo(e.page);
    },
    [setPaginationFirst, setPageNo],
  );

  const getAllBatchInfo = useCallback(async () => {
    await getBatchInfoDetails({
      batchId: bacthInfo?.id,
      search: searchText?.search || "",
      page: pageNo,
    });
  }, [getBatchInfoDetails, bacthInfo, searchText, pageNo]);

  const onHandleBack = useCallback(() => {
    setViewDetailedBatch({ status: false, data: null });
  }, [setViewDetailedBatch]);

  useEffect(() => {
    getAllBatchInfo();
  }, [searchText, pageNo]);

  useEffect(() => {
    const column = [
      {
        headerName: "MRN",
        columnActive: true,
        actualField: "mrNumber",
        filter: null,
        active: true,
      },
      {
        headerName: "Patient Name",
        columnActive: true,
        actualField: "patientName",
        filter: null,
        active: true,
      },
      {
        headerName: "Patient Type",
        columnActive: true,
        actualField: "patientType",
        filter: null,
        active: true,
      },
      {
        headerName: "Processed Date & Time",
        columnActive: true,
        actualField: "createdDate",
        filter: null,
        active: true,
        design: "DATE_TIME",
      },
      {
        headerName: "Status",
        columnActive: true,
        actualField: "percentage",
        design: ["PROGRESS_BAR"],
        filter: null,
        active: true,
      },
    ];
    setColumnData(column);
  }, [tableData]);

  const params = {
    pageNo,
    paginationFirst,
    activeFilters,
    searchText,
  };

  const goToPatientDetails = useCallback(
    ({ record }: { record: productivityContentArrayType }) => {
      if (record?.processStage === "FINISHED") {
        const controller = new AbortController();
        controller.abort();
        setStorage("patientId", record?.patientId);
        setStorage("routeBackTo", "/tenantadmin/project");
        getRoutedData(params);
        route.push("/tenantadmin/patientsync/batchfilesview");
      } else {
        notification.warning({
          message: record?.patientName + " file not processed. Please wait!",
        });
      }
    },
    [getRoutedData, params, route],
  );

  return (
    <>
      <PageHeaderLayout
        data={bactchInfoDetails}
        onHandleBack={onHandleBack}
        loading={false}
      />
      <div className="content mt-2">
        <ReusableFilters
          showFilter={false}
          setActiveFilters={setActiveFilters}
          FilterItems={activeFilters}
          activeFilters={activeFilters}
          setSearchText={setSearchText}
          searchText={searchText}
          tableLoader={false}
        />

        <ReusableTable
          data={tableData?.content}
          column={columnData}
          loader={tableLoader}
          first={pageNo === 0 ? 0 : paginationFirst}
          totalRecords={tableData?.totalElements}
          onPageChange={onPageChange}
          isPagination
          count={30}
          onRowClick={goToPatientDetails}
        />
      </div>
    </>
  );
}

const connector = connect(
  (state: { projectReducer: projectReducerType<bacthTableType> }) => ({
    tableData: state?.projectReducer?.allBatchInfo?.data?.response,
    tableLoader: state?.projectReducer?.allBatchInfoLoading,
  }),
  {
    getBatchInfoDetails: projectAction.getBatchInfo,
    getRoutedData: tableAction?.getReportTable,
  },
);

export default connector(BatchDetails);
