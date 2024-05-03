import React, { useEffect, useState, useCallback } from "react";
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
import ModalCreateCustomers from "./ModalCreateCustomers/index";
import { toast } from "react-hot-toast";
import {
  createUser,
  getPagingUser,
  deleteUser,
  editUser,
  searchUser,
} from "../services/user";

const Customers = () => {
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
  // const { Option } = Select;

  const options = [
    { value: "name", label: "Name" },
    { value: "email", label: "E-mail" },
  ];
  const handleOpenEditModal = (userId) => {
    setModalCreateUser(true);
    setSelectedUser(userId);
  };

  const handelCloseModal = () => {
    form.resetFields();
    setModalCreateUser(false);
    setSelectedUser(null);
  };

  const columns = [
    { title: "SL", dataIndex: "stt", key: "stt" },
    { title: "UserName", dataIndex: "name", key: "name" },
    { title: "E-mail", dataIndex: "email", key: "email" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Created Date", dataIndex: "createdAt", key: "createdAt" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Action",
      key: "action",
      render: (row) => (
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
      ),
    },
  ];
  const [form] = Form.useForm();
  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getPagingUser({ pageSize, pageIndex });
      const updateCustomer = result.data.users.map((user, index) => {
        return {
          ...user,
          stt: index + 1 + pageSize * (pageIndex - 1),
          createdAt: user.createdAt,
        };
      });
      setUsers(updateCustomer);
      setInitialData(updateCustomer);
      setTotalPages(result.data.totalPages);
      setTotalDoc(result.data.count);
    } catch (error) {
      console.log(totalPages);
      toast.error("Error when getting customers");
    } finally {
      setLoading(false);
    }
  }, [pageSize, pageIndex]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      let searchResults = [];
      if (searchQuery.trim() !== "") {
        const response = await searchUser(searchQuery, selectedOption);
        // searchResults = response.data.customers;
        searchResults = response.data.customers.map((customer, index) => ({
          ...customer,
          stt: index + 1,
        }));
      }
      setSearchResults(searchResults);
    } catch (error) {
      toast.error("Customer not found!");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setUsers(initialData);
  };

  const handleCreateUser = async (value) => {
    try {
      setLoading(true);
      if (!selectedUser) {
        const result = await createUser(value);
        const newUser = result.data;
        const updatedUsers = [newUser, ...users].map((user, index) => ({
          ...user,
          stt: index + 1,
        }));
        setUsers(updatedUsers);
        toast.success("Created customer successfully!");
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
        toast.success("Updated customer successfully!");
        setSelectedUser(null);
      }
      handleClearSearch();
      getUsers();
      setModalCreateUser(false);
      form.resetFields();
    } catch (error) {
      toast.error(
        selectedUser ? "Update customer failed" : "Create customer failed"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      await deleteUser(userId);
      // setUsers(users.filter((user) => user._id !== userId));

      // Tìm vị trí trong danh sách search
      const index = searchResults.findIndex((user) => user._id === userId);
      if (index !== -1) {
        // Xóa khỏi danh sách search và cập nhật lại số thứ tự
        setSearchResults((prevResults) =>
          prevResults
            .filter((user) => user._id !== userId)
            .map((user, index) => ({
              ...user,
              stt: index + 1,
            }))
        );
      }

      // Tìm vị trí của sản phẩm trong danh sách gốc
      const originalIndex = users.findIndex((user) => user._id === userId);
      if (originalIndex !== -1) {
        // Xóa sản phẩm khỏi danh sách gốc và cập nhật lại số thứ tự
        setUsers((prevUsers) =>
          prevUsers
            .filter((user) => user._id !== userId)
            .map((user, index) => ({
              ...user,
              stt: index + 1,
            }))
        );
      }
      handleClearSearch();
      getUsers();
      toast.success("Successfully deleted customer!");
    } catch (error) {
      toast.error("Failed delete customer!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUsers();
  }, [pageSize, pageIndex, getUsers]);

  return (
    <div className="h-[37.45rem]">
      <div className="flex justify-between items-center px-2 pb-4 pr-4 pl-4 pt-0 ">
        <h1 className="text-gray-500 text-xl">Customer List</h1>
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
          Create Customer
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
      <ModalCreateCustomers
        form={form}
        loading={loading}
        title={selectedUser ? "Edit User Information" : "Create User Information"}
        isModalOpen={modalCreateUser}
        handleCancel={handelCloseModal}
        handleOk={handleCreateUser}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default Customers;
