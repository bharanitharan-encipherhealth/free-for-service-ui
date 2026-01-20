import React, { useState, useMemo, useCallback } from "react";
import { Select, Button, Space, Typography } from "antd";
import styles from "./style.module.css";

// Import react-window - using List component from react-window 2.x
import { List } from "react-window";

const { Option } = Select;
const { Text } = Typography;

type VirtualizedExcelPropsType = {
  data: { value: string }[][];
  height?: number | string;
  width?: string;
  showPagination?: boolean;
  pageSize?: number;
  rowHeight?: number;
};

export default function VirtualizedExcel({
  data,
  rowHeight = 35,
  width = "100%",
  height = "600",
  showPagination = true,
  pageSize: initialPageSize = 100,
}: VirtualizedExcelPropsType) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Memoized data (no filtering or sorting)
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    return data;
  }, [data]);

  // Pagination (exclude header row from pagination)
  const dataRows = processedData.length > 1 ? processedData.slice(1) : [];
  const totalPages = Math.ceil(dataRows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = dataRows.slice(startIndex, endIndex);

  // Get header row (first row of entire dataset)
  const headerRow = processedData.length > 0 ? processedData[0] : null;

  // Header row component
  const renderHeaderRow = useCallback(() => {
    if (!headerRow || !Array.isArray(headerRow)) return null;

    return (
      <div className={styles.excelHeaderRow} style={{ minHeight: rowHeight }}>
        {headerRow.map((cell, colIndex) => (
          <div
            key={colIndex}
            className={styles.excelHeaderCell}
            title={String(cell?.value || "")}
          >
            {cell?.value ?? ""}
          </div>
        ))}
      </div>
    );
  }, [headerRow, rowHeight]);

  // Row component for react-window List
  const RowComponent = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const row = paginatedData[index];
      if (!Array.isArray(row)) return null;

      return (
        <div className={styles.excelRow} style={style}>
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={styles.excelCell}
              title={String(cell?.value || "")}
            >
              {cell?.value ?? ""}
            </div>
          ))}
        </div>
      );
    },
    [paginatedData]
  );

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className={styles.noDataContainer}>No data available</div>;
  }

  // Calculate actual height for the data area
  const paginationHeight = showPagination && totalPages > 1 ? 80 : 0;
  const dataHeight =
    typeof height === "string" && height.includes("%")
      ? `calc(${height} - ${paginationHeight}px)`
      : typeof height === "number"
      ? height - paginationHeight
      : typeof height === "string"
      ? parseInt(height, 10) - paginationHeight
      : 600 - paginationHeight;

  return (
    <div className={styles.excelContainer} style={{ width, height }}>

      {renderHeaderRow()}

      <div className={styles.dataContainer} style={{ height: dataHeight }}>
        <List<Record<string, never>>
          rowCount={paginatedData.length}
          rowHeight={rowHeight}
          rowComponent={RowComponent}
          rowProps={{}}
          style={{ 
            width: "100%",
            height: typeof dataHeight === "string" ? dataHeight : `${dataHeight}px`
          }}
        />
      </div>

      {showPagination && totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <Space>
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              size="small"
            >
              First
            </Button>
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              size="small"
            >
              Previous
            </Button>
            <Text>
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              size="small"
            >
              Next
            </Button>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              size="small"
            >
              Last
            </Button>
          </Space>
          <Select
            value={String(pageSize)}
            onChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}
            className={styles.paginationSelect}
            size="small"
            dropdownStyle={{ zIndex: 10000 }}
            placement="topLeft"
          >
            <Option value="50">50 rows</Option>
            <Option value="100">100 rows</Option>
            <Option value="200">200 rows</Option>
            <Option value="500">500 rows</Option>
          </Select>
        </div>
      )}
    </div>
  );
}
