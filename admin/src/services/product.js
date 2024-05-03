import { axiosInstanceAuth } from "./index";

const getPagingProduct = ({ pageSize, pageIndex }) => {
    return axiosInstanceAuth.get(`/product/get-paging-product?pageSize=${pageSize}&pageIndex=${pageIndex}`);
}
const createProduct = (formData) => {
    return axiosInstanceAuth.post('/product/create-product', formData);
}
const editProduct = (productId, formData) => {
    return axiosInstanceAuth.put(`/product/${productId}`, formData)
}
const deleteProduct = (productId) => {
    return axiosInstanceAuth.delete(`/product/${productId}`)
}
const searchProduct = (keyword) => {
    return axiosInstanceAuth.post('/product/search-product', { keyword });
}
const getProductById = (productId) => {
    return axiosInstanceAuth.get(`/product/${productId}`)
}
const getAllProduct = () => {
    return axiosInstanceAuth.get("/product/get-all-product");
}

export {
    getPagingProduct,
    createProduct,
    editProduct,
    deleteProduct,
    searchProduct,
    getProductById,
    getAllProduct
}