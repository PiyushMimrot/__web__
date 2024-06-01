import { Express } from "express";
import Authorization from "../../src/auth/Authorization.js";
import NotificationViewHistory from "../../Model/Notification/NotofiyViewHistory.js";


const NotificationHistoryRouter = express.Router();


NotificationHistoryRouter.get(
    "notificationhistory",
    Authorization(["Admin"]),

    async(req,res) =>{

        try {
            const history = await NotificationViewHistory.find();
            if(!history){
                res.status(400).json({error :"No history found"});
            }
            res.json(history);
    
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
       
    }
    )

    
NotificationHistoryRouter.get(
    "notificationhistory/:id",
    Authorization(["Admin"]),

    async(req,res) =>{

        try {

            const history = await NotificationViewHistory.findById (req.params.id);
            if(!history){
                res.status(400).json({error :"No history found"});
            }
            res.json(history);
    
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
       
    }
    )

        
NotificationHistoryRouter.delete(
    "notificationhistory/:id",
    Authorization(["Admin"]),

    async(req,res) =>{

        try {

            const history = await NotificationViewHistory.findByIdAndDelete(req.params.id);
            if(!history){
                res.status(400).json({error :"No history found"});
            }
            res.json({message :"notification history deleted"});
    
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
       
    }
    )


    export default NotificationHistoryRouter;