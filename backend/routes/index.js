import express from "express";
import userRouter from "./user.js"
import categoryRouter from "./category.js"
import productRouter from "./product.js"
const router = express.Router()
router.use("/user", userRouter)
router.use("/product", productRouter)
router.use("/category", categoryRouter)

export default router