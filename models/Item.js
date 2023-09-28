import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String, 
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
        required: true
    },
    instagramUrl: {
        type: String,
        required: true
    },
    categories: {
        type: String,
        required: true,
    },
    label: {
        type: String,
    },
    images: [
        {
            data: Buffer,
            contentType: String
        }
    ]
}, {
    timestamps: true,
});

export default mongoose.model('Item', ItemSchema);
