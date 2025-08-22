import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema()
export class Session {
  @Prop({required: true})
  name: string;

  @Prop({required: true})
  id: number;
  
  @Prop({required: true})
  email: string;

  @Prop({required: true})
  isAlive: boolean;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
