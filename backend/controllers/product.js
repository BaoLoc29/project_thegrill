import Product from "../models/product.js";
import toSlug from '../utils/toSlug.js'
import handleUpload from './../utils/cloundinary.js';

// Hàm định dạng ngày tạo
const formatCreatedAt = (date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export const createProduct = async (req, res) => {
    try {
        const { name, price, description, categoryId, categoryName, status } = req.body;

        // Thêm categoryName vào req.body từ middleware getCategoryName
        req.body.categoryName = categoryName;

        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await handleUpload(dataURI);

        const newProduct = await Product.create({
            name: name,
            image: result.url,
            price: price,
            description: description,
            slug: toSlug(name),
            categoryId: categoryId,
            categoryName: categoryName,
            status: status
        });

        const formattedDate = formatCreatedAt(newProduct.createdAt);

        res.status(201).json({
            message: "Product created successfully",
            data: {
                ...newProduct._doc,
                createdAt: formattedDate
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPagingProduct = async (req, res) => {
    const pageSize = req.query.pageSize;
    const pageIndex = req.query.pageIndex;

    try {
        const products = await Product
            .find()
            .skip(pageSize * pageIndex - pageSize)
            .limit(pageSize)
            .sort({ createdAt: "desc" });

        const countProducts = await Product.countDocuments();
        const totalPage = Math.ceil(countProducts / pageSize);

        const formattedProducts = products.map(product => ({
            ...product._doc,
            createdAt: formatCreatedAt(product.createdAt)
        }));

        res.status(200).json({
            products: formattedProducts,
            totalPage,
            count: countProducts
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editProduct = async (req, res) => {
    try {
        const id = req.params.id
        const { name, price, description, categoryId, categoryName, status } = req.body;
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
            price: price,
            description: description,
            categoryId: categoryId,
            categoryName: categoryName,
            status: status,
            // Nếu có file mới, thì cập nhật image
            ...(imageUrl && { image: imageUrl }),
            slug: toSlug(name)
        };

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        const formattedDate = formatCreatedAt(updatedProduct.createdAt);

        return res.status(200).json({
            success: 'Sửa thành công',
            product: {
                ...updatedProduct._doc,
                createdAt: formattedDate
            }
        });
    } catch (error) {
        return res.status(500).json({ error })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id
        const product = await Product.deleteOne({ _id: id });
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm này!" })
        }

        return res.status(200).json({
            message: "Xóa sản phẩm thành công!"
        });
    } catch (error) {
        return res.status(500).json({ error: message.server_error });
    }
}

export const searchProduct = async (req, res) => {
    try {
        const { keyword } = req.body
        if (!keyword) {
            const noKeyword = await Product.find()
            return res.status(200).json({ noKeyword })
        }
        const filterProducts = await Product.find({ slug: { $regex: keyword, $options: 'i' } });
        if (filterProducts.length === 0) {
            return res.status(400).json({ message: "Không tìm thấy sản phẩm" })
        }
        const formattedProducts = filterProducts.map(product => ({
            ...product._doc,
            createdAt: formatCreatedAt(product.createdAt)
        }))

        return res.status(200).json({ products: formattedProducts })
    } catch (error) {
        return res.status(500).json({ error: message.server_error });
    }
}

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" })
        }
        const formattedDate = formatCreatedAt(product.createdAt);
        return res.status(200).json({
            product: {
                ...product._doc,
                createdAt: formattedDate,
            }
        })
    } catch (error) {
        return res.status(500).json({ error })
    }
}

export const getAllProduct = async (req, res) => {
    try {

        const result = await Product.find()
        const countProduct = await Product.countDocuments()
        return res.status(200).json({ result, countProduct })
    } catch (error) {
        return res.status(500).json({ error })
    }
}