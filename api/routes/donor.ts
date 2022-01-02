import {Router} from 'express';
import Donor from "../models/donor";

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
export default donorRouter
