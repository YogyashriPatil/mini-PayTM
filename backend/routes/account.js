import { Router } from "express";
import express from "express"
import authHeader from "./../middleware/index.js";
import { Account } from "./../db.js"
import mongoose from "mongoose";

const accountRouter = express.Router();

accountRouter.get("/balance", authHeader, async (req,res) => {
    const account = await Account.findOne({
        userId : req.userId
    })

    res.json({
        balance: account.balance
    })
})
// accountRouter.post("/transfer", authHeader, async(req,res) => {
//     const {amount,to} = req.body;
//     const account = await Account.findOne({
//         userId: req.userId
//     })
//     if(account.balance < amount){
//         return res.status(400).json({
//             message: "Insuffieceint balance"
//         })
//     }
//     const toAccount = await Account.findOne({
//         userId: to
//     });
//     if(!toAccount){
//         return res.status(400).json({
//             message: "Invalid account"
//         })
//     }
//     await Account.updateOne({
//         userId: req.userId
//     }, {
//         $inc:{
//             balance:amount
//         }
//     })
//     res.json({
//         message:"transfer successful"
//     })
// })

accountRouter.post("/transfer", authHeader, async(req,res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const {amount,to} = req.body;
    const account = await Account.findOne({
        userId: req.userId
    }).session(session);

    if( !account || account.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insuffieceint balance"
        })
    }
    const toAccount = await Account.findOne({
        userId: to
    }).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        })
    }
    await Account.updateOne({
        userId: req.userId
    }, {
        $inc:{
            balance: - amount
        }
    }).session(session);

    await Account.updateOne({
        userId: to
    }, {
        $inc:{
            balance: amount
        }
    }).session(session);

    await session.commitTransaction();
    res.json({
        message:"transfer successful"
    })
})

export default accountRouter;