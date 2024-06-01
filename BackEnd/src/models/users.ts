import { Schema,Types } from "mongoose";

// Used to restructure the users schemas 
// Will be implemented later ...

const UserFields ={
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    school_id: {
        type: Types.ObjectId,
        ref: "schools",
    },
    pin: {
        type: String,
        unique: true,
    },
}
