import {
  metaDTOType,
  pageableType,
  tableApiParamsType,
  tableCustomizationResposnetype,
  OtherTableType,
} from "@/state/table/model";

export interface TrackingContentArrayType {
  createdDate: string;
  lastModifiedDate: string;
  active: boolean;
  createdBy: string;
  id: string;
  patientId: string;
  patientName: string;
  fileName: string;
  dob: string; // ISO date string
  gender: "MALE" | "FEMALE" | string;
  computing: number;
  computedDate: string;
  totalPages: number;
  validDiseaseCount: number;
  suggestedDiseaseCount: number;
  potentialDiseaseCount: number;
  deletedDiseaseCount: number;
  isFlagShow: boolean;
  computationList: {
    year: number;
    processedStatus: string;
  }[];
  mrNumber: string;
  movedAfterReEvaluateIsOff: boolean;
  workflow: WorkflowItem[];
  flagList: FlagItem[];
  createdByName: UserInfo;
  processedYear: number[];
  overallAccuracy: number;
  uploadDisable: boolean;
  patientType: string;
  rafScore: number;
  inValidDiseaseCount: number;
  coder1SubmittedCodesCount: number;
  coder1AddedCodes: string;
  coder1DueDate: string;
  coder1CompletedDate: string;
  coder1Status: string;
  coder1CorrectCodes: string;
  coder1SubmittedCodes: string;
  coder1Accuracy: number;
  coder1Name: UserInfo;
  coder1InCorrectCodes: string;
  coder1EditedCodesCount: number;
  coder1MovedCodes: string;
  coder1CorrectCodesCount: number;
  coder1EducationalErrorCount: number;
  coder1DeletedCodes: string;
  coder1AddedCodesCount: number;
  coder1MovedCodesCount: number;
  coder1AllocatedDate: string;
  coder1AllocatedBy: UserInfo;
  coder1EditedCodes: string;
  coder1DeletedCodesCount: number;
  coder1EducationalErrorCodes: string;
  coder1InCorrectCodesCount: number;
}

export interface UserInfo {
  firstName: string;
  lastName: string;
  profileImage: string;
  userId: string;
}

export interface WorkflowItem {
  roleId: string;
  allocatedTo: string | null;
  allocatedBy: string | null;
  allocatedOn: string | null;
  status: string;
  dueDate: string | null;
  performedOn: string | null;
  reAssigned: boolean;
  query: string | null;
  queryDetails: string | null;
  priority: string | null;
  alreadyQueried: boolean;
  codingAction: CodingAction;
  rebuttedOn: string | null;
  rebuttalTriggeredOn: string | null;
  rebuttalNotCompleted: boolean;
  alreadyRebutted: boolean;
  randomSampled: boolean;
}

export interface CodingAction {
  roleId: string | null;
  userName: string | null;
  editedCodes: string[];
  editedCodesCount: number;
  addedCodes: string[];
  addedCodesCount: number;
  deletedCodes: string[];
  deletedCodesCount: number;
  movedCodes: string[];
  movedCodesCount: number;
  correctCodes: string[];
  correctCodesCount: number;
  incorrectCodes: string[];
  incorrectCodesCount: number;
  submittedCodes: string[];
  submittedCodesCount: number;
  educationalErrorCodes: string[];
  educationalErrorCount: number;
  accuracy: number;
}

export interface FlagItem {
  createdDate: string | null;
  lastModifiedDate: string;
  active: boolean;
  version: number;
  createdBy: string | null;
  lastModifiedBy: string;
  id: string;
  priority: number;
  flagName: string;
  flagIcon: string;
  flagColour: string;
}

export interface pageResponsetype extends OtherTableType {
  content: TrackingContentArrayType[];
  pageable: pageableType;
}

export interface trackingTableView extends metaDTOType {
  pageResponse: pageResponsetype;
}

export interface getTableViewResponse {
  message: string;
  status: string;
  response: trackingTableView;
}
export interface TrackingPropsType {
  getTableView: (
    tableApiParamsType: tableApiParamsType,
  ) => Promise<getTableViewResponse>;
  tableData: trackingTableView;
  tableCustomizationCall: ({
    payload,
  }: {
    payload: { pageId: string; headerNames: string[] };
  }) => Promise<tableCustomizationResposnetype>;
  tableLoader: boolean;
  getLogsReportDownload: (
    tableApiParamsType: tableApiParamsType,
  ) => Promise<Response>;
  exportLoading: boolean;
}
