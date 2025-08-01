import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Board extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  users: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'List' }] })
  lists: Types.ObjectId[];

  @Prop({ required: false })
  description: string;

  @Prop({ type: Number, default: 0 })
  total_task: number;

  @Prop({ type: String, default: "ongoing", enum: ["ongoing", "completed", "archived"] })
  status: string;

  @Prop({ type: String, default: "Public" })
  visibility: string;

  @Prop({ type: Number, default: 1, enum: [0, 1] })
  is_ative: number;

  @Prop({ type: Number, default: 0, enum: [0, 1] })
  is_deleted: number;

  @Prop()
  created_at?: Date;

  @Prop()
  updated_at?: Date;
}

export const BoardSchema = SchemaFactory.createForClass(Board); 