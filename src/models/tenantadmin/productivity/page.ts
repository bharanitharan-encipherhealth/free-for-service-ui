import {
  metaDTOType,
  OtherTableType,
  pageableType,
  tableApiParamsType,
  tableCustomizationResposnetype,
} from "@/state/table/model";
import { getTableViewResponse } from "../tracking";

export interface allocationRolesType {
  roleId: string;
  roleName: string;
  roleOrder: number;
  aliasName: string;
  disableAllocation: boolean;
  accessList: null;
  allocationOrder: number;
}

export interface getAllRolesTabResponseArray {
  allocationRoles: allocationRolesType[];
  randomSamplingCompleted: boolean;
  masterAuditSamplingCompleted: boolean;
}

export interface getAllRolesTabResponseType {
  status: string;
  message: string;
  response: getAllRolesTabResponseArray;
}

export interface getAllRoleTabReducerType {
  data: getAllRolesTabResponseType;
  status: string;
  loading: boolean;
}

export interface productivityContentArrayType {
  allocatedTo: string;
  allocatedCount: number;
  pendingCount: number;
  completedCount: number;
  reassignedPendingCount: number;
  reassignedCompletedCount: number;
  approvalPendingCount: number;
  approvalRejectedCount: number;
  editedCodesCount: number;
  addedCodesCount: number;
  deletedCodesCount: number;
  movedCodesCount: number;
  correctCodesCount: number;
  incorrectCodesCount: number;
  submittedCodesCount: number;
  educationalErrorCount: number;
  accuracy: number;
}

export interface productivityContentType extends OtherTableType {
  content: productivityContentArrayType[];
  pageable: pageableType;
}

export interface productivityPageResponse extends metaDTOType {
  pageResponse: productivityContentType;
}

export interface productivitytabelResposne {
  message: string;
  status: string;
  response: productivityPageResponse;
}
export interface ProductivityPropsType {
  getTableView: (
    tableApiParamsType: tableApiParamsType
  ) => Promise<productivitytabelResposne>;
  tableCustomizationCall: ({
    payload,
  }: {
    payload: { pageId: string; headerNames: string[] };
  }) => Promise<tableCustomizationResposnetype>;
  getAllRolesTab: ({
    pageId,
  }: {
    pageId: string;
  }) => Promise<getAllRolesTabResponseType>;
  allAllocationRoleData: getAllRolesTabResponseArray;
  allAllocationRoleLoading: boolean;
  tableData: productivityPageResponse;
  tableLoader: boolean;
  getLogsReportDownload: (
    tableApiParamsType: tableApiParamsType
  ) => Promise<Response>;
  exportLoading: boolean;
}
