import {
  legacy_createStore as createStore,
  applyMiddleware,
  combineReducers,
  compose,
  Store,
  Middleware,
} from "redux";
import type { ThunkMiddleware } from "redux-thunk";
import { reducer as authReducer } from "./auth";
import { reducer as tableReducer } from "./table";
import { reducer as userReducer } from "./tenantadmin/users";
import { reducer as logsReducer } from "./tenantadmin/tracking";
import { reducer as productivityReducer } from "./tenantadmin/productivity";
import { reducer as reportReducer } from "./tenantadmin/report";
import { reducer as projectReducer } from "./tenantadmin/project";
import { reducer as patientAllocationReducer } from "./tenantadmin/tin/tinDetails/patientAllocation";
import { reducer as patinetReAllocationReducer } from "./tenantadmin/tin/tinDetails/patientReAllocation";
import { reducer as patinetMoveBackReducer } from "./tenantadmin/tin/tinDetails/moveBack";
import { reducer as patientDetailsReducer } from "./tenantadmin/patients/details";
import dashboardReducer from "./tenantadmin/dashboard/reducer";
import { reducer as adminDashboardReducer } from "./admin/dashboard";

// Import thunk middleware using require to handle module export issues
// eslint-disable-next-line @typescript-eslint/no-var-requires
const thunkModule = require("redux-thunk");
// Handle both default export and named export - ensure we get a function
let thunk: ThunkMiddleware;
if (typeof thunkModule === "function") {
  thunk = thunkModule;
} else if (thunkModule.default && typeof thunkModule.default === "function") {
  thunk = thunkModule.default;
} else if (thunkModule.thunk && typeof thunkModule.thunk === "function") {
  thunk = thunkModule.thunk;
} else {
  throw new Error("Could not find thunk middleware function in redux-thunk");
}

// Import redux-promise middleware
// eslint-disable-next-line @typescript-eslint/no-var-requires
const promiseModule = require("redux-promise");
const promiseMiddleware =
  (typeof promiseModule === "function" ? promiseModule : null) ||
  (promiseModule.default && typeof promiseModule.default === "function"
    ? promiseModule.default
    : null);

// ✅ Combine reducers
const rootReducer = combineReducers({
  authReducer: authReducer,
  tableView: tableReducer,
  userReducer: userReducer,
  logsReducer: logsReducer,
  productivityReducer: productivityReducer,
  reportReducer: reportReducer,
  projectReducer: projectReducer,
  tinDetailsReducer: combineReducers({
    patientAllocationReducer: patientAllocationReducer,
    patinetReAllocationReducer: patinetReAllocationReducer,
    patinetMoveBackReducer: patinetMoveBackReducer,
  }),
  patientDetailsReducer: patientDetailsReducer,
  dashboardReducer: dashboardReducer,
  // Expose admin.dashboard and admin.dashboard1 as expected by dashboard components
  admin: combineReducers({
    dashboard: adminDashboardReducer,
    dashboard1: adminDashboardReducer,
  }),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = Store<RootState>["dispatch"];

// ✅ Define middlewares correctly - ensure all are functions
const middlewares: Middleware[] = [];

// Add thunk middleware
if (typeof thunk === "function") {
  middlewares.push(thunk as unknown as ThunkMiddleware<RootState, any>);
}

// Add ReduxPromise middleware
if (promiseMiddleware && typeof promiseMiddleware === "function") {
  middlewares.push(promiseMiddleware as unknown as Middleware);
}

// ✅ Add logger in dev mode
if (process.env.NODE_ENV !== "production") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const loggerModule = require("redux-logger");
    const createLogger =
      loggerModule.createLogger ||
      loggerModule.default?.createLogger ||
      loggerModule.default;
    if (typeof createLogger === "function") {
      const logger = createLogger();
      if (typeof logger === "function") {
        middlewares.push(logger);
      }
    } else if (typeof loggerModule.logger === "function") {
      middlewares.push(loggerModule.logger);
    }
  } catch (error) {
    // Logger is optional, continue without it
    console.warn("redux-logger not available:", error);
  }
}

// ✅ Support Redux DevTools Extension
const composeEnhancers =
  (typeof window !== "undefined" &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const composedEnhancers = composeEnhancers(applyMiddleware(...middlewares));

export const store: Store<RootState> = createStore(
  rootReducer,
  composedEnhancers,
);

export default store;
