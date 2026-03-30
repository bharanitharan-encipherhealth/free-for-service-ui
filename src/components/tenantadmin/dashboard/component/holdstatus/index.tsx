import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Empty, Modal, Skeleton } from "antd";
import { connect } from "react-redux";
import { useRouter } from "next/navigation";
import Card from "../card";
import HeadTitle from "../headtitle";
import { holdStatusAction } from "../../../../../state/admin/dashboard/actions";
import { setStorage } from "../../../../../util/storage";

interface HoldStatusProps {
  getHoldStatusData?: any;
  holdStatusData?: any;
  useDummyData?: boolean;
  dummyHoldData?: any[];
}

export const HoldStatus: React.FC<HoldStatusProps> = ({
  getHoldStatusData,
  holdStatusData,
  useDummyData = false,
  dummyHoldData = [],
}) => {
  const [openHoldStatus, setOpenHoldStatus] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!useDummyData) {
      getHoldStatusData();
    }
  }, [getHoldStatusData, useDummyData]);

  const sourceData = useDummyData
    ? dummyHoldData
    : holdStatusData?.data?.response;

  const processedData = sourceData?.map((item: any) => {
    let testValue = "no data";
    if (item.holdNotes && item.holdNotes.length > 0) {
      item.holdNotes.forEach((obj: any) => {
        if (obj["2023"]) {
          testValue = obj["2023"];
        }
      });
    }
    return {
      patientId: item.patientId,
      testValue: item.noteText ?? testValue,
    };
  });

  const TableData = (
    <table className={styles.classTable}>
      <thead className={styles.tableHead}>
        <tr>
          <th className="font2 bold text-start p-2 text-white">Patient ID</th>
          <th className="font2 bold text-start p-2 text-white">Reason</th>
        </tr>
      </thead>
      <tbody className={styles.body}>
        {processedData?.length > 0 ? (
          processedData.map((item: any, index: number) => (
            <tr
              key={index}
              className={styles.tabelCell}
              onClick={() => {
                setStorage("patientId", item?.patientId);
                router.push("/reviewer/patients/details");
              }}
            >
              <td className={styles.description}>{item.patientId}</td>
              <td className={styles.description}>
                {item.testValue ? item.testValue : "---"}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={2}>
              <Empty
                style={{
                  paddingTop: "50px",
                  textAlign: "center",
                  height: "260px",
                }}
              />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  const handleOpen = () => setOpenHoldStatus(!openHoldStatus);
  const handleOk = () => setOpenHoldStatus(false);

  return (
    <>
      <HeadTitle
        header="Hold Status"
        anchorTag={processedData?.length > 0 ? "anchor" : null}
        handleOpen={processedData?.length > 0 ? handleOpen : undefined}
      />
      <div
        className={styles.card6}
        onClick={processedData?.length > 0 ? handleOpen : undefined}
        style={{ cursor: processedData?.length > 0 ? "pointer" : "default" }}
      >
        <Card borderRadius="28px" padding="10px">
          {!useDummyData && holdStatusData?.loading ? (
             <Skeleton active paragraph={{ rows: 6 }} />
          ) : (
            <div className={styles.container}>{TableData}</div>
          )}
        </Card>
      </div>

      <Modal
        title="Hold Status"
        open={openHoldStatus}
        footer={null}
        width="50%"
        closable={true}
        onCancel={handleOk}
      >
        {!useDummyData && holdStatusData?.loading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <div className={styles.container} style={{ height: "500px" }}>
            {TableData}
          </div>
        )}
      </Modal>
    </>
  );
};

const enhancer = connect(
  (state: any) => ({
    holdStatusData: state?.admin?.dashboard?.holdStatus,
  }),
  {
    getHoldStatusData: holdStatusAction,
  }
);
export default enhancer(HoldStatus);
