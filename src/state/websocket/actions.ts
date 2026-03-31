import { createActionThunk } from "@/util/redux";

export const websocketAction = createActionThunk(
  "WEBSOCKET_ACTION",
  async (data: any) => data
);

export const websocketNotificationAction = createActionThunk(
  "WEBSOCKET_NOTIFICATION_ACTION",
  async (data: any) => data
);
