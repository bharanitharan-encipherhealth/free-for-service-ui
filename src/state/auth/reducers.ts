import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import {
  allRoles,
  clientDetails,
  clientId,
  CurrentUserInfoAction,
  getMFAValidation,
  projectDetails,
  setRole,
  tinsDropdown,
} from "./actions";
import { ReducerType } from "../storeModal";

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
const getUsersDetailsLoading = (type: any) =>
  handleActions(
    {
      [type.STARTED]: () => true,
      [type.SUCCEEDED]: () => false,
      [type.FAILED]: () => false,
    },
    false
  );

const localRedux = (action: any) =>
  handleActions(
    {
      [action.toString()]: (state, { payload }) => payload,
    },
    ""
  );
const authReducer = combineReducers({
  allRolesData: createReducer(allRoles),
  clientDetails: createReducer(clientId),
  clientDropDown: createReducer(clientDetails),
  projectDetails: createReducer(projectDetails),
  CurrentUserInfo: createReducer(CurrentUserInfoAction),
  tinDetails: createReducer(tinsDropdown),
  selectedUserRole: localRedux(setRole),
  // loaders
  mfaLoader: getUsersDetailsLoading(getMFAValidation),
  clientDetailsLoading: getUsersDetailsLoading(clientDetails),
  projectDetailsLoading: getUsersDetailsLoading(projectDetails),
  roleLoading: getUsersDetailsLoading(allRoles),
  CurrentUserInfoLoading: getUsersDetailsLoading(CurrentUserInfoAction),
  tinDetailsLoading: getUsersDetailsLoading(tinsDropdown),
});

export default authReducer;
