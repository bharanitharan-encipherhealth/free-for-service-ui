import React from "react";
import style from "../../../style.module.css";
import { DiseaseItem } from "@/models/tenantadmin/patients/details";
import { LuSquarePen } from "react-icons/lu";
import { BsDiagram3 } from "react-icons/bs";
import MovementIcon from "../../movementIcon";
import { FaUserDoctor } from "react-icons/fa6";
import { renderProviderSection } from "../../function/renderingFunction";
import { reusableEllipses } from "@/util/reusableFunction";
import { IoCalendarOutline } from "react-icons/io5";
import { GiMedicines } from "react-icons/gi";
import DiseaseTag from "../../diseaseTag";
import MeatSection from "../../meatSection";

type DiseaseOverlayProps = {
  item: DiseaseItem;
  cardTitle: string;
};

const DiseaseOverlay: React.FC<DiseaseOverlayProps> = ({ item, cardTitle }) => {
  return (
    <div
      className={`w-64 my-2 ${style.hccCard} p-2 bg-white shadow-lg cursor-grabbing`}
    >
      {/* disease code section */}
      <div className="flex justify-between items-center">
        <div className="text-sm font-bold">{item?.diagnosisCode}</div>

        <div className="flex gap-2 items-center">
          <div className="iconBagColor border-r border-gray-300 pe-2">
            <LuSquarePen className="font-bold text-base" />
          </div>

          {item?.children?.length > 0 && (
            <div
              className={`${style.comboCode} border-gray-300 border-r pe-2 `}
            >
              <BsDiagram3 className="font-bold text-base" />
            </div>
          )}

          <div>
            <MovementIcon
              showMoveIcon={{
                diagnosisIcon: cardTitle !== "Diagnosis",
                careGapIcon: cardTitle !== "CargeGap",
                potientialIcon: cardTitle !== "Suggested",
                deleteIcon: cardTitle !== "Delete",
              }}
              data={item}
              dragId=""
              isDisabledStatus={false}
            />
          </div>
        </div>
      </div>

      {/* disease description section */}
      <div className="text-xs my-1 font-medium">
        {reusableEllipses({
          str: item?.actualDescription,
          count: 40,
        })}
      </div>

      <div className="flex flex-col my-2 gap-1">
        {/* provider section */}
        <div className="flex gap-2 items-center">
          <div className="iconBagColor">
            <FaUserDoctor />
          </div>
          <div className={`flex gap-2 ${style?.borderLast}`}>
            {renderProviderSection({
              capture: item?.providerNames,
              hyperLinks: item?.providerHyperlinks,
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
              capture: item?.dateOfServices,
              hyperLinks: item?.dosHyperlinks,
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
                capture: item?.capturedSections,
                hyperLinks: item?.hyperlinks,
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
  );
};

export default DiseaseOverlay;
