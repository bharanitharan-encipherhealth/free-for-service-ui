import { handleActions, Action } from "redux-actions";
import actions from "./actions";

interface DashboardState {
  widgets: {
    loading: boolean;
    data: any[];
    error: any;
  };
  saveResult: {
    loading: boolean;
    data: any | null;
    error: any;
  };
}

const initialState: DashboardState = {
  widgets: {
    loading: false,
    data: [],
    error: null,
  },
  saveResult: {
    loading: false,
    data: null,
    error: null,
  },
};

const reducer = handleActions<DashboardState, any>(
  {
    [`${actions.ACTIONS.GET_WIDGETS}_REQUEST`]: (state) => ({
      ...state,
      widgets: { ...state.widgets, loading: true },
    }),
    [`${actions.ACTIONS.GET_WIDGETS}_SUCCESS`]: (state, action: Action<any>) => ({
      ...state,
      widgets: { loading: false, data: action.payload?.response || [], error: null },
    }),
    [`${actions.ACTIONS.GET_WIDGETS}_FAILURE`]: (state, action: Action<any>) => ({
      ...state,
      widgets: { ...state.widgets, loading: false, error: action.payload },
    }),
    [`${actions.ACTIONS.SAVE_WIDGETS}_REQUEST`]: (state) => ({
        ...state,
        saveResult: { ...state.saveResult, loading: true },
      }),
    [`${actions.ACTIONS.SAVE_WIDGETS}_SUCCESS`]: (state, action: Action<any>) => ({
        ...state,
        saveResult: { loading: false, data: action.payload, error: null },
    }),
    [`${actions.ACTIONS.SAVE_WIDGETS}_FAILURE`]: (state, action: Action<any>) => ({
        ...state,
        saveResult: { ...state.saveResult, loading: false, error: action.payload },
    }),
  },
  initialState
);

export default reducer;
