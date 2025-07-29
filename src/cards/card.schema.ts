import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Card extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'List', required: true })
  list: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  assignedUsers: Types.ObjectId[];

  @Prop({ type: [String] })
  labels: string[];

  @Prop({ required: true })
  position: number;
}

export const CardSchema = SchemaFactory.createForClass(Card); 