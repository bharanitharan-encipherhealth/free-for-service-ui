import { formValidate } from "@/util/reusableFunction";
import { Button, Form, FormInstance, Input, Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import React from "react";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";

const SectionListForm = React.memo(
  ({
    formListName,
    getPageNumbers,
    captureSectionList,
    onCloseCaptureSection,
    form,
    onHandleSaveCaptureSection,
    editCaptureSection,
    captureSectionFormName,
  }: {
    formListName: string;
    getPageNumbers: () => DefaultOptionType[];
    captureSectionList: {
      captureSection: string;
      captureSectionList: { pageNumber: number; reference: string }[];
    }[];
    onCloseCaptureSection: () => void;
    onHandleSaveCaptureSection: ({
      captureSection,
      captureSectionList,
      index,
    }: {
      captureSection: string;
      captureSectionList: { pageNumber: number; reference: string }[];
      index: number | null;
    }) => void;
    form: FormInstance;
    editCaptureSection: number | null;
    captureSectionFormName: string;
  }) => {
    return (
      <>
        <Form.List name={formListName}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div
                  key={field.key}
                  className="mb-4 border border-gray-300 p-2 rounded"
                >
                  {/* Section Header */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-bold">{`Section - ${index + 1}`}</div>
                    <div className="flex gap-2">
                      {index === 0 && (
                        <IoMdAdd
                          className="text-xl text-black cursor-pointer"
                          onClick={() => add({})}
                        />
                      )}
                      {fields.length > 1 && (
                        <MdDelete
                          className="text-xl text-red-500 cursor-pointer"
                          onClick={() => remove(index)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Page Number & Reference */}
                  <div className="grid grid-cols-12 gap-x-5">
                    <div className="col-span-6">
                      <Form.Item
                        {...field}
                        name={[field.name, "pageNumber"]}
                        label={
                          <label className="font-semibold">Page Number</label>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Page Number is required",
                          },
                          {
                            validator: (_, value) => {
                              if (!value) return Promise.resolve();
                              const isChar = formValidate({
                                value,
                                valueType: "allowNumber",
                              });

                              if (!isChar) {
                                return Promise.reject("Only Number is Allowed");
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select the Page Number"
                          options={getPageNumbers()}
                        />
                      </Form.Item>
                    </div>

                    <div className="col-span-6">
                      <Form.Item
                        {...field}
                        name={[field.name, "reference"]}
                        label={
                          <label className="font-semibold">Reference</label>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Reference is required",
                          },
                        ]}
                      >
                        <Input placeholder="Enter the Reference" />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center mt-2 flex gap-3 items-center justify-center">
                {captureSectionList?.length > 0 && (
                  <Button onClick={onCloseCaptureSection}>Close</Button>
                )}
                <Button
                  type="primary"
                  onClick={async () => {
                    try {
                      const sectionCount =
                        form.getFieldValue(formListName)?.length || 0;

                      const fieldsToValidate: (string | number)[][] = [
                        [captureSectionFormName],
                      ];
                      for (let i = 0; i < sectionCount; i++) {
                        fieldsToValidate.push([formListName, i, "pageNumber"]);
                        fieldsToValidate.push([formListName, i, "reference"]);
                      }
                      const values =
                        await form.validateFields(fieldsToValidate);

                      onHandleSaveCaptureSection({
                        captureSection: values?.[captureSectionFormName],
                        captureSectionList: values?.[formListName],
                        index: editCaptureSection ?? null,
                      });
                      form.setFieldsValue({
                        captureSectionFormName: undefined,
                        formListName: [{}],
                      });
                      onCloseCaptureSection();
                    } catch (err) {
                      console.error("Validation failed", err);
                    }
                  }}
                >
                  Save Section
                </Button>
              </div>
            </>
          )}
        </Form.List>
      </>
    );
  },
);

SectionListForm.displayName = "SectionList";

export default SectionListForm;
