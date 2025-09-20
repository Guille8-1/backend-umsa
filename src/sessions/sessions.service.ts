import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSessionDto, VerifySessionDto } from './dto/create-session.dto'
import { Response } from 'express'
import { Model } from 'mongoose';
import { Session, SessionDocument } from './session.schema';

@Injectable()
export class SessionsService {
  constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>){}

  async create(createSession: CreateSessionDto, res: Response): Promise<Session> {
    const newSession = new this.sessionModel({
      userName: createSession.userName.toLowerCase(),
      userLastName: createSession.userLastName.toLowerCase(),
      userId: createSession.userId,
      email: createSession.email.toLowerCase(),
    });
    res.status(201).json('all good');
    return newSession.save();
  }

  async findAll(verifySession: VerifySessionDto, res: Response) {
    const email = verifySession.email.toLowerCase();
    const verified = await this.sessionModel.findOne({ email }).exec();

    if( verified ){
      return res.status(201).json({
        message:'session alive',
        isAlive: true
      })
    } else {
      return res.status(201).json({
        message:'session dead',
        isAlive: false
      });
    }
  }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} session`;
  // }
  //
  // update(id: number) {
  //   return `This action updates a #${id} session`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} session`;
  // }
}
