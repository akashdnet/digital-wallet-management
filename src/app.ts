import express, { Request, Response } from "express";
import cors from "cors";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { router } from "./app/routes";
import passport from "passport";
import cookieParser from "cookie-parser";
import { envList } from "./app/config/envList";
import expressSession from "express-session";

import './app/config/passport';




const app = express()


app.use(expressSession({
    secret: envList.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.json());

app.use(cors({
  origin: envList.FRONT_END_SITE, 
  credentials: true                
}));


app.use("/api/v1", router)


// temp: check to success google auth redirect
app.get("/auth/success", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Successfully authenticated by Google 0Auth2.0 "
    })
})

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Digital Wallet Management  Backend"
    })
})



app.use(globalErrorHandler)

app.use(notFound)

export default app