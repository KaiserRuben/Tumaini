import {Request, Response, Router} from 'express';
import Text from '../models/text'

const textRouter = Router()

// Getting functions
textRouter.get('/', async (req: Request, res: Response) => {
    try {
        const text = await Text.find().sort('created')
        res.status(200).json(text)
    } catch (err) {
        res.status(500).json({message: err.message, hasError: true})
    }
})

textRouter.get('/id/:id', async (req: Request, res: Response) => {
    try {
        const text = await Text.findById(req.params.id)
        res.status(200).json(text)
    } catch (err) {
        res.status(500).json({message: err.message, hasError: true})
    }
})


textRouter.get('/view/:view', async (req: Request, res: Response) => {
    try {
        const cacheText = await Text.find({page: req.params.view}).sort('created')
        res.status(200).json(cacheText)
    } catch
        (err) {
        res.status(500).json({message: err.message, hasError: true})
    }
})

// Creating one
textRouter.post('/', async (req: Request, res: Response) => {
    const text = new Text(req.body)
    try {
        await text.save()
        res.status(201).json({message: 'created Text'})
        console.log("New Text generated")
    } catch (err) {
        res.status(500).json({message: err.message, hasError: true})
    }
})
// Creating multiple
textRouter.post('/multiple', async (req: Request, res: Response) => {
    try {
        await Text.insertMany(req.body)
        console.log("Data inserted")  // Success
        res.status(201).send("Success")
    } catch (error) {
        console.log(error)      // Failure
        res.status(500).send({message: error.message, hasError: true})
    }
})

// Updating
textRouter.patch('/', async (req: Request, res: Response) => {
    let query: any = null
    switch (req.body.language) {
        case "description":
            query = Text.updateOne({_id: req.body._id}, {description: req.body.text});
            break;
        case "EN":
            query = Text.updateOne({_id: req.body._id}, {EN: req.body.text});
            break;
        case "NL":
            query = Text.updateOne({_id: req.body._id}, {NL: req.body.text});
            break;
        case "DE":
            query = Text.updateOne({_id: req.body._id}, {DE: req.body.text});
            break;
    }
    if (query) {
        try {
            await query.exec()
            console.log(`${req.body._id} updated. (element: ${req.body.language}, text: ${req.body.text})`)  // Success
            res.status(202).json({hasError: false})
        } catch (error) {
            console.log(error)      // Failure
            res.status(500).json({hasError: true, error: error})
        }
    }
})

// Deleting One
textRouter.delete('/id/:id', async (req: Request, res: Response) => {
    console.log("Deleting number " + req.params.id + "...")
    try {
        await Text.deleteOne({_id: req.params.id})
        res.json({message: 'Deleted Object'})
    } catch (err) {
        res.status(500).json({message: err.message, hasError: true})
    }
})

export default textRouter
