import express from "express"
import { createCategory, deleteCategory, editCategory, getCategoryById, getPagingCategory, searchCategory } from "../controllers/category.js";
import authentication from "../middlewares/authentication.js"
import upload from "../middlewares/upload.js";

const router = express.Router()
// router.put("/upload-image", authentication, upload.single("image"), uploadCategoryImage)
router.get("/get-paging-category", authentication, getPagingCategory)
router.get("/:id", authentication, getCategoryById)
router.post("/create-category", authentication, upload.single("image"), createCategory)
router.put("/:id", authentication, upload.single("image"), editCategory)
router.delete("/:id", authentication, deleteCategory)
router.post("/search-category", authentication, searchCategory)
export default router