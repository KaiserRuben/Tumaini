import { model, Schema } from "mongoose";
const articleSchema = new Schema({
    published: {
        type: Boolean,
        default: false
    },
    material: {
        type: String,
        default: 'REPORT'
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
            ref: 'Section'
        }],
    created: {
        type: Date,
        "default": Date.now
    }
});
// Default export
export default model('Article', articleSchema);
