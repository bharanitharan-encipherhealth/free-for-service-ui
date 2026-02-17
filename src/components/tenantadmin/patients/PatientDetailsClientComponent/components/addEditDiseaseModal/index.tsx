import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import React, { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { connect, ConnectedProps } from "react-redux";
import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";
import { Button, Form, Input, Select, Spin, Switch } from "antd";
import {
  formValidate,
  getResponePopup,
  reusableEllipses,
  stringToColour,
} from "@/util/reusableFunction";
import {
  autoCompleteDTOList,
  Hyperlink,
  MeatCriteriaItem,
} from "@/models/tenantadmin/patients/details";
import CustomSelect from "@/components/customSelect";
import {
  commentSectionList,
  defaultCapturedSections,
} from "../function/reusableFunction";
import { getStorage } from "@/util/storage";
import { optionsTypes } from "@/state/reusableTypes";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import MeatButton from "../meatButton";
import SectionListForm from "../sectionFormList";
import { suggestedToValid } from "@/state/tenantadmin/patients/details/network";

type DiagnosisOption = {
  label: string;
  value: string;
  description: string;
};

type AddEditDiseaseModalReduxType = ConnectedProps<typeof connector> & {
  getPatientDiseaseDetails: ({ dos }: { dos: string }) => void;
};

const AddEditDiseaseModal = React.memo(
  ({
    modalOpen,
    setAddModalOpen,
    getValidCode,
    selectedDos,
    getValideCodeLoader,
    getCaptureSection,
    selectedPatientYear,
    patientDosDetails,
    checkCodePresent,
    admissionNumber,
    manuallyAdd,
    getPatientDiseaseDetails,
    editDiseaseList,
    patientDiseaseDetails,
    diseaseEdit,
    setEditDiseaseList,
    moveData,
    meatEditAction,
    setMovingData,
    setPdfView,
  }: AddEditDiseaseModalReduxType) => {
    const [form] = Form.useForm();
    const patientId = getStorage("patientId");
    const fileId = getStorage("fileId");
    const [sarchValue, setSearchValue] = useState("");
    const [codeOptions, setCodeOptions] = useState<
      {
        value: string;
        description: string;
        oldHcc: number;
        newHcc: number;
        label: React.ReactElement;
      }[]
    >([]);

    const [commentSection, setCommentSection] =
      useState<optionsTypes[]>(commentSectionList);

    const [capturedSections, setCapturedSections] = useState<optionsTypes[]>(
      [],
    );
    const [captureSectionList, setCaptureSectionList] = useState<
      {
        captureSection: string;
        captureSectionList: { pageNumber: number; reference: string }[];
      }[]
    >([]);

    const [capturedSectionsM, setCapturedSectionsM] = useState<optionsTypes[]>(
      [],
    );
    const [captureSectionListM, setcaptureSectionListM] = useState<
      {
        captureSection: string;
        captureSectionList: { pageNumber: number; reference: string }[];
      }[]
    >([]);
    const [editMeatSectionM, setEditMeatSectionM] = useState<number | null>(
      null,
    );

    const [capturedSectionsE, setCapturedSectionsE] = useState<optionsTypes[]>(
      [],
    );
    const [captureSectionListE, setcaptureSectionListE] = useState<
      {
        captureSection: string;
        captureSectionList: { pageNumber: number; reference: string }[];
      }[]
    >([]);
    const [editMeatSectionE, setEditMeatSectionE] = useState<number | null>(
      null,
    );

    const [capturedSectionsA, setCapturedSectionsA] = useState<optionsTypes[]>(
      [],
    );
    const [captureSectionListA, setcaptureSectionListA] = useState<
      {
        captureSection: string;
        captureSectionList: { pageNumber: number; reference: string }[];
      }[]
    >([]);
    const [editMeatSectionA, setEditMeatSectionA] = useState<number | null>(
      null,
    );

    const [capturedSectionsT, setCapturedSectionsT] = useState<optionsTypes[]>(
      [],
    );
    const [captureSectionListT, setcaptureSectionListT] = useState<
      {
        captureSection: string;
        captureSectionList: { pageNumber: number; reference: string }[];
      }[]
    >([]);
    const [editMeatSectionT, setEditMeatSectionT] = useState<number | null>(
      null,
    );

    const [showAdd, setShowAdd] = useState<boolean>(false);

    const [showMeatAdd, setShowMeatAdd] = useState<boolean>(false);

    const [editCaptureSection, setEditCaptureSection] = useState<number | null>(
      null,
    );

    const [activeMeat, setActiveMeat] = useState<boolean>(false);
    const [selectMeat, setSelectMeat] = useState("M");
    const [isFilled, setIsFilled] = useState<string[]>([]);

    const [dbDescription, setDbDescription] = useState("");

    const getMeatSection = useCallback(
      ({ meatLetter }: { meatLetter: string }) => {
        const EMPTY_SECTION_LIST: {
          captureSection: string;
          captureSectionList: { pageNumber: number; reference: string }[];
        }[] = [];

        switch (meatLetter) {
          case "M":
            return {
              meatCaptureSection: capturedSectionsM,
              setMeatCaptureSection: setCapturedSectionsM,
              meatSeactionList: captureSectionListM,
              setMeatSectionList: setcaptureSectionListM,
              setEditSection: setEditMeatSectionM,
              editSection: editMeatSectionM,
            };
          case "E":
            return {
              meatCaptureSection: capturedSectionsE,
              setMeatCaptureSection: setCapturedSectionsE,
              meatSeactionList: captureSectionListE,
              setMeatSectionList: setcaptureSectionListE,
              setEditSection: setEditMeatSectionE,
              editSection: editMeatSectionE,
            };
          case "A":
            return {
              meatCaptureSection: capturedSectionsA,
              setMeatCaptureSection: setCapturedSectionsA,
              meatSeactionList: captureSectionListA,
              setMeatSectionList: setcaptureSectionListA,
              setEditSection: setEditMeatSectionA,
              editSection: editMeatSectionA,
            };
          case "T":
            return {
              meatCaptureSection: capturedSectionsT,
              setMeatCaptureSection: setCapturedSectionsT,
              meatSeactionList: captureSectionListT,
              setMeatSectionList: setcaptureSectionListT,
              setEditSection: setEditMeatSectionT,
              editSection: editMeatSectionT,
            };
          default:
            return {
              meatCaptureSection: [],
              setMeatCaptureSection: () => {},
              meatSeactionList: EMPTY_SECTION_LIST,
              setMeatSectionList: () => {},
              setEditSection: () => {},
              editSection: null,
            };
        }
      },
      [
        capturedSectionsM,
        setCapturedSectionsM,
        capturedSectionsE,
        setCapturedSectionsE,
        capturedSectionsA,
        setCapturedSectionsA,
        capturedSectionsT,
        setCapturedSectionsT,
        editMeatSectionM,
        setEditMeatSectionM,
        captureSectionListM,
        setcaptureSectionListM,
        captureSectionListE,
        setcaptureSectionListE,
        setEditMeatSectionE,
        editMeatSectionE,
        captureSectionListA,
        setcaptureSectionListA,
        setEditMeatSectionA,
        editMeatSectionA,
        captureSectionListT,
        setcaptureSectionListT,
        setEditMeatSectionT,
        editMeatSectionT,
      ],
    );

    const getCode = useCallback(
      async ({ code }: { code: string }) => {
        const res = await getValidCode({ code, isDosSelected: selectedDos });
        const { autoCompleteDTOList = [], icdDiseaseDTOList = [] } =
          res?.response || {};
        let displayCodeOptions = [];
        if (res?.status === "SUCCESS") {
          const listToMap =
            autoCompleteDTOList?.length > 0
              ? autoCompleteDTOList
              : icdDiseaseDTOList;
          displayCodeOptions = listToMap.map((item: autoCompleteDTOList) => {
            const disease = item?.icdDiseaseDTO || item;
            return {
              value: disease?.code,
              description: disease?.description,
              oldHcc: item?.oldValue?.toString() || 0,
              newHcc: item?.newValue?.toString() || 0,
              label: (
                <div className="d-flex gap-1">
                  <span>{`${disease?.code} - ${disease?.description}`}</span>
                </div>
              ),
            };
          });
        }
        setCodeOptions(displayCodeOptions);
      },
      [sarchValue, selectedDos, getValidCode, codeOptions],
    );

    const getCodePresent = useCallback(
      async ({ code }: { code: string }) => {
        const isCode = await checkCodePresent({
          code,
          dos: selectedPatientYear,
          date: selectedDos,
          admissionNumber,
        });
        return isCode?.response;
      },
      [selectedDos, admissionNumber, selectedPatientYear, checkCodePresent],
    );

    const getPageNumbers = useCallback(() => {
      const getFilter = patientDosDetails
        ?.find((item) => item?.dateOfService == selectedDos)
        ?.fileDetailDTO?.dosSummaries?.find((item) => item?.dos == selectedDos);

      const end = Number(getFilter?.endPagNumber);
      const start = Number(getFilter?.startPageNumber);

      const pageNumber: { label: number; value: number }[] = [];
      if (!Number.isNaN(start) && !Number.isNaN(end)) {
        for (let index = start; index <= end; index++) {
          pageNumber.push({
            label: index,
            value: index,
          });
        }
      }
      return pageNumber;
    }, [patientDosDetails, selectedDos]);

    const getDiagnosisCode = useCallback(
      ({ code }: { code: string }) => {
        getCode({ code });
      },
      [sarchValue, getCode],
    );

    const getSectionList = useCallback(async () => {
      try {
        const payload = {
          dateOfService: [selectedDos],
          fileId,
          patientId,
          processedYear: selectedPatientYear,
        };
        const res = await getCaptureSection({ payload });
        if (res?.status === "SUCCESS") {
          const section =
            res?.response?.capturedSections.map((item: string) => ({
              label: item,
              value: item,
            })) || [];
          setCapturedSections(
            res?.response?.capturedSections?.length > 0
              ? section
              : defaultCapturedSections,
          );
          setCapturedSectionsM(
            res?.response?.capturedSections?.length > 0
              ? section
              : defaultCapturedSections,
          );
          setCapturedSectionsE(
            res?.response?.capturedSections?.length > 0
              ? section
              : defaultCapturedSections,
          );
          setCapturedSectionsA(
            res?.response?.capturedSections?.length > 0
              ? section
              : defaultCapturedSections,
          );
          setCapturedSectionsT(
            res?.response?.capturedSections?.length > 0
              ? section
              : defaultCapturedSections,
          );
        }
      } catch (e) {
        console.error(e, "while calling the capture section");
      }
    }, [
      getCaptureSection,
      selectedDos,
      fileId,
      patientId,
      selectedPatientYear,
    ]);

    const onCloseCaptureSection = useCallback(() => {
      setShowAdd(false);
      setEditCaptureSection(null);
      form.setFieldsValue({
        captureSection: "",
        captureSectionList: [{}],
      });
    }, [showAdd, editCaptureSection, form]);

    const onCloseMeatSection = useCallback(() => {
      getMeatSection({ meatLetter: selectMeat })?.setEditSection(null);
      form.setFieldsValue({
        meatCaptureSection: "",
        meatCaptureSectionList: [{}],
      });
      setShowMeatAdd(false);
    }, [form, selectMeat, getMeatSection]);

    const onHandleSaveCaptureSection = useCallback(
      ({
        captureSection,
        captureSectionList,
        index,
      }: {
        captureSection: string;
        captureSectionList: { pageNumber: number; reference: string }[];
        index: number | null;
      }) => {
        if (index != null) {
          setCaptureSectionList((prev) => {
            const update = [...prev];
            update[index] = {
              captureSection: captureSection,
              captureSectionList: captureSectionList,
            };
            return update;
          });
        } else {
          setCaptureSectionList((prev) => [
            ...prev,
            {
              captureSection: captureSection,
              captureSectionList: captureSectionList,
            },
          ]);
        }
      },
      [captureSectionList],
    );

    const onHandleSaveMeatSection = useCallback(
      ({
        captureSection,
        captureSectionList,
        index,
      }: {
        captureSection: string;
        captureSectionList: { pageNumber: number; reference: string }[];
        index: number | null;
      }) => {
        const setMeatList = getMeatSection({
          meatLetter: selectMeat,
        })?.setMeatSectionList;

        if (index != null) {
          setMeatList((prev) => {
            const update = [...prev];
            update[index] = {
              captureSection: captureSection,
              captureSectionList: captureSectionList,
            };
            return update;
          });
        } else {
          setMeatList((prev) => [
            ...prev,
            {
              captureSection: captureSection,
              captureSectionList: captureSectionList,
            },
          ]);
        }
      },
      [
        selectMeat,
        getMeatSection,
        onCloseMeatSection,
        captureSectionListM,
        captureSectionListA,
        captureSectionListE,
        captureSectionListT,
      ],
    );

    const handleDeleteCaptureSection = useCallback(
      ({ index }: { index: number }) => {
        setCaptureSectionList(
          captureSectionList?.filter((item, i) => i != index),
        );
      },
      [captureSectionList],
    );

    const handleDelteMeatSection = useCallback(
      ({ index }: { index: number }) => {
        getMeatSection({ meatLetter: selectMeat })?.setMeatSectionList((prev) =>
          prev?.filter((_, i) => i != index),
        );
      },
      [selectMeat, getMeatSection],
    );

    const convertToHyperLinkFormat = useCallback(
      ({
        sectionList,
      }: {
        sectionList: {
          captureSection: string;
          captureSectionList: { pageNumber: number; reference: string }[];
        }[];
      }) => {
        return (
          sectionList
            ?.map((item) =>
              item?.captureSectionList?.map((i) => ({
                header: item?.captureSection,
                substring: i?.reference,
                pageNumber: i?.pageNumber,
                dateOfService: selectedDos,
              })),
            )
            ?.flat() || []
        );
      },
      [selectedDos],
    );

    const handleFormClear = useCallback(() => {
      if (modalOpen?.isMeatPage) setPdfView(false);
      setAddModalOpen({
        isAdd: false,
        isEdit: false,
        isMeatAdd: false,
        isMeatPage: false,
      });
      form.resetFields();
      setEditDiseaseList(null);
      setMovingData(null);
    }, [
      setAddModalOpen,
      form,
      setEditDiseaseList,
      setMovingData,
      setPdfView,
      modalOpen,
    ]);

    const handleSucess = useCallback(() => {
      getPatientDiseaseDetails({ dos: selectedDos });
    }, [getPatientDiseaseDetails, selectedDos]);
    const handleFinish = useCallback(async () => {
      try {
        const { diagnosisCode, description, comments } = form.getFieldsValue();
        const patientId = getStorage("patientId");
        const CommanPayload = {
          patientId,
          processedYear: selectedPatientYear,
          comment: comments,
          chartProcessType: selectedDos ? "DATE_OF_SERVICE" : "YEAR",
          activeHeader: activeMeat,
          educationalError: false,
        };

        let payload;

        if (modalOpen?.isAdd) {
          payload = {
            ...CommanPayload,
            diagnosisCode,
            description,
            dbDescription: dbDescription,
            dateOfServices: [selectedDos],
            hyperlinks: convertToHyperLinkFormat({
              sectionList: captureSectionList,
            }),
            monitorHyperLink: activeMeat
              ? []
              : convertToHyperLinkFormat({
                  sectionList: getMeatSection({ meatLetter: "M" })
                    ?.meatSeactionList,
                }),
            evaluateHyperLink: activeMeat
              ? []
              : convertToHyperLinkFormat({
                  sectionList: getMeatSection({ meatLetter: "E" })
                    ?.meatSeactionList,
                }),
            assessmentHyperLink: activeMeat
              ? []
              : convertToHyperLinkFormat({
                  sectionList: getMeatSection({ meatLetter: "A" })
                    ?.meatSeactionList,
                }),
            treatmentHyperLink: activeMeat
              ? []
              : convertToHyperLinkFormat({
                  sectionList: getMeatSection({ meatLetter: "T" })
                    ?.meatSeactionList,
                }),
          };
        }
        if (modalOpen?.isEdit) {
          payload = {
            ...CommanPayload,
            oldDiagnosisCode: editDiseaseList?.diagnosisCode,
            diagnosisCode,
            newDiagnosisCode: diagnosisCode,
            dateOfServiceIfDosWiseCompute: selectedDos,
            description,
            dateOfServices: [selectedDos],
            providerNames: editDiseaseList?.providerNames?.map((item) => item),
            hyperlinks: convertToHyperLinkFormat({
              sectionList: captureSectionList,
            }),
            monitorAspect: getMeatSection({ meatLetter: "M" })
              ?.meatSeactionList?.[0]?.captureSectionList?.[0]?.reference,
            monitorHyperLink: activeMeat
              ? []
              : convertToHyperLinkFormat({
                  sectionList: getMeatSection({ meatLetter: "M" })
                    ?.meatSeactionList,
                }),
            evaluateAspect: getMeatSection({ meatLetter: "E" })
              ?.meatSeactionList?.[0]?.captureSectionList?.[0]?.reference,
            evaluateHyperLink: activeMeat
              ? []
              : convertToHyperLinkFormat({
                  sectionList: getMeatSection({ meatLetter: "E" })
                    ?.meatSeactionList,
                }),
            assessmentAspect: getMeatSection({ meatLetter: "A" })
              ?.meatSeactionList?.[0]?.captureSectionList?.[0]?.reference,
            assessmentHyperLink: activeMeat
              ? []
              : convertToHyperLinkFormat({
                  sectionList: getMeatSection({ meatLetter: "A" })
                    ?.meatSeactionList,
                }),
            treatmentAspect: getMeatSection({ meatLetter: "T" })
              ?.meatSeactionList?.[0]?.captureSectionList?.[0]?.reference,
            treatmentHyperLink: activeMeat
              ? []
              : convertToHyperLinkFormat({
                  sectionList: getMeatSection({ meatLetter: "T" })
                    ?.meatSeactionList,
                }),
          };
        }

        if (modalOpen?.isMeatEdit) {
          payload = {
            ...CommanPayload,
            comment: editDiseaseList?.comments,
            diagnosisCode:
              editDiseaseList?.diagnosisCode || moveData?.data?.diagnosisCode,
            dateOfServices: [selectedDos],
            dateOfServiceIfDosWiseCompute: selectedDos,
            monitorAspect: getMeatSection({ meatLetter: "M" })
              ?.meatSeactionList?.[0]?.captureSectionList?.[0]?.reference,
            monitorHyperLink: activeMeat
              ? []
              : convertToHyperLinkFormat({
                  sectionList: getMeatSection({ meatLetter: "M" })
                    ?.meatSeactionList,
                }),
            evaluateAspect: getMeatSection({ meatLetter: "E" })
              ?.meatSeactionList?.[0]?.captureSectionList?.[0]?.reference,
            evaluateHyperLink: activeMeat
              ? []
              : convertToHyperLinkFormat({
                  sectionList: getMeatSection({ meatLetter: "E" })
                    ?.meatSeactionList,
                }),
            assessmentAspect: getMeatSection({ meatLetter: "A" })
              ?.meatSeactionList?.[0]?.captureSectionList?.[0]?.reference,
            assessmentHyperLink: activeMeat
              ? []
              : convertToHyperLinkFormat({
                  sectionList: getMeatSection({ meatLetter: "A" })
                    ?.meatSeactionList,
                }),
            treatmentAspect: getMeatSection({ meatLetter: "T" })
              ?.meatSeactionList?.[0]?.captureSectionList?.[0]?.reference,
            treatmentHyperLink: activeMeat
              ? []
              : convertToHyperLinkFormat({
                  sectionList: getMeatSection({ meatLetter: "T" })
                    ?.meatSeactionList,
                }),
          };
        }
        if (admissionNumber?.patientType == "INPATIENT") {
          payload = { ...payload, admNo: admissionNumber?.admNo };
        }

        let res;
        if (modalOpen?.isAdd) {
          res = await manuallyAdd({ obj: payload });
        }
        if (modalOpen?.isEdit) {
          res = await diseaseEdit({ payload });
        }

        if (modalOpen?.isMeatEdit) {
          if (modalOpen?.isMeatPage) {
            res = await meatEditAction({ payload });
          } else {
            const dragAndDrop = `${moveData?.dragId}_${moveData?.dropId}`;

            res = await suggestedToValid({
              payload,
              dragAndDrop,
            });
          }
        }

        if (res?.status === "SUCCESS") {
          getResponePopup(res);
          handleSucess();
          handleFormClear();
        } else {
          getResponePopup(res);
        }
      } catch (e) {
        console.error(e, "While calling the form finish call");
      }
    }, [
      diseaseEdit,
      selectedPatientYear,
      selectedDos,
      form,
      modalOpen,
      captureSectionList,
      convertToHyperLinkFormat,
      getMeatSection,
      admissionNumber,
      manuallyAdd,
      dbDescription,
      activeMeat,
      handleFormClear,
      handleSucess,
      editDiseaseList,
      moveData,
      meatEditAction,
    ]);

    const handleSetCaptureSection = useCallback(
      ({ sectionList }: { sectionList: Hyperlink[] }) => {
        return sectionList?.map((item) => ({
          captureSection: item?.header,
          captureSectionList: [
            { pageNumber: item?.pageNumber, reference: item?.substring },
          ],
        }));
      },
      [editDiseaseList, modalOpen?.isEdit, patientDiseaseDetails],
    );

    const handleEditFill = useCallback(() => {
      if (editDiseaseList) {
        const { diagnosisCode, dbDescription, hyperlinks, lastAddedComment } =
          editDiseaseList;

        const meatLsit = [
          ...patientDiseaseDetails?.meatCriteria,
          ...patientDiseaseDetails?.deletedMeatCriteria,
        ];
        const diagnosisCodeMeat = meatLsit?.find(
          (item) => item?.diagnosisCode === diagnosisCode,
        );

        console.log(editDiseaseList, "setEditDiseaseList");

        form.setFieldsValue({
          diagnosisCode: diagnosisCode,
          description: dbDescription,
          comments: lastAddedComment,
        });

        setCaptureSectionList(
          handleSetCaptureSection({ sectionList: hyperlinks }) || [],
        );

        setcaptureSectionListM(
          handleSetCaptureSection({
            sectionList: diagnosisCodeMeat?.monitorHyperLink || [],
          }) || [],
        );

        setcaptureSectionListE(
          handleSetCaptureSection({
            sectionList: diagnosisCodeMeat?.evaluateHyperLink || [],
          }) || [],
        );

        setcaptureSectionListA(
          handleSetCaptureSection({
            sectionList: diagnosisCodeMeat?.assessmentHyperLink || [],
          }) || [],
        );

        setcaptureSectionListT(
          handleSetCaptureSection({
            sectionList: diagnosisCodeMeat?.treatmentHyperLink || [],
          }) || [],
        );

        if (diagnosisCodeMeat?.monitorHyperLink?.length) {
          setSelectMeat("M");
          return;
        }
        if (diagnosisCodeMeat?.evaluateHyperLink?.length) {
          setSelectMeat("E");
          return;
        }
        if (diagnosisCodeMeat?.assessmentHyperLink?.length) {
          setSelectMeat("A");
          return;
        }
        if (diagnosisCodeMeat?.treatmentHyperLink?.length) {
          setSelectMeat("T");
          return;
        }
      }
    }, [editDiseaseList, modalOpen?.isEdit, patientDiseaseDetails, form]);

    useEffect(() => {
      const loadSections = async () => {
        await getSectionList();
      };

      loadSections();
    }, [selectedDos, fileId, patientId, selectedPatientYear]);

    useEffect(() => {
      const onCaptureSection = async () => {
        setCapturedSections((prev) =>
          prev?.map((item) => ({
            ...item,
            disabled: captureSectionList?.find(
              (res) => res?.captureSection == item?.value,
            ),
          })),
        );
      };
      onCaptureSection();
    }, [captureSectionList]);

    useEffect(() => {
      const meatSectionList = getMeatSection({
        meatLetter: selectMeat,
      })?.meatSeactionList;
      getMeatSection({ meatLetter: selectMeat })?.setMeatCaptureSection(
        (prev) =>
          prev?.map((item) => ({
            ...item,
            disabled: meatSectionList?.find(
              (res) =>
                res?.captureSection?.toLowerCase() ==
                item?.value?.toLowerCase(),
            ),
          })),
      );
    }, [
      selectMeat,
      getMeatSection({
        meatLetter: selectMeat,
      })?.meatSeactionList,
    ]);

    useEffect(() => {
      const fillledSet = async () => {
        setIsFilled([
          captureSectionListM?.length > 0 ? "M" : "",
          captureSectionListE?.length > 0 ? "E" : "",
          captureSectionListA?.length > 0 ? "A" : "",
          captureSectionListT?.length > 0 ? "T" : "",
        ]);
      };
      fillledSet();
    }, [
      captureSectionListM,
      captureSectionListE,
      captureSectionListA,
      captureSectionListT,
    ]);

    useEffect(() => {
      const editFill = async () => {
        if ((modalOpen?.isEdit || modalOpen?.isMeatEdit) && editDiseaseList) {
          handleEditFill();
        }
      };
      editFill();
    }, [modalOpen]);

    return (
      <div className="bg-white h-full p-3 rounded-xl">
        <div className="flex justify-between items-center font-bold border-b border-gray-300 pb-2 px-2">
          <div>
            {modalOpen?.isAdd
              ? "Add Valid Code"
              : modalOpen?.isEdit
                ? "Edit Valid Code"
                : modalOpen?.isMeatEdit
                  ? "Suggested Meat Add"
                  : ""}
          </div>
          <div onClick={handleFormClear} className="cursor-pointer">
            <IoMdClose className="font-bold text-xl" />
          </div>
        </div>

        <Form
          layout="vertical"
          requiredMark={false}
          form={form}
          onFinish={handleFinish}
          initialValues={{
            captureSectionList: [{}],
            meatCaptureSectionList: [{}],
          }}
          onFinishFailed={(e) => console.error(e, "hjkjnkl")}
          className="overflow-scroll h-[70vh] relative"
        >
          {!modalOpen?.isMeatEdit && (
            <div className="grid grid-cols-12 gap-x-4 my-2 px-2">
              <div className="col-span-6">
                <Form.Item
                  label={
                    <label className="font-semibold">
                      Code <span className="text-red-500">*</span>
                    </label>
                  }
                  name="diagnosisCode"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter The Diagnosis Code",
                    },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();

                        const isValid = formValidate({
                          value,
                          valueType: "noSpecialChar",
                        });

                        return isValid
                          ? Promise.resolve()
                          : Promise.reject(
                              "Only alphanumeric values are allowed",
                            );
                      },
                      validateTrigger: "onChange",
                    },

                    {
                      async validator(_, value) {
                        if (!value) return Promise.resolve();

                        if (modalOpen?.isEdit) return Promise.resolve();

                        const codeCheck = await getCodePresent({
                          code: value || "",
                        });

                        if (codeCheck) {
                          return Promise.reject("Code Already Exist");
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Select<string, DiagnosisOption>
                    allowClear
                    showSearch
                    placeholder="Search Diagnosis Code"
                    searchValue={sarchValue}
                    onSearch={(e) => {
                      const isValid = formValidate({
                        value: e,
                        valueType: "icdCode",
                      });

                      if (isValid) {
                        setSearchValue(e);
                        if (e?.length > 2) getDiagnosisCode({ code: e });
                      }
                    }}
                    notFoundContent={
                      getValideCodeLoader ? <Spin size="small" /> : "No data"
                    }
                    options={
                      getValideCodeLoader
                        ? []
                        : (codeOptions?.map((item) => ({
                            label: `${item.value} - ${item.description}`,
                            value: item.value,

                            description: item.description,
                          })) ?? [])
                    }
                    onClear={() => setCodeOptions([])}
                    onChange={(value, option) => {
                      if (!option || Array.isArray(option)) return;

                      form.setFieldsValue({
                        description: option.description,
                      });
                      setDbDescription(option?.description);
                    }}
                  />
                </Form.Item>
              </div>

              <div className="col-span-6">
                <Form.Item
                  name="description"
                  label={
                    <label className="font-semibold">
                      Description <span className="text-red-500">*</span>
                    </label>
                  }
                  rules={[
                    { required: true, message: "Please enter description" },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();

                        const isEmpty = formValidate({
                          value,
                          valueType: "notEmpty",
                        });

                        if (!isEmpty) {
                          return Promise.reject(
                            "Description Can't Start with Space",
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter the Description"
                    disabled={!form.getFieldValue("diagnosisCode")}
                  />
                </Form.Item>
              </div>

              <div className="col-span-12">
                <Form.Item
                  name={"comments"}
                  label={
                    <label className="font-semibold">
                      Comments <span className="text-red-500">*</span>
                    </label>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please Select The Commnets",
                    },
                  ]}
                >
                  <CustomSelect
                    options={commentSection}
                    onChange={(val) => {
                      //   setComments(val || "");
                      form.setFieldValue("comments", val || "");
                    }}
                    setOptions={setCommentSection}
                    placeholder="Select The Comments"
                    size="middle"
                  />
                </Form.Item>
              </div>

              {/* capture section rendering list */}

              {captureSectionList?.length > 0 && (
                <div className="col-span-12">
                  <div className="flex justify-between font-bold text-base border-b border-gray-300 items-center py-2 my-2">
                    <div>Section List</div>
                    <div>
                      <Button
                        type="primary"
                        onClick={() => {
                          setShowAdd(true);
                          form.setFieldsValue({
                            captureSection: "",
                            captureSectionList: [{}],
                          });
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="my-2 px-1 flex gap-3 flex-wrap">
                    {captureSectionList?.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor:
                            stringToColour(item?.captureSection) + 33,
                          color: stringToColour(item?.captureSection),
                        }}
                        className="rounded p-1 flex gap-4 justify-between capitalize"
                      >
                        {reusableEllipses({
                          str: item?.captureSection,
                          count: 20,
                        })}
                        <div className="flex gap-2 items-center">
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setEditCaptureSection(index);
                              form.setFieldsValue({
                                captureSection: item?.captureSection,
                                captureSectionList: item?.captureSectionList
                                  ?.length
                                  ? item?.captureSectionList
                                  : [{}],
                              });
                            }}
                          >
                            <FaPen color="#04306f" />
                          </div>

                          <div
                            className="cursor-pointer"
                            onClick={() =>
                              handleDeleteCaptureSection({
                                index,
                              })
                            }
                          >
                            <MdDelete color="#04306f" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* capture section   */}
              {(captureSectionList?.length == 0 ||
                showAdd ||
                editCaptureSection != null) && (
                <div className="col-span-12 border border-gray-300 grid-cols-12 rounded p-2">
                  <div className="col-span-12">
                    <Form.Item
                      label={
                        <label className="font-semibold">
                          Section <span className="text-red-500">*</span>
                        </label>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please Select the Section",
                        },
                      ]}
                      name={"captureSection"}
                    >
                      <CustomSelect
                        options={capturedSections}
                        onChange={(val) =>
                          form.setFieldValue("captureSection", val || "")
                        }
                        setOptions={setCapturedSections}
                        placeholder="Select the Capture Section"
                        size="middle"
                        disabled={false}
                      />
                    </Form.Item>
                  </div>

                  <div className="col-span-12 flex flex-col">
                    <SectionListForm
                      formListName={"captureSectionList"}
                      getPageNumbers={getPageNumbers}
                      captureSectionList={captureSectionListM}
                      onCloseCaptureSection={onCloseCaptureSection}
                      form={form}
                      onHandleSaveCaptureSection={onHandleSaveCaptureSection}
                      editCaptureSection={editCaptureSection}
                      captureSectionFormName={"captureSection"}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* meat Part */}

          <div className="px-2 py-2">
            <div className="font-bold text-base">Meat</div>

            <div className="flex gap-2 items-center">
              <div className="flex gap-2">
                <label htmlFor="activeheader">Active Header</label>
                <Switch
                  onChange={(e) => setActiveMeat(e)}
                  checked={activeMeat}
                />
              </div>

              {!activeMeat && (
                <div>
                  <MeatButton
                    select={selectMeat}
                    setSelect={setSelectMeat}
                    id="meat-selectButton"
                    completed={isFilled}
                  />
                </div>
              )}
            </div>

            {!activeMeat && (
              <>
                {getMeatSection({ meatLetter: selectMeat })?.meatSeactionList
                  ?.length > 0 && (
                  <div className="flex justify-between font-bold text-base border-b border-gray-300 items-center py-2 my-2">
                    <div>Section List</div>
                    <div>
                      <Button
                        type="primary"
                        onClick={() => {
                          setShowMeatAdd(true);
                          form.setFieldsValue({
                            meatCaptureSection: "",
                            meatCaptureSectionList: [{}],
                          });
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                )}
                <div className="my-2 px-1">
                  <div className=" flex gap-3 flex-wrap">
                    {getMeatSection({
                      meatLetter: selectMeat,
                    })?.meatSeactionList?.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor:
                            stringToColour(item?.captureSection) + 33,
                          color: stringToColour(item?.captureSection),
                        }}
                        className="rounded p-1 flex gap-4 justify-between capitalize"
                      >
                        {reusableEllipses({
                          str: item?.captureSection,
                          count: 20,
                        })}
                        <div className="flex gap-2 items-center">
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              getMeatSection({
                                meatLetter: selectMeat,
                              })?.setEditSection(index);
                              form.setFieldsValue({
                                meatCaptureSection: item?.captureSection,
                                meatCaptureSectionList: item?.captureSectionList
                                  ?.length
                                  ? item?.captureSectionList
                                  : [{}],
                              });
                            }}
                          >
                            <FaPen color="#04306f" />
                          </div>

                          <div
                            className="cursor-pointer"
                            onClick={() =>
                              handleDelteMeatSection({
                                index,
                              })
                            }
                          >
                            <MdDelete color="#04306f" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {(getMeatSection({ meatLetter: selectMeat })?.meatSeactionList
                    ?.length == 0 ||
                    getMeatSection({ meatLetter: selectMeat })?.editSection !=
                      null ||
                    showMeatAdd) && (
                    <div className="border border-gray-300 grid-cols-12 rounded p-2 my-2">
                      <Form.Item
                        label={
                          <label className="font-semibold">
                            Section <span className="text-red-500">*</span>
                          </label>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please Select the Section",
                          },
                        ]}
                        name="meatCaptureSection"
                      >
                        <CustomSelect
                          options={
                            getMeatSection({ meatLetter: selectMeat })
                              ?.meatCaptureSection
                          }
                          onChange={(val) =>
                            form.setFieldValue("meatCaptureSection", val || "")
                          }
                          setOptions={
                            getMeatSection({ meatLetter: selectMeat })
                              ?.setMeatCaptureSection
                          }
                          placeholder="Select the Meat Section"
                          size="middle"
                          disabled={false}
                        />
                      </Form.Item>
                      <SectionListForm
                        formListName={"meatCaptureSectionList"}
                        getPageNumbers={getPageNumbers}
                        captureSectionList={
                          getMeatSection({ meatLetter: selectMeat })
                            ?.meatSeactionList
                        }
                        onCloseCaptureSection={onCloseMeatSection}
                        form={form}
                        onHandleSaveCaptureSection={onHandleSaveMeatSection}
                        editCaptureSection={
                          getMeatSection({ meatLetter: selectMeat })
                            ?.editSection
                        }
                        captureSectionFormName={"meatCaptureSection"}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="px-3 sticky bottom-0 left-20">
            <Form.Item className=" w-full bg-white border-t border-gray-300 text-center z-10 my-2 px-2">
              <Button
                htmlType="submit"
                type="primary"
                className="mt-2"
                disabled={
                  showMeatAdd ||
                  (!modalOpen?.isMeatEdit &&
                    (showAdd || captureSectionList?.length == 0)) ||
                  (activeMeat
                    ? false
                    : getMeatSection({ meatLetter: selectMeat })
                        ?.meatSeactionList?.length == 0)
                }
              >
                Save
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  },
);

AddEditDiseaseModal.displayName = "AddEditDiseaseModal";

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    modalOpen: state?.patientDetailsReducer?.setAddModaOpen,
    selectedDos: state?.patientDetailsReducer?.setSelectDos,
    getValideCodeLoader: state?.patientDetailsReducer?.getValidCodeLoading,
    selectedPatientYear: state?.patientDetailsReducer?.setPatientOverallYear,
    patientDosDetails:
      state?.patientDetailsReducer?.patientDosDetails?.data?.response,
    admissionNumber: state?.patientDetailsReducer?.setAdmissionNumber,
    editDiseaseList: state?.patientDetailsReducer?.editDiseaseList,
    patientDiseaseDetails:
      state?.patientDetailsReducer?.patientDiseaseDetails?.data?.response,
    moveData: state?.patientDetailsReducer?.setMovingData,
  }),
  {
    setAddModalOpen: patientDetailsAction?.setAddModaOpen,
    getValidCode: patientDetailsAction?.getValidCode,
    getCaptureSection: patientDetailsAction?.getCaptureSection,
    checkCodePresent: patientDetailsAction?.checkCodePresent,
    manuallyAdd: patientDetailsAction?.manuallyAdd,
    diseaseEdit: patientDetailsAction?.diseaseEdit,
    setEditDiseaseList: patientDetailsAction?.setEditDiseaseList,
    meatEditAction: patientDetailsAction?.meatEditAction,
    setMovingData: patientDetailsAction?.setMovingData,
    setPdfView: patientDetailsAction?.setPdfView,
  },
);

export default connector(AddEditDiseaseModal);
