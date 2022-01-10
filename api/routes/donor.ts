import {Router} from 'express';
import Donor from "../models/donor";
import {sendNewDonorMail} from "../utils/mail";

const donorRouter = Router()

donorRouter.get('/emails', (req, res) => {
    Donor.find()
        .then((a) => {
            if (!a)
                throw Error("No donors found.")
            res.status(200).json(a.map(d => d.email))
        })
        .catch(err => res.status(500).json({hasError: true, error: err}))
})
donorRouter.post('/', (req, res) => {
    (new Donor(req.body)).save()
        .then((a) => {
            if (!a)
                throw Error("There was a problem, but the data may be saved.")
            sendNewDonorMail(req.body)
            res.status(200).json()
        })
        .catch(err => res.status(500).json({hasError: true, error: err}))
})
export default donorRouter
