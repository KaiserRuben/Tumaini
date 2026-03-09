import {Document, model, Schema} from "mongoose"
import {hashSync} from 'bcrypt'

const saltRounds = 10
// Schema
const UserSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        default: 0
    },
})

export interface IUser extends Document {
    name?: string;
    email: string;
    password: string;
    level?: number;
}


UserSchema.pre("save", function () {
    if (this.isModified('password')) {
        this.password = hashSync(this.password, saltRounds);
    }
});
/**
 * Query middleware for updateOne
 */
UserSchema.pre("updateOne", function () {
    const update = this.getUpdate() as any;
    if (update && update.password) {
        update.password = hashSync(update.password, saltRounds);
    }
});


// Default export
export default model<IUser>('User', UserSchema);