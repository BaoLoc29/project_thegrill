import mongoose from "mongoose"

const Category = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },

}, { timestamps: true });
export default mongoose.model("categories", Category)