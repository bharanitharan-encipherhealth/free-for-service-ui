import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import actions from "./actions";

const initialState = {
  loading: true,
  data: null,
  error: null,
};

const createReducer = (actionThunk) =>
  handleActions(
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

const createLoadingReducer = (actionThunk) =>
  handleActions(
    {
      [actionThunk.START]: () => true,
      [actionThunk.SUCCEEDED]: () => false,
      [actionThunk.FAILED]: () => false,
    },
    false
  );

const reducers = {};

Object.entries(actions).forEach(([key, actionThunk]) => {
  const baseName = key.replace("Action", "");

  reducers[baseName] = createReducer(actionThunk);
  reducers[`${baseName}Loader`] = createLoadingReducer(actionThunk);
});

export default combineReducers(reducers);
