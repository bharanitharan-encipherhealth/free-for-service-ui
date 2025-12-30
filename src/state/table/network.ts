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

const requestManager = {
  tableRequests: new Map(), // Store AbortControllers for table requests
  statusRequests: new Map(), // Store AbortControllers for status requests
  currentTableKey: null, // Track current valid table request key
  currentStatusKey: null, // Track current valid status request key

  // Get or create AbortController for a request key (automatically cancels previous request)
  getAbortController(key: null | string, type = "table") {
    const map = type === "status" ? this.statusRequests : this.tableRequests;
    const currentKeyProp =
      type === "status" ? "currentStatusKey" : "currentTableKey";

    // Cancel previous request if exists
    if (map.has(key)) {
      const prevController = map.get(key);
      if (prevController && !prevController.signal.aborted) {
        try {
          prevController.abort();
        } catch (e) {
          // Ignore errors when aborting
        }
      }
      map.delete(key);
    }

    // Set this as the current valid request
    this[currentKeyProp] = key;

    // Create new AbortController
    const controller = new AbortController();
    map.set(key, controller);
    return controller;
  },

  // Check if this request key is still the current valid one
  isCurrentRequest(key: string, type = "table") {
    const currentKeyProp =
      type === "status" ? "currentStatusKey" : "currentTableKey";
    return this[currentKeyProp] === key;
  },

  // Clean up completed request
  removeController(key: string | null, type = "table") {
    const map = type === "status" ? this.statusRequests : this.tableRequests;
    const currentKeyProp =
      type === "status" ? "currentStatusKey" : "currentTableKey";

    if (map.has(key)) {
      map.delete(key);
    }

    // Clear current key if this was the current request
    if (this[currentKeyProp] === key) {
      this[currentKeyProp] = null;
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
  // projectId,
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
  if (!reloadTrue) {
    // Create unique key for this request based on pageId, activeStatus, pageNo, and router path
    // Include router pathname to differentiate between different pages using same pageId
    const routerPath = router?.pathname || "";
    const requestKey = `table_${pageId}_${activeStatus || ""}_${
      pageNo || 0
    }_${routerPath}_${Date.now()}`;

    // Cancel all previous requests for this pageId/activeStatus/router combination
    const baseKey = `table_${pageId}_${activeStatus || ""}_${
      pageNo || 0
    }_${routerPath}`;
    requestManager.tableRequests.forEach((controller, key) => {
      if (key.startsWith(baseKey) && key !== requestKey) {
        if (controller && !controller.signal.aborted) {
          try {
            controller.abort();
          } catch (e) {
            // Ignore errors
          }
        }
        requestManager.tableRequests.delete(key);
      }
    });

    // Get or create AbortController for this request
    const abortController = requestManager.getAbortController(
      requestKey,
      "table"
    );

    // Use provided signal or the managed one
    const finalSignal = signal || abortController.signal;

    const options = { method: "GET", signal: finalSignal };
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
    const usersPageId = ["8e4f1d2a-7b3c-45e6-9f1d-2a7b3c45e6f1"];

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
    if (role === "DOWNLOADER_LEAD" && usersPageIds.includes(pageId)) {
      baseUrl += `&
downloaderLead=${downloaderLead || false}`;
    }
    if (role === "PROJECT_LEAD" && usersPageIds.includes(pageId)) {
      baseUrl += `&projectLead=${projectLead || false}`;
    }

    const masterPageIds = [workQueuePageId];

    if (
      router?.pathname?.endsWith("/tindetails") &&
      masterPageIds.includes(pageId)
    ) {
      baseUrl += `&tin=${tin || ""}&allTinIds=${
        allTinIds || false
      }&isMasterAudit=true`;
    }
    const finalUrl = `${baseUrl}${searchTextParams || ""}${selectParams || ""}${
      dateRagngesParams || ""
    }${searchIntParams || ""}`;

    try {
      const data = await requestPortal(finalUrl, options);

      // Check if this is still the current valid request - don't update Redux if it's been superseded
      if (
        !requestManager.isCurrentRequest(requestKey, "table") ||
        finalSignal.aborted
      ) {
        requestManager.removeController(requestKey, "table");
        // Throw a special error that won't trigger Redux updates
        const abortError = new Error("Request was aborted");
        abortError.name = "AbortError";
        // abortError.isAborted = true;
        throw abortError;
      }

      // Clean up controller on success
      requestManager.removeController(requestKey, "table");
      return data;
    } catch (error: unknown) {
      // Clean up controller on error
      requestManager.removeController(requestKey, "table");

      // If request was aborted or superseded, throw error that won't trigger Redux updates
      if (
        error.name === "AbortError" ||
        finalSignal.aborted ||
        error.isAborted ||
        !requestManager.isCurrentRequest(requestKey, "table")
      ) {
        const abortError = new Error("Request was aborted");
        abortError.name = "AbortError";
        // abortError.isAborted = true;
        throw abortError;
      }
      throw error;
    }
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
