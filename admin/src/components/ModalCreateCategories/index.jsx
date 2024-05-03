import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Button, Upload, Image, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getCategoryById } from "../../services/category";

const ModalCreateCategories = ({
  form,
  loading,
  title,
  isModalOpen,
  handleCancel,
  handleOk,
  selectedCategory,
}) => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const result = await getCategoryById(selectedCategory);
        form.setFieldsValue({
          name: result.data.category.name,
          image: result.data.category.image,
          slug: result.data.category.slug,
        });
        setImageUrl(result.data.category.image);
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedCategory) {
      getCategory();
    }
  }, [selectedCategory, form]);

  const onFinish = async (values) => {
    try {
      await handleOk(values, file);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error(
        selectedCategory
          ? "Failed to update category"
          : "Failed to create category"
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
    >
      <div className="text-center text-xl font-bold">
        <h2>{title}</h2>
      </div>
      <Form
        form={form}
        name="Category"
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
              message: "Category name is not empty!",
            },
          ]}
        >
          <Input placeholder="Category name" className="text-base" />
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
        {selectedCategory && imageUrl && (
          <div className="text-center">
            <Image src={imageUrl} alt="Preview" width={100} />
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
            {selectedCategory ? "Edit Category" : "Create Category"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalCreateCategories;
