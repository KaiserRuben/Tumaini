import {Document, model, Schema} from "mongoose"
import {IProject} from "./project";
// Schema
const DonorSchema = new Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    email: {
        required: true,
        unique: true,
        type: String
    },
    status: {
        required: true,
        type: String,
        default: "CREATED"
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'project',
        default: undefined
    }
})

export interface IDonor extends Document {
    firstName: string;
    lastName: string;
    email: string;
    status: "CREATED" | "PENDING DONATION" | "PENDING CONFIRMATION" | "DONE";
    project: IProject | undefined;
}


// Default export
export default model<IDonor>('Donor', DonorSchema);