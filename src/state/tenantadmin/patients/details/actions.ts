import { createActionThunk } from "@/util/redux";
import * as network from "./network";

export const patientOverallDetails = createActionThunk(
  "PATIENT_OVERALL_DETAILS",
  network.patientIdDetails,
);
