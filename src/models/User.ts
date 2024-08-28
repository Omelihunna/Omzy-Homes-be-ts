import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"

export interface IUser {
    _id: ObjectId;
    email: string;
    username: string;
    hash: string;
}

const UserSchema = new Schema <IUser> ({
    email: {
        type: String,
        required: true, 
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    hash: {
        type: String,
        required: true
    }
})

UserSchema.plugin(passportLocalMongoose);

export default model("User", UserSchema)