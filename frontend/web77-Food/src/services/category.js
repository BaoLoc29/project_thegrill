import { axiosInstance } from "./index";

const getAllCategory = () => {
    return axiosInstance.get(`/category/`)
}
export {
    getAllCategory,
}