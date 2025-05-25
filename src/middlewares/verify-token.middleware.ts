import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Request, Response, NextFunction } from 'express';
import { Repository } from 'typeorm'
import { Users } from '../users/entities/user.entity';
import {verify} from 'jsonwebtoken';

import 'dotenv/config'

@Injectable()
export class BearerTokenVerify implements NestMiddleware{
  constructor(
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const bearer: string = req.headers.authorization;
    if(!bearer){
      return res.status(401).json('Usuario No Autorizado');
    }
    const [ ,token] = bearer.split(" ");
    if(!token){
      return res.status(401).json('Usuario No Autorizado');
    }
    try {
      const decoded = verify(token, process.env.JWT_KEY);
      if(typeof decoded === 'object' && decoded.id){
        req.user = await this.usersRepository.findOne(
          { where: {id: decoded.id} }
        )}
    }catch(err){
      return res.status(401).json('Usuario No Autorizado');
    }
    next();
  }
}