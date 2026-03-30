import React, { useEffect, useState } from "react";
import { Card, Modal } from "antd";
import AppChart from "../../component/appchart";
import {
  formatValues,
  getLast30Days,
  getLast7Days,
  getColorValue,
} from "../../../../../util/reusableFunction";
import {
  InvalidWidget,
  useHasMounted,
  useWindowWidth,
  getColSpan,
  getRowSpan,
} from "../../component/function";
import teleVisit from "@/images/invalid/televisit.webp";
import scope from "@/images/invalid/scope.webp";
import inValid from "@/images/invalid/invalid.webp";
import imProper from "@/images/invalid/improper.webp";
import multiple from "@/images/invalid/multiple.webp";
import mrn from "@/images/invalid/mrn.webp";
import illegal from "@/images/invalid/illelegal.webp";
import dos from "@/images/invalid/calender.svg";
import dosnew from "@/images/invalid/calender1.webp";
import teleVisitNew from "@/images/invalid/televisitnew.webp";
import invalidNew from "@/images/invalid/invalidnew.webp";
import dos1 from "@/images/invalid/calenderDos1.webp";
import multipleNew from "@/images/invalid/multiplenew.webp";
import scopeNew from "@/images/invalid/scopenew.webp";
import mrnNew from "@/images/invalid/mrnnew.webp";
import illegalNew from "@/images/invalid/illelegalnew.webp";
import { getStorage } from "../../../../../util/storage";
import EmptyComponent from "../../component/empty/EmptyComponent";
import actions from "../../../../../state/admin/dashboard/actions";
import { connect } from "react-redux";
import { getDashboardItems } from "../../component/function/resubaleGetStorage";
import CardSkeleton from "@/components/skeleton/card";
interface InvalidProps {
  selectedRole: string;
  pagesLoader: boolean;
  windowWidth: number | null;
  dispatch: any;
  getSelectedWidgets: any[];
  getSelectedWidgetsLoader: boolean;
  data: any;
  dateRange: any;
  selectedOrganization: any;
  selectedValue: string;
  customDate: string[];
}

function Invalid({
  getSelectedWidgets = [],
  getSelectedWidgetsLoader,
  dispatch,
  data,
  dateRange,
  selectedOrganization,
  selectedRole,
  pagesLoader,
  selectedValue,
  customDate,
}: InvalidProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalChartData, setModalChartData] = useState<any>(null);
  const showModalChart = (data: any) => {
    setModalChartData(data);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);

    setTimeout(() => {
      setModalChartData(null);
    }, 300);
  };
  const {
    getInvalidDosCount: dosCountRes,
    getInvalidDocument: documentRes,
    getInvalidTelevist: televistRes,
    getInvalidCredentails: credentialsRes,
    getInvalidPatientDOBMismatch: dobMismatchRes,
    getInvalidPatientNameMismatch: nameMismatchRes,
    getInvalidScopeYearMisMatch: scopeMismatchRes,
    getInvalidPatientDeceased: deceasedRes,
    getInvalidMrnIdMismatch: mrnRes,
    getInvalidMultiplePatientFound: multipleRes,
    getInvalidPatientInActive: inactiveRes,
    getInvalidProviderMissed: providerMissedRes,
    getInvalidProviderSignMissed: providerSignMissedRes,
    getInvalidNoHccFound: noHccFoundRes,
    getInvalidDosCountLoader,
    getInvalidDocumentLoader,
    getInvalidTelevistLoader,
    getInvalidCredentailsLoader,
    getInvalidPatientDOBMismatchLoader,
    getInvalidPatientNameMismatchLoader,
    getInvalidScopeYearMisMatchLoader,
    getInvalidPatientDeceasedLoader,
    getInvalidMrnIdMismatchLoader,
    getInvalidMultiplePatientFoundLoader,
    getInvalidPatientInActiveLoader,
    getInvalidProviderMissedLoader,
    getInvalidProviderSignMissedLoader,
    getInvalidNoHccFoundLoader,
  } = data || {};

  const dosCount = dosCountRes?.data?.response;
  const document = documentRes?.data?.response;
  const televist = televistRes?.data?.response;
  const credentials = credentialsRes?.data?.response;
  const dobMismatch = dobMismatchRes?.data?.response;
  const nameMismatch = nameMismatchRes?.data?.response;
  const scopeMismatch = scopeMismatchRes?.data?.response;
  const deceased = deceasedRes?.data?.response;
  const mrnId = mrnRes?.data?.response;
  const multiplePatient = multipleRes?.data?.response;
  const inactive = inactiveRes?.data?.response;
  const providerMissed = providerMissedRes?.data?.response;
  const providerSignMissed = providerSignMissedRes?.data?.response;
  const noHccFound = noHccFoundRes?.data?.response;

  const dates =
    selectedValue === "custom"
      ? customDate
      : selectedValue === "last_1_month"
        ? getLast30Days()
        : getLast7Days();

  const showDashboard = getSelectedWidgets
    .filter((item) => item?.active)
    .sort((a, b) => a?.orderValue - b?.orderValue);

  const formatDate = (Dates: any) => {
    const formatted = Object?.keys(Dates).map((item) => {
      const date = new Date(item);
      return date?.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
    });
    return formatted;
  };
  const constructData = (Dates: any) => {
    const formatted = Object?.values(Dates).map((item) => {
      return item;
    });
    return formatted;
  };

  const chartCofigs = [
    {
      type: "DOSCount",
      header: "DOS Count",
      image: dosnew,
      background: "#A8ADFF",
      count: dosCount?.currentFilterCOunt || 0,
      overAll: dosCount?.totalCount || 0,
      data: formatValues(dosCount?.invalidDosCountMapByDate, dates),
      categories: formatDate(dosCount?.invalidDosCountMapByDate || {}),
      loading: getInvalidDosCountLoader,
      color: getColorValue("7"),
    },
    {
      type: "InvalidDocument",
      header: "Invalid Document",
      image: imProper,
      background: "#FFDCDC",
      count: document?.currentFilterCOunt || 0,
      overAll: document?.totalCount || 0,
      data: formatValues(document?.invalidDosCountMapByDate, dates),
      categories: formatDate(document?.invalidDosCountMapByDate || {}),
      loading: getInvalidDocumentLoader,
      color: getColorValue("5"),
    },
    {
      type: "Televisit",
      header: "Audio Visit Count",
      image: teleVisitNew,
      background: "#CDE0FE",
      count: televist?.currentFilterCOunt || 0,
      overAll: televist?.totalCount || 0,
      data: formatValues(televist?.invalidDosCountMapByDate, dates),
      categories: formatDate(televist?.invalidDosCountMapByDate || {}),
      loading: getInvalidTelevistLoader,
      color: getColorValue("4"),
    },
    {
      type: "ProviderUnauthorized",
      header: "Provider Unauthorized",
      image: invalidNew,
      background: "#D3F2F8",
      count: credentials?.currentFilterCOunt || 0,
      overAll: credentials?.totalCount || 0,
      data: formatValues(credentials?.invalidDosCountMapByDate, dates),
      categories: formatDate(credentials?.invalidDosCountMapByDate || {}),
      loading: getInvalidCredentailsLoader,
      color: getColorValue("3"),
    },
    {
      type: "PatientDOBMismatch",
      header: "Patient DOB Mismatch",
      image: dos1,
      background: "#D2CCFF",
      count: dobMismatch?.currentFilterCOunt || 0,
      overAll: dobMismatch?.totalCount || 0,
      data: formatValues(dobMismatch?.invalidDosCountMapByDate, dates),
      categories: formatDate(dobMismatch?.invalidDosCountMapByDate || {}),
      loading: getInvalidPatientDOBMismatchLoader,
      color: getColorValue("7"),
    },
    {
      type: "PatientNameMismatch",
      header: "Patient Name Mismatch",
      image: multipleNew,
      background: "#CDE0FE",
      count: nameMismatch?.currentFilterCOunt || 0,
      overAll: nameMismatch?.totalCount || 0,
      data: formatValues(nameMismatch?.invalidDosCountMapByDate, dates),
      categories: formatDate(nameMismatch?.invalidDosCountMapByDate || {}),
      loading: getInvalidPatientNameMismatchLoader,
      color: getColorValue("4"),
    },
    {
      type: "ScopeYearMis-match",
      header: "Scope Year Mis-match",
      image: scopeNew,
      background: "#D1DAFA",
      count: scopeMismatch?.currentFilterCOunt || 0,
      overAll: scopeMismatch?.totalCount || 0,
      data: formatValues(scopeMismatch?.invalidDosCountMapByDate, dates),
      categories: formatDate(scopeMismatch?.invalidDosCountMapByDate || {}),
      loading: getInvalidScopeYearMisMatchLoader,
      color: getColorValue("1"),
    },
    {
      type: "PatientDeceased",
      header: "Patient Deceased",
      image: multipleNew,
      background: "#CDE0FE",
      count: deceased?.currentFilterCOunt || 0,
      overAll: deceased?.totalCount || 0,
      data: formatValues(deceased?.invalidDosCountMapByDate, dates),
      categories: formatDate(deceased?.invalidDosCountMapByDate || {}),
      loading: getInvalidPatientDeceasedLoader,
      color: getColorValue("4"),
    },
    {
      type: "MRNIDMismatch",
      header: "MRN ID Mismatch",
      image: mrnNew,
      background: "#D2CCFF",
      count: mrnId?.currentFilterCOunt || 0,
      overAll: mrnId?.totalCount || 0,
      data: formatValues(mrnId?.invalidDosCountMapByDate, dates),
      categories: formatDate(mrnId?.invalidDosCountMapByDate || {}),
      loading: getInvalidMrnIdMismatchLoader,
      color: getColorValue("7"),
    },
    {
      type: "MultiplePatientFound",
      header: "Multiple Patient Found",
      image: multipleNew,
      background: "#CDE0FE",
      count: multiplePatient?.currentFilterCOunt || 0,
      overAll: multiplePatient?.totalCount || 0,
      data: formatValues(multiplePatient?.invalidDosCountMapByDate, dates),
      categories: formatDate(multiplePatient?.invalidDosCountMapByDate || {}),
      loading: getInvalidMultiplePatientFoundLoader,
      color: getColorValue("4"),
    },
    {
      type: "PatientIn-active",
      header: "Patient In-active",
      image: illegalNew,
      background: "#D3F2F8",
      count: inactive?.currentFilterCOunt || 0,
      overAll: inactive?.totalCount || 0,
      data: formatValues(inactive?.invalidDosCountMapByDate, dates),
      categories: formatDate(inactive?.invalidDosCountMapByDate || {}),
      loading: getInvalidPatientInActiveLoader,
      color: getColorValue("3"),
    },
    {
      type: "ProviderMissed",
      header: "Provider Missed",
      image: mrnNew,
      background: "#D2CCFF",
      count: providerMissed?.currentFilterCOunt || 0,
      overAll: providerMissed?.totalCount || 0,
      data: formatValues(providerMissed?.invalidDosCountMapByDate, dates),
      categories: formatDate(providerMissed?.invalidDosCountMapByDate || {}),
      loading: getInvalidProviderMissedLoader,
      color: getColorValue("7"),
    },
    {
      type: "ProviderSignMissed",
      header: "Provider Sign Missed",
      image: mrnNew,
      background: "#D2CCFF",
      count: providerSignMissed?.currentFilterCOunt || 0,
      overAll: providerSignMissed?.totalCount || 0,
      data: formatValues(providerSignMissed?.invalidDosCountMapByDate, dates),
      categories: formatDate(
        providerSignMissed?.invalidDosCountMapByDate || {},
      ),
      loading: getInvalidProviderSignMissedLoader,
      color: getColorValue("7"),
    },
    {
      type: "NoHccFound",
      header: "No HCC Found",
      image: illegalNew,
      background: "#D3F2F8",
      count: noHccFound?.currentFilterCOunt || 0,
      overAll: noHccFound?.totalCount || 0,
      data: formatValues(noHccFound?.invalidDosCountMapByDate, dates),
      categories: formatDate(noHccFound?.invalidDosCountMapByDate || {}),
      loading: getInvalidNoHccFoundLoader,
      color: getColorValue("3"),
    },
    {
      type: "OutOfScope",
      header: "Out Of Scope",
      image: scopeNew,
      background: "#D1DAFA",
      count: scopeMismatch?.currentFilterCOunt || 0,
      overAll: scopeMismatch?.totalCount || 0,
      data: formatValues(scopeMismatch?.invalidDosCountMapByDate, dates),
      categories: formatDate(scopeMismatch?.invalidDosCountMapByDate || {}),
      loading: getInvalidScopeYearMisMatchLoader,
      color: getColorValue("1"),
    },
  ];

  const api = [
    {
      flagName: "UNAPPROVED_DOC",
      label: "dosCount",
      id: 1,
      key: "getInvalidDosCount",
      parmas: {},
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c011"],
    },
    {
      flagName: "IN_VALID_DOC",
      label: "invaliddocument",
      id: 2,
      key: "getInvalidDocument",
      parmas: {},
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c012"],
    },
    {
      flagName: "AUDIO_VISIT",
      label: "televisit",
      id: 3,
      key: "getInvalidTelevist",
      params: {},
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c013"],
    },
    {
      flagName: "PROVIDER_UNAUTHORIZED",
      label: "invalidCredentials",
      id: 9,
      key: "getInvalidCredentails",
      parmas: {},
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c048"],
    },
    {
      flagName: "PATIENT_DOB_MISMATCH",
      label: "patientDobMismatch",
      id: 4,
      key: "getInvalidPatientDOBMismatch",
      parmas: {},
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c015"],
    },
    {
      flagName: "PATIENT_NAME_MISMATCH",
      label: "patientNameMismatch",
      id: 5,
      key: "getInvalidPatientNameMismatch",
      params: {},
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c016"],
    },
    {
      flagName: "MULTIPLE_PATIENT_FOUND",
      label: "multiplePatientFound",
      id: 6,
      key: "getInvalidMultiplePatientFound",
      parmas: {},
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c020"],
    },
    {
      flagName: "PROVIDER_MISSED",
      label: "providerMissed",
      id: 7,
      key: "getInvalidProviderMissed",
      parmas: {},
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c044"],
    },
    {
      flagName: "PROVIDER_CREDENTIAL_MISSED",
      label: "providerSignMissed",
      id: 8,
      key: "getInvalidProviderSignMissed",
      parmas: {},
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c045"],
    },
    {
      flagName: "SCOPE_YEAR_MISMATCH",
      label: "outOfScope",
      id: 10,
      key: "getInvalidScopeYearMisMatch",
      parmas: {},
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c046"],
    },
    {
      flagName: "NO_HCC_FOUND",
      label: "noHccFound",
      id: 11,
      key: "getInvalidNoHccFound",
      parmas: {},
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c047"],
    },
    // {
    //   flagName: "PATIENT_DECEASED",
    //   label: "patientdeceasded",
    //   id: 8,
    //   key: "getInvalidPatientDeceased",
    //   parmas: {},
    //   widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c018"],
    // },
    // {
    //   flagName: "MRN_ID_MISMATCH",
    //   label: "mrnIdMismatch",
    //   id: 9,
    //   key: "getInvalidMrnIdMismatch",
    //   params: {},
    //   widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c019"],
    // },
    // {
    //   flagName: "PATIENT_INACTIVE",
    //   label: "patientInactive",
    //   id: 11,
    //   key: "getInvalidPatientInActive",
    //   parmas: {},
    //   widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c021"],
    // },
  ];

  const apiKeys = api.filter((item) =>
    item.widgetId?.some((id) =>
      showDashboard.some((widget) => widget.widgetId === id),
    ),
  );
  const getApiCall = async () => {
    try {
      for (const item of apiKeys) {
        const actionKey = `${item.key}Action`;

        if (typeof actions[actionKey] === "function") {
          dispatch(
            actions[actionKey]({
              flagNameList: item.flagName,
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
              organizationId: selectedOrganization || "",
            }),
          );
        } else {
          console.warn(`Action not found for key: ${actionKey}`);
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const getCharts = ({ type, chartType, pagesLoader }: { type: string, chartType: string, pagesLoader: boolean }) => {
    const chart = chartCofigs.find((item) => item.type === type);
    if (!chart) return null;

    return chart.loading || pagesLoader ? (
      <CardSkeleton count={1} height={300} />
    ) : (
      <AppChart
        xAxisInterval={1}
        type={chartType}
        categories={
          selectedValue === "custom"
            ? customDate
            : selectedValue === "last_1_month"
              ? getLast30Days()
              : getLast7Days()
        }
        series={[
          {
            name: chart.header,
            data: chart.data,
            color: chart.color,
            area: chartType === "area",
          },
        ]}
        customHeader={{
          label: "Current / Overall",
          value: `${chart.count} / ${chart.overAll}`,
          images: chart.image,
          background: chart.background,
          header: chart.header,
          setIsModalOpen: setModalChartData,
          onClick: () => showModalChart({ ...chart, chartType }),
          showMaximize: true,
          values: chart,
        }}
      />
    );
  };
  useEffect(() => {
    getApiCall();
  }, [dateRange, getSelectedWidgets]);

  const windowWidth = useWindowWidth();
  const hasMounted = useHasMounted();
  if (!hasMounted) return null;

  return (
    <>
      {getSelectedWidgetsLoader ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            padding: 20,
          }}
          className="container-fluid"
        >
          <CardSkeleton count={9} height={300} />
        </div>
      ) : showDashboard?.length ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 16,
            height: "100%",
          }}
          className="container-fluid"
        >
          {showDashboard?.map((item, id) => {
            const style = {
              gridColumn: `span ${getColSpan(item.size, windowWidth)}`,
              gridRow: `span ${getRowSpan(item.size)}`,
              height: "100%",
            };

            return (
              <div key={id} style={style}>
                <Card>
                  {getCharts({
                    type: item.widgetName,
                    chartType: item?.selectedChart,
                    pagesLoader: getSelectedWidgetsLoader,
                  })}
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyComponent />
      )}
      <Modal
        open={showModal}
        onCancel={handleModalClose}
        footer={null}
        width={800}
        centered
        title={modalChartData?.header || "Chart"}
      >
        {modalChartData && (
          <AppChart
            type={modalChartData.chartType || "line"}
            categories={dates}
            series={[
              {
                name: modalChartData.header,
                data: modalChartData.data,
                color: modalChartData.color,
                area: modalChartData.chartType === "area" ? true : false,
              },
            ]}
            customHeader={{
              label: "Current / Overall",
              value: `${modalChartData.count} / ${modalChartData.overAll}`,
              images: modalChartData.image,
              ...modalChartData,
              showMaximize: false,
            }}
          />
        )}
      </Modal>
    </>
  );
}
const enhancer = connect((state: any) => ({
  data: state.admin.dashboard1,
  getSelectedWidgets: state.admin.dashboard1.getWidgetsList?.data?.response,
  getSelectedWidgetsLoader: state.admin.dashboard1.getWidgetsListLoader,
}))(Invalid);
export default enhancer;
