import { HccCardType } from "@/models/tenantadmin/patients/DiagnosisDetails";
import noData from "@/../public/images/avatar/noData.png";
import Image from "next/image";
import { connect, ConnectedProps } from "react-redux";
import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";
import { Skeleton } from "antd";
import HccCardRow from "./hccCardRow";

type HccCardReduxtype = ConnectedProps<typeof connector>;
type HccCardPropsType = HccCardType & HccCardReduxtype;

function HccCard({
  diseaseData,
  cardTitle,
  patientDiseaseDetailsLoading,
  patientDosDetailsLoading,
  pageLoading,
  dragId,
}: HccCardPropsType) {
  return (
    <div className="h-full w-full overflow-y-auto">
      {patientDosDetailsLoading ||
      patientDiseaseDetailsLoading ||
      pageLoading ? (
        <div className="w-full flex flex-col gap-2 my-2 overflow-hidden">
          {Array.from({ length: 4 })?.map((_, index) => (
            <Skeleton.Input
              key={index}
              className="w-full h-full"
              block
              style={{ height: 150 }}
            />
          ))}
        </div>
      ) : diseaseData?.length ? (
        <div className="w-full">
          {diseaseData?.map((item, index) => (
            <HccCardRow
              item={item}
              index={index}
              key={index}
              cardTitle={cardTitle}
              dragId={dragId}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <Image
            width={150}
            height={150}
            src={noData}
            priority
            fetchPriority="high"
            loading="eager"
            alt="No Data Available"
          />
        </div>
      )}
    </div>
  );
}

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    patientDiseaseDetailsLoading:
      state?.patientDetailsReducer?.patientDiseaseDetailsLoading,
    patientDosDetailsLoading:
      state?.patientDetailsReducer?.patientDosDetailsLoading,
    pageLoading: state?.patientDetailsReducer?.setPageLoading,
  }),
  {},
);

export default connector(HccCard);
