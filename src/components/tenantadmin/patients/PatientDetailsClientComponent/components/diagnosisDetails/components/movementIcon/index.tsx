import { MovementIconType } from "@/models/tenantadmin/patients/DiagnosisDetails";
import React, { useCallback } from "react";
import { IoIosArrowForward, IoMdClose } from "react-icons/io";
import style from "../../style.module.css";
import { TiTick } from "react-icons/ti";
import { Tooltip } from "antd";
import { FaHandHoldingMedical } from "react-icons/fa6";
import { onDragEndDisease } from "../../../function/reusableFunction";
import { connect, ConnectedProps } from "react-redux";
import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";
import { Over } from "@dnd-kit/core";

type MovementIconRedux = ConnectedProps<typeof connector> & MovementIconType;
const MovementIcon = React.memo(
  ({
    showMoveIcon,
    data,
    dragId,
    setDndConfrim,
    setMovingData,
    isDisabledStatus,
  }: MovementIconRedux) => {
   
    
    const onMove = useCallback(
      ({ dragId, dropId }: { dragId: string; dropId: string }) => {
        const active = {
          id: dragId,
          data: { current: { item: data } },
          rect: {
            current: {
              initial: null,
              translated: null,
            },
          },
        };
        const over: Over | null = dropId
          ? {
              id: dropId,
              rect: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: 0,
                height: 0,
              },
              data: {
                current: undefined,
              },
              disabled: false,
            }
          : null;
        onDragEndDisease({ active, over, setDndConfrim, setMovingData });
      },
      [setMovingData, setDndConfrim, data],
    );
    return (
      <div className={`flex gap-1 ${style?.borderLast}`}>
        {showMoveIcon?.diagnosisIcon && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (!isDisabledStatus) {
                onMove({
                  dragId: `${dragId}-${data?.diagnosisCode}`,
                  dropId: "diagnosis",
                });
              }
            }}
            className={`${!isDisabledStatus ? "cursor-pointer" : "cursor-not-allowed"}`}
          >
            <Tooltip
              title="Move To Diagnosis"
              className={`${style?.diagnosisMoveIcon}`}
            >
              <TiTick className="font-bold text-base" />
            </Tooltip>
          </div>
        )}
        {showMoveIcon?.careGapIcon && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (!isDisabledStatus) {
                onMove({
                  dragId: `${dragId}-${data?.diagnosisCode}`,
                  dropId: "caregap",
                });
              }
            }}
            className={`${!isDisabledStatus ? "cursor-pointer" : "cursor-not-allowed"}`}
          >
            <Tooltip
              title="Move To Care Gap"
              className={`${style?.suggestMoveIcon} `}
            >
              <IoIosArrowForward className="font-bold text-base" />
            </Tooltip>
          </div>
        )}
        {showMoveIcon?.potientialIcon && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (!isDisabledStatus) {
                onMove({
                  dragId: `${dragId}-${data?.diagnosisCode}`,
                  dropId: "suggested",
                });
              }
            }}
            className={`${!isDisabledStatus ? "cursor-pointer" : "cursor-not-allowed"}`}
          >
            <Tooltip
              title="Move To Suggest"
              className={`${style?.potientialMoveIcon}`}
            >
              <FaHandHoldingMedical className="font-bold text-base" />
            </Tooltip>
          </div>
        )}
        {showMoveIcon?.deleteIcon && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (!isDisabledStatus) {
                onMove({
                  dragId: `${dragId}-${data?.diagnosisCode}`,
                  dropId: "delete",
                });
              }
            }}
            className={`${!isDisabledStatus ? "cursor-pointer" : "cursor-not-allowed"}`}
          >
            <Tooltip
              title="Move To Delete"
              className={`${style?.deleteMoveIcon} `}
            >
              <IoMdClose className="font-bold text-base" />
            </Tooltip>
          </div>
        )}
      </div>
    );
  },
);

MovementIcon.displayName = "MovementIcon";

const connector = connect((state) => ({}), {
  setDndConfrim: patientDetailsAction?.setDropConfirm,
  setMovingData: patientDetailsAction?.setMovingData,
});

export default connector(MovementIcon);
