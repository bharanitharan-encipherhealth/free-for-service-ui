"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { Button, Modal } from "antd";
import ContentLayout from "@/components/layout/ContentLayout/page";

import { actions as ReportAction } from "@/state/tenantadmin/report";
import {
  getReportTableCallResponseType,
  ReportPropsType,
  resposeDataArrayType,
} from "@/models/tenantadmin/report";
import reportReducerType from "@/state/tenantadmin/report/model";
import { findMatchesByField } from "@/util/reusableFunction";
import { actions as tableAction } from "@/state/table";
import TableViewType, { metaDataType, SortType } from "@/state/table/model";
import ReusableFilters from "@/components/ReusbaleFilter";
import { DateRange } from "@/models/reusableFilter";
import ReusableTable from "@/components/ReusabelTable";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import { handleRowCheckboxChangeType } from "@/models/ReusabelTable";
import { tableCall } from "@/state/table/network";
import * as XLSX from "xlsx";
import VirtualizedExcel from "@/components/ExcelReport/index";
import style from "@/components/layout/ContentLayout/style.module.css";

function Report({
  getReportTabs,
  reportTabList,
  reportTabListLoading,
  getReportTableCall,
  tableData,
  tableLoader,
  getReportDownload,
  getReportCall,
}: ReportPropsType) {
  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedPatientType, setSelectedPatientType] = useState<"INPATIENT" | "OUTPATIENT">("INPATIENT");
  const [pageNo, setPageNo] = useState(0);
  const [selectedOption, setSelectedOption] = useState<
    Record<string, string | string[]>
  >({});
  const [searchText, setSearchText] = useState<Record<string, string>>({});

  const [activeFilters, setActiveFilters] = useState<metaDataType[]>([]);
  const [selectedDates, setSelectedDates] = useState({});
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [row, setRow] = useState<number>(15);
  const [checkedLoader, setCheckedLoader] = useState<boolean>(false);

  const [selectedDateRanges, setSelectedDateRanges] = useState<
    Record<string, DateRange>
  >({});
  const [sort, setSort] = useState<SortType>({
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
  const [loading, setLoading] = useState(false);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [reportData, setReportData] = useState<{ value: string }[][]>([]);
  const [viewModelOpen, setViewModelOpen] = useState<boolean>(false);
  const [excelLoading, setExcelLoading] = useState<boolean>(false);
  const [excelError, setExcelError] = useState<string | null>(null);

  const handleReportDownload = async () => {
    setLoading(true);
    try {
      const response = await getReportDownload({
        formData: selectedRows,
        patientType: selectedPatientType,
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      let filename;
      if (selectedRows.length > 1) {
        filename = `Reports_${selectedPatientType}_${new Date().toISOString().split("T")[0]}.zip`;
      } else {
        filename = selectedRows[0] || `Report_${selectedPatientType}.xlsx`;
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const layoutList = useMemo(() => {
    return [
      {
        isFilter: true,
        loading: false,
      },
      {
        isToolTip: true,
        toolTip: "Choose atleast one file to download the report.",
        btnTitle: "Export",
        onClick: () => handleReportDownload(),
        disable: selectedRows?.length <= 0,
        loading,
      },
    ];
  }, [tableData, tableLoader, loading, selectedRows, handleReportDownload]);

  const getReportTab = async () => {
    const res = await getReportTabs();
    if (res?.status == "SUCCESS") {
      setActiveTab(res?.response?.tabMenuList2?.[0]);
    }
  };

  const handleRowChange = ({ value }: { value: number }) => {
    const totalRecords = tableData?.totalElements || 0;
    const newTotalPages = Math.ceil(totalRecords / value);
    setRow(value);
    if (pageNo >= newTotalPages && newTotalPages > 0) {
      setPageNo(newTotalPages - 1);
      setPaginationFirst((newTotalPages - 1) * value);
    }
  };

  const handleRowCheckboxChange = async ({
    e,
    row,
    singleCheck,
    checked,
  }: handleRowCheckboxChangeType<resposeDataArrayType>) => {
    if (!singleCheck) {
      if (checked) {
        setCheckedLoader(true);
        const response = await tableCall({
          patientType: selectedPatientType,
          searchText,
          dateRange: selectedDateRanges?.batchDate,
          pageNo: 0,
          allAzureBlobPath: true,
        });
        if (response?.status === "SUCCESS") {
          const result = response?.response?.data[0]?.allAzureBlobPath.map(
            (azureBlobPath: { azureBlobPath: string }) =>
              azureBlobPath?.azureBlobPath,
          );
          setSelectedRows(result);
        }
        setCheckedLoader(false);
      } else {
        setSelectedRows([]);
      }
    } else {
      if (e.target?.checked) {
        setSelectedRows((prev) => [...prev, row.azureBlobPath]);
      } else {
        setSelectedRows((prev) =>
          prev.filter((item) => item !== row?.azureBlobPath),
        );
      }
    }
  };

  const getReportTable = useCallback(async () => {
    await getReportTableCall({
      patientType: selectedPatientType,
      searchText,
      dateRange: selectedDateRanges?.batchDate,
      pageNo,
    });
  }, [selectedPatientType, getReportTableCall, searchText, selectedDateRanges, pageNo]);

  const generateViewReport = useCallback(async ({ item }: { item: string }) => {
    setViewModelOpen(true);
    setExcelLoading(true);
    setExcelError(null);
    setReportData([]);

    try {
      const res = await getReportCall({ blobId: item });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const blob = await res.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, {
        type: "array",
        cellDates: true,
        cellNF: false,
        cellText: false,
      });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error("No sheets found in the Excel file");
      }

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        raw: false,
        dateNF: "dd-mm-yyyy",
      });

      if (!jsonData || jsonData.length === 0) {
        throw new Error("No data found in the Excel file");
      }

      const formattedData = jsonData.map((row) => {
        const paddedRow = Array.isArray(row) ? row : [];
        return paddedRow.map((cell) => ({
          value: cell !== null && cell !== undefined ? String(cell) : "",
        }));
      });

      setReportData(formattedData);
    } catch (err) {
      console.error("Error loading Excel:", err);
      setExcelError("Failed to load Excel file. Please try again.");
    } finally {
      setExcelLoading(false);
    }
  }, [getReportCall]);

  const onPageChange = useCallback(
    (e: PaginatorPageChangeEvent) => {
      setPaginationFirst(e.first);
      setPageNo(e.page);
    },
    [setPaginationFirst, setPageNo],
  );

  useEffect(() => {
    if (
      tableData?.amMetaData && activeFilters?.length === 0
    ) {
      setActiveFilters(
        tableData?.amMetaData?.filter(
          (item) => item.columnActive && item?.filter?.style,
        ) || [],
      );
    }
  }, [tableData?.amMetaData, activeFilters]);

  useEffect(() => {
    getReportTable();
  }, [pageNo, selectedOption, searchText, selectedDateRanges, sort, selectedPatientType, getReportTable]);

  useEffect(() => {
    getReportTab();
  }, []);

  return (
    <div>
      <ContentLayout
        pageTitle="Report"
        layoutList={layoutList}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />
      
      <div className="flex justify-center w-full py-4">
          <div className={style.pillContainer}>
              <div
                  className={`${style.pillItem} ${selectedPatientType === "INPATIENT" ? style.pillItemActive : ""}`}
                  onClick={() => {
                      setSelectedPatientType("INPATIENT");
                      setPageNo(0);
                      setPaginationFirst(0);
                  }}
              >
                  Inpatient
              </div>
              <div
                  className={`${style.pillItem} ${selectedPatientType === "OUTPATIENT" ? style.pillItemActive : ""}`}
                  onClick={() => {
                      setSelectedPatientType("OUTPATIENT");
                      setPageNo(0);
                      setPaginationFirst(0);
                  }}
              >
                  Outpatient
              </div>
          </div>
      </div>

      <div className="content py-0">
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

        <ReusableTable<resposeDataArrayType>
          data={tableData?.data}
          column={tableData?.amMetaData?.filter(
            (item) => item?.active && item?.columnActive,
          )}
          loader={tableLoader}
          setSort={setSort}
          sort={sort}
          first={pageNo === 0 ? 0 : paginationFirst}
          totalRecords={tableData?.totalElements}
          row={row}
          onPageChange={onPageChange}
          isPagination={true}
          isRowSizabel={true}
          count={30}
          handleRowChange={handleRowChange}
          isCheckBox={{ show: true, value: "azureBlobPath" }}
          handleRowCheckboxChange={handleRowCheckboxChange}
          selectedRows={selectedRows}
          checkedHeader={selectedRows?.length === tableData?.totalElements}
          checkedLoader={checkedLoader}
          isBtnShow={{
            show: true,
            value: "View",
            title: "View",
            onClick: ({ item }: { item: string }) =>
              generateViewReport({ item }),
            id: "azureBlobPath",
          }}
        />
      </div>

      <Modal
        open={viewModelOpen}
        onCancel={() => {
          setViewModelOpen(false);
          setReportData([]);
          setExcelError(null);
          setExcelLoading(false);
        }}
        centered
        width={"100%"}
        style={{ top: 20 }}
        title={
          <div className="flex items-center content-center w-100">
            <div className="text-[#03512E] font-bold">View Report</div>
          </div>
        }
        footer={null}
      >
        <div style={{ height: "80vh", width: "100%" }}>
          {excelLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#03512E]"></div>
              <div className="text-gray-500">Loading Excel data...</div>
            </div>
          ) : excelError ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="text-red-500 text-2xl">⚠️</div>
              <div className="text-red-500 text-center">{excelError}</div>
              <Button type="primary" onClick={() => setExcelError(null)} className="bg-[#03512E] border-none rounded-lg">
                Try Again
              </Button>
            </div>
          ) : reportData && reportData.length > 0 ? (
            <VirtualizedExcel
              data={reportData}
              height={800}
              width="100%"
              showPagination={true}
              pageSize={100}
              rowHeight={40}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No data to display
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

const connector = connect(
  (state: {
    reportReducer: reportReducerType;
    tableView: TableViewType<getReportTableCallResponseType>;
  }) => ({
    reportTabList: state?.reportReducer?.reportTabsList?.data?.response,
    reportTabListLoading: state?.reportReducer?.reportTabListLoading,
    tableData: state?.tableView?.reportTable?.data?.response,
    tableLoader: state?.tableView?.reportTableLoader,
  }),
  {
    getReportTabs: ReportAction?.reportTabList,
    getReportTableCall: tableAction?.getReportTable,
    getReportDownload: ReportAction?.getReportDownload,
    getReportCall: ReportAction?.getReportCall,
  },
);
export default connector(Report);
