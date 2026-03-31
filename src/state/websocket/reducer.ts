import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { ReducerType } from "../storeModal";
import * as actions from "./actions";

const initialState: ReducerType = {
  loading: true,
  data: null,
  error: null,
};

const createReducer = (actionType: any) =>
  handleActions(
    {
      [actionType.STARTED]: (state) => ({
        ...state,
        loading: true,
        error: null,
      }),
      [actionType.SUCCEEDED]: (state, action) => ({
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      }),
      [actionType.FAILED]: (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }),
    },
    initialState
  );

const websocketReducer = combineReducers({
  webSocketDetails: createReducer(actions.websocketAction),
  webSocketNotificationDetails: createReducer(actions.websocketNotificationAction),
});

export default websocketReducer;
