import {Router} from 'express';
import {sendStandardMail} from "../utils/mail";

const donorRouter = Router()

donorRouter.post('/', (req, res) => {
    const data = req.body
    sendStandardMail(data.toMail, data.subject, data.message, data.fromMail)
    res.status(200).send('done')
})
export default donorRouter
