import {
  patientDetailsResposneType,
  patientListFilterPropsType,
} from "@/models/tenantadmin/patients/details";
import { requestPortal } from "@/util/network";
import { getStorage, setStorage } from "@/util/storage";

// api call for patient details
export async function patientIdDetails({
  navigate,
  dataEmpty = false,
}: {
  navigate: string;
  dataEmpty: boolean;
}) {
  const patientId = getStorage("patientId");
  const userRoleId = getStorage("roleId");
  if (dataEmpty == true) {
    return null;
  }
  const isTinDetailsPage = navigate
    ? navigate.endsWith("/tindetails/masteraudit")
    : "";

  const options = {
    method: "GET",
  };

  let url = `dbservice/status/patient/get?patientId=${patientId}&roleId=${userRoleId}`;
  if (isTinDetailsPage) {
    url += `&masterAudit=true`;
  }

  try {
    const data = await requestPortal(url, options);
    return data;
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return null;
  }
}

// year call

export async function getAllProcessYear({
  type,
  admNo,
}: {
  type: string;
  admNo: string;
}) {
  const patientId = getStorage("patientId");
  const options = {
    method: "GET",
  };

  let URL = `dbservice/patient/compute/get/allyear?patientId=${patientId}`;

  if (type?.toLowerCase() == "inpatient") {
    URL = `dbservice/patient/compute/get/allyear?admNo=${admNo}`;
  }
  const data = await requestPortal(URL, options);
  return data;
}

// dos call
export async function dosWiseList({
  year,
  dataNull = false,
  navigate,
  chartType = "",
  admissionNumber,
}: {
  year: number;
  dataNull: boolean;
  navigate: string;
  chartType: string;
  admissionNumber: { patientType: string; batchDate: string; admNo: string };
}) {
  if (dataNull === true || !chartType || !year) {
    return null;
  }
  const patientId = getStorage("patientId");
  const userRoleId = getStorage("roleId");
  const isTinDetailsPage = navigate
    ? navigate.endsWith("/tindetails/masteraudit")
    : "";
  const masterAudit = isTinDetailsPage ? "true" : "";

  const options = {
    method: "GET",
  };

  let url = `dbservice/status/patient/get/alldos?patientId=${patientId}&processedYear=${year}&roleId=${userRoleId}&chartType=${chartType}`;
  if (masterAudit) {
    url += `&masterAudit=${masterAudit}`;
  }

  if (admissionNumber?.batchDate) {
    url += `&batchDate=${admissionNumber?.batchDate}`;
  }
  if (admissionNumber?.patientType == "INPATIENT" && admissionNumber?.admNo) {
    url += `&admNo=${admissionNumber?.admNo}`;
  }

  try {
    const data = await requestPortal(url, options);
    return data;
  } catch (error) {
    console.error("Error fetching DOS list:", error);
    return null;
  }
}

// patient dos detials (disease)
export async function patientDetails({
  patientId,
  dos,
  setIsSpinnerLoading,
  dataNull = false,
  navigate,
  admissionNumber,
}: {
  patientId: string;
  dos: string;
  setIsSpinnerLoading: React.Dispatch<React.SetStateAction<boolean>>;
  dataNull: boolean;
  navigate: string;
  admissionNumber: { patientType: string; batchDate: string; admNo: string };
}) {
  if (!dos || dataNull === true) {
    return null;
  }

  const userRoleId = getStorage("roleId");
  const isTinDetailsPage = navigate
    ? navigate.endsWith("/tindetails/masteraudit")
    : "";
  const masterAudit = isTinDetailsPage ? "true" : "";

  const options = {
    method: "GET",
  };

  let url = `dbservice/status/patient/compute/get?patientId=${patientId}&dateOfService=${
    dos ? dos : ""
  }&roleId=${userRoleId}`;
  if (masterAudit) {
    url += `&masterAudit=${masterAudit}`;
  }
  if (admissionNumber?.patientType == "INPATIENT" && admissionNumber?.admNo) {
    url += `&admNo=${admissionNumber?.admNo}`;
  }

  try {
    const data = await requestPortal(url, options);
    return data;
  } catch (error) {
    console.error("Error fetching patient details:", error);
    if (setIsSpinnerLoading) {
      setIsSpinnerLoading(false);
    }
    return error;
  }
}

// check the file id is there
export async function findByPatientId({ patientId = "", year = "" }) {
  const options = {
    method: "GET",
  };
  // const { patientId = "" } = getLocalStored();

  const result = await requestPortal(
    `dbservice/fileDetail/find-fileid-by-patientid?patientId=${patientId}&year=${year
      ?.toString()
      ?.trim()}`,
    options,
  );
  // setStorage("fileId", result?.response?.azureBlobPath || null);
  return result;
}

export async function patientHccFile({ fileId }: { fileId: string }) {
  const options = {
    method: "GET",
  };
  setStorage("fileIds", fileId);
  const result = await requestPortal(
    `dbservice/fileDetail/findbyid?fileId=${fileId ? fileId : ""}`,
    options,
  );
  setStorage("fileId", result?.response?.azureBlobPath || null);
  return result;
}

//  work queue api calls
export const patientListFilter = async ({
  userId,
  // status,
  searchText,
  // startDate,
  // endDate,
  // processedStart,
  // processedEnd,
  pageNo,
}: patientListFilterPropsType) => {
  const options = {
    method: "GET",
  };

  const role = getStorage("headerAliasName")?.replace(/_/g, "").toLowerCase();
  const tin = getStorage("tinNumber");
  const pageId = "502745ab-e131-4663-8702-94603ff1e8e6";

  const path = typeof window !== "undefined" ? window.location.pathname : "";
  let isQueried = false;
  let isReAssigned = false;

  if (path.endsWith("/reviewer/queried/details")) {
    isQueried = true;
  } else if (path.endsWith("/reviewer/reassign/details")) {
    isReAssigned = true;
  }
  const additionalFlags = `&isQueried=${isQueried}&isReAssigned=${isReAssigned}`;

  const processedFilters =
    role === "qa"
      ? `&tin=${tin}&patientAllocated=${userId}`
      : `&patientAllocated=${userId}`;

  const response = await requestPortal(
    `dbservice/table/view?pageId=${pageId}&page=${pageNo}&size=15${processedFilters}&patientName=${searchText}`,
    options,
  );

  return response;
};

export async function getTimelineList({
  dos,
  currentFileView,
  admissionNumber,
  role,
  action,
}: {
  dos: string;
  role: string;
  action: string;
  currentFileView: string;
  admissionNumber: { patientType: string; batchDate: string; admNo: string };
}) {
  const patientId = getStorage("patientId");
  const options = {
    method: "GET",
  };

  let url = `dbservice/actioneventaudit?patientId=${patientId}&dateOfService=${
    dos ? dos : ""
  }&pageno=${0}&pagesize=${100}&currentFileViewRoute=${currentFileView || ""}&role=${role || ""}&action=${action || ""}`;

  if (admissionNumber?.patientType == "INPATIENT" && admissionNumber?.admNo)
    url += `&admNo=${admissionNumber?.admNo}`;

  const res = await requestPortal(url, options);
  return res;
}

export async function getAction() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/actioneventaudit/getaction`,
    options,
  );
  return data;
}

export async function getCommentList({
  patientId,
  yearData,
  admissionNumber,
}: {
  patientId: string;
  yearData: patientDetailsResposneType;
  admissionNumber: { patientType: string; batchDate: string; admNo: string };
}) {
  const options = {
    method: "GET",
  };
  let url = `dbservice/comment?patientId=${patientId}&processedYear=${
    yearData?.processedYear || ""
  }&dateOfService=${yearData?.dateOfService || ""}`;

  if (admissionNumber?.patientType == "INPATIENT" && admissionNumber?.admNo) {
    url += `&admNo=${admissionNumber?.admNo}`;
  }
  const data = await requestPortal(url, options);
  return data;
}

export async function addComments({
  commentsData,
}: {
  commentsData: {
    patientId: string;
    userComment: string;
    processedYear: number;
    dateOfService: string;
    admNo?: string;
  };
}) {
  const options = {
    method: "POST",
    body: JSON.stringify(commentsData),
  };
  const data = await requestPortal(`dbservice/comment`, options);
  return data;
}

export async function deleteComments({
  removePayload,
}: {
  removePayload: {
    patientId: string;
    commentId: string;
    processedYear: number;
    dateOfService: string;
    admNo?: string;
  };
}) {
  const options = {
    method: "DELETE",
    body: JSON.stringify(removePayload),
  };
  const data = await requestPortal(`dbservice/comment/delete`, options);
  return data;
}

export async function getNotesLists({
  patientId,
  yearData,
  admissionNumber,
}: {
  patientId: string;
  yearData: patientDetailsResposneType;
  admissionNumber: { patientType: string; batchDate: string; admNo: string };
}) {
  const options = {
    method: "GET",
  };
  let url = `dbservice/notes?patientId=${patientId}&processedYear=${
    yearData?.processedYear ? yearData?.processedYear : ""
  }&dateOfService=${yearData?.dateOfService ? yearData?.dateOfService : ""}`;

  if (admissionNumber?.patientType == "INPATIENT" && admissionNumber?.admNo) {
    url += `&admNo=${admissionNumber?.admNo}`;
  }

  const data = await requestPortal(url, options);
  return data;
}

export async function addNotes({
  notesPayload,
}: {
  notesPayload: {
    patientId: string;
    note: string;
    processedYear: number;
    dateOfService: string;
    admNo?: string;
  };
}) {
  const options = {
    method: "POST",
    body: JSON.stringify(notesPayload),
  };
  const data = await requestPortal(`dbservice/notes`, options);
  return data;
}

export async function deleteNotes({
  removePayload,
}: {
  removePayload: {
    patientId: string;
    noteId: string;
    processedYear: number;
    dateOfService: string;
    admNo?: string;
  };
}) {
  const options = {
    method: "DELETE",
    body: JSON.stringify(removePayload),
  };
  const data = await requestPortal(`dbservice/notes/delete`, options);
  return data;
}

export async function getRevertDetails({
  dos,
  admissionNumber,
}: {
  dos: string;
  admissionNumber: { patientType: string; batchDate: string; admNo: string };
}) {
  const patientId = getStorage("patientId");
  const options = {
    method: "GET",
  };
  let url = `dbservice/actioneventaudit/revert-history?patientid=${patientId}&dateOfService=${
    dos ? dos : ""
  }`;

  if (admissionNumber?.patientType == "INPATIENT" && admissionNumber?.admNo)
    url += `&admNo=${admissionNumber?.admNo}`;

  const data = await requestPortal(url, options);
  return data;
}
