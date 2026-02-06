import { Button, Form, Input, Skeleton } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { VscSend } from "react-icons/vsc";
import { connect, ConnectedProps } from "react-redux";

import { actions as patientDetailsAction } from "@/state/tenantadmin/patients/details";
import patinetDetailsReducerType from "@/state/tenantadmin/patients/details/model";
import { getResponePopup } from "@/util/reusableFunction";
import style from "../../style.module.css";
import { renderUserPrfoileAvatar } from "@/components/layout/appHeader/function";
import { RiDeleteBin5Fill } from "react-icons/ri";

const { TextArea } = Input;

type CommentsRedux = ConnectedProps<typeof connector>;
const Comments = React.memo(
  ({
    getCommetsAction,
    patientDetails,
    admissionNumber,
    commentListLoading,
    commentListData,
    setAddCommentAction,
    patientOverallDetails,
    removeCommentsAction,
  }: CommentsRedux) => {
    const [form] = Form.useForm();
    const [commentLoading, setCommentsLoadig] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const getCommentsList = useCallback(async () => {
      await getCommetsAction({
        yearData: patientDetails,
        patientId: patientDetails?.patientId,
        admissionNumber,
      });
    }, [getCommetsAction, patientDetails, admissionNumber]);

    const handleSubmitComments = useCallback(async () => {
      setCommentsLoadig(true);
      let commentsData: {
        patientId: string;
        userComment: string;
        processedYear: number;
        dateOfService: string;
        admNo?: string;
      } = {
        patientId: patientOverallDetails?.patientId,
        userComment: form?.getFieldValue("comments"),
        processedYear: patientOverallDetails?.processedYear,
        dateOfService: patientOverallDetails?.dateOfService,
      };
      if (admissionNumber?.patientType == "INPATIENT") {
        commentsData = {
          ...commentsData,
          admNo: admissionNumber?.admNo,
        };
      }
      try {
        const resposne = await setAddCommentAction({ commentsData });
        getResponePopup(resposne);
        form?.setFieldValue("comments", "");
        getCommentsList();
      } catch (e) {
        console.error(e, "While Calling the handleSubmitComments");
      } finally {
        setCommentsLoadig(false);
      }
    }, [form, patientOverallDetails, admissionNumber, setAddCommentAction]);

    const removeComment = useCallback(
      async ({ commentId }: { commentId: string }) => {
        setDeleteLoading(true);
        try {
          let removePayload: {
            patientId: string;
            commentId: string;
            processedYear: number;
            dateOfService: string;
            admNo?: string;
          } = {
            patientId: patientOverallDetails?.patientId,
            commentId,
            processedYear: patientOverallDetails?.processedYear,
            dateOfService: patientOverallDetails?.dateOfService,
          };
          if (admissionNumber?.patientType == "INPATIENT") {
            removePayload = { ...removePayload, admNo: admissionNumber?.admNo };
          }
          const resposne = await removeCommentsAction({ removePayload });
          getResponePopup(resposne);
          getCommentsList();
        } catch (e) {
          console.error(e, "While calling the remove comment");
        } finally {
          setDeleteLoading(false);
        }
      },
      [commentListData],
    );

    useEffect(() => {
      getCommentsList();
    }, []);
    return (
      <div>
        <>
          <Form
            form={form}
            className="w-full"
            onFinish={handleSubmitComments}
            layout="vertical"
          >
            <Form.Item
              label="Comments"
              name="comments"
              rules={[
                { required: true, message: "Comments Section is Required" },
                {
                  pattern: /^\S/,
                  message: "Comments cannot start with a whitespace character.",
                },
              ]}
              shouldUpdate
            >
              <div className="relative">
                <TextArea
                  maxLength={100}
                  rows={6}
                  placeholder="Enter the Comments"
                  required
                  className="pb-12 pr-12 resize-none"
                />

                <Button
                  htmlType="submit"
                  className="absolute! bottom-3 right-3 flex items-center justify-center p-2 rounded-full shadow-md border-0!"
                  loading={commentLoading}
                >
                  <VscSend className="text-sky-900 text-lg" />
                </Button>
              </div>
            </Form.Item>
          </Form>
        </>
        <div className="my-4 mx-1">
          {commentListLoading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 15 }).map((_, i) => (
                <Skeleton.Input key={i} active block />
              ))}
            </div>
          ) : (
            commentListData?.map((item, index) => (
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
                      <div className="text-sm">{item?.userComment}</div>
                      <div className="text-gray-500 text-xs my-2">
                        {item?.dateOfService}
                      </div>
                    </div>
                  </div>

                  <div
                    className="text-lg cursor-pointer"
                    onClick={() =>
                      removeComment({ commentId: item?.commentId })
                    }
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

Comments.displayName = "Comments";

const connector = connect(
  (state: { patientDetailsReducer: patinetDetailsReducerType }) => ({
    patientDetails:
      state?.patientDetailsReducer?.patientDiseaseDetails?.data?.response,
    admissionNumber: state?.patientDetailsReducer?.setAdmissionNumber,
    commentListLoading: state?.patientDetailsReducer?.getCommentLoading,
    commentListData: state?.patientDetailsReducer?.commentList?.data?.response,
    patientOverallDetails:
      state?.patientDetailsReducer?.patientDiseaseDetails?.data?.response,
  }),
  {
    getCommetsAction: patientDetailsAction?.getCommentAction,
    setAddCommentAction: patientDetailsAction?.addCommentsAction,
    removeCommentsAction: patientDetailsAction?.removeCommentsAction,
  },
);

export default connector(Comments);
