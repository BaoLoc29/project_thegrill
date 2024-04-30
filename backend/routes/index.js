import express from "express";
import userRouter from "./user.js"
import categoryRouter from "./category.js"
const router = express.Router()
router.use("/user", userRouter)
router.use("/category", categoryRouter)

export default router