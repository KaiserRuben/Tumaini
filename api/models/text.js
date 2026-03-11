import { model, Schema } from "mongoose";
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
});
// Default export
export default model('Text', TextSchema);
