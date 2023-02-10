import {Router} from 'express';
import fs from "fs";

const fileRouter = Router()
const fileLocation = "/var/www/files/tumaini/"
// Getting all
fileRouter.get('/', async (req, res) => {
    fs.readdir(fileLocation, function (err, items) {
        res.json(items)
    });
})

fileRouter.post('/', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    //console.log(req.files)
    for (let file in req.files) {
        const filename = file
            .replace(/\s+/g, '')
            .replace("(", '')
            .replace(")", '')
        // @ts-ignore
        req.files[file].mv(fileLocation + filename, function (err) {
            console.log(err)
            if (err)
                return res.status(500).send(err);
        });
    }
    return res.status(201).send('File uploaded!');
});

fileRouter.delete('/:name', (req, res) => {
    fs.unlink(fileLocation + req.params.name, (err) => {
        if (err) {
            console.error(err)
            return res.status(500).send(err);
        }
        res.status(200).send('File deleted!');
    })
})

export default fileRouter
