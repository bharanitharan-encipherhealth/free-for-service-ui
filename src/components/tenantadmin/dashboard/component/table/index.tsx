import React from "react";
import { Empty, Progress } from "antd";
import { getColorValue } from "@/util/reusableFunction";
import { IoCheckmarkCircle } from "react-icons/io5";

interface ColumnType {
  title: string;
  dataIndex: string;
  className?: string;
  isProgress?: boolean;
}

interface DashboardTableProps {
  items?: any[];
  dataSource?: any[];
  tableKey?: string | number;
  title?: React.ReactNode;
  columns?: ColumnType[];
  scroll?: { x?: number | string | boolean; y?: number | string };
}

const DashboardTable: React.FC<DashboardTableProps> = ({
  items = [],
  dataSource = [],
  tableKey,
  title,
  columns = [],
}) => {
  const data = dataSource.length > 0 ? dataSource : items;
  return (
    <div>
      {title && <h5 className="mb-4 font-bold">{title}</h5>}
      <table className="tenatTable" id={tableKey?.toString()}>
        <thead>
          <tr>
            {columns.map((col, id) => (
              <td key={id} className={col.className || ""}>
                {col.title}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, idx) => (
              <tr key={idx}>
                {columns.map((col, colIdx) => {
                  const value = item[col.dataIndex];
                  return (
                    <td key={colIdx} className={col.className || ""}>
                      {col.isProgress ? (
                        <div className="flex justify-center w-full">
                          <div style={{ width: "300px" }}>
                            <Progress
                              percent={parseFloat(String(value)) || 0}
                              size="small"
                              showInfo={true}
                              strokeColor={(getColorValue("2") as string) || ""}
                              status="normal"
                              format={(percent) =>
                                percent === 100 ? (
                                  <span>
                                    <IoCheckmarkCircle
                                      style={{
                                        color: getColorValue("2") || "",
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
                            fontWeight: col.dataIndex === "count" ? "700" : "",
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

export default DashboardTable;
