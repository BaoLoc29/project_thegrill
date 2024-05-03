import mongoose from "mongoose"

const Product = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        require: true
    },
    categoryName: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'categories'
    },
    status: {
        type: String,
        require: true
    }

}, { timestamps: true });
export default mongoose.model("products", Product)