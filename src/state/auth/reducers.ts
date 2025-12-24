import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import {
  allRoles,
  clientDetails,
  clientId,
  CurrentUserInfoAction,
  getMFAValidation,
  projectDetails,
  tinsDropdown,
} from "./actions";
import { ReducerType } from "../storeModal";

const initialState: ReducerType = {
  loading: true,
  data: null,
  error: null,
};

const menuSelected = (action: any) =>
  handleActions(
    {
      [action.toString()]: (state, { payload }) => payload,
    },
    {}
  );

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
const getUsersDetailsLoading = (type: any) =>
  handleActions(
    {
      [type.START]: () => true,
      [type.SUCCEEDED]: () => false,
      [type.FAILED]: () => false,
    },
    false
  );
const authReducer = combineReducers({
  allRolesData: createReducer(allRoles),
  clientDetails: createReducer(clientId),
  clientDropDown: createReducer(clientDetails),
  projectDetails: createReducer(projectDetails),
  CurrentUserInfo: createReducer(CurrentUserInfoAction),
  tinDetails: createReducer(tinsDropdown),
  // loaders
  mfaLoader: getUsersDetailsLoading(getMFAValidation),
  clientDetailsLoading: getUsersDetailsLoading(clientDetails),
  projectDetailsLoading: getUsersDetailsLoading(projectDetails),
  roleLoading: getUsersDetailsLoading(allRoles),
  CurrentUserInfoLoading: getUsersDetailsLoading(CurrentUserInfoAction),
  tinDetailsLoading: getUsersDetailsLoading(tinsDropdown),
});

export default authReducer;
