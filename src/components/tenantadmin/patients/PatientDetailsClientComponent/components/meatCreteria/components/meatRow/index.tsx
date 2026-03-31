import { MeatRowType } from "@/models/tenantadmin/patients/DiagnosisDetails";
import React, { useCallback, useMemo } from "react";
import { reusableEllipses } from "@/util/reusableFunction";
import { IoCalendarOutline } from "react-icons/io5";
import styles from "../../../../components/diagnosisDetails/style.module.css";
import {
  meatHyperLink,
  renderProviderSection,
} from "../../../diagnosisDetails/components/function/renderingFunction";
import { connect, ConnectedProps } from "react-redux";
import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";
import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import { FaUserDoctor } from "react-icons/fa6";
import noData from "@/../public/images/avatar/noData.png";
import Image from "next/image";
import MovementIcon from "../../../diagnosisDetails/components/movementIcon";
import { LuSquarePen } from "react-icons/lu";

type MeatRowRedux = ConnectedProps<typeof connector>;

type MeatRowPropsType = MeatRowRedux & MeatRowType;
const MeatRow = React.memo(
  ({
    meatCreteriaList,
    pdfSearchValue,
    setPdfSearch,
    setPdfView,
    pdfView,
    meatCreteria,
    setAddModalOpen,
    setEditDiseaseList,
    isDisable,
    isHeight,
  }: MeatRowPropsType) => {
    const tableHeader = useMemo(
      () => [
        { label: "Codes & Description", key: "description" },
        { label: "Monitor", key: "monitorAspect" },
        { label: "Evaluation", key: "evaluateAspect" },
        { label: "Assessment", key: "assessmentAspect" },
        { label: "Treatment", key: "treatmentAspect" },
        { label: "Actions", key: "action" },
      ],
      [pdfView],
    );

    const isDisabledStatus = useMemo(
      () => isDisable?.isDosWise || isDisable?.isYearWise,
      [isDisable],
    );

    const renderHeader = useCallback(() => {
      return (
        <div className={`${styles.headerRow}`}>
          {tableHeader?.map((item, index) => (
            <div key={index} className={styles.headerCell}>
              {item.label}
            </div>
          ))}
        </div>
      );
    }, [tableHeader]);

    return (
      <>
        {meatCreteria === "meat" && renderHeader()}
        {!meatCreteriaList?.length ? (
          <div className="flex items-center justify-center h-full">
            <Image
              width={150}
              height={150}
              src={noData}
              priority
              fetchPriority="high"
              loading="eager"
              alt="No Data Available"
            />
          </div>
        ) : (
          <div className={`my-2 ${isHeight ? "h-90 overflow-scroll" : ""} `}>
            {meatCreteriaList?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`${styles.row} ${meatCreteria === "meat" ? styles.meatCreteria : styles?.deletedMeatCreteria} p-3 my-4`}
                  onClick={() => setPdfView(true)}
                >
                  <div className="pe-3">
                    <>
                      <span className="font-bold">
                        {item?.diagnosisCode + " - "}
                      </span>
                      {reusableEllipses({ str: item?.diseaseName, count: 40 })}
                    </>

                    <div className="flex gap-2 items-center mt-2">
                      <div className="iconBagColor">
                        <FaUserDoctor />
                      </div>
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

                    <div className="flex gap-2 items-center mt-2">
                      <div className="iconBagColor">
                        <IoCalendarOutline />
                      </div>
                      {renderProviderSection({
                        setPdfSearch,
                        capture: item?.dateOfService,
                        hyperLinks: item?.dosHyperlinks,
                        pdfSearchValue: pdfSearchValue,
                        hyperlinkKey: "dateOfService",
                        isDateShow: true,
                        sectionName: "dateSection",
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <>
                      {reusableEllipses({
                        str: item?.monitorAspect,
                        count: 30,
                      }) || "---"}
                    </>
                    <>
                      {meatHyperLink({
                        hyperlinks: item?.monitorHyperLink,
                        setPdfSearch,
                        pdfSearchValue,
                        title: "Monitor",
                        aspectValue: item?.monitorAspect,
                      })}
                    </>
                  </div>

                  <div className="flex flex-col gap-2">
                    <>
                      {reusableEllipses({
                        str: item?.evaluateAspect,
                        count: 30,
                      }) || "---"}
                    </>
                    <>
                      {meatHyperLink({
                        hyperlinks: item?.evaluateHyperLink,
                        setPdfSearch,
                        pdfSearchValue,
                        title: "Evaluate",
                        aspectValue: item?.evaluateAspect,
                      })}
                    </>
                  </div>

                  <div className="flex flex-col gap-2">
                    <>
                      {reusableEllipses({
                        str: item?.assessmentAspect,
                        count: 30,
                      }) || "---"}
                    </>
                    <>
                      {meatHyperLink({
                        setPdfSearch,
                        pdfSearchValue,
                        hyperlinks: item?.assessmentHyperLink,
                        title: "Assessment",
                        aspectValue: item?.assessmentAspect,
                      })}
                    </>
                  </div>

                  <div className="flex flex-col gap-2">
                    <>
                      {reusableEllipses({
                        str: item?.treatmentAspect,
                        count: 30,
                      }) || "---"}
                    </>

                    <>
                      {meatHyperLink({
                        setPdfSearch,
                        pdfSearchValue,
                        hyperlinks: item?.treatmentHyperLink,
                        title: "Treatment",
                        aspectValue: item?.treatmentAspect,
                      })}
                    </>
                  </div>

                  <div className="flex items-center gap-3">
                    <MovementIcon
                      showMoveIcon={{ deleteIcon: true }}
                      data={item}
                      dragId={`diagnosis-${item?.diagnosisCode}`}
                      isDisabledStatus={isDisabledStatus}
                    />

                    <div
                      className={`iconBagColor ${!isDisabledStatus ? "cursor-pointer" : "cursor-not-allowed"}`}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => {
                        if (!isDisabledStatus) {
                          setAddModalOpen({
                            isMeatEdit: true,
                            isMeatPage: true,
                          });
                          setEditDiseaseList(item);
                        }
                      }}
                    >
                      <LuSquarePen className="font-bold text-base" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  },
);

MeatRow.displayName = "MeatRow";

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    pdfSearchValue: state?.patientDetailsReducer?.setPdfSearch,
    pdfView: state?.patientDetailsReducer?.setPdfView,
    isDisable: state?.patientDetailsReducer?.isDisable,
  }),
  {
    setPdfSearch: patientDetailsAction?.setPdfSearch,
    setPdfView: patientDetailsAction?.setPdfView,
    setAddModalOpen: patientDetailsAction?.setAddModaOpen,
    setEditDiseaseList: patientDetailsAction?.setEditDiseaseList,
  },
);
export default connector(MeatRow);
