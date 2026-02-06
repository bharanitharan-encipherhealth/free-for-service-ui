import { DosTableRow } from "@/components/tenantadmin/patients/PatientDetailsClientComponent/components/dosSelect";
import { WorkflowItem } from "../../tracking";
import {
  metaDataType,
  metaDTOType,
  OtherTableType,
  pageableType,
} from "@/state/table/model";

export const diseasetagEnum = {
  CHANGED: "CHANGED",
  EDITED: "EDITED",
  MEAT_EDITED: "MEAT_EDITED",
  MANUALLY_ADDED: "MANUALLY_ADDED",
  MOST_SPECIFIC: "MOST_SPECIFIC",
  CHILDREN_EXPANDED: "CHILDREN_EXPANDED",
  COMBO_CODE: "COMBO_CODE",
  MOVED: "MOVED",
  RADIOLOGY: "RADIOLOGY",
  LAB: "LAB",
  INDIRECT_LESS_SPECIFIC: "INDIRECT_LESS_SPECIFIC",
  RESOLVED_CONDITION: "RESOLVED_CONDITION",
  CHART: "CHART",
  NON_REPORTABLE_CONDITION: "NON_REPORTABLE_CONDITION",
  CONFLICT_CONDITION: "CONFLICT_CONDITION",
  DOWN_CODE: "DOWN_CODE",
  CRITICAL_CONDITION: "CRITICAL_CONDITION",
  MI_CONDITION: "MI_CONDITION",
  HISTORY_CODES: "HISTORY_CODES",
  QUERIED: "QUERIED",
  LESS_SPECIFIC: "LESS_SPECIFIC",
  DONT_HIDE_LESS_SPECIFIC: "DONT_HIDE_LESS_SPECIFIC",
  HEALTH_METRIC: "HEALTH_METRIC",
  STATUS_CODE: "STATUS_CODE",
  CVA_LATE_EFFECT_CONDITION: "CVA_LATE_EFFECT_CONDITION",
  IN_VALID_DOC: "IN_VALID_DOC",
  AUDIO_VISIT: "AUDIO_VISIT",
  VIDEO_VISIT: "VIDEO_VISIT",
  TELEHEALTH: "TELEHEALTH",
  PROXY_CONFLICT_CONDITION: "PROXY_CONFLICT_CONDITION",
  PMH_DISEASE_INVALID: "PMH_DISEASE_INVALID",
  PMH_DISEASE_VALID: "PMH_DISEASE_VALID",
  DISEASE_SHOW_STAGE_CHANGED_TRUE: "DISEASE_SHOW_STAGE_CHANGED_TRUE",
  DISEASE_SHOW_STAGE_CHANGED_FALSE: "DISEASE_SHOW_STAGE_CHANGED_FALSE",
  SHOW_VIEW: "SHOW_VIEW",
  PRIMARY_DIAGNOSIS: "PRIMARY_DIAGNOSIS",
  RADIOLOGY_CPT_CODE: "RADIOLOGY_CPT_CODE",
  RADIOLOGY_ICD_CODE: "RADIOLOGY_ICD_CODE",
  RADIOLOGY_PATIENT_DEMOGRAPHY: "RADIOLOGY_PATIENT_DEMOGRAPHY",
  DEFAULT_ICD: "DEFAULT_ICD",
  ULCER_DISEASE: "ULCER_DISEASE",
  PATIENT_NAME_MISMATCH: "PATIENT_NAME_MISMATCH",
  PATIENT_DECEASED: "PATIENT_DECEASED",
  PATIENT_DOB_MISMATCH: "PATIENT_DOB_MISMATCH",
  MRN_ID_MISMATCH: "MRN_ID_MISMATCH",
  SCOPE_YEAR_MISMATCH: "SCOPE_YEAR_MISMATCH",
  MEAT_PRESENT: "MEAT_PRESENT",
  REVERTED: "REVERTED",
  INCIDENTAL_PREGNANCY: "INCIDENTAL_PREGNANCY",
  PREGNANCY_COMPLICATION: "PREGNANCY_COMPLICATION",
  HIGH_RISK: "HIGH_RISK",
  ACTIVE_HEADER: "ACTIVE_HEADER",
  DOS_PROVIDER_EDIT: "DOS_PROVIDER_EDIT",
  NEW_DOS_ADDED: "NEW_DOS_ADDED",
  PROVIDER_NAME_NOT_FOUND_IN_REGISTRY: "PROVIDER_NAME_NOT_FOUND_IN_REGISTRY",
  IS_SHOW: "IS_SHOW",
};

export interface patientOverallDetailsResponseType {
  createdDate: string;
  lastModifiedDate: string;
  active: boolean;
  version: number;

  createdBy: string;
  lastModifiedBy: string;

  id: string;
  patientId: string;
  patientName: string;

  mrNumber: string;
  dob: string;
  age: string;

  gender: "MALE" | "FEMALE" | string;

  batchId: string;
  batchDate: string;

  latestFileUploadDate: string;

  computing: number;

  processStageChart: string;
  processStageId: string;

  processedDate: string;
  processedStatus: "COMPUTED" | "PENDING" | string;
  computedDate: string;

  fileName: string;

  priority: "URGENT" | "NORMAL" | string;

  emr: string;
  tin: number;

  totalPages: number;

  computationList: ComputationItem[];

  isReEvaluateNeed: boolean;
  movedAfterReEvaluateIsOff: boolean;

  workflow: WorkflowItem[];

  currentStatus: WorkflowItem;

  patientType: "INPATIENT" | "OUTPATIENT" | string;
  admNo: string;
  admDate: string;
}
export interface ComputationItem {
  year: number;
  processedStatus: "COMPUTED" | "PENDING" | string;
}
export interface patientOverallDetailsType {
  message: string;
  status: string;
  response: patientOverallDetailsResponseType;
}

export interface patientOverallYearType {
  message: string;
  status: string;
  response: number[];
}

export interface patientSubHeaderType {
  yearOptions: { value: string; label: string }[];
  ChartTabList: { value: string; label: string; type: string }[];
  activeTab: number;
  onHandleTabChange: ({ item }: { item: number }) => void;
  onHandleChartChange: ({ e }: { e: string }) => void;
  activeChartTab: string;
  selectedPatientYear: number;
  onHandleChangeDos: ({ record }: { record: DosTableRow }) => void;
}

export interface patientDosResponseType {
  processedStatus: string | null;

  dateOfService: string;
  formattedDos: string;

  fileId: string;
  fileDetailDTO: FileDetailDTO;

  stateIndicators: Array<keyof typeof diseasetagEnum>;
  patientFlag: unknown[];

  workflow: WorkflowItem[];
  currentStatus: WorkflowItem | null;

  masterAudit: unknown | null;
  providerName: string;
}

export interface FileDetailDTO {
  id: string;
  fileId: string;
  batchId: string | null;
  patientId: string;
  mrn: string;

  userId: string;
  orgId: string;
  tenantId: string;

  dos: string | null;

  fileName: string;
  azureBlobPath: string;

  radiologyAzureBlobPaths: string[] | null;
  fileSearchDetails: unknown | null;
  exceptionLogInfo: unknown | null;
  fileDetails: unknown | null;

  alreadyPresentFileId: string | null;
  fileHash: string | null;
  isFileHashAlreadyPresent: boolean | null;
  isHazardFile: boolean | null;

  yearOfServices: number[] | null;
  dateOfServices: string[] | null;

  dosSummaries: DosSummary[];

  emrType: string;
  batchTrigger: boolean;

  fileExtension: string | null;
  totalPages: number | null;

  batchProcessFor: string | null;
  fileTypeForConrad: string | null;

  isRequestForRetry: boolean | null;

  workflowDetails: unknown | null;
  workflowRoutes: unknown | null;
}

export interface DosSummary {
  dos: string;
  startPageNumber: number;
  endPagNumber: number;

  substring: string;

  dosViceFlag: string | null;
  suspectTypes: string[] | null;
  processStage: string | null;

  fileId: string;
  active: boolean;
}

export interface patientDosDetailsType {
  message: string;
  status: string;
  response: patientDosResponseType[];
}

export interface dosOptionsType {
  providerName: string;
  dos: string;
  page: DosSummary | undefined;
  workflow: WorkflowItem[];
  stateIndicators: string[];
  masterAudit: unknown | null;
}

export interface DosSelectType {
  options: dosOptionsType[];
  onHandleChangeDos: ({ record }: { record: DosTableRow }) => void;
}

export interface patientDetailsResposneType {
  id: string;
  patientId: string;
  patientName: string;

  dateOfService: string;
  mrNumber: string;

  dob: string | null;
  gender: string | null;

  fileId: string;
  fileInfos: { fileId: string; fileType: string }[];

  processedYear: number;
  processedStatus: string | null;
  processDate: string | null;

  hccDiseases: DiseaseItem[];
  nonHccDiseases: DiseaseItem[];
  deletedDiseases: DiseaseItem[];

  suggestedHccDiseases: DiseaseItem[];
  potentialDiseases: DiseaseItem[];
  comboDisease: DiseaseItem[];

  meatCriteria: MeatCriteriaItem[];
  deletedMeatCriteria: MeatCriteriaItem[];

  rafScore: RafScore;

  meatQuery: QueryDiseaseInfo[];

  fileDetailDTO: FileDetailDTO;

  totalTimeForComputation: number;

  flags: string[];
  workflow: WorkflowStatus[];

  currentStatus: WorkflowStatus | null;

  summary: string;

  reEvaluateNeed: boolean;
  movedAfterReEvaluateIsOff: boolean;

  masterAudit: boolean;

  faceToFace: boolean;
  visitType: string;
}

export interface DiseaseItem {
  id: string;
  diagnosisCode: string;

  actualDescription: string;
  dbDescription: string;

  notes: string | null;

  capturedSections: string[];
  dateOfServices: string[];

  hyperlinks: Hyperlink[];
  dosHyperlinks: Hyperlink[];

  manuallyAddedDetails: {
    isManuallyAdded: boolean;
    manuallyAddedAt: string;
    manuallyAddedBy: string;
  };
  defaultPosition: string;

  providerNames: string[];
  providerHyperlinks: Hyperlink[];

  formedCodes: string[];
  children: DiseaseItem[];

  stateIndicators: string[];

  isShow: boolean;
  diseaseSource: string;

  suspectType: string[];

  uniqueIds: number[];

  riskAdjustmentDtoList: null;
  hccCategoryDataList: null;
  addOnCodes: null;

  ruleType: null;
  reason: null;

  educationalError: boolean;

  oldValue: number[];
  newValue: number[];

  comment: string | null;
  lastAddedComment: string | null;

  isRxHcc: boolean;
  isCmsHcc: boolean;
}

export interface Hyperlink {
  header: string;
  pageNumber: number;
  substring: string;
  dateOfService: string;

  priorityType: string | null;
  stateIndicator: string | null;
  fileId: string | null;
}

export interface MeatCriteriaItem {
  diseaseName: string;
  diagnosisCode: string;

  uniqueIds: number[];

  providerNames: string[];
  providerHyperlinks: Hyperlink[];

  dateOfService: string[];
  dosHyperlinks: Hyperlink[];

  isMeatCriteriaPresent: boolean;

  monitorAspect: string;
  monitorHyperLink: Hyperlink[];

  evaluateAspect: string;
  evaluateHyperLink: Hyperlink[];

  assessmentAspect: string;
  assessmentHyperLink: Hyperlink[];

  treatmentAspect: string;
  treatmentHyperLink: Hyperlink[];

  isShow: boolean;

  encounterDate: string | null;

  isManuallyAdded: boolean | null;
  manuallyAddedAt: string | null;

  visitDetailsDTO: null;

  monitorCapturedFromHeader: null;
  monitor: null;

  evaluateCapturedFromHeader: null;
  evaluate: null;

  assessmentCapturedFromHeader: null;
  assessment: null;

  treatmentCapturedFromHeader: null;
  treatment: null;

  stateIndicators: string[];

  isRxHcc: boolean;
  isCmsHcc: boolean;
}

export interface WorkflowStatus {
  roleId: string;

  allocatedTo: string | null;
  allocatedBy: string | null;
  allocatedOn: string | null;

  status: string;
  dueDate: string | null;
  performedOn: string | null;

  reAssigned: boolean;

  query: null;
  queryDetails: null;

  priority: string | null;

  alreadyQueried: boolean;

  codingAction: null;

  rebuttedOn: string | null;
  rebuttalTriggeredOn: string | null;

  rebuttalNotCompleted: boolean;
  alreadyRebutted: boolean;

  randomSampled: boolean;
}

export interface RafScore {
  v24Score: number | null;
  v28Score: number | null;
  score: number | null;

  rafVersionDTO: null;
  scoreOutputDTOList: null;

  v24Score70Percent: number | null;
  v28Score30Percent: number | null;
}

export interface QueryDiseaseInfo {
  diagnosisCode: string;
  description: string;

  queryReason: string;
  queryComment: string;

  dateOfServices: string[];
  capturedSections: string[];
  providerNames: string[];

  queryVersion: number;

  reasonByReviewer: string;

  createdBy: string;
  createdAt: string;

  currentQuery: boolean;
  isShow: boolean;
}

export interface patientDiseaseDetailstype {
  message: string;
  status: string;
  response: patientDetailsResposneType;
}

export interface patientHccFileType {
  message: string;
  status: string;
  response: FileDetailDTO;
}

export interface patientListFilterPropsType {
  userId: string;
  status: string;
  startDate: string;
  endDate: string;
  searchText: string;
  processedStart: string;
  processedEnd: string;
  pageNo: number;
}

export interface patientWorkQueueDataPageResponsetype extends OtherTableType {
  content: patientOverallDetailsResponseType[];
  pageable: pageableType;
}
export interface patientWorkQueueDataResponsetype extends metaDTOType {
  pageResponse: patientWorkQueueDataPageResponsetype;
}
export interface patientWorkQueueDataType {
  message: string;
  status: string;
  response: patientWorkQueueDataResponsetype;
}

export interface auditType {
  createdDate: string;
  lastModifiedDate: string;
  active: boolean;
  version: number;
  createdBy: string;
  lastModifiedBy: string;
}

export interface flagDetailsType extends auditType {
  id: string;
  priority: number;
  flagName: string;
  flagIcon: string;
  flagColour: string;
}

export interface timeLineContentType {
  createdDate: string;
  lastModifiedDate: string;
  active: boolean;
  version: number;

  createdBy: string;
  lastModifiedBy: string;

  id: string;
  patientId: string;
  userName: string;

  actionCreatedDate: string;
  action: "MOVED" | string;

  diagnosisCode: string;
  fullName: string;

  previousDiseaseFormat: DiseaseItem;
  changedDiseaseFormat: DiseaseItem;

  previousMeatDetail: MeatCriteriaItem;
  changedMeatDetail: string | null;

  previousProcedure: string | null;
  changedProcedure: string | null;

  fromState: string;
  toState: string;
  manuallyAddedState: string | null;

  computationYear: number;
  actionNotes: string | null;

  previousProcessedState: string | null;
  dos: string;
  processedYear: number | null;

  flagDetails: flagDetailsType;

  previousProviderInfo: unknown | null;
  changedProviderInfo: unknown | null;
  previousDosProviderInfo: unknown | null;
  changedDosProviderInfo: unknown | null;

  htmlContent: string;

  stateIndicator: unknown[];

  previousDemography: unknown | null;
  changedDemography: unknown | null;

  revertHistory: number;
  isCurrentVersion: boolean;

  aliasName: string;
  educationalError: boolean;

  previousCoderRoleId: string | null;
  currentCoderRoleId: string | null;

  rebuttalStatus: string | null;
  isMarkedAsComplete: boolean | null;
  rebuttalReason: string | null;

  roleList: unknown | null;

  comment: string | null;
}

export interface timeListContent extends OtherTableType {
  content: timeLineContentType[];
  pageable: pageableType;
}
export interface timeListType {
  message: string;
  status: string;
  response: timeListContent;
}

export interface versionHistorytype {
  message: string;
  status: string;
  response: timeLineContentType[];
}
