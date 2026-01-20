import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { getReportTable, tabelViewCall } from "./actions";
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
const getTableLoading = (type: any) =>
  handleActions(
    {
      [type.START]: () => true,
      [type.SUCCEEDED]: () => false,
      [type.FAILED]: () => false,
    },
    true
  );

const localRedux = (action: any) =>
  handleActions(
    {
      [action.toString()]: (state, { payload }) => payload,
    },
    ""
  );
const authReducer = combineReducers({
  tableView: createReducer(tabelViewCall),
  reportTable: createReducer(getReportTable),

  //   loader
  tableViewLoading: getTableLoading(tabelViewCall),
  reportTableLoader: getTableLoading(getReportTable),
});

export default authReducer;
