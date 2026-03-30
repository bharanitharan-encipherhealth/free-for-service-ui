import React from "react";
import styles from "./styles.module.css";
import { statusFormate } from "@/util/reusableFunction";
import Image from "next/image";

interface StatusConfigItem {
  icon?: React.ReactNode;
  bgColor: string;
}

const statusConfig: Record<string, StatusConfigItem> = {
  Allocated: {
    bgColor: "/images/dashboard/patientCount.webp",
  },
  Completed: {
    bgColor: "/images/dashboard/pages.webp",
  },
  InProgress: {
    bgColor: "/images/dashboard/dosCount.webp",
  },
  ReassignedPending: {
    bgColor: "/images/dashboard/completedContainer.webp",
  },
  ReassignedCompleted: {
    bgColor: "/images/dashboard/processingContainer.webp",
  },
  QueryPending: {
    bgColor: "/images/dashboard/pages.webp",
  },
  QueryApproved: {
    bgColor: "/images/dashboard/failedContainer.webp",
  },
  QueryCompleted: {
    bgColor: "/images/dashboard/failedContainer.webp",
  },
  OverallPatientCount: {
    bgColor: "/images/dashboard/patientCount.webp",
  },
  InPatient: {
    bgColor: "/images/dashboard/dosCount.webp",
  },
  OutPatient: {
    bgColor: "/images/dashboard/pages.webp",
  },
};

interface StatusCardProps {
  coderName?: string;
  status?: string;
  value?: string | number;
  label?: string;
  subtitle?: string;
  col?: any;
}

const StatusCard: React.FC<StatusCardProps> = ({
  status = "Allocated",
  value = 0,
  label = "Charts",
}) => {
  const { bgColor } = statusConfig[status] || {};
  const hasBg = Boolean(bgColor);
  
  return (
    <div
      className="relative overflow-hidden border-2 border-[#B3B3B3] h-[120px] p-4 rounded-lg flex flex-col items-center justify-center text-white"
    >
      {hasBg && (
        <Image
          src={bgColor || ""}
          alt={status}
          fill
          sizes="(max-width: 768px) 90vw, 206px"
          priority={false}
          loading="lazy"
          style={{ objectFit: "cover", zIndex: 0 }}
        />
      )}
      <div
        className={`${styles.headerFont} relative z-[1]`}
        style={{ textAlign: "left" }}
      >
        <div className="flex items-center gap-2">
          <div>
            <div>{statusFormate(status)}</div>
          </div>
        </div>
      </div>

      <div
        style={{ textAlign: "left" }}
        className="mt-2 relative z-[1]"
      >
        <div className={styles.labelFont}>
          {value} {label}
        </div>
      </div>

      <div style={{ color: "#ffff" }} className={`${styles.subtitleFont} mt-2`}>
      </div>
    </div>
  );
};

export default StatusCard;
