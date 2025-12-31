import express from "express"
import { Account, User } from "./../db.js"
import zod from "zod"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import authHeader from "./../middleware/index.js"
const userRouter = express.Router();

const JWT_SECRET ="abc"

const signupSchema = zod.object({
    username: zod.string(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string(),
})
const updateSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()

})
userRouter.put("/", authHeader, async(req,res) => {
    const { success } = updateSchema.safeParse(req.body)
    if(!success){
        res.status(411).json({
            message:"Error while updating information"
        })
    }
    await User.updateOne(req.body, {
        id: req.userId
    })
    res.json({
        message:"Updated successfully"
    })
})
userRouter.get("/bulk", async(req,res) => {
    const filter = req.query.filter || ""
    const users = await User.find({
        $ar:[{
            firstName:{
                "$regex":filter
            },
            lastName:{
                "$regex":filter
            }
        }]
    })
    res.json({
        user: users.map(user => ({
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            _id:  user._id
        }))
    })
})
userRouter.post("/signin", authHeader, async (req,res) => {
    const username= req.body.username;
    const password = req.body.password;
    
    const user =await UserModel.findOne({
        userName: username
    })
    if(!user) {
        return res.status(403).json({
            message : "User does not exist in our db"
        })
    }
    const passwordMatch = bcrypt.compare(password, express.response.password);
    
    if(passwordMatch) {
        const token = jwt.sign({
                id: user._id.toString
        },JWT_SECRET)
        res.json({
            token: token
        })
    }
    else 
    {
        res.status(403).json({
            message: "User not found"
        })
    }

})
userRouter.post("/signup", async(req,res) => {
    const {username, firstname, lastname, password} = req.body;
    // const {sucess} = signupSchema.safeParse(req.body)
    // if(!sucess){
    //     return res.json({
    //         message:"Email already taken / incorrect inputs"           
    //     })

    // }
    const user = await User.findOne({
        userName: username
    })
    if(user) {
        return res.status(403).json({
            message : "User already exist in our db try to sign up "
        })
    }
    const dbUser = await User.create({
        userName: username,
        firstName: firstname,
        lastName: lastname,
        password: password
    })
    const userId = dbUser._id;
    await Account.create({
        userId,
        balance : 1+Math.random() * 1000
    })
    const token = jwt.sign({
        userId: dbUser._id
    },JWT_SECRET)
    res.json({
        message:"user created suceesfully..",
        token:token
    })
})

export default userRouter;