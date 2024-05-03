import { axiosInstanceAuth } from "./index";

const getPagingCategory = ({ pageSize, pageIndex }) => {
    return axiosInstanceAuth.get(`/category/get-paging-category?pageSize=${pageSize}&pageIndex=${pageIndex}`);
}
const createCategory = (formData) => {
    return axiosInstanceAuth.post('/category/create-category', formData);
}
const editCategory = (categoryId, formData) => {
    return axiosInstanceAuth.put(`/category/${categoryId}`, formData)
}
const deleteCategory = (categoryId) => {
    return axiosInstanceAuth.delete(`/category/${categoryId}`)
}
const searchCategory = (keyword) => {
    return axiosInstanceAuth.post('/category/search-category', { keyword });
}
const getCategoryById = (categoryId) => {
    return axiosInstanceAuth.get(`/category/${categoryId}`)
}
const getAllCategory = () => {
    return axiosInstanceAuth.get(`/category`)
}
export {
    getPagingCategory,
    getAllCategory,
    createCategory,
    editCategory,
    deleteCategory,
    searchCategory,
    getCategoryById,
}