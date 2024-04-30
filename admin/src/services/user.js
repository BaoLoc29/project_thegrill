import { axiosInstance, axiosInstanceAuth } from "./index";

const login = ({ email, password }) => {
    return axiosInstance.post("/user/login", { email, password })
}

const getPagingUser = ({ pageSize, pageIndex }) => {
    return axiosInstanceAuth.get(`/user/get-paging-user?pageSize=${pageSize}&pageIndex=${pageIndex}`);
}
const getPagingAdmin = ({ pageSize, pageIndex }) => {
    return axiosInstanceAuth.get(`/user/get-paging-admin?pageSize=${pageSize}&pageIndex=${pageIndex}`);
}
const createUser = (data) => {
    return axiosInstanceAuth.post('/user/create-user', data);
}
const getUserById = (userId) => {
    return axiosInstanceAuth.get(`/user/${userId}`)
}
const editUser = (userId, data) => {
    return axiosInstanceAuth.put(`/user/${userId}`, data)
}
const deleteUser = (userId) => {
    return axiosInstanceAuth.delete(`/user/${userId}`)
}
const getAllUser = () => {
    return axiosInstanceAuth.get('/user')
}
const searchUser = (keyword, option) => {
    return axiosInstanceAuth.post('/user/search-user', { keyword, option });
}
const searchAdmin = (keyword, option) => {
    return axiosInstanceAuth.post('/user/search-admin', { keyword, option });
}
const getUserProfile = () => {
    return axiosInstanceAuth.get('/user/get-user-profile')
}
const changePassword = (userId, oldPassword, newPassword) => {
    return axiosInstanceAuth.put(`/user/change-password/${userId}`, oldPassword, newPassword)
}
const getAgeUser = () => {
    return axiosInstanceAuth.get('user/getAgeUser')
}
export {
    login,
    getPagingUser,
    getPagingAdmin,
    createUser,
    getUserById,
    editUser,
    deleteUser,
    getAllUser,
    searchUser,
    searchAdmin,
    getUserProfile,
    changePassword,
    getAgeUser
}