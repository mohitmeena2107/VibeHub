import express from "express"
import cors from "cors"
import { serve } from "inngest/express";
import { inngest,functions } from "./inngest/index.js"
import {clerkMiddleware} from '@clerk/express'
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import storyRouter from "./routes/storyRoutes.js";
import messageRouter from "./routes/messageRoutes.js";


const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(clerkMiddleware())
app.use("/api/inngest", serve({ client: inngest, functions }))


app.use("/api/v1/user", userRouter)
app.use("/api/v1/post", postRouter)
app.use("/api/v1/story", storyRouter)
app.use("/api/v1/message", messageRouter)




export { app }