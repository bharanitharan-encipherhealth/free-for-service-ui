import { Hyperlink } from "@/models/tenantadmin/patients/details";
import {
  meatHyperLinkType,
  renderMeatFoundType,
  renderProviderSectionType,
} from "@/models/tenantadmin/patients/DiagnosisDetails";
import { getDateFormat, reusableEllipses } from "@/util/reusableFunction";
import { notification, Popover, Tooltip } from "antd";
import style from "../../../style.module.css";

export const handlePdfSearch = ({
  setPdfSearch,
  hyperlink,
  pdfSearchValue,
}: {
  setPdfSearch?: (params: {
    value: string;
    page: number;
    headers?: boolean;
    headerContent?: string;
  }) => void;
  hyperlink?: Hyperlink;
  pdfSearchValue?: {
    value: string;
    page: number;
    headers?: boolean;
    headerContent?: string;
  };
}) => {
  if (pdfSearchValue?.page == hyperlink?.pageNumber) {
    notification?.warning({
      message: "This detail also same page",
      placement: "top",
      duration: 1,
    });
  }
  if (setPdfSearch) {
    setPdfSearch({
      value: hyperlink?.substring ? hyperlink?.substring : "",
      page: hyperlink?.pageNumber ? hyperlink?.pageNumber : 0,
      headers: true,
      headerContent: hyperlink?.header,
    });
  }
};

export const getPopOverContent = ({
  hyperLink,
  setPdfSearch,
  pdfSearchValue,
}: {
  hyperLink?: Hyperlink[];
  setPdfSearch?: (params: {
    value: string;
    page: number;
    headers?: boolean;
    headerContent?: string;
  }) => void;
  pdfSearchValue?: {
    value: string;
    page: number;
    headers?: boolean;
    headerContent?: string;
  };
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {hyperLink?.map((item, index) => (
        <span
          key={index}
          className={`cursor-pointer ${style?.hyperLinkPopover}`}
          onClick={() =>
            handlePdfSearch({ setPdfSearch, hyperlink: item, pdfSearchValue })
          }
        >
          {getDateFormat(item?.dateOfService?.split("_")[0], true)}
        </span>
      ))}
    </div>
  );
};

export const getPopoverContentMeat = ({
  title,
  aspectValue,
  item,
  setPdfSearch,
  pdfSearchValue,
}: {
  title: string;
  aspectValue: string;
  item: Hyperlink;
  setPdfSearch?: (params: {
    value: string;
    page: number;
    headers?: boolean;
    headerContent?: string;
  }) => void;
  pdfSearchValue?: {
    value: string;
    page: number;
    headers?: boolean;
    headerContent?: string;
  };
}) => {
  return (
    <div>
      <div className="flex flex-col gap-1 col-span-4">
        <div>{title}</div>
        <div>{aspectValue}</div>
        <div className="flex gap-2">
          <div>
            {item?.header
              ?.toLowerCase()
              ?.split(",")
              ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) +
              "(Document Word)"}
          </div>
          <div>{`Page No - (${item?.pageNumber})`}</div>
          <div
            className={`${style?.dateOfServiceColor} cursor-pointer`}
            onClick={() =>
              handlePdfSearch({ setPdfSearch, pdfSearchValue, hyperlink: item })
            }
          >
            {getDateFormat(item?.dateOfService?.split("_")[0])}
          </div>
        </div>
      </div>
    </div>
  );
};
export const renderProviderSection = ({
  setPdfSearch,
  capture,
  hyperLinks,
  pdfSearchValue,
  hyperlinkKey,
  isDateShow,
  sectionName,
}: renderProviderSectionType) => {
  const captureSlice = capture?.slice(0, 2);
  const restLength = capture?.slice(2)?.length;

  const renderSection = captureSlice?.map((item, index) => {
    const hyperLink =
      hyperLinks?.filter(
        (link) =>
          String(link?.[hyperlinkKey])?.toLowerCase() === item?.toLowerCase(),
      ) || [];
    if (hyperLink?.length === 1)
      return (
        <div
          key={index}
          className={`cursor-pointer ${sectionName === "providerSection" ? style?.providerColor : sectionName === "dateSection" ? style?.dateOfServiceColor : sectionName === "captureSection" && style?.captureSectionColor} text-sm`}
          onClick={() =>
            handlePdfSearch({
              setPdfSearch,
              hyperlink: hyperLink?.[0],
              pdfSearchValue,
            })
          }
        >
          {isDateShow
            ? getDateFormat(item?.split("_")[0])
            : reusableEllipses({
                str: item
                  .toLowerCase()
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" "),
                count: capture?.length > 1 ? 12 : 30,
              })}
        </div>
      );
    if (hyperLink?.length > 1)
      return (
        <Popover
          key={index}
          placement="bottomLeft"
          className={`cursor-pointer text-sm ${sectionName === "providerSection" ? style?.providerColor : sectionName === "dateSection" ? style?.dateOfServiceColor : sectionName === "captureSection" && style?.captureSectionColor}`}
          content={
            <div
              style={{ height: "150px", overflow: "scroll", width: "100px" }}
            >
              {getPopOverContent({
                hyperLink,
                setPdfSearch,
                pdfSearchValue,
              })}
            </div>
          }
        >
          {isDateShow
            ? getDateFormat(item?.split("_")[0])
            : reusableEllipses({
                str: item
                  .toLowerCase()
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" "),
                count: capture?.length > 1 ? 12 : 30,
              })}
        </Popover>
      );
    if (!hyperLink.length)
      return (
        <div
          className={`text-sm ${sectionName === "providerSection" ? style?.providerColor : sectionName === "dateSection" ? style?.dateOfServiceColor : sectionName === "captureSection" && style?.captureSectionColor}`}
          key={index}
        >
          {isDateShow
            ? getDateFormat(item?.split("_")[0])
            : reusableEllipses({
                str: item
                  .toLowerCase()
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" "),
                count: capture?.length > 1 ? 12 : 30,
              })}
        </div>
      );
  });

  return (
    <>
      {renderSection}
      {restLength > 0 && (
        <div
          className={`${style?.restLength} rounded-full text-xs text-center p-1 cursor-pointer`}
          onClick={() => {}}
        >
          {"+" + restLength}
        </div>
      )}
    </>
  );
};

export const renderMeatFound = ({
  meatList,
  code,
  value,
}: renderMeatFoundType) => {
  const meat = meatList?.filter(
    (list) => list?.diagnosisCode?.toLowerCase() == code?.toLowerCase(),
  );
  let backgroundColor;
  let meatTitle;

  if (meat?.length != 0) {
    switch (value) {
      case "M":
        if (meat?.[0]?.monitorAspect) backgroundColor = true;
        meatTitle = "Monitor";
        break;
      case "E":
        if (meat?.[0]?.evaluateAspect) backgroundColor = true;
        meatTitle = "Evaluate";
        break;
      case "A":
        if (meat?.[0]?.assessmentAspect) backgroundColor = true;
        meatTitle = "Assessment";
      case "T":
        if (meat?.[0]?.treatmentAspect) backgroundColor = true;
        meatTitle = "Treatment";
        break;
      default:
        meatTitle = "";
    }
  }

  return (
    <Tooltip title={meatTitle} placement="top">
      <span
        className={`${backgroundColor ? style?.meatFound : style?.meatNotFound} inline-flex items-center justify-center rounded-md text-xs font-semibold min-w-5.5 min-h-5.5`}
      >
        {value}
      </span>
    </Tooltip>
  );
};

export const meatHyperLink = ({
  hyperlinks,
  setPdfSearch,
  pdfSearchValue,
  title,
  aspectValue,
}: meatHyperLinkType) => {
  const hyperlinkSlice = hyperlinks?.slice(0, 2);
  const resetHyprLink = hyperlinks?.slice(2)?.length;
  const renderSection = hyperlinkSlice?.map((item, index) => (
    <Popover
      key={index}
      content={getPopoverContentMeat({
        title,
        aspectValue,
        item,
        setPdfSearch,
        pdfSearchValue,
      })}
      className={`${style?.captureSectionColor} cursor-pointer`}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {reusableEllipses({
          str: item?.header
            ?.toLowerCase()
            ?.split(" ")
            ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1)),
          count: 20,
        })}
      </div>
    </Popover>
  ));
  return (
    <div className="flex gap-3 flex-wrap">
      {renderSection}
      {resetHyprLink > 0 && (
        <div
          className={`${style?.restLength} rounded-full text-xs text-center p-1 cursor-pointer w-20`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {"+" + resetHyprLink}
        </div>
      )}
    </div>
  );
};
