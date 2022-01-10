import {Request, Response, Router} from 'express';
import mongoose from "mongoose";
import Section from "../models/section";
import Article from "../models/article";

const articleRouter = Router()

// Getting functions

// Get all content
articleRouter.get('/article', (req, res) => {
    Article.find().populate('content')
        .then((a) => res.status(200).json(a))
        .catch(err => res.status(500).json({hasError: true, error: err}))
})
articleRouter.get('/article/material/:material', (req, res) => {
    if (["REPORT", "PROJECT"].includes(req.params.material)) {
        Article.find({material: <"REPORT" | "PROJECT">req.params.material}).populate('content')
            .then((a) => res.status(200).json(a))
            .catch(err => res.status(500).json({hasError: true, error: err}))
    } else
        res.status(404).json({hasError: true, error: "Wrong Material"})
})
articleRouter.get('/article/material/:material/published', (req, res) => {
    if (["REPORT", "PROJECT"].includes(req.params.material)) {
        Article.find({material: <"REPORT" | "PROJECT">req.params.material, published: true}).populate('content')
            .then((a) => res.status(200).json(a))
            .catch(err => res.status(500).json({hasError: true, error: err}))
    } else
        res.status(404).json({hasError: true, error: "Wrong Material"})
})
// Get all published content
articleRouter.get('/article/published', (req, res) => {
    Article.find({published: true}).populate('content')
        .then((a) => res.status(200).json(a))
        .catch(err => res.status(500).json({hasError: true, error: err}))
})

//Get content by ID
articleRouter.get('/article/id/:id', (req, res) => {
    Article.findById(req.params.id).populate('content')
        .then((a) => res.status(200).json(a))
        .catch(err => res.status(500).json({hasError: true, error: err}))
})

//Get article by ID
articleRouter.get('/article/:name', (req, res) => {
    Article.findOne({title: req.params.name, published: true}).populate('content')
        .then((a) => res.status(200).json(a))
        .catch(err => res.status(500).json({hasError: true, error: err}))
})

// Create article
articleRouter.post('/article/new', (req, res) => {
    (new Article(req.body)).save()
        .then((a) => res.status(200).json(a))
        .catch(err => res.status(500).json({hasError: true, error: err}))
})

// publish/unpublish article
articleRouter.patch('/publish/', (req, res) => {
    Article.updateOne({_id: req.body.id}, {published: req.body.published})
        .then((a) => res.status(200).json(a))
        .catch(err => res.status(500).json({hasError: true, error: err}))
})


function executeQuery<ResBody, Locals, P, ReqBody, ReqQuery>(query: mongoose.Query<any, any>, res: Response<ResBody, Locals>, req: Request<P, ResBody, ReqBody, ReqQuery, Locals>) {
    query.exec(function (err: any, doc: any) {
        if (err) {
            // @ts-ignore
            res.status(500).json({message: `Could not change ${req.params.part} to ${req.body.toChange}.`, error: err})
        } else {
            // @ts-ignore
            res.status(202).json({"Success": doc})
        }
    });
}

articleRouter.patch('/article/:id/:part', (req, res) => {
    let query = null
    switch (req.params.part) {
        case "image":
            query = Article.updateOne({_id: req.params.id}, {image: req.body.toChange})
            break;
        case "title":
            query = Article.updateOne({_id: req.params.id}, {title: req.body.toChange})
            break;
        case "subheader":
            query = Article.updateOne({_id: req.params.id}, {subheader: req.body.toChange})
            break;
        case "tags":
            query = Article.updateOne({_id: req.params.id}, {tags: req.body.toChange})
            break;
        case "mainPoints":
            query = Article.updateOne({_id: req.params.id}, {mainPoints: req.body.toChange})
            break;

    }
    if (query) {
        executeQuery(query, res, req);
    } else
        res.status(400).send()
})

articleRouter.delete('/article/:id', async (req, res) => {
    try {
        let article = await Article.findById(req.params.id)
        if (!article)
            throw new ReferenceError('Article not found')

        for (let section of article.content) {
            await deleteSection(section._id)
        }

        await Article.deleteOne({_id: req.params.id})
        res.status(200).json({hasError: false})
    } catch (err) {
        res.status(500).json({hasError: true, error: err})
    }
})

// Create sections
articleRouter.post('/section/new', async (req, res) => {
    try {
        const section = await (new Section(req.body.section))
        await section.save()
        await Article.updateOne(
            {_id: req.body.article},
            {$push: {content: section}}
        )
        res.status(200).json({hasError: false, section: section})
    } catch (err) {
        res.status(500).json({hasError: true, error: err})
    }
})

articleRouter.patch('/section/:id/:part', (req, res) => {
    let query = null
    switch (req.params.part) {
        case "image":
            query = Section.updateOne({_id: req.params.id}, {image: req.body.toChange})
            break;
        case "title":
            query = Section.updateOne({_id: req.params.id}, {title: req.body.toChange})
            break;
        case "text":
            query = Section.updateOne({_id: req.params.id}, {text: req.body.toChange})
            break;
        case "nr":
            query = Section.updateOne({_id: req.params.id}, {nr: req.body.toChange})
            break;
        case "imageDescription":
            query = Section.updateOne({_id: req.params.id}, {imageDescription: req.body.toChange})
            break;
    }
    if (query) {
        executeQuery(query, res, req);
    } else
        res.status(400).send()
})

articleRouter.delete('/section/:id', async (req, res) => {
    try {
        await deleteSection(req.params.id)
        await Article.updateMany({$pullAll: {content: [req.params.id]}})
        res.status(200).json({hasError: false})
    } catch (err) {
        res.status(500).json({hasError: true, error: err})
    }
})

async function deleteSection(id: string) {
    return Section.deleteOne({_id: id});
}

export default articleRouter
