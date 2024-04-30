import React, { useState, useEffect, useRef } from "react";
import { FaLock } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { getUserProfile, editUser, changePassword } from "../services/user";
import { Form, Input } from "antd";
import { toast } from "react-hot-toast";
const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState("info");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const initialValuesRef = useRef(null);
  const [form] = Form.useForm();
  const handleButtonClick = (button) => {
    setActiveButton(button === "info" ? "info" : "password");
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await getUserProfile();
        setUserProfile(result.data.user);
        form.setFieldsValue({
          name: result.data.user.name,
          email: result.data.user.email,
          age: result.data.user.age,
          phoneNumber: result.data.user.phoneNumber,
          address: result.data.user.address,
        });
        setUserEmail(result.data.user.email);
        setUserName(result.data.user.name);
        if (!initialValuesRef.current) {
          // Chỉ lưu giá trị ban đầu một lần
          initialValuesRef.current = result.data.user;
        }
      } catch (error) {
        console.error("User cannot be found!", error);
      }
    };

    getUser();
  }, [form]);

  const handleEditUser = async (values) => {
    try {
      setLoading(true);
      const result = await editUser(userProfile._id, values);
      setUserProfile(result.data.user);
      setUserEmail(result.data.user.email);
      setUserName(result.data.user.name);
      toast.success("Updated user successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Updated user failed");
    } finally {
      setLoading(false);
    }
  };
  const handleCancelEdit = () => {
    form.setFieldsValue(initialValuesRef.current);
  };

  // change password
  const handleChangePassword = async (oldPassword, newPassword) => {
    try {
      setLoading(true);
      const result = await changePassword(
        userProfile._id,
        oldPassword,
        newPassword
      );
      setUserProfile(result.data.user);
      toast.success("Password changed successfully!");
      form.resetFields();
    } catch (error) {
      toast.error("Password change failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelChangePassword = () => {
    form.resetFields();
  };
  return (
    <div className="h-screen">
      <div className="flex flex-row gap-5 w-full">
        <div className="w-[18rem] h-[22rem] rounded-sm flex flex-col">
          <div className="flex gap-3 items-center">
            <img
              src="https://iconape.com/wp-content/png_logo_vector/user-circle.png"
              alt="avatar"
              width={100}
              className="rounded-md"
            />
            <div>
              <span className="text-xl font-bold text-black">{userName}</span>
              <br />
              <span className="text-lg text-gray-700">{userEmail}</span>
            </div>
          </div>

          <div className="pt-5 space-y-4">
            <button
              className={`flex items-center gap-2 pl-3 w-full h-[2.5rem] text-white text-16 ${
                activeButton === "info"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-500 hover:bg-gray-600"
              }`}
              onClick={() => handleButtonClick("info")}
            >
              <IoSettings />
              Personal info
            </button>
            <button
              className={`flex items-center gap-2 pl-3 w-full h-[2.5rem] text-white text-16 ${
                activeButton === "password"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-500 hover:bg-gray-600"
              }`}
              onClick={() => handleButtonClick("password")}
            >
              <FaLock />
              Change Password
            </button>
          </div>
        </div>
        <div
          className={`info px-4 rounded-sm flex flex-col flex-1 ${activeButton === "info" ? "" : "hidden"}`}
        >
          <Form form={form} name="userInfo" onFinish={handleEditUser}>
            <label htmlFor="name" className="block text-base font-bold">
              Name *
            </label>
            <Form.Item
              name="name"
              style={{ marginTop: 10 }}
              rules={[
                {
                  type: "text",
                  message: "Username is not in the correct format!",
                },
                {
                  required: true,
                  message: "Username cannot be empty!",
                },
              ]}
            >
              <Input className="h-[2.75rem] text-base" />
            </Form.Item>

            <label htmlFor="email" className="block text-base font-bold">
              Email *
            </label>
            <Form.Item
              name="email"
              style={{ marginTop: 10 }}
              rules={[
                {
                  type: "text",
                  message: "User email is not in correct format!",
                },
                {
                  required: true,
                  message: "Email cannot be empty!",
                },
              ]}
            >
              <Input className="h-[2.75rem] text-base" disabled />
            </Form.Item>

            <label htmlFor="age" className="block text-base font-bold">
              Age *
            </label>
            <Form.Item
              name="age"
              style={{ marginTop: 10 }}
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
              <Input className="h-[2.75rem] text-base" />
            </Form.Item>

            <label htmlFor="phoneNumber" className="block text-base font-bold">
              Phone *
            </label>
            <Form.Item
              name="phoneNumber"
              style={{ marginTop: 10 }}
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
              <Input className="h-[2.75rem] text-base" />
            </Form.Item>

            <label htmlFor="address" className="block text-base font-bold">
              Address *
            </label>
            <Form.Item
              name="address"
              style={{ marginTop: 10 }}
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
              <Input className="h-[2.75rem] text-base" />
            </Form.Item>

            <div className="w-1/3 flex justify-between">
              <button
                loading={loading}
                htmlType="submit"
                className="w-[15rem] h-[2.75rem] mr-2 bg-green-500 hover:bg-green-600 text-white text-base font-bold rounded-sm"
              >
                Save changes
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-[10rem] h-[2.75rem] bg-gray-500 text-white text-base font-bold hover:bg-gray-600 rounded-sm"
              >
                Cancel
              </button>
            </div>
          </Form>
        </div>
        <div
          className={`password px-4 rounded-sm flex flex-col flex-1 ${activeButton === "password" ? "" : "hidden"}`}
        >
          <Form onFinish={handleChangePassword}>
            <label htmlFor="address" className="block text-base font-bold">
              Old Password *
            </label>
            <Form.Item
              name="oldPassword"
              style={{ marginTop: 10 }}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu trước đây!",
                },
                {
                  min: 6,
                  message: "Mật khử phải chứa ít nhất 6 ký tự!",
                },
              ]}
            >
              <Input.Password className="h-[2.75rem] text-base" />
            </Form.Item>

            <label htmlFor="address" className="block text-base font-bold">
              New Password *
            </label>
            <Form.Item
              name="newPassword"
              style={{ marginTop: 10 }}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please enter new password!",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters!",
                },
              ]}
            >
              <Input.Password className="h-[2.75rem] text-base" />
            </Form.Item>

            <label htmlFor="address" className="block text-base font-bold">
              Re-type New Password *
            </label>
            <Form.Item
              name="confirmPassword"
              style={{ marginTop: 10 }}
              dependencies={["newPassword"]}
              hasFeedback
              rules={[
                {
                  min: 6,
                  message: "Password must be at least 6 characters!",
                },
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Passwords do not match, please check again!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password className="h-[2.75rem] text-base" />
            </Form.Item>

            <div className="w-1/3 flex justify-between">
              <button
                htmlType="submit"
                className="w-[15rem] h-[2.75rem] mr-2 bg-green-500 hover:bg-green-600 text-white text-base font-bold rounded-sm"
              >
                Save changes
              </button>

              <button
                onClick={handleCancelChangePassword}
                className="w-[10rem] h-[2.75rem] bg-gray-500 text-white text-base font-bold hover:bg-gray-600 rounded-sm"
              >
                Cancel
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
