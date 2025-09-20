import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema()
export class Session {
  @Prop({required: true})
  userName: string;

  @Prop({required: true})
  userLastName: string;

  @Prop({required: true})
  userId: number;

  @Prop({required: true})
  email: string;

  @Prop({required: true, default: true})
  isAlive: boolean;
}

export const SessionSchema = SchemaFactory.createForClass(Session)
