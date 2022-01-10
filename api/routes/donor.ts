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

donorRouter.get('/', (req, res) => {
    Donor.find()
        .then((a) => {
            if (!a)
                throw Error("No donors found.")
            res.status(200).json(a)
        })
        .catch(err => res.status(500).json({hasError: true, error: err}))
})

donorRouter.post('/', (req, res) => {
    (new Donor(req.body)).save()
        .then((a) => {
            if (!a)
                throw Error("There was a problem, but the data may be saved.")
            sendNewDonorMail(req.body)
            res.status(200).send()
        })
        .catch(err => res.status(500).json({hasError: true, error: err}))
})

donorRouter.delete('/:id', (req, res) => {
    Donor.deleteOne({_id: req.params.id})
        .then(() => {
            res.status(200).send({hasError: false, message: "deleted"})
        })
        .catch(err => res.status(500).json({hasError: true, error: err}))
})

donorRouter.patch('/status/increase', async (req, res) => {
    try {
        const donor = await Donor.findById(req.body._id)
        let newStatus: "CREATED" | "PENDING DONATION" | "PENDING CONFIRMATION" | "DONE"
        if (!donor)
            throw new Error("Donor not found")
        switch (donor.status) {
            case "CREATED":
                newStatus = "PENDING DONATION"
                break
            case "PENDING DONATION":
                newStatus = "PENDING CONFIRMATION"
                break
            case "PENDING CONFIRMATION":
                newStatus = "DONE"
                break
            case "DONE":
                newStatus = "DONE"
                break
            default:
                newStatus = "PENDING DONATION"
        }
        await Donor.updateOne({_id: donor._id}, {status: newStatus})
        res.status(200).send("increased")

    } catch (err) {
        res.status(500).json({hasError: true, error: err})
    }

})
export default donorRouter
