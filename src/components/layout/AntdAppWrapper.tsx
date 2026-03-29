"use client";

import { App } from "antd";
import { useEffect } from "react";
import { setNotificationApi } from "@/util/notificationHolder";

/**
 * Bridge that captures notification API from Ant Design App context
 * and stores it for use by getResponePopup (plain function).
 */
function AntdNotificationBridge() {
  const { notification } = App.useApp();
  useEffect(() => {
    setNotificationApi(notification);
  }, [notification]);
  return null;
}

export default function AntdAppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <App>
      <AntdNotificationBridge />
      {children}
    </App>
  );
}
