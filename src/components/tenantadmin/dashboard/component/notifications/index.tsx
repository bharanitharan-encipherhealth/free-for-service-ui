import React, { useState } from "react";
import Image from "next/image";
import moment from "moment";
import { Col, Modal, Row, Skeleton } from "antd";
import styles from "./styles.module.css";
import HeadTitle from "../headtitle";
import { IoNotificationsOutline } from "react-icons/io5";
import { truncateString, capitalizeFirstLetter } from "@/util/reusableFunction";

const NoNotification = "/images/dashboard/no-notification.webp";

export const NotifiAvatar: React.FC = () => {
  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      {[80, 60, 70, 70].map((width, index) => (
        <Row
          gutter={16}
          align="top"
          className="mb-4"
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

interface NotificationItem {
  id: string | number;
  content: string;
  createdDate: string;
  fromUserDetails?: {
    firstName?: string;
    lastName?: string;
  };
}

interface NotificationsProps {
  notificationResponse?: any;
  notificationLoading?: boolean;
  webSocketNotificationData?: NotificationItem[];
  useDummyData?: boolean;
  dummyNotificationData?: NotificationItem[];
}

const Notifications: React.FC<NotificationsProps> = ({
  notificationResponse,
  notificationLoading,
  webSocketNotificationData,
  useDummyData = false,
  dummyNotificationData = [],
}) => {
  const notificationResult: NotificationItem[] = useDummyData
    ? dummyNotificationData
    : webSocketNotificationData || notificationResponse?.data?.response?.notificationList?.content || [];

  const [openNotifications, setOpenNotifications] = useState(false);

  const handleOpen = () => setOpenNotifications(!openNotifications);
  const handleOk = () => setOpenNotifications(false);

  const renderNotificationItem = (info: NotificationItem) => (
    <div className={styles.msgDiv} key={info?.id}>
      <div className="mt-2.5">
        <IoNotificationsOutline className={styles.notifyIconColor} />
      </div>
      <div className={`${styles.msgCOntainer} m-2`}>
        <span className={styles.description}>
          {truncateString(info.content, 40)}
        </span>
        <div className={styles.time}>
          {moment(info?.createdDate).format("MM-DD-YYYY")} &nbsp;
          {moment(info?.createdDate).format("hh:mm A")} &nbsp;
          {`(${capitalizeFirstLetter(
            info?.fromUserDetails?.firstName || ""
          )} ${capitalizeFirstLetter(
            info?.fromUserDetails?.lastName || ""
          )})`.trim()}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <HeadTitle
        header="Rebuttal Notifications"
        anchorTag={notificationResult.length > 0 ? "anchor" : null}
        handleOpen={handleOpen}
      />

      <div className={styles.card4}>
        {notificationLoading && !useDummyData ? (
          <NotifiAvatar />
        ) : notificationResult.length > 0 ? (
          <div className={styles.container}>
            {notificationResult.map(renderNotificationItem)}
          </div>
        ) : (
          <div className={styles.no_notificarion_container}>
            {!notificationLoading && (
              <div className="my-2 flex items-center justify-center">
                <Image
                  className={styles.img}
                  src={NoNotification}
                  alt="no-notification"
                  width={200}
                  height={200}
                />
              </div>
            )}
          </div>
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
        ) : notificationResult.length <= 0 ? (
          <div className="flex items-center justify-center">
            <Image
              className={styles.img}
              src={NoNotification}
              alt="no-notification"
              width={200}
              height={200}
            />
          </div>
        ) : (
          <div className={styles.container} style={{ height: "500px" }}>
            {notificationResult.map((info) => (
              <div className={styles.msgDiv} key={info?.id}>
                <div className="mt-2.5">
                  <IoNotificationsOutline
                    className={styles.notifyIconColor}
                  />
                </div>
                <div className={`${styles.msgCOntainer} m-2`}>
                  <span className="send_details">{info.content}</span>
                  <div className={styles.time}>
                    {moment(info?.createdDate).format("MM-DD-YYYY")} &nbsp;
                    {moment(info?.createdDate).format("hh:mm A")} &nbsp;
                    {`(${capitalizeFirstLetter(
                      info?.fromUserDetails?.firstName || ""
                    )} ${capitalizeFirstLetter(
                      info?.fromUserDetails?.lastName || ""
                    )})`.trim()}
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

export default Notifications;
