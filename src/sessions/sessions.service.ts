import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './session.schema'

@Injectable()
export class SessionsService {
  constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>){}

  async create( name: string, id: number, email: string): Promise<Session> {
    const newSession = new this.sessionModel({name, id, email})
    return newSession.save();
  }

  // findAll() {
  //   return `This action returns all sessions`;
  // }
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
