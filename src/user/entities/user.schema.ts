import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({required: true, enum: ["admin", "client", "company"]})
  role: string;

  @Prop({ required: true, unique: true, type: String })
  phoneNumber: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: String })
  otp?: string;

  @Prop({ type: Date })
  otpExpiry?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);