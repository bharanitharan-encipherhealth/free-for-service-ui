import { MovementIconType } from "@/models/tenantadmin/patients/DiagnosisDetails";
import React from "react";
import { IoIosArrowForward, IoMdClose } from "react-icons/io";
import style from "../../style.module.css";
import { TiTick } from "react-icons/ti";
import { Tooltip } from "antd";
import { FaHandHoldingMedical } from "react-icons/fa6";

export default function MovementIcon({ showMoveIcon }: MovementIconType) {
  return (
    <div className="flex gap-2 items-center">
      {showMoveIcon?.diagnosisIcon && (
        <div>
          <Tooltip
            title="Move To Diagnosis"
            className={`${style?.diagnosisMoveIcon} cursor-pointer`}
          >
            <TiTick className="font-bold text-base" />
          </Tooltip>
        </div>
      )}
      {showMoveIcon?.careGapIcon && (
        <div>
          <Tooltip
            title="Move To Care Gap"
            className={`${style?.suggestMoveIcon} cursor-pointer`}
          >
            <IoIosArrowForward className="font-bold text-base" />
          </Tooltip>
        </div>
      )}
      {showMoveIcon?.potientialIcon && (
        <div>
          <Tooltip
            title="Move To Suggest"
            className={`${style?.potientialMoveIcon} cursor-pointer`}
          >
            <FaHandHoldingMedical className="font-bold text-base" />
          </Tooltip>
        </div>
      )}
      {showMoveIcon?.deleteIcon && (
        <div>
          <Tooltip
            title="Move To Delete"
            className={`${style?.deleteMoveIcon} cursor-pointer`}
          >
            <IoMdClose className="font-bold text-base" />
          </Tooltip>
        </div>
      )}
    </div>
  );
}
