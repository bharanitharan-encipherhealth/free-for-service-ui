import { DiseaseTagType } from "@/models/tenantadmin/patients/DiagnosisDetails";
import { Tooltip } from "antd";
import React, { useMemo } from "react";
import style from "../../style.module.css";
import { FaRegCircleDot } from "react-icons/fa6";

export default function DiseaseTag({ data }: DiseaseTagType) {
  const tagConfig = useMemo(
    () => [
      {
        condition: data.stateIndicators?.includes("COMBO_CODE"),
        label: "Combo",
      },
      {
        condition: data.stateIndicators?.includes("MOST_SPECIFIC"),
        label: "Most Specified",
      },
      {
        condition: data.stateIndicators?.includes("MANUALLY_ADDED"),
        label: "Manually Added",
      },
      {
        condition: data?.stateIndicators?.includes("CONFLICT_CONDITION"),
        label: "Conflict",
      },
      {
        condition: data?.stateIndicators?.includes("COMBO_CODE"),
        label: "Combo",
      },
      { condition: data?.stateIndicators?.includes("EDITED"), label: "Edited" },
      {
        condition: data?.stateIndicators?.includes("MANUALLY_ADDED"),
        label: "Manually Added",
      },
      {
        condition: data?.stateIndicators?.includes("CRITICAL_CONDITION"),
        label: "Critical",
      },
      {
        condition: data?.stateIndicators?.includes("STATUS_CODE"),
        label: "Status Code",
      },
    ],
    [data],
  );
  if (!data) return;

  const activeTags = tagConfig.filter((tag) => tag.condition);
  const activeTagSlice = activeTags?.slice(0, 1);
  const restLength = activeTags?.slice(1)?.length;
  if (activeTags.length === 0) return null;
  return (
    <div className={`flex items-center flex-wrap gap-2`}>
      <div className="iconBagColor">
        <FaRegCircleDot />
      </div>
      <div className={`flex items-center ${style?.borderLast} gap-1`}>
        {activeTagSlice.map((tag, index) => (
          <div key={index} className="">
            <span className={`hccCardOverallFont cr-pointer `}>
              {tag?.label}
            </span>
          </div>
        ))}
        {restLength > 0 && (
          <div
            className={`${style?.restLength} rounded-full text-xs text-center p-1 cursor-pointer`}
            onClick={() => {}}
          >
            {"+" + restLength}
          </div>
        )}
      </div>
    </div>
  );
}
