import React, { useState } from "react";
import { connect } from "react-redux";
import Image from "next/image";
import moment from "moment";
import { Col, Modal, Row, Skeleton, Typography } from "antd";
import { BellOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";
import Card from "../card";
import HeadTitle from "../headtitle";
import NoNotification from "@/images/dashboard/no-notification.webp";

const { Text } = Typography;

interface NotificationInfo {
  id: string;
  content: string;
  createdDate: string;
  fromUserDetails?: {
    firstName: string;
    lastName: string;
  };
}

interface NotificationsProps {
  notificationResponse?: any;
  notificationLoading?: boolean;
  webSocketNotificationData?: NotificationInfo[] | null;
  useDummyData?: boolean;
  dummyNotificationData?: NotificationInfo[];
}

const truncateString = (str: string, num: number) => {
  if (str?.length <= num) return str;
  return str?.slice(0, num) + "...";
};

const capitalizeFirstLetter = (string: string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const NotifiAvatar = () => {
  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      {[80, 60, 70, 70].map((width, index) => (
        <Row
          gutter={16}
          align="top"
          style={{ marginBottom: "16px" }}
          key={index}
        >
          <Col>
            <Skeleton.Avatar active size="large" shape="circle" />
          </Col>
          <Col flex="auto">
            <Skeleton
              active
              title={false}
              paragraph={{ rows: 2, width: `${width}%` }}
            />
          </Col>
        </Row>
      ))}
    </div>
  );
};

export const Notifications: React.FC<NotificationsProps> = ({
  notificationResponse,
  notificationLoading,
  webSocketNotificationData,
  useDummyData = false,
  dummyNotificationData = [],
}) => {
  const notificationResult = useDummyData
    ? dummyNotificationData
    : webSocketNotificationData
    ? webSocketNotificationData
    : notificationResponse?.data?.response?.notificationList?.content;

  const [openNotifications, setOpenNotifications] = useState(false);

  const handleOpen = () => setOpenNotifications(!openNotifications);
  const handleOk = () => setOpenNotifications(false);

  const renderNotificationItem = (info: NotificationInfo) => (
    <div className={styles.msgDiv} key={info?.id}>
      <div style={{ marginTop: "10px" }}>
        <BellOutlined className={styles.notifyIconColor} style={{ fontSize: '20px' }} />
      </div>
      <div className={`${styles.msgCOntainer} m-2`}>
        <span className={styles.description}>
          {truncateString(info.content, 40)}
        </span>
        <div className={styles.time}>
          {moment(info?.createdDate).format("MM-DD-YYYY")} &nbsp;
          {moment(info?.createdDate).format("hh:mm A")} &nbsp;
          {info?.fromUserDetails && (
            `(${capitalizeFirstLetter(
              info.fromUserDetails.firstName
            )} ${capitalizeFirstLetter(
              info.fromUserDetails.lastName
            )})`.trim()
          )}
        </div>
      </div>
    </div>
  );

  const notificationData =
    notificationResult?.length > 0 ? (
      notificationResult.map((info: NotificationInfo) => renderNotificationItem(info))
    ) : (
      <div className={styles.no_notificarion_container}>
        {!notificationLoading && (
          <div className="my-2 flex items-center justify-center">
            <Image
              className={styles.img}
              src={NoNotification}
              alt="no-notification"
            />
          </div>
        )}
      </div>
    );

  return (
    <>
      <HeadTitle
        header="Rebuttal Notifications"
        anchorTag={
          notificationResult?.length > 0
            ? "anchor"
            : null
        }
        handleOpen={handleOpen}
      />

      <div className={styles.card4} onClick={notificationResult?.length > 0 ? handleOpen : undefined} style={{ cursor: notificationResult?.length > 0 ? 'pointer' : 'default' }}>
        {notificationLoading && !useDummyData ? (
          <NotifiAvatar />
        ) : (
          <Card borderRadius="8px" padding="10px">
            <div className={styles.container}>{notificationData}</div>
          </Card>
        )}
      </div>
      <Modal
        title="Notifications"
        open={openNotifications}
        footer={null}
        width="50%"
        closable={true}
        onCancel={handleOk}
      >
        {notificationLoading && !useDummyData ? (
          <NotifiAvatar />
        ) : notificationResult?.length <= 0 ? (
          <div className="flex items-center justify-center">
            <Image
              className={styles.img}
              src={NoNotification}
              alt="no-notification"
            />
          </div>
        ) : (
          <div className={styles.container} style={{ height: "500px", overflowY: 'auto' }}>
            {notificationResult?.map((info: NotificationInfo) => (
              <div className={styles.msgDiv} key={info?.id}>
                <div style={{ marginTop: "10px" }}>
                   <BellOutlined className={styles.notifyIconColor} style={{ fontSize: '20px' }} />
                </div>
                <div className={`${styles.msgCOntainer} m-2`}>
                  <Text className="send_details">{info.content}</Text>
                  <div className={styles.time}>
                    {moment(info?.createdDate).format("MM-DD-YYYY")} &nbsp;
                    {moment(info?.createdDate).format("hh:mm A")} &nbsp;
                    {info?.fromUserDetails && (
                      `(${capitalizeFirstLetter(
                        info.fromUserDetails.firstName
                      )} ${capitalizeFirstLetter(
                        info.fromUserDetails.lastName
                      )})`.trim()
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
};

const enhancer = connect(
  (state: any) => ({
    notificationResponse: state?.admin?.dashboard?.notificationResponse,
    notificationLoading: state?.admin?.dashboard?.notificationLoading,
    webSocketNotificationData: state?.admin?.dashboard?.webSocketNotificationData,
  }),
  {}
);

export default enhancer(Notifications);
