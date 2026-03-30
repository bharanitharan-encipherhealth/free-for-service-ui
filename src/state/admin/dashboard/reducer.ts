import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import actions from "./actions";

interface DashboardState {
  loading: boolean;
  data: any;
  error: any;
}

const initialState: DashboardState = {
  loading: true,
  data: null,
  error: null,
};

const createReducer = (actionThunk: any) =>
  handleActions<DashboardState, any>(
    {
      [actionThunk.START]: (state) => ({ ...state, loading: true, error: null }),
      [actionThunk.SUCCEEDED]: (state, action) => ({
        loading: false,
        data: action.payload,
        error: null,
      }),
      [actionThunk.FAILED]: (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }),
    },
    initialState
  );

const createLoadingReducer = (actionThunk: any) =>
  handleActions<boolean, any>(
    {
      [actionThunk.START]: () => true,
      [actionThunk.SUCCEEDED]: () => false,
      [actionThunk.FAILED]: () => false,
    },
    false
  );

const reducers: Record<string, any> = {};

Object.entries(actions as Record<string, any>).forEach(([key, actionThunk]) => {
  const baseName = key.replace("Action", "");

  reducers[baseName] = createReducer(actionThunk);
  reducers[`${baseName}Loader`] = createLoadingReducer(actionThunk);
});

export default combineReducers(reducers);
