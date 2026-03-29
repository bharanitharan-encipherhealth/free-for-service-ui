import {
  DiseaseItem,
  patientDetailsResposneType,
  timeLineContentType,
} from "@/models/tenantadmin/patients/details";
import { generateMeatCriteriaListType } from "@/models/tenantadmin/patients/DiagnosisDetails";

type HasIsShow = {
  isShow?: boolean;
};

type diseaseTypeKey =
  | "hccDiseases"
  | "suggestedHccDiseases"
  | "deletedDiseases"
  | "potentialDiseases";

export const getDiseaseData = ({
  diseaseList,
  activeTab,
  diseaseType,
}: {
  diseaseList: DiseaseItem[];
  activeTab: number;
  diseaseType: diseaseTypeKey;
}) => {
  if (activeTab === 1) {
    return diseaseType === "hccDiseases"
      ? generateMeatCriteriaList<DiseaseItem>({
          meatList: diseaseList,
        })
      : diseaseList;
  }
  if (activeTab === 2) {
    return diseaseType === "hccDiseases"
      ? generateMeatCriteriaList({
          meatList: generateComboCodeList({
            diseaseList,
            diseaseSource: "COMBINATION_DISEASES",
          }),
        })
      : diseaseType === "suggestedHccDiseases"
        ? generateComboCodeList({
            diseaseList,
            diseaseSource: "COMBINATION_SUGGESTED_DISEASES",
          })
        : diseaseType === "deletedDiseases"
          ? generateComboCodeList({
              diseaseList,
              diseaseSource: "COMBINATION_DELETED_DISEASES",
            })
          : [];
  }
  return [];
};
export const generateMeatCriteriaList = <T extends HasIsShow>({
  meatList,
}: generateMeatCriteriaListType<T>) => {
  return meatList?.filter((item) => item?.isShow);
};

export const generateComboCodeList = ({
  diseaseList,
  diseaseSource,
}: {
  diseaseList: DiseaseItem[];
  diseaseSource: string;
}) => {
  return (
    diseaseList
      ?.filter((item) => item?.diseaseSource === diseaseSource)
      .map((item) => ({ ...item })) || []
  );
};

export const splitUserName = ({ name }: { name: string }) => {
  if (name) {
    return name[0];
  }
};

export const underScoreRemove = ({ value }: { value: string }) => {
  if (value) {
    const str = value;
    const newStr = str.replace(/_/g, " ");
    return newStr;
  }
};

export const getBadgeClassName = ({ item }: { item: timeLineContentType }) => {
  switch (item.action) {
    case "MOVED":
      if (item?.fromState == "VALID" && item?.toState == "DELETED") {
        return "timeline-badge MOVED_VALID_TO_DELETED";
      }
      if (item?.fromState == "VALID" && item?.toState == "SUGGESTED") {
        return "timeline-badge MOVED_VALID_TO_SUGGESTED";
      }
      if (item?.fromState == "SUGGESTED" && item?.toState == "VALID") {
        return "timeline-badge MOVED_SUGGESTED_TO_VALID";
      }
      if (item?.fromState == "SUGGESTED" && item?.toState == "DELETED") {
        return "timeline-badge MOVED_SUGGESTED_TO_DELETED";
      }
      if (item?.fromState == "DELETED" && item?.toState == "VALID") {
        return "timeline-badge MOVED_DELETED_TO_VALID";
      }
      if (item?.fromState == "DELETED" && item?.toState == "SUGGESTED") {
        return "timeline-badge MOVED_VALID_TO_DELETED";
      }
    case "MOVED_INVALID_TO_VALID":
      return "timeline-badge MOVED_INVALID_TO_VALID";
    case "MOVED_SUGGESTED_TO_VALID":
      return "timeline-badge MOVED_SUGGESTED_TO_VALID";
    case "MOVED_VALID_TO_SUGGESTED":
      return "timeline-badge MOVED_VALID_TO_SUGGESTED";
    case "VALID_DISEASE_ADDED":
      return "timeline-badge VALID_DISEASE_ADDED";
    case "MOVED_VALID_TO_DELETED":
      return "timeline-badge MOVED_VALID_TO_DELETED";
    case "COMPLETED":
      return "timeline-badge COMPLETED";
    case "MOVED_DELETED_TO_VALID":
      return "timeline-badge MOVED_DELETED_TO_VALID";
    case "MOVED_DELETED_TO_SUGGESTED":
      return "timeline-badge MOVED_DELETED_TO_SUGGESTED";
    case "MOVED_SUGGESTED_TO_DELETED":
      return "timeline-badge MOVED_SUGGESTED_TO_DELETED";
    case "ENCOUNTER_FILE_UPDATED":
      return "timeline-badge ENCOUNTER_FILE_UPDATED";
    case "ENCOUNTER_FILE_ADDED":
      return "timeline-badge ENCOUNTER_FILE_ADDED";
    case "HOLD":
      return "timeline-badge HOLD";
    case "DECLINED":
      return "timeline-badge DECLINED";
    case "PENDING":
      return "timeline-badge DECLINED";
    default:
      return "timeline-badge DECLINED";
  }
};
