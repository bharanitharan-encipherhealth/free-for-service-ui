import { createActionThunk } from "../../util/redux";
import * as network from "./network";

export const getMFAValidation = createActionThunk(
  "GET_MFA_VALIDATION",
  network.mfaValidation
);

export const allRoles = createActionThunk("GET_ALL_ROLES", network.getAllRoles);

export const clientId = createActionThunk("GET_CLIENT_ID", network.getClientId);

export const clientDetails = createActionThunk(
  "GET_CLIENT_DETAILS",
  network.getClientDetails
);

export const projectDetails = createActionThunk(
  "GET_PROJECT_DETAILS",
  network.getProjectDetails
);

export const CurrentUserInfoAction = createActionThunk(
  "CURRRENT_USER_INFO",
  network.CurrentUserInfo
);

export const tinsDropdown = createActionThunk(
  "GET_ALL_TIN_DROPDOWNS",
  network.getAllTinDropdown
);
