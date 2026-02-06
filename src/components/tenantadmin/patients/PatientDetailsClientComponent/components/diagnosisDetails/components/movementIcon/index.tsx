import { MovementIconType } from "@/models/tenantadmin/patients/DiagnosisDetails";
import React from "react";
import { IoIosArrowForward, IoMdClose } from "react-icons/io";
import style from "../../style.module.css";
import { TiTick } from "react-icons/ti";
import { Tooltip } from "antd";

export default function MovementIcon({ showMoveIcon }: MovementIconType) {
  return (
    <div className="flex gap-2 items-center">
      {showMoveIcon?.diagnosisIcon && (
        <div >
          <Tooltip
            title="Move To Diagnosis"
            className={`${style?.diagnosisMoveIcon}`}
          >
            <TiTick className="font-bold" />
          </Tooltip>
        </div>
      )}
      {showMoveIcon?.careGapIcon && (
        <div>
          <Tooltip
            title="Move To Suggest"
            className={`${style?.suggestMoveIcon}`}
          >
            <IoIosArrowForward className="font-bold" />
          </Tooltip>
        </div>
      )}
      {showMoveIcon?.deleteIcon && (
        <div>
          <Tooltip
            title="Move To Delete"
            className={`${style?.deleteMoveIcon}`}
          >
            <IoMdClose className="font-bold" />
          </Tooltip>
        </div>
      )}
    </div>
  );
}
