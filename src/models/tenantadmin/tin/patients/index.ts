import {
  metaDataType,
  metaDTOType,
  OtherTableType,
  pageableType,
} from "@/state/table/model";
import { TrackingContentArrayType } from "../../tracking";

export interface productivityContentArrayType
  extends TrackingContentArrayType, Record<string, unknown> {
  admNo: string;
  admDate: string;
  batchDate: string;
}

export interface tinPatientContentType extends OtherTableType {
  content: productivityContentArrayType[];
  pageable: pageableType;
}
export interface tinPatientsPageResponsetype extends metaDTOType {
  pageResponse: tinPatientContentType;
}
export interface tinPatientTableResposneType {
  message: string;
  status: string;
  response: tinPatientsPageResponsetype;
}
export interface tinPatientsTabType {
  activeFilters: metaDataType[];
  setActiveFilters: React.Dispatch<React.SetStateAction<metaDataType[] | []>>;
  triggerTableCustomization: Record<string, boolean>;
  setTriggerTableCustomization: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}
