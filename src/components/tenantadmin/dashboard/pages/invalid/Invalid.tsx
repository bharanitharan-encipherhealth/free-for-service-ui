"use client"
import React, { useEffect, useState } from "react";
import { Card, Modal } from "antd";
import { connect, ConnectedProps } from "react-redux";
import AppChart from "../../component/appchart";
import {
  formatValues,
  getColorValue,
  getLast7Days,
  getLast30Days,
} from "@/util/reusableFunction";
import {
  useHasMounted,
  useWindowWidth,
  getColSpan,
  getRowSpan,
} from "../../component/function";
import EmptyComponent from "../../component/empty/EmptyComponent";
import dashboardActions from "@/state/tenantadmin/dashboard/actions";
import CardSkeleton from "@/components/skeleton/card";
import { RootState, Widget } from "../../types";

const dosnew = "/images/invalid/calender1.webp";
const teleVisitNew = "/images/invalid/televisitnew.webp";
const invalidNew = "/images/invalid/invalidnew.webp";
const dos1 = "/images/invalid/calenderDos1.webp";
const multipleNew = "/images/invalid/multiplenew.webp";
const scopeNew = "/images/invalid/scopenew.webp";
const mrnNew = "/images/invalid/mrnnew.webp";
const illegalNew = "/images/invalid/illelegalnew.webp";
const imProper = "/images/invalid/improper.webp";

const mapState = (state: RootState) => ({
  dashboardState: state.dashboardReducer,
  getSelectedWidgets: state.dashboardReducer.getWidgetsList?.data?.response as Widget[] | undefined,
  getSelectedWidgetsLoader: state.dashboardReducer.getWidgetsListLoader,
});

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface InvalidPageProps extends PropsFromRedux {
  dateRange: { startDate: string; endDate: string };
  selectedOrganization: string;
  selectedRole: string;
  pagesLoader?: boolean;
  selectedValue?: string;
  customDate?: any;
  dispatch: any;
}

const Invalid: React.FC<InvalidPageProps> = ({
  getSelectedWidgets = [],
  getSelectedWidgetsLoader,
  dispatch,
  dashboardState,
  dateRange,
  selectedOrganization,
  selectedValue,
  customDate,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalChartData, setModalChartData] = useState<any>(null);

  const showModalChart = (chartData: any) => {
    setModalChartData(chartData);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setTimeout(() => setModalChartData(null), 300);
  };

  const dosCount = dashboardState.getInvalidDosCount?.data?.response;
  const document = dashboardState.getInvalidDocument?.data?.response;
  const televist = dashboardState.getInvalidTelevist?.data?.response;
  const credentials = dashboardState.getInvalidCredentails?.data?.response;
  const dobMismatch = dashboardState.getInvalidPatientDOBMismatch?.data?.response;
  const nameMismatch = dashboardState.getInvalidPatientNameMismatch?.data?.response;
  const scopeMismatch = dashboardState.getInvalidScopeYearMisMatch?.data?.response;
  const deceased = dashboardState.getInvalidPatientDeceased?.data?.response;
  const mrnId = dashboardState.getInvalidMrnIdMismatch?.data?.response;
  const multiplePatient = dashboardState.getInvalidMultiplePatientFound?.data?.response;
  const inactive = dashboardState.getInvalidPatientInActive?.data?.response;
  const providerMissed = dashboardState.getInvalidProviderMissed?.data?.response;
  const providerSignMissed = dashboardState.getInvalidProviderSignMissed?.data?.response;
  const noHccFound = dashboardState.getInvalidNoHccFound?.data?.response;

  const dates =
    selectedValue === "custom"
      ? customDate
      : selectedValue === "last_1_month"
        ? getLast30Days()
        : getLast7Days();

  const showDashboard = getSelectedWidgets
    ?.filter((item: any) => item?.active !== false)
    ?.sort((a: any, b: any) => Number(a?.orderValue) - Number(b?.orderValue)) || [];

  const formatDate = (Dates: any) => {
    if (!Dates) return [];
    return Object.keys(Dates).map((item) => {
      const date = new Date(item);
      return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
    });
  };

  const chartCofigs = [
    { type: "DOSCount", header: "DOS Count", image: dosnew, background: "#A8ADFF", count: dosCount?.currentFilterCOunt || 0, overAll: dosCount?.totalCount || 0, data: formatValues(dosCount?.invalidDosCountMapByDate, dates), categories: formatDate(dosCount?.invalidDosCountMapByDate || {}), color: getColorValue("7") },
    { type: "InvalidDocument", header: "Invalid Document", image: imProper, background: "#FFDCDC", count: document?.currentFilterCOunt || 0, overAll: document?.totalCount || 0, data: formatValues(document?.invalidDosCountMapByDate, dates), categories: formatDate(document?.invalidDosCountMapByDate || {}), color: getColorValue("5") },
    { type: "Televisit", header: "Audio Visit Count", image: teleVisitNew, background: "#CDE0FE", count: televist?.currentFilterCOunt || 0, overAll: televist?.totalCount || 0, data: formatValues(televist?.invalidDosCountMapByDate, dates), categories: formatDate(televist?.invalidDosCountMapByDate || {}), color: getColorValue("4") },
    { type: "ProviderUnauthorized", header: "Provider Unauthorized", image: invalidNew, background: "#D3F2F8", count: credentials?.currentFilterCOunt || 0, overAll: credentials?.totalCount || 0, data: formatValues(credentials?.invalidDosCountMapByDate, dates), categories: formatDate(credentials?.invalidDosCountMapByDate || {}), color: getColorValue("3") },
    { type: "PatientDOBMismatch", header: "Patient DOB Mismatch", image: dos1, background: "#D2CCFF", count: dobMismatch?.currentFilterCOunt || 0, overAll: dobMismatch?.totalCount || 0, data: formatValues(dobMismatch?.invalidDosCountMapByDate, dates), categories: formatDate(dobMismatch?.invalidDosCountMapByDate || {}), color: getColorValue("7") },
    { type: "PatientNameMismatch", header: "Patient Name Mismatch", image: multipleNew, background: "#CDE0FE", count: nameMismatch?.currentFilterCOunt || 0, overAll: nameMismatch?.totalCount || 0, data: formatValues(nameMismatch?.invalidDosCountMapByDate, dates), categories: formatDate(nameMismatch?.invalidDosCountMapByDate || {}), color: getColorValue("4") },
    { type: "ScopeYearMis-match", header: "Scope Year Mis-match", image: scopeNew, background: "#D1DAFA", count: scopeMismatch?.currentFilterCOunt || 0, overAll: scopeMismatch?.totalCount || 0, data: formatValues(scopeMismatch?.invalidDosCountMapByDate, dates), categories: formatDate(scopeMismatch?.invalidDosCountMapByDate || {}), color: getColorValue("1") },
    { type: "PatientDeceased", header: "Patient Deceased", image: multipleNew, background: "#CDE0FE", count: deceased?.currentFilterCOunt || 0, overAll: deceased?.totalCount || 0, data: formatValues(deceased?.invalidDosCountMapByDate, dates), categories: formatDate(deceased?.invalidDosCountMapByDate || {}), color: getColorValue("4") },
    { type: "MRNIDMismatch", header: "MRN ID Mismatch", image: mrnNew, background: "#D2CCFF", count: mrnId?.currentFilterCOunt || 0, overAll: mrnId?.totalCount || 0, data: formatValues(mrnId?.invalidDosCountMapByDate, dates), categories: formatDate(mrnId?.invalidDosCountMapByDate || {}), color: getColorValue("7") },
    { type: "MultiplePatientFound", header: "Multiple Patient Found", image: multipleNew, background: "#CDE0FE", count: multiplePatient?.currentFilterCOunt || 0, overAll: multiplePatient?.totalCount || 0, data: formatValues(multiplePatient?.invalidDosCountMapByDate, dates), categories: formatDate(multiplePatient?.invalidDosCountMapByDate || {}), color: getColorValue("4") },
    { type: "PatientIn-active", header: "Patient In-active", image: illegalNew, background: "#D3F2F8", count: inactive?.currentFilterCOunt || 0, overAll: inactive?.totalCount || 0, data: formatValues(inactive?.invalidDosCountMapByDate, dates), categories: formatDate(inactive?.invalidDosCountMapByDate || {}), color: getColorValue("3") },
    { type: "ProviderMissed", header: "Provider Missed", image: mrnNew, background: "#D2CCFF", count: providerMissed?.currentFilterCOunt || 0, overAll: providerMissed?.totalCount || 0, data: formatValues(providerMissed?.invalidDosCountMapByDate, dates), categories: formatDate(providerMissed?.invalidDosCountMapByDate || {}), color: getColorValue("7") },
    { type: "ProviderSignMissed", header: "Provider Sign Missed", image: mrnNew, background: "#D2CCFF", count: providerSignMissed?.currentFilterCOunt || 0, overAll: providerSignMissed?.totalCount || 0, data: formatValues(providerSignMissed?.invalidDosCountMapByDate, dates), categories: formatDate(providerSignMissed?.invalidDosCountMapByDate || {}), color: getColorValue("7") },
    { type: "NoHccFound", header: "No HCC Found", image: illegalNew, background: "#D3F2F8", count: noHccFound?.currentFilterCOunt || 0, overAll: noHccFound?.totalCount || 0, data: formatValues(noHccFound?.invalidDosCountMapByDate, dates), categories: formatDate(noHccFound?.invalidDosCountMapByDate || {}), color: getColorValue("3") },
    { type: "OutOfScope", header: "Out Of Scope", image: scopeNew, background: "#D1DAFA", count: scopeMismatch?.currentFilterCOunt || 0, overAll: scopeMismatch?.totalCount || 0, data: formatValues(scopeMismatch?.invalidDosCountMapByDate, dates), categories: formatDate(scopeMismatch?.invalidDosCountMapByDate || {}), color: getColorValue("1") },
  ];

  const apiConfigs = [
    { key: "getInvalidDosCount", flag: "UNAPPROVED_DOC", ids: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c011"] },
    { key: "getInvalidDocument", flag: "IN_VALID_DOC", ids: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c012"] },
    { key: "getInvalidTelevist", flag: "AUDIO_VISIT", ids: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c013"] },
    { key: "getInvalidCredentails", flag: "PROVIDER_UNAUTHORIZED", ids: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c048"] },
    { key: "getInvalidPatientDOBMismatch", flag: "PATIENT_DOB_MISMATCH", ids: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c015"] },
    { key: "getInvalidPatientNameMismatch", flag: "PATIENT_NAME_MISMATCH", ids: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c016"] },
    { key: "getInvalidMultiplePatientFound", flag: "MULTIPLE_PATIENT_FOUND", ids: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c020"] },
    { key: "getInvalidProviderMissed", flag: "PROVIDER_MISSED", ids: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c044"] },
    { key: "getInvalidProviderSignMissed", flag: "PROVIDER_CREDENTIAL_MISSED", ids: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c045"] },
    { key: "getInvalidScopeYearMisMatch", flag: "SCOPE_YEAR_MISMATCH", ids: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c046"] },
    { key: "getInvalidNoHccFound", flag: "NO_HCC_FOUND", ids: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c047"] },
  ];

  const getApiCall = async () => {
    try {
      apiConfigs.forEach(conf => {
        if (conf.ids.some(id => showDashboard.some((w: any) => w.widgetId === id))) {
          const actionKey = `${conf.key}Action`;
          const action = (dashboardActions as any)[actionKey];
          if (typeof action === "function") {
            dispatch(action({
              flagNameList: conf.flag,
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
              organizationId: selectedOrganization || "",
            }));
          }
        }
      });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    getApiCall();
  }, [dateRange, getSelectedWidgets]);

  const windowWidth = useWindowWidth();
  const hasMounted = useHasMounted();
  if (!hasMounted) return null;

  const getChartsRenderer = ({ type, chartType }: { type: string, chartType: any }) => {
    const chart = chartCofigs.find((item) => item.type === type);
    if (!chart) return null;

    return (
      <AppChart
        xAxisInterval={1}
        type={chartType}
        categories={dates}
        series={[{ name: chart.header, data: chart.data, color: chart.color }]}
        customHeader={{
          label: "Current / Overall",
          value: `${chart.count} / ${chart.overAll}`,
          images: chart.image,
          background: chart.background,
          header: chart.header,
          onClick: () => showModalChart({ ...chart, chartType }),
          showMaximize: true,
        }}
      />
    );
  };

  return (
    <>
      {getSelectedWidgetsLoader ? (
        <div className="grid grid-cols-3 gap-4 w-full px-4"><CardSkeleton count={9} height={300} /></div>
      ) : showDashboard?.length ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }} className="w-full px-4">
          {showDashboard?.map((item: any, id: number) => (
            <div key={id} style={{ gridColumn: `span ${getColSpan(item.size, windowWidth)}`, gridRow: `span ${getRowSpan(item.size)}`, height: "100%" }}>
              <Card className="h-full">
                {getChartsRenderer({ type: item.widgetName, chartType: item?.selectedChart })}
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <EmptyComponent />
      )}
      <Modal open={showModal} onCancel={handleModalClose} footer={null} className="customReactModal" width={1000} centered>
        {modalChartData && (
          <AppChart
            type={modalChartData.chartType || "line"}
            categories={dates}
            series={[{ name: modalChartData.header, data: modalChartData.data, color: modalChartData.color }]}
            customHeader={{ label: "Current / Overall", value: `${modalChartData.count} / ${modalChartData.overAll}`, images: modalChartData.image, header: modalChartData.header, showMaximize: false }}
          />
        )}
      </Modal>
    </>
  );
};

export default connector(Invalid);
