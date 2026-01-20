import {
  metaDataType,
  metaDTOType,
  OtherTableType,
  pageableType,
  tableApiParamsType,
} from "@/state/table/model";
import { UserInfo } from "../../tracking";

export interface projectTableContentArrayType {
  createdDate: string;
  active: boolean;
  createdBy: string;
  id: string;
  patientId: string;
  patientName: string;
  fileName: string;
  computing: number;
  computedDate: string;
  isFlagShow: boolean;
  mrNumber: string;
  movedAfterReEvaluateIsOff: boolean;
  workflow: [];
  createdByName: UserInfo;
  overallAccuracy: number;
  uploadDisable: boolean;
  patientType: PatientType;
}

export type PatientType = "INPATIENT" | "OUTPATIENT";

export interface projectTablePageResponseType extends OtherTableType {
  content: projectTableContentArrayType[];
  pageable: pageableType;
}

export interface projectTableType extends metaDTOType {
  pageResponse: projectTablePageResponseType;
}

export interface getProjectTableView {
  message: string;
  status: string;
  response: projectTableType;
}

export interface patientCallingProps {
  activeFilters: metaDataType[];
  setActiveFilters: React.Dispatch<React.SetStateAction<metaDataType[]>>;
  setSelectedColumns: React.Dispatch<React.SetStateAction<metaDataType[]>>;
  insertTable: string;
  setInsertTable: React.Dispatch<React.SetStateAction<string>>;
}

export interface patientReduxProps {
  tableData: projectTableType;
  tableLoader: boolean;

  getTableView: (
    tableApiParamsType: tableApiParamsType
  ) => Promise<getProjectTableView>;
}
