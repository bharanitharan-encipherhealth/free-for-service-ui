import { createActionThunk } from "@/util/redux";
import * as network from "./network";
import { createAction } from "redux-actions";

export const patientOverallDetails = createActionThunk(
  "PATIENT_OVERALL_DETAILS",
  network?.patientIdDetails,
);

export const patientOverallYear = createActionThunk(
  "PATIENT_OVRALL_YEAR",
  network?.getAllProcessYear,
);

export const patientDosDetails = createActionThunk(
  "PATIENT_DOS_DETAILS",
  network?.dosWiseList,
);

export const patientDiseaseDetails = createActionThunk(
  "PATIENTS_DISEASE_DETAILS",
  network?.patientDetails,
);

export const getFileIdCheck = createActionThunk(
  "GET_FILE_ID_CHECK",
  network.findByPatientId,
);

export const patientHccFileAction = createActionThunk(
  "PATIENT_HCC_FILE",
  network.patientHccFile,
);

export const getPatientListFilter = createActionThunk(
  "PATIENT_LIST_FILTER",
  network.patientListFilter,
);

export const getTimelineList = createActionThunk(
  "PATIENT_TIMELINE_LIST",
  network.getTimelineList,
);

export const getAction = createActionThunk(
  "GET_TIMELINE_ACTION",
  network?.getAction,
);

export const getCommentAction = createActionThunk(
  "COMMENTS_PATIENTS",
  network?.getCommentList,
);

export const addCommentsAction = createActionThunk(
  "ADD_COMMENTS",
  network?.addComments,
);

export const removeCommentsAction = createActionThunk(
  "REMOVE_COMMENTS",
  network?.deleteComments,
);

export const addNotesAction = createActionThunk(
  "ADD_NOTES_ACTION",
  network?.addNotes,
);

export const getNotesLists = createActionThunk(
  "GET_NOTES_LIST",
  network?.getNotesLists,
);

export const deleteNotes = createActionThunk(
  "REMOVE_NOTES_LIST",
  network?.deleteNotes,
);

export const getVersionHistory = createActionThunk(
  "VERSION_HISTORY",
  network?.getRevertDetails,
);

export const getValidCode = createActionThunk(
  "isValideCode",
  network?.isValideCode,
);

export const getCaptureSection = createActionThunk(
  "GET_CAPTURE_SECTION_LIST_ARRAY",
  network?.getProviderAndCaptured,
);

export const checkCodePresent = createActionThunk(
  "GET_CHECK_CODE_PRESENT",
  network?.isCodePresent,
);

export const manuallyAdd = createActionThunk(
  "MANUALLY_ADDED",
  network.manuallyAddCode,
);

export const diseaseEdit = createActionThunk(
  "DISEASE_EDIT",
  network.diseaseEdit,
);

export const setAdmissionNumber = createAction("SET_ADMISSION_NUMBER");

export const setPatientOverallYear = createAction("SET_PATIENT_OVERALL_YEAR");

export const setSelectDos = createAction("SET_SELECTED_DOS_VALUE");

export const setPdfSearch = createAction("SET_PDF_SEARCH_TEXT");

export const getSelectedDosPageNumber = createAction(
  "GET_SELECTED_DOS_PAGE_NUMBER",
);

export const stroeFileIdPreAction = createAction("STORE_FILE_ID_PRE");

export const setPageLoading = createAction("SET_PAGE_LOADING");

export const setPdfView = createAction("SET_PDF_VIEW");

export const setAddModaOpen = createAction("SET_DISEASE_ADD_MODAL");

export const setEditDiseaseList = createAction("SET_EDIT_DISEASE");
