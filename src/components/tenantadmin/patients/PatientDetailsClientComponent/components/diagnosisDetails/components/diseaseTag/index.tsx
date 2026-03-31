import { DiseaseTagType } from "@/models/tenantadmin/patients/DiagnosisDetails";
import React, { useMemo, useState } from "react";
import style from "../../style.module.css";
import { FaRegCircleDot } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

export default function DiseaseTag({ data }: DiseaseTagType) {
  const [isOpen, setIsOpen] = useState(false);

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
  const displayTags = isOpen ? activeTags : activeTags?.slice(0, 1);
  const restLength = activeTags?.length - 1;

  if (activeTags.length === 0) return null;

  return (
    <div className={`flex items-center flex-wrap gap-2`}>
      <div className="iconBagColor">
        <FaRegCircleDot />
      </div>
      <div className={`flex items-center ${style?.borderLast} gap-1`}>
        {displayTags.map((tag, index) => (
          <div key={index} className="">
            <span className={`hccCardOverallFont cr-pointer `}>
              {tag?.label}
            </span>
          </div>
        ))}
        {activeTags.length > 1 && (
          <div
            className={`${style?.restLength} rounded-full text-xs text-center flex items-center justify-center p-1 cursor-pointer`}
            style={{ minWidth: "20px", height: "18px" }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? <IoClose size={14} /> : "+" + restLength}
          </div>
        )}
      </div>
    </div>
  );
}
