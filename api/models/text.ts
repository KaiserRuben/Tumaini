import { Document, model, Schema } from "mongoose"
// Schema
const TextSchema = new Schema({
    "page": {
        "type": "String",
        "required": true
    },
    "EN": {
        "type": "String"
    },
    "NL": {
        "type": "String"
    },
    "DE": {
        "type": "String"
    },
    "description": {
        "type": "String"
    },
    "created": {
        type: Date,
        default: Date.now()
    }
})

export interface IText extends Document{
    page: string;
    EN?: string;
    DE?: string;
    NL?: string;
    description?: string;
    created: Date;
}


// Default export
export default model<IText>('Text', TextSchema);