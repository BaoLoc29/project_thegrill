import { axiosInstance } from "./index";

const getPagingProduct = ({ pageSize, pageIndex }) => {
    return axiosInstance.get(`/product/get-paging-product?pageSize=${pageSize}&pageIndex=${pageIndex}`);
}
const searchProduct = (keyword) => {
    return axiosInstance.post('/product/search-product', { keyword });
}
const getProductById = (productId) => {
    return axiosInstance.get(`/product/${productId}`)
}
const getAllProduct = () => {
    return axiosInstance.get("/product/getAllProduct");
}

export {
    getPagingProduct,
    searchProduct,
    getProductById,
    getAllProduct
}