import { patientDosResponseType } from "@/models/tenantadmin/patients/details";

export const getPatientTabList = ({ patientType }: { patientType: string }) => {
  switch (patientType?.toLowerCase()) {
    case "inpatient":
      return [
        {
          label: "ADM",
          type: "Admission Notes",
          value: "ADMISSION",
        },
        {
          label: "PROG",
          type: "Progress Notes",
          value: "PROGRESS",
        },
        {
          label: "DIS",
          type: "Discharge Notes",
          value: "DISCHARGE",
        },
      ];
    case "outpatient":
      return [
        {
          label: "ER",
          type: "Emergency Notes",
          value: "ER",
        },
        {
          label: "CN",
          type: "Clinical Notes",
          value: "CLINICAL",
        },
      ];
    default:
      return [];
  }
};

export const findFirstPendingWorkflow = ({
  responseArray,
}: {
  responseArray: patientDosResponseType[];
}) => {
  for (const item of responseArray) {
    if (item.workflow && Array.isArray(item.workflow)) {
      const hasCompleted = item.workflow.some((w) => w.status === "COMPLETED");
      const allPending = item.workflow.every((w) => w.status === "PENDING");
      if (hasCompleted) {
        continue;
      }
      if (allPending) {
        return item;
      }
    }
  }
  return null;
};
