import {
  Space,
  Table,
  Pagination,
  Button,
  Input,
  Popconfirm,
  Form,
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

  const handleDeleteCategory = async (categoryId) => {
    try {
      setLoading(true);
      await deleteCategory(categoryId);
      setCategories(
        categories.filter((category) => category._id !== categoryId)
      );
      toast.success("Successfully deleted category!");
    } catch (error) {
      toast.error("Delete failed category!");
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    { title: "Category name", dataIndex: "name", key: "name" },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (row) => <img width={120} src={row} />,
    },
    { title: "Slug", dataIndex: "slug", key: "slug" },
    // Thêm ở đây
    // { title: "Product Count", dataIndex: "productCount", key: "productCount" },
    // {
    //   title: "Created Date",
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    // },
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

      // Nếu muốn lấy ngày tạo => Customer
      setCategories(result.data.categories);
      setInitialData(result.data.categories);
      setTotalPages(result.data.totalPage);
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
        searchResults = response.data.categories;
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
      if (!selectedCategory) {
        const result = await createCategory(formData);
        let newCategory = categories;
        newCategory.pop();
        setCategories([result.data.data, ...newCategory]);
        toast.success("Added category successfully!");
      } else {
        const result = await editCategory(selectedCategory, formData);
        setCategories(
          categories.map((category) => {
            if (category._id === selectedCategory) {
              return {
                ...category,
                name: result.data.category.name,
                image: result.data.category.image,
                slug: result.data.category.slug,
              };
            }
            return category;
          })
        );
        toast.success("Updated category successfully!");
        setSelectedCategory(null);
      }
      setModalCreateCategory(false);
      form.resetFields();
    } catch (error) {
      console.log(error);
      toast.error(
        selectedCategory ? "Update category failed" : "Add category failed"
      );
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
        <h1 className="text-gray-500 text-xl">Product Categories</h1>
        <Space.Compact className="w-[35rem] relative">
          <Input
            placeholder="Enter the search keyword as slug............."
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
          Add cateogy
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
        title={selectedCategory ? "Edit Category" : "Add Category"}
        isModalOpen={modalCreateCategory}
        handleCancel={handelCloseModal}
        handleOk={handleCreateCategory}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};
export default Categories;
