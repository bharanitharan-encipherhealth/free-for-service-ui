import { combineReducers, Reducer } from "redux";
import { handleActions } from "redux-actions";
import actions from "./actions";
import { AsyncState } from "./model";

const initialState: AsyncState = {
  loading: true,
  data: null,
  error: null,
};

const createReducer = ({ actionThunk }: { actionThunk: any }) =>
  handleActions<AsyncState>(
    {
      [actionThunk.START]: (state) => ({
        ...state,
        loading: true,
        error: null,
      }),

      [actionThunk.SUCCEEDED]: (state, action) => ({
        ...state,
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
  handleActions<boolean>(
    {
      [actionThunk.START]: () => true,
      [actionThunk.SUCCEEDED]: () => false,
      [actionThunk.FAILED]: () => false,
    },
    false
  );

const reducers: Record<string, Reducer<any, any>> = {};


Object.entries(actions).forEach(([key, actionThunk]) => {
  const baseName = key.replace("Action", "");

  reducers[baseName] = createReducer({ actionThunk });
  reducers[`${baseName}Loader`] = createLoadingReducer(actionThunk);
});

export default combineReducers(reducers);
