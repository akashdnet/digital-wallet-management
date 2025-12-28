import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import expressSession from "express-session";
import passport from "passport";
import { envList } from "./app/config/envList";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";

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



// multiple cors
app.use(cors({
    origin: [envList.FRONT_END_SITE, "https://nextjs-digital-wallet.vercel.app"],
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