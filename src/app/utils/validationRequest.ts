import { NextFunction, Request, Response } from "express"
import { ZodObject } from "zod"

export const validateRequest = (zodSchema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    

        let data = req.body?.data ?? req.body; ;
        


       


    try {



        if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (e) {
          return res.status(400).json({ error: "Invalid JSON in form-data" });
            }
        }





        console.log(`before zod validation`, data)
        req.body = await zodSchema.parseAsync(data);
        console.log(`after zod validation`, data)
      
        next()
    } catch (error) {
        next(error)
    }
}