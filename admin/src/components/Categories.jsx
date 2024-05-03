import {
  Space,
  Table,
  Pagination,
  Button,
  Input,
  Popconfirm,
  Form,
  Image,
} from "antd";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  getPagingCategory,
  searchCategory,
  createCategory,
  deleteCategory,
  editCategory,
} from "../services/category";
import toast from "react-hot-toast";
import { TiDelete } from "react-icons/ti";
import ModalCreateCategories from "./ModalCreateCategories";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDoc, setTotalDoc] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [modalCreateCategory, setModalCreateCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(false);

  const handleOpenEditModal = (categoryId) => {
    setModalCreateCategory(true);
    setSelectedCategory(categoryId);
  };

  const handelCloseModal = () => {
    form.resetFields();
    setModalCreateCategory(false);
    setSelectedCategory(null);
  };

  const columns = [
    { title: "SL", dataIndex: "stt", key: "stt" },
    { title: "Category name", dataIndex: "name", key: "name" },
    { title: "Slug", dataIndex: "slug", key: "slug" },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (row) => <Image width={120} src={row} />,
    },
    { title: "Created Date", dataIndex: "createdAt", key: "createdAt" },
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
            title="Delete category"
            description="Are you sure to delete this category?"
            onConfirm={() => handleDeleteCategory(row._id)}
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
  const getCategories = async () => {
    try {
      setLoading(true);
      const result = await getPagingCategory({ pageSize, pageIndex });

      const updatedCategories = result.data.categories.map(
        (category, index) => {
          return {
            ...category,
            stt: index + 1 + pageSize * (pageIndex - 1),
            createdAt: category.createdAt,
          };
        }
      );
      setCategories(updatedCategories);
      setInitialData(updatedCategories);
      setTotalPages(result.data.totalPages);
      setTotalDoc(result.data.count);
    } catch (error) {
      console.log(totalPages);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = async () => {
    try {
      setLoading(true);
      let searchResults = [];
      if (searchQuery.trim() !== "") {
        const response = await searchCategory(searchQuery);
        // searchResults = response.data.categories;
        searchResults = response.data.categories.map((category, index) => ({
          ...category,
          stt: index + 1,
        }));
      }
      setSearchResults(searchResults);
    } catch (error) {
      toast.error("Category not found!");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setCategories(initialData);
  };

  const handleCreateCategory = async (values, file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("image", file);

      let result;
      if (!selectedCategory) {
        const result = await createCategory(formData);
        const newCategory = result.data.data;

        const updatedCategories = [newCategory, ...categories].map(
          (category, index) => ({
            ...category,
            stt: index + 1,
          })
        );
        setCategories(updatedCategories);
        toast.success("Created successfully!");
      } else {
        result = await editCategory(selectedCategory, formData);
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category._id === selectedCategory
              ? {
                  ...category,
                  name: result.data.category.name,
                  image: result.data.category.image,
                  slug: result.data.category.slug,
                }
              : category
          )
        );
        toast.success("Updated successfully!");
        setSelectedCategory(null);
      }
      handleClearSearch();
      getCategories();
      setModalCreateCategory(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
      toast.error(selectedCategory ? "Update failed" : "Create failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      setLoading(true);
      await deleteCategory(categoryId);
      // setCategories(
      //   categories.filter((category) => category._id !== categoryId)
      // );
      // Tìm vị trí của sản phẩm trong danh sách search
      const index = searchResults.findIndex(
        (category) => category._id === categoryId
      );
      if (index !== -1) {
        // Xóa sản phẩm khỏi danh sách search và cập nhật lại số thứ tự
        setSearchResults((prevResults) =>
          prevResults
            .filter((category) => category._id !== categoryId)
            .map((category, index) => ({
              ...category,
              stt: index + 1,
            }))
        );
      }

      // Tìm vị trí của danh muc trong danh sách gốc
      const originalIndex = categories.findIndex(
        (category) => category._id === categoryId
      );
      if (originalIndex !== -1) {
        // Xóa danh muc khỏi danh sách gốc và cập nhật lại số thứ tự
        setCategories((prevCategories) =>
          prevCategories
            .filter((category) => category._id !== categoryId)
            .map((category, index) => ({
              ...category,
              stt: index + 1,
            }))
        );
      }

      toast.success("Successfully deleted category!");
      handleClearSearch();
      getCategories();
    } catch (error) {
      toast.error("Failed to delete category!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageIndex]);

  return (
    <div className="h-[37.45rem]">
      <div className="flex justify-between items-center px-2 pb-4 pr-4 pl-4 pt-0 ">
        <h1 className="text-gray-500 text-xl">Explore our menu</h1>
        <Space.Compact className="w-[35rem] relative">
          <Input
            placeholder="Enter the search keyword as slug....."
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
        <Button type="primary" onClick={() => setModalCreateCategory(true)}>
          Create Category
        </Button>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={searchResults.length > 0 ? searchResults : categories}
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
      <ModalCreateCategories
        form={form}
        loading={loading}
        title={selectedCategory ? "Edit Category" : "Create Category"}
        isModalOpen={modalCreateCategory}
        handleCancel={handelCloseModal}
        handleOk={handleCreateCategory}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};
export default Categories;
