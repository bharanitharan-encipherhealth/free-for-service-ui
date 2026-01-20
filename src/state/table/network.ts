import { requestPortal } from "@/util/network";
import {
  activeTinPageId,
  assignUserPageId,
  generatedReportsPageId,
  generateViewPageId,
  moveBackPageId,
  patientAllocationPageId,
  patientPageId,
  queriedPageId,
  queryApprovalPageId,
  reAllocationPageId,
  reAssignedPageId,
  userCreatePageId,
  workQueuePageId,
} from "@/util/pageIds";
import {
  convertToCustomParams,
  convertToCustomParamsDatePicker,
} from "@/util/reusableFunction";
import { getStorage } from "@/util/storage";
import { tableApiParamsType } from "./model";
import { getReportTableCallType } from "@/models/tenantadmin/report";

const requestManager = {
  tableRequests: new Map<string, AbortController>(),
  currentTableKey: null as string | null,

  getAbortController(key: string) {
    // Abort previous request
    if (this.currentTableKey && this.tableRequests.has(this.currentTableKey)) {
      const prevController = this.tableRequests.get(this.currentTableKey);
      prevController?.abort();
      this.tableRequests.delete(this.currentTableKey);
    }

    const controller = new AbortController();
    this.currentTableKey = key;
    this.tableRequests.set(key, controller);

    return controller;
  },

  removeController(key: string) {
    this.tableRequests.delete(key);
    if (this.currentTableKey === key) {
      this.currentTableKey = null;
    }
  },
};

export async function getTableView({
  pageId,
  pageNo,
  pageSize,
  selectedOption,
  sort,
  selectedDateRanges,
  searchText,
  activeStatus,
  roleId,
  selectedRole,
  isReAssigned,
  isQueried,
  patientAllocated,
  queryStatus,
  isAdmin,
  tin = "",
  allTinIds,
  cilentBased,
  reloadTrue,
  search,
  tincompleted,
  qaLead,
  projectLead,
  isMasterAudit,
  router,
  allClient,
  allProject,
  allTin,
  clientId,
  projectId,
  reportCategory,
  downloaderLead,
  signal,
}: tableApiParamsType) {
  if (reloadTrue) return null;

  // 🔑 Stable request key (NO Date.now)
  const routerPath = router || "";
  const requestKey = `table_${pageId}_${activeStatus || ""}_${
    pageNo || 0
  }_${routerPath}`;

  const abortController = requestManager.getAbortController(requestKey);
  const finalSignal = signal || abortController.signal;

  const options = {
    method: "GET",
    signal: finalSignal,
  };

  try {
    let searchTextParams = null;
    let selectParams = null;
    let dateRagngesParams = null;
    let searchIntParams = null;
    if (searchText) {
      searchTextParams = convertToCustomParams(searchText);
    }
    if (search) {
      searchIntParams = convertToCustomParams(search);
    }
    if (selectedOption) {
      if (selectedOption?.tinIds) {
        allTin = false;
      }
      selectParams = convertToCustomParams(selectedOption);
    }
    if (selectedDateRanges) {
      dateRagngesParams = convertToCustomParamsDatePicker(selectedDateRanges);
    }

    const statusKey = isQueried ? "approvalStatus" : "processedStatus";
    const uId = getStorage("userId");

    const role = getStorage("proxyRole");

    let baseUrl = `dbservice/table/view?pageId=${pageId}&page=${pageNo}&size=${
      pageSize || 15
    }&${statusKey}=${activeStatus || ""}&roleId=${roleId || ""}&aliasName=${
      selectedRole || ""
    }&queryStatus=${queryStatus || ""}&isAdmin=${isAdmin || ""}&sortDirection=${
      sort?.sortDir ? sort?.sortDir : "DESC"
    }&sortField=${sort?.sortField ? sort?.sortField : ""}&allClient=${
      allClient || false
    }&allProject=${allProject || false}&allTin=${allTin || false}&clientId=${
      clientId || ""
    }&projectId=${projectId || ""}`;

    const allowedPageIds = [reAssignedPageId, queriedPageId, workQueuePageId];
    const clientBasesPageIds = [assignUserPageId, userCreatePageId];
    const masterAuditpageIds = [patientAllocationPageId, reAllocationPageId];
    if (masterAuditpageIds.includes(pageId)) {
      baseUrl += `&isMasterAudit=${isMasterAudit || false}`;
    }

    if (allowedPageIds.includes(pageId)) {
      baseUrl += `&isReAssigned=${isReAssigned || false}&isQueried=${
        isQueried || false
      }`;
    }

    if (clientBasesPageIds.includes(pageId)) {
      baseUrl += `&cilentBased=${cilentBased || false}`;
    }
    //     if (role !== "TENANT_ADMIN" && role !== "OWNER" && role !== "DOWNLOADER") {
    //    baseUrl += `&patientAllocated=${patientAllocated || ""}`;
    //  }
    const allowedPageIdsForOwner = [
      workQueuePageId,
      queriedPageId,
      reAssignedPageId,
    ];

    if (
      (role !== "TENANT_ADMIN" &&
        role !== "QA_LEAD" &&
        role !== "OWNER" &&
        role !== "PROJECT_LEAD" &&
        role !== "DOWNLOADER") ||
      (role === "OWNER" && allowedPageIdsForOwner.includes(pageId)) ||
      (role !== "QA_LEAD" && allowedPageIdsForOwner.includes(pageId)) ||
      (role !== "PROJECT_LEAD" && allowedPageIdsForOwner.includes(pageId))
    ) {
      baseUrl += `&patientAllocated=${patientAllocated || ""}`;
    }
    const tinPageIds = [
      patientPageId,
      patientAllocationPageId,
      moveBackPageId,
      queryApprovalPageId,
      activeTinPageId,
      reAllocationPageId,
    ];

    if (tinPageIds.includes(pageId)) {
      baseUrl += `&tin=${tin || ""}&
allTinIds=${allTinIds || false}`;
    }

    const reportIds = [generateViewPageId];
    if (reportIds.includes(pageId)) {
      baseUrl += `&tincompleted=${tincompleted || ""}`;
    }
    const reportCategories = [generateViewPageId, generatedReportsPageId];
    if (reportCategories.includes(pageId)) {
      baseUrl += `&reportCategory=${reportCategory || ""}`;
    }

    const qaCodersPageIds = [workQueuePageId, queriedPageId, reAssignedPageId];
    const usersPageIds = [assignUserPageId];
    if (role === "QA" && qaCodersPageIds.includes(pageId)) {
      baseUrl += `&tin=${tin || ""}&allTinIds=${allTinIds || false}`;
    }
    if (role === "QA_LEAD" && usersPageIds.includes(pageId)) {
      baseUrl += `&qaLead=${qaLead || false}`;
    }
    if (role === "PROJECT_LEAD" && usersPageIds.includes(pageId)) {
      baseUrl += `&projectLead=${projectLead || false}`;
    }

    const masterPageIds = [workQueuePageId];

    if (router?.endsWith("/tindetails") && masterPageIds.includes(pageId)) {
      baseUrl += `&tin=${tin || ""}&allTinIds=${
        allTinIds || false
      }&isMasterAudit=true`;
    }
    const finalUrl = `${baseUrl}${searchTextParams || ""}${selectParams || ""}${
      dateRagngesParams || ""
    }${searchIntParams || ""}`;

    const data = await requestPortal(finalUrl, options);

    requestManager.removeController(requestKey);
    return data;
  } catch (error: any) {
    requestManager.removeController(requestKey);

    // 🔕 Abort → ignore silently
    if (error?.name === "AbortError" || finalSignal.aborted) {
      return null;
    }

    // 🌐 Network error
    if (!navigator.onLine) {
      throw new Error("No internet connection. Please check your network.");
    }

    // 🧯 Server error
    if (error?.response?.status >= 500) {
      throw new Error(
        "Server error while loading data. Please try again later."
      );
    }

    // ❓ Generic error
    throw new Error("Unable to load table data. Please refresh or try again.");
  }
}

export async function getTable({
  pageId,
  pageNo,
  pageSize,
  activeStatus,
  roleId,
  selectedRole,
  allPatientIds,
  search,
  searchText,
  selectedOption,
  selectedDateRanges,
  reloadTrue,
  isMasterAudit,
}: tableApiParamsType) {
  if (!reloadTrue) {
    const options = {
      method: "GET",
    };
    const tin = getStorage("tinNumber");
    let searchTextParams = null;
    let selectParams = null;
    let dateRagngesParams = null;
    let searchIntParams = null;
    if (searchText) {
      searchTextParams = convertToCustomParams(searchText);
    }
    if (search) {
      searchIntParams = convertToCustomParams(search);
    }
    if (selectedOption) {
      selectParams = convertToCustomParams(selectedOption);
    }
    if (selectedDateRanges) {
      dateRagngesParams = convertToCustomParamsDatePicker(selectedDateRanges);
    }

    const baseUrl = `dbservice/table/view?pageId=${pageId}&page=${pageNo}&size=${pageSize}&status=${
      activeStatus ? activeStatus : ""
    }&roleId=${roleId ? roleId : ""}&aliasName=${
      selectedRole ? selectedRole : ""
    }&allPatientIds=${allPatientIds ? allPatientIds : ""}&tin=${
      tin || ""
    }&isMasterAudit=${isMasterAudit || false}`;
    const finalUrl = `${baseUrl}${searchTextParams || ""}${selectParams || ""}${
      dateRagngesParams || ""
    }${searchIntParams || ""}`;
    const data = await requestPortal(finalUrl, options);
    return data;
  } else {
    return null;
  }
}

export async function dynamicColumn({
  payload,
}: {
  payload: { pageId: string; headerNames: string[] };
}) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const data = await requestPortal(`dbservice/table/column`, options);
  return data;
}

export async function tableCall({
  patientType,
  searchText,
  dateRange,
  pageNo,
  allAzureBlobPath = false,
}: getReportTableCallType) {
  const options = {
    method: "GET",
  };

  const startDate = dateRange?.startDate?.split("T")[0];
  const endDate = dateRange?.endDate?.split("T")[0];
  const data = await requestPortal(
    `dbservice/am/report/table/view?patientType=${patientType}&fileName=${
      searchText?.fileName || ""
    }&startDate=${startDate || ""}&endDate=${endDate || ""}&pageNo=${
      pageNo || 0
    }&allAzureBlobPath=${allAzureBlobPath}`,
    options
  );
  return data;
}
