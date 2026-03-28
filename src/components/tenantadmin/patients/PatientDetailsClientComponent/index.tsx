"use client";
import { getStorage, setStorage } from "@/util/storage";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";
import PatientDetailsHeader from "./components/patientDetailsHeader";
import SubHeader from "./components/subHeader";
import {
  findFirstPendingWorkflow,
  getPatientTabList,
} from "./components/reusableFunction";
import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import PdfViewer from "./components/pdfViewer";
import { DosSummary } from "@/models/tenantadmin/patients/details";
import DiagnosisDetails from "./components/diagnosisDetails";
import { DosTableRow } from "./components/dosSelect";
import AddEditDiseaseModal from "./components/addEditDiseaseModal";
import ConfirmModal from "./components/confirmModal";
import { checkStatusDisable } from "./components/function/reusableFunction";

type PatientDetailsReduxType = ConnectedProps<typeof connector>;

function PatientDetailsClientComponent({
  getPatientOverallDetails,
  patientOverallDetails,
  setAdmissionNumber,
  getPatientOverallYear,
  admissionNumber,
  setSelectedYear,
  selectedPatientYear,
  getPatientDosDetails,
  setSelectDos,
  getPatientDiseaseDetials,
  getSelectedDosPageNumber,
  setPdfSearch,
  getFileIdCheck,
  setPreviousFileId,
  getPdfFileId,
  patientYearDetails,
  setPageLoading,
  setPdfView,
  pdfView,
  addMoadlOpen,
  setDisable,
  patientDiseaseDetails,
}: PatientDetailsReduxType) {
  const router = useRouter();
  const pathName = usePathname();
  const patientId = getStorage("patientId");

  const [patientYearOptions, setPatientYearOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [tabList, setTabList] = useState<
    | {
        value: string;
        type: string;
        label: string;
      }[]
    | []
  >([]);
  const [activeChartTab, setActiveChartTab] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number>(0);
  const [collapse, setCollapse] = useState<string[]>([
    "hccLayout",
    "deletedLayout",
  ]);

  if (!patientId) {
    const routerBackTo = getStorage("routeBackTo");
    router.push(routerBackTo || router.back);
  }

  const onHandleChartChange = useCallback(
    ({ e }: { e: string }) => {
      setActiveChartTab(e);
    },
    [setActiveChartTab],
  );

  const onHandleBack = useCallback(() => {
    setSelectDos("");
    setAdmissionNumber("");
    setSelectedYear("");
    getPatientOverallYear({ dataEmpty: true });
    const routerBackTo = getStorage("routeBackTo");
    router?.push(routerBackTo);
  }, [
    router,
    setSelectDos,
    setAdmissionNumber,
    setSelectedYear,
    getPatientOverallYear,
  ]);

  const onHandleTabChange = useCallback(
    ({ item }: { item: number }) => {
      setPdfView(false);
      if (item === 1) setPdfView(true);
      setActiveTab(item);
    },
    [setPdfView],
  );

  const onHandleChangeDos = useCallback(
    ({ record }: { record: DosTableRow }) => {
      setSelectDos(record?.dos);
      getPatientDiseaseDetails({ dos: record?.dos?.dos });
    },
    [setSelectDos],
  );

  const getPatientDetails = useCallback(
    async ({ patientId }: { patientId: string }) => {
      try {
        setPageLoading(true);
        await getPatientOverallDetails({
          navigate: pathName,
          patientId,
        });
      } catch (e) {
        setPageLoading(false);
        console.error(e, "While Calling The getPatientDetails");
      }
    },
    [getPatientOverallDetails, pathName, setAdmissionNumber, setPageLoading],
  );

  const getPatientYear = useCallback(async () => {
    try {
      const overallYear = await getPatientOverallYear({
        type: patientOverallDetails?.patientType,
        admNo: patientOverallDetails?.admNo,
      });
      if (overallYear?.status === "SUCCESS") {
        if (overallYear?.response?.length) {
          setSelectedYear(overallYear?.response?.[0] || "");
          const dosYear = overallYear?.response?.map((res: string) => {
            return { value: res, label: res };
          });
          setPatientYearOptions(dosYear);
        } else {
          setPageLoading(false);
        }
      }
    } catch (e) {
      setPageLoading(false);
      console.error(e, "While Calling the getPatientYear");
    }
  }, [getPatientOverallYear, patientOverallDetails, setSelectedYear]);

  const getPatientFileIdCheck = useCallback(async () => {
    try {
      const fileId = await getFileIdCheck({
        patientId,
        year: selectedPatientYear,
      });
      if (fileId?.status === "SUCCESS") {
        if (fileId?.response) {
          await getPdfFileId({ fileId: fileId?.response });
        }
      }
    } catch (e) {
      setPageLoading(false);
      console.error(e, "While calling the getPatientFileIdCheck");
    }
  }, [
    selectedPatientYear,
    patientId,
    getFileIdCheck,
    setPreviousFileId,
    getPdfFileId,
  ]);

  const getPatientDiseaseDetails = useCallback(
    async ({ dos }: { dos: string }) => {
      // console.log(admissionNumber, "admissionNumber");

      try {
        const diseaseDetails = await getPatientDiseaseDetials({
          patientId,
          dos,
          navigate: pathName,
          admissionNumber: admissionNumber,
        });
        if (diseaseDetails?.status === "SUCCESS") {
          const dosSummaries =
            diseaseDetails?.response?.fileDetailDTO?.dosSummaries;
          if (dosSummaries) {
            const filteredDos = dosSummaries?.find(
              (data: DosSummary) => data?.dos === dos,
            );
            getSelectedDosPageNumber(filteredDos?.startPageNumber);
            setPdfSearch({
              value: filteredDos?.substring,
              page: filteredDos?.startPageNumber,
            });
          }
        }
        checkStatusDisable({
          patientOverallDetails,
          patientDiseaseDetails: diseaseDetails?.response,
          pathName,
          setDisable,
        });
      } catch (e) {
        console.error(e, "Erro While Calling the patient Disease Call");
      } finally {
        setPageLoading(false);
      }

      setSelectDos(dos);
    },
    [
      setSelectDos,
      getPatientDiseaseDetials,
      pathName,
      admissionNumber,
      getSelectedDosPageNumber,
      setPdfSearch,
      patientId,
      setPageLoading,
      pathName,
      patientOverallDetails,
      patientDiseaseDetails,
      setDisable,
    ],
  );

  const getPatientDosCall = useCallback(async () => {
    try {
      const dosDetails = await getPatientDosDetails({
        year: selectedPatientYear,
        navigate: pathName,
        chartType: activeChartTab,
        admissionNumber: admissionNumber,
      });
      if (dosDetails?.status === "SUCCESS") {
        if (dosDetails?.response?.length > 0) {
          let dosPendingValue = dosDetails?.response[0]?.dateOfService;
          const pendingWorkflow = findFirstPendingWorkflow({
            responseArray: dosDetails?.response,
          });
          if (pendingWorkflow) {
            dosPendingValue = pendingWorkflow.dateOfService;
          }
          getPatientDiseaseDetails({ dos: dosPendingValue });
        } else {
          getPatientDiseaseDetails({ dos: "" });
        }
      }
    } catch (e) {
      setPageLoading(false);
      console.error(e, "Error occur in patient dos call");
    }
  }, [
    getPatientDosDetails,
    selectedPatientYear,
    pathName,
    activeChartTab,
    admissionNumber,
    getPatientDiseaseDetails,
  ]);

  useEffect(() => {
    const patientId = getStorage("patientId");
    getPatientDetails({ patientId });
  }, []);

  useEffect(() => {
    setAdmissionNumber({
      patientType: patientOverallDetails?.patientType,
      admNo: patientOverallDetails?.admNo,
      batchDate: patientOverallDetails?.batchDate,
    });
    setTabList(
      getPatientTabList({ patientType: patientOverallDetails?.patientType }),
    );
    setPdfView(true);
    setActiveTab(1);
    if (patientOverallDetails?.patientType?.toLowerCase() == "inpatient")
      setActiveChartTab("ADMISSION");
    if (patientOverallDetails?.patientType?.toLowerCase() == "outpatient")
      setActiveChartTab("ER");

    if (patientOverallDetails?.patientType) {
      getPatientYear();
    }
  }, [patientOverallDetails?.patientType, patientOverallDetails]);

  useEffect(() => {
    if (selectedPatientYear && activeChartTab && admissionNumber) {
      getPatientDosCall();
    }
  }, [selectedPatientYear, activeChartTab, patientYearDetails]);

  useEffect(() => {
    if (selectedPatientYear) getPatientFileIdCheck();
  }, [selectedPatientYear, patientYearDetails]);

  useEffect(() => {
    if (collapse?.length == 0) {
      setPdfView(true);
      return;
    }
    if (activeTab == 2) setPdfView(false);
  }, [collapse]);

  console.log(collapse.length, "collapse");

  return (
    <div>
      <PatientDetailsHeader
        onHandleBack={onHandleBack}
        getPatientDetails={getPatientDetails}
      />

      <SubHeader
        yearOptions={patientYearOptions}
        ChartTabList={tabList}
        activeChartTab={activeChartTab}
        onHandleChartChange={onHandleChartChange}
        onHandleTabChange={onHandleTabChange}
        activeTab={activeTab}
        selectedPatientYear={selectedPatientYear}
        onHandleChangeDos={onHandleChangeDos}
        getPatientDosCall={getPatientDosCall}
        getPatientDiseaseDetails={getPatientDiseaseDetails}
        getPatientDetails={getPatientDetails}
      />

      <div className="h-[69vh] xl:h-[75vh] 2xl:h-[79vh] 3xl:h-[81vh] 4xl:h-[82.5vh] overflow-hidden w-full">
        <div className="w-full flex h-full">
          {pdfView && (
            <div
              className={`content h-full ${pdfView && activeTab != 1 ? "w-2/5" : collapse?.length > 1 ? "w-1/2" : collapse?.length == 1 ? "w-3/5" : "w-5/6"}`}
            >
              <PdfViewer activeTab={activeTab} />
            </div>
          )}

          <div
            className={` h-full ${
              pdfView && activeTab != 1
                ? "w-3/5"
                : !pdfView
                  ? "w-full"
                  : collapse?.length > 1
                    ? "w-1/2"
                    : collapse?.length == 1
                      ? "w-2/5"
                      : "w-1/6"
            } overflow-scroll`}
          >
            {addMoadlOpen?.isAdd ||
            addMoadlOpen?.isEdit ||
            addMoadlOpen?.isMeatEdit ? (
              <div className="content h-full">
                <AddEditDiseaseModal
                  getPatientDiseaseDetails={getPatientDiseaseDetails}
                />
              </div>
            ) : (
              <DiagnosisDetails
                collapse={collapse}
                setCollapse={setCollapse}
                activeTab={activeTab}
              />
            )}
          </div>
        </div>
      </div>

      <ConfirmModal getPatientDiseaseDetails={getPatientDiseaseDetails} />
    </div>
  );
}

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    patientOverallDetails:
      state?.patientDetailsReducer?.patientOverallDetails?.data?.response,
    patientOverallDetailsLoading:
      state?.patientDetailsReducer?.patietOverallDetailsLoading,
    admissionNumber: state?.patientDetailsReducer?.setAdmissionNumber,
    selectedPatientYear: state?.patientDetailsReducer?.setPatientOverallYear,
    patientYearDetails: state?.patientDetailsReducer?.patientOverallYear,
    pdfView: state?.patientDetailsReducer?.setPdfView,
    addMoadlOpen: state?.patientDetailsReducer?.setAddModaOpen,
    patientDiseaseDetails:
      state?.patientDetailsReducer?.patientDiseaseDetails?.data?.response,
  }),
  {
    getPatientOverallDetails: patientDetailsAction?.patientOverallDetails,
    setAdmissionNumber: patientDetailsAction?.setAdmissionNumber,
    getPatientOverallYear: patientDetailsAction?.patientOverallYear,
    setSelectedYear: patientDetailsAction?.setPatientOverallYear,
    getPatientDosDetails: patientDetailsAction?.patientDosDetails,
    setSelectDos: patientDetailsAction?.setSelectDos,
    getPatientDiseaseDetials: patientDetailsAction?.patientDiseaseDetails,
    getSelectedDosPageNumber: patientDetailsAction?.getSelectedDosPageNumber,
    setPdfSearch: patientDetailsAction?.setPdfSearch,
    getFileIdCheck: patientDetailsAction?.getFileIdCheck,
    setPreviousFileId: patientDetailsAction?.stroeFileIdPreAction,
    getPdfFileId: patientDetailsAction?.patientHccFileAction,
    setPageLoading: patientDetailsAction?.setPageLoading,
    setPdfView: patientDetailsAction?.setPdfView,
    setDisable: patientDetailsAction?.setDisable,
  },
);

export default connector(PatientDetailsClientComponent);
