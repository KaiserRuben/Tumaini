import { model, Schema } from "mongoose";
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
});
// Default export
export default model('Section', sectionSchema);
