import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import { Button, Form, Input, Skeleton } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { VscSend } from "react-icons/vsc";
import { connect, ConnectedProps } from "react-redux";
import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";
import { getResponePopup } from "@/util/reusableFunction";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { renderUserPrfoileAvatar } from "@/components/layout/appHeader/function";
import style from "../../style.module.css";

const { TextArea } = Input;

type NotesRedux = ConnectedProps<typeof connector>;
const Notes = React.memo(
  ({
    patientOverallDetails,
    admissionNumber,
    addNotesAction,
    getNotesListAction,
    patientDetails,
    notesList,
    notesListLoading,
    removeNotesAction,
  }: NotesRedux) => {
    const [form] = Form.useForm();
    const [notesLoading, setNotesLoadig] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const getNotesLists = useCallback(async () => {
      await getNotesListAction({
        yearData: patientDetails,
        patientId: patientDetails?.patientId,
        admissionNumber,
      });
    }, [patientDetails]);

    const handleSubmitNotes = useCallback(async () => {
      try {
        setNotesLoadig(true);
        let notesPayload: {
          patientId: string;
          note: string;
          processedYear: number;
          dateOfService: string;
          admNo?: string;
        } = {
          patientId: patientOverallDetails?.patientId,
          note: form.getFieldValue("notes"),
          processedYear: patientOverallDetails?.processedYear,
          dateOfService: patientOverallDetails?.dateOfService,
        };
        if (admissionNumber?.patientType == "INPATIENT") {
          notesPayload = {
            ...notesPayload,
            admNo: admissionNumber?.admNo,
          };
        }
        const resposne = await addNotesAction({ notesPayload });
        getResponePopup(resposne);
        form?.setFieldValue("notes", "");
        getNotesLists();
      } catch (e) {
        console.error(e, "While Calling the handleSubmitNotes");
      } finally {
        setNotesLoadig(false);
      }
    }, [patientOverallDetails, getNotesLists]);

    const removeNotes = useCallback(
      async ({ noteId }: { noteId: string }) => {
        setDeleteLoading(true);
        try {
          let removePayload: {
            patientId: string;
            noteId: string;
            processedYear: number;
            dateOfService: string;
            admNo?: string;
          } = {
            patientId: patientOverallDetails?.patientId,
            noteId,
            processedYear: patientOverallDetails?.processedYear,
            dateOfService: patientOverallDetails?.dateOfService,
          };
          if (admissionNumber?.patientType == "INPATIENT") {
            removePayload = {
              ...removePayload,
              admNo: admissionNumber?.admNo,
            };
          }
          const resposne = await removeNotesAction({ removePayload });
          getResponePopup(resposne);
          getNotesLists();
        } catch (e) {
          console.error(e, "while calling the removeNotes");
        } finally {
          setDeleteLoading(false);
        }
      },
      [admissionNumber, patientOverallDetails],
    );

    useEffect(() => {
      getNotesLists();
    }, []);

    return (
      <div>
        <>
          <Form
            form={form}
            className="w-full"
            onFinish={handleSubmitNotes}
            layout="vertical"
          >
            <Form.Item
              label="Notes"
              name="notes"
              rules={[
                { required: true, message: "Notes Section is Required" },
                {
                  pattern: /^\S/,
                  message: "Notes cannot start with a whitespace character.",
                },
              ]}
              shouldUpdate
            >
              <div className="relative">
                <TextArea
                  maxLength={100}
                  rows={6}
                  placeholder="Enter the Notes"
                  required
                  className="pb-12 pr-12 resize-none"
                />

                <Button
                  htmlType="submit"
                  className="absolute! bottom-3 right-3 flex items-center justify-center p-2 rounded-full shadow-md border-0!"
                  loading={notesLoading}
                >
                  <VscSend className="text-sky-900 text-lg" />
                </Button>
              </div>
            </Form.Item>
          </Form>
        </>

        <div className="my-4 mx-1">
          {notesListLoading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 15 }).map((_, i) => (
                <Skeleton.Input key={i} active block />
              ))}
            </div>
          ) : (
            notesList?.map((item, index) => (
              <div
                key={index}
                className={`${style?.commentsList} rounded-xl p-2 py-3 my-2`}
              >
                <div className="flex gap-2 items-start justify-between">
                  <div className="flex gap-3 items-start">
                    {renderUserPrfoileAvatar(
                      item?.createdByDetails?.firstName ||
                        item?.createdByDetails?.firstName,
                      item?.createdByDetails?.lastName ||
                        item?.createdByDetails?.lastName,
                      item?.createdByDetails?.profileImageUrl ||
                        item?.createdByDetails?.profileImageUrl,
                      "header",
                    )}
                    <div className="flex flex-col gap-1">
                      <div className="font-bold">
                        {item?.createdByDetails?.firstName +
                          " " +
                          item?.createdByDetails?.lastName}
                      </div>
                      <div className="text-sm">{item?.note}</div>
                      <div className="text-gray-500 text-xs my-2">
                        {item?.dateOfService}
                      </div>
                    </div>
                  </div>

                  <div
                    className="text-lg cursor-pointer"
                    onClick={() => removeNotes({ noteId: item?.noteId })}
                  >
                    <Button
                      className="bg-transparent! border-0! shadow-none!"
                      loading={deleteLoading}
                    >
                      <RiDeleteBin5Fill />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  },
);

Notes.displayName = "Notes";

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    patientOverallDetails:
      state?.patientDetailsReducer?.patientDiseaseDetails?.data?.response,
    admissionNumber: state?.patientDetailsReducer?.setAdmissionNumber,
    patientDetails:
      state?.patientDetailsReducer?.patientDiseaseDetails?.data?.response,
    notesList: state?.patientDetailsReducer?.notesLists?.data?.response,
    notesListLoading: state?.patientDetailsReducer?.notesLoading,
  }),
  {
    addNotesAction: patientDetailsAction?.addNotesAction,
    getNotesListAction: patientDetailsAction?.getNotesLists,
    removeNotesAction: patientDetailsAction?.deleteNotes,
  },
);

export default connector(Notes);
