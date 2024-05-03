import React, { useEffect, useState } from "react";
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
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import {
  getPagingProduct,
  searchProduct,
  createProduct,
  deleteProduct,
  editProduct,
} from "../services/product";
import toast from "react-hot-toast";
import ModalCreateProducts from "./ModalCreateProducts";
function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDoc, setTotalDoc] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [modalCreateProduct, setModalCreateProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(false);

  const handleOpenEditModal = (productId) => {
    setModalCreateProduct(true);
    setSelectedProduct(productId);
  };

  const handelCloseModal = () => {
    form.resetFields();
    setModalCreateProduct(false);
    setSelectedProduct(null);
  };

  const columns = [
    { title: "SL", dataIndex: "stt", key: "stt" },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (row) => <Image width={120} src={row} />,
    },
    { title: "Product name", dataIndex: "name", key: "name" },
    { title: "Slug", dataIndex: "slug", key: "slug" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Category", dataIndex: "categoryName", key: "categoryName" },
    { title: "Created Date", dataIndex: "createdAt", key: "createdAt" },
    { title: "Status", dataIndex: "status", key: "status" },
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
            title="Delete Product"
            description="Are you sure to delete this product?"
            onConfirm={() => handleDeleteProduct(row._id)}
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

  const getProducts = async () => {
    try {
      setLoading(true);
      const result = await getPagingProduct({ pageSize, pageIndex });
      const updatedProducts = result.data.products.map((product, index) => {
        return {
          ...product,
          stt: index + 1 + pageSize * (pageIndex - 1),
          createdAt: product.createdAt,
        };
      });
      setProducts(updatedProducts);
      setInitialData(updatedProducts);
      setTotalPages(result.data.totalPages);
      setTotalDoc(result.data.count);
    } catch (error) {
      console.log(totalPages);
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      let searchResults = [];
      if (searchQuery.trim() !== "") {
        const response = await searchProduct(searchQuery);
        // searchResults = response.data.products;
        searchResults = response.data.products.map((product, index) => ({
          ...product,
          stt: index + 1,
        }));
      }
      setSearchResults(searchResults);
    } catch (error) {
      toast.error("Product not found!");
    } finally {
      setLoading(false);
    }
  };
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setProducts(initialData);
  };

  const handleCreateProduct = async (values, file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("categoryId", values.categoryId);
      formData.append("status", values.status);
      formData.append("description", values.description);
      formData.append("image", file);

      let result;
      if (!selectedProduct) {
        const result = await createProduct(formData);
        const newProduct = result.data.data;
        // Thêm sản phẩm mới vào đầu danh sách và cập nhật số thứ tự
        const updatedProducts = [newProduct, ...products].map(
          (product, index) => ({
            ...product,
            stt: index + 1,
          })
        );
        setProducts(updatedProducts);
        toast.success("Created successfully!");
      } else {
        result = await editProduct(selectedProduct, formData);
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === selectedProduct
              ? {
                  ...product,
                  name: result.data.product.name,
                  slug: result.data.product.slug,
                  price: result.data.product.price,
                  categoryId: result.data.product.categoryId,
                  categoryName: result.data.product.categoryName,
                  status: result.data.product.status,
                  description: result.data.product.description,
                  image: result.data.product.image,
                }
              : product
          )
        );
        toast.success("Updated successfully!");
        setSelectedProduct(null);
      }
      handleClearSearch();
      getProducts();
      setModalCreateProduct(false);
      form.resetFields();
    } catch (error) {
      toast.error(selectedProduct ? "Update failed!" : "Create failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setLoading(true);
      await deleteProduct(productId);
      // Tìm vị trí của sản phẩm trong danh sách search
      const index = searchResults.findIndex(
        (product) => product._id === productId
      );
      if (index !== -1) {
        // Xóa sản phẩm khỏi danh sách search và cập nhật lại số thứ tự
        setSearchResults((prevResults) =>
          prevResults
            .filter((product) => product._id !== productId)
            .map((product, index) => ({
              ...product,
              stt: index + 1,
            }))
        );
      }

      // Tìm vị trí của sản phẩm trong danh sách gốc
      const originalIndex = products.findIndex(
        (product) => product._id === productId
      );
      if (originalIndex !== -1) {
        // Xóa sản phẩm khỏi danh sách gốc và cập nhật lại số thứ tự
        setProducts((prevProducts) =>
          prevProducts
            .filter((product) => product._id !== productId)
            .map((product, index) => ({
              ...product,
              stt: index + 1,
            }))
        );
      }
      toast.success("Successfully deleted product!");
      handleClearSearch();
      getProducts();
    } catch (error) {
      toast.error("Failed to delete product!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageIndex]);
  return (
    <div className="h-[37.45rem]">
      <div className="flex justify-between items-center px-2 pb-4 pr-4 pl-4 pt-0 ">
        <h1 className="text-gray-500 text-xl">Food List</h1>
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
        <Button type="primary" onClick={() => setModalCreateProduct(true)}>
          Create Product
        </Button>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={searchResults.length > 0 ? searchResults : products}
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
      <ModalCreateProducts
        form={form}
        loading={loading}
        title={selectedProduct ? "Edit Product" : "Create Product"}
        isModalOpen={modalCreateProduct}
        handleCancel={handelCloseModal}
        handleOk={handleCreateProduct}
        selectedProduct={selectedProduct}
      />
    </div>
  );
}

export default Products;
