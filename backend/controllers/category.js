import Category from "../models/category.js"
import toSlug from '../utils/toSlug.js'
import handleUpload from './../utils/cloundinary.js';

// Hàm định dạng ngày tạo
const formatCreatedAt = (date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export const getPagingCategory = async (req, res) => {
    const pageSize = req.query.pageSize
    const pageIndex = req.query.pageIndex
    try {
        const categories = await Category
            .find()
            .skip(pageSize * pageIndex - pageSize)
            .limit(pageSize).sort({ createdAt: "desc" })
        const countCategories = await Category.countDocuments()
        const totalPage = Math.ceil(countCategories / pageSize)


        // Định dạng lại ngày tạo cho từng danh mục
        const formattedCategories = categories.map(category => ({
            ...category._doc,
            createdAt: formatCreatedAt(category.createdAt)
        }));

        return res.status(200).json({
            categories: formattedCategories,
            totalPage,
            count: countCategories
        })
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({ message: "Server Error!" });
    }

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

        const formattedDate = formatCreatedAt(newCategory.createdAt);

        return res.status(201).json({
            message: "Create category successfully!",
            data: {
                ...newCategory._doc,
                createdAt: formattedDate
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
export const editCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;

        // Kiểm tra xem có file được gửi lên không
        let imageUrl;
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const result = await handleUpload(dataURI);
            imageUrl = result.url;
        }

        // Tạo object chứa dữ liệu cần update
        const updateData = {
            name: name,
            // Nếu có file mới, thì cập nhật image
            ...(imageUrl && { image: imageUrl }),
            slug: toSlug(name)
        };

        // Cập nhật category
        const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });

        const formattedDate = formatCreatedAt(updatedCategory.createdAt);

        return res.status(201).json({
            success: 'Sửa thành công',
            category: {
                ...updatedCategory._doc,
                createdAt: formattedDate
            }
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
            return res.status(400).json({ message: "Không tìm thấy danh mục nào" })
        }

        const formattedCategories = filteredCategories.map(category => ({
            ...category._doc,
            createdAt: formatCreatedAt(category.createdAt)
        }));

        return res.status(200).json({ categories: formattedCategories });
    } catch (error) {
        console.error("Error in searchCategory:", error);
        return res.status(500).json({ error: "Lỗi không xác định, vui lòng thử lại sau." });
    }
};
export const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy danh mục" });
        }

        const formattedDate = formatCreatedAt(category.createdAt);

        return res.status(200).json({
            category: {
                ...category._doc,
                createdAt: formattedDate
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi hệ thống, vui lòng liên hệ admin!" })
    }
}
export const getAllCategory = async (req, res) => {
    try {
        const result = await Category.find();
        return res.status(200).json({ result });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}