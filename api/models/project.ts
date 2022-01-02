import {Document, model, Schema} from "mongoose"
// Schema
const ProjectSchema = new Schema({})

export interface IProject extends Document {
}


// Default export
export default model<IProject>('Project', ProjectSchema);