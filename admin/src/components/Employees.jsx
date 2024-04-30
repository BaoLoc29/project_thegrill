import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Pagination,
  Form,
  Button,
  Select,
  Input,
  Popconfirm,
} from "antd";
import { FaEdit } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import ModalCreateAdmins from "./ModalCreateAdmins/index.jsx";
import { toast } from "react-hot-toast";
import {
  createUser,
  getPagingAdmin,
  deleteUser,
  editUser,
  searchAdmin,
} from "../services/user";

const { Option } = Select;
const options = [
  { value: "name", label: "Name" },
  { value: "email", label: "E-mail" },
];
const Employees = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDoc, setTotalDoc] = useState(0);
  const [modalCreateUser, setModalCreateUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("name");
  const [searchResults, setSearchResults] = useState([]);
  const [initialData, setInitialData] = useState([]);

  const handleOpenEditModal = (userId) => {
    setModalCreateUser(true);
    setSelectedUser(userId);
  };

  const handelCloseModal = () => {
    form.resetFields();
    setModalCreateUser(false);
    setSelectedUser(null);
  };
  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      const result = await deleteUser(userId);
      console.log(result);
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("Deleted user successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Delete user failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      let searchResults = [];
      if (searchQuery.trim() !== "") {
        const response = await searchAdmin(searchQuery, selectedOption);
        searchResults = response.data.admins;
      }
      setSearchResults(searchResults);
    } catch (error) {
      toast.error("User not found!");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setUsers(initialData);
  };
  const columns = [
    {
      title: "UserName",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Action",
      key: "action",
      render: (row) => {
        return (
          <div className="flex gap-2">
            <FaEdit
              className="text-blue-500 text-2xl hover:text-blue-700 cursor-pointer"
              onClick={() => handleOpenEditModal(row._id)}
            />
            <Popconfirm
              title="Delete User?"
              description="Are you sure to delete this user?"
              onConfirm={() => handleDeleteUser(row._id)}
              okText="Agree"
              cancelText="Cancel"
              style={{ cursor: "pointer" }}
            >
              <MdDelete className="text-red-500 text-2xl hover:text-red-700 cursor-pointer" />
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const [form] = Form.useForm();

  const getUsers = async () => {
    try {
      setLoading(true);
      const result = await getPagingAdmin({ pageSize, pageIndex });
      setUsers(result.data.admins);
      setInitialData(result.data.admins);
      setTotalPages(result.data.totalPage);
      setTotalDoc(result.data.count);
    } catch (error) {
      toast.error("No response was received from the user list!");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (value) => {
    try {
      setLoading(true);
      if (!selectedUser) {
        const result = await createUser(value);
        let newUser = users;
        newUser.pop();
        setUsers([result.data.result, ...users]);
        toast.success("Added new user successfully!");
      } else {
        const result = await editUser(selectedUser, value);
        setUsers(
          users.map((user) => {
            if (user._id === selectedUser) {
              return result.data.user;
            }
            return user;
          })
        );
        toast.success("Updated new user successfully!");
        setSelectedUser(null);
      }
      setModalCreateUser(false);
      form.resetFields();
    } catch (error) {
      console.log(error);
      toast.error(
        selectedUser ? "Update new users failed" : "Add new users failed"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [pageSize, pageIndex]);

  return (
    <div className="h-[37.45rem]">
      <div className="flex justify-between items-center px-2 pb-4 pr-4 pl-4 pt-0 ">
        <h1 className="text-gray-500 text-xl">Admin List</h1>
        <Space.Compact className="w-[35rem] relative">
          <Select
            defaultValue="name"
            options={options}
            className="w-[10rem]"
            onChange={(value) => setSelectedOption(value)}
          />
          <Input
            placeholder="Enter search keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onPressEnter={handleSearch}
          />
          {searchQuery && (
            <TiDelete
              className="text-gray-400 text-xl absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer z-10"
              onClick={handleClearSearch}
            />
          )}
        </Space.Compact>

        <Button type="primary" onClick={() => setModalCreateUser(true)}>
          Add Admin
        </Button>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={searchResults.length > 0 ? searchResults : users}
        pagination={false}
      />
      <Pagination
        className="my-5 float-right"
        defaultCurrent={1}
        current={pageIndex}
        total={totalDoc}
        pageSize={pageSize}
        showSizeChanger
        onChange={(pageIndex, pageSize) => {
          setPageSize(pageSize);
          setPageIndex(pageIndex);
        }}
      />
      <ModalCreateAdmins
        form={form}
        loading={loading}
        title={selectedUser ? "Edit Admin Information" : "Add Admin Information"}
        isModalOpen={modalCreateUser}
        handleCancel={handelCloseModal}
        handleOk={handleCreateUser}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default Employees;
