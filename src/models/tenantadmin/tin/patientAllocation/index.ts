import {
  metaDataType,
  metaDTOType,
  OtherTableType,
  pageableType,
} from "@/state/table/model";
import { TrackingContentArrayType } from "../../tracking";

export interface patientAllocationContentArrayType
  extends TrackingContentArrayType {
  admNo: string;
  admDate: string;
  batchDate: string;
  isRequestForRetry: boolean;
}

export interface tinPatientAllocationContentType extends OtherTableType {
  content: patientAllocationContentArrayType[];
  pageable: pageableType;
}
export interface tinPatientAllocationPageResponsetype extends metaDTOType {
  pageResponse: tinPatientAllocationContentType;
}

export interface checkAllPatientIdType {
  patientId: string;
  patientName: string;
  userName?: string;
  roleId?: string;
  fileName: string;
}

export interface tinPatientAllocationTableResposneType {
  message: string;
  status: string;
  response: tinPatientAllocationPageResponsetype;
}

export interface tinPatientAllocationTabType {
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

export interface tinPatientAllocationModalType {
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
