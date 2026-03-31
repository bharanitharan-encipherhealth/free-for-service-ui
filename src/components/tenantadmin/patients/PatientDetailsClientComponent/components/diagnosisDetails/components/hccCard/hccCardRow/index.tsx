import React, { useMemo } from "react";
import style from "../../../style.module.css";
import { connect, ConnectedProps } from "react-redux";
import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";
import { HccCardRowType } from "@/models/tenantadmin/patients/DiagnosisDetails";
import { LuSquarePen } from "react-icons/lu";
import { BsDiagram3 } from "react-icons/bs";
import MovementIcon from "../../movementIcon";
import { FaUserDoctor } from "react-icons/fa6";
import { renderProviderSection } from "../../function/renderingFunction";
import { reusableEllipses } from "@/util/reusableFunction";
import { IoCalendarOutline } from "react-icons/io5";
import { GiMedicines } from "react-icons/gi";
import DiseaseTag from "../../diseaseTag";
import MeatSection from "../../meatSection";
import { useDraggable } from "@dnd-kit/core";

type HccCardReduxRowType = ConnectedProps<typeof connector>;
type HccCardPropsRowType = HccCardRowType & HccCardReduxRowType;
const HccCardRow = React.memo(
  ({
    index,
    item,
    setAddModalOpen,
    setEditDiseaseList,
    cardTitle,
    setPdfSearch,
    pdfSearchValue,
    dragId,
    isDisable,
  }: HccCardPropsRowType) => {
    const isDisabledStatus = useMemo(
      () => isDisable?.isDosWise || isDisable?.isYearWise,
      [isDisable],
    );

    const {
      attributes,
      listeners,
      setNodeRef: setDragRef,
      isDragging,
    } = useDraggable({
      id: dragId + "-" + item?.diagnosisCode,
      disabled: isDisabledStatus,
      data: {
        item,
        cardTitle,
      },
    });

    const dragStyle: React.CSSProperties = {
      visibility: isDragging ? "hidden" : "visible",
    };

    return (
      <div
        key={index + item?.diagnosisCode}
        className={`w-full my-2 ${style.hccCard} p-2`}
        ref={setDragRef}
        style={dragStyle}
        {...attributes}
        {...listeners}
      >
        {/* disease code section */}
        <div className="flex justify-between items-center">
          <div className="text-sm font-bold">{item?.diagnosisCode}</div>

          <div className="flex gap-2 items-center">
            <div
              className={`iconBagColor border-r border-gray-300 pe-2 ${!isDisabledStatus ? "cursor-pointer" : "cursor-not-allowed"}`}
              onClick={(e) => {
                if (!isDisabledStatus) {
                  e.stopPropagation();
                  setAddModalOpen({ isEdit: true });
                  setEditDiseaseList(item);
                }
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
            >
              <LuSquarePen className="font-bold text-base" />
            </div>

            {item?.children?.length > 0 && (
              <div
                className={`${style.comboCode} border-gray-300 border-r pe-2 `}
              >
                <BsDiagram3 className="font-bold text-base" />
              </div>
            )}

            <div
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
            >
              <MovementIcon
                showMoveIcon={{
                  diagnosisIcon: cardTitle !== "Diagnosis",
                  careGapIcon: false,
                  potientialIcon: false,
                  deleteIcon: cardTitle !== "Delete",
                }}
                data={item}
                dragId={dragId}
                isDisabledStatus={isDisabledStatus}
              />
            </div>
          </div>
        </div>

        {/* disease discription section */}
        <div className="text-xs my-1 font-medium">
          {reusableEllipses({
            str: item?.actualDescription,
            count: 40,
          })}
        </div>

        <div className="flex flex-col my-2 gap-1">
          {/* provider section */}

          <div className="flex gap-2 items-center">
            <div className="iconBagColor">
              <FaUserDoctor />
            </div>
            <div className={`flex gap-2 ${style?.borderLast}`}>
              {renderProviderSection({
                setPdfSearch,
                capture: item?.providerNames,
                hyperLinks: item?.providerHyperlinks,
                pdfSearchValue: pdfSearchValue,
                hyperlinkKey: "header",
                isDateShow: false,
                sectionName: "providerSection",
              })}
            </div>
          </div>

          {/* date of service section */}
          <div className="flex gap-2 items-center ">
            <div className="iconBagColor">
              <IoCalendarOutline />
            </div>
            <div className={`flex gap-1 ${style?.borderLast}`}>
              {renderProviderSection({
                setPdfSearch,
                capture: item?.dateOfServices,
                hyperLinks: item?.dosHyperlinks,
                pdfSearchValue: pdfSearchValue,
                hyperlinkKey: "dateOfService",
                isDateShow: true,
                sectionName: "dateSection",
              })}
            </div>
          </div>

          {/* disease capture section */}

          {item?.capturedSections?.length ? (
            <div className="flex gap-2 items-center">
              <div className="iconBagColor">
                <GiMedicines />
              </div>

              <div className={`flex gap-1 ${style?.borderLast} `}>
                {renderProviderSection({
                  setPdfSearch,
                  capture: item?.capturedSections,
                  hyperLinks: item?.hyperlinks,
                  pdfSearchValue: pdfSearchValue,
                  hyperlinkKey: "dateOfService",
                  isDateShow: false,
                  sectionName: "captureSection",
                })}
              </div>
            </div>
          ) : null}

          {/* tags section */}
          <div>
            <DiseaseTag data={item} />
          </div>

          {/* MEAT SECTION */}
          <div className="flex gap-2 items-center">
            <MeatSection meatDetails={item} />
          </div>
        </div>
      </div>
    );
  },
);

HccCardRow.displayName = "HccCardRow";

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    pdfSearchValue: state?.patientDetailsReducer?.setPdfSearch,
    patientDiseaseDetailsLoading:
      state?.patientDetailsReducer?.patientDiseaseDetailsLoading,
    patientDosDetailsLoading:
      state?.patientDetailsReducer?.patientDosDetailsLoading,
    pageLoading: state?.patientDetailsReducer?.setPageLoading,
    isDisable: state?.patientDetailsReducer?.isDisable,
  }),
  {
    setPdfSearch: patientDetailsAction?.setPdfSearch,
    setAddModalOpen: patientDetailsAction?.setAddModaOpen,
    setEditDiseaseList: patientDetailsAction?.setEditDiseaseList,
  },
);

export default connector(HccCardRow);
