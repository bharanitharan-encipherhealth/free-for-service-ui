import { metaDataType } from "@/state/table/model";

export interface getReportTabsResponseType {
  title: null;
  tabMenuList: string[];
  tabMenuList2: string[];
  active: boolean;
}
export interface getReportTabsType {
  status: string;
  message: string;
  response: getReportTabsResponseType;
}

export interface getReportTabReduxType {
  errro?: string | null;
  loading: boolean;
  data: getReportTabsType;
}

export interface getReportTableCallType {
  patientType: string;
  searchText: Record<string, string>;
  dateRange: Record<string, string>;
  pageNo: number;
  allAzureBlobPath?: boolean;
}

export interface resposeDataArrayType extends Record<string, unknown> {
  id: string;
  fileName: string;
  patientType: string;
  azureBlobPath: string;
  batchDate: string;
  patientCount: number;
  allAzureBlobPath: null;
  sno: number;
}

export interface resposeType {
  data: resposeDataArrayType[];
  amMetaData: metaDataType[];
  pageNumber: number;
  totalElements: number;
  pageSize: number;
}

export interface getReportTableCallResponseType {
  message: string;
  status: string;
  response: resposeType;
}
export interface ReportPropsType {
  getReportTabs: () => Promise<getReportTabsType>;
  reportTabList: getReportTabsResponseType;
  reportTabListLoading: boolean;
  getReportTableCall: (
    tabelParams: getReportTableCallType,
  ) => Promise<getReportTableCallResponseType>;
  tableData: resposeType;
  tableLoader: boolean;
  getReportDownload: ({
    formData,
    patientType,
  }: {
    formData: string[];
    patientType: string;
  }) => Promise<Response>;
  getReportCall: ({ blobId }: { blobId: string }) => Promise<Response>;
}
