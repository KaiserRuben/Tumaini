import { Document, model, Schema } from "mongoose"
import {ISection} from "./section";

const articleSchema = new Schema({
    published: {
        type: Boolean,
        default: false
    },
    image: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    subheader: {
        type: String
    },
    tags: {
        type: [String]
    },
    mainPoints: {
        type: [String]
    },
    content: [{
        type: Schema.Types.ObjectId,
        ref: 'section',
        default: {}
    }],
    created: {
        type: Date,
        "default": Date.now
    }
})

export interface IArticle extends Document{
    published: boolean;
    image?: string;
    title: string;
    subheader?: string;
    tags?: [string];
    mainPoints?: [string];
    content?: [ISection];
    created: Date;
}


// Default export
export default model<IArticle>('Article', articleSchema);
