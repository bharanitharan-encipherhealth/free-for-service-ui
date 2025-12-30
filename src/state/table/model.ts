import { contentType } from "@/models/tenantadmin/users";

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
export interface tableApiParamsType {
  pageId: string;
  pageNo: number;
  pageSize?: number;
  selectedOption?: any;
  sort?: SortType;
  selectedDateRanges?: any;
  searchText?: any;
  activeStatus?: string;
  roleId?: string;
  selectedRole?: string;
  isReAssigned?: boolean;
  isQueried?: boolean;
  patientAllocated?: string;
  queryStatus?: string;
  isAdmin?: string;
  tin?: string;
  allTinIds?: boolean;
  cilentBased?: boolean;
  reloadTrue?: boolean;
  search?: any;
  tincompleted?: string;
  qaLead?: boolean;
  projectLead?: boolean;
  isMasterAudit?: boolean;
  router?: any;
  allClient?: boolean;
  allProject?: boolean;
  allTin?: boolean;
  clientId?: string;
  projectId?: string;
  reportCategory?: string;
  downloaderLead?: boolean;
  signal?: any;
}

export interface optionsType {
  id: string | number;
  name: string;
}
export interface filterMeatType {
  filter: string;
  options: optionsType[];
  nameOptions: optionsType[];
  style: string;
}

export interface metaDataType {
  headerName: string;
  actualField: string;
  active: boolean;
  columnActive: boolean;
  design: string[];
  filter: filterMeatType;
  orderValue: number;
}
export interface metaDTOType {
  processStatusCount?: string | null;
  patientIds?: null | string;
  tinNumbers?: null | string;
  metaDataDTO: metaDataType[];
}
