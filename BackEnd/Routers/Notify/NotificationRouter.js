import express from "express";
import Notification from "../../Model/Notification/NotificationsModel.js";
import Authorization from "../../src/auth/Authorization.js";
const NotificationRouter = express.Router();

NotificationRouter.post(

    "/notification",

    Authorization(["Admin"]),

    async (req, res) => {
        try {
            const notification = new Notification(req.body);
            await notification.save();
            res.status(201).json({ success: true, notification });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });

// Get all notifications
NotificationRouter.get(
    "/notification", 

    Authorization(["Admin"]),

async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a notification by ID
NotificationRouter.get(
    "/notification/:id",
    
    Authorization(["Admin"]),
     async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ error: "notification not found" });
        }
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a notification by ID
NotificationRouter.put(
    "/notification/:id", 
    
    Authorization(["Admin"]),
    async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(id, req.body, {
            new: true
        });
        if (!notification) {
            return res.status(404).json({ error: "notification not found" });
        }
        res.json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a notification by ID
NotificationRouter.delete(
    "/notification/:id",
    
    Authorization(["Admin"]),
     async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndDelete(id);
        if (!notification) {
            return res.status(404).json({error :"notification not found" });
        }
        res.json({ message: "notification deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default NotificationRouter;
