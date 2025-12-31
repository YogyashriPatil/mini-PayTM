import { Router } from "express";
import express from "express"
import authHeader from "../middleware";
import { Account } from "./../db"

const accountRouter = express.Router();

accountRouter.get("/balance", authHeader, async (req,res) => {
    const account = await Account.findOne({
        userId : req.userId
    })

    res.json({
        balance: account.balance
    })
})
accountRouter.post("/transfer", authHeader, async(req,res) => {
    const {amount,to} = req.body;
    const account = await Account.findOne({
        userId: req.userId
    })
    if(account.balance < amount){
        return res.status(400).json({
            message: "Insuffieceint balance"
        })
    }
    const toAccount = await Account.findOne({
        userId: to
    });
    if(!toAccount){
        return res.status(400).json({
            message: "Invalid account"
        })
    }
    await Account.updateOne({
        userId: req.userId
    }, {
        $inc:{
            balance:amount
        }
    })
    res.json({
        message:"transfer successful"
    })
})

module.exports = accountRouter