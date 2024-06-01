import mongoose from "mongoose";

const schoolPaymentSchema = new mongoose.Schema(
    {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        school_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "schools",
            required: true,
        },
        account_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "adminRecord",
            required: true
        },
        amount: {
            type: String,
            required: true
        },
        amount_received: {
            type: String,
            required: true
        }
        ,
        month: {
            type: String,
            required: true
        },
        approvalStatus: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const SchoolPayment = mongoose.model("schoolPayment", schoolPaymentSchema);

export default SchoolPayment;
