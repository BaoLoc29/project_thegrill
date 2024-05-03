import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Modal,
  Button,
  Upload,
  Select,
  Image,
  message,
} from "antd";

import { UploadOutlined } from "@ant-design/icons";
import { getProductById } from "../../services/product";
import { getAllCategory } from "../../services/category";
const ModalCreateProducts = ({
  form,
  loading,
  title,
  isModalOpen,
  handleCancel,
  handleOk,
  selectedProduct,
}) => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [categories, setCategories] = useState([]);
  const { TextArea } = Input;
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory();
        if (response.status === 200) {
          const categoryData = response.data.result;
          setCategories(categoryData);
        } else {
          console.error("Error fetching categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    const getProduct = async () => {
      try {
        const result = await getProductById(selectedProduct);
        form.setFieldsValue({
          name: result.data.product.name,
          image: result.data.product.image,
          price: result.data.product.price,
          description: result.data.product.description,
          categoryId: result.data.product.categoryId,
          status: result.data.product.status,
        });
        setImageUrl(result.data.product.image);
      } catch (error) {
        console.error(error);
      }
    };
    if (selectedProduct) {
      getProduct();
    }
  }, [selectedProduct, form]);

  const onFinish = async (values) => {
    try {
      await handleOk(values, file);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error(
        selectedProduct
          ? "Update product failed!"
          : "Create product failed!"
      );
    }
  };

  return (
    <Modal
      title={null}
      open={isModalOpen}
      footer={null}
      confirmLoading={loading}
      onCancel={handleCancel}
      width={600}
      style={{ top: 20 }}
    >
      <div className="text-center text-xl font-bold">
        <h2>{title}</h2>
      </div>
      <Form
        form={form}
        name="Product"
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ minWidth: 400 }}
      >
        <Form.Item
          label="Name"
          name="name"
          style={{ marginTop: 20, marginBottom: 10 }}
          rules={[
            {
              required: true,
              message: "Product name is not empty!",
            },
          ]}
        >
          <Input placeholder="Product name" className="text-base" />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          style={{ marginTop: 20, marginBottom: 10 }}
          rules={[
            {
              required: true,
              message: "Price is not empty!",
            },
          ]}
        >
          <Input placeholder="Price" className="text-base" type="number" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="categoryId"
          style={{ marginTop: 20, marginBottom: 10 }}
          rules={[
            {
              required: true,
              message: "Category is not empty!",
            },
          ]}
        >
          <Select placeholder="--Select Category--">
            {categories.map((category) => (
              <Select.Option key={category._id} value={category._id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          style={{ marginTop: 20, marginBottom: 10 }}
          rules={[
            {
              required: true,
              message: "Status is not empty!",
            },
          ]}
        >
          <Select placeholder="--Select status--">
            <Select.Option value="Out of stock">Out of stock</Select.Option>
            <Select.Option value="In stock">In stock</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          style={{ marginTop: 20, marginBottom: 10 }}
          rules={[
            {
              required: true,
              message: "Description is not empty!",
            },
          ]}
        >
          <TextArea
            showCount
            maxLength={100}
            onChange={(e) => console.log(e.target.value)}
            placeholder="Description"
            style={{
              height: 70,
              resize: "none",
            }}
          />
        </Form.Item>

        <Form.Item
          label="Image"
          name="image"
          style={{ marginTop: 20, marginBottom: 10 }}
          rules={[
            {
              required: true,
              message: "Image is not empty!",
            },
          ]}
        >
          <Upload
            name="image"
            beforeUpload={() => false}
            maxCount={1}
            listType="picture"
            accept="image/*"
            onChange={(value) => {
              setFile(value.fileList[0]?.originFileObj);
            }}
          >
            <Button icon={<UploadOutlined />}>Click to upload image</Button>
          </Upload>
        </Form.Item>
        {selectedProduct && imageUrl && (
          <div className="text-center mb-4 mt-6 ">
            <Image src={imageUrl} alt="Preview" width={280} />
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleCancel} className="mr-2 mb-2">
            Cancel
          </Button>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            className="mb-2"
          >
            {selectedProduct ? "Edit Product" : "Create Product"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalCreateProducts;
