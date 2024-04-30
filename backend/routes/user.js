import express from "express"
import { signUp, getPagingUser, login, editUser, changePassword, deleteUser, createUser, getUserById, getAllUser, getPagingAdmin, searchUser, getUserProfile, searchAdmin, getAgeUser } from "../controllers/user.js"
import authentication from "../middlewares/authentication.js"

const router = express.Router()
router.get("/get-user-profile", authentication, getUserProfile)
router.get("/getAgeUser", authentication, getAgeUser)
router.post("/create-user", authentication, createUser)
router.get("/get-paging-user", authentication, getPagingUser)
router.get("/get-paging-admin", authentication, getPagingAdmin)
router.get("/:id", authentication, getUserById)
router.post("/signup", signUp)
router.post("/login", login)
router.put("/:id", authentication, editUser)
router.put("/change-password/:id", authentication, changePassword)
router.delete("/:id", deleteUser)
router.get("/", authentication, getAllUser)
router.post("/search-user", authentication, searchUser)
router.post("/search-admin", authentication, searchAdmin)



export default router