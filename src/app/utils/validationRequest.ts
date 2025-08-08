import { NextFunction, Request, Response } from "express"
import { ZodObject } from "zod"

export const validateRequest = (zodSchema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    console.log(`before zod validation`, req.body)
    console.log(`                       
        
        `)
    try {
        req.body = await zodSchema.parseAsync(req.body);
        console.log(`after zod validation`, req.body)
      
        next()
    } catch (error) {
        next(error)
    }
}