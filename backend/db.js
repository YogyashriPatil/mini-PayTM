import mongoose, { model } from "mongoose";
import z, { float32 } from "zod"
import { configDotenv } from "dotenv";
configDotenv();
const url = process.env.MONGODB_URL
mongoose.connect(process.env.MONGODB_URL)
const userSchema = mongoose.Schema({
    userName: {
        type : z.string(),
        required: true,
        unique: true,
    },
    firstName: {
        type : z.string(),
        required: true,
        unique: true,
    },
    lastName: {
        type : z.string(),
        required: true,
        unique: true,
    },
    password:{
        type:z.string(),
        required: true
    },
    
})
const accountSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    balance:{
        type: Number,
        required: true
    }
})
export const Account = mongoose.model("Account", accountSchema)
export const User = mongoose.model("User", userSchema)
// module.exports = {
//     User,
//     Account
// }