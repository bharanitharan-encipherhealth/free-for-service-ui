import { userTabelType } from "@/models/tenantadmin/users";

export interface sorType {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}
export interface pageableType {
  pageNumber: number;
  pageSize: number;
  sort: sorType;
  offset: number;
  paged: boolean;
  unpaged: false;
}

export interface OtherTableType {
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: sorType;
  numberOfElements: number;
  empty: boolean;
}
export type SortType = {
  sortDir?: string;
  sortField?: string;
} & {
  [key: string]:
    | {
        sortDir: string;
        sortField: string;
      }
    | string
    | undefined;
};

export interface tableCustomizationResposnetype {
  message: string;
  status: string;
  response: string;
}
export interface tableApiParamsType {
  pageId: string;
  pageNo?: number;
  pageSize?: number;
  selectedOption?: Record<string, string>;
  sort?: SortType;
  selectedDateRanges?: Record<string, string>;
  searchText?: Record<string, string>;
  activeStatus?: string;
  roleId?: string;
  selectedRole?: string;
  isReAssigned?: boolean;
  isQueried?: boolean;
  patientAllocated?: string;
  queryStatus?: string;
  isAdmin?: string | boolean;
  tin?: string;
  allTinIds?: boolean;
  cilentBased?: boolean;
  reloadTrue?: boolean;
  search?: Record<string, string>;
  tincompleted?: string;
  qaLead?: boolean;
  projectLead?: boolean;
  isMasterAudit?: boolean;
  router?: string;
  allClient?: boolean;
  allProject?: boolean;
  allTin?: boolean;
  clientId?: string;
  projectId?: string;
  reportCategory?: string;
  downloaderLead?: boolean;
  page?: string;
  signal?: unknown;
  tinIds?: string;
  allPatientIds?: boolean;
}

export interface optionsType {
  id: string | number;
  name: string;
}
export interface filterMeatType {
  filter: string;
  options: optionsType[] | [];
  nameOptions: optionsType[] | [];
  style: string;
}

export interface metaDataType {
  headerName: string;
  actualField: string;
  active: boolean;
  columnActive: boolean;
  design: string[];
  filter?: filterMeatType;
  orderValue?: number;
}

export interface staticDesignType {
  active?: string | boolean;
  actualField: string;
  design: string[];
  filter?: null;
  headerName: string;
  orderValue?: null;
}

export interface StatusCountType {
  QUERIED: number;
  COMPUTED: number;
  AUDIT_PENDING: number;
  ABORTED_BY_CRON: number;
  AUDITHOLD: number;
  PROCESSING: number;
  AUDIT_DECLINED: number;
  PENDING: number;
  INITIATED: number;
  DECLINED: number;
  REAUDIT: number;
  RE_ASSIGNED: number;
  COMPLETED: number;
  DUPLICATE: number;
  FAILED: number;
  NOT_AUDIT: number;
  ALLOCATED: number;
  NEEDBACK: number;
  AUDITED: number;
  MISSING_ORU: number;
  MISSING_DFT: number;
  NOTCOMPUTED: number;
  HOLD: number;
  REJECTED: number;
}

export interface ReviewCounts {
  pendingCount: string;
  approvedCount: string;
  rejectedCount: string;
  holdCount: string | null;
}

export interface metaDTOType {
  processStatusCount?: StatusCountType;
  patientIds?: null | string;
  tinNumbers?: null | string;
  metaDataDTO: metaDataType[];
  staticDesign: staticDesignType[];
  totalResponse?: null;
  mciPatientCountDTO: ReviewCounts;
}

export default class TableViewType<T> {
  tableView: {
    data: T;
    error: string | null;
    loading: boolean;
  };
  reportTable: { data: T; error: string | null; loading: boolean };
  reportTableLoader: boolean;
  tableViewLoading: boolean;

  constructor(initialData: T) {
    this.tableView = {
      data: initialData,
      error: null,
      loading: false,
    };
    this.reportTable = {
      data: initialData,
      error: null,
      loading: false,
    };
    this.tableViewLoading = false;
    this.reportTableLoader = false;
  }
}
