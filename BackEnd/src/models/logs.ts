import mongoose from "mongoose";

const LoginLogoutLogs = mongoose.model("login_logout_logs", new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    time_of_event: {
        type: Date,
    },
    event:{
        type: String,
        enum: ["login","logout"],
    }
}));
export {LoginLogoutLogs};