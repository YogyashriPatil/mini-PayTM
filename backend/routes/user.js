import express from "express"
import { User } from "./../db"

const userRouter = express.Router();

userRouter.get("/user", (req,res) => {

})
userRouter.post("/signin", (req,res) => {
    const username= req.body.username;
    const password = req.body.password;


})
userRouter.post("/signup", async(req,res) => {
    const {username, firstname, lastname, password} = req.body;

    const user = await User.create({
        username: username,
        firstname: firstname,
        lastname: lastname,
        password: password
    })
})

module.exports = userRouter;