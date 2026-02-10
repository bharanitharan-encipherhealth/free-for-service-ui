"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { Button, Modal } from "antd";
import ContentLayout from "@/components/layout/ContentLayout/page";

import { actions as ReportAction } from "@/state/tenantadmin/report";
import {
  getReportTableCallResponseType,
  ReportPropsType,
} from "@/models/tenantadmin/report";
import reportReducerType from "@/state/tenantadmin/report/model";
import { findMatchesByField, generateHeaderTab } from "@/util/reusableFunction";
import { actions as tableAction } from "@/state/table";
import TableViewType, { metaDataType } from "@/state/table/model";
import ReusableFilters from "@/components/ReusbaleFilter";
import { DateRange } from "@/models/reusableFilter";
import ReusableTable from "@/components/ReusabelTable";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import { handleRowCheckboxChangeType } from "@/models/ReusabelTable";
import { tableCall } from "@/state/table/network";
import * as XLSX from "xlsx";
import { IoMdClose } from "react-icons/io";
import VirtualizedExcel from "@/components/ExcelReport/index";

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
  const [pageNo, setPageNo] = useState(0);
  const [selectedOption, setSelectedOption] = useState<Record<string, string>>(
    {},
  );
  const [searchText, setSearchText] = useState<Record<string, string>>({});

  const [activeFilters, setActiveFilters] = useState<metaDataType[]>([]);
  const [selectedDates, setSelectedDates] = useState({});
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [row, setRow] = useState<number>(15);
  const [checkedLoader, setCheckedLoader] = useState<boolean>(false);

  const handleTabChange = useCallback(
    ({ item }: { item: { label: string; value: string } }) => {
      setActiveTab(item?.value);
    },
    [activeTab, setActiveTab],
  );
  const [selectedDateRanges, setSelectedDateRanges] = useState<
    Record<string, DateRange>
  >({});
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
  const [loading, setLoading] = useState(false);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [reportData, setReportData] = useState<{ value: string }[][]>([]);
  const [viewModelOpen, setViewModelOpen] = useState<boolean>(false);
  const [excelLoading, setExcelLoading] = useState<boolean>(false);
  const [excelError, setExcelError] = useState<string | null>(null);

  const handleReportDownload = async () => {
    setLoading(true);
    try {
      const patientType =
        activeTab == "In-patient" ? "INPATIENT" : "OUTPATIENT";

      const response = await getReportDownload({
        formData: selectedRows,
        patientType,
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      let filename;
      if (selectedRows.length > 1) {
        filename = `Reports_${new Date().toISOString().split("T")[0]}.zip`;
      } else {
        filename = selectedRows[0] || `Report.xlsx`;
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
        isToolTip: true,
        toolTip: "Choose atleast one file to download the report.",
        btnTitle: "Export",
        onClick: () => handleReportDownload(),
        disable: selectedRows?.length <= 0,
        loading,
      },
    ];
  }, [tableData, tableLoader, loading, selectedRows, handleReportDownload]);

  const tabList = useMemo(() => {
    return {
      isTab: true,
      tabList: generateHeaderTab({ tabList: reportTabList?.tabMenuList2 }),
      loading: reportTabListLoading,
      activeTab,
      onClick: ({ item }: { item: { label: string; value: string } }) =>
        handleTabChange({ item }),
    };
  }, [reportTabList, handleTabChange, reportTabListLoading, activeTab]);

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
  }: handleRowCheckboxChangeType) => {
    if (!singleCheck) {
      if (checked) {
        setCheckedLoader(true);
        const patientType =
          activeTab == "In-patient" ? "INPATIENT" : "OUTPATIENT";
        const response = await tableCall({
          patientType: patientType,
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
          prev.filter((item) => item != row?.azureBlobPath),
        );
      }
    }
  };

  const getReportTable = useCallback(async () => {
    const patientType = activeTab == "In-patient" ? "INPATIENT" : "OUTPATIENT";
    const res = await getReportTableCall({
      patientType,
      searchText,
      dateRange: selectedDateRanges?.batchDate,
      pageNo,
    });
  }, [activeTab, getReportTableCall, searchText, selectedDateRanges, pageNo]);

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

      // Format data efficiently
      const formattedData = jsonData.map((row) => {
        // Ensure row is an array and pad with empty cells if needed
        const paddedRow = Array.isArray(row) ? row : [];
        return paddedRow.map((cell) => ({
          value: cell !== null && cell !== undefined ? String(cell) : "",
        }));
      });

      // Save the full data in state
      setReportData(formattedData);
    } catch (err) {
      console.error("Error loading Excel:", err);
      setExcelError("Failed to load Excel file. Please try again.");
    } finally {
      setExcelLoading(false);
    }
  }, []);

  const onPageChange = useCallback(
    (e: PaginatorPageChangeEvent) => {
      setPaginationFirst(e.first);
      setPageNo(e.page);
    },
    [setPaginationFirst, setPageNo],
  );

  useEffect(() => {
    if (
      tableData?.amMetaData ||
      !findMatchesByField(activeFilters, tableData?.amMetaData)
    ) {
      setActiveFilters(
        tableData?.amMetaData.filter(
          (item) => item.columnActive && item?.filter?.style,
        ),
      );
    }
  }, [tableData?.amMetaData]);

  useEffect(() => {
    if (activeTab) {
      getReportTable();
    }
  }, [pageNo, selectedOption, searchText, selectedDateRanges, sort, activeTab]);
  useEffect(() => {
    getReportTab();
  }, []);
  return (
    <>
      <ContentLayout
        pageTitle="Report"
        tabList={tabList}
        layoutList={layoutList}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
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
          //customize table
          tableLoader={tableLoader}
        />

        <ReusableTable
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
        height={"90dvh"}
        title={
          <div className="flex items-center content-center w-100">
            <div>View</div>
          </div>
        }
        footer={null}
      >
        <div style={{ height: "80vh", width: "100%" }}>
          {excelLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div style={{ color: "var(--excel-text-secondary)" }}>
                Loading Excel data...
              </div>
            </div>
          ) : excelError ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div
                style={{
                  color: "var(--excel-error-color)",
                  fontSize: "18px",
                }}
              >
                ⚠️
              </div>
              <div
                style={{
                  color: "var(--excel-error-color)",
                  textAlign: "center",
                }}
              >
                {excelError}
              </div>
              <Button
                type="primary"
                onClick={() => setExcelError(null)}
                size="small"
              >
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                color: "var(--excel-text-muted)",
              }}
            >
              No data to display
            </div>
          )}
        </div>
      </Modal>
    </>
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
