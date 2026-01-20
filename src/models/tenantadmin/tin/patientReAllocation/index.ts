import {
  metaDataType,
  metaDTOType,
  OtherTableType,
  pageableType,
} from "@/state/table/model";
import { TrackingContentArrayType } from "../../tracking";

export interface patientReAllocationContentArrayType
  extends TrackingContentArrayType {
  admNo: string;
  admDate: string;
  batchDate: string;
  isRequestForRetry: boolean;
}

export interface tinPatientReAllocationPageResponsetype extends OtherTableType {
  content: patientReAllocationContentArrayType[];
  pageable: pageableType;
}
export interface tinPatientReAllocationPageResponsetype extends metaDTOType {
  pageResponse: tinPatientReAllocationPageResponsetype;
}

export interface checkAllPatientIdType {
  patientId: string;
  patientName?: string;
  username: string;
  roleId: string;
  fileName?: string;
}

export interface tinPatientReAllocationTableResposneType {
  message: string;
  status: string;
  response: tinPatientReAllocationPageResponsetype;
}

export interface tinPatientReAllocationTabType {
  activeFilters: metaDataType[];
  setActiveFilters: React.Dispatch<React.SetStateAction<metaDataType[] | []>>;
  triggerTableCustomization: Record<string, boolean>;
  setTriggerTableCustomization: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  onSelectionChange?: (hasSelection: boolean) => void;
  allocateModal: boolean;
  setAllocateModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface tinPatientReAllocationModalType {
  openAllocateModal: boolean;
  setAllocateModal: React.Dispatch<React.SetStateAction<boolean>>;
  roleAliasName: string;
  selectedRows: string[];
  selectedPatientDetails: checkAllPatientIdType[];
  activeTab: string;
}

export interface userListType {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  name: string;
  roleId: string;
  aliasName: string;
  proxyId: string;
}

export interface userListResponseType {
  data: { status: string; message: string; response: userListType[] };
  loading: boolean;
  error: string;
}
