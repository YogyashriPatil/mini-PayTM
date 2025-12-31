import express from "express"
import dotenv from "dotenv"
import mainRouter from "./routes/index.js"
import jwt from "jsonwebtoken"
import cors from "cors"
dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use(cors())

app.use("/api/v1", mainRouter)
// db();

app.listen(PORT, (req,res) => {
    console.log(`Listening on ${PORT}`)
})
