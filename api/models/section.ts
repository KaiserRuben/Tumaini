import {Document, model, Schema} from "mongoose";

const sectionSchema = new Schema({
    image: {
        type: String
    },
    imageDescription: {
        type: String,
        default: ""
    },
    title: {
        type: String
    },
    text: {
        type: String
    },
    nr: {
        type: Number
    },
    created: {
        type: Date,
        "default": Date.now
    }
})

export interface ISection extends Document{
    image?: string;
    imageDescription: string;
    title: string;
    text: string;
    nr: number;
    created: Date;
}


// Default export
export default model<ISection>('Section', sectionSchema);

