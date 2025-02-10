import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class TimeMiddleWare implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        const date = new Date().toLocaleString('lp-BO',{
            timeZone:'America/La_Paz'
        });
        res.setHeader('Date', date);
        next();
    }
}