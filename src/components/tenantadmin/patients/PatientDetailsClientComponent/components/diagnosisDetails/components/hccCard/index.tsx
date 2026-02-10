import { HccCardType } from "@/models/tenantadmin/patients/DiagnosisDetails";
import noData from "@/../public/images/avatar/noData.png";
import Image from "next/image";
import style from "../../style.module.css";
import { LuSquarePen } from "react-icons/lu";
import { BsDiagram3 } from "react-icons/bs";
import MovementIcon from "../movementIcon";
import { reusableEllipses } from "@/util/reusableFunction";
import { renderProviderSection } from "../function/renderingFunction";
import { connect, ConnectedProps } from "react-redux";
import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";
import { FaUserDoctor } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { GiMedicines } from "react-icons/gi";
import DiseaseTag from "../diseaseTag";
import MeatSection from "../meatSection";
import { Skeleton } from "antd";

type HccCardReduxtype = ConnectedProps<typeof connector>;
type HccCardPropsType = HccCardType & HccCardReduxtype;

function HccCard({
  diseaseData,
  cardTitle,
  setPdfSearch,
  pdfSearchValue,
  patientDiseaseDetailsLoading,
  patientDosDetailsLoading,
  pageLoading,
  setAddModalOpen,
  setEditDiseaseList,
}: HccCardPropsType) {
  return (
    <div className="h-full w-full overflow-scroll">
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
            <div
              key={index + item?.diagnosisCode}
              className={`w-full my-2 ${style.hccCard} p-2`}
            >
              {/* disease code section */}
              <div className="flex justify-between items-center">
                <div className="text-sm font-bold">{item?.diagnosisCode}</div>

                <div className="flex gap-2 items-center">
                  <div
                    className="iconBagColor border-r border-gray-300 pe-2 cursor-pointer"
                    onClick={() => {
                      setAddModalOpen({ isEdit: true });
                      setEditDiseaseList(item);
                    }}
                  >
                    <LuSquarePen className="font-bold text-base" />
                  </div>

                  <div
                    className={`${style.comboCode} border-gray-300 border-r pe-2 `}
                  >
                    <BsDiagram3 className="font-bold text-base" />
                  </div>

                  <div className={`${style?.borderLast}`}>
                    <MovementIcon
                      showMoveIcon={{
                        diagnosisIcon: cardTitle !== "Diagnosis",
                        careGapIcon: cardTitle !== "CargeGap",
                        potientialIcon: cardTitle !== "Suggested",
                        deleteIcon: cardTitle !== "Delete",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* disease discription section */}
              <div className="text-xs my-1 font-medium">
                {reusableEllipses({ str: item?.actualDescription, count: 40 })}
              </div>

              <div className="flex flex-col my-2 gap-1">
                {/* provider section */}

                <div className="flex gap-2 items-center">
                  <div className="iconBagColor">
                    <FaUserDoctor />
                  </div>
                  <div className={`flex gap-2 ${style?.borderLast}`}>
                    {renderProviderSection({
                      setPdfSearch,
                      capture: item?.providerNames,
                      hyperLinks: item?.providerHyperlinks,
                      pdfSearchValue: pdfSearchValue,
                      hyperlinkKey: "header",
                      isDateShow: false,
                      sectionName: "providerSection",
                    })}
                  </div>
                </div>

                {/* date of service section */}
                <div className="flex gap-2 items-center ">
                  <div className="iconBagColor">
                    <IoCalendarOutline />
                  </div>
                  <div className={`flex gap-1 ${style?.borderLast}`}>
                    {renderProviderSection({
                      setPdfSearch,
                      capture: item?.dateOfServices,
                      hyperLinks: item?.dosHyperlinks,
                      pdfSearchValue: pdfSearchValue,
                      hyperlinkKey: "dateOfService",
                      isDateShow: true,
                      sectionName: "dateSection",
                    })}
                  </div>
                </div>

                {/* disease capture section */}

                {item?.capturedSections?.length ? (
                  <div className="flex gap-2 items-center">
                    <div className="iconBagColor">
                      <GiMedicines />
                    </div>

                    <div className={`flex gap-1 ${style?.borderLast} `}>
                      {renderProviderSection({
                        setPdfSearch,
                        capture: item?.capturedSections,
                        hyperLinks: item?.hyperlinks,
                        pdfSearchValue: pdfSearchValue,
                        hyperlinkKey: "dateOfService",
                        isDateShow: false,
                        sectionName: "captureSection",
                      })}
                    </div>
                  </div>
                ) : null}

                {/* tags section */}
                <div>
                  <DiseaseTag data={item} />
                </div>

                {/* MEAT SECTION */}
                <div className="flex gap-2 items-center">
                  <MeatSection meatDetails={item} />
                </div>
              </div>
            </div>
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
    pdfSearchValue: state?.patientDetailsReducer?.setPdfSearch,
    patientDiseaseDetailsLoading:
      state?.patientDetailsReducer?.patientDiseaseDetailsLoading,
    patientDosDetailsLoading:
      state?.patientDetailsReducer?.patientDosDetailsLoading,
    pageLoading: state?.patientDetailsReducer?.setPageLoading,
  }),
  {
    setPdfSearch: patientDetailsAction?.setPdfSearch,
    setAddModalOpen: patientDetailsAction?.setAddModaOpen,
    setEditDiseaseList: patientDetailsAction?.setEditDiseaseList,
  },
);

export default connector(HccCard);
