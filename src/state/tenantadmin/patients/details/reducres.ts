import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { ReducerType } from "../../../storeModal";
import {
  getAction,
  getCommentAction,
  getFileIdCheck,
  getNotesLists,
  getPatientListFilter,
  getSelectedDosPageNumber,
  getTimelineList,
  getVersionHistory,
  patientDiseaseDetails,
  patientDosDetails,
  patientHccFileAction,
  patientOverallDetails,
  patientOverallYear,
  setAdmissionNumber,
  setPageLoading,
  setPatientOverallYear,
  setPdfSearch,
  setPdfView,
  setSelectDos,
} from "./actions";

const initialState: ReducerType = {
  loading: true,
  data: null,
  error: null,
};

const createReducer = (actionType: any) =>
  handleActions(
    {
      [actionType.STARTED]: (state, action) => ({
        ...state,
        loading: true,
        error: null,
      }),
      [actionType.SUCCEEDED]: (state, action) => ({
        ...state,
        loading: false,
        error: null,
        data: action.payload,
      }),
      [actionType.FAILED]: (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }),
    },

    initialState,
  );
const getLoading = (type: any) =>
  handleActions(
    {
      [type.START]: () => true,
      [type.SUCCEEDED]: () => false,
      [type.FAILED]: () => false,
    },
    true,
  );

const localRedux = (action: any) =>
  handleActions(
    {
      [action.toString()]: (state, { payload }) => payload,
    },
    "",
  );
const patientDetailsReducer = combineReducers({
  patientOverallDetails: createReducer(patientOverallDetails),
  patietOverallDetailsLoading: getLoading(patientOverallDetails),

  setAdmissionNumber: localRedux(setAdmissionNumber),

  patientOverallYear: createReducer(patientOverallYear),
  patientOverallYearLoading: getLoading(patientOverallYear),

  setPatientOverallYear: localRedux(setPatientOverallYear),

  patientDosDetails: createReducer(patientDosDetails),
  patientDosDetailsLoading: getLoading(patientDosDetails),

  patientDiseaseDetails: createReducer(patientDiseaseDetails),
  patientDiseaseDetailsLoading: getLoading(patientDiseaseDetails),

  setSelectDos: localRedux(setSelectDos),
  getSelectedDosPageNumber: localRedux(getSelectedDosPageNumber),
  setPdfSearch: localRedux(setPdfSearch),

  getFileIdCheckLoading: getLoading(getFileIdCheck),
  getFileIdCheck: createReducer(getFileIdCheck),

  patientHccFieLoading: getLoading(patientHccFileAction),
  patientHccFileDetails: createReducer(patientHccFileAction),

  patientWorkQueueData: createReducer(getPatientListFilter),
  patientWorkQueueLoading: getLoading(getPatientListFilter),

  setPageLoading: localRedux(setPageLoading),

  timelineList: createReducer(getTimelineList),
  timelineListLoading: getLoading(getTimelineList),

  timelineActionData: createReducer(getAction),

  commentList: createReducer(getCommentAction),
  getCommentLoading: getLoading(getCommentAction),

  notesLists: createReducer(getNotesLists),
  notesLoading: getLoading(getNotesLists),

  getVersionHistory: createReducer(getVersionHistory),
  getVersionHistoryloading: getLoading(getVersionHistory),

  setPdfView: localRedux(setPdfView),
});

export default patientDetailsReducer;
