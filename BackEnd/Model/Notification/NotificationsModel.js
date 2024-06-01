import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({

    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    from: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
            },
            userId: {
                type: String,
                required: true,
            },
        }),
        required: true,
    },
    to: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
            },
            userId: {
                type: String,
                required: true,
            },
        }),
        required: true,
    },
    notification_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "notificationtype",
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "classes",
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true
    }
}, {
    timestamps: true
})

const Notification = mongoose.model("notification", NotificationSchema);

export default Notification;