import mongoose from "mongoose";

const getCategoryName = async (req, res, next) => {
    try {
        const category = await mongoose.model('categories').findById(req.body.categoryId);
        if (category) {
            req.body.categoryName = category.name;
        }
        next();
    } catch (error) {
        next(error);
    }
};

export default getCategoryName;
