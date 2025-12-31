import express from "express"
import userRouter from "./user.js"
const router = express.Router();

router.use("/user", userRouter)
router.use("/account", accountRouter)
module.exports = router;