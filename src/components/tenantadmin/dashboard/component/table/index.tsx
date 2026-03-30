import React from "react";
import { Empty, Progress } from "antd";
import { getColorValue } from "../../../../../util/reusableFunction";
import { CheckCircleFilled } from "@ant-design/icons";

interface Column {
  title: string;
  dataIndex: string;
  className?: string;
  isProgress?: boolean;
}

interface ReusableTableProps {
  items: any[];
  key?: string | number;
  title?: string;
  columns?: Column[];
}

const ReusableTable: React.FC<ReusableTableProps> = ({ items, key, title, columns = [] }) => {
  return (
    <div>
      {title && <h5>{title}</h5>}
      <table className="tenatTable" key={key} id={String(key)}>
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
          {items?.length > 0 ? (
            items?.map((item, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col, colIdx) => {
                  const value = item[col.dataIndex];
                  return (
                    <td key={colIdx} className={col.className || ""}>
                      {col.isProgress ? (
                        <div className="flex justify-center w-full">
                          <div style={{ width: "300px" }}>
                            <Progress
                              percent={parseFloat(value) || 0}
                              size="small"
                              showInfo={true}
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
              <td colSpan={columns.length || 1}>
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
