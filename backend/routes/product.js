import express from "express";
import authentication from "../middlewares/authentication.js";
import getCategoryName from "../middlewares/getCategoryName.js";
import { createProduct, getPagingProduct, editProduct, deleteProduct, searchProduct, getProductById, getAllProduct } from "../controllers/product.js";
import upload from "../middlewares/upload.js";

const router = express.Router();
router.get("/", getAllProduct)
router.post("/create-product", authentication, upload.single("image"), getCategoryName, createProduct);
router.put("/:id", authentication, upload.single("image"), getCategoryName, editProduct)
router.get("/get-paging-product", authentication, getPagingProduct)
router.get("/:id", authentication, getProductById)
router.delete("/:id", authentication, deleteProduct)
router.post("/search-product", authentication, searchProduct)
export default router;
