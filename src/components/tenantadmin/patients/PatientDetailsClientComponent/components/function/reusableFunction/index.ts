import {
  DiseaseItem,
  Hyperlink,
  patientDetailsResposneType,
  patientOverallDetailsResponseType,
} from "@/models/tenantadmin/patients/details";
import { movementApiCall } from "@/state/tenantadmin/patients/details/network";
import { getResponePopup } from "@/util/reusableFunction";
import { getStorage } from "@/util/storage";
import { Active, Over } from "@dnd-kit/core";
import { usePathname } from "next/navigation";

export const commentSectionList = [
  { label: "Missed Code", value: "MISSED_CODE" },
  { label: "Replaced Code", value: "REPLACED_CODE" },
  { label: "Correct", value: "CORRECT" },
  { label: "Deleted Code", value: "DELETED_CODE" },
  { label: "Incorrect Code Captured", value: "INCORRECT_CODE_CAPTURED" },
  {
    label: "Less Specific Code Captured",
    value: "LESS_SPECIFIC_CODE_CAPTURED",
  },
  {
    label: "More Specific Code Captured",
    value: "MORE_SPECIFIC_CODE_CAPTURED",
  },
  {
    label: "MEAT Modified",
    value: "MEAT_MODIFIED",
  },
  {
    label: "DX Already Documented",
    value: "DX_ALREADY_DOCUMENTED",
  },
  {
    label: "MEAT Not Presented",
    value: "MEAT_NOT_PRESENTED",
  },
];

export const defaultCapturedSections = [
  { label: "Chief Complaint", value: "Chief Complaint" },
  { label: "History of Present Illness", value: "History of Present Illness" },
  { label: "Vitals", value: "Vitals" },
  { label: "Medication", value: "Medication" },
  { label: "PMH/Problem List", value: "PMH/Problem List" },
  { label: "Assessment", value: "Assessment" },
  { label: "Plan", value: "Plan" },
];

export const onDragEndDisease = async ({
  active,
  over,
  setDndConfrim,
  setMovingData,
}: {
  active: Active;
  over: Over | null;
  setDndConfrim: (a: boolean) => void;
  setMovingData: ({
    data,
    dropId,
    dragId,
  }: {
    data: DiseaseItem;
    dropId: string;
    dragId: string;
  }) => void;
}) => {
  if (
    !active ||
    !over ||
    String(active?.id)?.split("-")?.[0] == String(over?.id)?.split("-")?.[0]
  ) {
    return;
  }
  const data: DiseaseItem = active?.data?.current?.item;
  setDndConfrim(true);
  setMovingData({
    data,
    dragId: String(active?.id)?.split("-")?.[0],
    dropId: String(over?.id)?.split("-")?.[0],
  });
};

export const onDiseaseMove = async ({
  comment,
  processedYear,
  selectedDos,
  moveData,
  setPageLoading,
  onCloseModal,
  admissionNumber,
  getPatientDiseaseDetails,
}: {
  comment: string;
  processedYear: number;
  selectedDos: string;
  moveData: { data: DiseaseItem; dragId: string; dropId: string };
  setPageLoading: (load: boolean) => void;
  onCloseModal?: () => void;
  admissionNumber: { patientType: string; admNo: string; bacthDate: string };
  getPatientDiseaseDetails: ({ dos }: { dos: string }) => void;
}) => {
  try {
    setPageLoading(true);
    if (onCloseModal) onCloseModal();

    const patientId = getStorage("patientId");
    let payload: {
      patientId: string;
      processedYear: number;
      dateOfServices: string[];
      chartProcessType: string;
      educationalError: boolean;
      dateOfServiceIfDosWiseCompute: string;
      comment: string;
      admNo?: string;
      diagnosisCode: string;
    } = {
      patientId,
      processedYear,
      dateOfServices: [selectedDos],
      chartProcessType: selectedDos ? "DATE_OF_SERVICE" : "YEAR",
      educationalError: false,
      dateOfServiceIfDosWiseCompute: selectedDos,
      comment,

      // without multi delete
      diagnosisCode: moveData?.data?.diagnosisCode,
    };

    if (admissionNumber?.patientType?.toLowerCase() == "inpatient") {
      payload = {
        ...payload,
        admNo: admissionNumber?.admNo,
      };
    }

    let apiUrl;
    switch (`${moveData?.dragId}_${moveData?.dropId}`) {
      case "diagnosis_caregap":
        apiUrl = "management/disease/move/validtosuggested";
        break;
      case "diagnosis_suggested":
        apiUrl = "management/disease/move/validtopotential";
        break;
      case "diagnosis_delete":
        apiUrl = "management/disease/move/validtodeleted";
        break;

      case "caregap_diagnosis":
        apiUrl = "management/disease/move/suggestedtovalid";
        break;
      case "caregap_suggested":
        apiUrl = "management/disease/move/suggestedtopotential";
        break;
      case "caregap_delete":
        apiUrl = "management/disease/move/suggestedtodeleted";
        break;

      case "suggested_diagnosis":
        apiUrl = "management/disease/move/potentialtovalid";
        break;
      case "suggested_caregap":
        apiUrl = "management/disease/move/potentialtosuggested";
        break;
      case "suggested_delete":
        apiUrl = "management/disease/move/potentialtodeleted";
        break;

      case "delete_diagnosis":
        apiUrl = "management/disease/move/deletedtovalid";
        break;
      case "delete_caregap":
        apiUrl = "management/disease/move/deletedtosuggested";
        break;
      case "delete_suggested":
        apiUrl = "management/disease/move/deletedtopotential";
        break;
      default:
        console.error("Drag Id and Drop Id not found");
        return "";
    }

    const response = await movementApiCall({ payload, apiUrl });

    if (response?.status === "SUCCESS") {
      getResponePopup(response);
      getPatientDiseaseDetails({ dos: selectedDos });
    }
  } catch (e) {
    console.error(e, "while calling the movement submit");
  } finally {
    setPageLoading(false);
  }
};

export const checkStatusDisable = ({
  patientOverallDetails,
  patientDiseaseDetails,
  setDisable,
  pathName,
}: {
  patientOverallDetails: patientOverallDetailsResponseType;
  patientDiseaseDetails: patientDetailsResposneType;
  setDisable: ({
    isYearWise,
    isDosWise,
  }: {
    isYearWise: boolean;
    isDosWise: boolean;
  }) => void;
  pathName: string;
}) => {
  const disabledPathName =
    pathName.endsWith("/tenantadmin/tin/details") ||
    pathName.endsWith("/tenantadmin/project/details") ||
    pathName.endsWith("/tenantadmin/patientsync/batchfilesview") ||
    pathName.endsWith("/tenantadmin/tin/tindetails/querydetails") ||
    pathName.endsWith("/tenantadmin/tracking/details");

  const overallStatus = patientOverallDetails?.workflow?.[0]?.status;
  const dosStatus = patientDiseaseDetails?.workflow?.[0]?.status;
  if (disabledPathName || overallStatus?.toLowerCase() === "completed") {
    setDisable({ isYearWise: true, isDosWise: true });
    return;
  }
  
  if (disabledPathName || dosStatus?.toLowerCase() === "completed") {
    setDisable({ isYearWise: false, isDosWise: true });
    return;
  }
  setDisable({ isYearWise: false, isDosWise: false });
};
