import PageHeaderLayout from "@/components/layout/pageHeaderLayout/page";
import patinetMovebackReducerType from "@/state/tenantadmin/patients/details/model";
import { useMemo } from "react";
import {
  FaCalendarAlt,
  FaClinicMedical,
  FaRegUserCircle,
  FaTransgender,
} from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiIdCardLine } from "react-icons/ri";
import { SlCalender } from "react-icons/sl";
import { connect, ConnectedProps } from "react-redux";
import YearStatusAction from "../yearStatus";
import style from "../../../../../../components/layout/ContentLayout/style.module.css";

type PatientDetailsHeaderReduxType = ConnectedProps<typeof connector>;

type PatientDetailsHeaderProps = PatientDetailsHeaderReduxType & {
  onHandleBack: () => void;
  getPatientDetails: ({ patientId }: { patientId: string }) => void;
};
function PatientDetailsHeader({
  patientOverallDetails,
  patientOverallDetailsLoading,
  onHandleBack,
  getPatientDetails,
}: PatientDetailsHeaderProps) {
  const headerData = useMemo(
    () => [
      {
        value: patientOverallDetails?.patientName,
        icon: <FaRegUserCircle />,
      },
      {
        value: patientOverallDetails?.mrNumber,
        icon: <RiIdCardLine />,
      },
      {
        value: patientOverallDetails?.fileName,
        icon: <IoDocumentTextOutline />,
      },
      {
        value: patientOverallDetails?.age,
        icon: <FaCalendarAlt />,
      },
      {
        value: patientOverallDetails?.dob,
        icon: <SlCalender />,
      },
      {
        value: patientOverallDetails?.gender,
        icon: <FaTransgender />,
      },
      {
        value: patientOverallDetails?.patientType,
        icon: <FaClinicMedical />,
      },
    ],
    [patientOverallDetails],
  );

  return (
      <PageHeaderLayout
        loading={patientOverallDetailsLoading}
        data={headerData}
        onHandleBack={onHandleBack}
      >
        <YearStatusAction getPatientDetails={getPatientDetails} />
      </PageHeaderLayout>
  );
}

const connector = connect(
  (state: { patientDetailsReducer: patinetMovebackReducerType }) => ({
    patientOverallDetails:
      state?.patientDetailsReducer?.patientOverallDetails?.data?.response,
    patientOverallDetailsLoading:
      state?.patientDetailsReducer?.patietOverallDetailsLoading,
  }),
  {},
);

export default connector(PatientDetailsHeader);
