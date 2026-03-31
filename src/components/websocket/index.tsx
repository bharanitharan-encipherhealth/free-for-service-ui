"use client";
import { useEffect, memo } from "react";
import { connect, ConnectedProps } from "react-redux";
import useWebSocket from "react-use-websocket";
import { actions as webSocketActions } from "@/state/websocket";
import { webSocketUrl } from "@/util/config";
import { getStorage } from "@/util/storage";
import { RootState } from "@/state";

const mapState = (state: any) => ({
  webSocketData: state.webSocketReducer?.webSocketDetails?.data,
  webSocketNotificationData: state.webSocketReducer?.webSocketNotificationDetails?.data,
  // Mapping notification list similarly to legacy if dashboard exists
  notificationResponse: state.dashboardReducer?.notification?.data?.response,
});

const mapDispatch = {
  getWebSocketAllResult: webSocketActions.websocketAction,
  getNotificationData: webSocketActions.websocketNotificationAction,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const ConnectWebSocket: React.FC<PropsFromRedux> = ({
  webSocketData,
  getWebSocketAllResult,
  getNotificationData,
  webSocketNotificationData,
  notificationResponse,
}) => {
  const token = typeof window !== "undefined" ? getStorage("token") : null;
  const client = typeof window !== "undefined" ? getStorage("client") : null;
  const role = typeof window !== "undefined" ? getStorage("roleId") : null;

  // Exact URL logic from AM-CODING
  const WS_URL = token && client && role 
    ? `wss://${webSocketUrl}chatservice/chatservice/websocket?clientId=${client}&roleId=${role}&token=Bearer${token}`
    : null;

  const { lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    shouldReconnect: () => true,
  }, !!WS_URL);

  useEffect(() => {
    if (lastJsonMessage) {
      getWebSocketAllResult(lastJsonMessage);
    }
  }, [lastJsonMessage, getWebSocketAllResult]);

  useEffect(() => {
    if (webSocketData && webSocketData?.webSocketType === "NOTIFICATION") {
      let dataMap = null;
      let oldNotification = notificationResponse?.notificationList?.content || [];

      if (webSocketNotificationData) {
        dataMap = webSocketNotificationData;
      }

      if (dataMap) {
        const push = [webSocketData, ...dataMap];
        getNotificationData(push);
      } else {
        const push = [webSocketData, ...oldNotification];
        getNotificationData(push);
      }
    }
  }, [webSocketData, webSocketNotificationData, notificationResponse, getNotificationData]);

  return null;
};

export default memo(connector(ConnectWebSocket));
