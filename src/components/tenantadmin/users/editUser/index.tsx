import { CreateIdGens } from "@/util/reusableFunction";
import { Drawer, Input, Select, Button, Form } from "antd";
import React, { useEffect } from "react";
import { UserContentType } from "@/models/tenantadmin/users";
import { IoClose } from "react-icons/io5";

interface EditUserProps {
  editingUser: UserContentType | null;
  handleEditUserClose: () => void;
  roles: { value: string; label: string }[];
  aliasName: string;
  selectedRole: string[] | null;
  setSelectedRole: (val: string[] | null) => void;
  handleRoleSubmit: () => void;
  editUsersLoader: boolean;
}

const EditUser = React.memo(
  ({
    editingUser,
    handleEditUserClose,
    roles,
    aliasName,
    selectedRole,
    setSelectedRole,
    handleRoleSubmit,
    editUsersLoader,
  }: EditUserProps) => {
    const [form] = Form.useForm();

    const FIXED_ROLE = editingUser?.currentUser && aliasName ? aliasName : null;

    const updatedRoles = roles?.map((role) => ({
      ...role,
      disabled: role.value === FIXED_ROLE,
    }));

    const handleRoleChange = (value: string[]) => {
      if (FIXED_ROLE && !value.includes(FIXED_ROLE)) {
        value = [FIXED_ROLE, ...value];
      }
      setSelectedRole(value);
    };

    useEffect(() => {
      if (editingUser) {
        form.setFieldsValue({
          email: editingUser.userName,
          patientName:
            editingUser.name ||
            `${editingUser.firstName} ${editingUser.lastName}`,
          role: editingUser.roleNames || [],
        });
      } else {
        form.resetFields();
      }
    }, [editingUser, form]);

    return (
      <Drawer
        open={!!editingUser}
        onClose={handleEditUserClose}
        title="Edit User"
        destroyOnClose
        closable={false}
        extra={
          <IoClose
            className="cursor-pointer"
            size={20}
            onClick={handleEditUserClose}
          />
        }
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleRoleSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="patientName"
            label={
              <label className="font-semibold text-gray-700">
                Patient Name <span className="text-red-500">*</span>
              </label>
            }
          >
            <Input
              disabled
              placeholder="Patient Name"
              data-testid="patientName"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={
              <label className="font-semibold text-gray-700">
                User Email <span className="text-red-500">*</span>
              </label>
            }
          >
            <Input disabled placeholder="User Email" data-testid="email" />
          </Form.Item>

          <Form.Item
            name="role"
            label={<label className="font-semibold text-gray-700">Role</label>}
            rules={[{ required: true, message: "Please Select Roles" }]}
          >
            <Select
              mode="multiple"
              options={updatedRoles}
              placeholder="Select Roles"
              onChange={handleRoleChange}
              data-testid={CreateIdGens("userEdit")}
            />
          </Form.Item>

          <Form.Item className="flex justify-center w-full mt-4">
            <Button
              className="btnColor"
              onClick={() => form.submit()}
              disabled={editUsersLoader}
              data-testid={CreateIdGens("submitBtn")}
            >
              {editUsersLoader ? "Loading..." : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    );
  },
);

EditUser.displayName = "EditUser";

export default EditUser;
