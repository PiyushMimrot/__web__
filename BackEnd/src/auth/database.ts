import mongoose from "mongoose";
import { formattedHtmlFromError, sendEmail } from "../libs/email.js";
export  async function connectToDB() {
    try {
       if(process.env.MONGODB_URL) {
            const dbName = process.env.NODE_ENV=="development"||process.env.NODE_ENV=="dev_deployment"?'SchoolMangmentSystem':'sms'
            let connection = await mongoose.connect(process.env.MONGODB_URL,{dbName});
            // let connection = await mongoose.connect(process.env.MONGODB_URL,{dbName:process.env.NODE_ENV=="development"||process.env.NODE_ENV=="dev_deployment"?'test':'sms'});
            console.log(`Connected to Database ${connection.connection.name}`)
       }
       else {
           console.log("No MONGODB_URL found")
       }
    }
    catch (error) {
        console.log("Database connection error")
        console.log(error)
        sendEmail(
            'NodeJS crash report from instil.techtok4u.in',
            `Database connection error\n${formattedHtmlFromError(error as Error)}`
            ,()=>process.exit()
            )
        
    }

}
