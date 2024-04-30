import Category from "../models/category.js"
import toSlug from '../utils/toSlug.js'
import handleUpload from './../utils/cloundinary.js';

export const getPagingCategory = async (req, res) => {
    const pageSize = req.query.pageSize
    const pageIndex = req.query.pageIndex
    const categories = await Category
        .find()
        .skip(pageSize * pageIndex - pageSize)
        .limit(pageSize).sort({ createdAt: "desc" })
    const countCategories = await Category.countDocuments()
    const totalPage = Math.ceil(countCategories / pageSize)

    return res.status(200).json({
        categories,
        totalPage,
        count: countCategories
    })
}
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await handleUpload(dataURI);
        const newCategory = await Category.create({
            name: name,
            image: result.url,
            slug: toSlug(name)
        });

        return res.status(201).json({
            message: "Create category successfully!",
            data: newCategory

        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
export const editCategory = async (req, res) => {
    try {
        const id = req.params.id
        const { name } = req.body;
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await handleUpload(dataURI);
        const newCategory = await Category.findByIdAndUpdate(id, {
            name: name,
            image: result.url,
            slug: toSlug(name)
        }, { new: true })

        return res.status(201).json({
            success: 'Sửa thành công',
            category: newCategory
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
export const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id
        const category = await Category.deleteOne({ _id: id })
        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy danh mục này!" })
        }
        return res.status(200).json({ message: "Xóa danh mục thành công!" })
    } catch (error) {
        return res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng kiểm tra lại server" })
    }
}
export const searchCategory = async (req, res) => {
    try {
        const { keyword } = req.body;

        if (!keyword) {
            const noKeyword = await Category.find()
            return res.status(200).json({ noKeyword });
        }

        const filteredCategories = await Category.find({ slug: { $regex: keyword, $options: 'i' } });

        if (filteredCategories.length === 0) {
            return res.status(400).json({ message: "Không tìm thấy người dùng" })
        }
        return res.status(200).json({ categories: filteredCategories });
    } catch (error) {
        console.error("Error in searchCategory:", error);
        return res.status(500).json({ error: "Lỗi không xác định, vui lòng thử lại sau." });
    }
};
export const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId)
        return res.status(200).json({ category })
    } catch (error) {
        return res.status(500).json({ message: "Lỗi hệ thống, vui lòng liên hệ admin!" })
    }
}
