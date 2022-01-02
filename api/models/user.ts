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


UserSchema.pre<IUser>("save", async function (next) {
    if (this.isModified('password')) {
        this.password = hashSync(this.password, saltRounds);
    }
    next()
});
/**
 * Document middlewares
 * TS thinks for some reason, that this_update does not exist - but it does...
 */
UserSchema.pre<IUser>("updateOne", async function (next) {
    // @ts-ignore
    if (this._update.password) {
        // @ts-ignore
        this._update.password = hashSync(this._update.password, saltRounds);
    }
    next()
});


// Default export
export default model<IUser>('User', UserSchema);