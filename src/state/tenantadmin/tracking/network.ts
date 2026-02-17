import {
  assignUserPayloadType,
  userEnableType,
} from "@/models/tenantadmin/users";
import { SortType } from "@/state/table/model";
import { requestPortal, requestPortalExcel } from "@/util/network";
import {
  convertToCustomParams,
  convertToCustomParamsDatePicker,
} from "@/util/reusableFunction";

export async function logsReportDownload({
  pageId,
  roleId,
  aliasName,
  isAdmin,
  sort,
  allClient,
  allProject,
  allTin,
  clientId,
  projectId,
  selectedOption,
  searchText,
  search,
  selectedDateRanges,
  page,
}: {
  pageId: string;
  roleId: string;
  aliasName: string;
  isAdmin: boolean;
  sort: SortType;
  allClient: boolean;
  allProject: boolean;
  allTin: boolean;
  clientId: string;
  projectId: string;
  selectedOption: Record<string, string>;
  searchText: Record<string, string>;
  search: Record<string, string>;
  selectedDateRanges: Record<string, string>;
  page: string;
}) {
  try {
    if (!page) {
      return;
    }
    const options = {
      method: "GET",
    };
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
    const baseUrl = `dbservice/dashboard/export/${page}?pageId=${pageId}&roleId=${
      roleId || ""
    }&aliasName${aliasName || ""}&isAdmin=${isAdmin || ""}&sortDirection=${
      sort?.sortDir ? sort?.sortDir : "DESC"
    }&sortField=${sort?.sortField ? sort?.sortField : ""}&allClient=${
      allClient || false
    }&allProject=${allProject || false}&allTin=${allTin || false}&clientId=${
      clientId || ""
    }&projectId=${projectId || ""}`;

    const finalUrl = `${baseUrl}${searchTextParams || ""}${selectParams || ""}${
      dateRagngesParams || ""
    }${searchIntParams || ""}`;
    const data = await requestPortalExcel(finalUrl, options);
    return data;
  } catch (e) {
    console.error(e, "report download");
  }
}
