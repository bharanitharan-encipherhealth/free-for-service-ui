import React, { useCallback, useEffect, useMemo, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";
import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import { Empty, Popconfirm, Skeleton, Tooltip } from "antd";
import {
  DosSummary,
  timeLineContentType,
} from "@/models/tenantadmin/patients/details";
import { getBadgeClassName } from "../diagnosisDetails/components/function/reusabelFunction";
import { IoHomeOutline } from "react-icons/io5";
import { formatDateTime } from "@/util/reusableFunction";
import commanStyle from "@/styles/comman.style.module.css";
import { getHtmlContent, getTimelineHeading } from "../function";
import { usePathname } from "next/navigation";
import { getStorage } from "@/util/storage";

type VersionHistoryReduxType = ConnectedProps<typeof connector>;
const VersionHistory = React.memo(
  ({
    getVersionHistoryAction,
    selectedDos,
    admissionNumber,
    versionHistoryData,
    versionHistoryLoading,
    confirmRevert,
    selectedPatientYear,
    getPatientDiseaseDetials,
    getSelectedDosPageNumber,
    setPdfSearch,
    setPageLoading,
    setSelectDos,
    isDisable,
  }: VersionHistoryReduxType) => {
    const pathName = usePathname();
    const patientId = getStorage("patientId");
    const [popClickDisCode, setPopClickDisCode] = useState<number | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const getVersionHistory = useCallback(async () => {
      await getVersionHistoryAction({ dos: selectedDos, admissionNumber });
    }, [selectedDos, getVersionHistoryAction, admissionNumber]);

    const isDisabledStatus = useMemo(() => isDisable?.isDosWise, [isDisable]);

    const getPatientDiseaseDetails = useCallback(
      async ({ dos }: { dos: string }) => {
        try {
          const diseaseDetails = await getPatientDiseaseDetials({
            patientId,
            dos,
            navigate: pathName,
            admissionNumber,
          });
          if (diseaseDetails?.status === "SUCCESS") {
            const dosSummaries =
              diseaseDetails?.response?.fileDetailDTO?.dosSummaries;
            if (dosSummaries) {
              const filteredDos = dosSummaries?.find(
                (data: DosSummary) => data?.dos === dos,
              );
              getSelectedDosPageNumber(filteredDos?.startPageNumber);
              setPdfSearch({
                value: filteredDos?.substring,
                page: filteredDos?.startPageNumber,
              });
            }
          }
        } catch (e) {
          console.error(e, "Erro While Calling the patient Disease Call");
        } finally {
          setPageLoading(false);
        }

        setSelectDos(dos);
      },
      [
        setSelectDos,
        getPatientDiseaseDetials,
        pathName,
        admissionNumber,
        getSelectedDosPageNumber,
        setPdfSearch,
        patientId,
        getVersionHistory,
      ],
    );

    const handleConfirm = useCallback(
      async ({ item }: { item: number }) => {
        const res = await confirmRevert({
          dos: selectedDos,
          versionHistory: item,
          admissionNumber,
          year: selectedPatientYear,
        });

        if (res?.status === "SUCCESS") {
          await getPatientDiseaseDetails({ dos: selectedDos });
          getVersionHistory();
        }
      },
      [confirmRevert, selectedDos, admissionNumber, selectedPatientYear],
    );

    const renderVersionHistory = useCallback(
      ({ item, index }: { item: timeLineContentType; index: number }) => {
        return (
          <li
            key={index}
            id={`tooltip-username-${index}`}
            className={`${!isDisabledStatus ? "cursor-pointer" : "cursor-not-allowed "}`}
          >
            <Tooltip
              title={
                item?.revertHistory === -1
                  ? "Base Version"
                  : item?.revertHistory === 0
                    ? "Initial Version"
                    : ""
              }
            >
              <div
                className={`cursor-pointer ${getBadgeClassName({ item })} font-bold text-xl flex justify-center items-center opacity-90`}
                id={`user-timeline${index} `}
              >
                {item?.revertHistory === -1 ? (
                  "B"
                ) : item?.revertHistory === 0 ? (
                  <IoHomeOutline className="text-xl leading-none" />
                ) : (
                  item?.revertHistory
                )}
              </div>
            </Tooltip>
            {!item?.isCurrentVersion ? (
              <Popconfirm
                title="Confirm Revert to this Version"
                className="custom-pop"
                placement="top"
                okText="Yes"
                cancelText="No"
                onConfirm={() => handleConfirm({ item: item.revertHistory })}
                disabled={isDisabledStatus}
              >
                <div
                  className={`timeline-panel cr-pointer text-muted ${isDisabledStatus && "opacity-80"}`}
                >
                  <span
                    className={`${commanStyle.timelineheading} ant-badge cursor-pointer flex`}
                  >
                    {item?.htmlContent
                      ? getHtmlContent({ htmlContent: item?.htmlContent })
                      : getTimelineHeading({
                          item,
                          index,
                          popClickDisCode,
                          setIsPopupOpen,
                          setPopClickDisCode,
                          isPopupOpen,
                        })}
                  </span>
                  {item?.dos && (
                    <span className={`${commanStyle.timelineDate} mt-1`}>
                      {`DOS: ${item?.dos}`}
                    </span>
                  )}
                  <span className={commanStyle.timelineDate}>
                    {formatDateTime({ date: item.createdDate })}
                  </span>
                </div>
              </Popconfirm>
            ) : (
              <div
                className="timeline-panel text-muted"
                style={{ cursor: "not-allowed", opacity: 0.5 }}
              >
                <span
                  className={`${commanStyle.timelineheading} ant-badge flex`}
                >
                  {item?.htmlContent
                    ? getHtmlContent({ htmlContent: item?.htmlContent })
                    : getTimelineHeading({
                        item,
                        index,
                        popClickDisCode,
                        setIsPopupOpen,
                        setPopClickDisCode,
                        isPopupOpen,
                      })}
                </span>
                {item?.dos && (
                  <span className={`${commanStyle.timelineDate} mt-1`}>
                    {`DOS: ${item?.dos}`}
                  </span>
                )}
                <span className={commanStyle.timelineDate}>
                  {formatDateTime({ date: item.createdDate })}
                </span>
              </div>
            )}
          </li>
        );
      },
      [
        versionHistoryData,
        popClickDisCode,
        setIsPopupOpen,
        setPopClickDisCode,
        isPopupOpen,
        handleConfirm,
      ],
    );
    useEffect(() => {
      getVersionHistory();
    }, []);

    return (
      <div>
        {versionHistoryLoading ? (
          <div className="flex flex-col gap-4 my-2">
            {Array.from({ length: 15 }).map((_, i) => (
              <Skeleton.Input key={i} active block />
            ))}
          </div>
        ) : (
          <div
            className={`my-2 widget-timeline ${versionHistoryData?.length === 0 ? "no-timeline-line" : ""}`}
          >
            <ul className="timeline">
              {versionHistoryData?.length > 0 ? (
                versionHistoryData?.map((item, index) =>
                  renderVersionHistory({ item, index }),
                )
              ) : (
                <div className="no-data-container">
                  <h6 className="text-center">
                    <Empty />
                  </h6>
                </div>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  },
);

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    selectedDos: state?.patientDetailsReducer?.setSelectDos,
    admissionNumber: state?.patientDetailsReducer?.setAdmissionNumber,
    versionHistoryData:
      state?.patientDetailsReducer?.getVersionHistory?.data?.response,
    versionHistoryLoading:
      state?.patientDetailsReducer?.getVersionHistoryloading,
    selectedPatientYear: state?.patientDetailsReducer?.setPatientOverallYear,
    isDisable: state?.patientDetailsReducer?.isDisable,
  }),
  {
    getVersionHistoryAction: patientDetailsAction?.getVersionHistory,
    confirmRevert: patientDetailsAction?.confirmRevert,
    getPatientDiseaseDetials: patientDetailsAction?.patientDiseaseDetails,
    getSelectedDosPageNumber: patientDetailsAction?.getSelectedDosPageNumber,
    setPdfSearch: patientDetailsAction?.setPdfSearch,
    setPageLoading: patientDetailsAction?.setPageLoading,
    setSelectDos: patientDetailsAction?.setSelectDos,
  },
);

export default connector(VersionHistory);

VersionHistory.displayName = "VersionHistory";
