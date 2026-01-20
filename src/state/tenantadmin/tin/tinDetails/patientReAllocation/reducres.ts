import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { ReducerType } from "../../../../storeModal";
import { getReAllocateUserList } from "./actions";

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
const getUserLoading = (type: any) =>
  handleActions(
    {
      [type.START]: () => true,
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
const patinetReAllocationReducer = combineReducers({
  getUsersLoading: getUserLoading(getReAllocateUserList),
  getUserList: createReducer(getReAllocateUserList),
});

export default patinetReAllocationReducer;
