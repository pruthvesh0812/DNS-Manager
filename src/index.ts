import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
const app = express()
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import AWS from 'aws-sdk'
import allRoutes from './routers/dns'

dotenv.config()

app.use(cors({
    origin: "*",
    credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

app.get("/", (req, res) => {
    console.log(" in get route")
    res.json({ message: "hello" })
})

app.use("/api", allRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("server listening on port ", PORT)
})

try {
    mongoose.connect(process.env.DATABASE_LINK, { dbName: 'Domain-Record-db' })
        .then((res) => {
            console.log("db connected")
        })
        .catch(err => {
            console.log(err, "error")
        })
}
catch (err) {
    console.log(err)
}



