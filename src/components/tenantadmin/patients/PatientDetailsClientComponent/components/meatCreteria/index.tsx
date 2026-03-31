import React, { useCallback, useMemo } from "react";
import { connect, ConnectedProps } from "react-redux";

import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import MeatRow from "./components/meatRow";
import { Skeleton } from "antd";

type MeatCreteriaType = ConnectedProps<typeof connector>;
const MeatCreteria = React.memo(
  ({
    patientDiseaseDetails,
    patientDiseaseDetailsLoading,
    patientDosDetailsLoading,
    pageLoading,
  }: MeatCreteriaType) => {
    const MeatCreteriaList = useMemo(
      () => patientDiseaseDetails?.meatCriteria?.filter((item) => item?.isShow),
      [patientDiseaseDetails],
    );

    const deletedMeatCreteriaList = useMemo(
      () =>
        patientDiseaseDetails?.deletedMeatCriteria?.filter(
          (item) => item?.isShow,
        ),
      [patientDiseaseDetails],
    );

    return (
      <div className="content w-full">
        {patientDiseaseDetailsLoading ||
        patientDosDetailsLoading ||
        pageLoading ? (
          <div>
            <Skeleton.Input block={true} active style={{ height: "50px" }} />
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="skeleton-row my-3">
                <Skeleton.Input
                  block={true}
                  active
                  style={{ height: "150px" }}
                />
              </div>
            ))}
          </div>
        ) : (
          <>
            <MeatRow
              meatCreteriaList={MeatCreteriaList}
              meatCreteria={"meat"}
              isHeight={Boolean(deletedMeatCreteriaList?.length)}
            />

            {deletedMeatCreteriaList?.length ? (
              <div className="my-2 ">
                {/* <div className="font-bold px-2 my-2 text-red-500 uppercase">
                  Deleted Meat
                </div> */}
                <>
                  <MeatRow
                    meatCreteriaList={deletedMeatCreteriaList}
                    meatCreteria={"delete"}
                    isHeight={Boolean(deletedMeatCreteriaList?.length)}
                  />
                </>
              </div>
            ) : null}
          </>
        )}
      </div>
    );
  },
);

MeatCreteria.displayName = "MeatCreteria";

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    patientDiseaseDetails:
      state?.patientDetailsReducer?.patientDiseaseDetails?.data?.response,
    patientDiseaseDetailsLoading:
      state?.patientDetailsReducer?.patientDiseaseDetailsLoading,
    patientDosDetailsLoading:
      state?.patientDetailsReducer?.patientDosDetailsLoading,
    pageLoading: state?.patientDetailsReducer?.setPageLoading,
  }),
  {},
);

export default connector(MeatCreteria);
