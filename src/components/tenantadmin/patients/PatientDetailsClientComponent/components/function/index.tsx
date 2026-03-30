import { timeLineContentType } from "@/models/tenantadmin/patients/details";
import commanStyle from "@/styles/comman.style.module.css";
import { getStatusColor } from "@/util/reusableFunction";
import { Popover, Tooltip } from "antd";
import { IoMdCloseCircle } from "react-icons/io";
import styles from "../timeline/style.module.css";
import React from "react";
import { renderProviderSection } from "../diagnosisDetails/components/function/renderingFunction";
import { underScoreRemove } from "../diagnosisDetails/components/function/reusabelFunction";

export const getHtmlContent = ({ htmlContent }: { htmlContent: string }) => {
  const labelText = htmlContent?.replace(/<[^>]*>/g, "") ?? "";
  const isLong = labelText.length > 30;

  return (
    <>
      {isLong ? (
        <Tooltip title={labelText} placement="top">
          <div
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          />
        </Tooltip>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      )}
    </>
  );
};
export const getEditDeatils = ({
  viewValue,
  setIsPopupOpen,
  setPopClickDisCode,
}: {
  viewValue: timeLineContentType;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPopClickDisCode: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const sectionMapArr = (
    <>
      <div className="flex justify-content-end">
        <IoMdCloseCircle
          className={styles.deleteIcon}
          onClick={() => {
            setIsPopupOpen(false);
            setPopClickDisCode(null);
          }}
        />
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.oldCodeContiner}>
          <span className={styles.codeTitle}>OLD</span>
          <div className={styles.details}>
            <div className={styles.detailsHeader}>
              <span className={styles.disCode}>
                {" "}
                {viewValue?.previousDiseaseFormat?.diagnosisCode}
              </span>
              <span className={styles.discription}>
                {viewValue?.previousDiseaseFormat?.dbDescription ||
                  viewValue?.previousDiseaseFormat?.actualDescription}
              </span>
            </div>

            <div className={styles.detailsHeader}>
              <span className={styles.disCode}>Provider</span>
              <div>
                {renderProviderSection({
                  capture: viewValue?.previousDiseaseFormat?.providerNames,
                  sectionName: "providerSection",
                  hyperlinkKey: "header",
                })}
              </div>
            </div>

            <div className={styles.detailsHeader}>
              <span className={styles.disCode}>Encounter Date</span>
              <div>
                {renderProviderSection({
                  capture: viewValue?.previousDiseaseFormat?.dateOfServices,
                  sectionName: "dateSection",
                  hyperlinkKey: "dateOfService",
                })}
              </div>
            </div>

            {viewValue?.previousDiseaseFormat?.capturedSections && (
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Section</span>
                <div>
                  {renderProviderSection({
                    capture: viewValue?.previousDiseaseFormat?.capturedSections,
                    sectionName: "captureSection",
                    hyperlinkKey: "dateOfService",
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.editCodeContainer}>
          <span className={styles.editTitle}>NEW</span>
          <div className={styles.details}>
            <div className={styles.detailsHeader}>
              <span className={styles.disCode}>
                {" "}
                {viewValue?.changedDiseaseFormat?.diagnosisCode}
              </span>
              <span className={styles.discription}>
                {viewValue?.changedDiseaseFormat?.dbDescription ||
                  viewValue?.previousDiseaseFormat?.actualDescription}
              </span>
            </div>

            <div className={styles.detailsHeader}>
              <span className={styles.disCode}>Provider</span>
              <div>
                {/* {getProviderNameTagList({
                      data:
                        viewValue?.changedDiseaseFormat?.providerNames ||
                        viewValue?.changedProviderInfo?.providerName ||
                        [],
                    })} */}
              </div>
            </div>

            <div className={styles.detailsHeader}>
              <span className={styles.disCode}>Encounter Date</span>
              <div>
                {/* {getDateOfServiceBackground({
                      value:
                        viewValue?.changedDiseaseFormat?.dateOfServices ||
                        viewValue?.changedProviderInfo?.dateOfService ||
                        [],
                    })} */}
              </div>
            </div>
            {viewValue?.changedDiseaseFormat?.capturedSections && (
              <div className={styles.detailsHeader}>
                <span className={styles.disCode}>Section</span>
                <div>
                  {/* {getSectionHeaderBackground({
                        value:
                          viewValue?.changedDiseaseFormat?.capturedSections,
                      })} */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return sectionMapArr;
};

export const getTimelineHeading = ({
  item,
  index,
  popClickDisCode,
  setIsPopupOpen,
  setPopClickDisCode,
  isPopupOpen,
}: {
  item: timeLineContentType;
  index: number;
  popClickDisCode: number | null;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPopClickDisCode: React.Dispatch<React.SetStateAction<number | null>>;
  isPopupOpen: boolean;
}) => {
  const onClickPopup = ({ disCode }: { disCode: number | null }) => {
    setPopClickDisCode(disCode);
    setIsPopupOpen(isPopupOpen ? false : true);
  };
  switch (item?.action) {
    case "MOVED_INVALID_TO_VALID":
      return (
        <div className="flex">
          {item.diagnosisCode} - Moved from{" "}
          <span className={commanStyle.invalidColor}>INVALID</span> to{" "}
          <span className={commanStyle.validColor}> VALID</span>
        </div>
      );
    case "MOVED_SUGGESTED_TO_VALID":
      return (
        <div className="flex">
          {item.diagnosisCode} - Moved from{" "}
          <span className={commanStyle.suggestedColor}>
            {/* SUGGESTED */}
            CAREGAP
          </span>{" "}
          to <span className={commanStyle.validColor}> VALID</span>
        </div>
      );
    case "MOVED":
      if (item?.fromState == "VALID" && item?.toState == "SUGGESTED") {
        return (
          <div className="flex">
            {item.diagnosisCode} - Moved from{" "}
            <span className={commanStyle.validColor}>HCC</span> to{" "}
            <span className={commanStyle.suggestedColor}>
              {/* SUGGESTED */}
              CAREGAP
            </span>
          </div>
        );
      }
      if (item?.fromState == "VALID" && item?.toState == "DELETED") {
        return (
          <div className="flex">
            {item.diagnosisCode} - Moved from{" "}
            <span className={commanStyle.validColor}>HCC</span> to{" "}
            <span className={commanStyle.deletedColor}>DELETED</span>
          </div>
        );
      }
      if (item?.fromState == "VALID" && item?.toState == "POTENTIAL") {
        return (
          <div className="flex">
            {item.diagnosisCode} - Moved from{" "}
            <span className={commanStyle.validColor}>HCC</span> to{" "}
            <span className={commanStyle.potentialColor}>POTENTIAL</span>
          </div>
        );
      }
      if (item?.fromState == "SUGGESTED" && item?.toState == "VALID") {
        return (
          <div className="flex">
            {item.diagnosisCode} - Moved from{" "}
            <span className={commanStyle.suggestedColor}>
              {/* SUGGESTED */}
              CAREGAP
            </span>{" "}
            to <span className={commanStyle.validColor}> HCC</span>
          </div>
        );
      }
      if (item?.fromState == "SUGGESTED" && item?.toState == "DELETED") {
        return (
          <div className="flex w-100">
            {item.diagnosisCode} - Moved from{" "}
            <span className={commanStyle.suggestedColor}>
              {/* SUGGESTED */}
              CAREGAP
            </span>{" "}
            to <span className={commanStyle.deletedColor}> DELETED</span>
          </div>
        );
      }
      if (item?.fromState == "SUGGESTED" && item?.toState == "POTENTIAL") {
        return (
          <div className="flex w-100">
            {item.diagnosisCode} - Moved from{" "}
            <span className={commanStyle.suggestedColor}>CAREGAP</span>
            to <span className={commanStyle.potentialColor}>POTENTIAL</span>
          </div>
        );
      }
      if (item?.fromState == "DELETED" && item?.toState == "VALID") {
        return (
          <div className="flex">
            {item.diagnosisCode} - Moved from{" "}
            <span className={commanStyle.deletedColor}>DELETED</span> to{" "}
            <span className={commanStyle.validColor}> HCC</span>
          </div>
        );
      }
      if (item?.fromState == "DELETED" && item?.toState == "SUGGESTED") {
        return (
          <div className="flex">
            {item.diagnosisCode} - Moved from{" "}
            <span className={commanStyle.deletedColor}>DELETED</span> to{" "}
            <span className={commanStyle.suggestedColor}>
              {/* SUGGESTED */}
              CAREGAP
            </span>
          </div>
        );
      }
      if (item?.fromState == "DELETED" && item?.toState == "POTENTIAL") {
        return (
          <div className="flex">
            {item.diagnosisCode} - Moved from{" "}
            <span className={commanStyle.deletedColor}>DELETED</span> to{" "}
            <span className={commanStyle.potentialColor}>POTENTIAL</span>
          </div>
        );
      }
      if (item?.fromState == "POTENTIAL" && item?.toState == "VALID") {
        return (
          <div className="flex">
            {item.diagnosisCode} - Moved from{" "}
            <span className={commanStyle.potentialColor}>POTENTIAL</span> to{" "}
            <span className={commanStyle.validColor}> HCC</span>
          </div>
        );
      }
      if (item?.fromState == "POTENTIAL" && item?.toState == "SUGGESTED") {
        return (
          <div className="flex">
            {item.diagnosisCode} - Moved from{" "}
            <span className={commanStyle.potentialColor}>POTENTIAL</span> to{" "}
            <span className={commanStyle.suggestedColor}>CAREGAP</span>
          </div>
        );
      }
      if (item?.fromState == "POTENTIAL" && item?.toState == "DELETED") {
        return (
          <div className="flex">
            {item.diagnosisCode} - Moved from{" "}
            <span className={commanStyle.potentialColor}>POTENTIAL</span> to{" "}
            <span className={commanStyle.deletedColor}>DELETED</span>
          </div>
        );
      }
    case "VALID_DISEASE_ADDED":
      return `${item.diagnosisCode} - Disease added`;
    case "MANUALLY_ADDED_DISEASE":
      return `${item.diagnosisCode} - Disease added manually`;
    case "MOVED_VALID_TO_DELETED":
      return (
        <div className="flex">
          {item.diagnosisCode} - Moved from{" "}
          <span className={commanStyle.validColor}>VALID</span> to{" "}
          <span className={commanStyle.deletedColor}>DELETED</span>
        </div>
      );
    case "AUDITED":
      return (
        <div className="flex">
          Changed from{" "}
          <span
            style={{
              color: getStatusColor(item?.previousProcessedState || ""),
              fontSize: "12px",
              padding: "0 5px",
            }}
          >
            {item?.previousProcessedState}
          </span>{" "}
          to <span className={commanStyle.audited}>AUDITED</span>
        </div>
      );
    case "REAUDIT":
      return (
        <div className="flex">
          Changed from{" "}
          <span
            style={{
              color: getStatusColor(item?.previousProcessedState || ""),
              fontSize: "12px",
              padding: "0 5px",
            }}
          >
            {item?.previousProcessedState}
          </span>{" "}
          to <span className={commanStyle.reaudit}>REAUDIT</span>
        </div>
      );
    case "AUDITHOLD":
      return (
        <div className="flex">
          Changed from{" "}
          <span
            style={{
              color: getStatusColor(item?.previousProcessedState || ""),
              fontSize: "12px",
              padding: "0 5px",
            }}
          >
            {item?.previousProcessedState}
          </span>{" "}
          to <span className={commanStyle?.audithold}>AUDITHOLD</span>
        </div>
      );
    case "AUDIT_PENDING":
      return (
        <div className="flex">
          Changed from{" "}
          <span
            style={{
              color: getStatusColor(item?.previousProcessedState || ""),
              fontSize: "12px",
              padding: "0 5px",
            }}
          >
            {item?.previousProcessedState}
          </span>{" "}
          to <span className={commanStyle?.auditpending}>AUDIT_PENDING</span>
        </div>
      );
    case "AUDIT_DECLINED":
      return (
        <div className="flex">
          Changed from{" "}
          <span
            style={{
              color: getStatusColor(item?.previousProcessedState || ""),
              fontSize: "12px",
              padding: "0 5px",
            }}
          >
            {item?.previousProcessedState}
          </span>{" "}
          to <span className={commanStyle?.auditdeclined}>AUDIT_DECLINED</span>
        </div>
      );
    case "MEAT_QUERY_STORED":
      return `Changed from ${item.previousProcessedState} to Meat Query Stored`;
    case "COMPLETED":
      return (
        <div className="flex">
          Changed from{" "}
          <span
            style={{
              color: getStatusColor(item?.previousProcessedState || ""),
              fontSize: "12px",
              padding: "0 5px",
            }}
          >
            {item?.previousProcessedState}
          </span>{" "}
          to <span className={commanStyle.completedColor}> COMPLETED</span>
        </div>
      );
    case "MOVED_DELETED_TO_VALID":
      return (
        <div className="flex">
          {item.diagnosisCode} - Moved from{" "}
          <span className={commanStyle.deletedColor}>DELETED</span> to{" "}
          <span className={commanStyle.validColor}> VALID</span>
        </div>
      );
    case "MOVED_DELETED_TO_SUGGESTED":
      return (
        <div className="flex">
          {item.diagnosisCode} - Moved from{" "}
          <span className={commanStyle.deletedColor}>DELETED</span> to{" "}
          <span className={commanStyle.suggestedColor}>
            {/* SUGGESTED */}
            CAREGAP
          </span>
        </div>
      );
    case "MOVED_SUGGESTED_TO_DELETED":
      return (
        <div className="flex w-100">
          {item.diagnosisCode} - Moved from{" "}
          <span className={commanStyle.suggestedColor}>
            {/* SUGGESTED */}
            CAREGAP
          </span>{" "}
          to <span className={commanStyle.deletedColor}> DELETED</span>
        </div>
      );
    case "ENCOUNTER_FILE_UPDATED":
      return `${item.diagnosisCode} - Encounter file updated`;
    case "ENCOUNTER_FILE_ADDED":
      return `${item.diagnosisCode} - Encounter file added`;
    case "MEAT_ADDED":
      return `${item.diagnosisCode} - Meat added`;
    case "DISEASE_EDITED":
      return (
        <div className="flex w-100 justify-between">
          {item.diagnosisCode} - DISEASE EDITED
          <Popover
            open={popClickDisCode === index ? true : false}
            trigger={["hover"]}
            placement="bottom"
            overlayStyle={{ zIndex: 9999 }}
            content={
              <>
                {getEditDeatils({
                  viewValue: item,
                  setIsPopupOpen,
                  setPopClickDisCode,
                })}
              </>
            }
          >
            <span
              className={styles.viewTag}
              onClick={() => onClickPopup({ disCode: index })}
            >
              View
            </span>{" "}
          </Popover>
        </div>
      );
    case "MEAT_EDITED":
      return (
        <div className="flex w-100 justify-between">
          {item?.previousMeatDetail?.diagnosisCode} - MEAT EDITED
        </div>
      );
    case "PROVIDER_EDITED":
      return (
        <div className="flex w-100 justify-between">
          {getHtmlContent({ htmlContent: item?.htmlContent })}
          <Popover
            open={popClickDisCode === index ? true : false}
            trigger={["hover"]}
            placement="bottom"
            overlayStyle={{ zIndex: 9999 }}
            content={
              <>
                {getEditDeatils({
                  viewValue: item,
                  setIsPopupOpen,
                  setPopClickDisCode,
                })}
              </>
            }
          >
            <span
              className={styles.viewTag}
              onClick={() => onClickPopup({ disCode: index })}
            >
              View
            </span>{" "}
          </Popover>
        </div>
      );
    case "HOLD":
      return (
        <div className="flex">
          Changed from{" "}
          <span
            style={{
              color: getStatusColor(item?.previousProcessedState || ""),
              fontSize: "12px",
              padding: "0 5px",
            }}
          >
            {item?.previousProcessedState}
          </span>{" "}
          to <span className={commanStyle.holdColor}>HOLD</span>
        </div>
      );
    case "DECLINED":
      return (
        <div className="flex">
          Changed from{" "}
          <span
            style={{
              color: getStatusColor(item?.previousProcessedState || ""),
              fontSize: "12px",
              padding: "0 5px",
            }}
          >
            {item?.previousProcessedState}
          </span>{" "}
          to <span className={commanStyle.declinedColor}> DECLINED</span>
        </div>
      );
    case "PENDING":
      return (
        <div className="flex">
          Changed from{" "}
          <span
            style={{
              color: getStatusColor(item?.previousProcessedState || ""),
              fontSize: "12px",
              padding: "0 5px",
            }}
          >
            {item?.previousProcessedState}
          </span>{" "}
          to <span className={commanStyle.pendingColor}> PENDING</span>{" "}
        </div>
      );
    case "FLAG_ADDED":
      return (
        <div className="flex">
          Flag Added -{" "}
          {item?.flagDetails?.flagName
            ? item?.flagDetails?.flagName.replaceAll("_", " ")
            : ""}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 800 800"
            fill={item?.flagDetails?.flagColour}
          >
            <path
              d="M223 100V102H225H696.392L573.304 298.94L572.642 300L573.304 301.06L696.392 498H225H223V500V748H152V52H223V100Z"
              stroke="#000"
              stroke-width="10"
            />
          </svg>
        </div>
      );
    case "FLAG_REMOVED":
      return (
        <div className="flex">
          Flag Removed -{" "}
          {item?.flagDetails?.flagName
            ? item?.flagDetails?.flagName.replaceAll("_", " ")
            : ""}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 800 800"
            fill={item?.flagDetails?.flagColour}
          >
            <path
              d="M223 100V102H225H696.392L573.304 298.94L572.642 300L573.304 301.06L696.392 498H225H223V500V748H152V52H223V100Z"
              stroke="#000"
              stroke-width="10"
            />
          </svg>
        </div>
      );
    case "COMMENT_ADDED":
      return (
        <div className="flex w-100 justify-between">
          <strong>Comment Added </strong>
          <Popover
            open={popClickDisCode === index}
            trigger={["hover"]}
            placement="bottom"
            overlayStyle={{ zIndex: 9999 }}
            content={
              <div className="flex justify-between">
                <span className={`${styles.textContent}`}>
                  {item?.actionNotes}
                </span>
                <IoMdCloseCircle
                  onClick={() => onClickPopup({ disCode: null })}
                  className={`${styles.closeIcon}`}
                />
              </div>
            }
          >
            <span
              className={styles.viewTag}
              onClick={() => onClickPopup({ disCode: index })}
            >
              View
            </span>
          </Popover>
        </div>
      );
    case "COMMENT_REMOVED":
      return (
        <div className="flex w-100 justify-between">
          <strong>Comment Removed </strong>
        </div>
      );
    case "NOTES_ADDED":
      return (
        <div className="flex w-100 justify-between">
          <strong>Notes Added </strong>
          <Popover
            open={popClickDisCode === index}
            trigger={["hover"]}
            placement="bottom"
            overlayStyle={{ zIndex: 9999 }}
            content={
              <div className="flex justify-between">
                <span className={`${styles.textContent}`}>
                  {item?.actionNotes}
                </span>
                <IoMdCloseCircle
                  onClick={() => onClickPopup({ disCode: null })}
                  className={`${styles.closeIcon}`}
                />
              </div>
            }
          >
            <span
              className={styles.viewTag}
              onClick={() => onClickPopup({ disCode: index })}
            >
              View
            </span>
          </Popover>
        </div>
      );
    case "NOTES_REMOVED":
      return (
        <div className="flex w-100 justify-between">
          <strong>Notes Removed </strong>
        </div>
      );
    default:
      return (
        <div className="flex">
          Changed from
          <span
            style={{
              color: getStatusColor(item?.previousProcessedState || ""),
              fontSize: "12px",
              padding: "0 5px",
            }}
          >
            {item?.previousProcessedState}
          </span>
          to {underScoreRemove({ value: item?.action })}
        </div>
      );
  }
};
