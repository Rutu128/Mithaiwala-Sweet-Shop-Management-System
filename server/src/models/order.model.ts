import mongoose,{Schema} from "mongoose";


const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"]
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

const Order = mongoose.model("Order", orderSchema);