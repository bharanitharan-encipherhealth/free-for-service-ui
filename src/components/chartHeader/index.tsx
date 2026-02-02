import React from "react";
import { Tooltip } from "antd";
import styles from "./style.module.css";
import Image from "next/image";

export interface CustomHeader {
  label?: string;
  value?: string | number;
  background?: string;
  images?: string;
  header?: string | React.ReactNode;
  onClick?: (values: any) => void;
  values?: any;
  showMaximize?: boolean;
}

interface ChartHeaderProps {
  customHeader?: CustomHeader;
}

const ChartHeader: React.FC<ChartHeaderProps> = ({ customHeader = {} }) => {
  const {
    label = "",
    value = "",
    background,
    images,
    header,
    onClick,
    values,
    showMaximize = false,
  } = customHeader;

  return (
    <div className={styles.headers}>
      <div className="d-flex justify-content-between">
        <div
          className={`${styles.header} justify-content-between align-items-center gap-2`}
        >
          {images && (
            <div className={`rounded ${styles.imgbg}`} style={{ background }}>
              <div className="d-flex align-items-center justify-content-center mt-2">
                <Image src={images} alt="no Img" width={25} height={25} />
              </div>
            </div>
          )}
          <div className="d-flex flex-column justify-content-center">
            <div className="cr-pointer">{header}</div>

            {showMaximize && (
              <span
                id="maximize-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onClick && values) onClick(values);
                }}
                className="font1 text-decoration-underline cursor-pointer"
                style={{ color: "#3B82F6" }}
              >
                Maximize
              </span>
            )}
          </div>
        </div>

        <div className="p-1 text-end">
          <div
            className={styles.header}
            style={{ fontSize: "10px", color: "#888888" }}
          >
            {label}
          </div>
          <div
            className={`d-flex align-items-center justify-content-center ${styles.price}`}
          >
            <Tooltip title={value}>{value}</Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartHeader;
