import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { ReducerType } from "../../storeModal";
import * as actions from "./actions";

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
    initialState
  );

const getLoading = (type: any) =>
  handleActions(
    {
      [type.STARTED]: () => true,
      [type.SUCCEEDED]: () => false,
      [type.FAILED]: () => false,
    },
    false
  );

const fileProcessingReducer = combineReducers({
  uploadFile: createReducer(actions.uploadFile),
  addPatient: createReducer(actions.addPatient),
  getUsers: createReducer(actions.getUsers),
  allProcessing: createReducer(actions.getAllFileProcessing),
});

export default fileProcessingReducer;
