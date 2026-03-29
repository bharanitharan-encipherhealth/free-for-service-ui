import React, { useCallback, useEffect, useState } from "react";
import style from "../../style.module.css";
import { Input, Skeleton } from "antd";
import { CiSearch } from "react-icons/ci";
import { connect, ConnectedProps } from "react-redux";
import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";
import { getStorage, setStorage } from "@/util/storage";
import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import { reusableEllipses } from "@/util/reusableFunction";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { FilterPropstype } from "@/models/tenantadmin/patients/DiagnosisDetails";

const Search = Input;
type MyWorkQueueReduxProps = ConnectedProps<typeof connector>;

type MyWorkQueueProps = FilterPropstype & MyWorkQueueReduxProps;
const MyWorkQueue = ({
  getWorkQueueData,
  workQueueData,
  workQueueLoading,
  getPatientOverallDetails,
  handleCloseModal,
}: MyWorkQueueProps) => {
  const userId = getStorage("userId");
  const [searchText, setSearchText] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [first, setFirst] = useState(15);

  const getWorkQueue = useCallback(async () => {
    await getWorkQueueData({ userId, searchText, pageNo });
  }, [getWorkQueueData, userId, searchText, pageNo]);

  const onPageChange = useCallback(
    (e: PaginatorPageChangeEvent) => {
      setPageNo(e.page);
      setFirst(e.first);
    },
    [pageNo],
  );

  const getPatientOverall = useCallback(
    async ({ patientId }: { patientId: string }) => {
      handleCloseModal();
      setStorage("patientId", patientId);
      await getPatientOverallDetails({ patientId });
    },
    [getPatientOverallDetails, handleCloseModal],
  );

  useEffect(() => {
    getWorkQueue();
  }, [getWorkQueue, searchText]);

  return (
    <div className="mx-1">
      <div className="flex gap-3">
        <Search
          placeholder="Search"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          prefix={<CiSearch className="text-xl font-semibold" />}
          className="text-xl"
        />
      </div>
      <div className="pt-5 mx-1">
        {workQueueLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <Skeleton.Input key={i} active block />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 overflow-scroll h-[77vh] pe-3 scroll-smooth">
            {workQueueData?.pageResponse?.content?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`border ${style?.workqueueBorderColor} p-2 rounded-md  flex justify-between items-center cursor-pointer`}
                  onClick={() =>
                    getPatientOverall({ patientId: item?.patientId })
                  }
                >
                  {reusableEllipses({ str: item?.patientName, count: 30 })}
                  {(item?.processedStatus == "PENDING" ||
                    item?.processedStatus == "COMPUTED") && (
                    <span className={style?.pendingColor}></span>
                  )}
                  {item?.processedStatus == "COMPLETED" && (
                    <span className={style?.completeColor}></span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="mt-5 pagination-container mx-1">
        <Paginator
          onPageChange={onPageChange}
          rows={15}
          first={first}
          totalRecords={workQueueData?.pageResponse?.totalElements}
          pageLinkSize={3}
        />
      </div>
    </div>
  );
};

MyWorkQueue.displayName = "MyWorkQueue";

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    workQueueData:
      state?.patientDetailsReducer?.patientWorkQueueData?.data?.response,
    workQueueLoading: state?.patientDetailsReducer?.patientWorkQueueLoading,
  }),
  {
    getWorkQueueData: patientDetailsAction?.getPatientListFilter,
    getPatientOverallYear: patientDetailsAction?.patientOverallYear,
    getPatientOverallDetails: patientDetailsAction?.patientOverallDetails,
  },
);

export default connector(MyWorkQueue);
