import { createAction } from "redux-actions";
import { fetchFromEndpoint, fetchFromEndpointPost } from "./network";

const ACTIONS = {
  GET_WIDGETS: "GET_WIDGETS",
  SAVE_WIDGETS: "SAVE_WIDGETS",
};

export const getWidgetsAction = (params: any) => async (dispatch: any) => {
  dispatch(createAction(`${ACTIONS.GET_WIDGETS}_REQUEST`)());
  try {
    const response = await fetchFromEndpoint("/dashboard/widgets", params);
    dispatch(createAction(`${ACTIONS.GET_WIDGETS}_SUCCESS`)(response));
  } catch (error) {
    dispatch(createAction(`${ACTIONS.GET_WIDGETS}_FAILURE`)(error));
  }
};

export const saveWidgetsAction = (body: any) => async (dispatch: any) => {
  dispatch(createAction(`${ACTIONS.SAVE_WIDGETS}_REQUEST`)());
  try {
    const response = await fetchFromEndpointPost("/dashboard/widgets/save", body);
    dispatch(createAction(`${ACTIONS.SAVE_WIDGETS}_SUCCESS`)(response));
  } catch (error) {
    dispatch(createAction(`${ACTIONS.SAVE_WIDGETS}_FAILURE`)(error));
  }
};

export default {
    getWidgetsAction,
    saveWidgetsAction,
    ACTIONS
};
