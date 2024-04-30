import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { login } from "../services/user";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  saveTokenToLocalStorage,
  saveUserToLocalStorage,
} from "../utils/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { login as loginAction } from "../feature/user/userSlice";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const naviagate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  console.log(user);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const result = await login(values);
      dispatch(loginAction({ user: result.data.user }));
      saveTokenToLocalStorage(result.data.accessToken);
      saveUserToLocalStorage(result.data.user);
      toast.success("Đăng nhập thành công");
      naviagate("/");
    } catch (error) {
      toast.error("Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div
      className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen md:h-screen lg:py-0"
      style={{
        backgroundImage: `url('https://wallpapers.com/images/hd/food-4k-3gsi5u6kjma5zkj0.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-white dark:border dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-black flex justify-center">
            Sign In
          </h1>
          <Form
            className="space-y-4 md:space-y-6"
            name="basic"
            initialValues={{}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email!",
                },
                {
                  min: 6,
                  message: "Email phải trên 6 ký tự",
                },
              ]}
            >
              <Input
                placeholder="Email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-white dark:border-gray-600 dark:placeholder-gray-400 text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
                {
                  min: 6,
                  message: "Mật khẩu phải từ 6 ký tự trở lên!",
                },
              ]}
            >
              <Input.Password
                placeholder="Password"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 bg-white dark:border-gray-600 dark:placeholder-gray-400 text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </Form.Item>
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    className="cursor-pointer w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="remember"
                    className="cursor-pointer text-gray-500 text-black"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <Link
                to="#"
                className="text-sm font-medium text-black hover:underline dark:text-primary-500"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              className="w-full h-[3rem] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Sign In
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
