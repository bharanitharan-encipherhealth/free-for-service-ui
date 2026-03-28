import { CreateUserResponseType } from "@/models/tenantadmin/users";
import { CreateIdGens, formValidate, getResponePopup } from "@/util/reusableFunction";
import { Drawer, Form, Input, Select, Button } from "antd";
import React, { useCallback } from "react";
import { IoClose } from "react-icons/io5";

interface AddUserProps {
  openAddUser: boolean;
  handleCloseModal: () => void;
  roles: { value: string; label: string }[];
  createUser: (data: { data: any }) => Promise<CreateUserResponseType>;
  addUserLoading: boolean;
  getUsersAPi: () => void;
}

const AddUser = React.memo(
  ({
    openAddUser,
    handleCloseModal,
    roles,
    createUser,
    addUserLoading,
    getUsersAPi,
  }: AddUserProps) => {
    const [form] = Form.useForm();

    const onFinish = useCallback(
      async (values: {
        firstName: string;
        lastName: string;
        email: string;
        role: string[];
      }) => {
        const payload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          roleNames: values.role,
        };

        const res = await createUser({ data: payload });
        if (res?.status === "SUCCESS") {
          getResponePopup(res);
          getUsersAPi();
          handleCloseModal();
          form.resetFields();
        } else {
          getResponePopup(res);
        }
      },
      [createUser, getUsersAPi, handleCloseModal, form],
    );

    return (
      <Drawer
        open={openAddUser}
        onClose={handleCloseModal}
        title={"Add User"}
        destroyOnClose
        closable={false}
        extra={<IoClose className="cursor-pointer" size={20} onClick={handleCloseModal} />}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="firstName"
            label={
              <label className="font-semibold">
                First Name <span className="text-red-500">*</span>
              </label>
            }
            rules={[
              {
                required: true,
                message: "Please Enter The First Name",
              },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();

                  const isValid = formValidate({
                    value,
                    valueType: "allowAlphabet",
                  });

                  if (!isValid) {
                    return Promise.reject("Special Character is not Allowed");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Enter the First Name" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label={
              <label className="font-semibold">
                Last Name <span className="text-red-500">*</span>
              </label>
            }
            rules={[
              {
                required: true,
                message: "Please Enter The Last Name",
              },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();

                  const isValid = formValidate({
                    value,
                    valueType: "allowAlphabet",
                  });

                  if (!isValid) {
                    return Promise.reject("Special Character is not Allowed");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Enter the Last Name" />
          </Form.Item>

          <Form.Item
            name="email"
            label={
              <label className="font-semibold">
                Email <span className="text-red-500">*</span>
              </label>
            }
            rules={[
              {
                required: true,
                message: "Please Enter The Email",
              },
              {
                type: "email",
                message: "Please Enter a valid Email address",
              },
            ]}
          >
            <Input placeholder="Enter the Email" />
          </Form.Item>

          <Form.Item
            name="role"
            label={
              <label className="font-semibold">
                Role <span className="text-red-500">*</span>
              </label>
            }
            rules={[
              {
                required: true,
                message: "Please Select The Role",
              },
            ]}
          >
            <Select mode="multiple" options={roles} allowClear placeholder="Select Roles" />
          </Form.Item>

          <Form.Item className="flex justify-center w-full mt-4">
            <Button
              className="btnColor"
              onClick={() => form.submit()}
              loading={addUserLoading}
              disabled={addUserLoading}
              data-testid={CreateIdGens("submitBtn")}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    );
  },
);

AddUser.displayName = "AddUser";

export default AddUser;


