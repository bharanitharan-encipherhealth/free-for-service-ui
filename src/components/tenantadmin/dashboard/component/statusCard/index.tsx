import React from "react";
import { FaUsers, FaCheckCircle, FaClock } from "react-icons/fa";
import styles from "./styles.module.css";
import allocated from "@/images/dashboard/patientCount.webp";
import pending from "@/images/dashboard/dosCount.webp";
import completed from "@/images/dashboard/pages.webp";
import reassignedPending from "@/images/dashboard/completedContainer.webp";
import queryCompleted from "@/images/dashboard/failedContainer.webp";
import reassignedCompleted from "@/images/dashboard/processingContainer.webp";
import { statusFormate } from "@/util/reusableFunction";
import Image from "next/image";


const statusConfig = {
  Allocated: {
    icon: <FaUsers />,
    bgColor: allocated,
  },
  Completed: {
    icon: <FaCheckCircle />,
    bgColor: completed,
  },
  InProgress: {
    //pending status
    icon: <FaClock />,
    bgColor: pending,
  },
  ReassignedPending: {
    //reassign pending
    icon: <FaClock />,
    bgColor: reassignedPending,
  },
  ReassignedCompleted: {
    bgColor: reassignedCompleted,
  },
  QueryPending: {
    bgColor: completed,
  },
  QueryApproved: {
    bgColor: queryCompleted,
  },
  QueryCompleted: {
    bgColor: queryCompleted,
  },
  OverallPatientCount: {
    bgColor: allocated,
  },
  InPatient: {
    bgColor: pending,
  },
  OutPatient: {
    bgColor: completed,
  },
};

const StatusCard = ({
  coderName = "CODER_1",
  status = "Allocated",
  value = 0,
  label = "Charts",
  subtitle = "Last 3 days",
  col = null,
}: {
  coderName?: string;
  status?: string;
  value?: any;
  label?: string;
  subtitle?: string;
  col?: any;
}) => {
  const { icon, bgColor } = (statusConfig as any)[status] || {};
  const hasBg = Boolean(bgColor && bgColor.src);
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        border: "2px solid #B3B3B3",
        height: "120px",
        padding: "16px",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      {hasBg && (
        <Image
          src={bgColor}
          alt={status}
          fill
          sizes="(max-width: 768px) 90vw, 206px"
          priority={false}
          loading="lazy"
          style={{ objectFit: "cover", zIndex: 0 }}
        />
      )}
      <div
        className={`${styles.headerFont}`}
        style={{ textAlign: "left", position: "relative", zIndex: 1 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* {icon} */}
          <div>
            {/* <strong>{coderName}</strong> */}
            <div>{statusFormate(status)}</div>
          </div>
        </div>
      </div>

      <div
        style={{ textAlign: "left", position: "relative", zIndex: 1 }}
        className="mt-2"
      >
        <div className={styles.labelFont}>
          {value} {label}
        </div>
      </div>

      <div style={{ color: "#ffff" }} className={`${styles.subtitleFont} mt-2`}>
        {/* {subtitle} */}
      </div>
    </div>
  );
};

export default StatusCard;
