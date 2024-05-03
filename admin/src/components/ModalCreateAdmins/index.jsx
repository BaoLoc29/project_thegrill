import React, { useEffect } from "react";
import { Form, Input, Modal, Select, Button } from "antd";
import { getUserById } from "../../services/user";
const ModalCreateAdmins = ({
  form,
  loading,
  title,
  isModalOpen,
  handleCancel,
  handleOk,
  selectedUser,
}) => {
  const getUser = async () => {
    try {
      const result = await getUserById(selectedUser);
      form.setFieldsValue({
        name: result.data.user.name,
        email: result.data.user.email,
        role: result.data.user.role,
        age: result.data.user.age,
        phoneNumber: result.data.user.phoneNumber,
        address: result.data.user.address,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (selectedUser) getUser();
  }, [selectedUser, form]);
  return (
    <Modal
      title={null}
      open={isModalOpen}
      footer={null}
      loading={loading}
      onCancel={handleCancel}
      width={600}
    >
      <div className="text-center text-xl font-bold">
        <h2>{title}</h2>
      </div>
      <Form
        form={form}
        name="Admin"
        onFinish={handleOk}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{
          minWidth: 400,
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          style={{
            marginTop: 20,
            marginBottom: 10,
          }}
          rules={[
            {
              type: "text",
              message: "Invalid format for user name!",
            },
            {
              required: true,
              message: "User name cannot be empty!",
            },
          ]}
        >
          <Input placeholder="User name" className="text-base" />
        </Form.Item>

        <Form.Item
          label="E-mail"
          name="email"
          style={{
            marginBottom: 10,
          }}
          rules={[
            {
              type: "email",
              message: "Invalid format for email!",
            },
            {
              required: true,
              message: "Email cannot be empty!",
            },
          ]}
        >
          <Input placeholder="E-mail" disabled={selectedUser ? true : false} />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          style={{
            marginBottom: 10,
          }}
          rules={[
            {
              type: "text",
              message: "Please select a role!",
            },
            {
              required: true,
              message: "Please select a role!",
            },
          ]}
        >
          <Select placeholder="--Select role--">
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Age"
          name="age"
          style={{
            marginBottom: 10,
          }}
          rules={[
            {
              type: "text",
              message: "Invalid format for age!",
            },
            {
              required: true,
              message: "Age cannot be empty!",
            },
          ]}
        >
          <Input placeholder="Age" type="number" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phoneNumber"
          style={{
            marginBottom: 10,
          }}
          rules={[
            {
              type: "text",
              message: "Invalid format for phone number!",
            },
            {
              min: 10,
              message: "Phone number must be at least 10 digits!",
            },
            {
              max: 10,
              message: "Phone number must be at most 10 digits!",
            },
            {
              required: true,
              message: "Phone number cannot be empty!",
            },
          ]}
        >
          <Input placeholder="Phone number" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          style={{
            marginBottom: 10,
          }}
          rules={[
            {
              type: "text",
              message: "Invalid format for address!",
            },
            {
              required: true,
              message: "Address cannot be empty!",
            },
          ]}
        >
          <Input placeholder="Address" />
        </Form.Item>
        {!selectedUser && (
          <Form.Item
            label="Password"
            name="password"
            style={{
              marginBottom: 10,
            }}
            rules={[
              {
                required: true,
                message: "Password cannot be empty!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters!",
              },
              {
                type: "password",
                message: "Invalid format for password",
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
        )}
        {!selectedUser && (
          <Form.Item
            label="Confirm Password"
            name="confirm"
            style={{
              marginBottom: 20,
            }}
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Passwords do not match, please check again!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Passwords do not match, please check again!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm password" />
          </Form.Item>
        )}
        <div className="flex justify-end">
          <Button onClick={handleCancel} className="mr-2 mb-2">
            Cancel
          </Button>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            className=" mb-2"
          >
            {selectedUser ? "Update admin" : "Add new admin"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalCreateAdmins;
