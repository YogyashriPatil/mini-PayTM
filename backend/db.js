import mongoose, { model } from "mongoose";
import z from "zod"
mongoose.connect(process.env.MONGODB_URL)
const userSchema = mongoose.Schema({
    userName: {
        type : z.string(),
        require: true,
        unique: true,
    },
    firstName: {
        type : z.string(),
        require: true,
        unique: true,
    },
    lastName: {
        type : z.string(),
        require: true,
        unique: true,
    },
    password:{
        type:z.string(),
        require: true
    },
    
})

const User = mongoose.model("user", userSchema)
module.exports = {
    User
}