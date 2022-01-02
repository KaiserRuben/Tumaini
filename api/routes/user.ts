import {Request, Response, Router} from 'express';
import UserModel, {IUser} from '../models/user'
import * as bcrypt from 'bcrypt'
import {sendPwByMail} from "../utils/mail";

const userRouter = Router()


// Getting all
userRouter.get('/', async (req: Request, res: Response) => {
    if (process.env.MODE === 'PROD') {
        res.status(200).send(
            '"In the next three years, the value of data will increase, making it even more valuable than it is today. The more efficiently you store your data, the more benefits your business will see.” ' +
            '<br /><i>― Thomas Harrer</i>"'
        )
        return
    }

    try {
        const users: Array<IUser> = await UserModel.find()
        res.status(202).json(users)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// Getting one
userRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const userData = await UserModel.findOne({_id: req.params.id})
        res.status(200).json({hasError: false, data: userData})
    } catch (err) {
        res.status(500).json({hasError: true, data: err.message})
    }
})

// Getting one by mail
userRouter.get('/email/:email', async (req: Request, res: Response) => {
    try {
        const userData = await UserModel.findOne({email: req.params.email})
        res.status(200).json({hasError: false, data: userData})
    } catch (err) {
        res.status(500).json({hasError: true, data: err.message})
    }
})

// Creating one
userRouter.post('/', async (req: Request, res: Response) => {
    try {
        const userToBeReturned = await createUser(req.body);
        res.status(201).json({hasError: false, data: userToBeReturned})
    } catch (err) {
        res.status(500).json({hasError: true, data: err.message})
    }
})


// Updating one
userRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        UserModel.updateOne({_id: req.params.id}, {...req.body})
        res.status(201).json({hasError: false})
    } catch (err) {
        res.status(500).json({hasError: true, data: err.message})
    }
})

// verify user (login)
userRouter.post('/validate', async (req: Request, res: Response) => {
    try {
        // Check for all necessary data
        if (!req.body.email) {
            throw new Error('Email must not be empty.')
        }
        if (!req.body.password) {
            throw new Error('Password must not be empty.')
        }

        // Try to find user in db.
        const user = await UserModel.findOne({email: req.body.email})
        if (user == null)
            throw new Error('Please sign up first.')

        // Validating password
        if (!(await bcrypt.compareSync(req.body.password, user.password)))
            throw new Error('Password / Email dont match.')

        res.status(200).json({hasError: false, data: user})
    } catch (err) {
        res.status(401).json({hasError: true, data: err.message})
    }
})

// elevate user
userRouter.post('/elevate/:kind', async (req: Request, res: Response) => {
    try {
        // Check for all necessary data
        if (!req.body._id) {
            throw new Error('_id must not be empty.')
        }
        if (!req.body.level) {
            throw new Error('level must not be empty.')
        }
        if (!req.params.kind) {
            throw new Error('kind must not be email od id.')
        }
        let user = null
        switch (req.params.kind) {
            case "id":
                user = await UserModel.updateOne({_id: req.body._id}, {level: req.body.level})
                break;
            case "email":
                user = await UserModel.updateOne({email: req.body._id}, {level: req.body.level})
                break;
            default:
                throw new Error('kind must not be email or id.')
        }

        res.status(200).json({hasError: false, data: user})
    } catch (err) {
        res.status(500).json({hasError: true, data: err.message})
    }
})
userRouter.post('/password/new', async (req, res) => {
    const newPassword = Math.random().toString(36).slice(-8);
    UserModel.findOneAndUpdate(
        {email: req.body.email},
        {pwdHash: bcrypt.hashSync(newPassword, 10)},
        // @ts-ignore
        (err, result) => {
            if (err)
                res.status(500).json({message: err.message})
            else {
                sendPwByMail(req.body.email, result.name, newPassword)
                res.status(202).json(result)
            }

        })
})

async function createUser(data: IUser) {
    const newUser = new UserModel(data)
    await newUser.save();
    return newUser
}

export default userRouter
