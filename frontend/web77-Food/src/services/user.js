import { axiosInstance } from "./index";

const login = ({ email, password }) => {
    return axiosInstance.post("/user/login", { email, password })
}

const signUp = ({ name, email, password, age, phoneNumber, address }) => {
    return axiosInstance.post("/user/signup", {
        name,
        email,
        password,
        age,
        phoneNumber,
        address,
    })
}

export {
    login,
    signUp
}