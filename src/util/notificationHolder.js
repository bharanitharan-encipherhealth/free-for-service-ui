/**
 * Holds the Ant Design notification API from App.useApp() so static/plain
 * functions like getResponePopup can use context-aware notifications.
 * Set by AntdNotificationBridge (inside Ant Design's App component).
 */
let notificationApi = null;

export function setNotificationApi(api) {
  notificationApi = api;
}

export function getNotificationApi() {
  return notificationApi;
}
