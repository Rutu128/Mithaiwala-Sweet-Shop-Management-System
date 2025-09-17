import mongoose,{Schema} from "mongoose";


const orderItemsSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    sweetId: {
        type: Schema.Types.ObjectId,
        ref: "Sweet",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
}, { timestamps: true });