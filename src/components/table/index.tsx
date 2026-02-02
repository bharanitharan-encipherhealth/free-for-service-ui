import React from "react";
import { Empty, Progress } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { getColorValue } from "@/util/reusableFunction";

/* =========================
   TYPES
========================= */

export interface TableColumn<T = any> {
  title: string;
  dataIndex: keyof T | string;
  className?: string;
  isProgress?: boolean;
}

export interface ReusableTableProps<T = any> {
  items: T[];
  tableKey?: string;
  title?: string;
  columns: TableColumn<T>[];
}

/* =========================
   COMPONENT
========================= */

const ReusableTable = <T extends Record<string, any>>({
  items = [],
  tableKey,
  title,
  columns = [],
}: ReusableTableProps<T>) => {
  return (
    <div>
      {title && <h5>{title}</h5>}

      <table className="tenatTable" id={tableKey}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <td key={index} className={col.className || ""}>
                {col.title}
              </td>
            ))}
          </tr>
        </thead>

        <tbody>
          {items.length > 0 ? (
            items.map((item, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col, colIdx) => {
                  const value = (item as any)[col.dataIndex];

                  return (
                    <td key={colIdx} className={col.className || ""}>
                      {col.isProgress ? (
                        <div className="d-flex justify-content-center w-100">
                          <div style={{ width: "300px" }}>
                            <Progress
                              percent={Number(value) || 0}
                              size="small"
                              showInfo
                              strokeColor={getColorValue("2")}
                              status="normal"
                              format={(percent) =>
                                percent === 100 ? (
                                  <span>
                                    <CheckCircleFilled
                                      style={{
                                        color: getColorValue("2"),
                                        marginRight: 4,
                                      }}
                                    />
                                    {percent}%
                                  </span>
                                ) : (
                                  `${percent}%`
                                )
                              }
                            />
                          </div>
                        </div>
                      ) : (
                        <span
                          style={{
                            fontWeight:
                              col.dataIndex === "count" ? "700" : undefined,
                          }}
                        >
                          {value ?? "---"}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr style={{ borderBottom: "none" }}>
              <td colSpan={columns.length}>
                <Empty />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;
