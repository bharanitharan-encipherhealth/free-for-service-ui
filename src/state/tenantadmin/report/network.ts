import { requestPortal, requestPortalExcel } from "@/util/network";
import { getStorage } from "@/util/storage";

export async function tabList() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`dbservice/mci/report/page-data`, options);
  return data;
}

export async function reportDownloadCall({
  formData,
  patientType,
}: {
  formData: string[];
  patientType: string;
}) {
  if (!formData || !patientType) return;
  const options = {
    method: "POST",
    body: JSON.stringify({
      fileNames: formData,
      patientType: patientType,
    }),
  };
  const data = await requestPortalExcel(
    `management/patient/report/download`,
    options
  );
  return data;
}

export async function reportViewCall({ blobId }: { blobId: string }) {
  if (!blobId) return;
  const options = {
    method: "GET",
  };
  const data = await requestPortalExcel(
    `management/patient/report/view/${blobId}`,
    options
  );
  return data;
}
