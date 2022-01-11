require('dotenv').config()
import express from 'express'
import cors from 'cors'
import compression from 'compression'
import helmet from "helmet";
import basicAuth from "express-basic-auth";
import fileUpload from 'express-fileupload'

import textRouter from './routes/text'
import userRouter from './routes/user'
import articleRouter from "./routes/articles"
import fileRouter from "./routes/files"
import donorRouter from "./routes/donor"
import mailRouter from "./routes/mail"

import {connectDataBase} from './utils/db'

const app = express()

app.use(loggerMiddleware)
app.use(cors());
app.use(compression()); //Compress all routes
app.use(helmet()); //Protects against known vulnerabilities
app.use(express.json());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: 'tmp/'
}));
// Basic Auth
let pw = process.env.API_PW
let pwAdmin = process.env.API_PW_ADMIN
if (!pw || !pwAdmin) {
    console.error('Auth PW not found!')
    process.exit(-1)
}
app.use(basicAuth({
    users: {
        'main': pw,
        'adminWebsite': pwAdmin,
    }
}))


app.get('/', (req, res) => {
    if (process.env.MODE === 'PROD') {
        res.status(200).send('The Tumaini API is up and running in production mode!');
    } else
        res.status(200).send('The Tumaini API is up and running in <b>development</b> mode!');
});
app.use('/users', userRouter);
app.use('/text', textRouter);
app.use('/content', articleRouter);
app.use('/files', fileRouter);
app.use('/donor', donorRouter);
app.use('/mail', mailRouter);

start()
    .then((port) => {
        console.log(`API is listening on ${port}`)
    })
    .catch(err => {
        console.error(err);
        process.exit(-1)
    })

async function start(): Promise<number> {
    const dbSuccess = await connectDataBase(process.env.DB_URL)
    if (dbSuccess) {
        const port = Number(process.env.PORT);
        if (port) {
            app.listen(port)
            return port
        } else {
            throw new Error("No port defined.")
        }
    } else {
        throw new Error("Database Problems")
    }
}

function loggerMiddleware(request: express.Request, response: express.Response, next: express.NextFunction) {
    if (process.env.MODE === 'DEV')
        console.log(`${(new Date()).toISOString()}: ${request.method} ${request.path}`);
    next();
}