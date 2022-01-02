import mongoose from "mongoose";
import {sendStandardMail} from './mail'

export async function connectDataBase(url: string | undefined): Promise<boolean> {
    if (url) {
        try {
            await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 1000000});
            return true
        } catch (MongooseServerSelectionError) {
            console.warn("Database connection failed.", MongooseServerSelectionError)
            sendStandardMail(
                '' + process.env.MAIL_ERROR_TO_ADDRESS,
                "Error in Tumaini API",
                `An Error occured in the Tumaini API: Connecting to the Database: <br/> <br /> ${JSON.stringify(MongooseServerSelectionError)}`
            )
            return false
        }

    } else {
        console.warn('No Database URL defined in .env.')
        return false
    }
}
