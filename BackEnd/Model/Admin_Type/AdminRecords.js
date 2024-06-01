import mongoose from "mongoose";

const adminRecordSchema = new mongoose.Schema(
    {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        number: {
            type: String,
           
            required: true,
        },
        company_name: {
            
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        boss_id: {
            type: String,
            required: true
        },
        admin_type_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref :"admintype",
            required: true
        },
        pin : {
            type : String,
            required :true
        }
    },
    { timestamps: true }
);

const AdminRecord = mongoose.model("adminRecord", adminRecordSchema);

export default AdminRecord;
