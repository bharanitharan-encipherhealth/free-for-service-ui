import { patientSubHeaderType } from "@/models/tenantadmin/patients/details";
import style from "@/components/layout/ContentLayout/style.module.css";
import { Select } from "antd";
import { useCallback, useMemo } from "react";
import DosSelect, { DosTableRow } from "../dosSelect";
import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import { connect, ConnectedProps } from "react-redux";
import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";
import YearStatusAction from "../yearStatus";
import DosStatusAction from "../dosStatusAction";

type SubHeaderReduxType = ConnectedProps<typeof connector>;

type SubHeaderPropsType = patientSubHeaderType & SubHeaderReduxType;
function SubHeader({
  yearOptions,
  ChartTabList,
  activeTab,
  onHandleChartChange,
  onHandleTabChange,
  activeChartTab,
  selectedPatientYear,
  dosList,
  setSelectedYear,
  onHandleChangeDos,
  getPatientDosCall,
  getPatientDiseaseDetails,
  getPatientDetails,
}: SubHeaderPropsType) {
  const getDosOptions = useMemo(() => {
    return dosList?.map((dos) => ({
      providerName: dos?.providerName,
      dos: dos?.dateOfService,
      page: dos?.fileDetailDTO?.dosSummaries?.find(
        (page) => page?.dos === dos?.dateOfService,
      ),
      workflow: dos?.workflow,
      stateIndicators: dos?.stateIndicators,
      masterAudit: dos?.masterAudit,
    }));
  }, [dosList]);

  const buttonsData = useMemo(
    () => [
      {
        value: 1,
        label: "File",
      },
      {
        value: 2,
        label: "Combination Codes",
      },
      { value: 3, label: "Meat Criteria" },
    ],
    [],
  );

  const handleChange = useCallback(
    ({ year }: { year: number }) => {
      setSelectedYear(year);
    },
    [setSelectedYear],
  );

  return (
    <div className={`${style?.contentLayout} px-5 py-2`}>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Select
            options={ChartTabList}
            className="w-25"
            value={activeChartTab}
            onChange={(e) => onHandleChartChange({ e })}
          />

          <div className="flex gap-4 contentTab text-xs font-semibold items-center">
            {buttonsData?.map((item, index) => (
              <div
                key={index}
                onClick={() => onHandleTabChange({ item: item?.value })}
                className={
                  activeTab == item?.value
                    ? "activeContentTab cursor-pointer"
                    : "cursor-pointer"
                }
              >
                {item?.label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <div>
            <DosSelect
              options={getDosOptions}
              onHandleChangeDos={onHandleChangeDos}
            />
          </div>

          <div>
            <DosStatusAction
              getPatientDosCall={getPatientDosCall}
              getPatientDiseaseDetails={getPatientDiseaseDetails}
            />
          </div>
          <div>
            <Select
              options={yearOptions}
              className="w-25"
              value={selectedPatientYear}
              onChange={(e) => handleChange({ year: e })}
              placeholder="Select Year"
            />
          </div>

          <div>
            <YearStatusAction getPatientDetails={getPatientDetails} />
          </div>
        </div>
      </div>
    </div>
  );
}

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    dosList: state?.patientDetailsReducer?.patientDosDetails?.data?.response,
  }),
  {
    setSelectedYear: patientDetailsAction?.setPatientOverallYear,
  },
);

export default connector(SubHeader);
