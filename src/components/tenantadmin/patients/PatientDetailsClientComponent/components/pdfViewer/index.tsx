import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import { Skeleton } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";

import noData from "@/../public/images/avatar/noData.png";
import { getStorage } from "@/util/storage";

import { pdfEncrypt } from "@/util/reusableFunction";
import { pdfControl, portalPdfUrl, serverControl } from "@/util/config";
import { LiaWindowCloseSolid } from "react-icons/lia";
import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";

type PdfViewerReduxType = ConnectedProps<typeof connector>;

type pdfViewerPropsType = PdfViewerReduxType & { activeTab: number };
function PdfViewer({
  fileIdCheckLoading,
  patientHccFileActionLoading,
  fileIdCheck,
  patientHccFileDetails,
  selectedPageNumber,
  pdfSearchValue,
  setPdfView,
  pdfView,
  activeTab,
}: pdfViewerPropsType) {
  const [iframeSrc, setIframeSrc] = useState<string>("");
  const [emptyText, setEmptyText] = useState<boolean>(false);

  useEffect(() => {
    const pageNo = selectedPageNumber || pdfSearchValue?.page;
    const header = {
      "X-Role-Id": getStorage("roleId"),
      "X-Client": getStorage("client"),
      "X-Org": getStorage("orgId"),
      "X-Project": getStorage("project"),
      "X-Org-based": "true",
    };

    if (!Array?.isArray(patientHccFileDetails)) {
      const fileIdValue = getStorage("fileId");

      if (!fileIdValue) {
        console.log("fileId is null or undefiend in storage");
        return;
      }
      const getData = pdfEncrypt(fileIdValue);
      const pdfUrl = encodeURIComponent(getData.pass);
      let searchUrl = "";
      searchUrl = `${portalPdfUrl}?file=${pdfUrl}&salt=${getData.iv}&token=${getStorage(
        "token",
      )}&baseEnv=${serverControl}&pdfEnv=${pdfControl}&header=${JSON.stringify(
        header,
      )}`;
      if (pdfSearchValue?.value || pageNo || pdfSearchValue?.headerContent) {
        const queryParams = [];
        if (pdfSearchValue?.value) {
          const encodedSearchQuery = encodeURIComponent(
            `${pdfSearchValue?.value}`,
          );
          queryParams.push(
            `search=${encodedSearchQuery.toLocaleLowerCase()}&casesensitive=true&phrase=true&wholeword=true&entireword=true&headers=${pdfSearchValue?.headers}`,
          );
        }
        if (pageNo) {
          queryParams.push(`page=${pageNo}`);
        }
        if (pdfSearchValue?.headerContent) {
          queryParams.push(`headerContent=${pdfSearchValue?.headerContent}`);
        }
        searchUrl += `#${queryParams.join("&")}`;
      }
      setIframeSrc(searchUrl);
    } else {
      setTimeout(() => {
        setEmptyText(true);
      }, 1000);
    }
  }, [patientHccFileDetails?.azureBlobPath, pdfSearchValue]);
  return (
    <div className="h-full w-full">
      {fileIdCheckLoading || patientHccFileActionLoading ? (
        <div className="h-full w-full">
          <Skeleton.Input className="w-full h-full" active />
        </div>
      ) : !patientHccFileDetails?.azureBlobPath || !fileIdCheck ? (
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
      ) : iframeSrc ? (
        <div className="flex gap-2 h-full w-full">
          <div className="w-full">
            <iframe
              id="pdfViewer"
              title="PDF Viewer"
              className="h-full w-full"
              src={iframeSrc}
            />
          </div>
          {activeTab != 1 && (
            <div onClick={() => setPdfView(!pdfView)}>
              <LiaWindowCloseSolid className="text-red-500 text-2xl cursor-pointer" />
            </div>
          )}
        </div>
      ) : (
        emptyText && <div className="h-full">File Not Found</div>
      )}
    </div>
  );
}

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    fileIdCheckLoading: state?.patientDetailsReducer?.getFileIdCheckLoading,
    patientHccFileActionLoading:
      state?.patientDetailsReducer?.patientHccFieLoading,

    fileIdCheck: state?.patientDetailsReducer?.getFileIdCheck?.data?.response,
    patientHccFileDetails:
      state?.patientDetailsReducer?.patientHccFileDetails?.data?.response,
    selectedPageNumber: state?.patientDetailsReducer?.getSelectedDosPageNumber,
    pdfSearchValue: state?.patientDetailsReducer?.setPdfSearch,
    pdfView: state?.patientDetailsReducer?.setPdfView,
  }),
  { setPdfView: patientDetailsAction?.setPdfView },
);

export default connector(PdfViewer);
